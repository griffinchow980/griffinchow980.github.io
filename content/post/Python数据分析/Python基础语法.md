---
title: "Python 基础"
date: 2022-03-01
categories: ["Python"]
tags: ["Python"]
summary: "本文系统梳理 Python 基础：解释型与动态类型特征、编码与标识符规范、缩进与注释、数据类型与变量、运算符与控制流、函数与模块包、异常处理、文件与常用容器、推导式、lambda、类与对象及常用内置函数。"
math: true
---

# 1 Python基础内容

## 1.1 基本概念
- 解释型语言：`Python` 是一种解释型语言，代码运行时逐行解释执行。
- 动态类型：变量在运行时决定类型，无需显式声明。

## 1.2 编码
- 定义：编码是将字符集转换为字节的方式。`Python 3` 默认使用 `UTF-8` 编码。
- 文件编码声明（多数场景可省略）：
```python
# -*- coding: utf-8 -*-
```
- 示例：
```python
message = "你好，世界"
print(message)
```

## 1.3 标识符
- 定义：用于命名变量、函数、类、模块等。
- 规则：
  - 仅字母（`A-Z`、`a-z`）、数字（`0-9`）、下划线 `_`
  - 不以数字开头
  - 区分大小写（`myVar` ≠ `myvar`）
  - 不使用保留字（如 `if`、`else`、`for`、`class`）
- 示例：
```python
my_variable = 10
myVariable = 20
# 1st_variable = 30  # 不合法
```

## 1.4 变量命名
- 规范：
  - 语义清晰（如 `total_sum`）
  - 普通变量 / 函数：`snake_case`
  - 类：`CamelCase`
  - 常量：全大写（如 `MAX_SIZE`）
- 示例：
```python
age = 25
MAX_SIZE = 100

class Student:
    pass
```

## 1.5 缩进
- 重要性：缩进界定代码块。
- 规则：
  - 每级通常 4 个空格
  - 不混用 Tab 与空格
  - 同块一致
- 示例：
```python
if condition:
    do_something()
    if another_condition:
        do_something_else()
```

## 1.6 注释
- 单行：`#`
- 多行说明（文档字符串）：`""" ... """` 或 `''' ... '''`
```python
# 单行注释
"""
多行说明示例
"""
```

## 1.7 数据类型
- 基本：`int`、`float`、`str`、`bool`
- 复合：`list`、`tuple`、`dict`、`set`
- 类型查看：`type(obj)` / 判断：`isinstance(obj, 类型)`

## 1.8 变量
```python
x = 5
name = "Alice"
a, b = 1, 2
```

## 1.9 运算符
- 算术：`+` `-` `*` `/` `//` `%` `**`
- 比较：`==` `!=` `>` `<` `>=` `<=`
- 逻辑：`and` `or` `not`
- 赋值扩展：`+=` `-=` `*=` `/=`
- 其他：成员 `in` / `not in`；身份 `is` / `is not`

## 1.10 控制结构
- 条件：
```python
if condition:
    ...
elif other_condition:
    ...
else:
    ...
```
- 循环：
```python
for i in range(5):
    print(i)

while condition:
    ...
```
- 循环控制：`break`、`continue`、`else`

## 1.11 函数
```python
def function_name(param1, param2=0):
    result = param1 + param2
    return result

value = function_name(3, 5)
```
- 概念：`def`、`return`、默认参数、关键字参数、可变参数 `*args` / `**kwargs`、匿名函数 `lambda`

## 1.12 模块与包
```python
import module_name
from module_name import function_name
from package.submodule import ClassName as Alias
```
- 查看成员：`dir(module_name)`
- 搜索路径：`import sys; print(sys.path)`

## 1.13 异常处理
```python
try:
    risky()
except SomeException as e:
    print(e)
else:
    ...
finally:
    cleanup()
```
- 抛出：`raise ValueError("msg")`
- 常见：`ValueError`、`TypeError`、`KeyError`、`IndexError`、`ZeroDivisionError`

## 1.14 文件操作
```python
with open("filename.txt", "r", encoding="utf-8") as file:
    content = file.read()

with open("output.txt", "w", encoding="utf-8") as out:
    out.write("Hello")
```

## 1.15 列表、元组、字典、集合的基本操作
### 1.15.1 列表 (`list`)
```python
my_list = [1, 2, 3]
my_list.append(4)
my_list.insert(1, 10)
my_list.remove(2)
first = my_list[0]
length = len(my_list)
```
### 1.15.2 元组 (`tuple`)
```python
my_tuple = (1, 2, 3)
```
### 1.15.3 字典 (`dict`)
```python
my_dict = {"key": "value"}
my_dict["new_key"] = "new_value"
value = my_dict.get("missing", "default")
```
### 1.15.4 集合 (`set`)
```python
my_set = {1, 2, 3}
my_set.add(4)
my_set.update({5, 6})
```

## 1.16 列表推导式
- 语法：`[表达式 for 变量 in 可迭代 if 条件]`
```python
squares = [x ** 2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
```

## 1.17 Lambda 函数
```python
add = lambda x, y: x + y
result = add(2, 3)
```

## 1.18 类与对象
```python
class MyClass:
    def __init__(self, value):
        self.value = value  # 实例属性

    def display(self):
        print(self.value)

obj = MyClass(10)
obj.display()
```
- 关键字：`class`、`self`、`__init__`
- 常见特殊方法：`__str__`、`__repr__`

## 1.19 常用内置函数
- `len()`：长度
- `type()`：类型
- `print()`：输出
- `input()`：输入
- `range()`：整数序列
- `isinstance()`：类型判断

# 2 标识符

## 2.1 定义与作用
标识符是程序中用于命名变量、函数、类、模块、包等实体的名字，用来唯一引用与操作这些对象。良好命名提升可读性与可维护性。

## 2.2 规则与限制
- **组成**：字母（`A-Z`、`a-z`）、数字（`0-9`）、下划线 `_`；首字符不能是数字。  
- **大小写敏感**：`myVariable` ≠ `myvariable`。  
- **关键字不可用**：如 `if`、`for`、`while`、`class`、`def`、`return` 等；查看完整列表：
```python
import keyword
print(keyword.kwlist)
```
- 长度无硬性限制，但应简短且语义明确。  
- 禁止使用空格与特殊字符：`@`、`-`、`$`、`!` 等。  

## 2.3 命名规范与风格
- **语义清晰**：`count`、`user_name` 优于 `c`、`usr`。  
- **普通变量 / 函数**：`snake_case`（如 `total_price`）。  
- **类**：`CamelCase`（如 `StudentRecord`）。  
- **常量**（约定不可改）：全大写加下划线（如 `MAX_SIZE`、`PI`）。  
- **布尔**：前缀 `is_`、`has_`、`can_`（如 `is_valid`、`has_token`）。  
- **避免无意义单字符**（除短期循环：`i`、`x`）。  
- **少用容易混淆的尾随下划线**（`value_`）或**伪避免关键字**的形式（`if_`）；若避免冲突可重命名为更具体：`if_condition`。

## 2.4 示例与反例
**合法（代表性）**：
```python
user_name = "Alice"
age = 30
MAX_SIZE = 100
StudentRecordCount = 12      # 类式命名（建议仅用在类）
total_price = 250.75
is_valid = True
student_count = 45
_user = "internal"           # 前导下划线表示内部语义
PI = 3.14159
first_name = "John"
x = 10                       # 单字符在局部循环可接受
```
**常见不合法或不推荐**：
```python
1st_variable = 10      # 数字开头
my-variable = 20       # 含 '-'
class = "test"         # 关键字
@name = "admin"        # 含 '@'
def = "function"       # 关键字
first name = "Alice"   # 空格
$salary = 5000         # 含 '$'
3d_model = "model1"    # 数字开头
global = "g"           # 关键字
if_ = "cond"           # 合法但不推荐（易混淆）
```

## 2.5 常见错误与改进建议

- **使用关键字**：改为加后缀或语义扩展（`class` → `class_name`）。  
- **非法字符或空格**：统一使用下划线（`first name` → `first_name`）。  
- **首字符为数字**：改写为字母前缀（`3d_model` → `model_3d`）。  
- **命名不具语义**：替换为具描述性名（`a` → `total_count`）。  
- **不一致大小写**：统一采用 `snake_case`；类名统一 `CamelCase`。  
- **滥用伪常量**：仅在确为全局不变配置时使用全大写。  

# 3 变量命名

## 3.1 基本规则与核心原则
- **组成**：字母（`A-Z`、`a-z`）、数字（`0-9`）、下划线 `_`；首字符不可为数字（`1name` 非法，`name1` 合法）。  
- **区分大小写**：`age` ≠ `Age`。  
- **禁用关键字**：`if`、`for`、`while`、`class`、`def`、`return` 等；可用重命名：`for_`、`class_name`。  
- **语义明确**：名称应传达用途（`total_price` 优于 `tp`）。  
- **避免无意义单字符**：除短循环：`i`、`x`。  
- **禁止特殊字符与空格**：`school-name`、`first name`、`$salary` 均非法。  

## 3.2 命名规范与风格约定
- **普通变量 / 函数**：`snake_case`（如 `user_name`、`city_of_residence`）。  
- **常量**：全大写下划线（如 `MAX_AGE`、`BIRTH_YEAR`、`PI`）。  
- **类**：`CamelCase`（如 `StudentRecord`）。  
- **布尔**：前缀 `is_` / `has_` / `can_`（如 `is_student`、`has_scholarship`）。  
- **集合 / 序列**：复数或后缀：`hobbies`、`completed_courses`、`friend_names`、`hobby_list`。  
- **语义增强**：必要时加领域词：`enrolled_university`、`graduation_year`。  

## 3.3 示例（代表性）
```python
user_name = "aini"
age = 23
birth_year = 2000
is_student = True
hobbies = ["阅读", "运动"]
completed_courses = ["数学", "物理"]
MAX_AGE = 100
BIRTH_YEAR = 2000
graduation_year = 2025
city_of_residence = "上海"
```

## 3.4 反例与改进建议
| 反例 | 问题 | 建议替换 |
|------|------|----------|
| `1name` | 数字开头 | `name1` 或 `user_name` |
| `school-name` | 含 `-` | `school_name` |
| `class` | 关键字 | `class_name` |
| `usr` | 模糊缩写 | `user_name` |
| `AGE23` | 普通变量误作常量风格 | `age` |
| `a` | 语义缺失 | `total_count` |
| `if_` | 易与关键字混淆 | `if_condition` 或语义重写 |
| `MyName` | 非约定风格（驼峰用于类） | `my_name` / `user_name` |

