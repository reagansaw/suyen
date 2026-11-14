"""找 iPad 录屏哪几秒画面有变（= 她在写 / 画），印出老师秒数的起止。2.61 是这支片 iPad 的时间差，换片要改。
跑法：uvx --offline --from mlx-whisper python ink.py"""
import numpy as np,subprocess,os
W,H=400,576
p=subprocess.run(['ffmpeg','-v','error','-i',os.path.expanduser('~/Downloads/RPReplay_Final1794572709.MP4'),'-vf',f'fps=2,scale={W}:{H}','-pix_fmt','rgb24','-f','rawvideo','-threads','2','-'],capture_output=True).stdout
f=np.frombuffer(p,dtype=np.uint8).reshape(-1,H,W,3)
ch=[(np.abs(f[i+1].astype(int)-f[i].astype(int)).sum(2)>60).sum() for i in range(len(f)-1)]
ch=np.array(ch); act=ch>25
out=[];i=0
while i<len(act):
    if act[i]:
        j=i
        while j+1<len(act) and act[j+1:j+7].any(): j+=1
        out.append((i/2-2.61,(j+1)/2-2.61,int(ch[i:j+1].sum()))); i=j+1
    else: i+=1
for s in out: print('%6.1f-%6.1f  %6d'%s)
