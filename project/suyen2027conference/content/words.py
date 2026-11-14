#!/usr/bin/env python3
# 逐字时间工具（写 prep_cXX.py / 字幕前用）
#   python3 content/words.py C0053 23 72          → 印出这段每个字的原片时间（找剪点）
#   python3 content/words.py C0053 23 72 --subs   → 照停顿切成字幕草稿 ['字幕', 起, 止],（还要人工改错字：林舒苑 / 奇门 / 天蓬…）
# 读 content/transcripts/<src>_<起>.json（whisper --word-timestamps，时间要加回文件名里的起点）
import glob, json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))

def words(src):
    out = []
    for fn in glob.glob(f'{H}/transcripts/{src}_*.json'):
        m = re.search(r'_(\d+)\.json$', fn)
        if not m: continue
        off = float(m.group(1))
        for s in json.load(open(fn))['segments']:
            for w in s.get('words', []):
                out.append((round(w['start'] + off, 2), round(w['end'] + off, 2), w['word'].strip()))
    return sorted(set(out))

def subs(ws, maxc=9, gap=0.28):
    lines, cur = [], []
    for w in ws:
        txt = ''.join(x[2] for x in cur)
        if cur and (w[0] - cur[-1][1] > gap or len(txt) + len(w[2]) > maxc or re.search(r'[，。？！,.?!]$', txt)):
            lines.append(cur); cur = []
        cur.append(w)
    if cur: lines.append(cur)
    return [(re.sub(r'[，。,.]', '', ''.join(x[2] for x in l)), l[0][0], l[-1][1]) for l in lines]

if __name__ == '__main__':
    src, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
    ws = [w for w in words(src) if a - 0.01 <= w[0] < b]
    if '--subs' in sys.argv:
        for t, x, y in subs(ws): print(f"  ['{t}', {x:.2f}, {y:.2f}],")
    else:
        line = []
        for s, e, w in ws:
            line.append(f'{s:.2f}{w}')
            if len(line) == 8: print(' '.join(line)); line = []
        if line: print(' '.join(line))