常见错误类型与修正：
- **使用关键字**：加后缀或语义扩展（`def` → `define_func`）。  
- **模糊缩写**：替换为完整语义（`usr` → `user_name`）。  
- **风格不一致**：统一采用 `snake_case`；类名专用 `CamelCase`。  
- **滥用全大写**：仅在确为配置 / 常量时使用全大写。  

# 4 缩进和注释

## 4.1 缩进
### 4.1.1 缩进的定义和作用
在 `Python` 中，缩进用于标识代码块。与许多语言不同，`Python` 不使用 `{}` 包裹代码块，而依靠缩进确定层次结构，因此缩进是语法的一部分，错误缩进会触发 `IndentationError`。

### 4.1.2 缩进的基本规则
1. **缩进一致性**：同一代码块内缩进宽度必须一致；推荐 4 个空格。不建议混用空格与 Tab。  
2. **代码块结构**：`if`、`for`、`while`、`def`、`class` 等语句后随行首缩进块，缩进内容归属该语句。  

### 4.1.3 缩进示例
```python
age = 23

if age >= 18:
    print("你已成年")      # 属于 if 块
    print("可以参与投票")
else:
    print("你未成年")
```

### 4.1.4 缩进错误示例
```python
if age >= 18:
    print("你已成年")
     print("可以参与投票")  # 前面有 5 个空格，缩进不一致导致 IndentationError
```

### 4.1.5 嵌套缩进
每多一层逻辑结构（例如内层 `if`）再缩进一次（通常再加 4 个空格）：
```python
age = 23
is_student = True

if age >= 18:
    print("你已成年")
    if is_student:
        print("你是成年学生")
    else:
        print("你不是学生")
else:
    print("你未成年")
```

## 4.2 注释
### 4.2.1 单行注释
使用 `#`，可位于行首或语句末尾：
```python
age = 23  # 定义年龄变量
# 这是一个多行的说明
# 第二行
# 第三行
```

### 4.2.2 多行注释
使用三引号字符串 `''' ... '''` 或 `""" ... """`。在函数、类、模块第一行作为文档字符串（`docstring`）更规范：
```python
"""
这是一段多行说明
可用于描述整体逻辑
"""
```

### 4.2.3 函数和类的文档字符串（docstring）
```python
def greet_user(name):
    """打印问候用户的消息"""
    print(f"你好, {name}")

class Student:
    """学生类：存储基本信息"""
    def __init__(self, name, age):
        """初始化学生的名字与年龄"""
        self.name = name
        self.age = age
```

### 4.2.4 注释的规范与最佳实践
- **语义而非复述代码**：`count = 0  # 记录当前用户数量` 优于 `count = 0  # 将计数变量设置为0`。  
- **注释重要逻辑或复杂流程**：在算法关键步骤说明意图。  
- **避免过度注释**：不要为每一行写显而易见的解释。  
- **及时维护**：代码修改后同步更新注释，防止陈旧误导。  

## 4.3 结合缩进和注释的代码示例
```python
def check_eligibility(age, city):
    """
    根据年龄与城市判断资格
    参数:
        age (int): 年龄
        city (str): 城市
    返回:
        bool: 是否符合条件
    """
    # 判断年龄是否大于等于 18
    if age >= 18:
        # 年龄合格后检查城市
        if city == "上海":
            return True      # 满足条件
        else:
            return False     # 城市不符合
    else:
        return False         # 年龄不符合


# 调用演示
user_age = 23
user_city = "上海"
is_eligible = check_eligibility(user_age, user_city)  # 检查资格
print(is_eligible)
```

### 4.3.1 示例要点
- **缩进一致性**：每层 4 空格，结构清晰。  
- **注释层级区分**：上层说明意图，内层强调条件分支逻辑。  
- **`docstring` 使用**：函数开头集中描述目的、参数、返回值。  

# 5 数据类型

## 5.1 基本类型概览
- **整数 `int`**：无限精度，常用运算 `+ - * / // % **`
- **浮点数 `float`**：二进制浮点，存在精度误差（示例：`0.1 + 0.2 != 0.3`），可用 `from decimal import Decimal`
- **布尔值 `bool`**：仅 `True` `False`，来源于比较与逻辑表达式（如 `a > b`）
- **字符串 `str`**：文本序列，支持切片与方法 `upper()` `lower()` `split()` `replace()` `len()`

示例：
```python
age = 23
pi = 3.14159
is_student = True
name = "aini"
sub = name[1:3]      # 'in'
```

## 5.2 复合类型概览
- **列表 `list`**：可变有序；增删改查常用 `append()` `remove()` 切片
- **元组 `tuple`**：不可变有序；支持解包
- **字典 `dict`**：键值映射；常用 `keys()` `values()` 获取视图
- **集合 `set`**：元素唯一；支持集合运算 `| & - ^`

示例：
```python
hobbies = ["阅读", "运动"]
coordinates = (30.0, 50.0)
student = {"name": "aini", "age": 23}
unique_numbers = {1, 2, 3, 3}  # {1, 2, 3}
```

## 5.3 常用操作对比
| 类型 | 可变性 | 典型字面量 | 访问 / 常用操作 | 主要用途 |
|------|--------|------------|----------------|----------|
| `int` | 不可变 | `42` | 算术运算 | 计数/索引 |
| `float` | 不可变 | `1.23` | 算术/格式化 | 近似数值 |
| `bool` | 不可变 | `True` | 逻辑运算 | 条件控制 |
| `str` | 不可变 | `"text"` | 切片/拼接/方法 | 文本处理 |
| `list` | 可变 | `[1,2,3]` | 索引/切片/增删 | 有序集合 |
| `tuple` | 不可变 | `(1,2,3)` | 索引/解包 | 固定结构 |
| `dict` | 可变 | `{"k": "v"}` | `d["k"]` 更新/迭代 | 映射关系 |
| `set` | 可变 | `{1,2,3}` | 成员测试/集合运算 | 去重运算 |

## 5.4 `None` 与空值
- **`None`**：唯一的空值（类型：`NoneType`）
- **用途**：占位、未计算结果、可选参数默认值
- **判定**：使用 `is None` 而非 `== None`

示例：
```python
result = None
if result is None:
    result = "fallback"
```

## 5.5 常见注意事项
- **浮点误差**：使用 `round()` 或 `Decimal` 控制精度
- **不可变与拷贝**：修改列表需注意引用（使用 `list.copy()`）
- **字典键要求**：键需可哈希（如 `str`、`int`、`tuple`），`list` 不可作键
- **集合去重**：将列表转集合可快速去重：`unique = set(hobbies)`
- **字符串不可变**：修改需重建（如 `new_name = name.replace("a", "A")`）

# 6 运算符

## 6.1 分类速览
- **算术**：`+ - * / // % **`
- **比较**：`== != > < >= <=`
- **赋值**：`= += -= *= /= //= %= **=`
- **逻辑**：`and or not`
- **位运算**：`& | ^ ~ << >>`
- **成员**：`in not in`
- **身份**：`is is not`
- **海象赋值表达式**：`:=`（在表达式内部绑定值）
- **优先级策略**：不确定时用括号 `()`

## 6.2 代表示例
```python
a, b = 10, 3
print(a + b, a - b, a * b, a / b, a // b, a % b, a ** b)

x, y = 5, 10
print(x < y, x == y, x != y)

x += 2; x *= 3  # 复合赋值
flag = (x > y) and (a > b)
print(flag)

m, n = 5, 3
print(m & n, m | n, m ^ n, ~m, m << 1, m >> 1)

fruits = ["apple", "banana"]
print("apple" in fruits, "pear" not in fruits)

L1 = [1,2,3]; L2 = L1; L3 = [1,2,3]
print(L1 is L2, L1 is L3, L1 == L3)

# 海象运算符示例：避免重复计算 len(items)
items = ["a", "b", "c"]
if (n := len(items)) > 2:
    print(f"Too many items: {n}")

# 在 while 循环中读取行
with open("demo.txt", "r", encoding="utf-8") as f:
    while (line := f.readline().strip()):
        print(line)

# 正则匹配与条件
import re
s = "order42"
if (m := re.search(r"\d+", s)):
    print(m.group(0))

# 列表推导中清洗并过滤
lines = ["  a  ", " ", "  b"]
clean = [line for raw in lines if (line := raw.strip()) and line]
print(clean)
```

## 6.3 运算符行为速表
| 类别 | 说明 | 常见陷阱 |
|------|------|----------|
| 算术 | 基础数值与幂 | `/` 产生 `float`；`//` 整除截断 |
| 比较 | 返回 `bool` | 连锁比较可写 `1 < x < 10` |
| 赋值 | 原地更新变量 | 复合赋值不返回值 |
| 逻辑 | 短路机制 | `and` / `or` 返回最后求值的对象 |
| 位运算 | 操作整数二进制 | `~x` 等于 `-(x+1)` |
| 成员 | 序列/集合包含测试 | 对大型集合使用 `set` 提升性能 |
| 身份 | 是否同一对象 | 内容相同不代表身份相同 |
| 海象赋值表达式 | 在表达式中绑定变量 | 滥用降低可读性或引入阴影变量 |
| 优先级 | 控制执行顺序 | 复杂表达式建议加括号 |

## 6.4 优先级（高→低）
1. **幂**：`**`
2. **一元操作**：`~ not`
3. **乘除组**：`* / // %`
4. **加减**：`+ -`
5. **移位**：`<< >>`
6. **比较**：`< <= > >=`
7. **等值**：`== !=`
8. **位与**：`&`
9. **位异或**：`^`
10. **位或**：`|`
11. **逻辑与或**：`and or`
12. **赋值与海象**：`= += -= ... :=`（最低级，优先用括号明确逻辑）

## 6.5 海象运算符要点
- **语法**：`target := expression`
- **用途**：在条件、循环、推导式内重用表达式结果减少重复计算
- **可读性**：仅在减少重复且不隐藏副作用时使用
- **作用域**：推导式中赋值的变量在 Python 3.8+ 仍处于外部作用域，注意避免污染命名
- **典型场景**：长度计算、匹配结果缓存、`while` 循环读取、过滤与转换同时进行

## 6.6 常见注意事项与建议
- **浮点比较**：用 `math.isclose()` 代替直接 `==`
- **短路逻辑默认值**：`value = user_input or "default"`
- **链式比较**：`a < b < c` 更简洁
- **身份 vs 相等**：`is` 用于 `None` 与单例；其他用 `==`
- **括号优先**：复杂表达式加括号提升可读性
- **位运算使用场景**：标志位、权限掩码、性能优化结构
- **谨慎海象滥用**：复杂嵌套时改写为普通赋值提升清晰度

# 7 字符串

