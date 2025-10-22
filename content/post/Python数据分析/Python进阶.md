---
title: "Python进阶"
date: 2023-07-25
categories: ["Python"]
tags: ["Python"]
summary: "汇总 Python 编码、文件读写、函数参数与装饰器、迭代与生成器、模块包结构及反射的核心要点。"
math: true
---

# 1 编码相关

## 1.1 指定默认的读文件的解码格式保证不乱码
```python
# -*- coding: utf-8 -*-
# 说明:
# 1. 顶部编码声明用于在 Python2 或特殊场景下明确源文件编码；Python3 默认 UTF-8，可省略。
# 2. 若读取文本文件需匹配其真实保存编码，否则会出现解码错误。

# Python3 的 str 内部使用 Unicode，不会因为源代码中出现汉字而乱码。
# 在 Python2 中可使用 u 前缀显式标记 Unicode 字面量：
x = u"艾尼你好"
```
注：Python3 默认使用 UTF-8 解码源文件；Python2 默认为 ASCII（无编码声明时）。

# 2 读写文件

## 2.1 控制文件读写内容的模式：t 和 b
```python
# open() 基本形式:
# open(path, mode='r', encoding=None, errors=None)

# 文本(t)模式: 读写单位为 str (Unicode)，可指定 encoding (仅文本文件)
with open(r"C:\a\b\c\aini.txt", mode="rt", encoding="utf-8") as f:
    content = f.read()

# 二进制(b)模式: 读写单位为 bytes，不做编码/解码
with open("image.jpg", "rb") as f:
    data = f.read()
```
路径注意：在 Windows 下可用原始字符串 `r'...'` 或使用正斜杠 `C:/a/b/c/aini.txt`。

## 2.2 文件操作的模式
```
r   读(文本)      文件不存在报错
w   写(文本)      文件存在清空，不存在创建
a   追加(文本)    文件不存在创建，指针在末尾
r+  读写          文件必须存在，写不清空
w+  读写          先清空再读写
a+  读写追加       追加后可读
rb / wb / ab / r+b 等在二进制模式下对应上述行为
```
```python
with open("./aini.txt", mode="rt", encoding="utf-8") as f:
    first_four_chars = f.read(4)   # 在文本模式 read(n) 的 n 是“字符”个数
    pos = f.tell()                 # 获取当前位置
    f.seek(0, 0)                   # 回到文件开头
```
`seek(offset, whence)`：`whence`=`0` 开头、`1` 当前位置、`2` 末尾；偏移在文本模式可能受换行转换影响，精确随机访问推荐二进制模式。

# 3 函数参数详解

## 3.1 位置参数、关键字参数、混合使用
```python
def func(x, y):
    print(x, y)

func(1, 2)          # 位置实参
func(y=2, x=1)      # 关键字实参 (顺序可变)
func(1, y=2)        # 合法
# func(y=2, 1)      # 非法: 位置参数不能跟在关键字参数后
```
禁止为同一形参重复传值：
```python
# func(1, y=2, x=3)    # 非法: x 传值重复
# func(1, 2, x=3)      # 非法: x 传值重复
```

## 3.2 默认参数与混用
```python
def func(x, y=3):
    print(x, y)

func(1)            # 使用默认 y=3
func(1, y=99)      # 覆盖默认
```
规则与注意：
1. 非默认形参必须在默认形参左侧：
```python
# def bad(y=2, x): pass   # 语法错误
```
2. 默认值在定义阶段绑定其对象引用：
```python
m = 2
def f(x, y=m):
    print(x, y)
m = 999999999
f(1)               # 输出 1 2
```
3. 避免使用可变对象作为默认值：
```python
def bad(x, cache=[]):
    cache.append(x)
    return cache

def good(x, cache=None):
    if cache is None:
        cache = []
    cache.append(x)
    return cache
```

