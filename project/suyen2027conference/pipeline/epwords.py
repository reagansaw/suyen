"""把原片逐字时间（pipeline/wt/<原片>.json）换成第 N 集成片时间（照 pieces.json，已经 ÷1.1）。
用法：python3 pipeline/epwords.py N → 每行「成片秒 原片 原片秒 字」"""
import json, os, sys
H = os.path.dirname(os.path.abspath(__file__))
def words(n):
    P = json.load(open(f'{H}/ep{n}/pieces.json')); sp = P['speed']; out = []
    for p in P['pieces']:
        for s in json.load(open(f"{H}/wt/{p['src']}.json"))['segments']:
            for w in s.get('words', []):
                if p['a'] - 0.02 <= w['start'] and w['end'] <= p['b'] + 0.05:
                    out.append((round(p['start'] + (w['start'] - p['a']) / sp, 2), round(p['start'] + (w['end'] - p['a']) / sp, 2), p['src'], w['start'], w['word'].strip()))
    return out
if __name__ == '__main__':
    for a, b, src, x, w in words(int(sys.argv[1])): print(f'{a:6.2f} {b:6.2f} {src} {x:6.2f} {w}')