## 7.1 定义与特性
- **定义**: 字符串 `str` 是不可变字符序列, 用 `'` `"` 或三引号 `'''` `"""` 创建  
- **不可变**: 任何“修改”都会生成新字符串 (`s.replace(...)` 不会原地改变)  
- **多行文本**: 三引号适合多行/文档字符串 (`docstring`)  
```python
name = "aini"
long_text = """多行
字符串"""
```

## 7.2 基本操作
```python
s = "Python"
full = "aini" + " Zhang"        # 拼接
repeat = "Hi" * 3               # 重复: 'HiHiHi'
n = len(s)                      # 长度
first, last = s[0], s[-1]       # 索引
sub = s[1:4]                    # 切片 'yth'
step = s[::2]                   # 'Pto'
rev = s[::-1]                   # 反转 'nohtyP'
```
- **拼接**: `+` 或用 `join()` 连接可迭代更高效  
- **重复**: `*`  
- **长度**: `len(s)`  
- **索引/切片**: 支持负索引与步长  
- **反转**: `s[::-1]`  
- **成员测试**: `'Py' in s`  

## 7.3 常用方法与检查
```python
t = "  Hello World  "
t2 = t.strip()          # 去除两端空白
upper = t2.upper()      # 大写
lower = t2.lower()      # 小写
repl = t2.replace("World", "Python")
parts = t2.split()      # ['Hello', 'World']
joined = "-".join(parts)
pos = t2.find("World")  # 6  (找不到返回 -1)
idx = t2.index("World") # 6  (找不到抛 ValueError)
```
- **大小写**: `upper()` `lower()` `title()`  
- **去空白**: `strip()` `lstrip()` `rstrip()`  
- **替换**: `replace(old, new)`  
- **拆分与合并**: `split(sep)` + `sep.join(iterable)`  
- **查找**: `find()` 返回索引或 -1; `index()` 抛异常; `rfind()` 反向  
- **判断前缀/后缀**: `startswith()` `endswith()`  
- **格式化辅助**: `zfill()` `center()` `ljust()` `rjust()`  

字符串检查方法速表:
| 方法 | 条件为 True | 示例 |
|------|-------------|------|
| `isalpha()` | 全是字母且非空 | `"Hello".isalpha()` |
| `isdigit()` | 全是数字且非空 | `"123".isdigit()` |
| `isalnum()` | 全字母或数字且非空 | `"A1".isalnum()` |
| `isspace()` | 全空白且非空 | `" \t".isspace()` |
| `islower()` | 至少一字母且全小写 | `"abc".islower()` |
| `isupper()` | 至少一字母且全大写 | `"ABC".isupper()` |
| `isascii()` | 全 ASCII | `"你好".isascii()` -> False |

## 7.4 字符串格式化
```python
name = "aini"; age = 23
f_msg = f"{name}-{age}"                    # f-string
fmt_msg = "姓名: {0}, 年龄: {1}".format(name, age)
old_msg = "姓名: %s, 年龄: %d" % (name, age)
val = f"{age:04d}"                         # 宽度与填充
num = f"{3.14159:.2f}"                     # 保留小数
```
- **f-string**: 可嵌表达式与格式说明 (`f"{age:04d}"`)  
- **`str.format()`**: 位置/命名占位 (`"{name}".format(name=name)`)  
- **百分号格式**: 旧风格仍见于历史代码 (`%s %d %.2f`)  
- **选择建议**: 新代码首选 f-string; 需要动态占位映射时用 `format()`  

## 7.5 编码与解码
```python
u = "你好"
b = u.encode("utf-8")          # 编码 -> bytes
u2 = b.decode("utf-8")         # 解码 -> str
```
- **编码**: `str.encode(encoding)` → `bytes`  
- **解码**: `bytes.decode(encoding)` → `str`  
- **默认编码**: `UTF-8` (Python 3)  
- **错误处理**: `u.encode("utf-8", errors="ignore")` / `"replace"`  

## 7.6 实用技巧与注意
- **高效拼接**: 多次累加用列表收集后 `''.join(list)`  
- **惰性处理**: 大文本逐行迭代避免一次性加载  
- **正则匹配**: 复杂模式使用 `re` 模块 (`re.search`, `re.sub`)  
- **安全格式化**: 避免把不可信数据直接拼接进命令字符串  
- **查找 vs 成员**: 简单包含用 `'sub' in s`, 需索引用 `find()`  
- **不可变复制陷阱**: 切片返回新字符串 (`s[:]` 等价于 `s`)  
- **清洗流水线**: 组合 `strip()` + `lower()` + 验证方法  
- **数字判断进阶**: `isdigit()` 不识别负号与小数点, 解析可用 `int()` `float()` 包异常  

# 8 列表

## 8.1 概念与基础操作
- **定义**: 列表 `list` 是有序可变序列, 使用 `[]`, 可包含任意类型与混合类型
- **创建**: `[]` / `list(iterable)`; 复制浅层可用切片 `lst[:]`
- **索引与切片**: 支持负索引与步长 (`lst[-1]`, `lst[1:4]`, `lst[::-1]`)
- **长度**: `len(lst)`
- **成员测试**: `x in lst` / `x not in lst`
- **示例**:
    ```python
    numbers = [1, 2, 3, 4, 5]
    first, last = numbers[0], numbers[-1]
    sub = numbers[1:4]        # [2,3,4]
    rev = numbers[::-1]       # 反转
    ```

## 8.2 常用方法速览
| 方法 | 作用 | 是否原地 | 备注 |
|------|------|----------|------|
| `append(x)` | 末尾添加 | 是 | 单元素 |
| `extend(iter)` | 追加多个 | 是 | 等价于逐个 `append` |
| `insert(i,x)` | 指定位置插入 | 是 | 可能 O(n) |
| `remove(x)` | 删除首个匹配 | 是 | 不存在抛 `ValueError` |
| `pop(i=-1)` | 弹出并返回 | 是 | 省略索引为末尾 |
| `clear()` | 清空 | 是 | |
| `index(x)` | 返回首个索引 | 否 | 不存在抛异常 |
| `count(x)` | 统计出现次数 | 否 | |
| `sort(key=None, reverse=False)` | 原地排序 | 是 | 稳定排序 |
| `reverse()` | 原地反转 | 是 | |
| `sorted(iterable)` | 返回新排好序列表 | 否 | 适用于任意可迭代 |

- **修改 vs 返回新对象**: 需要保留原顺序时使用 `sorted()` 而不是 `sort()`
- **性能提示**: 末尾操作 (`append`/`pop()`) 摊销 O(1); 头部或中间插入/删除为 O(n)

示例:
```python
lst = [3, 1, 4, 2]
lst.append(5)
removed = lst.pop()          # 5
lst.sort()
rev = lst[::-1]              # 切片反转新列表
lst.reverse()                # 原地反转
```

## 8.3 列表推导与嵌套
- **语法**: `[expr for x in iterable if cond]`
- **条件表达式**: `[x if x % 2 == 0 else -x for x in range(5)]`
- **嵌套推导 (二维展开)**: `[cell for row in matrix for cell in row]`
- **嵌套结构**: 矩阵、层级数据用列表套列表
    ```python
    squares = [x*x for x in range(1, 6)]
    evens = [x for x in range(10) if x % 2 == 0]
    matrix = [[1,2,3],[4,5,6],[7,8,9]]
    flat = [n for row in matrix for n in row]   # 展平
    ```
- **谨慎点**: 复杂嵌套可读性差时改为普通循环; 避免在推导中产生副作用

## 8.4 拷贝与引用语义
- **浅拷贝**: `lst.copy()` / `lst[:]` / `list(lst)` 仅复制最外层引用
- **浅拷贝影响**: 内部可变对象共享, 修改子元素会影响原列表
- **深拷贝**: `import copy; deep = copy.deepcopy(lst)` 递归复制所有层
- **示例**:
    ```python
    original = [1, [2, 3], 4]
    shallow = original.copy()
    shallow[1][0] = 99
    # original -> [1, [99, 3], 4]

    import copy
    deep = copy.deepcopy(original)
    deep[1][1] = 777
    # original 不受影响
    ```
- **选择建议**: 若嵌套层不修改子结构, 浅拷贝足够; 否则用深拷贝或数据不可变化 (转 `tuple`)

## 8.5 类型转换与技巧
- **字符串 → 列表**: `list("hello")` → `['h','e','l','l','o']`
- **元组 / 集合 → 列表**: `list((1,2))`, `list({3,1,2})`
- **列表去重保序**: `list(dict.fromkeys(lst))`
- **过滤与映射**: `[f(x) for x in lst if cond(x)]` 替代 `map`+`filter`
- **安全删除**: 遍历时删除元素用列表推导重建而非原地循环删除
- **合并多个列表**: 使用解包 `merged = [*a, *b, *c]`
- **分块 (切片步长)**: `parts = lst[::2]` 选偶位元素
- **原地 vs 新对象**: 明确是否需要保留原数据以避免意外覆盖

# 9 元组

## 9.1 定义与特性
- **本质**: 元组 `tuple` 是有序不可变序列, 使用 `()` 或无括号逗号分隔 (打包)  
- **不可变**: 创建后元素不可增删改, 保障数据只读安全  
- **可包含任意类型**: 支持混合、嵌套 (`(1, "a", (2,3))`)  
- **单元素写法**: `(42,)` 必须保留逗号  
- **与列表区别**: 列表可变; 元组适合固定结构、字典键、返回多值  
```python
empty_tuple = ()
single = (42,)
mixed = (1, "hello", 3.14)
packed = 1, 2, 3          # 隐式打包
```

## 9.2 基本操作与方法
```python
numbers = (1, 2, 3, 4, 5)
first, last = numbers[0], numbers[-1]
slice_part = numbers[1:4]      # (2,3,4)
step = numbers[::2]            # (1,3,5)
rev = numbers[::-1]            # (5,4,3,2,1)
length = len(numbers)          # 5
count_2 = numbers.count(2)
idx_3 = numbers.index(3)
```
- **索引与切片**: 支持负索引与步长  
- **长度**: `len(t)`  
- **方法**: `count(x)` 返回出现次数; `index(x)` 返回首个索引 (不存在抛 `ValueError`)  
- **不可变影响**: 无增删改方法 (无 `append` / `remove`)  

## 9.3 解包、嵌套与转换
```python
point = (10, 20)
x, y = point                # 解包
a, b, *rest = (1, 2, 3, 4)  # 扩展解包
nested = ((1,2,3), (4,5,6))
val = nested[1][2]          # 6
numbers_list = [1, 2, 3]
as_tuple = tuple(numbers_list)
back_to_list = list(as_tuple)
```
- **解包**: 平行赋值、扩展解包支持 `*rest` 收集剩余  
- **嵌套**: 可表达二维/结构化数据  
- **转换**: `tuple(iterable)` / `list(tuple_obj)` 灵活切换可变性  
- **函数多值返回**: `return a, b` 实际返回元组, 可直接解包  

