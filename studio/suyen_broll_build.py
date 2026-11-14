"""Master Suyen · 2027 奇门钩子 · 讲到重点时换背景的 B-roll 画布（东方高级感·没有人·没有字）
背景图 → Seedance 慢动作背景影片；剪辑时把 Suyen 抠出来（已有人像抠像）叠在上面，像绿幕换场景。只搭画布，不 Run。
用法：python3 suyen_broll_build.py            新建
      python3 suyen_broll_build.py --update   原地改（已跑出的结果保留）"""
import json, os, sys, urllib.request
from studio_api import call

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, 'assets')
CACHE = os.path.join(ASSETS, 'uploads.json')

def upload(fn):
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    if fn in cache: return cache[fn]
    path = os.path.join(ASSETS, fn)
    up = call('create_upload', filename=fn, size_bytes=os.path.getsize(path))
    req = urllib.request.Request(up['upload_url'], data=open(path, 'rb').read(), method='PUT', headers=up.get('headers') or {'Content-Type': 'image/jpeg'})
    urllib.request.urlopen(req, timeout=120).read()
    done = call('finish_upload', path=up['path'], file_name=fn)
    cache[fn] = done['file_url']; json.dump(cache, open(CACHE, 'w'), indent=1)
    return cache[fn]

WORKFLOW_ID = '82df8ea8-57a3-4bfa-bd5c-c15e4ef62f11'   # 10-30 建好，之后用 --update
NAME = 'Suyen · 2027 奇门钩子 · B-roll（第 1 批背景 8 场 + 第 2 批有人的整画面场景 & 马羊）· 20261030'

STYLE = ("Premium cinematic Eastern aesthetic for a high-end Chinese metaphysics (Qimen Dunjia) strategy brand: refined, calm and powerful, "
         "deep ink-black and warm antique-gold palette with touches of cinnabar red, soft volumetric light, light haze, rich texture, shallow depth "
         "of field, photorealistic matte painting quality. The centre of the frame stays visually calm and slightly darker (a speaker will be "
         "composited in front of it later), interest on the left and right thirds. No people, no faces, no hands, no animals unless stated, "
         "no text, no letters, no Chinese characters, no logos, no watermark. No purple.")

