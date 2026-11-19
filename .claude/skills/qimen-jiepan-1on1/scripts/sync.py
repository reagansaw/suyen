"""三支片对时间 + 找 iPad 哪几秒有动笔。在 qimen-1on1/ 里跑（要 numpy：uvx --offline --from mlx-whisper python sync.py）。
先把三支片的声音抽成 16k 单声道 wav 放 src/：
  ffmpeg -i 老师.MOV -vn -ac 1 -ar 16000 src/IMG_1787.wav   （客人 → src/IMG_8723.wav，iPad 录屏 → src/ipad.wav）
做法：拿三支的音量曲线互相比（cross-correlation），印出「老师秒数 = 那支秒数 + 多少」。这支片量到：客人 +0.09、iPad −2.61。
文件名和路径是这支片的，换片要改。"""
import wave,numpy as np,subprocess,os
def env(p):
    w=wave.open(p); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)
    a=np.abs(a); n=len(a)//160; return a[:n*160].reshape(n,160).mean(1)
A=env('src/IMG_1787.wav')
off={}
for name in ['IMG_8723','ipad']:
    B=env('src/'+name+'.wav')
    a=(A-A.mean())/A.std(); b=(B-B.mean())/B.std()
    n=1<<int(np.ceil(np.log2(len(a)+len(b))))
    c=np.fft.irfft(np.fft.rfft(a,n)*np.conj(np.fft.rfft(b,n)),n)
    k=c.argmax(); k=k-n if k>n//2 else k
    off[name]=k/100
    print(name,'t_1787 = t_%s + %.2f'%(name,k/100),'peak',round(c.max()/min(len(a),len(b)),2))
# red ink over time on ipad, 2fps, 167x240
W,H=166,240
p=subprocess.run(['ffmpeg','-v','error','-i',os.path.expanduser('~/Downloads/RPReplay_Final1794572709.MP4'),'-vf',f'fps=2,scale={W}:{H}','-pix_fmt','rgb24','-f','rawvideo','-threads','2','-'],capture_output=True).stdout
f=np.frombuffer(p,dtype=np.uint8).reshape(-1,H,W,3).astype(int)
red=((f[...,0]>170)&(f[...,1]<90)&(f[...,2]<110)).sum((1,2))
d=np.diff(red); act=np.abs(d)>3
# group active spans
spans=[];i=0
t=lambda i:i/2+off['ipad']
while i<len(act):
    if act[i]:
        j=i
        while j+1<len(act) and (act[j+1] or act[min(j+2,len(act)-1)] or act[min(j+3,len(act)-1)] or act[min(j+4,len(act)-1)]): j+=1
        spans.append((t(i),t(j+1),int(red[j+1]-red[i]))); i=j+1
    else: i+=1
print('ink spans (1787 time): start end delta_red')
for s in spans: print('%6.1f %6.1f %5d'%s)
print('ipad covers 1787 time %.1f to %.1f'%(off['ipad'],off['ipad']+len(f)/2))
