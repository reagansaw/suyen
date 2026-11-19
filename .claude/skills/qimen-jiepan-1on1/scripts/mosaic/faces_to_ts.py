"""马赛克第 2 步：把 faces 量到的位置变成 qm1_faces.ts。
用法：python3 faces_to_ts.py <放 .txt 的文件夹> <qm1_faces.ts 的路径>
做三件事：① 前后各 2 次取平均（5 次移动平均），框才不会抖 ② 框放大：宽 ×1.55、高 ×1.7（盖到头发和下巴）③ 往上移 0.08 个脸高。
注意：这支片每一格都测得到脸。如果有一行只有格数（没测到脸），这个脚本会停下来——先补那一行（抄前一行的数字）再跑。"""
import json, os, sys
src, dst = sys.argv[1], sys.argv[2]
out = {}
for k in ['client'] + list('ABCDEFGHIJ'):
    p = os.path.join(src, k + '.txt')
    if not os.path.exists(p): continue
    rows = []
    for l in open(p):
        v = l.split()
        assert len(v) == 5, f'{k} 第 {v[0]} 格没测到脸，先补这一行'
        rows.append(list(map(float, v[1:])))
    sm = []
    for i in range(len(rows)):
        w = rows[max(0, i - 2):i + 3]; sm.append([sum(r[j] for r in w) / len(w) for j in range(4)])
    flat = []
    for x, y, w, h in sm:
        cx, cy = x + w / 2, y + h / 2; W, H = w * 1.55, h * 1.7; cy -= h * 0.08
        flat += [round(cx - W / 2, 4), round(cy - H / 2, 4), round(W, 4), round(H, 4)]
    out[k] = flat
open(dst, 'w').write('// 客人脸的位置（马赛克用）：每 3 格一组 [x, y, w, h]（0–1，左上角原点），已放大、已平滑。scripts/mosaic/faces.swift（macOS Vision）量的。\nexport const FACES: Record<string, number[]> = ' + json.dumps(out, separators=(',', ':')) + ';\n')
print({k: len(v) // 4 for k, v in out.items()})