## 3.3 可变长度参数 (`*` 与 `**`)
### 3.3.1 收集溢出的“位置实参” `*args`
```python
def func(x, y, *args):
    print(x, y, args)

func(1, 2, 3, 4, 5)   # args = (3,4,5)
```
### 3.3.2 位置实参打散
```python
def func(x, y, z):
    print(x, y, z)

func(*[11, 22, 33])   # 等价 func(11,22,33)
```
### 3.3.3 收集关键字实参 `**kwargs`
```python
def func(x, y, **kwargs):
    print(x, y, kwargs)

func(1, y=2, a=10, b=20)  # kwargs = {'a':10,'b':20}
```
### 3.3.4 关键字打散
```python
def func(x, y, z):
    print(x, y, z)

mapping = {'x': 1, 'y': 2, 'z': 3}
func(**mapping)          # func(x=1,y=2,z=3)
```
### 3.3.5 混合顺序
`*args` 必须在 `**kwargs` 之前：
```python
def wrapper(*args, **kwargs):
    target(*args, **kwargs)
```

## 3.4 函数的类型提示
```python
def register(name: str, age: int, hobbies: tuple) -> int:
    print(name, age, hobbies)
    return age

def register_default(name: str = "aini",
                     age: int = 18,
                     hobbies: tuple | None = None) -> int:
    if hobbies is None:
        hobbies = ()
    return age
```
类型提示不强制运行期校验，仅辅助静态分析与可读性。

# 4 装饰器

## 4.1 演进示例 (添加耗时统计)
```python
import time

def index(name, age):
    time.sleep(1)
    print(f"我叫{name},今年{age}岁")

def wrapper():
    start = time.time()
    index("aini", 18)
    end = time.time()
    print(end - start)

wrapper()
```

## 4.2 通用包装 (保持调用方式)
```python
def index(name, age):
    print(f"我叫{name},今年{age}岁")

def outer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        res = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__}耗时 {end - start:.3f}s")
        return res
    return wrapper

index = outer(index)
index("aini", 22)
```

## 4.3 语法糖与返回值保留
```python
import time
from functools import wraps

def timing(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        res = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__}耗时 {end - start:.3f}s")
        return res
    return wrapper

@timing
def index(name, age):
    """我是 index"""
    time.sleep(1)
    return [name, age]

result = index("aini", 22)
```

## 4.4 有参装饰器
### 4.4.1 不用语法糖
```python
def auth(func, db_type):
    def wrapper(*args, **kwargs):
        user = input("your name: ").strip()
        pwd = input("your password: ").strip()
        if db_type == "file":
            if user == "aini" and pwd == "aini123":
                print("login success")
                return func(*args, **kwargs)
            else:
                print("用户名或密码错误")
        else:
            print(f"暂不支持 {db_type}")
    return wrapper

def index(x, y):
    print(f"index >> {x}:{y}")

index = auth(index, "file")
index("aini", 22)
```
### 4.4.2 语法糖一
```python
def auth(db_type="file"):
    def deco(func):
        def wrapper(*args, **kwargs):
            user = input("user: ").strip()
            pwd = input("pwd: ").strip()
            if db_type == "file":
                if user == "aini" and pwd == "aini123":
                    return func(*args, **kwargs)
                print("认证失败")
            elif db_type == "mysql":
                print("mysql 验证逻辑略")
            else:
                print("其他方式待实现")
        return wrapper
    return deco

@auth(db_type="file")
def index(x, y):
    print(f"index >> {x}:{y}")
```
### 4.4.3 标准模板
```python
def decorator_factory(param):
    def deco(func):
        def wrapper(*args, **kwargs):
            # 扩展逻辑使用 param
            return func(*args, **kwargs)
        return wrapper
    return deco

@decorator_factory("配置值")
def foo(a, b):
    return a + b
```

# 5 迭代器

## 5.1 基础知识
- 可迭代对象：实现 `__iter__()` 返回迭代器的对象（如 `list`、`dict`、`str`、`set`、`tuple`、文件对象）。
- 迭代器对象：实现 `__iter__()`（返回自身）与 `__next__()`。
```python
d = {"a": 1, "b": 2, "c": 3}
it = d.__iter__()
print(it.__next__())  # a
print(it.__next__())  # b
print(it.__next__())  # c
```
安全遍历：
```python
d = {"a": 1, "b": 2, "c": 3}
it = iter(d)
while True:
    try:
        k = next(it)
        print(k)
    except StopIteration:
        break
```
迭代器是可迭代对象；但可迭代对象不一定是迭代器。

