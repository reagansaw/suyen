#!/usr/bin/env python3
"""广告第 N 集的合成产生器（第 2–14 集共用；第 1 集是 ep1/gen_ep1.py）。
用法（在 repo 根目录）：python3 pipeline/gen_ep.py 2
读：pipeline/epN/pieces.json（Mac 上 prep_epN.py 剪片量出来的真实切点）、pipeline/wt/*.json（逐字时间）、pipeline/epN/hook_epN.py（这一集的钩子 + 教方法）
写：remotion/src/suyen-epN.json、SuyenHooksE.tsx 里的 SuyenEpN（夹在 EPN START / END 记号之间，重跑会整段换掉）、Root.tsx 的 Composition
介绍段（名牌 + 照片墙）和报名 CTA 每集一样，写在这里。"""
import importlib.util, json, os, re, sys
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, os.path.join(R, 'pipeline'))
import eps_plan as E

SP = 1.1

class Ep:
    def __init__(self, n):
        self.n, self.id = n, f'ep{n}'
        m = json.load(open(f'{R}/pipeline/ep{n}/pieces.json'))
        self.pieces, self.dur = m['pieces'], m['dur']
        self.end = round(self.dur + 0.6, 2)
        self.e = E.EPS[n]
        self._w = {}

    def words(self, src):
        if src not in self._w: self._w[src] = E.words(src)
        return self._w[src]

    def ft(self, src, x):
        """原片秒 → 成片秒。落在剪掉的停顿里就算到下一段开头"""
        ps = [p for p in self.pieces if p['src'] == src]
        for p in ps:
            if p['a'] - 0.05 <= x <= p['b'] + 0.05: return round(p['start'] + (min(max(x, p['a']), p['b']) - p['a']) / SP, 2)
        nxt = [p for p in ps if p['a'] > x]
        if nxt: return round(nxt[0]['start'], 2)
        raise SystemExit(f'{src} {x} 不在 ep{self.n} 的任何一段里')

    def w(self, src, text, after=0.0):
        """找某个字（第一次出现、在 after 秒之后、在成片里的）→ 成片秒。用逐字时间，不用手抄秒数"""
        for wd in self.words(src):
            if wd['start'] < after - 0.01 or text not in wd['word']: continue
            if any(p['src'] == src and p['a'] - 0.3 <= wd['start'] <= p['b'] for p in self.pieces):
                return self.ft(src, wd['start'])
        raise SystemExit(f'ep{self.n}：{src} 找不到「{text}」（{after} 秒之后）')

    def piece_start(self, src, a_near):
        return min((p for p in self.pieces if p['src'] == src), key=lambda p: abs(p['a'] - a_near))['start']

    def subs(self):
        """字幕：照成片里留下来的字、按标点断句，一句一行；她讲的原话，只改 whisper 听错的字"""
        out = []
        for p in self.pieces:
            ws = [w for w in self.words(p['src']) if p['a'] - 0.02 <= (w['start'] + w['end']) / 2 <= p['b'] + 0.02]
            cur, t0 = '', None
            for w in ws:
                if t0 is None: t0 = self.ft(p['src'], max(w['start'], p['a']))
                cur += w['word'].strip()
                if re.search(r'[，,。？?！!、]$', w['word'].strip()) or len(cur) >= 16:
                    out.append([cur, t0]); cur, t0 = '', None
            if cur: out.append([cur, t0])
        say = self.e.get('say', {})
        res = []
        for i, (txt, t0) in enumerate(out):
            t1 = out[i + 1][1] if i + 1 < len(out) else self.dur
            txt = E.fix(txt).replace('⚠', '').strip(' ，,。、')
            if not txt: continue
            res.append([txt, round(t0, 2), round(t1, 2)])
        for (src, raw), txt in say.items():   # 逐句改写（whisper 吃字 / 乱码）
            t = self.ft(src, raw)
            for r in res:
                if abs(r[1] - t) < 0.6: r[0] = txt
        # 合并同时间的重复、太短的接到前一句
        clean = []
        for r in res:
            if clean and r[2] - r[1] < 0.35: clean[-1][0] += r[0]; clean[-1][2] = r[2]
            else: clean.append(r)
        return clean

    # ---------- 共用：介绍段（名牌 + 真照片墙）----------
    def intro(self):
        LIN, SN, KC, JW, SJ = self.w('C0037', '林'), self.w('C0037', '16'), self.w('C0037', '课'), self.w('C0037', '几', 12), self.w('C0037', '世界')
        P5S = self.piece_start('C0037', 3.65)
        intro_end = max(p['end'] for p in self.pieces if p['src'] == 'C0037')
        ph = [('suyen-1', SN - 0.1, KC - 0.85, '16 年'), ('G_fengshui_training-Qimen1', KC - 0.85, JW - 0.1, '千多场课程'),
              ('G_qimendunjia_training1', JW - 0.1, SJ - 0.1, '几万个学员')]
        if any(p['src'] == 'C0037' and p['a'] > 16 for p in self.pieces):
            SS = self.w('C0037', '上', 16)
            ph += [('G_masterSuyenLim_qm1', SJ - 0.1, SS - 0.1, '来自世界各地'), ('G_masterSuyenLim_CNY_Program-1', SS - 0.1, intro_end, '上市公司 · 大家族 · 小家庭')]
        else:
            ph += [('G_masterSuyenLim_qm1', SJ - 0.1, intro_end, '来自世界各地')]
        PH = f'EP{self.n}_PH'
        ph_js = ', '.join(f"['{a}', {b:.2f}, {c:.2f}, '{d}']" for a, b, c, d in ph)
        front = f'''
        <NameTag at={{{LIN:.2f}}} until={{{SN - 0.2:.2f}}} x={{1280}} y={{640}} light />
        <Cutaway id="{self.id}" src="" from={{{SN - 0.1:.2f}}} to={{{intro_end:.2f}}} focus={{[990, 430]}} bg={{<PhotoWall shots={{{PH}}} base={{{SN - 0.1:.2f}}} />}} />
        {{{PH}.map(([, a, b, label]) => <Hero key={{a}} text={{label}} {{...T(a + 0.15, b)}} x={{690}} y={{110}} size={{label.length > 6 ? 70 : 96}} ls={{0.12}} anim="呐喊声波" />)}}'''
        sfx = f'''
        <Sfx at={{{P5S - 0.05:.2f}}} s="闪回" />
        <Sfx at={{{LIN - 0.03:.2f}}} s="一声响铃" />
        <Sfx at={{{SN - 0.15:.2f}}} s="回忆-刷一下" />
        {{{PH}.slice(1).map(([, a]) => <Sfx key={{a}} at={{a - 0.03}} s="扫光音效4" />)}}'''
        return dict(front=front, sfx=sfx, const=f'const {PH}: [string, number, number, string][] = [{ph_js}];', hits=[P5S], end=intro_end)

    # ---------- 共用：报名 CTA ----------
    def cta(self):
        srcs = {p['src'] for p in self.pieces}
        E_ = self.end
        if 'C0048' in srcs:   # CTA-1：照第 1 集
            C0 = self.piece_start('C0048', 4.30)
            SANTIAN, Y2027, CHIMA, ZZ, LS = self.w('C0048', '三'), self.w('C0048', '20', 8), self.w('C0048', '赤'), self.w('C0048', '抓'), self.w('C0048', '落')
            P9S, MS = self.piece_start('C0048', 27.10), self.w('C0048', '马', 27)
            P8S = self.piece_start('C0048', 13.57)
            behind = f'''
        <Hero text="3 天 · 完全免费" {{...T({SANTIAN:.2f}, {P8S:.2f})}} x={{960}} y={{150}} size={{120}} ls={{0.1}} glow={{0.5}} />
        <Hero text="2027 奇门战略大会" {{...T({Y2027:.2f}, {P8S:.2f})}} x={{560}} y={{440}} size={{84}} ls={{0.08}} rule />
        <Hero text="马上报名" {{...T({MS:.2f}, {E_})}} x={{960}} y={{160}} size={{150}} ls={{0.2}} glow={{0.6}} />'''
            front = f'''
        <Cutaway id="{self.id}" src="ep1_horse_goat_h" from={{{CHIMA - 0.35:.2f}}} to={{{ZZ - 0.55:.2f}}} focus={{[990, 430]}} last={{false}} />
        <Cutaway id="{self.id}" src="goat_positive" from={{{ZZ - 0.55:.2f}}} to={{{P9S:.2f}}} focus={{[990, 430]}} cont />
        <Hero text="赤马红羊年" {{...T({CHIMA:.2f}, {ZZ - 0.55:.2f})}} x={{1400}} y={{230}} size={{110}} tone="red" anim="呐喊声波" />
        <Hero text="抓准趋势" {{...T({ZZ:.2f}, {P9S:.2f})}} x={{360}} y={{460}} size={{104}} anim="呐喊声波" />
        <Hero text="落实结果" {{...T({LS:.2f}, {P9S:.2f})}} x={{360}} y={{620}} size={{104}} anim="呐喊声波" />'''
            sfx = f'''
        <Sfx at={{{C0 - 0.05:.2f}}} s="闪回" />
        <Sfx at={{{SANTIAN - 0.03:.2f}}} s="综艺咚" />
        <Sfx at={{{Y2027 - 0.03:.2f}}} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={{{CHIMA - 0.4:.2f}}} s="旋风" /><Sfx at={{{CHIMA:.2f}}} s="咚咚重音心头震" />
        <Sfx at={{{ZZ - 0.58:.2f}}} s="亮一下" />
        {{[{ZZ:.2f}, {LS:.2f}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="正确" />)}}
        <Sfx at={{{P9S - 0.05:.2f}}} s="闪回" />
        <Sfx at={{{MS - 0.03:.2f}}} s="综艺咚" /><Sfx at={{{MS + 1.3:.2f}}} s="亮一下" />'''
            return dict(behind=behind, front=front, sfx=sfx, hits=[SANTIAN, MS], pushes=[(P8S, CHIMA - 0.4, 1.05)])
        if 'C0039' in srcs:   # CTA-2
            C0 = self.piece_start('C0039', 0.0)
            SANTIAN, DH = self.w('C0039', '三'), self.w('C0039', '战')
            C2 = self.piece_start('C0039', 5.0)
            KQ, QYJ, JZ = self.w('C0039', '看'), self.w('C0039', '企'), self.w('C0039', '精')
            MS = self.w('C0039', '马')
            GOAT_END = self.w('C0039', '你', 12.0)
            behind = f'''
        <Hero text="3 天 · 完全免费" {{...T({SANTIAN:.2f}, {C2:.2f})}} x={{960}} y={{150}} size={{120}} ls={{0.1}} glow={{0.5}} />
        <Hero text="2027 奇门战略大会" {{...T({DH:.2f}, {C2:.2f})}} x={{560}} y={{440}} size={{84}} ls={{0.08}} rule />
        <Hero text="马上报名" {{...T({MS:.2f}, {E_})}} x={{960}} y={{160}} size={{150}} ls={{0.2}} glow={{0.6}} />'''
            front = f'''
        <Cutaway id="{self.id}" src="goat_positive" from={{{C2 - 0.1:.2f}}} to={{{GOAT_END - 0.05:.2f}}} focus={{[990, 430]}} />
        <Hero text="看清趋势" {{...T({KQ:.2f}, {GOAT_END - 0.05:.2f})}} x={{360}} y={{360}} size={{104}} anim="呐喊声波" />
        <Hero text="企业家" {{...T({QYJ:.2f}, {GOAT_END - 0.05:.2f})}} x={{360}} y={{520}} size={{104}} anim="呐喊声波" />
        <Hero text="精准方向" {{...T({JZ:.2f}, {GOAT_END - 0.05:.2f})}} x={{360}} y={{680}} size={{104}} anim="呐喊声波" />'''
            sfx = f'''
        <Sfx at={{{C0 - 0.05:.2f}}} s="闪回" />
        <Sfx at={{{SANTIAN - 0.03:.2f}}} s="综艺咚" />
        <Sfx at={{{DH - 0.03:.2f}}} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={{{C2 - 0.15:.2f}}} s="亮一下" />
        {{[{KQ:.2f}, {QYJ:.2f}, {JZ:.2f}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="正确" />)}}
        <Sfx at={{{GOAT_END - 0.1:.2f}}} s="闪回" />
        <Sfx at={{{MS - 0.03:.2f}}} s="综艺咚" /><Sfx at={{{MS + 1.0:.2f}}} s="亮一下" />'''
            return dict(behind=behind, front=front, sfx=sfx, hits=[SANTIAN, MS], pushes=[])
        raise SystemExit('CTA-4（第 13 集）写在 hook_ep13.py 里')

