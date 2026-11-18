import json, re, os
P='src/SuyenHooksE.tsx'; s=open(P).read()
SP=1.1
H=os.path.join(os.path.dirname(os.path.abspath(__file__)))   # 在 remotion/ 里执行：python3 ../pipeline/ep1/gen_ep1.py
pieces=json.load(open(f'{H}/pieces.json'))['pieces']
def ft(src, x):
    for p in pieces:
        if p['src']==src and p['a']-0.05<=x<=p['b']+0.05: return round(p['start']+(x-p['a'])/SP,2)
    raise SystemExit(f'no piece {src} {x}')
# ---------- 基础设施：ep1 ----------
R=[("import TK_P6 from './suyenh-track-p6.json';","import TK_P6 from './suyenh-track-p6.json';\nimport FC_EP1 from './suyenh-face-ep1.json';\nimport TK_EP1 from './suyenh-track-ep1.json';\nimport EP1 from './suyen-ep1.json';"),
   ("const FACE: Partial<Record<'s4' | 'p1' | 'i2' | 'p6', { x: number[]; y: number[] }>> = { p1: FC_P1 as any, i2: FC_I2 as any, p6: FC_P6 as any };",
    "const FACE: Partial<Record<'s4' | 'p1' | 'i2' | 'p6' | 'ep1', { x: number[]; y: number[] }>> = { p1: FC_P1 as any, i2: FC_I2 as any, p6: FC_P6 as any };"),
   ("type HookId = 's4' | 'p1' | 'i2' | 'p6';\nconst M = META as unknown as Record<HookId, { dur: number }>;",
    "type HookId = 's4' | 'p1' | 'i2' | 'p6' | 'ep1';\nconst M = { ...(META as unknown as Record<HookId, { dur: number }>), ep1: { dur: (EP1 as any).dur } } as Record<HookId, { dur: number }>;"),
   ("const TRACK: Partial<Record<HookId, { x: number[]; y: number[] }>> = { p1: TK_P1 as any, i2: TK_I2 as any, p6: TK_P6 as any };",
    "const TRACK: Partial<Record<HookId, { x: number[]; y: number[] }>> = { p1: TK_P1 as any, i2: TK_I2 as any, p6: TK_P6 as any, ep1: TK_EP1 as any };"),
   # Cutaway：可换背景（照片墙）、可接着上一段（不再弹圆框、不淡入）
   ("const Cutaway: React.FC<{ id: HookId; src: string; from: number; to: number; focus: [number, number]; zoom?: number }> = ({ id, src, from, to, focus: focus0, zoom = 0.62 }) => {",
    "const Cutaway: React.FC<{ id: HookId; src: string; from: number; to: number; focus: [number, number]; zoom?: number; bg?: React.ReactNode; cont?: boolean; last?: boolean }> = ({ id, src, from, to, focus: focus0, zoom = 0.62, bg, cont, last = true }) => {"),
   ("  const o = win(t, from, to, 0.2, 0.2), k = 1.02 + 0.06 * ease(t, from, to - from, eio);",
    "  const o = win(t, from, to, cont ? 0.001 : 0.2, last ? 0.2 : 0.001), k = 1.02 + 0.06 * ease(t, from, to - from, eio);"),
   ("const D = 400, cx = 1640, cy = 690, pin = ease(t, from, 0.4, Easing.out(Easing.back(1.6)));",
    "const D = 400, cx = 1640, cy = 690, pin = cont ? 1 : ease(t, from, 0.4, Easing.out(Easing.back(1.6)));"),
   ("        <AbsoluteFill style={{ transform: `scale(${k})` }}><OffthreadVideo src={staticFile(`suyenbr/${src}.mp4`)} muted playbackRate={rate} /></AbsoluteFill>",
    "        <AbsoluteFill style={{ transform: `scale(${k})` }}>{bg ?? <OffthreadVideo src={staticFile(`suyenbr/${src}.mp4`)} muted playbackRate={rate} />}</AbsoluteFill>"),
]
for a,b in R:
    assert a in s, a[:60]; s=s.replace(a,b,1)
# ---------- 钩子：沿用 P1 v9，时间全部 ÷1.1 ----------
i=s.index('export const SuyenEP1:'); j=s.index('/* ================= I2', i); hook=s[i:j]
def blk(name, nxt):
    a=hook.index(name+'={<>')+len(name)+4; b=hook.index('</>}', a); return hook[a:b]
