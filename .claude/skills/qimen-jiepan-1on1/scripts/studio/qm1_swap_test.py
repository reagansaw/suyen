"""奇门解盘 · 客人换人测试画布（只搭画布，不 Run）。
测试片段 H：「他有真的要骗我吗？」（qimen-1on1/swap/H.mp4，5 秒，开头钩用的那一段）。
① GPT Image 2 改图：原片第一格 → 同一个房间、同一个姿势，人换成年长的（定妆图）
② Seedance 2.5：@video1 = 原片（动作、嘴型），@image1 = 定妆图 → 换人后的 5 秒
用法：python3 qm1_swap_test.py            新建
      python3 qm1_swap_test.py --update   原地改（已跑出的结果保留）
钥匙：环境变量 AIGOAL_STUDIO_KEY 或 repo 根目录 .env。"""
import json, os, subprocess, sys
from studio_api import call

HERE = os.path.dirname(os.path.abspath(__file__))
SWAP = os.path.join(HERE, '..', 'qimen-1on1', 'swap')
CACHE = os.path.join(SWAP, 'studio_test.json')     # 上传过的网址和画布 id（swap/ 不进 git）
NAME = 'Suyen · 奇门解盘 · 客人换人测试（H 段 5 秒）· 20261114'

# 年长的样子：Reagan 还没定，先用「55 岁左右华人老板」。要改就改这一段，再 --update。
MAN = ("a Malaysian Chinese businessman about 55 years old: short neat hair that is mostly grey at the temples, a slightly fuller mature face, light "
       "wrinkles on the forehead and around the eyes, natural uneven skin texture with visible pores, calm serious expression, wearing a plain dark navy "
       "long-sleeved collared shirt, no tattoos, no watch, no jewellery")
IMG_PROMPT = ("Edit @image1. Keep everything exactly the same: the same room, the same pale green armchair, the white sofa, the wooden table edge, the wall "
              "decorations, the same camera angle, framing, lighting and colour, and the same body pose, head direction and hand position. Change only the "
              "person: replace the young man with " + MAN + ". He must be a new, fictional person who does not look like any real or famous person. "
              "Photorealistic, like an unedited iPhone video frame: no beauty filter, no smoothing, natural hands with five fingers. Vertical 9:16. "
              "No text, no logos, no watermark.")
VID_PROMPT = ("5-second vertical 9:16 realistic iPhone interview footage, locked-off camera. @video1 is the performance reference: copy its framing, the "
              "room, the chair, the lighting, and the man's exact body movement, head turns, hand gestures, blinking, expression timing and lip movements, "
              "beat for beat. Replace only the person: the man is the person in @image1, with the same face, hair, age and clothing as @image1 in every "
              "frame. He is speaking Mandarin Chinese to someone off-camera on the right, asking seriously: 「他有真的要骗我吗？」 His mouth movements "
              "match the speech in @video1. Natural skin texture, natural hands with five fingers, face stays consistent, no morphing, no beauty filter, "
              "no camera movement, no text, no subtitles, no logos, no watermark.")
EDIT_PROMPT = ("Edit this clip. Replace the young man with the person in @image1: the same face, grey hair, age and dark navy long-sleeved shirt as @image1, "
               "no tattoos, no watch. Change nothing else. Keep the original clip's timing frame for frame: the same mouth and lip movements for every "
               "syllable he speaks, the same blinking, head turns, hand gestures and body movement, the same camera framing, room, chair, table and "
               "lighting. The lips must stay perfectly in sync with the original speech. Photorealistic, natural skin texture, natural hands with five "
               "fingers, face stays consistent, no morphing, no beauty filter, no text, no subtitles, no watermark.")
NOTE = """奇门解盘 · 客人换人测试（只测 1 段）

目的：看 Seedance 2.5 能不能把客人换成年长的人，而且像真人、嘴型对得上。

怎么跑（由你按 Run）：
① 先跑「定妆图」：原片第一格改成年长的人。脸不满意就重跑，或改提示里的年纪 / 样子。
② 定妆图满意了，再跑「换人影片 A」（没有声音，只看画面）。
③ 「换人影片 B」多接了原片的声音当参考，嘴型可能更准；A 不行才试 B。B 出来的声音不会用，声音之后另外换。

看三样：脸像不像真人、嘴型对不对得上「他有真的要骗我吗？」、手有没有坏。
过关 → 其余 9 段照这个做，全部用同一张定妆图。
不过关 → 改用专门的动作驱动换人模型，或只拍手不出脸。

11-14 更新：A 的嘴型对不上。新加了 ③「改原片换人」C 和 D：直接在原片上把人换掉，嘴型留在原片上。
先跑 C（Seedance 2.0 Video Edit），不行再跑 D（Wan 2.7 Video Edit）。D 的 Model 如果是空的，表示这个模型现在没开，在下拉自己选一个。定妆图不用重跑。

年长的样子现在是我先填的「55 岁左右华人老板」，你还没定。
这张脸必须是 AI 生成、不存在的人。"""