# (id, 用在哪一句, 画面比例, 背景图提示, 影片动作)
SCENES = [
    ('p1_drain', 'P1 3.6–7.6s「人却已经拼到精力耗尽」', '16:9',
     "A dim traditional Chinese scholar's study at night: on a dark rosewood desk a single incense stick has almost burnt out in a bronze censer, "
     "a long grey ash curl about to fall, one thin thread of smoke rising; stacks of closed ledgers and an abacus pushed aside; cold blue moonlight "
     "falls through a carved wooden lattice window on the left, a dying warm candle glow on the right. Mood: exhausted, quiet, heavy.",
     "Very slow push-in. The thin incense smoke curls and drifts, the candle flame flickers and shrinks, dust floats in the moonlight beam."),
    ('p1_dawn', 'P1 9.4–14s「力气该往哪里打 · 才有机会冲翻倍」', '16:9',
     "A mountain summit at sunrise above an endless sea of golden clouds; on the summit a vast circular stone platform inlaid with a giant antique "
     "bronze-gold feng shui compass (luopan) with concentric rings and fine engraved tick marks (no readable characters); golden god-rays break "
     "through the clouds from the right, distant ink-wash peaks on the left. Mood: clarity, direction, breakthrough.",
     "Slow rising crane move; the clouds roll gently, the sun rays sweep across the luopan and its outer ring slowly turns."),
    ('i2_army', 'I2 9.5–13.3s「几十个人甚至几百个人跟着你就是冲」', '16:9',
     "A vast ancient Chinese battlefield seen from a high hill at dawn: hundreds of ancient soldiers in dark armour with tall black and red banners "
     "advance in long disciplined rows across a misty plain toward the camera, dust rising, distant mountains in ink-wash layers. Cinematic, epic, "
     "figures small and anonymous, no faces visible.",
     "Slow forward dolly over the hill; the rows of soldiers march forward, banners ripple in the wind, dust and mist drift."),
    ('i2_burn', 'I2 15–19.5s「整年的薪水和士气一起烧掉」', '16:9',
     "Inside a dark ancient hall, piles of old paper scrolls, account ledgers and strings of ancient Chinese copper coins burning on the stone "
     "floor; orange flames and glowing embers rising into the darkness, curled black ash, heavy smoke lit from below. Mood: loss, everything "
     "going up in flames.",
     "Slow push-in; flames flicker and grow, embers float upward, paper edges curl and blacken, smoke rolls."),
    ('p6_hall', 'P6 1.6–4.1s「你的奇门战略布局」', '16:9',
     "A grand dark temple hall: the polished black stone floor is inlaid with a huge glowing antique-gold Qimen Dunjia nine-palace diagram and "
     "concentric luopan rings (engraved patterns only, no readable characters); above, the open roof shows a deep starry night sky with faint "
     "constellation lines; incense haze, red lacquered pillars at the sides.",
     "Slow overhead-to-eye-level tilt; the gold lines of the diagram light up one by one, stars twinkle, incense haze drifts."),
    ('p6_road', 'P6 4.2–7.9s「有没有把全家的退路算进去」', '16:9',
     "A traditional Chinese courtyard house with curved grey-tiled roofs and warm glowing windows on a misty mountainside at dusk; red lanterns at "
     "the gate; a narrow stone path leads away from the house down the mountain and disappears into thick fog where it splits in two; ink-wash "
     "peaks behind. Mood: family, home, uncertain way out.",
     "Slow lateral move along the path; fog rolls over the fork in the road, lanterns sway gently, warm window light flickers."),
    ('p6_storm', 'P6 13.6–16.8s「还有可能是你十年的储蓄」', '16:9',
     "A dark storm over a turbulent sea at night: an antique carved wooden treasure chest spilling gold coins sits on black rocks at the shore as "
     "huge waves crash against it; lightning in heavy clouds, cold blue-grey light with a warm gold glint from the coins.",
     "Slow push-in; waves crash and spray over the rocks, lightning flashes in the clouds, coins glint and slide."),
    ('s4_2027', 'S4 10.4–13.6s「来到 2027 年 · 真假混」（竖版）', '9:16',
     "The year of the Red Horse and Red Goat (2027): a majestic red horse and a red goat formed of glowing crimson clouds and fire in a dark sky, "
     "facing each other, mirrored upside-down in perfectly still black water below so that the reflection looks slightly different from the "
     "real one (truth and illusion); gold mist, floating embers.",
     "Slow push-in; the cloud-horse and cloud-goat shift and breathe like smoke, the reflection ripples and distorts, embers float upward."),
]

NOTE = """Suyen 2027 奇门钩子 · 讲到重点换背景（像绿幕）
做法：这里只生「背景」，没有人；剪辑时把 Suyen 抠出来叠在前面，讲到那一句才换场景。
① 先跑 8 张背景图（gpt-image-2 · 2K）。哪张不喜欢改提示再跑，满意了跟我说。
② 影片（Seedance 2.5 · 5 秒 · 没声音）可选：背景会动更高级。不跑的话我用图做 3D 推镜视差（零点数）。
   建议先跑 P1、I2 各一支看效果，再决定其余要不要。
横版 3 支（P1/I2/P6）用 16:9；S4 是竖拍原片，用 9:16。
跑完开着画布一两分钟，结果才存回来；跟我说，我接进剪辑。"""

# ---- 第 2 批（10-30 晚 Reagan）：B-roll 不常换，每支钩子换一次；整画面切过去（不抠人），Suyen 缩进半身圆框讲 points。
# 负面场景用别的演员（绝不能是 Suyen 的脸）；马和羊照 Reagan 给的两张参考（熔岩裂纹、火焰鬃毛、奇门天宫）。
PEOPLE = ("Photorealistic live-action, cinematic commercial look, shot on a cinema camera, natural skin texture, believable Malaysian Chinese people "
          "(none of them is a celebrity; no woman with a short bob and glasses), natural hands with five fingers, faces consistent, no morphing. "
          "Warm-neutral grade, no yellow or sepia filter, no purple. No text, no subtitles, no logos, no watermark. No audio.")
