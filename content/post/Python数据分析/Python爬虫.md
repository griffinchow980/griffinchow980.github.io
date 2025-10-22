---
title: "Python爬虫基础"
date: 2023-11-28
categories: ["Python"]
tags: ["Python","爬虫"]
summary: "概述爬虫常用的 Python 基础：条件与循环、字符串与集合类型操作、文件与编码、函数与模块、正则、XPath 与 BeautifulSoup 解析。"
math: true
---

# 1 基础语法相关

## 1.1 `if` 条件判断
```python
if condition:
    # 分支1
else:
    # 分支2
```
作用：按布尔条件二选一（多条件可使用 `elif`）。典型爬虫场景：
- 清洗无效数据：`if '-' in row: continue`
- 页面结构不统一：先用提取器 A，若失败再回退到提取器 B。
```python
result = extractor1(page)
if result:
    save(result)
else:
    result = extractor2(page)
```

## 1.2 `while` 循环与真值
```python
while condition:
    # 循环体
```
只要 `condition` 为真就继续；常用于重试或轮询。Python 中“假值”：
`0`, `0.0`, `''`, `[]`, `{}`, `set()`, `tuple()`, `None`, `False`。  
可利用：
```python
data = extractor(page)
if data:
    process(data)
```

# 2 字符串操作（核心高频）

## 2.1 索引与切片
```python
s = "我爱黎明,黎明爱我"
print(s[0])        # 我
print(s[2:4])      # 黎明  (切片左闭右开)
```

## 2.2 `strip()`
去掉两端空白(`空格`/`\n`/`\r`/`\t`)：
```python
s = " \t 我的天哪 \n"
clean = s.strip()
```

## 2.3 `split()`
分割 -> 列表：
```python
s = "10,男人本色,100000万"
_id, name, money = s.split(",")
```

## 2.4 `replace()`
链式清洗：
```python
dirty = "我 \t 爱 \n 黎 明 "
clean = dirty.replace(" ", "").replace("\t", "").replace("\n", "")
```

## 2.5 `join()`
列表拼接为字符串：
```python
parts = ["我妈", "不喜欢", "黎明"]
s = "".join(parts)   # 我妈不喜欢黎明
```

## 2.6 f-string
```python
singer = "周杰伦"
msg = f"我喜欢{singer}"
tel = 10085
print(f"电话是{tel+1}")
```
花括号内可放任意可计算表达式。

# 3 列表

## 3.1 索引与切片
同字符串：
```python
lst = ["赵本山", "王大陆", "大嘴猴", "马后炮"]
print(lst[1])        # 王大陆
print(lst[2:])       # ['大嘴猴', '马后炮']
```

## 3.2 增
```python
lst.append(33)
```

## 3.3 删
```python
lst.remove("周润发")   # 不存在会抛 ValueError
```

## 3.4 改
```python
lst[1] = "周杰伦"
```

## 3.5 `range()`
```python
for i in range(5, 10):  # 5..9
    print(i)
```

## 3.6 查
```python
for item in lst:
    print(item)

for idx in range(len(lst)):
    print(idx, lst[idx])

for idx, val in enumerate(lst):
    print(idx, val)
```

# 4 字典

## 4.1 增 / 改
```python
d = {}
d["name"] = "樵夫"
d["age"] = 18
d["age"] = 19
```

## 4.2 删
```python
d.pop("age", None)
```

## 4.3 查
```python
v1 = d["name"]          # 键不存在抛 KeyError
v2 = d.get("missing")   # 返回 None
```

## 4.4 嵌套
```python
person = {
    "name": "王峰",
    "children": [
        {"name": "胡一菲", "age": 19},
        {"name": "胡二菲", "age": 18},
    ]
}
print(person["children"][1]["name"])
for c in person["children"]:
    print(c["name"], c["age"])
```

# 5 字符集与 `bytes`
```python
bs = "我的天哪abcdef".encode("utf-8")
s = bs.decode("utf-8")
```
`utf-8` 常用；中文多为 3 字节。`bytes` 面向机器：网络传输/磁盘/二进制媒体等。

# 6 文件操作

## 6.1 基本模式
`r` 读 | `w` 覆写 | `a` 追加 | `b` 二进制补充使用 (`rb`, `wb`, `ab`)  
文本文件需指定 `encoding="utf-8"`（不要与 `b` 同用）。

## 6.2 基本用法
```python
with open("text.txt", mode="r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip("\n"))
```

# 7 函数

## 7.1 定义与调用
```python
def get_page_source(url: str):
    print("获取页面源码", url)
    return "<html>...</html>"

html1 = get_page_source("https://example.com")
```

## 7.2 参数与返回
```python
def download_image(url: str, save_path: str):
    print(f"下载 {url} -> {save_path}")

download_image("http://a.com/a.jpg", "a.jpg")
```
优点：复用、分治、易测试。

# 8 模块

## 8.1 三类
- 内置模块（`os`, `sys`, `time`, `json`, `re`, `random` 等）
- 第三方模块（需 `pip install` 如 `requests`, `lxml`, `bs4`）
- 自定义模块（`.py` 文件 / 包）

