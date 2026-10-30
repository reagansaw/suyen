"""Suyen 广告第 2–14 集 · 每集一张 B-roll 画布（16:9）。先跑第一帧图（gpt-image-2），再跑影片（grok-imagine-1.5 720p，Reagan 换的设定）。只搭画布，不 Run。
用法：python3 suyen_eps_build.py            全部新建（已建过的集会自动改用原地更新）
      python3 suyen_eps_build.py 2 5        只做第 2、5 集
画布 id 记在 eps_workflows.json；再跑一次是原地更新，已跑出的结果保留。"""
import json, os, sys
from studio_api import call
from suyen_broll_build import upload

HERE = os.path.dirname(os.path.abspath(__file__))
IDS = os.path.join(HERE, 'eps_workflows.json')

STYLE = ("Premium cinematic Eastern aesthetic for a high-end Chinese metaphysics (Qimen Dunjia) strategy brand: refined and powerful, deep ink-black, "
         "warm antique-gold and touches of cinnabar red, soft volumetric light, light haze, photorealistic. No text, no letters, no readable Chinese "
         "characters, no numbers, no logos, no watermark.")
REAL = ("Real photo look, natural skin texture with visible pores, no beauty filter, no plastic skin, natural hands with five fingers.")
DH = ("@image1 is the reference for the woman: Master Suyen, a Malaysian Chinese woman in her 50s with a chin-length dark-brown bob and side fringe, "
      "clear-frame glasses, a warm confident smile, wearing a coral-pink blazer over a white top and a thin gold necklace. Keep her face, hair, glasses "
      "and outfit exactly the same as @image1.")
FIRE = ("Match the look of @image1 and @image2 exactly: dark stone-like skin covered in glowing orange lava cracks, manes and tails of roaring fire, "
        "glowing eyes.")
LOCK = "Camera locked or a very slow push-in only. No new objects, no people appearing, no text, no morphing, no face changes."

