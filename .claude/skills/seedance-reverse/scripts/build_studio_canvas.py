#!/usr/bin/env python3
"""把「反推结果.md」搭成 studio.aigoal.ai 的画布：素材图 + 每一段一个 Seedance 2.0 节点，线都接好。

只搭画布，不按 Run（Run 会花点数，由用户自己按）。只用 Python 标准库。

用法:
    python3 build_studio_canvas.py <反推结果.md>            看会搭出什么 (不连网)
    python3 build_studio_canvas.py <反推结果.md> --build    真的上传素材、建画布
    python3 build_studio_canvas.py <反推结果.md> --build --update   改同一张画布 (已跑出的结果保留)

钥匙: 环境变量 AIGOAL_STUDIO_KEY, 或 .md 同一个文件夹里的 .env 文件写一行
    AIGOAL_STUDIO_KEY=你的钥匙
钥匙在 studio.aigoal.ai 的设定里拿。不要把钥匙贴进对话、不要写进 .md。

它从 .md 里读:
    「## 四、素材清单」表格  — 每一行一个图 (图A、图B…) 或声音 (声A…)；「有了吗」那格写着 `素材/xxx.jpg` 就上传那个档
    「- **图B**：「…」」      — 没有档的图，用这段文字生成 (GPT Image 2)
    「- **图D**（输入：图L）：「…」」 — 拿别的图当输入来生成 (图生图)，提示里用 @image1、@image2 照输入的顺序叫它们
    「### 第 N 段 · … · 生成 N 秒 · …」+「接图：@image1 = 图A…」+「接声音：@audio1 = 声A」(可选) + 下面第一个代码块  — 每一段的影片节点
"""
import json
import mimetypes
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

API = "https://lqcgpujpfdnrxtpuvyfq.supabase.co/functions/v1/aigoal-api"
VIDEO_MODEL = "seedance-2.0-custom"
IMAGE_MODEL = "gpt-image-2"
# 重搭时保留已跑出的结果；其余设定（提示、模式、接口数）用新的
RESULT_FIELDS = ("status", "resultUrl", "resultUrls", "selectedResultIndex", "historyId", "runHistory", "resultText")


# ---------- 读 .md ----------

def parse(md_path):
    text = open(md_path, encoding="utf-8").read()
    base = os.path.dirname(os.path.abspath(md_path))
    title = re.search(r"^#\s+(.+)$", text, re.M)
    ratio = re.search(r"\b(9:16|16:9|1:1|3:4|4:3|21:9)\b", text)

    assets = {}
    sec = re.search(r"^##\s*四[、.].*?$(.*?)^##\s", text, re.M | re.S)
    if sec:
        for row in sec.group(1).splitlines():
            cells = [c.strip() for c in row.strip().strip("|").split("|")]
            if len(cells) < 3 or not re.match(r"^(图[A-Z]|声[A-Z]|后制)$", cells[0]):
                continue
            key, what, have = cells[0], cells[1], cells[2]
            f = re.search(r"`([^`]+\.(?:jpg|jpeg|png|webp|mp3|wav|m4a))`", have, re.I)
            path = os.path.join(base, f.group(1)) if f else None
            if key == "后制":
                key = "后制" + str(sum(k.startswith("后制") for k in assets) + 1)
            assets[key] = {"what": what, "file": path, "prompt": None, "inputs": []}
    for key, inputs, prompt in re.findall(r"^-\s*\*\*(图[A-Z])\*\*\s*(?:[（(]\s*输入[：:]\s*([^）)]*)[）)])?\s*[：:]\s*「(.+?)」\s*$", text, re.M):
        a = assets.setdefault(key, {"what": key, "file": None, "prompt": None})
        a["prompt"] = prompt
        a["inputs"] = re.findall(r"图[A-Z]", inputs or "")

    segs = []
    for m in re.finditer(r"^###\s*(第\s*(\d+)\s*段[^\n]*)$", text, re.M):
        head, n = m.group(1).strip(), int(m.group(2))
        body = text[m.end():]
        nxt = re.search(r"^#{2,3}\s", body, re.M)
        body = body[: nxt.start()] if nxt else body
        dur = re.search(r"生成\s*(\d+)\s*秒", head)
        code = re.search(r"```[^\n]*\n(.*?)```", body, re.S)
        refs = re.findall(r"@image(\d+)\s*=\s*(图[A-Z])", body.split("```")[0])
        arefs = re.findall(r"@audio(\d+)\s*=\s*(声[A-Z])", body.split("```")[0])
        first_frame = "首帧模式" in head
        segs.append({
            "n": n, "head": head,
            "duration": int(dur.group(1)) if dur else 10,
            "prompt": code.group(1).strip() if code else "",
            "refs": [(int(i), k) for i, k in refs],
            "arefs": [(int(i), k) for i, k in arefs],
            "first_frame": first_frame,
        })
    return {
        "title": title.group(1).strip() if title else os.path.basename(md_path),
        "ratio": ratio.group(1) if ratio else "9:16",
        "assets": assets, "segments": segs, "base": base,
    }


