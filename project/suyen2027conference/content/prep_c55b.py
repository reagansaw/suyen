#!/usr/bin/env python3
# 内容①（C0055）v6：同 v1 的段落，但段内停顿删掉 + 1.15 倍（Reagan 10-31：讲话有点慢、字跟字中间拖）
import re, ast
from cutlib import build
src = open(__file__.replace('prep_c55b.py', 'prep_c55.py')).read()
PIECES = ast.literal_eval(re.search(r'PIECES = (\[.*?\n\])', src, re.S).group(1))
build('C0055', PIECES, 'c55', speed=1.15)