## 9.4 使用场景与拷贝语义
- **多值返回**: 函数同时返回多个相关值  
- **字典键**: 复合键使用元组保证哈希稳定 (`cache[(user_id, date)] = value`)  
- **不可变约束**: 防止意外修改的配置、常量结构  
- **数据安全**: 传入函数后不可被内部更改  
- **拷贝语义**: 赋值仅复制引用 (共享同一对象); 因不可变通常无需深拷贝  
```python
original = (1, 2, 3)
copy_ref = original
print(copy_ref is original)     # True
```

## 9.5 优点与局限
| 方面 | 优点 | 局限 |
|------|------|------|
| 不可变性 | 语义清晰, 安全, 可哈希 | 不能原地修改 |
| 性能 | 创建/迭代轻量 (相对列表) | 方法少功能单一 |
| 结构表达 | 固定字段顺序 | 可读性不如具名结构 (`dataclass`) |
| 哈希使用 | 可作字典键/集合元素 | 内含可变对象时不可哈希 |
| 可替代性 | 简洁返回多值 | 语义复杂时需改用类或 `namedtuple` |

## 9.6 实用技巧与注意
- **打包与解包**: 多变量赋值隐式形成元组与拆解  
- **避免误写单元素**: `(x)` 是 `x`, `(x,)` 才是单元素元组  
- **嵌套可读性**: 复杂结构优先考虑 `namedtuple` / `dataclass`  
- **与列表转换策略**: 只读阶段用元组, 加工阶段用列表  
- **解包扩展**: `head, *middle, tail = data` 灵活拆解序列  
- **哈希使用前检查**: 元组内部元素需全部可哈希  
- **不可变不等于绝对安全**: 若内部包含可变对象 (如列表) 仍可修改内部引用内容  
```python
t = (1, [2,3])
t[1][0] = 99      # 修改内部列表, 元组自身引用未变
```

# 10 字典

## 10.1 定义与特性
- **本质**: 字典 `dict` 是键值映射, 使用 `{key: value}` 结构
- **键要求**: 键必须可哈希 (常见: `str` `int` `tuple`), 值任意类型
- **唯一性**: 键唯一, 覆盖同名键会更新其值
- **顺序**: Python 3.7+ 保留插入顺序
```python
empty = {}
person = {"name": "aini", "age": 23}
mixed = {"a": 1, "b": [2,3], ("x","y"): True}
```

## 10.2 访问与增删改
```python
d = {"name": "aini", "age": 23}
d["age"] = 24                # 修改
d["city"] = "Shanghai"       # 添加
age = d.get("age")           # 安全访问
gender = d.get("gender", "N/A")
has_name = "name" in d
removed = d.pop("age")       # 删除并返回
last = d.popitem()           # 删除最后插入项 (3.7+)
del d["city"]                # 删除键
```
- **直接索引**: 键不存在抛 `KeyError`
- **安全访问**: 用 `get(key, default)` 或 `d.setdefault(key, default)`
- **成员测试**: `key in d` 测试键存在
- **批量更新**: `d.update(other)` 覆盖重复键
- **合并语法** (3.9+): `merged = d1 | d2`; 原地更新: `d1 |= d2`

## 10.3 常用方法速表
| 方法 | 作用 | 返回/影响 | 提示 |
|------|------|-----------|------|
| `get(k, default)` | 安全取值 | 值或默认 | 不改字典 |
| `setdefault(k, default)` | 取值或设默认 | 值 | 会插入键 |
| `keys()` | 键视图 | 可迭代视图 | 动态反映变化 |
| `values()` | 值视图 | 可迭代视图 | 可含重复 |
| `items()` | `(键,值)` 视图 | 可迭代视图 | 常用于解包迭代 |
| `update(m)` | 合并更新 | 原地修改 | 覆盖同名键 |
| `pop(k)` | 删除键并返回值 | 改变字典 | 不存在抛异常 |
| `popitem()` | 删除最后插入项 | `(键,值)` | 空字典抛异常 |
| `clear()` | 清空 | 变为空 | |
| `copy()` | 浅拷贝 | 新字典 | 嵌套仍共享引用 |

## 10.4 遍历与模式
```python
for k in d:        # 等价于 for k in d.keys()
    ...

for k, v in d.items():
    ...

# 条件筛选构造新字典
filtered = {k: v for k, v in d.items() if isinstance(v, int)}
# 值映射
mapped = {k: v * 2 for k, v in {"a":1,"b":2}.items()}
```
- **键遍历**: 默认迭代键
- **条目遍历**: `for k, v in d.items()`
- **构造/过滤**: 使用字典生成式 `{key_expr: value_expr for ... if ...}`
- **避免修改冲突**: 遍历时不原地删除, 需构造新字典

## 10.5 嵌套与安全访问
```python
student = {
    "name": "aini",
    "scores": {"math": 90, "science": 85}
}
math_score = student["scores"]["math"]
# 安全链式获取
math_safe = student.get("scores", {}).get("math")
```
- **嵌套结构**: 用层级字典表达复合关系
- **安全链式**: 逐级 `get` 或使用第三方 `dict.get` 封装

## 10.6 拷贝与不可变性策略
```python
import copy
original = {"name": "aini", "courses": {"math": 90}}
shallow = original.copy()
shallow["courses"]["math"] = 100    # 修改原嵌套
deep = copy.deepcopy(original)
deep["courses"]["math"] = 999       # 原数据不变
```
- **浅拷贝**: `.copy()` / `{**d}` 仅复制顶层映射
- **深拷贝**: `copy.deepcopy()` 递归复制
- **替代策略**: 需要只读可用 `types.MappingProxyType(d)` 创建只读视图

## 10.7 使用场景
- **数据映射**: 用户信息 / 配置 / 参数集合
- **频次统计**: 计数器 (`count[word] = count.get(word, 0) + 1`)
- **缓存与索引**: 组合键做索引 (`cache[(user_id, date)]`)
- **结构化数据**: 嵌套表示层级属性
- **合并配置**: 默认值 + 用户覆盖 (`final = {**defaults, **overrides}`)

## 10.8 性能与注意事项
- **平均复杂度**: 键访问/插入 O(1) 均摊
- **哈希冲突**: 避免使用可变对象作键
- **键可哈希**: 如需复合键使用元组且内部元素可哈希
- **顺序依赖**: 利用保序特性可实现简单的有序加载流程
- **避免深嵌套**: 深层链式访问易出错, 可抽取为类或使用 `dataclass`
- **默认值陷阱**: 不用 `dict.fromkeys(keys, [])` 创建共享列表, 使用推导替代
```python
data = {k: [] for k in ["a","b","c"]}  # 每个键独立列表
```

## 10.9 进阶特性 (3.9+ 与常用习惯)
```python
a = {"x":1, "y":2}
b = {"y":99, "z":3}
merged = a | b            # {'x':1,'y':99,'z':3}
a |= b                    # a 原地更新
# 解包构造
c = {**a, **b, "t": 7}
```
- **合并运算符**: `|` 生成新字典, `|=` 原地
- **解包**: `{**d1, **d2, "extra": v}` 合并并附加
- **生成式组合**: `{k: f(v) for k, v in source.items()}` 灵活变换

# 11 集合

## 11.1 定义与特性
- **本质**: 集合 `set` 是无序、元素唯一的可变容器
- **创建**: 非空用花括号 `{1,2,3}`; 空集合必须 `set()`（`{}` 是空字典）
- **可哈希要求**: 元素需可哈希 (`int` `str` `tuple` 等), `list`/`dict` 不可作为元素
- **用途核心**: 去重、快速成员测试、集合运算
```python
empty_set = set()
fruits = {"apple", "banana", "cherry"}
```

## 11.2 基本与更新操作
```python
s = {"apple", "banana"}
s.add("cherry")              # 添加单元素
s.discard("grape")           # 不存在不报错
# s.remove("grape")          # 不存在抛 KeyError
exists = "apple" in s
item = s.pop()               # 随机弹出一个元素
s.clear()                    # 清空
```
- **add**: 添加单元素
- **remove vs discard**: `remove` 不存在抛异常; `discard` 安全忽略
- **pop**: 删除并返回任意元素（依实现通常为内部顺序首个）
- **成员测试**: `in` 平均 O(1)
- **不可索引**: 无序不支持 `s[0]`

## 11.3 运算与原地更新
```python
a = {1,2,3}; b = {3,4,5}
union_set = a | b                    # 并集
inter_set = a & b                    # 交集
diff_set = a - b                     # 差集 (a 中不在 b)
sym_set = a ^ b                      # 对称差集

a |= b           # 并集更新
a &= b           # 交集更新
a -= b           # 差集更新
a ^= b           # 对称差集更新
```
- **并集**: `|` / `union()`
- **交集**: `&` / `intersection()`
- **差集**: `-` / `difference()`
- **对称差集**: `^` / `symmetric_difference()`
- **原地更新方法**: `update` `intersection_update` `difference_update` `symmetric_difference_update`
- **链式组合**: `(a | b) - c` 等通过括号保持意图清晰

## 11.4 生成式与典型操作
```python
squares = {x*x for x in range(5)}          # 集合生成式
unique = set([1,1,2,3])                    # 去重
filtered = {w for w in ["a","bb","ccc"] if len(w) > 1}
```
- **生成式**: `{expr for x in iterable if cond}`
- **去重列表**: `unique_list = list(set(lst))`（不保序）
- **保序去重**: `seen = set(); ordered = [x for x in lst if not (x in seen or seen.add(x))]`
- **差异与过滤**: 用条件控制结果集合
- **与字典推导区别**: 字典需要键值对 `k:v`; 集合只产出值表达式

## 11.5 冻结集合与拷贝
```python
fs = frozenset(["apple","banana"])
# fs.add("cherry")  # 不可修改
s = {1,2,3}
shallow_copy = s.copy()
```
- **frozenset**: 不可变集合, 可作字典键或集合元素
- **不可变优势**: 作为缓存键或防止意外修改
- **浅拷贝**: `s.copy()` 返回新集合（元素引用复制）
- **对包含可变对象的处理**: 元素若自身可变（不可放入）因此不存在深拷贝场景

