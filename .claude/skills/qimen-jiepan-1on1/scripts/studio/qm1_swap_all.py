"""奇门解盘 · 客人换人 · 全部镜头（只搭画布，不 Run）。
做法（Reagan 11-14 定）：Seedance 2.5，画面和声音一起生成，用它自己生成的声音，嘴型才对得上。
每段：@image1 = 定妆图（测试画布跑出来的那张，swap/look-v1.png），@video1 = 原片那一段（动作），@audio1 = 他那一句原声（嗓音参考）。
H 段（「他有真的要骗我吗？」）测试时已经跑好（测试画布的「换人影片 B」），这里不再跑。
用法：python3 qm1_swap_all.py            新建
      python3 qm1_swap_all.py --update   原地改（已跑出的结果保留）
钥匙：环境变量 AIGOAL_STUDIO_KEY 或 repo 根目录 .env。"""
import json, os, subprocess, sys
from studio_api import call

HERE = os.path.dirname(os.path.abspath(__file__))
SWAP = os.path.join(HERE, '..', 'qimen-1on1', 'swap')
CACHE = os.path.join(SWAP, 'studio_all.json')      # 上传过的网址和画布 id（swap/ 不进 git）
NAME = 'Suyen · 奇门解盘 · 客人换人 · 全部 9 段（Seedance 2.5 连声音一起生成）· 20261114'
# 段, 秒数, 他讲的话（照字幕）, 语气
CLIPS = [('A', 7, '我公司全部的账和钱，是给一个伙伴管的。', 'explaining calmly but worried'),
         ('B', 5, '最近我发现他讲的，跟我看到的不一样。', 'frowning slightly, uneasy'),
         ('C', 4, '我们合作了十几二十年。', 'heavy-hearted'),
         ('D', 4, '这个人，我还能相信吗？', 'asking seriously'),
         ('F', 4, '也是最近转不过来，我才发现到的。', 'admitting it, a little embarrassed'),
         ('G', 4, '我至少三年的账都没去看。', 'regretful'),
         ('I', 4, '他几时开始要骗我了？', 'asking urgently'),
         ('J', 4, '那这个钱，吐不吐得出来？', 'asking anxiously'),
         ('E', 4, '是。', 'nodding once in agreement')]
def prompt(dur, say, mood):
    return (f"{dur}-second vertical 9:16 realistic iPhone interview footage, locked-off camera. @video1 is the performance reference: copy its framing, the "
            "room, the chair, the lighting, and the man's body movement, head turns and hand gestures. Replace only the person: the man is the person in "
            "@image1, with the same face, hair, age and clothing as @image1 in every frame. He is speaking Malaysian Mandarin Chinese to someone off-camera "
            f"on the right, {mood}, and says exactly this one line, once: 「{say}」 His voice is the voice in @audio1. His lips match every syllable of the "
            "speech. After the line he stays silent and keeps looking at the other person. Sound: only his voice and quiet room tone, no music, no sound "
            "effects, no other voices. Natural skin texture, natural hands with five fingers, face stays consistent, no morphing, no beauty filter, no "
            "camera movement, no text, no subtitles, no logos, no watermark.")
NOTE = """奇门解盘 · 客人换人 · 全部镜头

做法：Seedance 2.5 把画面和声音一起生成，成片用它自己生成的声音（之后再压低），嘴型才对得上。
每段都接了同一张定妆图，所以 9 段是同一个人。

怎么跑（由你按 Run）：
- 一段一个节点，从上到下 A、B、C、D、F、G、I、J。每段 720p。
- 最下面的 E 只有一个字「是。」，可以不跑；不跑的话那一格我改放老师。
- H 段（「他有真的要骗我吗？」）测试时已经跑好，不在这里。

每段跑完看三样：脸是不是同一个人、嘴型对不对、讲的字有没有错。
不满意就在那一个节点重跑，不用动别的。
跑完告诉我，我会把每段拉下来、把声音转成文字核对一次，再放进片子。"""


