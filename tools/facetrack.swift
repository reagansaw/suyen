// 逐帧找脸（Vision），只跟住离上一格最近的那张脸（画面里海报上也有人脸）→ 每帧脸中心 (x,y) 像素，JSON 输出
// 用法：facetrack <in.mp4> <out.json> [起始 x] [起始 y]
import Foundation; import AVFoundation; import Vision
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let track = asset.tracks(withMediaType: .video)[0]
let W = Double(track.naturalSize.width), H = Double(track.naturalSize.height)
let reader = try! AVAssetReader(asset: asset)
let ro = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(ro); reader.startReading()
var px = a.count > 3 ? Double(a[3])! : W / 2, py = a.count > 4 ? Double(a[4])! : H / 3
var xs = [Double](), ys = [Double](), miss = 0
while let sb = ro.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  let req = VNDetectFaceRectanglesRequest()
  try? VNImageRequestHandler(cvPixelBuffer: pb).perform([req])
  let faces = (req.results ?? []).map { f -> (Double, Double, Double) in
    let b = f.boundingBox; return ((b.midX) * W, (1 - b.midY) * H, b.width * W) }
  if let best = faces.min(by: { hypot($0.0 - px, $0.1 - py) < hypot($1.0 - px, $1.1 - py) }), hypot(best.0 - px, best.1 - py) < 260 || xs.isEmpty {
    px = best.0; py = best.1
  } else { miss += 1 }
  xs.append(px); ys.append(py)
}
let o: [String: [Double]] = ["x": xs, "y": ys]
try! JSONSerialization.data(withJSONObject: o).write(to: URL(fileURLWithPath: a[2]))
print("frames \(xs.count) 没找到脸 \(miss) 帧")