## 11.6 使用场景与注意事项
- **使用场景**: 去重, 关系运算, 快速成员测试, 构建数学集合模型
- **性能优势**: 成员测试均摊 O(1); 大量重复元素清洗优势明显
- **顺序需求**: 需保序时使用列表或 `dict.fromkeys(lst)` 技巧
- **remove vs discard**: 使用 `discard` 避免显式存在性检查
- **更新陷阱**: 原地更新改变集合语义, 需要原值时先拷贝
- **迭代删除**: 不在迭代时修改集合结构, 使用生成式或构造新集合
- **哈希约束**: 不能放入可变容器类型（列表、字典、集合）
- **与列表比较**: 列表适合顺序与重复, 集合适合唯一性与集合代数
- **对称差集用途**: 找“仅在其中一个集合”的差异变化点
```python
# 去重并保序
def dedupe_ordered(seq):
    seen = set()
    return [x for x in seq if x not in seen and not seen.add(x)]

# 找变化元素
old = {"a","b","c"}
new = {"b","c","d","e"}
changed = old ^ new         # {'a','d','e'}
```

# 12 `if` 判断

## 12.1 基础语法与结构
```python
if cond:
    ...
elif other:
    ...
else:
    ...
```
- **单条件**: `if cond`
- **双分支**: `if ... else`
- **多分支**: `if ... elif ... else` 首个成立分支执行
- **内联表达式**: `a if cond else b`
- **嵌套控制**: 过深嵌套降低可读性, 用 `elif` / 提前返回优化
```python
age = 20
if age >= 18:
    print("成年人")
else:
    print("未成年人")

status = "成年人" if age >= 18 else "未成年人"
```

## 12.2 条件写法与运算符
- **比较**: `== != < > <= >=`
- **链式比较**: `12 <= age < 18` 等价 `age >= 12 and age < 18`
- **逻辑与**: `and` 全真才真
- **逻辑或**: `or` 一真即真
- **逻辑非**: `not cond`
- **成员/身份辅助**: `in`, `is` 常用于容器与单例 (`None`)
```python
score = 85
if score >= 90:
    lvl = "优秀"
elif score >= 75:
    lvl = "良好"
elif score >= 60:
    lvl = "及格"
else:
    lvl = "不及格"

age, has_id = 20, True
if age >= 18 and has_id:
    print("允许进入")
```

## 12.3 真值判断与常见模式
- **假值集合**: `0` `0.0` `""` `[]` `{}` `set()` `None` `False`
- **直接判断容器**: `if items:` 非空为真
- **默认值回退**: `value = user_input or "default"`
- **提前返回**: 减少嵌套层级
```python
my_list = [1,2,3]
if my_list:
    print("列表不为空")

def access(age, has_id):
    if age < 18:
        return "拒绝"
    if not has_id:
        return "需要证件"
    return "允许"
```

## 12.4 内联与可读性
- **三元表达式**: 简单条件赋值使用
- **复杂逻辑勿内联**: 超过一层逻辑或多函数调用拆开
- **嵌套三元替代**: 改为普通 if 或映射字典

## 12.5 常见注意与陷阱
- **比较 vs 赋值错误**: 使用 `==` 而非单 `=` (语法会报错但需保持意识)
- **误用 `is` 比较值**: 数值/字符串等用 `==`; `is` 仅用于 `None` / 单例
- **重复表达式**: 提取结果缓存 (可用海象 `if (n := len(items)) > 10:`)
- **布尔逻辑滥用**: 过度串联 `and`/`or` 难读, 拆分命名中间变量
- **分支覆盖不全**: 确保范围互斥且完整 (否则可能遗漏输出)
- **输入转换**: 用户输入需类型转换与异常处理 (`int()` 用 `try` 捕获)

## 12.6 综合示例
```python
def classify(age):
    if age < 12:
        return "儿童"
    elif age < 18:
        return "青少年"
    elif age < 65:
        return "成年人"
    return "老年人"

age = 20
label = classify(age)
print(label)
```
- **链式比较**: 第二与第三区间可写 `12 <= age < 18`, `18 <= age < 65`
- **提前返回**: 最后类别用直接返回代替 `else`

# 13 for循环

## 13.1 基础语法与迭代对象
```python
for item in iterable:
    ...
```
- **可迭代对象**: `list` `tuple` `str` `dict` `set` 以及生成器
- **遍历示例**:
```python
fruits = ["apple","banana","cherry"]
for fruit in fruits:
    print(fruit)
text = "Python"
for ch in text:
    print(ch)
d = {"name":"aini","age":23}
for k, v in d.items():
    print(k, v)
```
- **嵌套循环**: 用于二维结构
```python
matrix = [[1,2,3],[4,5,6],[7,8,9]]
for row in matrix:
    for n in row:
        print(n, end=" ")
```

## 13.2 数值与并行迭代模式
- **range**: `range(stop)` `range(start, stop)` `range(start, stop, step)` 左闭右开
    ```python
    for i in range(5): ...
    for i in range(2,7): ...
    for i in range(1,10,2): ...
    ```
- **enumerate**: 同取索引与值
    ```python
    for idx, fruit in enumerate(fruits):
        print(idx, fruit)
    ```
- **zip**: 并行聚合
    ```python
    names = ["aini","zhang","li"]
    ages = [23,25,30]
    for name, age in zip(names, ages):
        print(name, age)
    ```
- **解包技巧**: `for a, b, c in seq_of_tuples: ...`
- **高效索引需求**: 优先 `enumerate` 而非 `range(len(seq))`

## 13.3 推导式与 for-else
- **列表推导**: `[expr for x in iterable if cond]`
    ```python
    squares = [x*x for x in range(1,6)]
    evens = [x for x in range(10) if x % 2 == 0]
    ```
- **嵌套推导**: 展平二维 `[n for row in matrix for n in row]`
- **条件表达式嵌入**: `[x if x % 2==0 else -x for x in range(5)]`
- **for-else 机制**: `else` 在循环未被 `break` 正常结束后执行
    ```python
    nums = [1,2,3]
    for n in nums:
        if n == 4:
            break
    else:
        print("4 not found")
    ```
- **使用建议**: for-else 适合“搜索未找到”场景

## 13.4 注意事项与技巧
- **避免原地修改**: 不在迭代时删除列表元素, 用推导创建新列表
- **控制嵌套深度**: 多层循环拆分为函数或使用累积结构
- **提前退出**: 满足条件使用 `break` 缩短不必要迭代
- **成员测试优化**: 大量包含判断用 `set` 提升性能
- **缓存表达式**: 重复计算提取到局部变量或使用海象 `if (ln := len(seq)) > 10:`
- **字典遍历**: `for k in d` 等同 `for k in d.keys()`, 不必显式 `.keys()`
- **zip 长度不匹配**: 截断为最短序列, 需要填充用 `itertools.zip_longest`
- **推导式副作用**: 避免在推导中执行输出/写文件等副作用
- **不要滥用嵌套推导**: 复杂逻辑改为普通循环提升可读性

# 14 while循环

## 14.1 语法与执行模型
```python
while condition:
    # loop body
```
- **循环条件**: 每次迭代前评估条件为真继续为假停止
- **计数器模式**:
```python
count = 1
while count <= 5:
    print(count)
    count += 1
```
- **无限循环**: `while True:` 配合终止条件与 `break`
```python
while True:
    cmd = input("> ")
    if cmd == "exit":
        break
```

## 14.2 控制关键字与 while-else
```python
# break: 立即终止循环
# continue: 跳过当前剩余语句
count = 0
while count < 5:
    count += 1
    if count == 3:
        continue
    if count == 4:
        break
    print(count)   # 输出 1 2
```
- **break**: 提前结束不执行 `else`
- **continue**: 跳过本轮继续评估条件
- **while-else**:
```python
i = 1
while i <= 3:
    print(i)
    i += 1
else:
    print("循环正常结束")
```

## 14.3 常见模式与输入处理
- **输入验证循环**:
```python
while True:
    raw = input("数字或 exit: ")
    if raw == "exit":
        print("退出")
        break
    elif raw.isdigit():
        print(int(raw))
    else:
        print("无效输入")
```
- **嵌套循环**:
```python
outer = 1
while outer <= 3:
    inner = 1
    while inner <= 2:
        print(outer, inner)
        inner += 1
    outer += 1
```
- **计时/轮询**: `while True` + 睡眠与条件检查
- **条件推进**: 手动递增/递减变量驱动终止

## 14.4 注意事项与最佳实践
- **避免死循环**: 条件变量必须在循环体中变化
- **计数器更新**: 每轮维护递增递减防止逻辑卡住
- **break 使用**: 用于提前结束搜索型循环
- **continue 使用**: 用于跳过无需处理的分支减少嵌套
- **嵌套深度控制**: 超过两层考虑函数拆分或状态机
- **优先 for**: 当遍历明确序列或次数时更易读
- **海象运算符辅助**: `while (line := f.readline()): ...`
- **资源释放**: 结合 `with` 语句管理文件/连接
- **布尔判断**: 可直接 `while buffer:` 判断空非空
- **调试防护**: 临时添加最大迭代保护防失控

# 15 for循环和while循环比较

## 15.1 核心区别与语法对比
- **for**: 迭代可迭代对象元素或 `range` 生成的序列
- **while**: 基于条件持续执行直到条件为假
- **语法对比**:
    ```python
    for x in iterable: ...
    while condition: ...
    ```
- **确定次数**: 已知长度或范围优先 for
- **未知次数**: 条件驱动/事件循环优先 while

## 15.2 使用场景与替换
- **for 场景**: 遍历序列 字典迭代 索引枚举 列表推导 并行遍历 `zip`
- **while 场景**: 用户交互 输入验证 轮询 等待状态变化 无限服务主循环
- **可互换示例**:
    ```python
    for i in range(5): print(i)
    i = 0
    while i < 5:
        print(i)
        i += 1
    ```
- **模拟 while True via for**:
    ```python
    from itertools import cycle
    for _ in cycle([None]):
        if input("exit? ") == "exit":
            break
    ```

## 15.3 示例对比
- **遍历容器**:
    ```python
    fruits = ["apple","banana","cherry"]
    for f in fruits: print(f)

    i = 0
    while i < len(fruits):
        print(fruits[i])
        i += 1
    ```
- **条件循环 (输入退出)**:
    ```python
    while True:
        if input("exit? ") == "exit":
            break
    ```
- **for 固定上限 + break**:
    ```python
    for _ in range(100):
        if input("exit? ") == "exit":
            break
    ```