## 5.2 `for` 循环工作原理
1. 调用对象的 `__iter__()` 获得迭代器。  
2. 反复调用迭代器 `__next__()` 获取元素。  
3. 捕获 `StopIteration` 结束循环。  

# 6 生成器（本质是迭代器）

## 6.1 `yield` 表达式
```python
def test():
    print("第一次")
    yield 1
    print("第二次")
    yield 2
    print("第三次")
    yield 3
    print("结束")

g = test()
print(next(g))  # 第一次 / 1
print(next(g))  # 第二次 / 2
print(next(g))  # 第三次 / 3
```
辅助函数接口：`next(obj)` → `obj.__next__()`；`iter(obj)` → `obj.__iter__()`。

## 6.2 `send` 用法
```python
def person(name):
    print(f"{name} 初始化")
    while True:
        food = yield
        print(f"{name} 吃 {food}")

g = person("aini")
next(g)           # 预激活
g.send("雪糕")
g.send("西瓜")
```
第一次不能直接发送非 `None` 值，需要预激活生成器。

## 6.3 三元表达式
```python
x, y = 10, 20
res = x if x > y else y
```
格式：`值_if_true if 条件 else 值_if_false`

## 6.4 列表生成式
```python
names = ["aini_aaa","dilnur_aaa","donghua_aaa","egon"]
res = [n for n in names if n.endswith("aaa")]
uppercased = [n.upper() for n in names]
trimmed = [n.replace("_aaa","") for n in names if n.endswith("_aaa")]
```
语法：`[表达式 for 元素 in 可迭代 if 条件]`

## 6.5 其他推导式
```python
# 字典推导
keys = ["name","age","gender"]
d1 = {k: None for k in keys}
items = [("name","aini"),("age",22),("gender","man")]
d2 = {k: v for k, v in items}

# 集合推导
s = {k for k in keys}

# 生成器表达式
g = (i for i in range(10) if i % 4 == 0)
t = tuple(i for i in range(10) if i % 3 == 0)

# 文件字符统计
with open("aini.txt", mode="rt", encoding="utf-8") as f:
    total_chars = sum(len(line) for line in f)
```

## 6.6 二分查找示例
```python
def search_num(num, seq):
    if not seq:
        print("没找到")
        return False
    mid = len(seq) // 2
    pivot = seq[mid]
    if num > pivot:
        return search_num(num, seq[mid+1:])
    elif num < pivot:
        return search_num(num, seq[:mid])
    else:
        print("找到了", pivot)
        return True

l = [-10,-6,-3,0,1,10,56,134,222,234,532,642,743,852,1431]
search_num(743, l)
```

## 6.7 匿名函数 (`lambda`)
```python
add = lambda x, y: x + y
print(add(10, 20))

salary = {
    "aini": 20000,
    "aili": 50000,
    "dilnur": 15000,
    "hahhaha": 42568,
    "fdafdaf": 7854
}
highest = max(salary, key=lambda k: salary[k])
print(highest)
```

# 7 模块

## 7.1 测试入口
```python
# foo.py
def run():
    print("running")

if __name__ == "__main__":
    run()
```

## 7.2 `from` 导入机制
`from foo import x` 步骤：
1. 载入并执行 `foo.py` 建立其命名空间。  
2. 在当前作用域创建名称 `x`，指向模块对象中对应成员。  

## 7.3 星号导入与 `__all__`
```python
# foo.py
__all__ = ["x", "change"]

x = 10
def change():
    global x
    x = 20
a = 30

# run.py
from foo import *
print(x)      # 10
change()
# print(a)    # NameError: a 不在 __all__ 中
```
不推荐使用 `from module import *`，会污染命名空间。

## 7.4 `sys.path` 搜索顺序
```python
import sys
from pprint import pprint
pprint(sys.path)
```
顺序：内置模块 → 按 `sys.path` 列表目录查找 → 找到即加载。可使用 `sys.path.append(str(new_path))` 临时添加。

