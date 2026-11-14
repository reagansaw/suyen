"""Suyen 广告第一集 · B-roll 画布（16:9）：奇门年盘 / 数字人 Suyen 指年盘推棋子 / 横版火马火羊。只搭画布，不 Run。
用法：python3 suyen_ep1_build.py            新建
      python3 suyen_ep1_build.py --update   原地改（已跑出的结果保留）"""
import json, sys
from studio_api import call
from suyen_broll_build import upload

WORKFLOW_ID = 'a8a40fe5-c286-4d0e-b3a4-6f1cbb79adf9'   # 10-31 建好，之后用 --update
NAME = 'Suyen · 广告第一集 · B-roll（年盘 / 数字人 / 火马火羊横版）· 20261031'

STYLE = ("Premium cinematic Eastern aesthetic for a high-end Chinese metaphysics (Qimen Dunjia) strategy brand: refined and powerful, deep ink-black, "
         "warm antique-gold and touches of cinnabar red, soft volumetric light, light haze, photorealistic. No text, no letters, no readable Chinese "
         "characters, no logos, no watermark.")
DH = ("@image1 is the reference for the woman: Master Suyen, a Malaysian Chinese woman in her 50s with a chin-length dark-brown bob and side fringe, "
      "clear-frame glasses, a warm confident smile, wearing a coral-pink blazer over a white top and a thin gold necklace. Keep her face, hair, glasses "
      "and outfit exactly the same as @image1.")
SCENES = [
    ('yearchart', '② 0:18.6–0:24「我将会用年度的年盘，拆解趋势、格局」', 6, False,
     "A colossal glowing golden Qimen Dunjia year chart floats in the night sky above a modern Kuala Lumpur city skyline: a nine-palace grid inside "
     "concentric luopan rings with fine engraved ticks and eight trigram symbols, made of light and antique gold. The nine palaces light up one by one, "
     "golden light lines connect them, then a beam of light shoots out from one palace toward a direction on the horizon.",
     "Slow orbiting camera push-in toward the chart; the rings rotate in opposite directions, palaces light up one by one, golden dust drifts, the city "
     "lights twinkle below."),
    ('dh_point', '② 0:24–0:31「对的宫位、方向、时间点，带你找准投入以及防守的重点」（数字人·正能量）', 6, True,
     DH + " In a modern glass boardroom at night high above the city, she stands beside a floating holographic golden Qimen year chart and points "
     "confidently at one glowing palace.",
     DH + " [0s-3s] Medium shot in the night boardroom: she points at one palace of the floating golden holographic Qimen chart, the palace glows brighter "
     "and a beam of light extends from it. HARD CUT. [3s-6s] Close-up of her hand placing a golden chess piece forward on a dark strategy board while her "
     "other hand sets a jade shield-shaped piece behind it; she looks up at the camera with a calm, sure smile. Natural hands with five fingers, face "
     "consistent, no morphing."),
    ('horse_goat_h', '④ 0:60–0:63「2027 年那么混乱的赤马红羊年」（横版）', 5, False,
     "Match the look of @image1 and @image2 exactly. A majestic horse and a large ram with huge curled horns, both with dark stone-like skin covered in "
     "glowing orange lava cracks, manes and tails of roaring fire, glowing eyes, gallop side by side from left to right across dark volcanic ground, flames "
     "bursting from every hoof, sparks and embers flying, dark smoky sky. Wide 16:9 composition with the animals on the left two-thirds.",
     "Slow-motion side tracking shot following the two animals as they gallop; fire manes stream back, embers fly, dust and smoke roll."),
]
NOTE = """Suyen 广告第一集 · B-roll（16:9）
① 奇门年盘浮在城市上空：讲「年盘、趋势、格局」时用。
② 数字人 Suyen（正能量才用数字人）：讲「宫位、方向、时间点，投入和防守」时用。参考图是她 C0037 自我介绍片的正面截图。
③ 火马火羊横版：讲「赤马红羊年」时用，照你给的两张参考图。
都先跑第一帧图，满意了再跑影片。之前那批影片 720p 比较清楚，影片节点可以照那样设定。
彩虹吉祥羊（收尾用）在旧画布已经跑好，这里不用再跑。"""

OUTH = {'aiImage': 'result', 'aiVideo': 'result', 'fileUpload': 'output'}

