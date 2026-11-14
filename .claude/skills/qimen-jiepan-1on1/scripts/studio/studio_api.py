"""studio.aigoal 公开 API：call(action, **kw) → dict。钥匙读环境变量 AIGOAL_STUDIO_KEY 或 repo 根目录 .env（.env 不进 git，绝不印出来、不写进代码）"""
import json, os, urllib.request
URL = 'https://lqcgpujpfdnrxtpuvyfq.supabase.co/functions/v1/aigoal-api'
def _key():
    if os.environ.get('AIGOAL_STUDIO_KEY'): return os.environ['AIGOAL_STUDIO_KEY']
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env')
    for line in open(p):
        if line.startswith('AIGOAL_STUDIO_KEY='): return line.split('=', 1)[1].strip().strip('"').strip("'")
    raise SystemExit('AIGOAL_STUDIO_KEY missing')
def call(action, **kw):
    req = urllib.request.Request(URL, data=json.dumps({'action': action, **kw}).encode(), headers={'authorization': f'Bearer {_key()}', 'content-type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r: return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {'error': e.code, 'body': e.read().decode()[:2000]}
