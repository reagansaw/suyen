"""广告第 2–14 集的合成产生器 → remotion/src/SuyenEps.tsx（整个档案每次重写，可以一直重跑）+ Root.tsx 登记。
用法（在 repo 根目录）：python3 pipeline/gen_eps.py
- 时间一律是成片秒（已经 ÷1.1）：t(n, 原片, 原片秒) 照 pipeline/epN/pieces.json 换算；字的时间看 `python3 pipeline/epwords.py N`
- 每集 = 钩子 + 教方法（各集自己设计，照 epN/第N集-脚本.md）+ 共用的 我们是谁（C0037）+ CTA
- C0039（CTA-2）整段只拍到 Suyen 的 logo 墙，没有人：那段没有圆框，B-roll 用全画面 Shot，大字随便放
- B-roll 还没下载（studio 还没 Run）的，画面先放「待生成」占位卡，分镜检查图看得出来是哪一段"""
import subprocess, json, os
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(H, '..')
BR = os.path.join(ROOT, 'remotion', 'public', 'suyenbr')
SP = 1.1

def pieces(n): return json.load(open(f'{H}/ep{n}/pieces.json'))
def t(n, src, x):
    sp = pieces(n).get('speed', SP)
    for p in pieces(n)['pieces']:
        if p['src'] == src and p['a'] - 0.06 <= x <= p['b'] + 0.06: return round(p['start'] + (x - p['a']) / sp, 2)
    raise SystemExit(f'ep{n}: no piece {src} {x}')
def starts(n, src): return [p['start'] for p in pieces(n)['pieces'] if p['src'] == src]
def ends(n, src): return [p['end'] for p in pieces(n)['pieces'] if p['src'] == src]
def dur(n): return round(pieces(n)['dur'], 2)
def r(x): return round(x, 2)

# B-roll：有档案就用影片，没有就占位卡（label 写这段要什么，Reagan 看图就知道）
def bg(src, label):
    return '' if os.path.exists(f'{BR}/{src}.mp4') else f' bg={{<Ph label="{src}：{label}" />}}'