## 15.4 选择建议与陷阱
- **优先 for**: 明确序列/次数场景减少错误
- **选择 while**: 条件不确定或需持续监控状态
- **死循环风险**: while 更易遗漏条件更新
- **可读性**: for 结构紧凑; while 需关注条件维持变量
- **性能**: 二者循环开销相近 差异在迭代对象构造
- **成员测试优化**: for 中频繁 `in list` 改为先转 `set`
- **索引访问**: 用 `enumerate` 替代手动 `range(len(seq))`
- **嵌套控制**: 深层逻辑使用函数/生成器拆分
- **for-else / while-else**: 用于“未找到则执行补偿”逻辑
- **海象运算符**: 在条件或循环取值时减重复 `if (val := read()) is None: break`

# 16 函数

## 16.1 定义与调用
- **概念**: 函数是可复用的逻辑单元，接收参数返回结果，提升组织与可读性
- **语法**:
```python
def greet(name):
    """打印问候信息"""
    print(f"Hello, {name}!")
greet("Alice")
```
- **调用顺序**: 先定义后调用
- **空返回**: 未写 `return` 默认返回 `None`
- **推荐**: 保持单一职责

## 16.2 参数类型
```python
def demo(a, b=2, *args, **kwargs):
    pass
```
- **位置参数**: 按顺序传入 (`multiply(2,3)`)
- **默认参数**: 定义时绑定默认值; 避免使用可变对象作为默认值 (用 `None` 占位)
- **关键字参数**: 显式命名提高可读性 (`power(base=3, exponent=3)`)
- **可变位置参数**: `*args` 聚合额外位置参数为元组
- **可变关键字参数**: `**kwargs` 聚合额外命名参数为字典
- **参数解包**:
```python
def add(a,b): return a+b
pair = (3,5); print(add(*pair))
options = {"exponent":3}; print(pow(2, **options))
```
- **参数顺序规则**: 位置 → *args → 默认/关键字 → **kwargs
- **避免歧义**: 重要语义参数使用关键字传递

## 16.3 返回值与文档
```python
def divide(a,b):
    return a // b, a % b   # 多值返回 (元组)
q, r = divide(10,3)
```
- **单值返回**: `return value`
- **多值返回**: 逗号分隔 → 实为元组可解包
- **提前返回**: 降低嵌套层级
- **无返回**: 输出/过程性函数默认 `None`
- **文档字符串**:
```python
def power(x, exp=2):
    """计算 x 的 exp 次幂"""
    return x ** exp
```
- **查看文档**: `help(power)` / `power.__doc__`
- **建议**: 首行概述 + 参数说明 + 返回意义

## 16.4 作用域与变量
- **局部变量**: 函数内部定义仅内部可见
- **全局变量**: 模块级定义
- **`global`**: 函数内修改全局绑定
```python
counter = 0
def inc():
    global counter
    counter += 1
```
- **`nonlocal`**: 修改外层 (非全局) 闭包变量
```python
def outer():
    x = 0
    def inner():
        nonlocal x
        x += 1
        return x
    return inner
```
- **LEGB 查找**: Local → Enclosed → Global → Builtins
- **避免滥用**: 频繁 `global` 增加隐式耦合

## 16.5 高阶函数与闭包
- **高阶函数**: 接受函数或返回函数
```python
def apply(func, v): return func(v)
def square(n): return n*n
print(apply(square, 5))
```
- **闭包**: 内部函数捕获外层变量
```python
def make_tag(tag):
    def wrap(msg):
        return f"<{tag}>{msg}</{tag}>"
    return wrap
h1 = make_tag("h1")
print(h1("Title"))
```
- **用途**: 参数化行为 / 延迟执行 / 保存状态
- **替代**: 状态复杂用 `class` / `dataclass`

## 16.6 lambda 用法与限制（匿名函数）
```python
square = lambda x: x * x
squares = list(map(lambda n: n*n, [1,2,3]))
```
- **语法**: `lambda 参数: 表达式`
- **场景**: 排序键 / 轻量转换 / 过滤
```python
data = ["aini","bob","alex"]
print(sorted(data, key=lambda s: len(s)))
```
- **限制**: 单表达式不可包含赋值等语句
- **避免**: 复杂逻辑使用 `def`
- **可读性**: 过度嵌套降低维护性

## 16.7 常见注意与技巧
- **默认参数陷阱**: 不使用可变对象默认值
```python
def append_item(x, items=None):
    if items is None:
        items = []
    items.append(x)
    return items
```
- **参数顺序清晰**: 业务关键参数靠前
- **多值返回结构化**: 大量字段改用 `namedtuple` / `dataclass`
- **函数即对象**: 可放入字典做策略
```python
ops = {"add": lambda a,b: a+b, "mul": lambda a,b: a*b}
print(ops["add"](2,3))
```
- **纯函数优先**: 降低副作用便于测试
- **输入校验**: 非法参数早抛出异常
- **文档维护**: 修改实现同步更新 docstring
- **装饰器保留元数据**:
```python
import functools
def log(fn):
    @functools.wraps(fn)
    def wrapper(*a, **kw):
        print("call", fn.__name__)
        return fn(*a, **kw)
    return wrapper
```
- **性能微调**: 高频调用缓存外部引用为局部
- **职责分离**: 避免“巨型函数”处理多层逻辑

# 17 全局变量和局部变量

## 17.1 作用域概念与 LEGB
- **作用域**: 变量可被访问的范围 (Local 局部 → Enclosed 闭包 → Global 全局 → Builtins)
- **局部作用域**: 函数内部创建 仅函数执行期间有效
- **全局作用域**: 模块顶层定义 整个程序生命周期可访问
- **查找顺序**: 名称解析自内向外逐级查找 直至内置命名空间
```python
x = 5          # 全局
def outer():
    y = 10     # 局部 (outer)
    def inner():
        z = 15 # 局部 (inner)
        return x + y + z
    return inner()
```

## 17.2 局部变量与遮蔽
```python
x = 5
def f():
    x = 10      # 局部遮蔽全局 x
    print(x)    # 10
f()
print(x)        # 5
```
- **定义**: 在函数体内赋值即局部变量
- **生命周期**: 函数开始到结束
- **遮蔽**: 局部同名覆盖访问 优先级高于全局
- **不可访问**: 函数外访问局部变量触发 NameError
- **建议**: 避免与重要全局变量同名增加混淆

## 17.3 全局变量与 global
```python
count = 0
def inc():
    global count
    count += 1
inc(); inc()
print(count)  # 2
```
- **定义**: 模块顶层赋值
- **读取**: 函数内可直接读取
- **修改**: 需 `global var` 声明后赋值
- **未声明赋值**: 同名赋值会创建局部变量不改全局
```python
total = 100
def reset():
    total = 0     # 局部 不影响全局
reset()
print(total)      # 100
```
- **避免滥用 global**: 增加隐式共享状态降低可测性
- **替代**: 传参与返回值 / 使用对象封装状态

## 17.4 管理共享与避免副作用
- **配置集中**: 用字典/对象封装而非裸散全局变量
```python
config = {"debug": True, "retry": 3}
def use():
    if config["debug"]:
        print("Debug enabled")
```
- **只读常量**: 用命名约定全大写或 `MappingProxyType` 创建只读视图
```python
from types import MappingProxyType
SETTINGS = MappingProxyType({"TIMEOUT": 30})
```
- **闭包维护状态**:
```python
def counter():
    n = 0
    def inc():
        nonlocal n
        n += 1
        return n
    return inc
c = counter()
c(); c()  # 2
```
- **类封装**:
```python
class Bank:
    def __init__(self, balance=0):
        self.balance = balance
    def deposit(self, amt): self.balance += amt
```
- **不可变策略**: 返回新值而非在函数中修改全局 (纯函数风格)
- **命名规范**: 全局名称语义明确防冲突 (如 `APP_STATE`, `CACHE_STORE`)

## 17.5 常见注意与陷阱
- **默认局部赋值误判**: 未声明 `global` 时赋值不更新全局导致逻辑错误
- **调试困难**: 多函数修改同一全局使来源不明
- **线程并发**: 全局变量需加锁或使用原子结构防竞态
- **测试隔离**: 全局状态污染测试 用依赖注入或 fixture 重置
- **可读性下降**: 业务逻辑分散依赖隐藏的全局值
- **命名冲突**: 引入外部模块后顶层名称重合
- **循环中修改全局**: 热路径频繁写全局性能与可维护性差
- **性能误区**: 微优化使用局部引用 (局部访问更快) 不代表可忽视设计原则

## 17.6 综合示例与改进
```python
balance = 1000  # 可改进点: 使用类或闭包封装

def deposit(amt):
    global balance
    balance += amt
    return balance

def withdraw(amt):
    global balance
    if amt > balance:
        return "余额不足"
    balance -= amt
    return balance

print(deposit(500))
print(withdraw(200))

# 改进: 封装
class Account:
    def __init__(self, balance=1000):
        self._balance = balance
    def deposit(self, amt):
        self._balance += amt
    def withdraw(self, amt):
        if amt > self._balance:
            return False
        self._balance -= amt
        return True
    @property
    def balance(self):
        return self._balance

acct = Account()
acct.deposit(500)
acct.withdraw(200)
print(acct.balance)
```
- **问题**: 原始实现依赖多个 `global` 修改难追踪
- **改进**: 封装状态 提供明确接口 便于测试与扩展 (日志/权限/并发锁)

# 18 生成式

## 18.1 核心概念
- **定义**: 生成式是用紧凑语法从可迭代对象构造新数据结构的表达方式
- **类型覆盖**: 列表生成式 / 字典生成式 / 集合生成式 / 生成器表达式 (再转 `tuple()` 模拟“元组生成式”)
- **优势概述**: 简洁 / 可读性好 (在逻辑简单时) / 生成器惰性节省内存
- **使用原则**: 简单转换与过滤优先; 复杂嵌套逻辑改为普通循环提升可维护性

## 18.2 列表生成式
- **语法**: `[expr for x in iterable if cond]`
```python
squares = [x*x for x in range(1, 11)]
evens = [x for x in range(1, 21) if x % 2 == 0]
table = [i*j for i in range(1,4) for j in range(1,4)]          # 笛卡尔乘法表
mixed = [x if x % 2 == 0 else -x for x in range(5)]
flat = [n for row in [[1,2],[3,4]] for n in row]               # 展平二维
```
- **注意**: 多层 `for` 写在后部先外后内; 条件位于最后一个 `for` 之后
- **性能提示**: 列表生成式比等价 `for`+`append` 快 (减少方法查找与局部作用域开销)