def patch_infra(n):
    P = f'{R}/remotion/src/SuyenHooksE.tsx'; s = open(P).read()
    k = f'ep{n}'
    if f"'{k}'" not in s.split('type HookId =')[1].split(';')[0]:
        s = re.sub(r"(type HookId = [^;]*?)(;)", lambda m: m.group(1) + f" | '{k}'" + m.group(2), s, count=1)
    if f'EP{n} from' not in s:
        s = s.replace("import EP1 from './suyen-ep1.json';",
                      f"import EP1 from './suyen-ep1.json';\nimport FC_EP{n} from './suyenh-face-ep{n}.json';\nimport TK_EP{n} from './suyenh-track-ep{n}.json';\nimport EP{n} from './suyen-ep{n}.json';", 1)
    if f'{k}: {{ dur: (EP{n}' not in s:
        s = s.replace("ep1: { dur: (EP1 as any).dur }", f"ep1: {{ dur: (EP1 as any).dur }}, {k}: {{ dur: (EP{n} as any).dur }}", 1)
    # 护脸层 / 圆框用这一集的脸部追踪
    s = re.sub(r"const FACE: Partial<Record<[^>]*>>", "const FACE: Partial<Record<string, { x: number[]; y: number[] }>>", s, count=1)
    if f'{k}: FC_EP{n}' not in s:
        s = re.sub(r"(const FACE: [^=]*= \{[^}]*?)( \};)", lambda m: m.group(1) + f", {k}: FC_EP{n} as any" + m.group(2), s, count=1)
    if f'{k}: TK_EP{n}' not in s:
        s = re.sub(r"(const TRACK: [^=]*= \{[^}]*?)( \};)", lambda m: m.group(1) + f", {k}: TK_EP{n} as any" + m.group(2), s, count=1)
    open(P, 'w').write(s)
    r = open(f'{R}/remotion/src/Root.tsx').read()
    if f'SuyenEp{n},' not in r and f'SuyenEp{n} ' not in r:
        r = re.sub(r"(import \{[^}]*SuyenEp1)", lambda m: m.group(1) + f", SuyenEp{n}", r, count=1)
    if f'id="SuyenEp{n}"' not in r:
        a = re.findall(r' *<Composition id="SuyenEp\d+"[^\n]*\n', r)[-1]
        r = r.replace(a, a + f'    <Composition id="SuyenEp{n}" component={{SuyenEp{n}}} durationInFrames={{suyenEFrames(\'{k}\')}} fps={{30}} width={{1920}} height={{1080}} />\n', 1)
    open(f'{R}/remotion/src/Root.tsx', 'w').write(r)

