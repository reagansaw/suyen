"""广告第 2–14 集的合成产生器 → remotion/src/SuyenEps.tsx（整个档案每次重写，可以一直重跑）+ Root.tsx 登记。
用法（在 repo 根目录）：python3 pipeline/gen_eps.py
- 时间一律是成片秒（已经 ÷1.1）：t(n, 原片, 原片秒) 照 pipeline/epN/pieces.json 换算；字的时间看 `python3 pipeline/epwords.py N`
- 每集 = 钩子 + 教方法（各集自己设计，照 epN/第N集-脚本.md）+ 共用的 我们是谁（C0037）+ CTA
- C0039（CTA-2）整段只拍到 Suyen 的 logo 墙，没有人：那段没有圆框，B-roll 用全画面 Shot，大字随便放
- B-roll 还没下载（studio 还没 Run）的，画面先放「待生成」占位卡，分镜检查图看得出来是哪一段"""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(H, '..')
BR = os.path.join(ROOT, 'remotion', 'public', 'suyenbr')
SP = 1.1

def pieces(n): return json.load(open(f'{H}/ep{n}/pieces.json'))
def t(n, src, x):
    for p in pieces(n)['pieces']:
        if p['src'] == src and p['a'] - 0.06 <= x <= p['b'] + 0.06: return round(p['start'] + (x - p['a']) / SP, 2)
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
def cut(n, src, a, b, label, **kw):
    if not os.path.exists(f'{BR}/{src}.mp4') and src in STANDIN: src = STANDIN[src]
    extra = ''.join(f' {k}' if v is True else f' {k}={{{str(v).lower()}}}' for k, v in kw.items())
    return f'<Cutaway id="ep{n}" src="{src}" from={{{r(a)}}} to={{{r(b)}}} focus={{[990, 430]}}{bg(src, label)}{extra} />'
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
    PH = [('hd-suyen-1', SN - 0.1, KC - 0.85, '16 年'), ('hd-QiMen_Training1', KC - 0.85, JW - 0.1, '千多场课程'), ('hd-fengshui_training-Qimen1', JW - 0.1, SJ - 0.1, '几万个学员'),
          ('hd-masterSuyenLim_qm1', SJ - 0.1, SS - 0.1, '来自世界各地'), ('hd-CNY_Program', SS - 0.1, nxt, '上市公司 大家族 小家庭')]
    ph = ', '.join(f"['{a}', {r(b)}, {r(c)}, '{d}']" for a, b, c, d in PH)
    front = [f'<NameTag at={{{r(LIN)}}} until={{{r(SN - 0.2)}}} x={{1280}} y={{640}} light />',
             f'<Cutaway id="ep{n}" src="" from={{{r(SN - 0.1)}}} to={{{r(nxt)}}} focus={{[990, 430]}} bg={{<PhotoWall shots={{PH{n}}} base={{{r(SN - 0.1)}}} />}} />',
             f'{{PH{n}.map(([, a, b, label]) => <Hero key={{a}} text={{label}} at={{a + 0.15}} until={{b}} x={{690}} y={{110}} size={{label.length > 6 ? 70 : 96}} ls={{0.12}} anim="呐喊声波" />)}}']
    fx = [sfx(s0 - 0.05, '闪回'), sfx(LIN - 0.03, '一声响铃'), sfx(SN - 0.15, '回忆-刷一下'), f'{{PH{n}.slice(1).map(([, a]) => <Sfx key={{a}} at={{a - 0.03}} s="扫光音效4" />)}}']
    subs = [('大家好，我是林舒苑', s0, t(n, 'C0037', 5.40)), ('您的人生战略导师', t(n, 'C0037', 5.40), t(n, 'C0037', 7.20)),
            ('我在过去 16 年培训超过千多场课程', t(n, 'C0037', 7.20), t(n, 'C0037', 11.30)), ('也帮助过几万个学员', t(n, 'C0037', 11.30), t(n, 'C0037', 13.60)),
            ('来自于世界各地', t(n, 'C0037', 13.60), s1), ('从上市公司、大家族到小家庭', s1, nxt)]
    return f'const PH{n}: [string, number, number, string][] = [{ph}];', [], front, fx, subs, [s0, nxt]

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
    P = [p for p in pieces(n)['pieces'] if p['src'] == 'C0048']; P7S, P8S, P9S = P[0]['start'], P[2]['start'], P[3]['start']; E = dur(n) + 0.6
    SAN, Y27, CHIMA, ZZ, LS, MS = (t(n, 'C0048', x) for x in (6.08, 8.88, 16.56, 19.40, 21.24, 27.92))
    behind = [hero('3 天完全免费', SAN, P8S, 960, 150, 120, ls=0.1, glow=0.5), hero('2027 奇门战略大会', Y27, P8S, 420, 440, 84, ls=0.08, rule=True),
              hero('马上报名', MS, E, 960, 160, 150, ls=0.2, glow=0.6)]
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
    P = [p for p in pieces(n)['pieces'] if p['src'] == 'C0048']; P7S, PMS = P[0]['start'], P[2]['start']; E = dur(n) + 0.6
    SAN, Y27, MS, JIAN = (t(n, 'C0048', x) for x in (6.08, 8.88, 27.92, 30.80))
    behind = [hero('3 天完全免费', SAN, PMS, 960, 150, 120, ls=0.1, glow=0.5), hero('2027 奇门战略大会', Y27, PMS, 420, 440, 84, ls=0.08, rule=True),
              hero('马上报名', MS, E, 960, 160, 150, ls=0.2, glow=0.6)]
    front = [f'<Flare at={{{r(SAN)}}} k={{0.45}} /><Flare at={{{r(MS)}}} k={{0.55}} />']
    fx = [sfx(P7S - 0.05, '闪回'), sfx(SAN - 0.03, '综艺咚'), sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'), sfx(MS - 0.03, '叮收银机提示音1'), sfx(JIAN, '亮一下')]
    T = lambda x: t(n, 'C0048', x)
    subs = [('我为大家准备了三天完全免费的', P7S, T(8.80)), ('2027 年奇门战略大会', T(8.80), PMS), ('那么马上报名', PMS, T(29.40)), ('我们到时见！', T(29.40), JIAN + 0.6)]
    return behind, front, fx, subs, [SAN, MS]

# ---------- 每集 = 自己的钩子 + 教方法，后面接共用的 我们是谁 + CTA ----------
def assemble(n, behind, front, fx, subs, hits, pushes, dust, origin='48% 30%', cta=None, grade='() => [1, 1, 0]'):
    if cta is None:   # 照 pieces.json 用的是哪个 CTA
        k = sum(p['src'] == 'C0048' for p in pieces(n)['pieces'])
        cta = cta1 if k == 4 else cta1s if k == 3 else cta2
    c0 = starts(n, 'C0037')[0]
    nxt = next(p['start'] for p in pieces(n)['pieces'] if p['start'] > c0 and p['src'] != 'C0037')
    phdef, _, ifr, ifx, isub, _ = intro(n, nxt)
    cb, cf, cfx, csub, chits = cta(n)
    return n, phdef, behind + cb, front + ifr + cf, fx + ifx + cfx, subs + isub + csub, dict(hits=hits + [c0] + chits, pushes=pushes, origin=origin, grade=grade), dust

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

# ---------- 第 4 集 · P4 现金被烧光（C0014）----------
def ep4():
    n = 4; T = lambda x: t(n, 'C0014', x)
    Y20, Y27, CONG, GONG, SHOU, DD, XS, ZJ, ZHUI = (T(x) for x in (2.88, 3.36, 4.20, 6.86, 7.82, 8.58, 10.70, 11.22, 12.04))
    XYB, YG, ZNL, QM, WO, ND, DAI, TR, BIE, XJ, SG = (T(x) for x in (19.26, 21.86, 22.40, 23.98, 25.80, 27.82, 29.16, 31.00, 32.50, 35.46, 36.84))
    INTRO0 = starts(n, 'C0037')[0]
    BILL0, BACK, YC0, BURN0 = DD - 0.1, XYB - 0.1, WO - 0.3, BIE - 0.15
    behind = [hero('20', Y20, CONG - 0.05, 470, 220, 340, ls=0.06, glow=0.5), hero('27', Y27, CONG - 0.05, 1310, 220, 340, ls=0.06, glow=0.5),
              hero('攻？', GONG, BILL0, 430, 260, 220, glow=0.5), hero('还是守？', SHOU, BILL0, 1480, 280, 150, tone='cream'),
              hero('下一笔钱', XYB, QM - 0.05, 1480, 250, 140), hero('扎哪里？', ZNL, QM - 0.05, 1480, 480, 150, tone='red'),
              hero('奇门遁甲战略大会', QM, YC0, 960, 150, 120, ls=0.12, glow=0.5)]
    front = [cut(n, 'p4_bills', BILL0, BACK, '小老板一个人坐在空办公室，桌上一叠催缴信封，手机一直亮（演员）'), f'<InkVig from={{{r(BILL0)}}} to={{{r(BACK)}}} />',
             hero('薪水', XS, BACK - 0.02, 380, 400, 130, tone='cream', anim='呐喊声波'), hero('租金', ZJ, BACK - 0.02, 380, 580, 130, tone='cream', anim='呐喊声波'),
             hero('追到门口', ZHUI, BACK - 0.02, 440, 770, 120, tone='red', anim='呐喊声波'),
             cut(n, 'ep1_yearchart', YC0, BURN0, '奇门年盘', last=False), cut(n, 'p4_burn', BURN0, INTRO0, '金属盘里的钞票烧成灰，最后火被一只金色罗盘盖住熄掉（没有人）', cont=True),
             hero('年度趋势', ND, DAI - 0.05, 420, 430, 130, anim='呐喊声波'),
             f'<Luoshu at={{{r(DAI)}}} shatter={{999}} until={{{r(BURN0)}}} x={{420}} y={{470}} cell={{110}} />',
             hero('投入的次序', TR, BURN0, 440, 770, 104, anim='呐喊声波'),
             f'<Embers from={{{r(XJ - 0.3)}}} to={{{r(INTRO0)}}} />',
             hero('现金', XJ, INTRO0, 380, 460, 150, tone='cream', anim='呐喊声波'), hero('被烧光', SG, INTRO0, 420, 680, 150, tone='red', anim='呐喊声波'),
             f'<Flare at={{{r(Y20)}}} k={{0.5}} /><Flare at={{{r(BACK)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DROP}', sfx(Y20 - 0.03, '咚'), sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'), sfx(GONG - 0.03, '咚'), sfx(SHOU - 0.03, '综艺咚'),
          sfx(BILL0 - 0.05, '回忆-刷一下'), sfx(BILL0 + 0.1, '诡异的滴水声'), *(sfx(x - 0.03, '咚咚重音心头震') for x in (XS, ZJ)), sfx(ZHUI - 0.03, '猛然一惊'),
          sfx(BACK - 0.05, '闪回'), sfx(XYB - 0.03, '综艺咚'), sfx(ZNL - 0.03, '疑惑'), sfx(QM - 0.05, '咚'),
          sfx(YC0 - 0.05, '回忆-刷一下'), sfx(ND - 0.03, '叮提示音4'), sfx(DAI, '叮叮'), sfx(TR - 0.03, '木鱼敲击回响音效'),
          sfx(BURN0 - 0.05, '旋风'), sfx(XJ - 0.03, '咚'), sfx(SG - 0.03, '咚咚重音心头震')]
    subs = [('2027 年', 0.05, CONG - 0.05), ('从奇门角度', CONG - 0.05, T(5.50)), ('你的生意应该攻还是守？', T(5.50), BILL0), ('订单还没收到钱', BILL0, XS - 0.05),
            ('薪水租金已经追到门口', XS - 0.05, BACK), ('下一笔钱还能不能扎？', BACK, YG - 0.05), ('应该扎在哪里？', YG - 0.05, T(23.80)), ('那奇门遁甲战略大会', T(23.80), WO - 0.05),
            ('我会用年盘来拆解年度的趋势', WO - 0.05, DAI - 0.05), ('带你重新审视投入的次序', DAI - 0.05, BIE - 0.05), ('别让生意还没等到突破', BIE - 0.05, XJ - 0.05),
            ('现金已经被烧光', XJ - 0.05, INTRO0)]
    return assemble(n, behind, front, fx, subs, hits=[Y20, Y27, GONG, XYB, QM], pushes=[[XYB, QM, 1.05]], dust=QM)

# ---------- 第 5 集 · P5 拿公司钱救人（C0027）----------
# ep5.mp4 前 12 格是镜头还在横摇、只拍到海报：已经用第 12 格定格盖掉（第 0 秒就看到人），抠像海报那边用 gate_matte 切掉
def ep5():
    n = 5; T = lambda x: t(n, 'C0027', x)
    Y20, Y27, NIAN, ZHEN, JIA, HUN, YOU, JU, BIE, NA, YJ, ZY, PEI, ZG = (T(x) for x in (3.04, 3.58, 4.02, 5.66, 6.28, 6.84, 7.82, 8.66, 11.62, 13.94, 16.88, 17.42, 21.16, 22.28))
    YC, QM, WO, NI, DJ, HQ, ZAI = (T(x) for x in (24.42, 24.94, 26.50, 30.44, 31.46, 32.48, 34.18))
    INTRO0 = starts(n, 'C0037')[0]
    PL0, BACK, LN0 = BIE - 0.1, T(20.00), WO - 0.3
    behind = [hero('20', Y20, ZHEN - 0.05, 520, 220, 340, ls=0.06, glow=0.5), hero('27', Y27, ZHEN - 0.05, 1400, 220, 340, ls=0.06, glow=0.5),
              f'<Seal text="真" at={{{r(ZHEN)}}} until={{{r(YOU - 0.05)}}} x={{1420}} y={{330}} size={{140}} rot={{-6}} />',
              f'<Seal text="假" at={{{r(JIA)}}} until={{{r(YOU - 0.05)}}} x={{1590}} y={{380}} size={{140}} rot={{4}} />',
              f'<Seal text="混" at={{{r(HUN)}}} until={{{r(YOU - 0.05)}}} x={{1760}} y={{330}} size={{140}} rot={{-3}} />',
              f'<Luopan at={{{r(JU - 0.1)}}} until={{{r(PL0)}}} x={{1500}} y={{430}} r={{300}} spin={{fastToSlow(160, 10)}} />',
              hero('奇门战略大会', QM, LN0, 960, 150, 130, ls=0.14, glow=0.5)]
    front = [cut(n, 'p5_plea', PL0, BACK, '昏暗走廊，一个男人抓住老板的手臂求救，老板手里握着公司支票簿犹豫（演员）'), f'<InkVig from={{{r(PL0)}}} to={{{r(BACK)}}} />',
             hero('别人求救', BIE, YJ - 0.05, 400, 420, 130, tone='cream', anim='呐喊声波'), hero('拿公司的钱？', NA, YJ - 0.05, 470, 620, 120, tone='red', anim='呐喊声波'),
             f'<Slip text="只有你能帮我" at={{{r(ZY)}}} until={{{r(BACK)}}} x={{300}} y={{120}} w={{150}} h={{640}} size={{78}} />',
             hero('赔上', PEI, QM - 0.05, 960, 640, 64, ls=0.3, rotY=0, rotX=18, anim='呐喊声波'),
             hero('整个团队的薪水', ZG, QM - 0.05, 960, 790, 120, ls=0.06, rotY=0, rotX=18, tone='red', anim='呐喊声波'),
             cut(n, 'p5_line', LN0, INTRO0, '数字人 Suyen 用金笔在桌上划一道金线，把棋子分成两边（正能量）'),
             hero('先看代价', NI, INTRO0, 430, 420, 120, anim='呐喊声波'), hero('划清界限', HQ, INTRO0, 430, 600, 120, anim='呐喊声波'),
             hero('再决定出手', ZAI, INTRO0, 470, 780, 110, anim='呐喊声波'),
             f'<Flare at={{{r(Y20)}}} k={{0.5}} /><Flare at={{{r(BACK)}}} /><Flare at={{{r(QM)}}} k={{0.5}} />']
    fx = ['{OPEN_DONG}', sfx(Y27 - 0.03, '综艺咚咚两声鼓点转场音效'), *(sfx(x - 0.03, '木鱼敲击回响音效') for x in (ZHEN, JIA, HUN)), sfx(JU - 0.12, '发条声', len=1.6),
          sfx(PL0 - 0.05, '回忆-刷一下'), sfx(BIE - 0.03, '猛然一惊'), sfx(NA - 0.03, '咚咚重音心头震'), sfx(ZY - 0.03, '纸张抖动声'),
          sfx(BACK - 0.05, '闪回'), sfx(PEI - 0.03, '咚'), sfx(ZG - 0.03, '咚咚重音心头震'), sfx(QM - 0.05, '咚'),
          sfx(LN0 - 0.05, '回忆-刷一下'), *(sfx(x - 0.03, '正确') for x in (NI, HQ)), sfx(ZAI - 0.03, '木鱼敲击回响音效')]
    subs = [('2027 年年度局势', 0.05, ZHEN - 0.05), ('真假混', ZHEN - 0.05, YOU - 0.05), ('有一种局你尤其要想清楚', YOU - 0.05, PL0), ('别人求救', PL0, T(13.20)),
            ('你要不要拿公司的钱去救呢？', T(13.20), YJ - 0.05), ('一句「只有你能够帮到我」', YJ - 0.05, T(19.90)), ('可能会让你赔上整个团队的薪水', T(19.90), YC - 0.05),
            ('这一次的奇门战略大会', YC - 0.05, WO - 0.05), ('我会从年度格局来谈风险', WO - 0.05, NI - 0.05), ('带你先看代价', NI - 0.05, HQ - 0.05), ('划清界限，再决定出手', HQ - 0.05, INTRO0)]
    return assemble(n, behind, front, fx, subs, hits=[Y20, Y27, ZHEN, JIA, HUN, QM], pushes=[[YOU, PL0, 1.05]], dust=QM)

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
def ep6():
    n = 6; T = lambda x: t(n, 'C0029', x)
    import sys; sys.path.insert(0, H)
    m, got, tot = hookmap(n, 'p6', 'C0029'); assert got == tot, (got, tot)
    HEND = T(18.62)                                   # 「储蓄」讲完、「这一次」之前
    hb, hf, hx, hits, pushes = hookblocks('SuyenEP6', 'p6', HEND, m)
    ZYC, QM, WO, ZJ, TQ, JT = (T(x) for x in (18.76, 19.86, 21.46, 23.46, 27.96, 29.46))
    INTRO0 = starts(n, 'C0037')[0]; FAM0 = WO - 0.3
    behind = hb + [hero('奇门战略大会', QM, FAM0, 960, 150, 130, ls=0.14, glow=0.5)]
    front = hf + [cut(n, 'p6_family', FAM0, INTRO0, '三代同堂在温暖的家里吃饭，窗外是金色灯光（演员，正能量）'),
                  hero('真假混的', ZJ, TQ - 0.05, 420, 430, 110, anim='呐喊声波'), hero('年度趋势', T(25.08), TQ - 0.05, 420, 610, 120, anim='呐喊声波'),
                  hero('提前思考', TQ, INTRO0, 420, 430, 120, anim='呐喊声波'), hero('进退', JT, INTRO0, 380, 620, 150, anim='呐喊声波')]
    fx = hx + [sfx(HEND - 0.05, '闪回'), sfx(QM - 0.05, '咚'), sfx(FAM0 - 0.05, '亮一下'), *(sfx(x - 0.03, '叮提示音4') for x in (ZJ, T(25.08))),
               sfx(TQ - 0.03, '正确'), sfx(JT - 0.03, '木鱼敲击回响音效')]
    subs = [('2027 年', 0.05, T(4.00)), ('你的奇门战略布局', T(4.00), T(6.55)), ('有没有把全家的退路算进去？', T(6.55), T(10.25)), ('一笔的投入', T(10.25), T(12.05)),
            ('动的可能是', T(12.05), T(13.15)), ('孩子的学费', T(13.15), T(14.45)), ('父母的养老', T(14.45), T(16.0)), ('还有可能是你十年的储蓄', T(16.0), HEND),
            ('这一次的奇门战略大会', HEND, WO - 0.05), ('我会从年盘来解读真假混的年度趋势', WO - 0.05, T(26.10)), ('带你提前思考进退', T(26.10), INTRO0)]
    # v9：讲到「十年储蓄」那一下短暂变黑白（故事转折），之后回彩色
    k0, k1, k2 = m(15.55), m(15.9), HEND
    grade = f'(t) => {{ const k = t < {k2} ? interpolate(t, [{k0}, {k1}], [0, 0.85], clamp) : interpolate(t, [{k2}, {r(k2 + 0.3)}], [0.85, 0], clamp); return [1 - 0.22 * k, 1, k]; }}'
    return assemble(n, behind, front, fx, subs, hits=hits + [QM], pushes=pushes, dust=QM, grade=grade)

EPS = [ep2, ep3, ep4, ep5, ep6]

HEAD = '''// 广告第 2–14 集（16:9 · 每集 ≤60 秒 · 1.1 倍速）。⚠ 这个档案是 pipeline/gen_eps.py 产生的，不要手改，改产生器再重跑
// 结构照第 1 集：钩子 + 教方法 → 我们是谁（C0037 + 照片墙）→ CTA；只用 C0001–C0048；名字一律「林舒苑」
import React from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { Frame, Hero, Cutaway, NameTag, PhotoWall, Sfx, Seal, Luopan, Luoshu, Slip, Incense, House, InkVig, InkBrush, Flare, Embers, OPEN_DROP, OPEN_DONG, fastToSlow, useT, win, ease, eio, f, clamp, regEp, LTH, CREAM } from './SuyenHooksE';
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
  const cam: Cam = {{ hits: {[r(x) for x in cam['hits']]}, pushes: {[[r(a), r(b), z] for a, b, z in cam['pushes']]}, origin: '{cam['origin']}' }};
  const grade: Grade = {cam['grade']};
  return (
    <Frame id="ep{n}" cam={{cam}} grade={{grade}} dust={{{r(dust)}}}
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
    s = s[:i] + comps + '\n    ' + s[j:]
    open(p, 'w').write(s)
    print('ok', names)

if __name__ == '__main__': build()