def upload(path, name, ctype):
    up = call('create_upload', filename=os.path.basename(path), size_bytes=os.path.getsize(path), content_type=ctype)
    assert up.get('upload_url'), up
    r = subprocess.run(['curl', '-sS', '--retry', '3', '-X', 'PUT', up['upload_url'], '-H', f'Content-Type: {ctype}', '--data-binary', '@' + path], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    fin = call('finish_upload', path=up['path'], file_name=name)
    assert fin.get('file_url'), fin
    return {'file_url': fin['file_url'], 'node_config': fin.get('node_config') or {}}


# 11-14：Seedance 要求嗓音参考至少 2 秒（5–7 秒最稳）。D、G、I 那一句不够长 → 改用 A 段那一句（6.1 秒）当嗓音参考，嗓音也更一致。
VOICE_FROM = {'D': 'A', 'G': 'A', 'I': 'A'}


def build(look, files):
    nodes, edges = [], []
    def node(i, t, x, y, label, config, w=None, h=None):
        n = {'id': i, 'type': t, 'position': {'x': x, 'y': y}, 'data': {'label': label, 'config': config}}
        if w: n['width'] = w; n['height'] = h; n['style'] = {'width': w, 'height': h}
        nodes.append(n)
    def edge(src, sh, tgt, th): edges.append({'id': f'e_{src}_{tgt}_{th}', 'source': src, 'sourceHandle': sh, 'target': tgt, 'targetHandle': th, 'type': 'deletable'})
    def up(i, x, y, label, kind, f, fn): node(i, 'fileUpload', x, y, label, {**f['node_config'], 'fileType': kind, 'fileName': fn, 'fileUrl': f['file_url'], 'resultUrl': f['file_url']})
    node('note', 'stickyNote', 0, -620, '使用说明', {'text': NOTE}, 900, 520)
    up('look', -520, 0, '定妆图：年长的客人（全部段共用）', 'image', look, '定妆图.png')
    for k, (c, dur, say, mood) in enumerate(CLIPS):
        y = k * 560
        up(f'v_{c}', 0, y, f'{c} 段原片（动作参考）', 'video', files[c]['video'], f'{c} 段原片.mp4')
        up(f'a_{c}', 0, y + 300, f'{c} 段原声（太短，没有接；改用 A 段原声）' if c in VOICE_FROM else f'{c} 段原声（嗓音参考）', 'audio', files[c]['audio'], f'{c} 段原声.mp3')
        node(f't_{c}', 'textInput', 460, y, f'{c} 段 · 提示', {'text': prompt(dur, say, mood)})
        node(f's_{c}', 'aiVideo', 940, y, f'{c} 段换人（{dur} 秒）：{say}', {'model': 'seedance-2.5', 'generationType': 'text-to-video', 'qualityMode': 'hd', 'aspectRatio': '9:16',
             'resolution': '720p', 'duration': str(dur), 'refImageCount': 1, 'referenceAudioCount': 1, 'referenceVideoCount': 1, 'generateAudio': True, 'fixedLens': True,
             'multiShot': False, 'shotCount': 1, 'shotDurations': [dur], 'elements': [], 'status': 'idle'})
        edge(f't_{c}', None, f's_{c}', 'prompt'); edge('look', 'output', f's_{c}', 'ref-image-1')
        edge(f'v_{c}', 'output', f's_{c}', 'ref-video-1'); edge(f"a_{VOICE_FROM.get(c, c)}", 'output', f's_{c}', 'ref-audio-1')
    return nodes, edges


if __name__ == '__main__':
    if '--dry' in sys.argv:
        f = {'file_url': 'https://example.invalid/x', 'node_config': {}}
        n, e = build(f, {c[0]: {'video': f, 'audio': f} for c in CLIPS}); print(len(n), 'nodes', len(e), 'edges', '共', sum(c[1] for c in CLIPS), '秒'); sys.exit(0)
    prev = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    man = {m['clip']: m for m in json.load(open(os.path.join(SWAP, 'manifest.json')))}
    os.makedirs(os.path.join(SWAP, 'ref'), exist_ok=True)
    prev['look'] = prev.get('look') or upload(os.path.join(SWAP, 'look-v1.png'), '定妆图.png', 'image/png')
    prev.setdefault('files', {})
    for c, dur, say, mood in CLIPS:
        if c in prev['files']: continue
        m = man[c]; v = os.path.join(SWAP, 'ref', f'{c}_silent.mp4'); a = os.path.join(SWAP, 'ref', f'{c}_line.mp3')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(SWAP, f'{c}.mp4'), '-t', str(dur), '-an', '-c:v', 'copy', v], check=True)
        # 嗓音参考：只取他讲那一句（前后各留一点）；太短的（E 段）整段给
        st, en = (max(0, m['use_in'] - 0.1), m['use_out'] + 0.15) if m['use_out'] - m['use_in'] > 1.2 else (0, m['dur'])
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{st:.2f}', '-to', f'{en:.2f}', '-i', os.path.join(SWAP, f'{c}.mp4'), '-vn', '-c:a', 'libmp3lame', '-b:a', '160k', a], check=True)
        prev['files'][c] = {'video': upload(v, f'{c} 段原片.mp4', 'video/mp4'), 'audio': upload(a, f'{c} 段原声.mp3', 'audio/mpeg')}
        json.dump(prev, open(CACHE, 'w'), indent=1); print('uploaded', c)
    nodes, edges = build(prev['look'], prev['files'])
    wid = prev.get('workflow_id') if '--update' in sys.argv else None
    if wid:
        cur = call('get_workflow', workflow_id=wid); cur = cur.get('workflow', cur)
        old = {n['id']: n for n in cur['nodes']}
        for n in nodes:
            o = old.get(n['id']); oc = o['data']['config'] if o else {}
            if o and n['type'] == 'aiVideo' and oc.get('status') != 'failed' and (oc.get('resultUrl') or oc.get('historyId') or oc.get('status') == 'running'):
                n['data']['config'] = oc; n['position'] = o.get('position', n['position'])
    res = call('save_workflow', **({'workflow_id': wid} if wid else {}), name=NAME, nodes=nodes, edges=edges)
    print(json.dumps({k: v for k, v in res.items() if k in ('workflow_id', 'created', 'edit_url', 'node_count', 'edge_count', 'error', 'body')}, ensure_ascii=False))
    if 'workflow_id' in res:
        prev['workflow_id'] = res['workflow_id']; prev['edit_url'] = res.get('edit_url'); json.dump(prev, open(CACHE, 'w'), indent=1)
        v = call('validate_workflow', workflow_id=res['workflow_id'])
        print('ready_to_run', v.get('ready_to_run'), 'errors', v.get('validation', {}).get('errors'), 'warnings', v.get('validation', {}).get('warnings'))
