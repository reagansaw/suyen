"""奇门解盘 · B-roll 画布（1:1，放上半格）。只搭画布，不 Run。
两段：① 账本和对不上的数字（「他讲的跟我看到的不一样」）② 三年没翻的账本（「我至少三年的账都没去看」）。
每段：GPT Image 2 出第一帧 → Seedance 2.5 5 秒、没有声音。
用法：python3 qm1_broll_build.py [--update]   钥匙：AIGOAL_STUDIO_KEY 或 repo 根目录 .env"""
import json, os, sys
from studio_api import call

CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'qimen-1on1', 'swap', 'studio_broll.json')
NAME = 'Suyen · 奇门解盘 · B-roll（账本 2 段，1:1）· 20261114'
STYLE = ("Photorealistic documentary footage of a small Malaysian company office, shot on a cinema camera with a 50mm lens, shallow depth of field, warm "
         "tungsten desk-lamp light with soft shadows, slightly moody, muted colours with a faint wine-red and cream tint. Square 1:1 framing with the "
         "subject in the centre. No faces, no people other than hands, no readable text, no real brand names, no logos, no watermark, no subtitles.")
SCENES = [
    ('ledger', '① 账本和对不上的数字 ·「他讲的跟我看到的不一样」',
     "Close-up of a wooden office desk: an open accounting ledger filled with handwritten columns of numbers next to a few printed bank statements, a "
     "calculator and a cup of kopi. A middle-aged man's hand holds a red pen above one line where two numbers do not match.",
     "Slow push-in. The hand with the red pen slides down the column, stops, and circles one number twice, then taps the matching line on the printed "
     "statement beside it. The other hand turns one page of the ledger. Natural hands with five fingers."),
    ('dusty', '② 三年没翻的账本 ·「我至少三年的账都没去看」',
     "A metal office shelf in a dim storeroom with a row of thick old arch files and account books, a thin layer of dust on top, one beam of light "
     "from a small window showing dust in the air.",
     "Slow sideways tracking shot along the shelf. A man's hand reaches in, pulls out one thick dusty file, and dust lifts off into the beam of light. "
     "He blows lightly across the cover. Natural hands with five fingers."),
]
NOTE = """奇门解盘 · B-roll（放在上半格，所以是 1:1）
① 账本和对不上的数字：客人讲「最近我发现他讲的，跟我看到的不一样」时用。
② 三年没翻的账本：客人讲「我至少三年的账都没去看」时用。
每段先跑第一帧图，满意了再跑影片（5 秒，没有声音）。
画面里不会出现人脸和看得懂的字。"""


def build():
    nodes, edges = [], []
    def node(i, t, x, y, label, config, w=None, h=None):
        n = {'id': i, 'type': t, 'position': {'x': x, 'y': y}, 'data': {'label': label, 'config': config}}
        if w: n['width'] = w; n['height'] = h; n['style'] = {'width': w, 'height': h}
        nodes.append(n)
    def edge(src, sh, tgt, th): edges.append({'id': f'e_{src}_{tgt}_{th}', 'source': src, 'sourceHandle': sh, 'target': tgt, 'targetHandle': th, 'type': 'deletable'})
    node('note', 'stickyNote', 0, -420, '使用说明', {'text': NOTE}, 900, 320)
    for k, (sid, where, still, move) in enumerate(SCENES):
        y = k * 520
        node(f'{sid}_img_txt', 'textInput', 0, y, f'{where} · 第一帧提示', {'text': 'A square 1:1 cinematic still. ' + still + ' ' + STYLE})
        node(f'{sid}_img', 'aiImage', 440, y, f'第一帧 · {where}', {'model': 'gpt-image-2', 'gptImage2Mode': 't2i', 'imageInputCount': 0, 'aspectRatio': '1:1', 'resolution': '2K',
                                                                'gptImage2Quality': 'high', 'status': 'idle'})
        edge(f'{sid}_img_txt', None, f'{sid}_img', 'prompt')
        node(f'{sid}_vid_txt', 'textInput', 880, y, f'{where} · 影片提示', {'text': '5-second square 1:1 cinematic shot. @image1 is the first frame. ' + move + ' ' + STYLE + ' No audio.'})
        node(f'{sid}_vid', 'aiVideo', 1320, y, f'影片 · {where}（5 秒）', {'model': 'seedance-2.5', 'generationType': 'text-to-video', 'qualityMode': 'standard', 'aspectRatio': '1:1',
             'resolution': '720p', 'duration': '5', 'multiShot': False, 'generateAudio': False, 'refImageCount': 1, 'referenceAudioCount': 0, 'referenceVideoCount': 0, 'status': 'idle'})
        edge(f'{sid}_vid_txt', None, f'{sid}_vid', 'prompt'); edge(f'{sid}_img', 'result', f'{sid}_vid', 'ref-image-1')
    return nodes, edges


if __name__ == '__main__':
    nodes, edges = build()
    prev = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    wid = prev.get('workflow_id') if '--update' in sys.argv else None
    if wid:
        cur = call('get_workflow', workflow_id=wid); cur = cur.get('workflow', cur)
        old = {n['id']: n for n in cur['nodes']}
        for n in nodes:
            o = old.get(n['id']); oc = o['data']['config'] if o else {}
            if o and n['type'] in ('aiImage', 'aiVideo') and (oc.get('resultUrl') or oc.get('historyId') or oc.get('status') == 'running'):
                n['data']['config'] = oc; n['position'] = o.get('position', n['position'])
    res = call('save_workflow', **({'workflow_id': wid} if wid else {}), name=NAME, nodes=nodes, edges=edges)
    print(json.dumps({k: v for k, v in res.items() if k in ('workflow_id', 'created', 'edit_url', 'node_count', 'edge_count', 'error', 'body')}, ensure_ascii=False))
    if 'workflow_id' in res:
        prev['workflow_id'] = res['workflow_id']; json.dump(prev, open(CACHE, 'w'), indent=1)
        v = call('validate_workflow', workflow_id=res['workflow_id'])
        print('ready_to_run', v.get('ready_to_run'), 'errors', v.get('validation', {}).get('errors'))