sc=lambda m: f"{m.group(1)}={{{round(float(m.group(2))/SP,2)}}}"
def scale(x):
    x=x.replace("END('p1')", '14.2').replace('id="p1"', 'id="ep1"')
    x=re.sub(r'\b(at|until|from|to|dur|lock|len)=\{([\d.]+)\}', sc, x)
    return x
behind, front, sfx = scale(blk('behind','front')), scale(blk('front','sfx')), scale(blk('sfx','subs'))
subs_h = re.findall(r"\['([^']+)', ([\d.]+), ([\d.]+)\]", hook[hook.index('subs={['):])
subs = [(t, round(float(a)/SP,2), round(float(b)/SP,2)) for t,a,b in subs_h]
subs[-1]=(subs[-1][0], subs[-1][1], ft('C0004',15.80))
# 钩子里 翻倍 要在「奇门遁甲战略大会」出来前收掉
behind=behind.replace("until={12.91}","until={12.66}")
# ---------- 后面三段 ----------
Q=ft('C0004',15.86); NIAN=ft('C0004',20.64); QS=ft('C0004',22.68); GJ=ft('C0004',23.94); GW=ft('C0004',26.12); TR=ft('C0004',29.68); FS=ft('C0004',31.00)
P2S, P5S, P6S, P7S, P8S, P9S = [pieces[k]['start'] for k in (1,4,5,6,8,9)]
LIN=ft('C0037',4.74); SN=ft('C0037',8.20); KC=ft('C0037',10.6); JW=ft('C0037',12.26); SJ=ft('C0037',14.64); SS=ft('C0037',16.5)
SANTIAN=ft('C0048',6.08); Y2027=ft('C0048',8.88); CHIMA=ft('C0048',16.56); ZZ=ft('C0048',19.40); LS=ft('C0048',21.24); MS=ft('C0048',27.92)
END1=round(json.load(open(f'{H}/pieces.json'))['dur'],2)
YC0=round(NIAN-0.25,2)
sub2=[('奇门遁甲战略大会',Q,P2S),('我将会用年度的年盘',P2S,QS-0.05),('拆解趋势、格局',QS-0.05,pieces[2]['start']),('以及对的宫位、方向、时间点',pieces[2]['start'],pieces[3]['start']),
      ('带你找准投入以及防守的重点',pieces[3]['start'],P5S),('大家好，我是林舒苑',P5S,ft('C0037',5.40)),('您的人生战略导师',ft('C0037',5.40),ft('C0037',7.20)),
      ('我在过去 16 年培训超过千多场课程',ft('C0037',7.20),ft('C0037',11.30)),('也帮助过几万个学员',ft('C0037',11.30),ft('C0037',13.60)),('来自于世界各地',ft('C0037',13.60),P6S),
      ('从上市公司、大家族到小家庭',P6S,P7S),('我为大家准备了三天完全免费的',P7S,ft('C0048',8.80)),('2027 年奇门战略大会',ft('C0048',8.80),P8S),('你在 2027 年那么混乱的',P8S,ft('C0048',16.45)),
      ('赤马红羊年的年代',ft('C0048',16.45),ft('C0048',18.75)),('依然抓准趋势',ft('C0048',18.75),ft('C0048',21.10)),('落实你想要的结果',ft('C0048',21.10),P9S),('那么马上报名',P9S,ft('C0048',29.40)),('我们到时见！',ft('C0048',29.40),END1+0.6)]
allsubs=subs+[(t,round(a,2),round(b,2)) for t,a,b in sub2]
subs_js=', '.join(f"['{t}', {a}, {b}]" for t,a,b in allsubs)
PH=[('suyen-1',SN-0.1,KC-0.85,'16 年'),('G_fengshui_training-Qimen1',KC-0.85,JW-0.1,'千多场课程'),('G_qimendunjia_training1',JW-0.1,SJ-0.1,'几万个学员'),
    ('G_masterSuyenLim_qm1',SJ-0.1,SS-0.1,'来自世界各地'),('G_masterSuyenLim_CNY_Program-1',SS-0.1,P7S,'上市公司 · 大家族 · 小家庭')]
