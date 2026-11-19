#!/usr/bin/env python3
"""开工前向 studio.aigoal.ai 拿最新的大脑：提示词指南、词典单节、台词校对。只读，不花点数。

用法:
    python3 fetch_brain.py guide --model seedance-2.0-custom [--industry property] --out <输出文件夹>
    python3 fetch_brain.py dict --topic camera.10 --out <输出文件夹>      # 词典只拿要用的那一节
    python3 fetch_brain.py dict --out <输出文件夹>                         # 不给 topic = 只拿目录
    python3 fetch_brain.py lines <台词.txt> --out <输出文件夹>             # 每行一句台词，过 normalize_dialogue

钥匙: 环境变量 AIGOAL_STUDIO_KEY 或 AIGOAL_API_KEY，或 .env 文件。没有钥匙就用 references/studio-brain-snapshot.md。
输出存进 <输出文件夹>/大脑/，并在终端印出重点。
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_studio_canvas as b  # noqa: E402


def save(out, name, data):
    d = os.path.join(out, "大脑")
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, name)
    with open(p, "w", encoding="utf-8") as f:
        f.write(data if isinstance(data, str) else json.dumps(data, ensure_ascii=False, indent=1))
    return p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("what", choices=["guide", "dict", "lines"])
    ap.add_argument("file", nargs="?")
    ap.add_argument("--model", default="seedance-2.0-custom")
    ap.add_argument("--industry")
    ap.add_argument("--topic")
    ap.add_argument("--lang", default="zh")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = os.path.abspath(a.out)
    k = b.key(out)

    if a.what == "guide":
        kw = {"model": a.model}
        if a.industry:
            kw["industry"] = a.industry
        r = b.call(k, "get_prompt_guide", **kw)
        if "guide" not in r:
            sys.exit(f"拿不到指南: {r}")
        text = (f"# studio 提示词指南 {r.get('version')} · {r.get('model')}\n\n{r['guide']}\n\n"
                f"## 价钱\n{r.get('money_rules')}\n\n## 读音表\n"
                + json.dumps(r.get("pronunciation"), ensure_ascii=False, indent=1))
        p = save(out, f"指南-{a.model}.md", text)
        print(f"指南版本 {r.get('version')}，存在 {p}")
        print("跟 references/studio-brain-snapshot.md 的版本不一样时，以这份为准（skill 的实测规则除外）。")

    elif a.what == "dict":
        r = b.call(k, "get_dictionary", **({"topic": a.topic} if a.topic else {}))
        name = f"词典-{a.topic}.md" if a.topic else "词典-目录.json"
        p = save(out, name, r.get("content") or r.get("text") or r)
        print(f"存在 {p}")
        if not a.topic:
            for t in r.get("topics", []):
                print(f"  {t['id']}  {t['title']}  ({', '.join(s['id'] for s in t.get('sections', []))})")

    else:
        if not a.file:
            sys.exit("请给台词文件，每行一句")
        text = open(a.file, encoding="utf-8").read()
        r = b.call(k, "normalize_dialogue", text=text, lang=a.lang)
        if "error" in r:
            sys.exit(f"校对失败: {r}")
        p = save(out, "台词校对.json", r)
        print(f"存在 {p}")
        print(json.dumps({x: r[x] for x in r if x not in ("lang",)}, ensure_ascii=False, indent=1)[:3000])
        print("\n改过的台词直接用；suggestions 里的品牌名、地名写法要跟用户一起定。")


if __name__ == "__main__":
    main()