SCENES2 = [
    ('p1_tired', 'P1 3.6–7.6s「人却已经拼到精力耗尽」（负面·整画面）', '16:9', 6,
     "Late at night in a modern Kuala Lumpur office, a Malaysian Chinese business owner in his mid-40s in a loosened shirt and tie sits alone at his desk "
     "under one desk lamp; piles of reports, a laptop showing red sales charts, a cold cup of coffee. [0s-3s] slow push-in as he rubs his temples with both "
     "hands, eyes closed, exhausted. HARD CUT. [3s-6s] close-up from the side: his phone buzzes with notifications on the desk, he slumps back in the chair "
     "and stares at the ceiling, completely drained; the wall clock shows 2 a.m."),
    ('i2_team', 'I2 9.5–15s「几十个人甚至几百个人跟着你就是冲 · 方向一错」（负面·整画面）', '16:9', 6,
     "[0s-2.5s] In a large open-plan office, a confident Malaysian Chinese boss in his 40s in a navy suit stands and points forward decisively; dozens of "
     "staff in business attire rise from their desks at once. HARD CUT. [2.5s-4.5s] low wide angle: the whole team, dozens of people, rush forward down a "
     "long corridor behind the boss, determined, fast, papers flying. HARD CUT. [4.5s-6s] they burst through double doors and stop dead: in front of them "
     "only thick fog and a sheer drop, papers scattering into the void, the boss's face falls in shock."),
    ('p6_points', 'P6 10.7–16.8s「孩子的学费 · 父母的养老 · 你十年的储蓄」（负面·整画面·三个 points）', '16:9', 6,
     "Three quick shots, each one point. [0s-1.5s] At a kitchen table at night, a worried Malaysian Chinese mother in her late 30s holds a school fee "
     "invoice while her young son does homework beside her. HARD CUT. [1.5s-4s] In a hospital ward, an elderly grandfather lies in bed with an oxygen tube; "
     "his middle-aged son sits beside him holding a long hospital bill, jaw tight. HARD CUT. [4s-6s] A man in his 40s at home stares at a laptop where a "
     "bank balance and an investment chart crash into red, then buries his face in his hands."),
    ('horse_goat_v', 'S4 10.4–13.6s「来到 2027 年 · 真假混」赤马红羊（竖 9:16）', '9:16', 5,
     "@image1 and @image2 are the style references. A majestic horse and a large ram with huge curled horns, both with dark stone-like skin covered in glowing "
     "orange lava cracks, manes and tails made of roaring fire, glowing eyes, gallop side by side toward the camera across dark volcanic ground, flames "
     "bursting from every hoof, sparks and embers flying, a dark sky with drifting smoke. Slow-motion, low camera tracking backwards in front of them."),
    ('goat_positive', '正能量（收尾 / CTA / 翻倍）：彩虹鬃毛吉祥羊 · 金色梯田日出（16:9）', '16:9', 5,
     "@image1 is the reference (the goat on Master Suyen's 2027 book cover). The exact same auspicious mystical goat: long dark curled horns, golden-red fur, "
     "a long flowing mane and tail in rainbow colours (crimson, orange, gold, emerald, sapphire), small golden sparkles in the mane. It stands proudly on "
     "golden rice terraces at sunrise, a warm golden haze, a soft sun low over layered misty hills, glowing golden light everywhere, hopeful and prosperous. "
     "Slow push-in; the mane and tail flow in a gentle breeze, golden light motes float upward, the sun glows brighter."),
]
NOTE2 = """第 2 批（10-30 晚）：每支钩子只换一次 B-roll，整画面切过去，Suyen 缩进右下角半身圆框继续讲。
有人的场景（P1 加班累垮的老板、I2 整队冲错方向、P6 三个 points）用别的演员，不是 Suyen。
火马火羊（S4 2027）照你给的两张参考图（熔岩裂纹 + 火焰鬃毛）。\n正能量羊照书封面那只（彩虹鬃毛、金色梯田日出）：请把书封面图拖进「正能量参考」格，再跑第一帧。都是先跑图，满意再跑影片。
⚠️ 第 1 批影片出来只有 752×416：跑之前请看一下影片节点的画质 / 分辨率选项，能选高的就选高的。"""

