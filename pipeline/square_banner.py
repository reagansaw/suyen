"""把一支 16:9 横版影片做成 1080×1080 的「上下 banner 夹影片」版（格式见 docs/1比1-上下banner.md）。
用法（repo 根目录）：python3 pipeline/square_banner.py <横版.mp4> <输出.mp4> <金色胶囊> <金色大字> <红色胶囊> [--master]
- 上 banner：remotion/src/TopBanner.tsx（底图 public/suyenc/banner_top.webp）换成这三行字
- 下 banner：public/suyenc/banner_bottom.webp，原图不改
- --master：输入是 Remotion 刚渲出来、还没调音量的片，顺便做 loudnorm + 限幅；已经是成片就不加（声音直接 copy）"""
import json, os, subprocess, sys, tempfile
args = [a for a in sys.argv[1:] if a != '--master']
master = '--master' in sys.argv
src, out, pill, main, sub = [os.path.abspath(a) for a in args[:2]] + args[2:5]
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
tb = os.path.join(tempfile.mkdtemp(), 'top.png')
subprocess.run(['npx', 'remotion', 'still', 'src/index.ts', 'TopBanner', tb, '--log=error',
                '--props=' + json.dumps({'pill': pill, 'main': main, 'sub': sub}, ensure_ascii=False)], check=True, cwd=f'{R}/remotion')
dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True, check=True).stdout.strip()
# 上 196 + 影片 608（不裁）+ 下 276 = 1080；两张 banner 只裁上下，各压扁约 5% / 3.5%
fc = ('[1]crop=2000:386:0:84,scale=1080:196,setsar=1,format=yuv420p[t];'
      '[2]crop=2000:530:0:0,scale=1080:276,setsar=1,format=yuv420p[b];'
      '[0:v]scale=1080:608,setsar=1,format=yuv420p[v];[t][v][b]vstack=inputs=3[o]')
audio = ['-c:a', 'copy']
if master:
    fc += ';[0:a]loudnorm=I=-15:TP=-2:LRA=11,aresample=192000,alimiter=limit=0.79:attack=3:release=60:level=false,aresample=48000[a]'
    audio = ['-c:a', 'aac', '-b:a', '256k']
subprocess.run(['nice', '-n', '10', 'ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', src, '-loop', '1', '-i', tb,
                '-loop', '1', '-i', f'{R}/remotion/public/suyenc/banner_bottom.webp', '-filter_complex', fc,
                '-map', '[o]', '-map', '[a]' if master else '0:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
                '-maxrate', '6M', '-bufsize', '12M', '-r', '30', *audio, '-movflags', '+faststart', '-t', dur, out], check=True)
print('done', out, dur)
