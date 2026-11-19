"""把要换人的客人镜头从 4K 原片切出来（1080×1920，带原声），给 studio 当参考影片。
秒数是老师那支的秒数；客人原片秒数 = 老师秒数 − 0.09。每段至少 5 秒（前面留 0.3 秒）。"""
import subprocess, os, json, math
SRC = os.path.expanduser('~/Downloads/IMG_8723.MOV'); OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'swap')
NEED = [  # 名字, 用到的起点, 终点, 他讲的话
 ('A', 1.04, 6.9, '我公司全部的账和钱，是给一个伙伴管的。'), ('B', 7.14, 11.15, '最近我发现他讲的，跟我看到的不一样。'),
 ('C', 13.64, 15.65, '我们合作了十几二十年。'), ('D', 16.96, 18.5, '这个人，我还能相信吗？'),
 ('E', 50.9, 51.75, '是。'), ('F', 83.86, 85.85, '也是最近转不过来，我才发现到的。'),
 ('G', 116.82, 118.5, '我至少三年的账都没去看。'), ('H', 145.40, 146.35, '他有真的要骗我吗？（开头钩 + 第 6 段，用两次）'),
 ('I', 159.7, 161.05, '他几时开始要骗我了？'), ('J', 284.94, 286.9, '那这个钱，吐不吐得出来？')]
man = []
for n, a, b, say in NEED:
    st = max(0, a - 0.09 - 0.3); dur = max(5, math.ceil(b - a + 0.6))
    f = f'{OUT}/{n}.mp4'
    subprocess.run(['nice', '-n', '19', 'ffmpeg', '-v', 'error', '-y', '-ss', f'{st:.3f}', '-i', SRC, '-t', str(dur), '-vf', 'scale=1080:1920', '-r', '30',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-map', '0:v:0', '-map', '0:a:0', '-threads', '2', f], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-frames:v', '1', '-q:v', '2', f'{OUT}/{n}.jpg'], check=True)
    man.append({'clip': n, 'file': f'{n}.mp4', 'src_start': round(st, 3), 'dur': dur, 'use_in': round(a - 0.09 - st, 2), 'use_out': round(b - 0.09 - st, 2), 'say': say})
    print(n, dur, 's')
json.dump(man, open(f'{OUT}/manifest.json', 'w'), ensure_ascii=False, indent=1)
print('total', sum(m['dur'] for m in man), 's')