OUTH = {'aiImage': 'result', 'aiVideo': 'result', 'fileUpload': 'output'}

def build():
    nodes, edges, types = [], [], {}
    def node(i, t, x, y, label, config, w=None, h=None):
        n = {'id': i, 'type': t, 'position': {'x': x, 'y': y}, 'data': {'label': label, 'config': config}}
        if w: n['width'] = w; n['height'] = h; n['style'] = {'width': w, 'height': h}
        nodes.append(n); types[i] = t
    def edge(src, tgt, th):
        edges.append({'id': f'e_{src}_{tgt}_{th}', 'source': src, 'sourceHandle': OUTH.get(types.get(src)), 'target': tgt,
                      'targetHandle': th, 'type': 'deletable'})
    node('note', 'stickyNote', 0, -480, '使用说明', {'text': NOTE}, 980, 360)
    for k, (sid, where, ar, img, move) in enumerate(SCENES):
        y = k * 460
        wide = 'wide 16:9' if ar == '16:9' else 'vertical 9:16'
        node(f'{sid}_img_txt', 'textInput', 0, y, f'{where} · 背景图提示', {'text': f'A {wide} background plate. ' + img + ' ' + STYLE})
        node(f'{sid}_img', 'aiImage', 420, y, f'① 背景图 · {where}',
             {'model': 'gpt-image-2', 'gptImage2Mode': 't2i', 'imageInputCount': 0, 'aspectRatio': ar, 'resolution': '2K',
              'gptImage2Quality': 'high', 'status': 'idle'})
        edge(f'{sid}_img_txt', f'{sid}_img', 'prompt')
        node(f'{sid}_vid_txt', 'textInput', 840, y, f'{where} · 影片提示',
             {'text': f"5-second {wide} cinematic background plate, one continuous shot, no cuts. @image1 is the first frame. " + move
                      + " Smooth stabilised camera, slow and elegant. " + STYLE + " No audio."})
        node(f'{sid}_vid', 'aiVideo', 1260, y, f'② 背景影片（可选）· {where}',
             {'model': 'seedance-2.5', 'qualityMode': 'hd', 'generationType': 'text-to-video', 'aspectRatio': ar, 'resolution': '1080p',
              'duration': '5', 'multiShot': False, 'generateAudio': False, 'refImageCount': 1, 'referenceAudioCount': 0,
              'referenceVideoCount': 0, 'status': 'idle'})
        edge(f'{sid}_vid_txt', f'{sid}_vid', 'prompt'); edge(f'{sid}_img', f'{sid}_vid', 'ref-image-1')
    # ---- 第 2 批 ----
    node('note2', 'stickyNote', 2000, -480, '第 2 批说明', {'text': NOTE2}, 900, 300)
    r1, r2 = upload('ref_horse_goat_run.jpg'), upload('ref_goat_palace.jpg')
    node('ref_run', 'fileUpload', 2000, -120, '参考：火马火羊奔跑', {'fileType': 'image', 'fileUrl': r1, 'resultUrl': r1, 'fileName': 'ref_horse_goat_run.jpg'})
    node('ref_palace', 'fileUpload', 2400, -120, '参考：火羊 · 奇门天宫', {'fileType': 'image', 'fileUrl': r2, 'resultUrl': r2, 'fileName': 'ref_goat_palace.jpg'})
    node('ref_positive', 'fileUpload', 2800, -120, '正能量参考：请拖进 2027 书封面（彩虹鬃毛羊）', {'fileType': 'image', 'fileUrl': None, 'resultUrl': None, 'fileName': None})
    for k, (sid, where, ar, dur, beats) in enumerate(SCENES2):
        y = 300 + k * 460
        wide = 'wide 16:9' if ar == '16:9' else 'vertical 9:16'
        animal = sid in ('horse_goat_v', 'goat_positive')
        pos = sid == 'goat_positive'
        if animal:
            node(f'{sid}_img_txt', 'textInput', 2000, y, f'{where} · 第一帧提示', {'text': f'A {wide} cinematic still. ' + (beats.replace('@image1 is the reference', 'Use only the goat from @image1 as the reference; ignore the book, the text and the woman on the cover') if pos else beats.replace('@image1 and @image2 are the style references. ', 'Match the look of @image1 and @image2 exactly (lava-cracked skin, fire manes, Qimen fantasy). ')) + ' No text, no logo, no watermark, no people.'})
            node(f'{sid}_img', 'aiImage', 2420, y, f'① 第一帧 · {where}',
                 {'model': 'gpt-image-2', 'gptImage2Mode': 'i2i', 'imageInputCount': 1 if pos else 2, 'aspectRatio': ar, 'resolution': '2K', 'gptImage2Quality': 'high', 'status': 'idle'})
            edge(f'{sid}_img_txt', f'{sid}_img', 'prompt')
            if pos: edge('ref_positive', f'{sid}_img', 'image-0')
            else: edge('ref_run', f'{sid}_img', 'image-0'); edge('ref_palace', f'{sid}_img', 'image-1')
            vtxt = f"{dur}-second {wide} cinematic shot. @image1 is the first frame. " + beats.replace('@image1 and @image2 are the style references. ', '').replace("@image1 is the reference (the goat on Master Suyen's 2027 book cover). ", '') + " No text, no logos, no watermark, no people. No audio."
        else:
            vtxt = f"{dur}-second {wide} video. " + beats + " " + PEOPLE
        node(f'{sid}_vid_txt', 'textInput', 2840, y, f'{where} · 影片提示', {'text': vtxt})
        node(f'{sid}_vid', 'aiVideo', 3260, y, f'② 影片 · {where}（{dur} 秒）',
             {'model': 'seedance-2.5', 'qualityMode': 'hd', 'generationType': 'text-to-video', 'aspectRatio': ar, 'resolution': '1080p',
              'duration': str(dur), 'multiShot': False, 'generateAudio': False, 'refImageCount': 1 if animal else 0, 'referenceAudioCount': 0,
              'referenceVideoCount': 0, 'status': 'idle'})
        edge(f'{sid}_vid_txt', f'{sid}_vid', 'prompt')
        if animal: edge(f'{sid}_img', f'{sid}_vid', 'ref-image-1')
    return nodes, edges