## 7.5 `sys.modules` 查看已加载模块
```python
import sys
print("foo" in sys.modules)
```
`sys.modules` 是缓存字典，重复 `import` 不会重新执行顶层代码。

## 7.6 编写规范示例
```python
"""
this module is used to ...
"""
import sys

X = 1

class Foo:
    pass

def test():
    pass

if __name__ == "__main__":
    test()
```

# 8 包（包也是模块的一种）
- 包：含 `__init__.py` 的目录即为包；导入包会执行其 `__init__.py`。  
- 多层结构中运行入口脚本所在路径决定初始 `sys.path[0]`，后续导入基于此。

# 9 软件开发目录规范示例
ATM/                      # 项目根目录，聚合全部代码与资源
  bin/                    # 入口脚本目录（可执行启动文件）
    start.py              # 程序启动入口：解析参数、初始化环境、调用核心逻辑
  config/                 # 配置文件目录（常量、环境、全局设置）
    settings.py           # 配置集中管理：路径、数据库连接、日志级别、开关等
  db/                     # 数据访问层（封装持久化的读写操作）
    db_handle.py          # 提供对数据源的CRUD接口：文件/数据库/缓存等
  lib/                    # 公共库目录（工具函数、通用辅助，不依赖业务领域）
    common.py             # 工具集合：字符串/时间处理、通用异常、验证函数等
  core/                   # 核心业务逻辑层（领域服务、流程编排）
    src.py                # 业务主流程/服务实现：调用数据层与其他模块
  api/                    # 接口层（对外暴露的调用适配：HTTP、CLI、RPC 等）
    api.py                # 定义接口函数或路由适配，实现输入输出协议转换
  log/                    # 日志输出目录（运行时生成）
    user.log              # 示例日志文件：记录用户操作或运行轨迹
  README.md               # 项目说明文档：用途、安装步骤、使用方法、维护注意事项

结构设计说明：
1. 分层职责清晰：`core` 专注业务、`db` 专注数据、`lib` 提供复用工具、`api` 负责对外适配。  
2. 可扩展性：新增模块时保持同级目录，例如 `tests/`、`scripts/`、`docs/`。  
3. 启动隔离：`bin/start.py` 避免将可执行代码与库代码混在一起，有利于打包与部署。  
4. 配置集中：`config/settings.py` 使环境切换（开发/测试/生产）只需调整配置。可再引入分环境文件例如 `settings_dev.py`。  
5. 日志单独目录：便于轮转与清理，不污染源码目录。  
6. 公共工具与业务隔离：`lib/common.py` 不引用具体业务，有助于单元测试与复用。  
7. 数据访问抽象：`db/db_handle.py` 用接口形式减低对具体存储（文件/SQL/NoSQL）的耦合，可后续替换实现。  

可选的进一步优化建议：
- 增加 `tests/`：单元测试与集成测试分目录（如 `tests/unit/`、`tests/integration/`）。  
- 增加 `requirements.txt` 或 `pyproject.toml`：统一依赖管理。  
- 增加 `scripts/`：批处理、迁移脚本、运维脚本。  
- 使用 `logging` 配置模块：在 `config` 下添加 `logging_conf.py` 或 `logging.yaml`。  
- 增加 `docs/`：设计说明、API 文档、架构图。  
- 对大型项目拆分包结构：将 `core` 拆成多个子包（如 `core/services/`、`core/models/`）。  
- 使用 `__init__.py` 将目录转为包，便于相对导入与命名空间控制。  

动态获取项目根路径：
```python
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
```

# 10 反射

## 10.1 概念
运行期根据字符串名称动态获取、调用、修改对象属性的机制。

## 10.2 内置函数
```python
class User:
    role = "guest"
    def greet(self): return "hi"

u = User()
print(hasattr(u, "role"))
print(getattr(u, "role"))
setattr(u, "role", "admin")
print(getattr(u, "role"))
delattr(u, "role")
print(hasattr(u, "role"))
```
动态调用：
```python
def dispatch(obj, action):
    if hasattr(obj, action):
        return getattr(obj, action)()
    raise AttributeError(action)
```
谨慎：限制可访问属性白名单，防止安全隐患。