# id → (用在哪一句, 秒数, 参考图, 第一帧提示, 影片动作)
# 参考图：'face' = 数字人（Suyen 正面），'fire' = 火马火羊两张图，None = 没有
SC = {
 'p2_loss': ('0:08「赔掉六位数七位数，还浪费一整年」（负面 · 演员）', 6, None,
   "A Malaysian Chinese businessman in his late 40s in a white shirt with loosened tie sits alone in a dark office at night, both hands gripping his "
   "head, lit by the cold red glow of several monitors showing falling red candlestick charts (abstract shapes, no readable numbers). Medium shot from "
   "the side, his face half in shadow, city lights blurred through the window. " + REAL,
   "The red chart lines on the monitors keep sliding down; he slowly lowers his head into his hands. Everything else stays still. " + LOCK),
 'p2_fork': ('0:13.5「眼前到底是翻倍的转机，还是血本无归的危机」（没有人）', 6, None,
   "A mountain path at dawn splits into two: the left path climbs toward a warm golden sunrise over a sea of clouds, lined with glowing stone lanterns; "
   "the right path ends abruptly at a dark crumbling cliff edge disappearing into cold grey fog. Wide symmetrical composition from behind the fork, "
   "ink-wash mountain layers in the distance.",
   "Only the light moves: golden sun rays slowly brighten on the left path while the fog on the right swirls over the cliff edge. " + LOCK),
 'p3_bet': ('0:08.4「最怕一次的押错，把今年所赚的利润赔回去」（负面 · 演员）', 6, None,
   "Close-up on a dark green felt gambling table in a dim private room: a man's hands in a dark suit push a tall tower of gold coins onto a single "
   "square; warm overhead spotlight, smoke haze, the man's face out of frame. " + REAL,
   "The tall gold coin tower wobbles and collapses, coins spilling and rolling across the felt in slow motion. " + LOCK),
 'p3_scale': ('0:18.3「用年盘拆解机会与风险……提前规划进攻与防守」（数字人 · 正能量）', 6, 'face',
   DH + " In an elegant dark study with gold accents, she stands behind a large antique brass balance scale on a rosewood desk, placing a gold "
   "weight on the left pan while a small jade shield rests on the right pan; a faint golden Qimen nine-palace pattern glows on the wall behind her.",
   "She gently sets the gold weight down and the scale settles perfectly level; she looks up at the camera with a calm, sure smile. Face consistent. " + LOCK),
 'p4_bills': ('0:05.3「订单还没收到钱，薪水租金已经追到门口」（负面 · 演员）', 6, None,
   "A Malaysian Chinese small-business owner in his late 30s sits alone at a desk in an empty office after hours, staring at a growing pile of "
   "unopened envelopes and invoices (no readable text); his phone lies face-up on the desk lighting up with an incoming call; cold fluorescent light, "
   "empty chairs behind him. Medium shot. " + REAL,
   "The phone keeps lighting up and vibrating on the desk; he rubs his forehead and does not pick it up. Everything else stays still. " + LOCK),
 'p4_burn': ('0:27.2「别让生意还没等到突破，现金已经被烧光」（没有人）', 6, None,
   "On a black stone table, a bundle of banknotes (no readable printing) burns in a dark iron tray, orange flames and curling black ash; beside it "
   "rests an antique golden luopan compass. Dramatic low-key light, embers drifting.",
   "The flames slowly die down and the last embers fade while the golden luopan beside the tray catches a slowly brightening warm light. " + LOCK),
 'p5_plea': ('0:07.5「别人求救，你要不要拿公司的钱去救呢」（负面 · 演员）', 6, None,
   "In a dim office corridor at night, a desperate man in a crumpled shirt grips the forearm of a Malaysian Chinese businesswoman in her 40s in a navy "
   "suit; she holds a company cheque book against her chest, torn and hesitant. Medium shot, the man on the left seen mostly from behind, her face "
   "lit by a cold side light. " + REAL,
   "He tightens his grip and pleads; she slowly looks down at the cheque book in her hands. Only these small movements. " + LOCK),
 'p5_line': ('0:21.3「从年度格局来谈风险，带你先看代价、划清界限」（数字人 · 正能量）', 6, 'face',
   DH + " At a dark lacquered strategy table, she holds a slim golden brush and draws a glowing gold line across the table surface, separating a "
   "group of gold chess pieces on her side from scattered dark pieces on the other side. Warm candle light, a faint glowing luopan on the wall.",
   "She slowly draws the glowing gold line from left to right; the line lights up as she draws. Face consistent. " + LOCK),
 'p6_family': ('0:17.4「带你提前思考进退」（演员 · 正能量）', 6, None,
   "A warm Malaysian Chinese family home at night: three generations — grandparents, a couple in their 40s and two school-age children — share dinner "
   "around a round wooden table with dishes, warm pendant light, soft smiles, a window behind with golden city lights. Wide shot slightly from above. " + REAL,
   "The grandmother passes a dish to a child and everyone smiles gently; warm light slowly glows brighter. Only these small movements. " + LOCK),
 'p7_ai': ('0:05.1「你越追越急……更何况你的竞争对手不是人」（负面 · 演员 + 机器）', 6, None,
   "A Malaysian Chinese businessman in his 40s sits overwhelmed at a desk surrounded by many glowing monitors full of fast-moving abstract data; next "
   "to him a sleek white robotic arm types on a keyboard at blinding speed. Cold blue light, dark office, shallow depth of field. " + REAL,
   "The robotic arm types faster and faster while the man freezes and stares at it. Everything else stays still. " + LOCK),
 'p7_chess': ('0:21.1「我会用年度的年盘来为你拆解局势……把力气压在关键的一步」（数字人 · 正能量）', 6, 'face',
   DH + " At a dark strategy board covered with many quiet gold and black chess pieces, she calmly reaches out and pushes a single golden chess piece "
   "forward onto a glowing square; a soft golden Qimen year chart glows on the wall behind her.",
   "She pushes the one golden piece forward; the square under it lights up gold. All other pieces stay completely still. Face consistent. " + LOCK),
 'p8_sink': ('0:07.3「新伙伴到底是贵人，还是拖你下水的人」（负面 · 演员）', 6, None,
   "Underwater in dark murky blue-green water, a man in a business suit sinks slowly, reaching up toward the faint light at the surface, while a "
   "shadowy hand from the darkness below grips his ankle. Bubbles rising, cinematic god-rays from above, his face turned upward and blurred.",
   "He sinks a little deeper while the shadowy hand pulls; bubbles rise toward the light. " + LOCK),
 'p8_map': ('0:16.3「建立全局观：哪里深耕，哪里转向，哪里攻守」（数字人 · 正能量）', 6, 'face',
   DH + " She stands beside a large glowing golden luopan map floating above a dark table in a modern boardroom at night, pointing at it; three "
   "golden light paths branch out from the centre of the luopan in different directions.",
   "She points and the three golden paths light up one by one. Face consistent. " + LOCK),
 'p9_spend': ('0:11.1「系统买了，课程上了，营业额却没有动静」（负面 · 演员）', 6, None,
   "A Malaysian Chinese business owner in her late 30s sits at a desk facing several glowing AI dashboard screens with flat lines (no readable text); "
   "banknotes on the desk dissolve into glowing blue digital particles that drift into the screens. Cool blue light, dark office. " + REAL,
   "The banknotes keep dissolving into blue particles that float into the screens while she watches, unmoving. " + LOCK),
 'p9_focus': ('0:26.5「再决定下一笔的技术投入，到底值不值得」（数字人 · 正能量）', 6, 'face',
   DH + " At an elegant desk she holds up a small glowing microchip over an antique gold balance scale, examining it thoughtfully; warm golden light "
   "and a faint Qimen nine-palace pattern on the wall behind.",
   "She slowly places the glowing chip on one pan of the scale and the scale tips gently; she gives a knowing nod. Face consistent. " + LOCK),
 'i1_shop': ('0:07.5「老顾客越来越少，利润越来越薄」（负面 · 演员）', 6, None,
   "Inside an old traditional Malaysian Chinese family shop with wooden shelves and faded goods, a Chinese shop owner in his 60s stands alone behind "
   "the counter looking out at an empty street through the shop front; late afternoon light, dust in the air, quiet and lonely. " + REAL,
   "He slowly wipes the counter with a cloth and looks out at the empty street; dust floats in the light beam. " + LOCK),
 'i1_roots': ('0:17.1「把 20 年你累积下来的根基，用来争取下一步的突破」（没有人 · 正能量）', 6, None,
   "A giant ancient banyan tree on a hill at sunrise, its massive roots spreading over the ground; golden light glows along the roots, and a fresh "
   "bright green new branch rises from the top toward the rising sun; sea of clouds below.",
   "Golden light slowly travels up from the roots into the trunk and the new branch glows brighter in the sunrise. " + LOCK),
 'i2_lead': ('0:26.7「带你领先审视方向，再聚焦团队的火力」（数字人 · 正能量）', 6, 'face',
   DH + " She stands at the front of a modern open office at dawn, pointing forward toward a beam of golden light through a large window; a team of "
   "about ten people seen from behind turn toward the light with her. Warm sunrise light.",
   "She points forward and the golden light beam grows brighter; the team behind her steps forward together. Face consistent. " + LOCK),
 'i3_late': ('0:05.6「你太想做出成绩，把储备金、时间、退路全压进去」（负面 · 演员，不是 Suyen）', 6, None,
   "A Malaysian Chinese woman entrepreneur in her early 30s with long hair tied back sits alone late at night in her small studio workshop, slumped "
   "over a laptop with several empty coffee cups and boxes of products around her; a single desk lamp, dark windows. Medium shot. " + REAL,
   "She slowly rests her head on her arm next to the laptop, exhausted; the laptop light flickers on her face. " + LOCK),
 'i3_step': ('0:20.3「带你看准进退，把力气集中在最关键的一步」（演员 · 正能量）', 6, None,
   "The same kind of young Malaysian Chinese woman entrepreneur in a smart cream blazer stands confidently on a flat stepping stone in a calm misty "
   "river at sunrise; only the next stepping stone ahead of her glows with warm golden light, the others are dim. Wide shot from the side. " + REAL,
   "She lifts her foot and steps onto the glowing stone; the golden light ripples across the water. " + LOCK),
 'i4_reno': ('0:14.1「装修费、设备、加盟费，门店还没开，几十万已经出了」（负面 · 演员）', 6, None,
   "A young Malaysian Chinese man in his late 20s stands in an unfinished shop under renovation: bare concrete walls, ladders, cables hanging, stacked "
   "equipment boxes, dust in the air; he holds a folder and frowns at the mess. Medium-wide shot. " + REAL,
   "Dust slowly drifts in the light beam while he sighs and lowers the folder. " + LOCK),
 'i4_oxrat': ('0:19.6「破太岁、害太岁，大耗还有小耗凶星」（负面 2027 火焰风格）', 6, 'fire',
   FIRE + " A massive ox with huge horns and a smaller rat, both made of dark lava-cracked stone with fiery manes and tails, stand on dark volcanic "
   "ground under a smoky red sky, embers flying. Wide 16:9 composition, the ox on the left, the rat on the right.",
   "Embers fly and the lava cracks pulse with glowing light; the ox lowers its head and snorts fire. " + LOCK),
 'i5_box': ('0:07.6「十年的经验重新换岗位，下一份收入未必达到」（负面 · 演员）', 6, None,
   "A Malaysian Chinese office worker in his late 30s in a white shirt carries a cardboard box of his belongings out of a glass office tower and stops "
   "at a busy street corner, people rushing past blurred; overcast light, he looks unsure. Medium shot. " + REAL,
   "He stops and looks around while blurred people rush past him. " + LOCK),
 'i5_road': ('0:19.0「给你职业方向重新定位，趁你还有选择，先准备第二条路」（没有人 · 正能量）', 6, None,
   "A high mountain pass at sunrise: the main stone road continues ahead, and a second path branches off to the right, glowing with warm golden light "
   "toward a sunlit valley; ink-wash mountain layers, sea of clouds.",
   "The golden light slowly spreads along the second path as the sun rises. " + LOCK),
}
EP_TITLE = {2: 'P2 翻身变赔钱', 3: 'P3 赚到的钱押错', 4: 'P4 现金被烧光', 5: 'P5 拿公司钱救人', 6: 'P6 全家的退路', 7: 'P7 对手不是人',
            8: 'P8 贵人还是拖你下水', 9: 'P9 AI 赚钱还是花钱', 10: 'I1 做了 20 年的老板', 11: 'I2 做领导的你', 12: 'I3 创业的女性',
            13: 'I4 生肖牛鼠第一次创业', 14: 'I5 35 岁以后'}
