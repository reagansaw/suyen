// 精准人像遮罩：macOS「主体抠图」(VNGenerateForegroundInstanceMaskRequest，跟照片 App 长按抠图同一套）
// 每帧找出所有前景物体，只留跟「人像分割」重叠多的那几个（= 人 + 衣服 + 脚 + 手上拿的东西），全分辨率边缘。
// 比 personmatte（只有人像分割、遮罩低分辨率、脚和衣角常被切掉）准。没找到主体的帧退回人像分割。
// 用法：subjectmatte <in.mp4> <out_matte.mp4>   输出同尺寸灰阶 H.264（白=人）
import Foundation; import AVFoundation; import Vision; import CoreImage; import Accelerate
let a = CommandLine.arguments
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
let asset = AVURLAsset(url: inURL)
let track = asset.tracks(withMediaType: .video)[0]
let sz = track.naturalSize; let W = Int(sz.width), H = Int(sz.height)
let reader = try! AVAssetReader(asset: asset)
let ro = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(ro); reader.startReading()
try? FileManager.default.removeItem(at: outURL)
let writer = try! AVAssetWriter(outputURL: outURL, fileType: .mp4)
let wi = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 12_000_000]])
wi.expectsMediaDataInRealTime = false
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: wi, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
writer.add(wi); writer.startWriting(); writer.startSession(atSourceTime: .zero)
let ctx = CIContext()
var n = 0, fb = 0; var t0: CMTime? = nil

// 读灰阶 / 标签缓冲的某一点（按比例对应）
func sample8(_ pb: CVPixelBuffer, _ fx: Double, _ fy: Double) -> UInt8 {
  let w = CVPixelBufferGetWidth(pb), h = CVPixelBufferGetHeight(pb), row = CVPixelBufferGetBytesPerRow(pb)
  let x = min(w - 1, max(0, Int(fx * Double(w)))), y = min(h - 1, max(0, Int(fy * Double(h))))
  return CVPixelBufferGetBaseAddress(pb)!.load(fromByteOffset: y * row + x, as: UInt8.self)
}

while let sb = ro.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  let pts = CMSampleBufferGetPresentationTimeStamp(sb); if t0 == nil { t0 = pts }
  let h = VNImageRequestHandler(cvPixelBuffer: pb)
  let person = VNGeneratePersonSegmentationRequest(); person.qualityLevel = .balanced; person.outputPixelFormat = kCVPixelFormatType_OneComponent8
  let fg = VNGenerateForegroundInstanceMaskRequest()
  try? h.perform([person, fg])
  var ci: CIImage? = nil
  if let pm = person.results?.first?.pixelBuffer, let obs = fg.results?.first {
    let im = obs.instanceMask
    CVPixelBufferLockBaseAddress(pm, .readOnly); CVPixelBufferLockBaseAddress(im, .readOnly)
    let iw = CVPixelBufferGetWidth(im), ih = CVPixelBufferGetHeight(im)
    var hit = [Int: Int](), tot = [Int: Int]()
    var y = 0
    while y < ih { var x = 0
      while x < iw {
        let lab = Int(sample8(im, (Double(x) + 0.5) / Double(iw), (Double(y) + 0.5) / Double(ih)))
        if lab > 0 { tot[lab, default: 0] += 1; if sample8(pm, (Double(x) + 0.5) / Double(iw), (Double(y) + 0.5) / Double(ih)) > 127 { hit[lab, default: 0] += 1 } }
        x += 2 }
      y += 2 }
    CVPixelBufferUnlockBaseAddress(pm, .readOnly); CVPixelBufferUnlockBaseAddress(im, .readOnly)
    // 一个物体有 ≥35% 落在人像里 → 算是她（人、衣服、手上的书）；沙发、桌子通常远低于这个
    let minOv = Double(ProcessInfo.processInfo.environment["MIN_OVERLAP"] ?? "0.35") ?? 0.35   // 坐在椅子上那支设 0.02：椅子整张留着（Reagan：椅子可以出现，比抠不干净好）
    let keep = IndexSet(tot.keys.filter { Double(hit[$0] ?? 0) / Double(tot[$0]!) >= minOv })
    if !keep.isEmpty, let m = try? obs.generateScaledMaskForImage(forInstances: keep, from: h) { ci = CIImage(cvPixelBuffer: m) }
  }
  if ci == nil, let pm = person.results?.first?.pixelBuffer { ci = CIImage(cvPixelBuffer: pm); fb += 1 }
  guard var img = ci else { continue }
  img = img.transformed(by: CGAffineTransform(scaleX: CGFloat(W) / img.extent.width, y: CGFloat(H) / img.extent.height))
  var out: CVPixelBuffer? = nil
  CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &out)
  ctx.render(img, to: out!, bounds: CGRect(x: 0, y: 0, width: W, height: H), colorSpace: CGColorSpaceCreateDeviceRGB())
  while !wi.isReadyForMoreMediaData { usleep(2000) }
  ad.append(out!, withPresentationTime: CMTimeSubtract(pts, t0!)); n += 1
  if n % 60 == 0 { print("…\(n)"); fflush(stdout) }
}
wi.markAsFinished(); let g = DispatchGroup(); g.enter(); writer.finishWriting { g.leave() }; g.wait()
print("ok \(n) frames \(W)x\(H) 退回人像分割 \(fb) 帧")
