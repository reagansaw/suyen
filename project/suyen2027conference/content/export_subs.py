#!/usr/bin/env python3
# ct/<id>_pieces.json → remotion/src/suyenc-<id>-subs.json（合成里 mkR(subs) 用：原片秒 → 成片秒）
# 用法：python3 content/export_subs.py c57
import json, os, sys
H = os.path.dirname(os.path.abspath(__file__)); i = sys.argv[1]
d = json.load(open(f'{H}/{i}_pieces.json'))
json.dump({'dur': d['dur'], 'subs': [{k: s[k] for k in ('piece', 'a', 'b', 'start', 'end')} for s in d['subs']]}, open(f'{H}/../remotion/src/suyenc-{i}-subs.json', 'w'), ensure_ascii=False)
print(i, d['dur'], len(d['subs']))
