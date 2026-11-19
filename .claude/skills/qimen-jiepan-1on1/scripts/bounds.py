"""量每段换人片里他讲话的起止秒（看音量），印出来抄进 qm1.tsx 的 GEN。先跑 gen_prep.sh 产生 /tmp/qm1gen/<段>.wav。
用法：uvx --offline --from mlx-whisper python bounds.py A B C …   （借 mlx-whisper 的环境只是为了有 numpy）"""
import wave, sys, json, numpy as np
out = {}
for c in sys.argv[1:]:
    w = wave.open(f'/tmp/qm1gen/{c}.wav'); a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)
    n = len(a) // 320; r = np.sqrt((a[:n * 320].reshape(n, 320) ** 2).mean(1))          # 每 0.02 秒一格的音量
    thr = max(np.percentile(r, 10) * 4, r.max() * 0.1); idx = np.where(r > thr)[0]
    out[c] = [round(idx[0] * 0.02, 2), round((idx[-1] + 1) * 0.02, 2), round(n * 0.02, 2)]  # [开始, 结束, 整段长度]
print(json.dumps(out))
