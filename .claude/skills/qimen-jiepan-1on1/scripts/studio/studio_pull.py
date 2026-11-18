"""把画布里跑好的结果拉下来（只读，不会按 Run）。
用法：python3 studio_pull.py <workflow_id> <存到哪个文件夹> [去掉节点名前几个字，默认 0]
换人画布的影片节点叫 s_A、s_B…  → 第三个参数给 2，存成 A.mp4、B.mp4。
钥匙：环境变量 AIGOAL_STUDIO_KEY 或 repo 根目录 .env（不要印出来）。"""
import os, subprocess, sys
from studio_api import call
wid, dst = sys.argv[1], sys.argv[2]; pre = int(sys.argv[3]) if len(sys.argv) > 3 else 0
os.makedirs(dst, exist_ok=True)
w = call('get_workflow', workflow_id=wid); w = w.get('workflow', w)
for n in w['nodes']:
    c = n['data']['config']
    if n['type'] not in ('aiVideo', 'aiImage', 'aiVideoEdit'): continue
    f = os.path.join(dst, n['id'][pre:] + ('.png' if n['type'] == 'aiImage' else '.mp4')); new = ''
    if c.get('resultUrl') and not os.path.exists(f):
        subprocess.run(['curl', '-sS', '-L', '-o', f, c['resultUrl']], check=True); new = 'got new'
    print(n['id'], c.get('status'), new, (c.get('error') or c.get('errorMessage') or '')[:80])