## 18.3 字典与集合生成式
- **字典语法**: `{k_expr: v_expr for x in iterable if cond}`
```python
squares_dict = {x: x*x for x in range(1,6)}
parity = {x: ("偶数" if x % 2 == 0 else "奇数") for x in range(1,11)}
combined = {k: v for k, v in zip(["a","b","c"], [1,2,3])}
filtered_dict = {k: v for k, v in {"a":1,"b":None,"c":3}.items() if v is not None}
```
- **集合语法**: `{expr for x in iterable if cond}`
```python
unique_lengths = {len(w) for w in ["aa","bbb","aa","cccc"]}
evens_set = {x for x in range(1,21) if x % 2 == 0}
pairs = {(i,j) for i in range(2) for j in range(2)}            # 笛卡尔积集合
```
- **集合特性**: 自动去重; 不保序

## 18.4 生成器表达式与元组构造
- **生成器语法**: `(expr for x in iterable if cond)` 返回惰性迭代器
```python
gen = (x*x for x in range(1, 6))
first = next(gen)                    # 惰性取值
remaining = list(gen)                # 耗尽生成器
```
- **“元组生成式”**: 使用 `tuple(生成器表达式)`
```python
squares_tuple = tuple(x*x for x in range(1,11))
evens_tuple = tuple(x for x in range(1,21) if x % 2 == 0)
mult_table = tuple((i,j,i*j) for i in range(1,4) for j in range(1,4))
```
- **单次迭代**: 生成器只能消费一次; 需复用时显式存储结果
- **对比列表生成式**: 不立即占用全部内存, 适合大数据流

## 18.5 多重循环与顺序解析
- **顺序规则**: `[expr for a in A for b in B if cond]` 等价嵌套:
```python
result = []
for a in A:
    for b in B:
        if cond:
            result.append(expr)
```
- **建议**: 超过两层嵌套或含复杂条件时切换为普通循环
- **副作用警告**: 生成式中避免打印 / 写文件等副作用 (语义应为纯构造)

## 18.6 优缺点与实践建议
- **优点**: 简洁表达转换与过滤 / 生成器惰性节省内存 / 局部变量作用域小提升访问速度
- **缺点**: 逻辑复杂时难读 / 调试不便 (无法在中间插入断点或多行注释语义) / 生成器只能一次迭代
- **可读性策略**: 条件简单放尾部; 三元表达式适度使用; 复杂谓词提取为具名函数
- **命名与意图**: 使用清晰变量名 (`row`, `cell`, `item`) 提升理解
- **性能取舍**: 小规模数据差异不明显; 大量转换时生成器 + 分批消费更优
- **避免陷阱**: 不在生成器表达式里多次消费迭代器; 不依赖集合生成式顺序

## 18.7 快速模式对照
| 类型 | 语法示例 | 产物 | 是否惰性 | 适用场景 |
|------|----------|------|----------|----------|
| 列表 | `[f(x) for x in xs if cond]` | `list` | 否 | 中小规模立即使用 |
| 字典 | `{k(x): v(x) for x in xs}` | `dict` | 否 | 映射重组 |
| 集合 | `{f(x) for x in xs}` | `set` | 否 | 去重集合构造 |
| 生成器 | `(f(x) for x in xs)` | `generator` | 是 | 大数据流惰性处理 |
| 元组 (转换) | `tuple(f(x) for x in xs)` | `tuple` | 部分 (构造时遍历) | 只读序列快取 |

## 18.8 常见错误与改进
- **过度嵌套**: 改用显式循环提高可读性
- **遗漏括号**: 生成器作为参数需括号避免歧义 (`sum(x*x for x in xs)` 正确 不需外层 ())
- **重复消费生成器**: 第一次后为空; 需重新创建或缓存列表
- **变量名含糊**: 用语义化名称代替 `x`, `y` (除数学场景)
- **条件复杂难读**: 将复杂逻辑抽成函数 `def valid(x): ...` 再写 `[x for x in data if valid(x)]`
- **无意引用外层可变状态**: 闭包里引用循环变量需在 Python 版本/场景中谨慎 (迭代结束后值可能变化)

# 19 文件读写

## 19.1 打开文件与模式
```python
f = open("example.txt", "r", encoding="utf-8")
# ... 使用后 f.close()
```
- **open 基本形式**: `open(path, mode, encoding=..., errors=..., newline=...)`
- **常用模式**: `r` 只读 `w` 覆写创建 `a` 追加 `r+` 读写不清空 `w+` 覆写后可读 `a+` 追加并可读
- **二进制组合**: `rb` `wb` `ab` 等 (不做编码解码)
- **覆盖风险**: `w` 打开立即清空原内容
- **权限与存在**: 不存在时 `r` 抛 `FileNotFoundError`; 写模式自动创建
- **推荐路径处理**: 使用 `pathlib.Path` 提升跨平台安全
    ```python
    from pathlib import Path
    p = Path("data") / "log.txt"
    ```

## 19.2 读取方式比较
```python
with open("example.txt", "r", encoding="utf-8") as f:
    all_text = f.read()          # 整体读入 (大文件慎用)
with open("example.txt", "r", encoding="utf-8") as f:
    first_line = f.readline()
with open("example.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()        # 返回列表
with open("example.txt", "r", encoding="utf-8") as f:
    for line in f:               # 迭代更省内存
        process(line)
```
- **read()**: 读取全部内容
- **read(n)**: 读取指定字节数 (文本模式按字符)
- **readline()**: 逐行读取
- **readlines()**: 全部行列表 (占内存)
- **文件迭代**: `for line in f` 推荐处理大型文件
- **strip 清洗**: `line.rstrip("\n")`
- **内存控制**: 大文件分块 `f.read(BLOCK_SIZE)`

## 19.3 写入与追加
```python
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
with open("example.txt", "a", encoding="utf-8") as f:
    f.write("追加一行\n")
with open("example.txt", "w", encoding="utf-8") as f:
    f.writelines(["行1\n","行2\n"])
```
- **write(str)**: 写入字符串
- **writelines(list)**: 写入多个字符串 (不自动加换行)
- **追加模式**: `a` 在末尾加内容
- **同步写入**: 频繁写可用 `flush()` 或 `with` 自动关闭刷新
- **临时文件安全写**: 先写临时文件再原子替换
```python
import os, tempfile
with tempfile.NamedTemporaryFile("w", delete=False, encoding="utf-8") as tmp:
    tmp.write("新内容\n")
os.replace(tmp.name, "example.txt")
```

## 19.4 with 语句与资源管理
```python
with open("example.txt","r",encoding="utf-8") as f:
    data = f.read()
# 自动关闭
```
- **自动关闭**: 避免忘记 `close()`
- **异常安全**: 出现错误也确保释放资源
- **复合上下文**: `with open(...) as f1, open(...) as f2:`
- **编码声明**: 非 ASCII 内容显式 `encoding="utf-8"`

## 19.5 指针与随机访问
```python
with open("example.txt","r",encoding="utf-8") as f:
    pos1 = f.tell()
    f.read(5)
    pos2 = f.tell()
with open("example.txt","rb") as f:
    f.seek(10, 0)         # 从开头偏移
    f.seek(-5, 2)         # 从末尾反向偏移 (二进制常用)
```
- **tell()**: 返回当前位置
- **seek(offset, whence)**: 移动指针 (`whence`: 0 开头 1 当前位置 2 末尾)
- **文本模式 vs 二进制**: 跨平台换行差异, 精确字节操作用二进制
- **随机读取场景**: 索引文件、日志定位、二进制头解析

## 19.6 二进制读写
```python
with open("image.jpg","rb") as f:
    blob = f.read()
with open("copy.jpg","wb") as f:
    f.write(blob)
```
- **场景**: 图片 视频 音频 压缩包
- **不使用编码**: 二进制模式无字符解码
- **分块处理大文件**:
    ```python
    with open("big.bin","rb") as src, open("big_copy.bin","wb") as dst:
        while chunk := src.read(8192):
            dst.write(chunk)
    ```

## 19.7 常用文件操作
```python
import os, shutil
os.path.exists("example.txt")
os.remove("obsolete.txt")
os.rename("old.txt","new.txt")
shutil.copy("a.txt","b.txt")
shutil.move("b.txt","archive/b.txt")
```
- **路径拼接**: `os.path.join("data","file.txt")` / `Path("data")/"file.txt"`
- **存在判断**: `os.path.exists(path)` / `Path(path).exists()`
- **获取大小**: `os.path.getsize(path)` / `Path(path).stat().st_size`
- **目录创建**: `os.makedirs(path, exist_ok=True)` / `Path(path).mkdir(parents=True, exist_ok=True)`
- **高级操作**: `shutil.copytree` `shutil.rmtree`

## 19.8 常见问题与实践建议
- **忘记关闭文件**: 使用 `with`
- **编码错误**: 指定 `encoding="utf-8"` 避免默认差异
- **文件不存在**: 打开前使用存在性检查或捕获 `FileNotFoundError`
- **覆盖误操作**: 写前确认模式; 重要文件用备份或原子替换
- **权限异常**: 捕获 `PermissionError` 并提示用户
- **并发写冲突**: 使用文件锁 (如 `fcntl` / `portalocker`) 或队列串行写入
- **读取超大文件**: 流式分块/迭代行, 避免一次性加载
- **换行差异**: 跨平台处理时显式指定 `newline=""` 控制换行行为
- **缓冲策略**: 大量小写入可聚合到内存缓冲后批量写出
- **异常处理模板**:
    ```python
    try:
        with open("data.txt","r",encoding="utf-8") as f:
            for line in f:
                process(line)
    except FileNotFoundError:
        print("文件未找到")
    except UnicodeDecodeError:
        print("编码错误")
    ```

# 20 面向对象

## 20.1 核心概念
- **类 Class**: 定义对象结构与行为的蓝图
- **对象 Object**: 类的实例, 拥有独立状态
- **属性 Attribute**: 保存对象或类的状态 (实例属性/类属性)
- **方法 Method**: 绑定到类或实例的函数 (实例方法/类方法/静态方法)
```python
class Dog:
    species = "Canis lupus"      # 类属性
    def __init__(self, name, age):
        self.name = name         # 实例属性
        self.age = age
    def bark(self):              # 实例方法
        print(f"{self.name} woof")
d = Dog("Buddy", 3); d.bark()
```

## 20.2 构造与属性类型
- **构造函数 `__init__`**: 初始化实例状态
- **实例属性**: 每个对象独立 (`self.x`)
- **类属性**: 全部实例共享 (`ClassName.attr`)
- **访问优先级**: 实例字典中查找 → 类 → 父类
```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
b = Book("1984","Orwell")
```
- **可变类属性风险**: 共享容器可能被所有实例写入 修改需谨慎
```python
class CacheBad:
    data = []
    def add(self, v): self.data.append(v)  # 所有实例共享
```

