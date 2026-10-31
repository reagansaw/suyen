# 广告第 2 集（P2 · 翻身变赔钱）：钩子 + 痛点 + 教方法。时间全部用逐字时间找她讲的字（ep.w），由 pipeline/gen_ep.py 2 合成
# 0 秒就是她本人 · 开场只放水滴声 · 大字在人后层，前景只放胸口以下的数字
def build(ep):
    w = lambda t, after=0.0: ep.w('C0006', t, after)
    FAN, SHEN, PEI, N6, N7, HAI = w('翻'), w('身'), w('赔'), w('6'), w('7'), w('还', 9)
    NA, Y20, Y27, ZHEN, JIA, HUN = w('那', 12), w('20'), w('27'), w('真'), w('假'), w('混')
    YQ, FB, XB = w('眼'), w('翻', 16), w('血')
    QM, WH = w('奇'), w('我', 23)
    JH, FX, QJ = w('机', 25), w('风'), w('全')
    DING, XIAN, ZAI = w('定'), w('先'), w('再', 32)
    END1 = max(p['end'] for p in ep.pieces if p['src'] == 'C0006')
    behind = f'''
        <Hero text="翻" at={{{FAN - 0.05:.2f}}} until={{{PEI - 0.05:.2f}}} x={{560}} y={{230}} size={{300}} ls={{0.06}} glow={{0.5}} />
        <Hero text="身" at={{{SHEN - 0.05:.2f}}} until={{{PEI - 0.05:.2f}}} x={{1240}} y={{230}} size={{300}} ls={{0.06}} glow={{0.5}} />
        <Hero text="赔掉" at={{{PEI:.2f}}} until={{{HAI - 0.15:.2f}}} x={{1480}} y={{300}} size={{170}} tone="red" rotY={{-20}} />
        <Hero text="20" at={{{Y20:.2f}}} until={{{ZHEN - 0.08:.2f}}} x={{540}} y={{220}} size={{340}} ls={{0.06}} glow={{0.5}} />
        <Hero text="27" at={{{Y27:.2f}}} until={{{ZHEN - 0.08:.2f}}} x={{1240}} y={{220}} size={{340}} ls={{0.06}} glow={{0.5}} />
        <Seal text="真" at={{{ZHEN:.2f}}} until={{{YQ - 0.12:.2f}}} x={{330}} y={{250}} size={{150}} rot={{-6}} />
        <Seal text="假" at={{{JIA:.2f}}} until={{{YQ - 0.12:.2f}}} x={{330}} y={{460}} size={{150}} rot={{4}} />
        <Seal text="混" at={{{HUN:.2f}}} until={{{YQ - 0.12:.2f}}} x={{330}} y={{670}} size={{150}} rot={{-3}} />
        <Hero text="奇门遁甲战略大会" at={{{QM:.2f}}} until={{{WH + 0.35:.2f}}} x={{960}} y={{150}} size={{120}} ls={{0.12}} glow={{0.5}} />'''
    front = f'''
        <Hero text="六位数" at={{{N6:.2f}}} until={{{N7 - 0.02:.2f}}} x={{960}} y={{640}} size={{64}} ls={{0.3}} rotY={{0}} rotX={{18}} anim="呐喊声波" />
        <Hero text="RM100,000" at={{{N6:.2f}}} until={{{N7 - 0.02:.2f}}} x={{960}} y={{790}} size={{150}} ls={{0.02}} rotY={{0}} rotX={{18}} tone="red" anim="呐喊声波" />
        <Hero text="七位数" at={{{N7:.2f}}} until={{{HAI - 0.15:.2f}}} x={{960}} y={{640}} size={{64}} ls={{0.3}} rotY={{0}} rotX={{18}} anim="呐喊声波" />
        <Hero text="RM1,000,000" at={{{N7:.2f}}} until={{{HAI - 0.15:.2f}}} x={{960}} y={{790}} size={{142}} ls={{0.02}} rotY={{0}} rotX={{18}} tone="red" anim="呐喊声波" />
        <Cutaway id="ep2" src="p2_loss" from={{{HAI - 0.15:.2f}}} to={{{NA - 0.08:.2f}}} focus={{[990, 430]}} />
        <InkVig from={{{HAI - 0.15:.2f}}} to={{{NA - 0.08:.2f}}} />
        <Cutaway id="ep2" src="p2_fork" from={{{YQ - 0.1:.2f}}} to={{{QM - 0.08:.2f}}} focus={{[990, 430]}} />
        <Hero text="翻倍转机？" at={{{FB:.2f}}} until={{{QM - 0.1:.2f}}} x={{470}} y={{300}} size={{110}} anim="呐喊声波" />
        <Hero text="血本无归？" at={{{XB:.2f}}} until={{{QM - 0.1:.2f}}} x={{470}} y={{480}} size={{110}} tone="red" anim="呐喊声波" />
        <Cutaway id="ep2" src="ep1_yearchart" from={{{WH - 0.1:.2f}}} to={{{DING:.2f}}} focus={{[990, 430]}} last={{false}} />
        <Cutaway id="ep2" src="ep1_dh_point" from={{{DING:.2f}}} to={{{END1:.2f}}} focus={{[990, 430]}} cont />
        <Hero text="机会" at={{{JH:.2f}}} until={{{DING:.2f}}} x={{380}} y={{380}} size={{130}} anim="呐喊声波" />
        <Hero text="风险" at={{{FX:.2f}}} until={{{DING:.2f}}} x={{380}} y={{560}} size={{130}} tone="red" anim="呐喊声波" />
        <Hero text="看全局" at={{{QJ:.2f}}} until={{{DING:.2f}}} x={{380}} y={{740}} size={{120}} anim="呐喊声波" />
        <Hero text="定进退" at={{{DING + 0.05:.2f}}} until={{{END1:.2f}}} x={{380}} y={{380}} size={{120}} anim="呐喊声波" />
        <Hero text="先布局" at={{{XIAN:.2f}}} until={{{END1:.2f}}} x={{380}} y={{560}} size={{120}} anim="呐喊声波" />
        <Hero text="再投入" at={{{ZAI:.2f}}} until={{{END1:.2f}}} x={{380}} y={{740}} size={{120}} anim="呐喊声波" />
        <InkBrush at={{{NA - 0.3:.2f}}} dur={{0.5}} />
        <Flare at={{{FAN:.2f}}} k={{0.35}} /><Flare at={{{PEI:.2f}}} k={{0.4}} /><Flare at={{{Y20:.2f}}} k={{0.45}} /><Flare at={{{QM:.2f}}} k={{0.5}} />'''
    sfx = f'''
        {{OPEN_DROP}}
        <Sfx at={{{FAN - 0.08:.2f}}} s="综艺咚" /><Sfx at={{{SHEN - 0.08:.2f}}} s="咚" />
        <Sfx at={{{PEI - 0.03:.2f}}} s="撞击光1" /><Sfx at={{{PEI - 0.01:.2f}}} s="猛然一惊" />
        <Sfx at={{{N6 - 0.02:.2f}}} s="复古胶片滚动" len={{0.6}} /><Sfx at={{{N7 - 0.04:.2f}}} s="叮收银机提示音1" />
        <Sfx at={{{HAI - 0.2:.2f}}} s="回忆-刷一下" /><Sfx at={{{HAI:.2f}}} s="诡异的滴水声" />
        <Sfx at={{{NA - 0.3:.2f}}} s="旋风" />
        <Sfx at={{{Y20 - 0.03:.2f}}} s="咚" /><Sfx at={{{Y27 - 0.03:.2f}}} s="综艺咚咚两声鼓点转场音效" />
        {{[{ZHEN:.2f}, {JIA:.2f}, {HUN:.2f}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="木鱼敲击回响音效" />)}}
        <Sfx at={{{YQ - 0.15:.2f}}} s="回忆-刷一下" />
        <Sfx at={{{FB - 0.03:.2f}}} s="叮提示音4" /><Sfx at={{{XB - 0.03:.2f}}} s="咚咚重音心头震" />
        <Sfx at={{{QM - 0.05:.2f}}} s="咚" />
        <Sfx at={{{WH - 0.15:.2f}}} s="回忆-刷一下" />
        {{[{JH:.2f}, {FX:.2f}, {QJ:.2f}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="叮提示音4" />)}}
        <Sfx at={{{DING - 0.05:.2f}}} s="扫光" />
        {{[{XIAN:.2f}, {ZAI:.2f}].map((x) => <Sfx key={{x}} at={{x - 0.03}} s="木鱼敲击回响音效" />)}}'''
    # 讲「赔掉六位数七位数」那几秒背景慢慢变暗变灰（故事转折，只这一下），切 B-roll 时回到正常
    grade = f'''(t) => {{
    if (t < {PEI - 0.1:.2f} || t >= {HAI - 0.15:.2f}) return [1, 1, 0];
    return [interpolate(t, [{PEI - 0.1:.2f}, {HAI - 0.2:.2f}], [1, 0.78], clamp), 1, interpolate(t, [{PEI:.2f}, {HAI - 0.2:.2f}], [0, 0.75], clamp)];
  }}'''
    return dict(behind=behind, front=front, sfx=sfx, grade=grade, dust=round(XIAN, 2),
                hits=[FAN, PEI, Y20, ZHEN, QM], pushes=[(NA, ZHEN - 0.1, 1.04), (QM, WH - 0.1, 1.04)])