def build():
    nodes, edges, types = [], [], {}
    def node(i, t, x, y, label, config, w=None, h=None):
        n = {'id': i, 'type': t, 'position': {'x': x, 'y': y}, 'data': {'label': label, 'config': config}}
        if w: n['width'] = w; n['height'] = h; n['style'] = {'width': w, 'height': h}
        nodes.append(n); types[i] = t
    def edge(src, tgt, th):
        edges.append({'id': f'e_{src}_{tgt}_{th}', 'source': src, 'sourceHandle': OUTH.get(types.get(src)), 'target': tgt, 'targetHandle': th, 'type': 'deletable'})
    node('note', 'stickyNote', 0, -480, '使用说明', {'text': NOTE}, 980, 330)
    f, r1, r2 = upload('ref_suyen_face.jpg'), upload('ref_horse_goat_run.jpg'), upload('ref_goat_palace.jpg')
    node('ref_face', 'fileUpload', 0, -100, '参考：Suyen 正面（C0037）', {'fileType': 'image', 'fileUrl': f, 'resultUrl': f, 'fileName': 'ref_suyen_face.jpg'})
    node('ref_run', 'fileUpload', 400, -100, '参考：火马火羊奔跑', {'fileType': 'image', 'fileUrl': r1, 'resultUrl': r1, 'fileName': 'ref_horse_goat_run.jpg'})
    node('ref_palace', 'fileUpload', 800, -100, '参考：火羊 · 奇门天宫', {'fileType': 'image', 'fileUrl': r2, 'resultUrl': r2, 'fileName': 'ref_goat_palace.jpg'})
    for k, (sid, where, dur, dh, still, move) in enumerate(SCENES):
        y = 300 + k * 460
        refs = ['ref_face'] if dh else (['ref_run', 'ref_palace'] if sid == 'horse_goat_h' else [])
        node(f'{sid}_img_txt', 'textInput', 0, y, f'{where} · 第一帧提示', {'text': 'A wide 16:9 cinematic still. ' + still + ' ' + STYLE})
        node(f'{sid}_img', 'aiImage', 420, y, f'① 第一帧 · {where}',
             {'model': 'gpt-image-2', 'gptImage2Mode': 'i2i' if refs else 't2i', 'imageInputCount': len(refs), 'aspectRatio': '16:9', 'resolution': '2K',
              'gptImage2Quality': 'high', 'status': 'idle'})
        edge(f'{sid}_img_txt', f'{sid}_img', 'prompt')
        for i, r in enumerate(refs): edge(r, f'{sid}_img', f'image-{i}')
        node(f'{sid}_vid_txt', 'textInput', 840, y, f'{where} · 影片提示',
             {'text': f'{dur}-second wide 16:9 cinematic shot. @image1 is the first frame. ' + move.replace('@image1 is the reference', 'The first frame shows the reference') + ' ' + STYLE + ' No audio.'})
        node(f'{sid}_vid', 'aiVideo', 1260, y, f'② 影片 · {where}（{dur} 秒）',
             {'model': 'seedance-2.5', 'qualityMode': 'hd', 'generationType': 'text-to-video', 'aspectRatio': '16:9', 'resolution': '1080p', 'duration': str(dur),
              'multiShot': False, 'generateAudio': False, 'refImageCount': 1, 'referenceAudioCount': 0, 'referenceVideoCount': 0, 'status': 'idle'})
        edge(f'{sid}_vid_txt', f'{sid}_vid', 'prompt'); edge(f'{sid}_img', f'{sid}_vid', 'ref-image-1')
    return nodes, edges

if __name__ == '__main__':
    nodes, edges = build()
    wid = WORKFLOW_ID if '--update' in sys.argv else None
    if wid:
        cur = call('get_workflow', workflow_id=wid); cur = cur.get('workflow', cur)
        old = {n['id']: n for n in cur['nodes']}
        for n in nodes:
            o = old.get(n['id']); oc = o['data']['config'] if o else {}
            if o and (oc.get('resultUrl') or oc.get('historyId') or oc.get('status') == 'running'):
                n['data']['config'] = oc; n['position'] = o.get('position', n['position'])
    res = call('save_workflow', **({'workflow_id': wid} if wid else {}), name=NAME, nodes=nodes, edges=edges)
    print(json.dumps({k: v for k, v in res.items() if k in ('workflow_id', 'created', 'edit_url', 'node_count', 'edge_count', 'error', 'body')}, ensure_ascii=False))
    if 'workflow_id' in res:
        v = call('validate_workflow', workflow_id=res['workflow_id'])
        print('ready_to_run', v.get('ready_to_run'), 'errors', v.get('validation', {}).get('errors'))