## 20.3 方法类型与用途
- **实例方法**: 第一个参数 `self` 操作实例
- **类方法**: 使用 `@classmethod`, 第一个参数 `cls` 操作类级数据或替代构造
- **静态方法**: 使用 `@staticmethod`, 不接收隐式参数, 纯工具逻辑
```python
class Circle:
    pi = 3.14
    def __init__(self, r): self.r = r
    def area(self): return self.pi * self.r * self.r
    @classmethod
    def set_pi(cls, v): cls.pi = v
    @staticmethod
    def combine(a,b): return a + b
```

## 20.4 封装与私有化
- **封装目标**: 隐藏内部细节 通过受控接口暴露能力
- **私有属性命名**: 前缀双下划线 `__balance` 触发名称改写 `_ClassName__balance`
- **单下划线约定**: `_internal` 表示内部使用, 非强制
- **属性访问控制**: 使用 `@property` 提供只读或校验逻辑
```python
class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.__balance = balance
    def deposit(self, amt):
        if amt > 0: self.__balance += amt
    def get_balance(self): return self.__balance
```
```python
class User:
    def __init__(self, age): self._age = age
    @property
    def age(self): return self._age
    @age.setter
    def age(self, v):
        if v < 0: raise ValueError("age >= 0")
        self._age = v
```

## 20.5 继承与方法重写
- **继承**: 子类复用父类行为与结构
- **单继承/多继承**: Python 支持多继承 需理解 MRO (方法解析顺序)
- **方法重写**: 在子类中重新定义同名方法
- **`super()`**: 调用父类方法以扩展逻辑
```python
class Animal:
    def speak(self): print("Animal speaks")
class Dog(Animal):
    def speak(self): print("Dog barks")
class LoudDog(Dog):
    def speak(self):
        super().speak()
        print("Loud bark!")
```

## 20.6 多态与动态绑定
- **多态**: 同一接口 不同类型对象呈现不同实现
- **鸭子类型**: 不依赖显式继承 只要对象具备必要方法即可
    ```python
    class Cat:  def speak(self): print("Meow")
    class Robot: def speak(self): print("Beep")
    for obj in [Dog(), Cat(), Robot()]:
        obj.speak()
    ```
- **优势**: 减少类型分支 (`if type == ...`) 提升扩展性

## 20.7 抽象与协议
- **抽象类**: 使用 `abc.ABC` 与 `@abstractmethod` 定义必须实现接口
- **协议/结构子类型**: Python 侧重行为契约而非强制继承
```python
from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self): ...
class Square(Shape):
    def __init__(self, s): self.s = s
    def area(self): return self.s * self.s
```

## 20.8 组合优于继承
- **组合**: 对象内部持有其他对象以复用功能
- **适用**: 行为不构成“是一个”关系 而是“有一个”
    ```python
    class Engine:
        def start(self): print("Engine start")
    class Car:
        def __init__(self): self.engine = Engine()
        def drive(self):
            self.engine.start()
            print("Run")
    ```
- **优点**: 降低层级耦合 可替换组件

## 20.9 数据类与简化模型
- **`@dataclass`**: 自动生成 `__init__` `__repr__` `__eq__` 等
- **用途**: 纯数据载体减少样板代码
```python
from dataclasses import dataclass
@dataclass
class Point:
    x: int
    y: int
```
- **冻结**: `@dataclass(frozen=True)` 创建不可变实例

## 20.10 常见陷阱与注意
- **可变类属性**: 共享列表或字典导致交叉污染 → 放到实例或使用不可变类型
- **滥用继承**: 简单复用用组合 而不是建立脆弱层级
- **复杂多继承**: MRO 难理解 避免菱形层次 (钻石继承)
- **过度封装**: 不必为每个字段写冗余 getter/setter 属性访问已经简洁
- **循环依赖**: 相互导入类结构拆分为模块或延迟引入
- **`__init__` 里可变默认参数**: 使用 `None` 占位
- **私有属性误用**: 双下划线增加调试复杂度 仅在必要时使用
- **性能误区**: 过度创建小对象或频繁层层调用影响热路径, 可用函数或轻量结构
- **对象比较**: 自定义 `__eq__` 时建议同时定义 `__hash__` (保持不变性语义)

## 20.11 设计实践建议
- **单一责任**: 每个类聚焦一种明确职责
- **开放封闭**: 增加新行为通过扩展而非修改已有代码
- **依赖注入**: 将外部资源传入构造提升测试性与灵活度
- **清晰接口**: 公共方法即“契约”, 内部细节隐藏
- **命名清晰**: 类名用名词或名词短语 (如 `OrderService`)
- **轻量层级**: 避免 >3 的继承深度, 超过时考虑重构
- **测试优先**: 公共方法可独立测试 无需触达内部结构
- **类型注解**: 提升可读性与工具支持

## 20.12 综合示例
```python
from dataclasses import dataclass
from abc import ABC, abstractmethod

@dataclass(frozen=True)
class Money:
    amount: int
    currency: str = "CNY"

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, money: Money): ...

class Alipay(PaymentStrategy):
    def pay(self, money: Money):
        print(f"Alipay {money.amount}{money.currency}")

class WeChatPay(PaymentStrategy):
    def pay(self, money: Money):
        print(f"WeChat {money.amount}{money.currency}")

class Order:
    def __init__(self, total: Money, strategy: PaymentStrategy):
        self.total = total
        self.strategy = strategy
    def checkout(self):
        self.strategy.pay(self.total)

order = Order(Money(100), Alipay())
order.checkout()
order.strategy = WeChatPay()
order.checkout()
```
- **结构要点**: 数据类保存值，抽象策略接口 + 多态实现，组合注入策略以实现可替换

# 21 数据类型转换

## 21.1 概述与原则
- **定义**: 将一个对象按目标类型构造新对象的过程 (如 `int("12")` `list("abc")`)
- **内置族**: `int` `float` `str` `list` `tuple` `set` `dict`
- **基本原则**: 输入需满足目标类型可解析结构; 复杂转换可组合 `map` / 推导式 / 映射函数
- **副作用**: 转换产生新对象 (除可变容器之间引用复制场景)
- **幂等性**: 对已是目标类型的对象转换通常返回等价对象 (`list([...])` 生成浅拷贝)

## 21.2 常用函数与结构要求
| 函数 | 输入示例 | 说明与限制 |
|------|----------|-----------|
| `int(x)` | `"12"` `3.9` | 字符串必须是整数字面量或带符号; 浮点截断小数部分 |
| `float(x)` | `"3.14"` `5` | 字符串可含科学计数法 |
| `str(x)` | 任意对象 | 调用对象 `__str__` 或回退 `__repr__` |
| `list(x)` | `"abc"` `(1,2)` `set(...)` | 迭代展开为元素列表 |
| `tuple(x)` | 同上 | 不可变序列, 用于只读或键 |
| `set(x)` | `[1,1,2]` `"aba"` | 去重无序; 不保证原顺序 |
| `dict(x)` | `[("a",1),("b",2)]` | 需为键值对序列或映射对象 (`items()` 可迭代) |

## 21.3 数字与字符串转换
```python
int("42")          # 42
float("1.23e2")    # 123.0
str(456)           # "456"
int(3.9)           # 3  (截断)
float(5)           # 5.0
```
- **错误示例**: `int("3.14")` 抛 `ValueError`
- **安全解析**: 使用异常捕获或 `str.isdigit()` 初步过滤 (不支持负号/小数点完整检查)
```python
def to_int_safe(s):
    try:
        return int(s)
    except ValueError:
        return None
```

## 21.4 序列与字符串互转
```python
list("hello")              # ['h','e','l','l','o']
tuple("hi")                # ('h','i')
" ".join(["Python","is","fun"])   # "Python is fun"
"".join(('P','y','t','h','o','n'))# "Python"
```
- **批量字符串数字转换**:
```python
str_nums = ["10","20","30"]
int_nums = list(map(int, str_nums))  # [10,20,30]
```
- **混合类型合并**:
```python
data = [1,"apple",3.14]
combined = " | ".join(map(str, data))  # "1 | apple | 3.14"
```

## 21.5 列表 / 元组 / 集合互转
```python
fruits = ['apple','banana','cherry']
tuple_f = tuple(fruits)        # ('apple','banana','cherry')
set_f = set(fruits)            # {'apple','banana','cherry'}
list_from_set = list(set_f)    # 顺序不保证
```
- **去重保序技巧**:
```python
def dedupe_preserve(seq):
    seen = set()
    return [x for x in seq if not (x in seen or seen.add(x))]
```
- **集合丢失重复信息**: `[1,2,2,3] -> set -> {1,2,3}`

## 21.6 字典与结构转换
```python
person = {"name":"Alice","age":25}
keys = list(person.keys())             # ['name','age']
values = list(person.values())         # ['Alice',25]
pairs = list(person.items())           # [('name','Alice'),('age',25)]
items_list = [["name","Bob"],["age",30]]
d = dict(items_list)                   # {'name':'Bob','age':30}
items_tuple = (("name","Charlie"),("age",35))
dict(items_tuple)                      # {'name':'Charlie','age':35}
```
- **构造要求**: 输入元素必须是长度为 2 的可迭代 (键, 值)
- **键可哈希性**: 保证键满足哈希要求 (不可用列表/集合)

## 21.7 综合转换示例
```python
data = [["name","Alice"],["age",28],["city","NY"]]
data_dict = dict(data)
numbers = ["1","2","3","bad"]
parsed = [int(s) for s in numbers if s.isdigit()]
nested = [("x",1),("y",2)]
mapping = dict(nested)
```
- **批量安全策略**: 条件过滤 + 列表推导或包装函数

## 21.8 注意与陷阱
- **非数值字符串转换**: `int("hello")` 抛异常; 需验证或捕获
- **浮点精度与截断**: `int(3.9)` → 3 丢失小数; `float(0.1)` 精度误差后续比较谨慎
- **可变 vs 不可变**: 转换可能改变修改能力 (list ↔ tuple)
- **重复丢失**: 列表转集合去重不可逆恢复顺序
- **浅拷贝**: `list(existing_list)` 仅复制顶层引用 内部可变对象共享
- **性能考虑**: 大量转换使用生成器管道 (避免一次性构建中间大列表)
- **安全字典构造**: 校验二元组长度:
```python
def dict_safe(pairs):
    result = {}
    for p in pairs:
        if len(p) != 2:
            raise ValueError("Each item must be length 2")
        k, v = p
        result[k] = v
    return result
```
- **字符串拆分 vs 直接转换**: `"1,2,3".split(",")` → `map(int, parts)` 不可直接 `int("1,2,3")`
- **空结构**: `list("")` → `[]`, `set("")` → `set()` 可能与预期不符
- **嵌套结构转换**: 深层需递归处理 (如嵌套列表转元组)