ph_js=', '.join(f"['{a}', {round(b,2)}, {round(c,2)}, '{d}']" for a,b,c,d in PH)
code=f'''
/* ================= 广告第一集（16:9 · 59.7 秒 · 1.1 倍速）================= */
// 结构：钩子 P1 v9（时间 ÷1.1）→ 教方法（年盘 / 数字人）→ 我们是谁（真照片墙）→ 报名（火马火羊 → 彩虹吉祥羊）
// 原片剪段见 suyen-ads/ep1/prep_ep1.py；只用 C0001–C0048
// 真照片墙：landing page 的照片只有 600×400，所以放成金框卡片（放大 1.7 倍内）+ 同一张大糊当底，不整张撑满
const PhotoWall: React.FC<{{ shots: [string, number, number, string][] }}> = ({{ shots }}) => {{
  const t = useT(), cur = shots.find(([, a, b]) => t >= a && t < b) ?? shots[shots.length - 1];
  const [id, a] = cur, p = ease(t, a, 0.45), kb = 1 + 0.05 * ease(t, a, 3, eio);
  return (
    <AbsoluteFill style={{{{ background: INK }}}}>
      <AbsoluteFill style={{{{ backgroundImage: `url(${{staticFile(`suyenph/${{id}}.jpg`)}})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(28px) brightness(0.45)', transform: 'scale(1.15)' }}}} />
      <div style={{{{ position: 'absolute', left: 150, top: 200, width: 1080, height: 720, transform: `translateY(${{(1 - p) * 60}}px) scale(${{0.94 + 0.06 * p}})`, opacity: p,
        border: '6px solid #E8C77E', boxShadow: '0 30px 70px rgba(0,0,0,0.65), 0 0 0 16px rgba(232,199,126,0.18)', overflow: 'hidden' }}}}>
        <div style={{{{ width: '100%', height: '100%', backgroundImage: `url(${{staticFile(`suyenph/${{id}}.jpg`)}})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `scale(${{kb}})` }}}} />
      </div>
    </AbsoluteFill>
  );
}};
const EP1_PH: [string, number, number, string][] = [{ph_js}];
export const SuyenEp1: React.FC = () => {{
  const cam: Cam = {{ hits: [0.78, 1.56, 2.65, 7.22, 11.45, 11.89, {Q}, {P5S}, {SANTIAN}, {MS}], pushes: [[3.31, 6.86, 1.06], [8.51, 11.44, 1.04], [{P8S}, {CHIMA - 0.4}, 1.05]], origin: '46% 25%' }};
  const grade: Grade = (t) => {{
    if (t >= 6.93) return [1, 1, 0];
    return [interpolate(t, [3.27, 6.36], [1, 0.72], clamp), 1, interpolate(t, [3.45, 6.55], [0, 0.9], clamp)];
  }};
  const T = (a: number, b: number) => ({{ at: a, until: b }});
  return (
    <Frame id="ep1" cam={{cam}} grade={{grade}} dust={{11.89}}
      behind={{<>{behind}
        <Hero text="奇门遁甲战略大会" {{...T({Q}, {P2S + 0.4})}} x={{960}} y={{150}} size={{120}} ls={{0.12}} glow={{0.5}} />
        <Hero text="3 天 · 完全免费" {{...T({SANTIAN}, {P8S})}} x={{960}} y={{150}} size={{120}} ls={{0.1}} glow={{0.5}} />
        <Hero text="2027 奇门战略大会" {{...T({Y2027}, {P8S})}} x={{420}} y={{440}} size={{84}} ls={{0.08}} rule />
        <Hero text="马上报名" {{...T({MS}, {END1 + 0.6})}} x={{960}} y={{160}} size={{150}} ls={{0.2}} glow={{0.6}} />
      </>}}
      front={{<>{front}
        <Cutaway id="ep1" src="ep1_yearchart" from={{{YC0}}} to={{{pieces[2]['start']}}} focus={{[990, 430]}} last={{false}} />
        <Cutaway id="ep1" src="ep1_dh_point" from={{{pieces[2]['start']}}} to={{{P5S}}} focus={{[990, 430]}} cont />
        <Hero text="趋势" {{...T({QS}, {GJ})}} x={{380}} y={{560}} size={{130}} anim="呐喊声波" />
        <Hero text="格局" {{...T({GJ}, {pieces[2]['start']})}} x={{380}} y={{560}} size={{130}} anim="呐喊声波" />
        <Hero text="宫位 · 方向 · 时间点" {{...T({GW}, {pieces[3]['start']})}} x={{1400}} y={{210}} size={{78}} anim="呐喊声波" />
        <Hero text="投入" {{...T({TR}, {FS})}} x={{380}} y={{760}} size={{130}} anim="呐喊声波" />
        <Hero text="防守" {{...T({FS}, {P5S})}} x={{380}} y={{760}} size={{130}} tone="red" anim="呐喊声波" />
        <NameTag at={{{LIN}}} until={{{SN - 0.2}}} x={{1280}} y={{640}} />
        <Cutaway id="ep1" src="" from={{{SN - 0.1}}} to={{{P7S}}} focus={{[990, 430]}} bg={{<PhotoWall shots={{EP1_PH}} />}} />
        {{EP1_PH.map(([, a, b, label]) => <Hero key={{a}} text={{label}} {{...T(a + 0.15, b)}} x={{690}} y={{110}} size={{label.length > 6 ? 70 : 96}} ls={{0.12}} anim="呐喊声波" />)}}
        <Cutaway id="ep1" src="ep1_horse_goat_h" from={{{CHIMA - 0.35}}} to={{{ZZ - 0.55}}} focus={{[990, 430]}} last={{false}} />
        <Cutaway id="ep1" src="goat_positive" from={{{ZZ - 0.55}}} to={{{P9S}}} focus={{[990, 430]}} cont />
        <Hero text="赤马红羊年" {{...T({CHIMA}, {ZZ - 0.55})}} x={{1400}} y={{230}} size={{110}} tone="red" anim="呐喊声波" />
        <Hero text="抓准趋势" {{...T({ZZ}, {P9S})}} x={{360}} y={{460}} size={{104}} anim="呐喊声波" />
        <Hero text="落实结果" {{...T({LS}, {P9S})}} x={{360}} y={{620}} size={{104}} anim="呐喊声波" />
      </>}}
      sfx={{<>{sfx}
        <Sfx at={{{Q - 0.03}}} s="咚" />
        <Sfx at={{{YC0 - 0.05}}} s="回忆-刷一下" />
        {{[{QS}, {GJ}, {GW}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="叮提示音4" />)}}
        <Sfx at={{{pieces[2]['start'] - 0.05}}} s="扫光" />
        {{[{TR}, {FS}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="木鱼敲击回响音效" />)}}
        <Sfx at={{{P5S - 0.05}}} s="闪回" />
        <Sfx at={{{LIN - 0.03}}} s="一声响铃" />
        <Sfx at={{{SN - 0.15}}} s="回忆-刷一下" />
        {{EP1_PH.slice(1).map(([, a]) => <Sfx key={{a}} at={{a - 0.03}} s="扫光音效4" />)}}
        <Sfx at={{{P7S - 0.05}}} s="闪回" />
        <Sfx at={{{SANTIAN - 0.03}}} s="综艺咚" />
        <Sfx at={{{Y2027 - 0.03}}} s="综艺咚咚两声鼓点转场音效" />
        <Sfx at={{{CHIMA - 0.4}}} s="旋风" /><Sfx at={{{CHIMA}}} s="咚咚重音心头震" />
        <Sfx at={{{ZZ - 0.58}}} s="亮一下" />
        {{[{ZZ}, {LS}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="正确" />)}}
        <Sfx at={{{P9S - 0.05}}} s="闪回" />
        <Sfx at={{{MS - 0.03}}} s="综艺咚" /><Sfx at={{{MS + 1.3}}} s="亮一下" />
      </>}}
      subs={{[{subs_js}]}}
    />
  );
}};
'''
s=s.rstrip()+'\n'+code
open(P,'w').write(s)
r=open('src/Root.tsx').read()
if 'SuyenEp1' not in r:
    r=r.replace("import { SuyenES4, SuyenEP1, SuyenEI2, SuyenEP6, suyenEFrames } from './SuyenHooksE';","import { SuyenES4, SuyenEP1, SuyenEI2, SuyenEP6, SuyenEp1, suyenEFrames } from './SuyenHooksE';")
    a="""      <Composition id="SuyenEP6" component={SuyenEP6} durationInFrames={suyenEFrames('p6')} fps={30} width={1920} height={1080} />"""
    r=r.replace(a,a+"""\n      <Composition id="SuyenEp1" component={SuyenEp1} durationInFrames={suyenEFrames('ep1')} fps={30} width={1920} height={1080} />""")
    open('src/Root.tsx','w').write(r)
print('Q',Q,'NIAN',NIAN,'P5S',P5S,'SN',SN,'CHIMA',CHIMA,'END',END1)