def main(n):
    ep = Ep(n)
    spec = importlib.util.spec_from_file_location('hook', f'{R}/pipeline/ep{n}/hook_ep{n}.py'); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    h = mod.build(ep)
    intro = ep.intro()
    cta = h.get('cta') or ep.cta()
    json.dump({'dur': ep.dur}, open(f'{R}/remotion/src/suyen-ep{n}.json', 'w'))
    patch_infra(n)
    subs = ep.subs()
    subs_js = ', '.join(f"['{t}', {a}, {b}]" for t, a, b in subs)
    hits = sorted(set(round(x, 2) for x in h['hits'] + intro['hits'] + cta['hits']))
    pushes = ', '.join(f'[{a:.2f}, {b:.2f}, {z}]' for a, b, z in h['pushes'] + cta['pushes'])
    code = f'''/* ===== EP{n} START（pipeline/gen_ep.py {n} 产生，别手改；要改就改 pipeline/ep{n}/hook_ep{n}.py 再重跑）===== */
// 广告第{n}集（{ep.e['code']} · {ep.e['title']}）· 16:9 · {ep.dur:.1f} 秒 · 1.1 倍速。只用 C0001–C0048
{intro['const']}
export const SuyenEp{n}: React.FC = () => {{
  const cam: Cam = {{ hits: [{', '.join(str(x) for x in hits)}], pushes: [{pushes}], origin: '46% 25%' }};
  const grade: Grade = {h['grade']};
  const T = (a: number, b: number) => ({{ at: a, until: b }});
  return (
    <Frame id="ep{n}" cam={{cam}} grade={{grade}} dust={{{h.get('dust', 0)}}}
      behind={{<>{h['behind']}{cta['behind']}
      </>}}
      front={{<>{h['front']}{intro['front']}{cta['front']}
      </>}}
      sfx={{<>{h['sfx']}{intro['sfx']}{cta['sfx']}
      </>}}
      subs={{[{subs_js}]}}
    />
  );
}};
/* ===== EP{n} END ===== */
'''
    P = f'{R}/remotion/src/SuyenHooksE.tsx'; s = open(P).read()
    s = re.sub(rf'/\* ===== EP{n} START.*?/\* ===== EP{n} END ===== \*/\n', '', s, flags=re.S)
    s = s.rstrip() + '\n\n' + code
    open(P, 'w').write(s)
    print(f'SuyenEp{n}：{ep.dur:.2f} 秒，{len(subs)} 句字幕')
    return ep, h

if __name__ == '__main__':
    main(int(sys.argv[1]))