EP_SCENES = {2: ['p2_loss', 'p2_fork'], 3: ['p3_bet', 'p3_scale'], 4: ['p4_bills', 'p4_burn'], 5: ['p5_plea', 'p5_line'], 6: ['p6_family'],
             7: ['p7_ai', 'p7_chess'], 8: ['p8_sink', 'p8_map'], 9: ['p9_spend', 'p9_focus'], 10: ['i1_shop', 'i1_roots'], 11: ['i2_lead'],
             12: ['i3_late', 'i3_step'], 13: ['i4_reno', 'i4_oxrat'], 14: ['i5_box', 'i5_road']}
REUSED = {2: '年盘、数字人指年盘、彩虹吉祥羊', 3: '彩虹吉祥羊', 4: '年盘、彩虹吉祥羊', 5: '彩虹吉祥羊', 6: '学费/账单/存款（p6_points）、火马火羊、彩虹吉祥羊',
          7: '彩虹吉祥羊', 8: '彩虹吉祥羊', 9: '年盘、彩虹吉祥羊', 10: '彩虹吉祥羊', 11: '老板带队冲出门（i2_team）、年盘、彩虹吉祥羊',
          12: '彩虹吉祥羊', 13: '（CTA 用她自己的 C0021，不用羊）', 14: '彩虹吉祥羊'}