## 8.2 导入语法
```python
import os
from urllib.parse import urljoin
from bs4 import BeautifulSoup
```

## 8.3 常用模块摘要
```python
import time
print(time.time())
time.sleep(1)

import os
os.path.exists("a.txt")
os.path.join("a", "b")
os.makedirs("data", exist_ok=True)
```

### 8.3.1 `json`
```python
import json
s = '{"name":"jay","age":18}'
d = json.loads(s)
s2 = json.dumps(d, ensure_ascii=False)
```

### 8.3.2 `random`
```python
import random
print(random.randint(1, 10))
```

### 8.3.3 异常处理与重试
```python
import time
for attempt in range(5):
    try:
        # 执行请求逻辑
        break
    except Exception as e:
        print("失败:", e)
        time.sleep(attempt * 2)
```

# 9 正则 (`re`)

## 9.1 常用元字符
| 模式 | 含义 |
|------|------|
| `.` | 除换行外任意字符 (`re.S` 时含换行) |
| `[]` | 字符集 单个字符 |
| `[^x]` | 非集合 |
| `\d` / `\D` | 数字 / 非数字 |
| `\w` / `\W` | 字母数字下划线 / 其余 |
| `\s` / `\S` | 空白 / 非空白 |
| `^` / `$` | 行首 / 行尾 |
| `*` | 前一个重复 ≥0 |
| `+` | ≥1 |
| `?` | 0 或 1（或量词非贪婪修饰） |
| `{n}` `{n,}` `{n,m}` | 次数限定 |
| `|` | 或 |
| `()` | 分组与捕获 |

## 9.2 贪婪 vs 非贪婪
- 贪婪：`.*` / `.+`
- 非贪婪：`.*?` / `.+?`

## 9.3 常用函数
```python
import re
m = re.search(r"a\d+", "xa123b")
if m:
    print(m.group())

mm = re.match(r"\d+", "123abc")  # 必须从开头
all_nums = re.findall(r"\d+", "a1b22c333")  # ['1','22','333']

for it in re.finditer(r"[a-z]", "aBcd1"):
    print(it.group())

parts = re.split(r"\d+", "ab12cd3ef")   # ['ab', 'cd', 'ef']
masked = re.sub(r"\d", "*", "a1b22c")   # a*b**c
```

## 9.4 分组与命名
```python
m = re.search(r"<b>(?P<val>.*?)</b>", "<b>加粗</b>")
print(m.group(0))        # 整体
print(m.group(1))        # 加粗
print(m.group("val"))    # 加粗
print(m.groups())        # ('加粗',)
```

## 9.5 预编译
```python
pat = re.compile(r"(0\d{2,3}-\d{7,8})")
print(pat.search("tel 010-88888888").group())
```

# 10 XPath 解析 (`lxml.etree`)

## 10.1 构建树
```python
from lxml import etree
parser = etree.HTMLParser(encoding="utf-8")
tree = etree.parse("douban.html", parser=parser)

# 或
html = open("douban.html", "r", encoding="utf-8").read()
tree = etree.HTML(html)
```

## 10.2 基础语法
| 示例 | 说明 |
|------|------|
| `/html/body/div` | 绝对路径 |
| `//a` | 全文所有 `a` |
| `//ul[@class="list"]/li` | 条件筛选 |
| `//li[1]` / `//li[last()]` | 位置 |
| `.//a` | 当前节点下递归搜索 |
| `@href` | 属性值 |
| `//div[@id='nav' or @class='nav']` | 逻辑 |
| `|` | 并集：`//div | //span` |

## 10.3 示例
```python
titles = tree.xpath('//ul[@class="cover-col-4 clearfix"]/li/div/h2/a/text()')
first  = tree.xpath('//ul[@class="cover-col-4 clearfix"]/li[1]/div/h2/a/text()')[0]
img_srcs = tree.xpath('//ul//a/img/@src')
```

# 11 BeautifulSoup 解析 (`bs4`)

## 11.1 构建对象
```python
from bs4 import BeautifulSoup
html = open("douban.html", "r", encoding="utf-8").read()
soup = BeautifulSoup(html, "lxml")
```

## 11.2 基本访问
```python
soup.title       # <title>...</title>
soup.title.text
soup.find("a", class_="cover")
soup.find_all("img")
```

## 11.3 属性
```python
div = soup.find("div", id="db-global-nav")
print(div["id"], div.get("class"))
```

## 11.4 组合
```python
cover = soup.find("a", class_="cover")
img = cover.img
src = img["src"]
```

## 11.5 文本获取差异
| 接口 | 特性 |
|------|------|
| `.string` | 仅当标签仅包含一个文本节点时返回，否则 `None` |
| `.text` / `.get_text()` | 所有子孙文本含空白 |
| `.stripped_strings` | 迭代去空白文本 |

## 11.6 批量与选择器
```python
soup.find_all("div", limit=2)
soup.select("ul.cover-col-4.clearfix > li img")
soup.select("#db-global-nav")
```

## 11.7 输出/持久化
```python
with open("img.html", "w", encoding="utf-8") as f:
    f.write(str(soup.find("a", class_="cover").img))
```