def check(plan):
    problems = []
    for s in plan["segments"]:
        if not s["prompt"]:
            problems.append(f"第 {s['n']} 段没有找到提示词代码块")
        if len(s["prompt"]) > 1900:
            problems.append(f"第 {s['n']} 段提示词 {len(s['prompt'])} 个字符，超过 1900（上限约 2000），请删短")
        if not 4 <= s["duration"] <= 15:
            problems.append(f"第 {s['n']} 段 {s['duration']} 秒，Seedance 2.0 只能 4–15 秒")
        nums = sorted(i for i, _ in s["refs"])
        if nums != list(range(1, len(nums) + 1)):
            problems.append(f"第 {s['n']} 段的 @image 编号没有从 1 连着排: {nums}")
        used = set(int(x) for x in re.findall(r"@image(\d+)", s["prompt"]))
        if used - set(nums):
            problems.append(f"第 {s['n']} 段提示词用到 @image{sorted(used - set(nums))}，但「接图」里没写")
        anums = sorted(i for i, _ in s["arefs"])
        if anums != list(range(1, len(anums) + 1)):
            problems.append(f"第 {s['n']} 段的 @audio 编号没有从 1 连着排: {anums}")
        aused = set(int(x) for x in re.findall(r"@audio(\d+)", s["prompt"]))
        if aused - set(anums):
            problems.append(f"第 {s['n']} 段提示词用到 @audio{sorted(aused - set(anums))}，但「接声音」里没写")
        for _, k in s["refs"] + s["arefs"]:
            a = plan["assets"].get(k)
            if not a:
                problems.append(f"第 {s['n']} 段要接 {k}，素材清单里没有")
            elif a["file"] and not os.path.isfile(a["file"]):
                problems.append(f"{k} 的档案不存在: {a['file']}")
    for k, a in plan["assets"].items():
        for src in a.get("inputs") or []:
            if src not in plan["assets"]:
                problems.append(f"{k} 要用 {src} 当输入，素材清单里没有")
            elif src == k:
                problems.append(f"{k} 不能拿自己当输入")
    return list(dict.fromkeys(problems))


# ---------- studio API ----------

KEY_NAMES = ("AIGOAL_STUDIO_KEY", "AIGOAL_API_KEY")


def key(base):
    for n in KEY_NAMES:
        if os.environ.get(n):
            return os.environ[n].strip()
    for d in (base, os.getcwd()):
        p = os.path.join(d, ".env")
        if os.path.isfile(p):
            for line in open(p, encoding="utf-8"):
                for n in KEY_NAMES:
                    if line.startswith(n + "="):
                        return line.split("=", 1)[1].strip().strip("\"'")
    sys.exit("找不到钥匙。请设环境变量 AIGOAL_STUDIO_KEY（或 AIGOAL_API_KEY），或在 .md 同一个文件夹建 .env 写一行 AIGOAL_STUDIO_KEY=你的钥匙")