OUTH = {'aiImage': 'result', 'aiVideo': 'result', 'fileUpload': 'output'}

def build(n):
    nodes, edges, types = [], [], {}
    def node(i, t, x, y, label, config, w=None, h=None):
        nd = {'id': i, 'type': t, 'position': {'x': x, 'y': y}, 'data': {'label': label, 'config': config}}
        if w: nd['width'] = w; nd['height'] = h; nd['style'] = {'width': w, 'height': h}
        nodes.append(nd); types[i] = t
    def edge(src, tgt, th):
        edges.append({'id': f'e_{src}_{tgt}_{th}', 'source': src, 'sourceHandle': OUTH.get(types.get(src)), 'target': tgt, 'targetHandle': th, 'type': 'deletable'})
    scenes = EP_SCENES[n]
    lines = [f'Suyen 广告第{n}集 · {EP_TITLE[n]} · B-roll（16:9）', '']
    for k, sid in enumerate(scenes):
        lines.append(f'{"①②③"[k]} {SC[sid][0]}')
    lines += ['', '每个场景都先跑第一帧图，满意了再跑影片（grok-imagine-1.5 · 720p，跟第一集一样）。',
              '负面场景用演员；只有正能量的才用数字人 Suyen（参考图是她 C0037 的正面截图）。',
              f'这一集直接重复用、不用再跑的：{REUSED[n]}。', '时间是成片时间，详见 pipeline/ep%d/第%d集-脚本.md' % (n, n)]
    node('note', 'stickyNote', 0, -480, '使用说明', {'text': '\n'.join(lines)}, 980, 330)
    kinds = {SC[s][2] for s in scenes}
    if 'face' in kinds:
        f = upload('ref_suyen_face.jpg')
        node('ref_face', 'fileUpload', 0, -100, '参考：Suyen 正面（C0037）', {'fileType': 'image', 'fileUrl': f, 'resultUrl': f, 'fileName': 'ref_suyen_face.jpg'})
    if 'fire' in kinds:
        r1, r2 = upload('ref_horse_goat_run.jpg'), upload('ref_goat_palace.jpg')
        node('ref_run', 'fileUpload', 400, -100, '参考：火马火羊奔跑', {'fileType': 'image', 'fileUrl': r1, 'resultUrl': r1, 'fileName': 'ref_horse_goat_run.jpg'})
        node('ref_palace', 'fileUpload', 800, -100, '参考：火羊 · 奇门天宫', {'fileType': 'image', 'fileUrl': r2, 'resultUrl': r2, 'fileName': 'ref_goat_palace.jpg'})
    for k, sid in enumerate(scenes):
        where, dur, ref, still, move = SC[sid]
        y = 300 + k * 460
        refs = {'face': ['ref_face'], 'fire': ['ref_run', 'ref_palace']}.get(ref, [])
        node(f'{sid}_img_txt', 'textInput', 0, y, f'{sid} · 第一帧提示', {'text': 'A wide 16:9 cinematic still. ' + still + ' ' + STYLE})
        node(f'{sid}_img', 'aiImage', 420, y, f'① 第一帧 · {where}',
             {'model': 'gpt-image-2', 'gptImage2Mode': 'i2i' if refs else 't2i', 'imageInputCount': len(refs), 'aspectRatio': '16:9', 'resolution': '2K',
              'gptImage2Quality': 'high', 'status': 'idle'})
        edge(f'{sid}_img_txt', f'{sid}_img', 'prompt')
        for i, r in enumerate(refs): edge(r, f'{sid}_img', f'image-{i}')
        node(f'{sid}_vid_txt', 'textInput', 840, y, f'{sid} · 影片提示',
             {'text': f'{dur}-second wide 16:9 cinematic shot. @image1 is the first frame; keep its look, people and composition. ' + move + ' ' + STYLE + ' No audio.'})
        node(f'{sid}_vid', 'aiVideo', 1260, y, f'② 影片 · {where}（{dur} 秒）',
             {'model': 'grok-imagine-1.5', 'generationType': 'image-to-video', 'qualityMode': 'fast', 'aspectRatio': '16:9', 'resolution': '720p',
              'duration': str(dur), 'multiShot': False, 'generateAudio': False, 'refImageCount': 1, 'referenceAudioCount': 0, 'referenceVideoCount': 0,
              'status': 'idle'})
        edge(f'{sid}_vid_txt', f'{sid}_vid', 'prompt'); edge(f'{sid}_img', f'{sid}_vid', 'ref-image-1')
    return nodes, edges

