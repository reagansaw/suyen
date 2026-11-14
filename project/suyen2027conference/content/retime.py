#!/usr/bin/env python3
# 旧时间轴（v1 pieces）→ 新时间轴（cutlib 的 subs）：旧 final → raw → 新 final
# 按 piece index 对应（同一段 raw 在不同段重复用也不会错）；落在删掉的停顿里就贴到最近边界
import json, sys
def mapper(old_json, new_json, by='piece'):
    O = json.load(open(old_json)); N = json.load(open(new_json))
    sp_old = O['speed']; P = O['pieces']; S = N['subs']; NP = N['pieces']
    def raw_to_new(i_new, r):
        ss = [s for s in S if s['piece'] == i_new]
        best = None
        for s in ss:
            if s['a'] <= r <= s['b']:
                return s['start'] + (r - s['a']) * (s['end'] - s['start']) / (s['b'] - s['a'])
        # 停顿里 / 段外：贴最近边界
        cands = [(abs(r - s['a']), s['start']) for s in ss] + [(abs(r - s['b']), s['end']) for s in ss]
        return min(cands)[1]
    def M(t):
        i = next((k for k, p in enumerate(P) if p['start'] <= t < p['end']), len(P) - 1 if t >= P[-1]['end'] - 1e-6 else 0)
        p = P[i]; r = p['a'] + (min(t, p['end']) - p['start']) * sp_old
        if by == 'piece': return raw_to_new(i, r)
        # by raw：找新 pieces 里含这个 raw 的段
        j = next((k for k, q in enumerate(NP) if q['a'] - 0.05 <= r <= q['b'] + 0.05), None)
        return None if j is None else raw_to_new(j, r)
    return M