if __name__ == '__main__':
    nodes, edges = build()
    wid = WORKFLOW_ID if '--update' in sys.argv else None
    if wid:
        cur = call('get_workflow', workflow_id=wid); cur = cur.get('workflow', cur)
        old = {n['id']: n for n in cur['nodes']}
        if any(n['data']['config'].get('status') == 'running' for n in old.values()) and '--force' not in sys.argv:
            sys.exit('还在跑，等跑完再改')
        for n in nodes:
            o = old.get(n['id']); oc = o['data']['config'] if o else {}
            if o and (oc.get('resultUrl') or oc.get('historyId') or oc.get('status') == 'running'):
                n['data']['config'] = oc; n['position'] = o.get('position', n['position'])
    res = call('save_workflow', **({'workflow_id': wid} if wid else {}), name=NAME, nodes=nodes, edges=edges)
    print(json.dumps({k: v for k, v in res.items() if k in ('workflow_id', 'created', 'edit_url', 'node_count', 'edge_count', 'error', 'body')}, ensure_ascii=False))
    if 'workflow_id' in res:
        v = call('validate_workflow', workflow_id=res['workflow_id'])
        print('ready_to_run', v.get('ready_to_run'), 'errors', v.get('validation', {}).get('errors'), 'warnings', v.get('validation', {}).get('warnings'))