def main(eps):
    ids = json.load(open(IDS)) if os.path.exists(IDS) else {}
    for n in eps:
        name = f'Suyen · 广告第{n}集 · B-roll（{EP_TITLE[n]}）· 20261031'
        nodes, edges = build(n)
        wid = ids.get(str(n))
        if wid:
            cur = call('get_workflow', workflow_id=wid); cur = cur.get('workflow', cur)
            old = {o['id']: o for o in cur.get('nodes', [])}
            for nd in nodes:
                o = old.get(nd['id']); oc = o['data']['config'] if o else {}
                if o and (oc.get('resultUrl') or oc.get('historyId') or oc.get('status') == 'running'):
                    nd['data']['config'] = oc; nd['position'] = o.get('position', nd['position'])
        res = call('save_workflow', **({'workflow_id': wid} if wid else {}), name=name, nodes=nodes, edges=edges)
        if 'workflow_id' not in res: print(n, 'ERROR', json.dumps(res, ensure_ascii=False)[:800]); continue
        ids[str(n)] = res['workflow_id']; json.dump(ids, open(IDS, 'w'), indent=1)
        v = call('validate_workflow', workflow_id=res['workflow_id'])
        print(json.dumps({'ep': n, 'edit_url': res.get('edit_url'), 'nodes': res.get('node_count'), 'errors': v.get('validation', {}).get('errors'),
                          'empty_uploads': v.get('empty_uploads'), 'empty_prompts': v.get('empty_prompts'), 'ready_to_run': v.get('ready_to_run')}, ensure_ascii=False))

if __name__ == '__main__':
    main([int(a) for a in sys.argv[1:]] or sorted(EP_SCENES))