def upload(path, name, ctype):
    up = call('create_upload', filename=os.path.basename(path), size_bytes=os.path.getsize(path), content_type=ctype)
    assert up.get('upload_url'), up
    r = subprocess.run(['curl', '-sS', '--retry', '3', '-X', 'PUT', up['upload_url'], '-H', f'Content-Type: {ctype}', '--data-binary', '@' + path], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    fin = call('finish_upload', path=up['path'], file_name=name)
    assert fin.get('file_url'), fin
    return {'file_url': fin['file_url'], 'node_config': fin.get('node_config') or {}}


def build(frame, video, audio, video6):
    nodes, edges = [], []
    def node(i, t, x, y, label, config, w=None, h=None):
        n = {'id': i, 'type': t, 'position': {'x': x, 'y': y}, 'data': {'label': label, 'config': config}}
        if w: n['width'] = w; n['height'] = h; n['style'] = {'width': w, 'height': h}
        nodes.append(n)
    def edge(src, sh, tgt, th): edges.append({'id': f'e_{src}_{tgt}_{th}', 'source': src, 'sourceHandle': sh, 'target': tgt, 'targetHandle': th, 'type': 'deletable'})
    def up(i, y, label, kind, f, fn): node(i, 'fileUpload', 0, y, label, {**f['node_config'], 'fileType': kind, 'fileName': fn, 'fileUrl': f['file_url'], 'resultUrl': f['file_url']})
    def vid(i, y, label, n_audio):
        node(i, 'aiVideo', 1500, y, label, {'model': 'seedance-2.5', 'generationType': 'text-to-video', 'qualityMode': 'hd', 'aspectRatio': '9:16', 'resolution': '720p',
             'duration': '5', 'refImageCount': 1, 'referenceAudioCount': n_audio, 'referenceVideoCount': 1, 'generateAudio': bool(n_audio), 'fixedLens': True,
             'multiShot': False, 'shotCount': 1, 'shotDurations': [5], 'elements': [], 'status': 'idle'})
        edge('vid_txt', None, i, 'prompt'); edge('look', 'result', i, 'ref-image-1'); edge('up_video', 'output', i, 'ref-video-1')
        if n_audio: edge('up_audio', 'output', i, 'ref-audio-1')
    node('note', 'stickyNote', 0, -560, '使用说明', {'text': NOTE}, 900, 480)
    up('up_frame', 0, '原片第一格（H 段）', 'image', frame, 'H 段第一格.jpg')
    up('up_video', 460, '原片 H 段 5 秒（动作和嘴型参考）', 'video', video, 'H 段原片 5 秒.mp4')
    up('up_audio', 920, '原片 H 段声音（只给影片 B 用）', 'audio', audio, 'H 段原声.mp3')
    node('look_txt', 'textInput', 500, 0, '① 定妆图 · 提示', {'text': IMG_PROMPT})
    node('look', 'aiImage', 980, 0, '① 定妆图：年长的客人', {'model': 'gpt-image-2', 'gptImage2Mode': 'i2i', 'imageInputCount': 1, 'aspectRatio': '9:16', 'resolution': '2K',
                                                     'gptImage2Quality': 'high', 'status': 'idle'})
    edge('look_txt', None, 'look', 'prompt'); edge('up_frame', 'output', 'look', 'image-0')
    node('vid_txt', 'textInput', 980, 560, '② 换人影片 · 提示', {'text': VID_PROMPT})
    vid('swap_a', 460, '② 换人影片 A：参考影片 + 定妆图（没有声音）', 0)
    vid('swap_b', 1000, '② 换人影片 B：再加原片声音当参考（A 不行才试）', 1)
    # 11-14：A 的嘴型对不上（Seedance 是重新生成，不会照抄嘴型）→ 改用「改原片」的做法：直接在原片上换人，动作和嘴型留在原片上
    up('up_video6', 1400, '原片 H 段 6 秒（带原声，给「改原片」用）', 'video', video6, 'H 段原片 6 秒.mp4')
    node('edit_txt', 'textInput', 980, 1500, '③ 改原片换人 · 提示', {'text': EDIT_PROMPT})
    # Video Edit 节点的设定照 studio 源码 videoEditModels.ts / AIVideoEditNode.tsx：model 要用 *-video-edit 的 id；
    # refImageCount 要填 1，参考图的接口才会出现；aspectRatio / duration 用 auto 跟原片。
    for i, (nid, model, label) in enumerate([('edit_sd', 'seedance-2.0-video-edit', '③ 改原片换人 C：Seedance 2.0 Video Edit'), ('edit_wan', 'wan-2.7-video-edit', '③ 改原片换人 D：Wan 2.7 Video Edit')]):
        node(nid, 'aiVideoEdit', 1500, 1500 + i * 520, label, {'model': model, 'aspectRatio': 'auto', 'resolution': '720p', 'duration': 'auto', 'generateAudio': False,
             'enableWebSearch': False, 'refImageCount': 1, 'refAudioCount': 0, 'status': 'idle', 'resultUrl': None, 'historyId': None})
        edge('edit_txt', None, nid, 'prompt'); edge('up_video6', 'output', nid, 'source-video'); edge('look', 'result', nid, 'ref-image-1')
    return nodes, edges


if __name__ == '__main__':
    if '--dry' in sys.argv:
        f = {'file_url': 'https://example.invalid/x', 'node_config': {}}
        n, e = build(f, f, f, f); print(len(n), 'nodes', len(e), 'edges'); [print(' ', x['source'], '->', x['target'], x['targetHandle']) for x in e]; sys.exit(0)
    prev = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    mp3 = os.path.join(SWAP, 'H.mp3')
    if not os.path.exists(mp3): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(SWAP, 'H.mp4'), '-vn', '-c:a', 'libmp3lame', '-b:a', '160k', mp3], check=True)
    silent = os.path.join(SWAP, 'H_silent.mp4')
    if not os.path.exists(silent): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(SWAP, 'H.mp4'), '-an', '-c:v', 'copy', silent], check=True)
    prev['frame'] = prev.get('frame') or upload(os.path.join(SWAP, 'H.jpg'), 'H 段第一格.jpg', 'image/jpeg')
    prev['video'] = prev.get('video') or upload(silent, 'H 段原片 5 秒.mp4', 'video/mp4')
    prev['audio'] = prev.get('audio') or upload(mp3, 'H 段原声.mp3', 'audio/mpeg')
    h6 = os.path.join(SWAP, 'H6.mp4')
    prev['video6'] = prev.get('video6') or upload(h6, 'H 段原片 6 秒.mp4', 'video/mp4')
    json.dump(prev, open(CACHE, 'w'), indent=1)
    nodes, edges = build(prev['frame'], prev['video'], prev['audio'], prev['video6'])
    wid = prev.get('workflow_id') if '--update' in sys.argv else None
    if wid:
        cur = call('get_workflow', workflow_id=wid); cur = cur.get('workflow', cur)
        old = {n['id']: n for n in cur['nodes']}
        for n in nodes:
            o = old.get(n['id']); oc = o['data']['config'] if o else {}
            if o and n['type'] in ('aiImage', 'aiVideo', 'aiVideoEdit') and (oc.get('resultUrl') or oc.get('historyId') or oc.get('status') == 'running'):
                n['data']['config'] = oc; n['position'] = o.get('position', n['position'])
    res = call('save_workflow', **({'workflow_id': wid} if wid else {}), name=NAME, nodes=nodes, edges=edges)
    print(json.dumps({k: v for k, v in res.items() if k in ('workflow_id', 'created', 'edit_url', 'node_count', 'edge_count', 'error', 'body')}, ensure_ascii=False))
    if 'workflow_id' in res:
        prev['workflow_id'] = res['workflow_id']; prev['edit_url'] = res.get('edit_url'); json.dump(prev, open(CACHE, 'w'), indent=1)
        v = call('validate_workflow', workflow_id=res['workflow_id'])
        print('ready_to_run', v.get('ready_to_run'), 'errors', v.get('validation', {}).get('errors'), 'warnings', v.get('validation', {}).get('warnings'))