# 新 B-roll 还没生成、又要先出片时：拿已有的同调性片顶着（负面配负面、演员配演员），真的片下载后重跑就会换回来
STANDIN = {'p2_loss': 'p1_tired', 'p2_fork': 'i2_team'} if os.environ.get('STANDIN') else {}
MAXB = 3.0   # 每段 B-roll 最长 3 秒，超过就切几段、中间回到她本人 0.8 秒（Reagan 10-31：「每个 b-roll 不能超过 3 秒」）
def cut(n, src, a, b, label, **kw):
    if not os.path.exists(f'{BR}/{src}.mp4') and src in STANDIN: src = STANDIN[src]
    segs = [(a, b, 0)]
    if b - a > MAXB:
        k = int((b - a + 0.8) // (2.7 + 0.8)) + (1 if (b - a + 0.8) % 3.5 > 0.01 else 0)
        L = (b - a - 0.8 * (k - 1)) / k
        cd = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{BR}/{src}.mp4'], capture_output=True, text=True).stdout or 0) if os.path.exists(f'{BR}/{src}.mp4') else 0
        room = max(0.0, cd - L - 0.05)   # 每段从片子不同位置开始，但要放得完（片子不够长就从头）
        segs = [(a + i * (L + 0.8), a + i * (L + 0.8) + L, round((i * (L + 0.1)) % room, 2) if room > 0.2 else 0) for i in range(k)]
    out = []
    for i, (x, y, sk) in enumerate(segs):
        kk = {k: v for k, v in kw.items() if not ((k == 'cont' and i > 0) or (k == 'last' and i < len(segs) - 1))}
        extra = ''.join(f' {k}' if v is True else f' {k}={{{str(v).lower()}}}' for k, v in kk.items()) + (f' skip={{{sk}}}' if sk else '')
        out.append(f'<Cutaway id="ep{n}" src="{src}" from={{{r(x)}}} to={{{r(y)}}} focus={{[990, 430]}}{bg(src, label)}{extra} />')
    return '\n        '.join(out)
def shot(src, a, b, label, **kw):
    extra = ''.join(f' {k}' if v is True else f' {k}={{{str(v).lower()}}}' for k, v in kw.items())
    return f'<Shot src="{src}" from={{{r(a)}}} to={{{r(b)}}}{bg(src, label)}{extra} />'
def hero(text, a, b, x, y, size, **kw):
    extra = ''.join(f' {k}' if v is True else (f' {k}="{v}"' if isinstance(v, str) else f' {k}={{{v}}}') for k, v in kw.items())
    return f'<Hero text="{text}" at={{{r(a)}}} until={{{r(b)}}} x={{{x}}} y={{{y}}} size={{{size}}}{extra} />'
def sfx(a, s, **kw):
    extra = ''.join(f' {k}={{{v}}}' for k, v in kw.items())
    return f'<Sfx at={{{r(max(0, a))}}} s="{s}"{extra} />'
def subs_js(subs): return ', '.join(f"['{s}', {r(a)}, {r(b)}]" for s, a, b in subs)

# ---------- 共用：我们是谁（C0037，照第 1 集）----------
def intro(n, nxt):
    s0, s1 = starts(n, 'C0037')
    LIN, SN, KC, JW, SJ, SS = (t(n, 'C0037', x) for x in (4.74, 8.20, 10.6, 12.26, 14.64, 16.5))
    # 整张照片、不要人不要框（Reagan 10-31）；连续照片 ≤3 秒，中间回到她本人（照第 1 集）
    PH = [('hd-hall_seated', SN - 0.1, KC - 0.85, '16 年'), ('hd-QiMen_Training1', KC - 0.85, KC + 0.53, '千多场课程'), ('hd-fengshui_training-Qimen1', JW - 0.1, JW + 1.5, '几万个学员'),
          ('hd-masterSuyenLim_qm1', SJ - 0.1, SS - 0.1, '来自世界各地'), ('hd-family_group', SS - 0.1, SS + 1.26, '上市公司 大家族 小家庭')]
    hide = [(SN - 0.1, KC + 0.53, 0), (JW - 0.1, JW + 1.5, 0), (SJ - 0.1, SS + 1.26, 0)]
    ph = ', '.join(f"['{a}', {r(b)}, {r(c)}, '{d}']" for a, b, c, d in PH)
    front = [f'<NameTag at={{{r(LIN)}}} until={{{r(SN - 0.2)}}} x={{1280}} y={{640}} light />']
    behind = [f'<PhotoBG shots={{PH{n}}} />',
              f'{{PH{n}.map(([, a, b, label]) => <Hero key={{a}} text={{label}} at={{a + 0.15}} until={{b}} x={{960}} y={{150}} size={{label.length > 6 ? 110 : 170}} ls={{0.12}} anim="呐喊声波" />)}}']
    fx = [sfx(s0 - 0.05, '闪回'), sfx(LIN - 0.03, '一声响铃'), sfx(SN - 0.15, '回忆-刷一下'), f'{{PH{n}.slice(1).map(([, a]) => <Sfx key={{a}} at={{a - 0.03}} s="扫光音效4" />)}}']
    subs = [('大家好，我是林舒苑', s0, t(n, 'C0037', 5.40)), ('您的人生战略导师', t(n, 'C0037', 5.40), t(n, 'C0037', 7.20)),
            ('我在过去 16 年培训超过千多场课程', t(n, 'C0037', 7.20), t(n, 'C0037', 11.30)), ('也帮助过几万个学员', t(n, 'C0037', 11.30), t(n, 'C0037', 13.60)),
            ('来自于世界各地', t(n, 'C0037', 13.60), s1), ('从上市公司、大家族到小家庭', s1, nxt)]
    return f'const PH{n}: [string, number, number, string][] = [{ph}];', behind, front, fx, subs, [s0, nxt], hide

# ---------- 共用：CTA-2（C0039 logo 墙，没有人）----------
def cta2(n):
    c0 = starts(n, 'C0039')[0]; E = dur(n) + 0.6
    SAN, ZL, RG, KQ, Y20, QY, JZ, NI, MS = (t(n, 'C0039', x) for x in (0.0, 1.26, 5.16, 6.02, 6.42, 8.48, 11.06, 12.16, 12.60))
    HG = RG - 0.1; GP = QY - 0.45; BK = NI - 0.1
    # logo 墙是米白的，金字压上去看不清（Reagan：白墙不要用浅色字）→ 整段都铺深色 B-roll，字全放前景
    behind = []
    front = [shot('ep1_yearchart', c0, HG, '奇门年盘', last=False), shot('ep1_horse_goat_h', HG, GP, '火马火羊', cont=True, last=False),
             shot('goat_positive', GP, BK, '彩虹吉祥羊', cont=True, last=False), shot('ep1_dh_point', BK, E, '数字人 Suyen', cont=True),
             hero('3 天完全免费', SAN + 0.05, HG, 960, 330, 150, ls=0.1, glow=0.5), hero('奇门战略大会', ZL, HG, 960, 600, 110, ls=0.14, rule=True),
             hero('看清 2027 趋势', Y20, GP, 1380, 230, 104, anim='呐喊声波'),
             hero('企业家', QY, BK, 380, 430, 120, anim='呐喊声波'), hero('更精准的方向', JZ, BK, 470, 620, 100, anim='呐喊声波'),
             hero('马上报名', MS, E, 1380, 800, 150, ls=0.2, glow=0.6),
             f'<Flare at={{{r(SAN)}}} k={{0.5}} /><Flare at={{{r(MS)}}} k={{0.55}} />']
    fx = [sfx(c0 - 0.05, '闪回'), sfx(SAN + 0.02, '综艺咚'), sfx(ZL - 0.03, '咚'), sfx(HG - 0.05, '旋风'), sfx(Y20 - 0.03, '综艺咚咚两声鼓点转场音效'),
          sfx(GP - 0.05, '亮一下'), sfx(QY - 0.03, '正确'), sfx(JZ - 0.03, '正确'), sfx(BK - 0.05, '闪回'), sfx(MS - 0.03, '叮收银机提示音1'), sfx(MS + 1.2, '亮一下')]
    subs = [('三天完全免费的战略大会', c0, RG), ('如果你想要看清 2027 年趋势', RG, t(n, 'C0039', 7.60)), ('你是一个企业家', t(n, 'C0039', 7.60), t(n, 'C0039', 9.30)),
            ('你是一个要更精准的方向的人', t(n, 'C0039', 9.30), NI), ('你一定要马上报名', NI, t(n, 'C0039', 13.50)), ('我们到时见！', t(n, 'C0039', 13.50), E)]
    return behind, front, fx, subs, [SAN, ZL, MS]

# ---------- 共用：CTA-1（C0048，她本人在黄椅子上讲；照第 1 集）----------
def cta1(n):
    P = [p for p in pieces(n)['pieces'] if p['src'] == 'C0048']; P7S, P8S, P9S = P[0]['start'], P[1]['start'], P[2]['start']; E = dur(n) + 0.6
    SAN, Y27, CHIMA, ZZ, LS, MS = (t(n, 'C0048', x) for x in (6.08, 8.88, 16.56, 19.40, 21.24, 27.92))
    behind = [hero('3 天完全免费', SAN, P8S, 960, 150, 120, ls=0.1, glow=0.5), hero('2027 奇门战略大会', Y27, P8S, 420, 440, 84, ls=0.08, rule=True),
              hero('马上报名', MS, E, 960, 160, 150, ls=0.2, glow=0.6), f'<EventLogo at={{{r(P9S)}}} until={{{r(E)}}} />']
    front = [cut(n, 'ep1_horse_goat_h', CHIMA - 0.35, ZZ - 0.55, '火马火羊', last=False), cut(n, 'goat_positive', ZZ - 0.55, P9S, '彩虹吉祥羊', cont=True),
             hero('赤马红羊年', CHIMA, ZZ - 0.55, 1400, 230, 110, tone='red', anim='呐喊声波'),
             hero('抓准趋势', ZZ, P9S, 360, 460, 104, anim='呐喊声波'), hero('落实结果', LS, P9S, 360, 620, 104, anim='呐喊声波')]
    fx = [sfx(P7S - 0.05, '闪回'), sfx(SAN - 0.03, '综艺咚'), sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'), sfx(CHIMA - 0.4, '旋风'), sfx(CHIMA, '咚咚重音心头震'),
          sfx(ZZ - 0.58, '亮一下'), sfx(ZZ - 0.03, '正确'), sfx(LS - 0.03, '正确'), sfx(P9S - 0.05, '闪回'), sfx(MS - 0.03, '综艺咚'), sfx(MS + 1.3, '亮一下')]
    T = lambda x: t(n, 'C0048', x)
    subs = [('我为大家准备了三天完全免费的', P7S, T(8.80)), ('2027 年奇门战略大会', T(8.80), P8S), ('你在 2027 年那么混乱的', P8S, T(16.45)), ('赤马红羊年的年代', T(16.45), T(18.75)),
            ('依然抓准趋势', T(18.75), T(21.10)), ('落实你想要的结果', T(21.10), P9S), ('那么马上报名', P9S, T(29.40)), ('我们到时见！', T(29.40), E)]
    return behind, front, fx, subs, [SAN, MS]

# ---------- 共用：CTA-1 短版（C0048 黄椅子，她本人讲）：三天免费 → 2027 奇门战略大会 → 马上报名 → 讲完挥手笑 2 秒收尾 ----------
# 代替 CTA-2（C0039 是别人的声音，Reagan 10-31：「要一直是 Suyen 的声音，后面预留多 2 秒」）
def cta1s(n):
    P = [p for p in pieces(n)['pieces'] if p['src'] == 'C0048']; P7S, PMS = P[0]['start'], P[1]['start']; E = dur(n) + 0.6
    SAN, Y27, MS, JIAN = (t(n, 'C0048', x) for x in (6.08, 8.88, 27.92, 30.80))
    behind = [hero('3 天完全免费', SAN, PMS, 960, 150, 120, ls=0.1, glow=0.5), hero('2027 奇门战略大会', Y27, PMS, 420, 440, 84, ls=0.08, rule=True),
              hero('马上报名', MS, E, 960, 160, 150, ls=0.2, glow=0.6), f'<EventLogo at={{{r(PMS)}}} until={{{r(E)}}} />']
    front = [f'<Flare at={{{r(SAN)}}} k={{0.45}} /><Flare at={{{r(MS)}}} k={{0.55}} />']
    fx = [sfx(P7S - 0.05, '闪回'), sfx(SAN - 0.03, '综艺咚'), sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'), sfx(MS - 0.03, '叮收银机提示音1'), sfx(JIAN, '亮一下')]
    T = lambda x: t(n, 'C0048', x)
    subs = [('我为大家准备了三天完全免费的', P7S, T(8.80)), ('2027 年奇门战略大会', T(8.80), PMS), ('那么马上报名', PMS, T(29.40)), ('我们到时见！', T(29.40), JIAN + 0.6)]
    return behind, front, fx, subs, [SAN, MS]

# ---------- 每集 = 自己的钩子 + 教方法，后面接共用的 我们是谁 + CTA ----------
def assemble(n, behind, front, fx, subs, hits, pushes, dust, origin='48% 30%', cta=None, grade='() => [1, 1, 0]'):
    if cta is None:   # 照 pieces.json 用的是哪个 CTA
        k = sum(p['src'] == 'C0048' for p in pieces(n)['pieces'])
        cta = cta1 if k >= 3 else cta1s if k == 2 else cta2   # k == 4：旧切法（还没重剪的集）
    c0 = starts(n, 'C0037')[0]
    nxt = next(p['start'] for p in pieces(n)['pieces'] if p['start'] > c0 and p['src'] != 'C0037')
    phdef, ib, ifr, ifx, isub, _, hide = intro(n, nxt)
    cb, cf, cfx, csub, chits = cta(n)
    return n, phdef, behind + ib + cb, front + ifr + cf, fx + ifx + cfx, subs + isub + csub, dict(hits=hits + [c0] + chits, pushes=pushes, origin=origin, grade=grade, shrink=hide), dust

# ---------- 第 2 集 · P2 翻身变赔钱（C0006）----------
def ep2():
    n = 2; T = lambda x: t(n, 'C0006', x)
    FAN, SHEN, PEI, LIU, QI, HAI, LANG, ZHENG = (T(x) for x in (4.50, 4.72, 6.46, 7.38, 8.06, 9.04, 9.28, 10.24))
    NA, Y20, Y27, ZHEN, JIA, HUN, YAN, FB, HAISHI, XB = (T(x) for x in (12.10, 12.22, 12.52, 13.72, 13.98, 14.44, 15.14, 16.78, 18.40, 19.78))
    QM, NP, JH, FX, QJ, JT, XBJ, ZTR = (T(x) for x in (21.40, 24.40, 25.88, 27.04, 28.64, 30.18, 31.28, 32.64))
    INTRO0 = starts(n, 'C0037')[0]
    LOSS0, FORK0, YC0, DH0 = HAI - 0.05, YAN - 0.1, NP - 0.35, XBJ - 0.1
    behind = [hero('翻', FAN, PEI - 0.05, 560, 240, 340, dur=0.32, glow=0.6), hero('身？', SHEN, PEI - 0.05, 1400, 240, 340, dur=0.32, glow=0.6),
              hero('20', Y20, ZHEN - 0.05, 520, 220, 340, ls=0.06, glow=0.5), hero('27', Y27, ZHEN - 0.05, 1260, 220, 340, ls=0.06, glow=0.5),
              hero('奇门遁甲战略大会', QM, YC0, 960, 150, 120, ls=0.12, glow=0.5)]
    front = [hero('赔掉', PEI, LOSS0, 960, 640, 64, ls=0.3, rotY=0, rotX=18, anim='呐喊声波'),
             hero('6 位数', LIU, QI - 0.02, 960, 790, 150, ls=0.04, rotY=0, rotX=18, anim='呐喊声波'),
             hero('7 位数', QI, LOSS0, 960, 790, 150, ls=0.04, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             cut(n, 'p2_loss', LOSS0, NA - 0.1, '老板深夜看着一片红的跌势屏幕，抱头（演员）'), f'<InkVig from={{{r(LOSS0)}}} to={{{r(NA - 0.1)}}} />',
             hero('浪费', LANG, NA - 0.12, 330, 320, 200, tone='cream', anim='呐喊声波'), hero('一整年', ZHENG, NA - 0.12, 360, 590, 200, tone='red', dur=0.36, anim='呐喊声波'),
             f'<Seal text="真" at={{{r(ZHEN)}}} until={{{r(FORK0)}}} x={{1420}} y={{560}} size={{130}} rot={{-6}} />',
             f'<Seal text="假" at={{{r(JIA)}}} until={{{r(FORK0)}}} x={{1580}} y={{600}} size={{130}} rot={{4}} />',
             f'<Seal text="混" at={{{r(HUN)}}} until={{{r(FORK0)}}} x={{1740}} y={{560}} size={{130}} rot={{-3}} />',
             cut(n, 'p2_fork', FORK0, QM - 0.05, '山路分岔：左边金色日出的路、右边断崖暗雾（没有人）'),
             hero('翻倍转机？', FB, QM - 0.07, 400, 400, 120, anim='呐喊声波'), hero('血本无归？', XB, QM - 0.07, 400, 620, 120, tone='red', anim='呐喊声波'),
             cut(n, 'ep1_yearchart', YC0, INTRO0, '奇门年盘'),   # 数字人 Suyen 不用了（Reagan 10-31：AI 生成的有点老，用原本的她）→ 年盘一路到介绍段，圆框里是她本人
             hero('机会', JH, QJ - 0.05, 380, 460, 130, anim='呐喊声波'), hero('风险', FX, QJ - 0.05, 380, 660, 130, tone='red', anim='呐喊声波'),
             hero('看全局', QJ, DH0, 400, 460, 130, anim='呐喊声波'), hero('定进退', JT, DH0, 400, 660, 130, anim='呐喊声波'),
             hero('先布局', XBJ, INTRO0, 400, 460, 130, anim='呐喊声波'), hero('再投入', ZTR, INTRO0, 400, 660, 130, anim='呐喊声波'),
             f'<Flare at={{{r(FAN)}}} k={{0.6}} /><Flare at={{{r(NA - 0.1)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DROP}', sfx(FAN - 0.03, '咚'), sfx(SHEN - 0.03, '综艺咚'), sfx(PEI - 0.03, '咚咚重音心头震'),
          sfx(LIU - 0.05, '复古胶片滚动', len=0.6), sfx(QI - 0.03, '叮收银机提示音1'),
          sfx(LOSS0 - 0.05, '回忆-刷一下'), sfx(LOSS0 + 0.1, '诡异的滴水声'), sfx(ZHENG - 0.03, '咚咚重音心头震'),
          sfx(NA - 0.12, '闪回'), sfx(Y20 - 0.03, '咚'), sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'),
          *(sfx(x - 0.03, '木鱼敲击回响音效') for x in (ZHEN, JIA, HUN)),
          sfx(FORK0 - 0.05, '旋风'), sfx(FB - 0.03, '综艺咚'), sfx(XB - 0.03, '咚咚重音心头震'),
          sfx(QM - 0.05, '咚'), sfx(YC0 - 0.05, '回忆-刷一下'), *(sfx(x - 0.03, '叮提示音4') for x in (JH, FX, QJ, JT)),
          *(sfx(x - 0.03, '木鱼敲击回响音效') for x in (XBJ, ZTR))]
    subs = [('以为抓到翻身的机会', 0.05, T(5.80)), ('结果赔掉 6 位数、7 位数', T(5.80), HAI - 0.05), ('还浪费一整年的时间', HAI - 0.05, NA - 0.05),
            ('那 2027 年', NA - 0.05, ZHEN - 0.05), ('真假混', ZHEN - 0.05, YAN - 0.05), ('眼前到底是翻倍的转机', YAN - 0.05, HAISHI - 0.05),
            ('还是会让你血本无归的危机？', HAISHI - 0.05, QM - 0.05), ('奇门遁甲战略大会', QM - 0.05, T(23.80)), ('我会从年盘拆解机会和风险', T(23.80), T(27.80)),
            ('带你看全局，定进退', T(27.80), XBJ - 0.05), ('先布局，再投入', XBJ - 0.05, INTRO0)]
    return assemble(n, behind, front, fx, subs, hits=[FAN, SHEN, PEI, Y20, Y27, QM], pushes=[[NA, ZHEN, 1.05]], dust=QM)

# ---------- 第 3 集 · P3 赚到的钱押错（C0011）----------
def ep3():
    n = 3; T = lambda x: t(n, 'C0011', x)
    MING, KZ, CP, HS, RC, NA, YC, BA, PEI = (T(x) for x in (6.32, 7.52, 9.04, 9.52, 10.54, 12.08, 13.58, 14.44, 16.72))
    NA2, Y20, Y27, QM, WO, JH, FX, DAI, GH, TI, JG, FS, SZ, ZAI = (T(x) for x in (18.80, 19.22, 19.56, 20.74, 22.78, 24.96, 26.08, 26.64, 28.16, 33.95, 35.24, 36.26, 37.42, 39.16))
    INTRO0 = starts(n, 'C0037')[0]
    BET0, SC0, BACK = NA - 0.1, WO - 0.3, SZ - 0.15
    behind = [hero('企业家们', 0.07, KZ - 0.1, 960, 170, 220, ls=0.1, glow=0.6),
              hero('扩张？', KZ, NA - 0.12, 400, 240, 170), hero('产品？', CP, NA - 0.12, 1500, 240, 170), hero('人才？', RC, NA - 0.12, 1500, 520, 170),
              hero('20', Y20, QM - 0.05, 500, 220, 340, ls=0.06, glow=0.5), hero('27', Y27, QM - 0.05, 1340, 220, 340, ls=0.06, glow=0.5),
              hero('奇门遁甲战略大会', QM, SC0, 960, 150, 120, ls=0.12, glow=0.5)]
    front = [cut(n, 'p3_bet', BET0, NA2 - 0.1, '老板把一整叠金币推上赌桌的一格，金币塔垮掉（演员）'), f'<InkVig from={{{r(BET0)}}} to={{{r(NA2 - 0.1)}}} />',
             f'<Seal text="押错" at={{{r(YC)}}} until={{{r(NA2 - 0.12)}}} x={{420}} y={{330}} size={{190}} rot={{-6}} />',
             hero('赔回去', PEI, NA2 - 0.12, 400, 680, 150, tone='red', anim='呐喊声波'),
             cut(n, 'p3_scale', SC0, BACK, '数字人 Suyen 在天平一边放金砝码、一边放玉盾（正能量）'),
             hero('机会', JH, DAI - 0.05, 380, 460, 130, anim='呐喊声波'), hero('风险', FX, DAI - 0.05, 380, 660, 130, tone='red', anim='呐喊声波'),
             hero('高回酬', GH, TI - 0.05, 400, 460, 130, anim='呐喊声波'), hero('背后的代价', T(29.28), TI - 0.05, 470, 660, 110, tone='red', anim='呐喊声波'),
             hero('进攻', JG, BACK, 380, 460, 130, anim='呐喊声波'), hero('防守', FS, BACK, 380, 660, 130, anim='呐喊声波'),
             hero('守住成绩', SZ, INTRO0, 960, 680, 110, ls=0.2, rotY=0, rotX=18, anim='呐喊声波'),
             hero('再争高峰', ZAI, INTRO0, 960, 830, 130, ls=0.2, rotY=0, rotX=18, anim='呐喊声波'),
             f'<Flare at={{0.07}} k={{0.5}} /><Flare at={{{r(NA2 - 0.1)}}} /><Flare at={{{r(QM)}}} k={{0.5}} /><Flare at={{{r(ZAI)}}} k={{0.4}} />']
    fx = ['{OPEN_DONG}', *(sfx(x - 0.03, '综艺咚') for x in (KZ, CP, RC)),
          sfx(BET0 - 0.05, '回忆-刷一下'), sfx(YC - 0.03, '木鱼敲击回响音效'), sfx(PEI - 0.03, '咚咚重音心头震'),
          sfx(NA2 - 0.12, '闪回'), sfx(Y20 - 0.03, '咚'), sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'), sfx(QM - 0.05, '咚'),
          sfx(SC0 - 0.05, '回忆-刷一下'), *(sfx(x - 0.03, '叮提示音4') for x in (JH, FX, GH)), *(sfx(x - 0.03, '木鱼敲击回响音效') for x in (JG, FS)),
          sfx(BACK - 0.05, '闪回'), sfx(SZ - 0.03, '正确'), sfx(ZAI - 0.03, '亮一下')]
    subs = [('企业家们', 0.05, T(4.55)), ('你今年赚到的钱', T(4.55), MING - 0.05), ('明年要拿去扩张、投资产品', MING - 0.05, HS - 0.05), ('还是扎人才呢？', HS - 0.05, NA - 0.1),
            ('那最怕一次的押错', NA - 0.1, BA - 0.05), ('把今年所赚的利润赔回去', BA - 0.05, NA2 - 0.1), ('那 2027 年', NA2 - 0.1, QM - 0.05), ('奇门遁甲战略大会', QM - 0.05, WO - 0.05),
            ('我会用年盘来拆解机会与风险', WO - 0.05, DAI - 0.05), ('带你审视高回酬背后的代价', DAI - 0.05, TI - 0.05), ('提前规划进攻与防守', TI - 0.05, SZ - 0.1),
            ('守住你的成绩', SZ - 0.1, ZAI - 0.05), ('再争下一个高峰', ZAI - 0.05, INTRO0)]
    return assemble(n, behind, front, fx, subs, hits=[0.07, KZ, CP, RC, YC, Y20, Y27, QM, SZ], pushes=[[NA, Y20, 1.04]], dust=QM)

# ---------- 第 6 集 · P6 全家的退路（C0029）：钩子照 SuyenEP6 v9 定稿 ----------
# v9 钩子的时间是钩子短片（C0029 1.95 起、1 倍速、没剪停顿）的秒数；这集剪了停顿又加速，所以照逐字一一对齐再内插，不是单纯 ÷1.1
import re as _re
def hookmap(n, hook, src):
    hw = json.load(open(f'{ROOT}/remotion/src/suyenh-hooks.json'))[hook]['words']
    from epwords import words
    ew = [w for w in words(n) if w[2] == src]
    clean = lambda x: _re.sub(r'[,，。?？!！、 ]', '', x)
    pairs, j = [], 0
    for w in hw:
        while j < len(ew) and clean(ew[j][4]) != clean(w['w']): j += 1
        if j == len(ew): break
        pairs.append((w['t'], ew[j][0])); j += 1
    def m(h):
        if h <= pairs[0][0]: return r(pairs[0][1] + (h - pairs[0][0]) / SP)
        for (a, x), (b, y) in zip(pairs, pairs[1:]):
            if h <= b: return r(x + (h - a) * (y - x) / (b - a))
        return r(pairs[-1][1] + (h - pairs[-1][0]) / SP)
    return m, len(pairs), len(hw)
def hookblocks(hookname, hid, endval, m):
    src = open(f'{ROOT}/remotion/src/SuyenHooksE.tsx').read()
    i = src.index(f'export const {hookname}:'); j = src.index('\n};', i); hook = src[i:j]
    def blk(name, nxt):
        a = hook.index(name + '={<>') + len(name) + 4; b = hook.index('</>}', a); return hook[a:b]
    def sc(x):
        x = x.replace(f'id="{hid}"', 'id="ep6"')
        x = _re.sub(r'\b(at|until|from|to|empty|road|shatter|fall|lock)=\{([\d.]+)( \+ [\d.]+)?\}', lambda g: f"{g.group(1)}={{{m(float(g.group(2)) + (float(g.group(3)[3:]) if g.group(3) else 0))}}}", x)
        x = _re.sub(r"END\('" + hid + r"'\)( \+ ([\d.]+))?", lambda g: str(r(endval + (float(g.group(2)) if g.group(2) else 0))), x)   # 钩子结尾 = 这集的时间，不再内插
        x = _re.sub(r'\[([\d.]+), ([\d.]+), ([\d.]+)\]\.map', lambda g: f"[{m(float(g.group(1)))}, {m(float(g.group(2)))}, {m(float(g.group(3)))}].map", x)
        return [l.strip() for l in x.strip().split('\n') if l.strip()]
    cam = _re.search(r"hits: \[([^\]]*)\], pushes: (\[\[.*?\]\])", hook)
    hits = [m(float(v)) for v in cam.group(1).split(',')]
    pushes = [[m(a), m(b), z] for a, b, z in json.loads(cam.group(2))]
    return sc(blk('behind', 'front')), sc(blk('front', 'sfx')), sc(blk('sfx', 'subs')), hits, pushes
# ---------- IC2 集数：钩子（约 15 秒、1.2 倍速）+ Reagan 给的新 intro+CTA 成片（照原样，不叠字、不加字幕、不加 BGM）----------
# 字、B-roll、音效只放在钩子里；IC2 一开始 Frame 的 asisFrom 就把人后层 / 抠像 / 前景 / 字幕全部关掉，只剩原片
def ic2_start(n): return next(p['start'] for p in pieces(n)['pieces'] if p['src'] == 'IC2')
# 玫红模式（Reagan 11-01：「玫红 skill 但改横版」）：左上标题条的 kicker + 题目
ROSE = {5: '别人求救，你救不救？', 9: 'AI 帮你赚钱还是花钱？', 13: '生肖牛鼠 · 第一次创业', 14: '35 岁以后 · 守业还是转型？', 15: '2027 做狼还是做羊？',
        4: '下一笔钱，该扎在哪里？', 6: '你的布局，算进全家退路了吗？', 10: '做了 20 年生意，守还是转型？', 11: '做领导的你 · 方向一错怎么办？', 12: '创业的女性 · 最怕人先倒下'}
ROSE_KICKER = '林舒苑老师 · 2027 奇门战略大会'
# 11-02 Reagan：钩子里下面的字幕跟大字重复 → 这几集钩子不放字幕（IC2 成片自带字幕不动）
NOSUB = {4, 6, 10, 11, 12}

def assemble_ic2(n, behind, front, fx, subs, hits, pushes, dust, origin='48% 30%', grade='() => [1, 1, 0]'):
    if n in NOSUB: subs = []
    return n, '', behind, front, fx, subs, dict(hits=hits, pushes=pushes, origin=origin, grade=grade, shrink=[], asis=ic2_start(n), rose=ROSE.get(n)), dust

# ---------- 第 5 集 · P5 拿公司钱救人（C0027）----------
def ep5():
    n = 5; T = lambda x: t(n, 'C0027', x); HE = ic2_start(n)
    BIE, NI0, NA, PEI, ZG, ZYC, QM, DAI, NI, HQ, ZAI = (T(x) for x in (11.62, 13.25, 13.94, 21.16, 22.28, 24.28, 24.94, 30.25, 31.46, 32.48, 34.18))
    PL0, BACK, LN0 = NI0, T(16.50), DAI - 0.05
    behind = [hero('别人求救', BIE, PL0 - 0.05, 960, 170, 190, ls=0.1, glow=0.5),
              hero('奇门战略大会', QM, LN0 - 0.05, 960, 150, 130, ls=0.14, glow=0.5)]
    front = [cut(n, 'p5_plea', PL0, BACK, '昏暗走廊，男人抓住老板手臂求救，老板握着公司支票簿犹豫（演员）'), f'<InkVig from={{{r(PL0)}}} to={{{r(BACK)}}} />',
             hero('拿公司的钱？', NA, BACK, 470, 520, 120, tone='red', anim='呐喊声波'),
             hero('赔上', PEI, ZYC - 0.05, 960, 640, 64, ls=0.3, rotY=0, rotX=18, anim='呐喊声波'),
             hero('整个团队的薪水', ZG, ZYC - 0.05, 960, 790, 120, ls=0.06, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             cut(n, 'p5_line', LN0, HE, '一只手用金笔划一道发光金线，把金棋子和黑棋子分成两边（只拍手）'),
             hero('先看代价', NI, HE, 430, 420, 120, anim='呐喊声波'), hero('划清界限', HQ, HE, 430, 600, 120, anim='呐喊声波'),
             hero('再决定出手', ZAI, HE, 470, 780, 110, anim='呐喊声波'),
             f'<Flare at={{{r(PL0)}}} k={{0.4}} /><Flare at={{{r(BACK)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DONG}', sfx(PL0 - 0.05, '回忆-刷一下'), sfx(NA - 0.03, '猛然一惊'), sfx(BACK - 0.05, '闪回'), sfx(PEI - 0.03, '咚'), sfx(ZG - 0.03, '咚咚重音心头震'),
          sfx(QM - 0.05, '咚'), sfx(LN0 - 0.05, '回忆-刷一下'), *(sfx(x - 0.03, '正确') for x in (NI, HQ)), sfx(ZAI - 0.03, '木鱼敲击回响音效')]
    subs = [('别人求救', 0.05, PL0), ('你要不要拿公司的钱去救呢？', PL0, T(20.03)), ('可能会让你赔上整个团队的薪水', T(20.03), ZYC - 0.05),
            ('这一次的奇门战略大会', ZYC - 0.05, LN0), ('带你先看代价', LN0, HQ - 0.1), ('划清界限，再决定出手', HQ - 0.1, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[BIE, QM], pushes=[[PEI, ZYC, 1.05]], dust=QM)

# ---------- 第 9 集 · P9 AI 是赚钱还是花钱（C0022）----------
def ep9():
    n = 9; T = lambda x: t(n, 'C0022', x); HE = ic2_start(n)
    ZQ, HQ, XT, KC, YY, MD, ZYC, QM, ZAI, JS, ZD = (T(x) for x in (13.34, 15.16, 16.12, 16.98, 19.80, 21.06, 22.30, 22.96, 33.28, 34.82, 36.54))
    SP0, FC0 = XT - 0.05, ZAI - 0.08
    behind = [hero('AI', 0.07, ZQ - 0.05, 960, 170, 220, ls=0.1, glow=0.5),
              hero('赚钱？', ZQ, SP0 - 0.05, 520, 230, 220, glow=0.5), hero('花钱？', HQ, SP0 - 0.05, 1400, 230, 220, tone='red', glow=0.5),
              hero('奇门战略大会', QM, FC0 - 0.05, 960, 150, 130, ls=0.14, glow=0.5)]
    front = [cut(n, 'p9_spend', SP0, YY, '老板坐在一排 AI 屏幕前，钞票化成光点被吸进屏幕，销售线一直平（演员）'),
             hero('系统买了', XT, YY, 430, 420, 120, anim='呐喊声波'), hero('课程上了', KC, YY, 430, 600, 120, anim='呐喊声波'),
             hero('营业额', YY + 0.05, ZYC - 0.05, 960, 640, 64, ls=0.3, rotY=0, rotX=18, anim='呐喊声波'),
             hero('没有动静', MD, ZYC - 0.05, 960, 790, 130, ls=0.06, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             cut(n, 'p9_focus', FC0, HE, '古铜金天平一边发光芯片、一边金币，慢慢平衡（没有人）'),
             hero('下一笔投入', JS, HE, 450, 420, 110, anim='呐喊声波'), hero('值不值得？', ZD, HE, 450, 610, 120, tone='cream', anim='呐喊声波'),
             f'<Flare at={{{r(ZQ)}}} k={{0.4}} /><Flare at={{{r(YY)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DONG}', sfx(ZQ - 0.03, '叮收银机提示音1'), sfx(HQ - 0.03, '咚咚重音心头震'), sfx(SP0 - 0.05, '故障音效'),
          *(sfx(x - 0.03, '叮提示音4') for x in (XT, KC)), sfx(YY - 0.05, '闪回'), sfx(MD - 0.03, '咚'), sfx(QM - 0.05, '咚'),
          sfx(FC0 - 0.05, '回忆-刷一下'), sfx(ZD - 0.03, '木鱼敲击回响音效')]
    subs = [('你追的 AI 到底是在帮你赚钱', 0.05, T(13.80)), ('还是在帮你花钱？', T(13.80), SP0), ('系统买了，课程上了', SP0, YY),
            ('营业额却没有动静', YY, ZYC - 0.05), ('这一次的奇门战略大会', ZYC - 0.05, FC0), ('再决定下一笔的技术投入', FC0, ZD - 0.1), ('到底值不值得', ZD - 0.1, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[ZQ, HQ, QM], pushes=[[YY, ZYC, 1.05]], dust=QM)

# ---------- 第 13 集 · I4 生肖牛鼠第一次创业（C0021）----------
def ep13():
    n = 13; T = lambda x: t(n, 'C0021', x); HE = ic2_start(n)
    NIU, SHU, DYC, SS, YZ, MD, JSW, LD, ZL, NI, QB = (T(x) for x in (5.44, 6.02, 13.32, 16.60, 18.54, 22.86, 24.04, 40.70, 42.08, 52.74, 53.60))
    RN0, BACK = MD - 0.08, T(25.40)
    behind = [hero('八字有', 0.07, DYC - 0.05, 960, 150, 110, ls=0.2),
              hero('牛', NIU, DYC - 0.05, 560, 300, 300, glow=0.5), hero('鼠', SHU, DYC - 0.05, 1360, 300, 300, glow=0.5),
              hero('第一次创业', DYC, SS - 0.05, 960, 170, 150, ls=0.1, glow=0.5),
              hero('先试水？', SS, RN0 - 0.05, 520, 240, 170, tone='cream', glow=0.4), hero('押重注？', YZ, RN0 - 0.05, 1400, 240, 170, tone='red', glow=0.4),
              hero('奇门遁甲战略大会', ZL - 0.2, NI - 0.1, 960, 150, 120, ls=0.12, glow=0.5),
              f'<Luoshu at={{{r(NI - 0.1)}}} shatter={{999}} until={{{r(HE)}}} x={{1480}} y={{430}} cell={{120}} />',
              hero('起步节奏', QB, HE, 960, 150, 150, ls=0.14, glow=0.5)]
    front = [cut(n, 'i4_reno', RN0, BACK, '年轻老板站在还在装修的店面里，满地纸箱（演员）'),
             hero('门店还没开', MD, BACK, 450, 420, 120, anim='呐喊声波'), hero('几十万已经出了', JSW, BACK, 480, 610, 100, tone='red', anim='呐喊声波'),
             f'<Flare at={{{r(NIU)}}} k={{0.4}} /><Flare at={{{r(BACK)}}} /><Flare at={{{r(ZL - 0.2)}}} k={{0.5}} />']
    fx = ['{OPEN_DONG}', sfx(NIU - 0.03, '咚'), sfx(SHU - 0.03, '综艺咚'), sfx(DYC - 0.03, '咚'), sfx(SS - 0.03, '叮提示音4'), sfx(YZ - 0.03, '咚咚重音心头震'),
          sfx(RN0 - 0.05, '复古胶片滚动', len=0.6), sfx(JSW - 0.03, '叮收银机提示音1'), sfx(BACK - 0.05, '闪回'), sfx(ZL - 0.25, '咚'),
          sfx(NI - 0.12, '亮一下'), sfx(QB - 0.03, '木鱼敲击回响音效')]
    subs = [('八字中有牛和老鼠的人', 0.05, DYC - 0.05), ('第一次想要创业', DYC - 0.05, T(15.10)), ('你应该先试水', T(15.10), T(17.20)),
            ('还是直接押重注？', T(17.20), RN0), ('门店还没开', RN0, JSW - 0.1), ('几十万已经出了', JSW - 0.1, BACK), ('来到老师的战略大会里', BACK, NI - 0.15),
            ('带你思考起步节奏', NI - 0.15, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[NIU, SHU, DYC, ZL - 0.2], pushes=[[SS, RN0, 1.05]], dust=ZL - 0.2)

# ---------- 第 14 集 · I5 35 岁以后（C0025）----------
def ep14():
    n = 14; T = lambda x: t(n, 'C0025', x); HE = ic2_start(n)
    SY, XYB, SHY, ZX, SN, CX, XF, WB, CN, ZB, DE = (T(x) for x in (5.74, 7.26, 8.20, 10.04, 11.45, 12.62, 14.52, 15.48, 29.16, 31.30, 32.58))
    BX0, BACK, RD0 = SN - 0.05, T(14.40), CN - 0.08
    behind = [hero('35 岁以后', SY, XYB - 0.05, 960, 180, 200, ls=0.08, glow=0.5),
              hero('守业？', SHY, BX0 - 0.05, 520, 240, 200, tone='cream', glow=0.4), hero('转型？', ZX, BX0 - 0.05, 1400, 240, 200, tone='red', glow=0.4)]
    front = [cut(n, 'i5_box', BX0, BACK, '三十多岁的上班族抱着纸箱走出办公大楼（演员）'),
             hero('10 年经验', SN, BACK, 430, 420, 120, anim='呐喊声波'), hero('重新换岗位', CX, BACK, 470, 600, 110, tone='red', anim='呐喊声波'),
             hero('下一份收入', XF, RD0 - 0.05, 960, 640, 64, ls=0.3, rotY=0, rotX=18, anim='呐喊声波'),
             hero('未必达到', WB, RD0 - 0.05, 960, 790, 130, ls=0.06, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             cut(n, 'i5_road', RD0, HE, '山口日出，主路旁分出第二条金色的路（没有人）'),
             hero('趁你还有选择', CN, HE, 470, 420, 100, tone='cream', anim='呐喊声波'), hero('先准备', ZB, HE, 400, 590, 110, anim='呐喊声波'),
             hero('第二条路', DE, HE, 470, 760, 140, glow=0.6, anim='呐喊声波'),
             f'<Flare at={{{r(SY)}}} k={{0.4}} /><Flare at={{{r(BACK)}}} /><Flare at={{{r(RD0)}}} k={{0.5}} />']
    fx = ['{OPEN_DROP}', sfx(SHY - 0.03, '咚'), sfx(ZX - 0.03, '综艺咚'), sfx(BX0 - 0.05, '回忆-刷一下'), sfx(CX - 0.03, '咚咚重音心头震'),
          sfx(BACK - 0.05, '闪回'), sfx(WB - 0.03, '咚'), sfx(RD0 - 0.05, '亮一下'), sfx(DE - 0.03, '木鱼敲击回响音效')]
    subs = [('35 岁以后', 0.05, XYB - 0.05), ('下一步该守业还是准备转型？', XYB - 0.05, BX0), ('10 年的经验重新换岗位', BX0, BACK),
            ('下一份收入未必达到你心目中想要的', BACK, RD0), ('趁你还有选择', RD0, ZB - 0.1), ('先准备第二条路', ZB - 0.1, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[SY, SHY, ZX], pushes=[[XF, RD0, 1.05]], dust=RD0)

# ---------- 第 15 集 · S2 做狼还是做羊（C0023 + C0024）----------
def ep15():
    n = 15; T = lambda x: t(n, 'C0023', x); U = lambda x: t(n, 'C0024', x); HE = ic2_start(n)
    SZ, QZ, PZ, Y20, Y27, LANG, YANG, ZY, BLC, ZL, BMR, YL, PY = (T(10.06), T(12.40), T(13.46), T(20.04), T(20.50), T(21.60), T(22.32),
                                                                  U(3.30), U(4.84), U(6.18), U(7.12), T(94.74), T(95.70))
    FL0, BACK, HT0, BACK2 = QZ - 0.05, T(15.40), ZY - 0.08, U(8.00)
    behind = [hero('三只羊', SZ, FL0 - 0.05, 1420, 200, 170, glow=0.5),
              hero('20', Y20, LANG - 0.05, 520, 220, 300, ls=0.06, glow=0.5), hero('27', Y27, LANG - 0.05, 1400, 220, 300, ls=0.06, glow=0.5),
              hero('做狼？', LANG, HT0 - 0.05, 520, 240, 200, tone='red', glow=0.4), hero('做羊？', YANG, HT0 - 0.05, 1400, 240, 200, tone='cream', glow=0.4),
              hero('披着羊皮的狼', PY, HE, 470, 230, 116, ls=0.06, glow=0.6)]
    front = [cut(n, 's2_flock', FL0, BACK, '晨雾草坡三只羊，中间那只是披着羊皮的狼（没有人）'),
             hero('其中一只', QZ + 0.1, BACK, 430, 420, 110, tone='cream', anim='呐喊声波'), hero('是狼', PZ + 0.5, BACK, 400, 600, 160, tone='red', anim='呐喊声波'),
             cut(n, 's2_hunt', HT0, BACK2, '黄昏山坡，狼扑向羊群、牧羊人在远处举弓（没有正脸）'),
             hero('做羊 → 被狼吃', ZY + 0.1, BACK2, 520, 420, 96, tone='cream', anim='呐喊声波'), hero('做狼 → 被牧羊人杀', ZL, BACK2, 560, 600, 90, tone='red', anim='呐喊声波'),
             f'<Flare at={{{r(FL0)}}} k={{0.4}} /><Flare at={{{r(BACK)}}} /><Flare at={{{r(BACK2)}}} />']
    fx = ['{OPEN_DONG}', sfx(SZ - 0.03, '综艺咚'), sfx(FL0 - 0.05, '回忆-刷一下'), sfx(PZ + 0.47, '咚咚重音心头震'), sfx(BACK - 0.05, '闪回'),
          sfx(Y20 - 0.03, '咚'), sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'), sfx(LANG - 0.03, '咚'), sfx(YANG - 0.03, '咚'),
          sfx(HT0 - 0.05, '猛然一惊'), sfx(BLC - 0.03, '咚咚重音心头震'), sfx(BMR - 0.03, '咚咚重音心头震'), sfx(BACK2 - 0.05, '闪回'), sfx(PY - 0.03, '咚咚重音心头震')]
    subs = [('你看我的封面', 0.05, SZ - 0.1), ('三只羊，对不对？', SZ - 0.1, FL0), ('其中一只是披着羊皮的狼', FL0, Y20 - 0.1), ('2027 年', Y20 - 0.1, T(21.0)),
            ('你要做狼还是做羊？', T(21.0), HT0), ('你做羊就被狼吃', HT0, U(5.30)), ('你做狼就被牧羊人杀', U(5.30), BACK2 + 0.3), ('就有了这一只披着羊皮的狼', BACK2 + 0.3, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[SZ, Y20, Y27, LANG, YANG, PY], pushes=[[YL, HE, 1.05]], dust=PY)

# ---------- 11-02 新版：第 4、6、10、11、12 集（IC2，痛点放第 0 秒）----------
def ep4():
    n = 4; T = lambda x: t(n, 'C0014', x); HE = ic2_start(n)
    DD, XS, ZJ, ZHUI, XYB, NB, QM, DAI, TR, BIE, XJ, SG = (T(x) for x in (8.58, 10.70, 11.22, 12.04, 19.26, 20.70, 24.02, 29.30, 31.00, 32.50, 35.46, 36.84))
    BILL0, BACK, BURN0 = XS - 0.1, XYB - 0.1, BIE - 0.15
    behind = [hero('订单还没收到钱', 0.07, BILL0 - 0.05, 960, 170, 140, ls=0.06, glow=0.5),
              hero('下一笔钱', XYB, QM - 0.05, 520, 240, 150, glow=0.4), hero('还能不能扎？', NB, QM - 0.05, 1420, 240, 130, tone='red', glow=0.4),
              hero('奇门遁甲战略大会', QM, DAI - 0.05, 960, 150, 120, ls=0.12, glow=0.5),
              f'<Luoshu at={{{r(DAI)}}} shatter={{999}} until={{{r(BURN0)}}} x={{1480}} y={{430}} cell={{120}} />',
              hero('投入的次序', TR, BURN0, 960, 150, 140, ls=0.12, glow=0.5)]
    front = [cut(n, 'p4_bills', BILL0, BACK, '小老板一个人坐在空办公室，桌上一叠催缴信封，手机一直亮（演员）'), f'<InkVig from={{{r(BILL0)}}} to={{{r(BACK)}}} />',
             hero('薪水', XS, BACK - 0.02, 380, 400, 130, tone='cream', anim='呐喊声波'), hero('租金', ZJ, BACK - 0.02, 380, 580, 130, tone='cream', anim='呐喊声波'),
             hero('追到门口', ZHUI, BACK - 0.02, 440, 770, 120, tone='red', anim='呐喊声波'),
             cut(n, 'p4_burn', BURN0, HE, '金属盘里的钞票烧成灰，最后火被一只金色罗盘盖住熄掉（没有人）'),
             f'<Embers from={{{r(XJ - 0.3)}}} to={{{r(HE)}}} />',
             hero('现金', XJ, HE, 380, 460, 150, tone='cream', anim='呐喊声波'), hero('被烧光', SG, HE, 420, 680, 150, tone='red', anim='呐喊声波'),
             f'<Flare at={{{r(BILL0)}}} k={{0.4}} /><Flare at={{{r(BACK)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DROP}', sfx(BILL0 - 0.05, '回忆-刷一下'), sfx(BILL0 + 0.1, '诡异的滴水声'), *(sfx(x - 0.03, '咚咚重音心头震') for x in (XS, ZJ)), sfx(ZHUI - 0.03, '猛然一惊'),
          sfx(BACK - 0.05, '闪回'), sfx(XYB - 0.03, '综艺咚'), sfx(NB - 0.03, '疑惑'), sfx(QM - 0.05, '咚'), sfx(DAI, '叮叮'), sfx(TR - 0.03, '木鱼敲击回响音效'),
          sfx(BURN0 - 0.05, '旋风'), sfx(XJ - 0.03, '咚'), sfx(SG - 0.03, '咚咚重音心头震')]
    subs = [('订单还没收到钱', 0.05, XS - 0.05), ('薪水租金已经追到门口', XS - 0.05, BACK), ('下一笔钱还能不能扎？', BACK, QM - 0.05), ('奇门遁甲战略大会', QM - 0.05, DAI - 0.05),
            ('带你重新审视投入的次序', DAI - 0.05, BIE - 0.05), ('别让生意还没等到突破', BIE - 0.05, XJ - 0.05), ('现金已经被烧光', XJ - 0.05, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[XYB, NB, QM], pushes=[[XS, BACK, 1.05]], dust=QM)

def ep6():
    n = 6; T = lambda x: t(n, 'C0029', x); HE = ic2_start(n)
    DONG, XF, YL, CX, QJ, SJ, QM, DAI, TQ, JT = (T(x) for x in (12.10, 13.20, 14.50, 17.30, 7.80, 8.90, 19.86, 26.16, 27.10, 29.50))
    END1, PT0 = ends(n, 'C0029')[0], DONG - 0.05
    FAM0 = DAI - 0.05
    behind = [hero('一笔的投入', 0.07, PT0 - 0.05, 960, 170, 170, ls=0.1, glow=0.5),
              hero('全家的退路', QJ, QM - 0.05, 960, 170, 160, ls=0.1, glow=0.5),
              hero('算进去了吗？', SJ, QM - 0.05, 1420, 420, 110, tone='red', glow=0.4),
              hero('奇门战略大会', QM, FAM0 - 0.05, 960, 150, 130, ls=0.14, glow=0.5)]
    front = [cut(n, 'p6_points', PT0, END1, '学费 / 医院账单 / 存款崩盘'), f'<InkVig from={{{r(PT0)}}} to={{{r(END1)}}} />',
             hero('孩子的学费', XF, END1, 430, 400, 110, tone='cream', anim='呐喊声波'), hero('父母的养老', YL, END1, 430, 580, 110, tone='cream', anim='呐喊声波'),
             hero('十年的储蓄', CX, END1, 450, 760, 120, tone='red', anim='呐喊声波'),
             cut(n, 'p6_family', FAM0, HE, '三代同堂在温暖的家里吃饭，窗外是金色灯光（演员，正能量）'),
             hero('提前思考', TQ, HE, 420, 430, 120, anim='呐喊声波'), hero('进退', JT, HE, 380, 620, 150, anim='呐喊声波'),
             f'<Flare at={{{r(PT0)}}} k={{0.4}} /><Flare at={{{r(END1)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DONG}', sfx(PT0 - 0.05, '回忆-刷一下'), *(sfx(x - 0.03, '咚咚重音心头震') for x in (XF, YL)), sfx(CX - 0.03, '猛然一惊'), sfx(END1 - 0.05, '闪回'),
          sfx(QJ - 0.03, '综艺咚'), sfx(SJ - 0.03, '疑惑'), sfx(QM - 0.05, '咚'), sfx(FAM0 - 0.05, '亮一下'), sfx(TQ - 0.03, '正确'), sfx(JT - 0.03, '木鱼敲击回响音效')]
    subs = [('一笔的投入', 0.05, PT0), ('动的可能是孩子的学费', PT0, T(14.45)), ('父母的养老', T(14.45), T(16.0)), ('还有可能是你十年的储蓄', T(16.0), END1),
            ('有没有把全家的退路算进去？', END1, QM - 0.05), ('奇门战略大会', QM - 0.05, FAM0), ('带你提前思考进退', FAM0, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[QJ, QM], pushes=[[XF, END1, 1.05]], dust=QM)

def ep10():
    # 11-02 Reagan：句子没讲完就跳走 → 钩子约 20 秒、每句讲完整；0:08 前后「很多爆炸声」→ 音效减到 6 个
    n = 10; T = lambda x: t(n, 'C0018', x); HE = ic2_start(n)
    LR, BO, ER, WZ, SHOU, HS, QM, GJ, XB = (T(x) for x in (19.00, 19.50, 12.04, 15.32, 21.96, 22.30, 25.24, 36.70, 39.10))
    END1 = ends(n, 'C0018')[0]; SH0 = LR - 0.05; RT0 = T(34.15) - 0.05
    behind = [hero('老顾客越来越少', 0.07, SH0 - 0.05, 960, 170, 140, ls=0.06, glow=0.5),
              hero('20 年的生意', ER, WZ - 0.05, 960, 170, 160, ls=0.08, glow=0.5),
              hero('你的位置？', WZ, SHOU - 0.05, 960, 170, 160, ls=0.08, tone='cream', glow=0.5),
              hero('守？', SHOU, QM - 0.05, 520, 240, 200, tone='cream', glow=0.4), hero('还是转型？', HS, QM - 0.05, 1400, 260, 150, tone='red', glow=0.4),
              hero('奇门遁甲战略大会', QM, RT0 - 0.05, 960, 150, 120, ls=0.12, glow=0.5)]
    front = [cut(n, 'i1_shop', SH0, END1, '六十岁老板在老字号店里，店里冷清，他看着门外空荡的街（演员）'), f'<InkVig from={{{r(SH0)}}} to={{{r(END1)}}} />',
             hero('利润', LR, END1, 400, 430, 140, tone='cream', anim='呐喊声波'), hero('越来越薄', BO, END1, 450, 630, 130, tone='red', anim='呐喊声波'),
             cut(n, 'i1_roots', RT0, HE, '老榕树的树根亮起金光，一根新枝在日出里往上长（没有人，正能量）'),
             hero('20 年的根基', GJ - 0.3, HE, 450, 420, 110, anim='呐喊声波'), hero('下一步的突破', XB, HE, 470, 620, 110, glow=0.5, anim='呐喊声波'),
             f'<Flare at={{{r(SH0)}}} k={{0.4}} /><Flare at={{{r(END1)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DROP}', sfx(SH0 - 0.05, '回忆-刷一下'), sfx(END1 - 0.05, '闪回'), sfx(SHOU - 0.03, '咚'), sfx(QM - 0.05, '咚'), sfx(RT0 - 0.05, '亮一下')]
    subs = []
    return assemble_ic2(n, behind, front, fx, subs, hits=[SHOU, QM], pushes=[[ER, SHOU, 1.05]], dust=QM)

def ep11():
    # 11-02 Reagan：钩子可以到 0:18，每句讲完整；音效太多 → 减到 7 个
    n = 11; T = lambda x: t(n, 'C0019', x); HE = ic2_start(n)
    XS, SQ, SH, LD, Y27, JS, JB, GZ, QM, LX, ZJ = (T(x) for x in (17.94, 19.58, 20.02, 5.85, 10.22, 12.30, 13.50, 14.30, 23.30, 32.90, 35.60))
    END1 = ends(n, 'C0019')[0]; TM0 = T(17.80) - 0.1; LD0 = T(32.50) - 0.05
    behind = [hero('做领导的你', LD, JS - 0.05, 960, 160, 130, ls=0.08, glow=0.5),
              hero('几十个人', JS, QM - 0.05, 520, 240, 150, glow=0.4), hero('几百个人', JB, QM - 0.05, 1400, 240, 150, tone='cream', glow=0.4),
              hero('奇门遁甲战略大会', QM, LD0 - 0.05, 960, 150, 120, ls=0.12, glow=0.5)]
    front = [hero('方向一错', 0.07, TM0 - 0.02, 960, 760, 140, ls=0.06, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             cut(n, 'i2_team', TM0, END1, '老板带整队冲出门撞进雾里'), f'<InkVig from={{{r(TM0)}}} to={{{r(END1)}}} />',
             hero('整年的薪水', XS, END1, 430, 400, 110, tone='cream', anim='呐喊声波'), hero('士气', SQ, END1, 380, 580, 130, tone='cream', anim='呐喊声波'),
             hero('一起烧掉', SH, END1, 450, 770, 130, tone='red', anim='呐喊声波'),
             hero('2027 一个决定', Y27, JS - 0.05, 960, 790, 110, ls=0.06, rotY=0, rotX=18, anim='呐喊声波'),
             hero('跟着你冲', GZ, QM - 0.05, 960, 790, 120, ls=0.06, rotY=0, rotX=18, anim='呐喊声波'),
             cut(n, 'i2_lead', LD0, HE, '女领导站在团队前面指向窗外一道金光，团队转向同一个方向（演员，正能量）'),
             hero('审视方向', LX, HE, 430, 420, 120, anim='呐喊声波'), hero('聚焦团队火力', ZJ, HE, 480, 620, 100, glow=0.5, anim='呐喊声波'),
             f'<Flare at={{{r(TM0)}}} k={{0.4}} /><Flare at={{{r(END1)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DONG}', sfx(TM0 - 0.05, '旋风'), sfx(SH - 0.03, '咚咚重音心头震'), sfx(END1 - 0.05, '闪回'),
          sfx(JB - 0.03, '咚'), sfx(QM - 0.05, '咚'), sfx(LD0 - 0.05, '亮一下')]
    subs = [('方向一错', 0.05, TM0), ('整年的薪水和士气一起烧掉', TM0, END1), ('做领导的你', END1, Y27 - 0.3), ('2027 年你的一个决定', Y27 - 0.3, JS - 0.1),
            ('几十个人甚至几百个人', JS - 0.1, GZ - 0.1), ('跟着你就是冲', GZ - 0.1, T(22.56)),
            ('这一次的奇门遁甲战略大会', T(22.56), LD0), ('带你领先审视方向', LD0, ZJ - 0.1), ('再聚焦团队的火力', ZJ - 0.1, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[JB, QM], pushes=[[0.07, TM0, 1.04]], dust=QM)

def ep12():
    # 11-02 Reagan：钩子可以到 0:20，每句讲完整（「全压进去」「倒下去」之前被切到）；音效减到 7 个
    n = 12; T = lambda x: t(n, 'C0020', x); HE = ic2_start(n)
    SY, EP, DX, CY, TX, CB, SJ, TL, YA, ZYC, QM, ST0, ZG = (T(x) for x in (27.10, 28.70, 29.30, 14.45, 18.34, 20.80, 22.10, 23.20, 24.20, 31.44, 32.50, 38.30, 44.50))
    END1 = ends(n, 'C0020')[0]; LT0 = T(20.50) - 0.08; ST0 -= 0.08
    behind = [hero('最怕的不是', 0.07, EP - 0.05, 470, 150, 100, ls=0.2),
              hero('事业没做起来', SY, EP - 0.05, 500, 380, 120, ls=0.06, glow=0.5),
              hero('创业的女性', CY, LT0 - 0.05, 960, 160, 130, ls=0.08, glow=0.5),
              hero('奇门战略大会', QM, ST0 - 0.05, 960, 150, 130, ls=0.14, glow=0.5)]
    front = [hero('而是', EP, END1, 960, 640, 64, ls=0.3, rotY=0, rotX=18, anim='呐喊声波'),
             hero('人先倒下去', DX, END1, 960, 790, 130, ls=0.06, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             hero('太想做出成绩', TX, LT0 - 0.05, 960, 790, 110, ls=0.06, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             cut(n, 'i3_late', LT0, ZYC, '三十多岁的女老板深夜一个人在小工作室，趴在笔电旁（演员，不是 Suyen）'), f'<InkVig from={{{r(LT0)}}} to={{{r(ZYC)}}} />',
             hero('储备金', CB, ZYC, 380, 400, 120, tone='cream', anim='呐喊声波'), hero('时间', SJ, ZYC, 380, 560, 120, tone='cream', anim='呐喊声波'),
             hero('退路', TL, ZYC, 380, 720, 120, tone='cream', anim='呐喊声波'), hero('全压进去', YA, ZYC, 1450, 760, 120, tone='red', anim='呐喊声波'),
             cut(n, 'i3_step', ST0, HE, '女老板站在河中发光的踏脚石上，日出金光（演员，正能量）'),
             hero('看准进退', T(38.60), HE, 430, 420, 120, anim='呐喊声波'), hero('最关键的一步', ZG - 0.4, HE, 480, 620, 110, glow=0.5, anim='呐喊声波'),
             f'<Flare at={{{r(EP)}}} k={{0.4}} /><Flare at={{{r(ZYC)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DROP}', sfx(DX - 0.03, '咚咚重音心头震'), sfx(LT0 - 0.05, '回忆-刷一下'), sfx(LT0 + 0.1, '诡异的滴水声'),
          sfx(ZYC - 0.05, '闪回'), sfx(QM - 0.05, '咚'), sfx(ST0 - 0.05, '亮一下')]
    subs = [('最怕的不是事业没做起来', 0.05, EP - 0.05), ('而是人先倒下去', EP - 0.05, END1), ('创业的女性应该如何布局？', END1, T(17.90)),
            ('你太想做出成绩', T(17.90), LT0), ('把储备金、时间、退路全压进去', LT0, ZYC),
            ('这一次的奇门战略大会', ZYC, ST0), ('带你看准进退', ST0, T(43.10) - 0.1), ('集中在最关键的一步', T(43.10) - 0.1, HE)]
    return assemble_ic2(n, behind, front, fx, subs, hits=[DX, QM], pushes=[[EP, END1, 1.05]], dust=QM)

EPS = [ep2, ep3, ep4, ep5, ep6, ep9, ep10, ep11, ep12, ep13, ep14, ep15]

HEAD = '''// 广告第 2–14 集（16:9 · 每集 ≤60 秒 · 1.1 倍速）。⚠ 这个档案是 pipeline/gen_eps.py 产生的，不要手改，改产生器再重跑
// 结构照第 1 集：钩子 + 教方法 → 我们是谁（C0037 + 照片墙）→ CTA；只用 C0001–C0048；名字一律「林舒苑」
import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { Frame, Hero, Cutaway, NameTag, EventLogo, PhotoBG, PhotoWall, Sfx, Seal, Luopan, Luoshu, Slip, Incense, House, InkVig, InkBrush, Flare, Embers, OPEN_DROP, OPEN_DONG, fastToSlow, useT, win, ease, eio, f, clamp, regEp, LTH, CREAM } from './SuyenHooksE';
import { interpolate } from 'remotion';
import type { Cam, Grade } from './SuyenHooksE';
%IMPORTS%
// B-roll 还没生成（studio 还没 Run）时的占位卡：分镜检查图上看得到这段要放什么
const Ph: React.FC<{ label: string }> = ({ label }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, #3A2A18 0%, #120E0A 75%)', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ border: '3px dashed rgba(232,199,126,0.7)', padding: '36px 56px', maxWidth: 1200, textAlign: 'center', fontFamily: LTH, color: CREAM, fontSize: 46, lineHeight: 1.5 }}>
      <div style={{ fontSize: 30, letterSpacing: '0.3em', color: '#E8C77E', marginBottom: 14 }}>B-ROLL 待生成</div>{label}
    </div>
  </AbsoluteFill>
);
// 全画面 B-roll，没有圆框：CTA-2（C0039）那段原片只有 logo 墙、没有人，圆框里没人可跟
const Shot: React.FC<{ src: string; from: number; to: number; bg?: React.ReactNode; cont?: boolean; last?: boolean }> = ({ src, from, to, bg, cont, last = true }) => {
  const t = useT();
  if (t < from - 0.01 || t > to) return null;
  const o = win(t, from, to, cont ? 0.001 : 0.2, last ? 0.2 : 0.001), k = 1.02 + 0.06 * ease(t, from, to - from, eio);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Sequence from={f(from)} durationInFrames={Math.max(1, f(to - from))} layout="none">
        <AbsoluteFill style={{ transform: `scale(${k})` }}>{bg ?? <OffthreadVideo src={staticFile(`suyenbr/${src}.mp4`)} muted playbackRate={Math.min(1, 5.9 / (to - from))} />}</AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 80% at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,8,6,0.45) 100%)' }} />
    </AbsoluteFill>
  );
};
'''

def build():
    imports, body, names = [], [], []
    for fn in EPS:
        n, phdef, behind, front, fx, subs, cam, dust = fn()
        imports += [f"import FC_EP{n} from './suyenh-face-ep{n}.json';", f"import TK_EP{n} from './suyenh-track-ep{n}.json';"]
        body.append(f'''
/* ================= 第 {n} 集（{dur(n)} 秒）================= */
regEp('ep{n}', {dur(n)}, FC_EP{n}, TK_EP{n});
{phdef}
export const SuyenEp{n}: React.FC = () => {{
  const cam: Cam = {{ hits: {[r(x) for x in cam['hits']]}, pushes: {[[r(a), r(b), z] for a, b, z in cam['pushes']]}, origin: '{cam['origin']}', shrink: {[[r(a), r(b), z] for a, b, z in cam.get('shrink', [])]} }};
  const grade: Grade = {cam['grade']};
  return (
    <Frame id="ep{n}" cam={{cam}} grade={{grade}} dust={{{r(dust)}}}{f' asisFrom={{{r(cam["asis"])}}}' if cam.get('asis') else ''}{f" rose={{{{ kicker: '{ROSE_KICKER}', title: '{cam['rose']}' }}}}" if cam.get('rose') else ''}
      behind={{<>
        {chr(10).join('        ' + x for x in behind).lstrip()}
      </>}}
      front={{<>
        {chr(10).join('        ' + x for x in front).lstrip()}
      </>}}
      sfx={{<>
        {chr(10).join('        ' + x for x in fx).lstrip()}
      </>}}
      subs={{[{subs_js(subs)}]}}
    />
  );
}};''')
        names.append(n)
    open(f'{ROOT}/remotion/src/SuyenEps.tsx', 'w').write(HEAD.replace('%IMPORTS%', '\n'.join(imports)) + '\n'.join(body) + '\n')
    # Root.tsx：在两个记号中间重写
    p = f'{ROOT}/remotion/src/Root.tsx'; s = open(p).read()
    a, b = '{/* eps:start */}', '{/* eps:end */}'
    if a not in s:
        s = s.replace("import { SuyenEVS4", "import * as EPS from './SuyenEps';\nimport { SuyenEVS4", 1)
        s = s.replace('  </>\n);', f'    {a}\n    {b}\n  </>\n);', 1)
    i, j = s.index(a) + len(a), s.index(b)
    comps = ''.join(f"\n    <Composition id=\"SuyenEp{n}\" component={{EPS.SuyenEp{n}}} durationInFrames={{suyenEFrames('ep{n}')}} fps={{30}} width={{1920}} height={{1080}} />" for n in names)
    comps += ''.join(f"\n    <Composition id=\"{c}IntroV2\" component={{withIntroV2({k})}} durationInFrames={{suyenEFrames('{e}')}} fps={{30}} width={{1920}} height={{1080}} />" for c, k, e in (('SuyenEp1', 'SuyenEp1', 'ep1'), ('SuyenEp2', 'EPS.SuyenEp2', 'ep2')))   # intro-v2 版（只有第 1、2 集）
    s = s[:i] + comps + '\n    ' + s[j:]
    open(p, 'w').write(s)
    print('ok', names)

if __name__ == '__main__': build()
