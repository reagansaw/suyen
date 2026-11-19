import AVFoundation
import Vision
// 用法：faces <video> <每几格测一次>  → 每行：格数 x y w h（0–1，左上角原点）；没测到脸就只印格数
let args = CommandLine.arguments
let asset = AVAsset(url: URL(fileURLWithPath: args[1]))
let step = Int(args[2]) ?? 3
let track = asset.tracks(withMediaType: .video)[0]
let reader = try! AVAssetReader(asset: asset)
let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(out); reader.startReading()
var i = 0
while let sb = out.copyNextSampleBuffer() {
  defer { i += 1 }
  if i % step != 0 { continue }
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  let req = VNDetectFaceRectanglesRequest()
  try? VNImageRequestHandler(cvPixelBuffer: pb, options: [:]).perform([req])
  let fs = (req.results ?? []).sorted { $0.boundingBox.width * $0.boundingBox.height > $1.boundingBox.width * $1.boundingBox.height }
  if let b = fs.first?.boundingBox { print(String(format: "%d %.4f %.4f %.4f %.4f", i, b.minX, 1 - b.maxY, b.width, b.height)) } else { print(i) }
}