def call(k, action, **kw):
    req = urllib.request.Request(API, data=json.dumps({"action": action, **kw}).encode(),
                                 headers={"authorization": f"Bearer {k}", "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"error": e.code, "body": e.read().decode()[:1000]}


def upload(k, path):
    ctype = mimetypes.guess_type(path)[0] or "application/octet-stream"
    name = os.path.basename(path)
    up = call(k, "create_upload", filename=name, size_bytes=os.path.getsize(path), content_type=ctype)
    if not up.get("upload_url"):
        sys.exit(f"上传 {name} 失败: {up}")
    r = subprocess.run(["curl", "-sS", "--fail", "--retry", "3", "-X", "PUT", up["upload_url"],
                        "-H", f"Content-Type: {ctype}", "--data-binary", "@" + path],
                       capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"上传 {name} 失败: {r.stderr.strip()}")
    fin = call(k, "finish_upload", path=up["path"], file_name=name)
    if not fin.get("file_url"):
        sys.exit(f"上传 {name} 失败: {fin}")
    return {"file_url": fin["file_url"], "node_config": fin.get("node_config") or {}}


# ---------- 搭画布 ----------

NOTE = """{title}

这张画布是从「反推结果.md」自动搭的。只搭好了，还没跑。

怎么跑（每个都由你自己按 Run，会花点数）：
① 先跑左边还没有图的素材（GPT Image 2）。不满意就改提示再跑，满意了再往下。
② 再跑每一段影片（Seedance 2.0）。建议先跑第 1 段，看人物、声音对不对，再跑其余几段。
③ 全部出片后，照 .md 里的「后制清单」剪：字幕、logo、转场、配乐都在后制加。

每一段的提示词在影片左边的文字格里，可以直接改。
"""


def build(plan, uploaded):
    nodes, edges, out_handle = [], [], {}

    def node(i, t, x, y, label, config, w=None, h=None):
        n = {"id": i, "type": t, "position": {"x": x, "y": y}, "data": {"label": label, "config": config}}
        if w:
            n["width"], n["height"], n["style"] = w, h, {"width": w, "height": h}
        nodes.append(n)
        out_handle[i] = {"fileUpload": "output", "aiImage": "result"}.get(t)

    def edge(src, tgt, th):
        edges.append({"id": f"e_{src}_{tgt}_{th}", "source": src, "sourceHandle": out_handle.get(src),
                      "target": tgt, "targetHandle": th, "type": "deletable"})

    node("note", "stickyNote", 0, -520, "使用说明", {"text": NOTE.format(title=plan["title"])}, 900, 420)

    asset_node, y, image_inputs = {}, 0, []
    for k, a in plan["assets"].items():
        nid = "asset_" + re.sub(r"\W", "", k.encode("unicode_escape").decode())
        label = f"{k} · {a['what']}"[:60]
        if a["file"]:
            f = uploaded[a["file"]]
            ftype = "audio" if a["file"].lower().endswith((".mp3", ".wav", ".m4a")) else "image"
            node(nid, "fileUpload", 0, y, label, {**f["node_config"], "fileType": ftype,
                 "fileName": os.path.basename(a["file"]), "fileUrl": f["file_url"], "resultUrl": f["file_url"]})
        elif a["prompt"]:
            ins = a.get("inputs") or []
            node(nid + "_txt", "textInput", 0, y, f"{k} · 生成提示", {"text": a["prompt"]})
            node(nid, "aiImage", 440, y, label, {"model": IMAGE_MODEL, "gptImage2Mode": "i2i" if ins else "t2i",
                 "imageInputCount": len(ins), "aspectRatio": plan["ratio"], "resolution": "2K",
                 "gptImage2Quality": "high", "status": "idle"})
            edge(nid + "_txt", nid, "prompt")
            image_inputs.append((nid, ins))
        else:
            node(nid, "fileUpload", 0, y, f"{label}（请把图拖进来）",
                 {"fileType": "image", "fileUrl": None, "resultUrl": None, "fileName": None})
        asset_node[k] = nid
        y += 520

    for nid, ins in image_inputs:
        for j, src in enumerate(ins):
            if src in asset_node:
                edge(asset_node[src], nid, f"image-{j}")

    for i, s in enumerate(plan["segments"]):
        vy = i * 640
        tid, vid = f"seg{s['n']}_txt", f"seg{s['n']}_vid"
        node(tid, "textInput", 1100, vy, f"第 {s['n']} 段 · 提示词", {"text": s["prompt"]})
        refs = sorted(s["refs"])
        node(vid, "aiVideo", 1560, vy, s["head"][:80], {
            "model": VIDEO_MODEL, "generationType": "image-to-video" if s["first_frame"] else "text-to-video",
            "aspectRatio": plan["ratio"], "resolution": "720p", "duration": str(s["duration"]),
            "fixedLens": False, "generateAudio": True, "qualityMode": "fast", "multiShot": False,
            "shotCount": 1, "shotDurations": [s["duration"]],
            "refImageCount": 0 if s["first_frame"] else len(refs),
            "referenceVideoCount": 0, "referenceAudioCount": len(s["arefs"]), "elements": [],
            "status": "idle", "resultUrl": None, "resultUrls": [], "selectedResultIndex": 0, "historyId": None,
        })
        edge(tid, vid, "prompt")
        for n, k in refs:
            if k in asset_node:
                edge(asset_node[k], vid, "first-frame" if s["first_frame"] and n == 1 else f"ref-image-{n}")
        for n, k in sorted(s["arefs"]):
            if k in asset_node:
                edge(asset_node[k], vid, f"ref-audio-{n}")
    return nodes, edges


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    md = os.path.abspath(os.path.expanduser(args[0]))
    plan = parse(md)

    print(f"《{plan['title']}》 · {plan['ratio']}")
    for k, a in plan["assets"].items():
        how = "上传 " + os.path.relpath(a["file"], plan["base"]) if a["file"] else (("GPT Image 2 生成" + (f"（输入 {'、'.join(a['inputs'])}）" if a.get("inputs") else "")) if a["prompt"] else "空格子，等你拖图")
        print(f"  {k}: {a['what'][:30]}  → {how}")
    for s in plan["segments"]:
        refs = "，".join([f"@image{i}={k}" for i, k in sorted(s["refs"])] + [f"@audio{i}={k}" for i, k in sorted(s["arefs"])]) or "不接图"
        print(f"  第 {s['n']} 段: {s['duration']} 秒 · {refs} · 提示词 {len(s['prompt'])} 字")
    problems = check(plan)
    if problems:
        print("\n有问题，先改 .md 再搭：")
        for p in problems:
            print("  - " + p)
        sys.exit(1)
    if "--build" not in sys.argv:
        print("\n看起来没问题。加 --build 才会真的上传、建画布。")
        return

    k = key(plan["base"])
    cache_path = os.path.join(plan["base"], ".studio_canvas.json")
    cache = json.load(open(cache_path)) if os.path.isfile(cache_path) else {}
    cache.setdefault("uploads", {})
    uploaded = {}
    for a in plan["assets"].values():
        if a["file"]:
            stamp = f"{a['file']}|{os.path.getsize(a['file'])}|{int(os.path.getmtime(a['file']))}"
            if stamp not in cache["uploads"]:
                print(f"上传 {os.path.basename(a['file'])} …")
                cache["uploads"][stamp] = upload(k, a["file"])
                json.dump(cache, open(cache_path, "w"), ensure_ascii=False, indent=1)
            uploaded[a["file"]] = cache["uploads"][stamp]

    nodes, edges = build(plan, uploaded)
    wid = cache.get("workflow_id") if "--update" in sys.argv else None
    if wid:
        cur = call(k, "get_workflow", workflow_id=wid)
        cur = cur.get("workflow", cur)
        old = {n["id"]: n for n in cur.get("nodes", [])}
        for n in nodes:
            o = old.get(n["id"])
            oc = o["data"]["config"] if o else {}
            if o and (oc.get("resultUrl") or oc.get("historyId") or oc.get("status") == "running"):
                keep = {f: oc[f] for f in RESULT_FIELDS if f in oc}
                n["data"]["config"] = {**n["data"]["config"], **keep}
                n["position"] = o.get("position", n["position"])
    res = call(k, "save_workflow", **({"workflow_id": wid} if wid else {}),
               name=plan["title"], nodes=nodes, edges=edges)
    if "workflow_id" not in res:
        sys.exit(f"建画布失败: {res}")
    cache["workflow_id"], cache["edit_url"] = res["workflow_id"], res.get("edit_url")
    json.dump(cache, open(cache_path, "w"), ensure_ascii=False, indent=1)
    v = call(k, "validate_workflow", workflow_id=res["workflow_id"])
    val = v.get("validation", {})
    print(f"\n画布{'已更新' if wid else '已建好'}：{res.get('edit_url')}")
    print(f"{res.get('node_count')} 个节点，{res.get('edge_count')} 条线。可以跑了吗：{v.get('ready_to_run')}")
    for e in val.get("errors") or []:
        print("  错误: " + json.dumps(e, ensure_ascii=False))
    for w in val.get("warnings") or []:
        print("  提醒: " + json.dumps(w, ensure_ascii=False))
    print("没有按 Run。请到画布上自己按。")


if __name__ == "__main__":
    main()
