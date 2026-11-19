"""把一支 16:9 横版影片做成 1080×1080 的「上下 banner 夹影片」版（格式见 docs/1比1-上下banner.md）。
用法（repo 根目录）：python3 pipeline/square_banner.py <横版.mp4> <输出.mp4> <金色胶囊> <金色大字> <红色胶囊> [--master]
      11-09 新 banner：python3 pipeline/square_banner.py <横版或旧 1:1.mp4> <输出.mp4> --orig
      python3 pipeline/square_banner.py <输入> <输出> <金色胶囊> <金色大字> <红色胶囊> --v2   ← 每支自己的字 + 新下 banner
      （--orig：上 banner 用 banner_top_v2 原本的三行字、下 banner 用 banner_bottom_v2；输入是旧 1:1 就直接取中间影片）
- 上 banner：remotion/src/TopBanner.tsx（底图 public/suyenc/banner_top.webp）换成这三行字
- 下 banner：public/suyenc/banner_bottom.webp，原图不改
- --master：输入是 Remotion 刚渲出来、还没调音量的片，顺便做 loudnorm + 限幅；已经是成片就不加（声音直接 copy）"""
import json, os, subprocess, sys, tempfile
args = [a for a in sys.argv[1:] if a not in ('--master', '--orig', '--v2')]
master, orig = '--master' in sys.argv, '--orig' in sys.argv
v2 = orig or '--v2' in sys.argv   # --v2：每支自己的三行字，但用新下 banner + 字缩 0.8 留空隙
src, out = [os.path.abspath(a) for a in args[:2]]
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
tb = os.path.join(tempfile.mkdtemp(), 'top.png')
if orig:
    subprocess.run(['npx', 'remotion', 'still', 'src/index.ts', 'TopBannerOrig', tb, '--log=error'], check=True, cwd=f'{R}/remotion')
else:
    pill, main, sub = args[2:5]
    subprocess.run(['npx', 'remotion', 'still', 'src/index.ts', 'TopBanner', tb, '--log=error',
                    '--props=' + json.dumps({'pill': pill, 'main': main, 'sub': sub, 'v2': v2}, ensure_ascii=False)], check=True, cwd=f'{R}/remotion')
bottom = f'{R}/remotion/public/suyenc/banner_bottom{"_v2" if v2 else ""}.webp'
wh = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src], capture_output=True, text=True, check=True).stdout.strip()
mid = 'crop=1080:608:0:196,' if wh == '1080,1080' else 'scale=1080:608,'   # 旧 1:1：中间那块就是原片，不重缩
dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True, check=True).stdout.strip()
# 上 196 + 影片 608（不裁）+ 下 276 = 1080；两张 banner 只裁上下，各压扁约 5% / 3.5%
fc = ('[1]crop=2000:386:0:84,scale=1080:196,setsar=1,format=yuv420p[t];'
      '[2]crop=2000:530:0:0,scale=1080:276,setsar=1,format=yuv420p[b];'
      f'[0:v]{mid}setsar=1,format=yuv420p[v];[t][v][b]vstack=inputs=3[o]')
audio = ['-c:a', 'copy']
if master:
    fc += ';[0:a]loudnorm=I=-15:TP=-2:LRA=11,aresample=192000,alimiter=limit=0.79:attack=3:release=60:level=false,aresample=48000[a]'
    audio = ['-c:a', 'aac', '-b:a', '256k']
subprocess.run(['nice', '-n', '10', 'ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-loop', '1', '-i', tb,
                '-loop', '1', '-i', bottom, '-filter_complex', fc,
                '-map', '[o]', '-map', '[a]' if master else '0:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
                '-maxrate', '6M', '-bufsize', '12M', '-r', '30', *audio, '-movflags', '+faststart', '-t', dur, out], check=True)
print('done', out, dur)
