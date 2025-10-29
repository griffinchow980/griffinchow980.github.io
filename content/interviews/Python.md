---
title: "Python"
date: 2024-11-15
---

# Python数据结构

{{< details "**列表（List）的常用操作有哪些？**" "Python" >}}

列表是Python中最常用的数据结构之一，可变、有序、允许重复。

**创建列表**：

```python
# 空列表
lst = []
lst = list()

# 带初始值
lst = [1, 2, 3, 4, 5]
lst = list(range(1, 6))  # [1, 2, 3, 4, 5]

# 列表推导式
lst = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
```

**访问元素**：

{{< tabs "索引,切片,遍历" >}}

**索引访问**

```python
lst = [10, 20, 30, 40, 50]

# 正向索引（从0开始）
lst[0]   # 10
lst[2]   # 30

# 负向索引（从-1开始）
lst[-1]  # 50（最后一个）
lst[-2]  # 40（倒数第二个）

# 越界会报错
lst[10]  # IndexError
```

|||

**切片操作**

```python
lst = [10, 20, 30, 40, 50]

# 基本切片 [start:stop:step]
lst[1:4]    # [20, 30, 40]（包含start，不包含stop）
lst[:3]     # [10, 20, 30]（从头开始）
lst[2:]     # [30, 40, 50]（到尾结束）
lst[:]      # [10, 20, 30, 40, 50]（复制列表）

# 步长
lst[::2]    # [10, 30, 50]（每隔一个）
lst[1::2]   # [20, 40]

# 反转
lst[::-1]   # [50, 40, 30, 20, 10]

# 负索引切片
lst[-3:-1]  # [30, 40]
```

|||

**遍历列表**

```python
lst = ['a', 'b', 'c']

# 遍历元素
for item in lst:
    print(item)

# 遍历索引和元素
for i, item in enumerate(lst):
    print(f"{i}: {item}")

# 遍历多个列表
lst2 = [1, 2, 3]
for x, y in zip(lst, lst2):
    print(x, y)
```

{{< /tabs >}}

**修改列表**：

```python
lst = [1, 2, 3]

# 添加元素
lst.append(4)        # [1, 2, 3, 4]（末尾添加）
lst.insert(1, 99)    # [1, 99, 2, 3, 4]（指定位置插入）
lst.extend([5, 6])   # [1, 99, 2, 3, 4, 5, 6]（批量添加）
lst += [7, 8]        # 同extend

# 删除元素
lst.remove(99)       # [1, 2, 3, 4, 5, 6, 7, 8]（删除首个值为99的元素）
item = lst.pop()     # 删除并返回最后一个元素
item = lst.pop(0)    # 删除并返回索引0的元素
del lst[0]           # 删除索引0的元素
lst.clear()          # 清空列表

# 修改元素
lst[0] = 100         # 单个修改
lst[1:3] = [200, 300]  # 批量修改
```

**列表常用方法**：

```python
lst = [3, 1, 4, 1, 5, 9, 2, 6]

# 查找
lst.index(4)         # 2（返回首个值为4的索引）
lst.count(1)         # 2（统计1出现的次数）
4 in lst             # True（判断是否存在）

# 排序
lst.sort()           # [1, 1, 2, 3, 4, 5, 6, 9]（原地排序）
lst.sort(reverse=True)  # 降序
sorted_lst = sorted(lst)  # 返回新列表，不改变原列表

# 反转
lst.reverse()        # 原地反转
reversed_lst = lst[::-1]  # 返回新列表

# 其他
len(lst)             # 长度
max(lst)             # 最大值
min(lst)             # 最小值
sum(lst)             # 求和
```

**列表推导式（高级）**：

```python
# 基本形式
[表达式 for 变量 in 可迭代对象]

# 示例
[x**2 for x in range(5)]  # [0, 1, 4, 9, 16]

# 带条件
[x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]

# 多重循环
[(x, y) for x in range(3) for y in range(2)]
# [(0, 0), (0, 1), (1, 0), (1, 1), (2, 0), (2, 1)]

# 嵌套列表推导式
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
[item for row in matrix for item in row]  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

{{< admonition type="tip" title="列表使用技巧" collapse="false" >}}

1. **列表复制**：
   ```python
   # 浅拷贝
   new_lst = lst.copy()
   new_lst = lst[:]
   new_lst = list(lst)
   
   # 深拷贝（嵌套列表）
   import copy
   new_lst = copy.deepcopy(lst)
   ```

2. **列表去重**：
   ```python
   lst = [1, 2, 2, 3, 3, 3]
   unique_lst = list(set(lst))  # 无序
   unique_lst = list(dict.fromkeys(lst))  # 保持顺序
   ```

3. **列表拼接**：
   ```python
   lst1 + lst2  # 创建新列表
   lst1.extend(lst2)  # 修改lst1
   ```

{{< /admonition >}}

{{< /details >}}

{{< details "**字典（Dict）的常用操作有哪些？**" "Python" >}}

字典是键值对的集合，可变、无序（Python 3.7+保持插入顺序）、键唯一。

**创建字典**：

```python
# 空字典
d = {}
d = dict()

# 带初始值
d = {'name': 'Alice', 'age': 25, 'city': 'Beijing'}

# 使用dict()函数
d = dict(name='Alice', age=25)
d = dict([('name', 'Alice'), ('age', 25)])

# 字典推导式
d = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

**访问与修改**：

{{< tabs "基本操作,安全访问,更新" >}}

**基本操作**

```python
d = {'name': 'Alice', 'age': 25}

# 访问
d['name']        # 'Alice'
d['city']        # KeyError（键不存在会报错）

# 修改
d['age'] = 26    # 修改已有键
d['city'] = 'Shanghai'  # 添加新键

# 删除
del d['age']     # 删除键值对
value = d.pop('name')  # 删除并返回值
d.pop('city', None)  # 键不存在时返回默认值
d.clear()        # 清空字典
```

|||

**安全访问**

```python
d = {'name': 'Alice'}

# get方法（推荐）
d.get('name')         # 'Alice'
d.get('age')          # None（键不存在返回None）
d.get('age', 0)       # 0（自定义默认值）

# setdefault
d.setdefault('age', 25)  # 键不存在时设置并返回
d.setdefault('name', 'Bob')  # 键存在时返回原值

# defaultdict（需要import）
from collections import defaultdict
d = defaultdict(int)  # 默认值为0
d['count'] += 1  # 不需要初始化
```

|||

**批量更新**

```python
d1 = {'a': 1, 'b': 2}
d2 = {'b': 3, 'c': 4}

# update方法
d1.update(d2)  # {'a': 1, 'b': 3, 'c': 4}（d2覆盖d1）

# 字典解包（Python 3.9+）
d3 = {**d1, **d2}

# 合并运算符（Python 3.9+）
d3 = d1 | d2
```

{{< /tabs >}}

**字典常用方法**：

```python
d = {'name': 'Alice', 'age': 25, 'city': 'Beijing'}

# 获取所有键
keys = d.keys()      # dict_keys(['name', 'age', 'city'])
keys_list = list(d.keys())

# 获取所有值
values = d.values()  # dict_values(['Alice', 25, 'Beijing'])

# 获取所有键值对
items = d.items()    # dict_items([('name', 'Alice'), ...])

# 遍历
for key in d:
    print(key, d[key])

for key, value in d.items():
    print(key, value)

# 判断键是否存在
'name' in d          # True
'email' in d         # False

# 复制
d2 = d.copy()        # 浅拷贝
```

**字典推导式**：

```python
# 基本形式
{key_expr: value_expr for 变量 in 可迭代对象}

# 示例
{x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 带条件
{x: x**2 for x in range(10) if x % 2 == 0}

# 交换键值
d = {'a': 1, 'b': 2, 'c': 3}
{v: k for k, v in d.items()}  # {1: 'a', 2: 'b', 3: 'c'}

# 从两个列表创建字典
keys = ['name', 'age', 'city']
values = ['Alice', 25, 'Beijing']
d = {k: v for k, v in zip(keys, values)}
```

**常见应用场景**：

```python
# 1. 计数
from collections import Counter
lst = ['a', 'b', 'a', 'c', 'b', 'a']
count = Counter(lst)  # Counter({'a': 3, 'b': 2, 'c': 1})

# 手动实现
count = {}
for item in lst:
    count[item] = count.get(item, 0) + 1

# 2. 分组
from collections import defaultdict
students = [
    {'name': 'Alice', 'class': 'A'},
    {'name': 'Bob', 'class': 'B'},
    {'name': 'Charlie', 'class': 'A'}
]

groups = defaultdict(list)
for student in students:
    groups[student['class']].append(student['name'])
# {'A': ['Alice', 'Charlie'], 'B': ['Bob']}

# 3. 缓存/记忆化
cache = {}
def fib(n):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib(n-1) + fib(n-2)
    return cache[n]
```

{{< admonition type="warning" title="字典使用注意事项" collapse="false" >}}

1. **键的要求**：
   - 必须是不可变类型（str, int, tuple等）
   - list, dict不能作为键
   ```python
   d = {[1, 2]: 'value'}  # TypeError
   d = {(1, 2): 'value'}  # OK
   ```

2. **字典是无序的**（Python 3.6-）：
   - Python 3.7+ 保持插入顺序
   - 但不应依赖顺序，需要顺序用OrderedDict

3. **遍历时不要修改**：
   ```python
   # 错误
   for key in d:
       if some_condition:
           del d[key]  # RuntimeError
   
   # 正确
   keys_to_delete = [k for k in d if some_condition]
   for key in keys_to_delete:
       del d[key]
   ```

{{< /admonition >}}

{{< /details >}}

{{< details "**元组（Tuple）和集合（Set）有什么特点？**" "Python" >}}

元组和集合是Python中两种重要的数据结构，各有不同的特点和应用场景。

**特点对比**：

| 特性 | 元组（Tuple） | 集合（Set） |
|------|-------------|------------|
| **可变性** | 不可变 | 可变 |
| **有序性** | 有序（保持插入顺序） | 无序（不保证顺序） |
| **重复元素** | 允许重复 | 元素唯一（自动去重） |
| **索引访问** | 支持（`t[0]`） | 不支持 |
| **可哈希** | 可作为字典键 | 不可作为字典键 |
| **性能** | 访问快 | 查找快（O(1)） |
| **内存** | 占用少 | 占用多（哈希表） |
| **语法** | `(1, 2, 3)` | `{1, 2, 3}` |

**元组（Tuple）详解**：

{{< tabs "元组基础,元组操作,应用场景" >}}

**元组基础**

```python
# 创建元组
t = ()                # 空元组
t = (1,)              # 单元素元组（注意逗号）
t = (1, 2, 3)
t = 1, 2, 3           # 可以省略括号
t = tuple([1, 2, 3])  # 从列表创建

# 访问
t[0]                  # 第一个元素
t[-1]                 # 最后一个元素
t[1:3]                # 切片，返回新元组

# 不可修改
t[0] = 100            # TypeError（不可修改）
```

|||

**元组操作**

```python
t = (1, 2, 3, 2, 1)

# 基本操作
len(t)                # 5
2 in t                # True
t.count(2)            # 2（统计出现次数）
t.index(3)            # 2（返回首次出现的索引）

# 拼接
t1 = (1, 2)
t2 = (3, 4)
t3 = t1 + t2          # (1, 2, 3, 4)

# 重复
t = (1, 2) * 3        # (1, 2, 1, 2, 1, 2)

# 解包
a, b, c = (1, 2, 3)   # a=1, b=2, c=3
a, *b, c = (1, 2, 3, 4, 5)  # a=1, b=[2,3,4], c=5

# 交换变量
a, b = b, a
```

|||

**应用场景**

1. **函数返回多个值**：
```python
def get_stats(data):
    return len(data), sum(data), sum(data)/len(data)

count, total, avg = get_stats([1, 2, 3, 4, 5])
```

2. **作为字典的键**：
```python
# 列表不能作为键，元组可以
d = {(1, 2): 'point1', (3, 4): 'point2'}
```

3. **保护数据不被修改**：
```python
config = ('localhost', 8080, 'utf-8')  # 配置不可变
```

4. **namedtuple（命名元组）**：
```python
from collections import namedtuple

Point = namedtuple('Point', ['x', 'y'])
p = Point(1, 2)
print(p.x, p.y)  # 1 2（可以用属性访问）
```

{{< /tabs >}}

**集合（Set）详解**：

{{< tabs "集合基础,集合操作,应用场景" >}}

**集合基础**

```python
# 创建集合
s = set()             # 空集合（不能用{}，那是空字典）
s = {1, 2, 3}
s = set([1, 2, 3, 2, 1])  # {1, 2, 3}（自动去重）

# 添加元素
s.add(4)              # {1, 2, 3, 4}
s.update([5, 6])      # {1, 2, 3, 4, 5, 6}
s.update({7, 8}, [9])  # 可以多个可迭代对象

# 删除元素
s.remove(1)           # 删除元素（不存在会报错）
s.discard(1)          # 删除元素（不存在不报错）
elem = s.pop()        # 随机删除并返回一个元素
s.clear()             # 清空集合
```

|||

**集合运算**

```python
s1 = {1, 2, 3, 4}
s2 = {3, 4, 5, 6}

# 并集
s1 | s2               # {1, 2, 3, 4, 5, 6}
s1.union(s2)

# 交集
s1 & s2               # {3, 4}
s1.intersection(s2)

# 差集
s1 - s2               # {1, 2}（在s1但不在s2）
s1.difference(s2)

# 对称差集
s1 ^ s2               # {1, 2, 5, 6}（在s1或s2但不同时在）
s1.symmetric_difference(s2)

# 子集和超集
{1, 2} <= {1, 2, 3}   # True（子集）
{1, 2, 3} >= {1, 2}   # True（超集）
```

|||

**应用场景**

1. **去重**：
```python
lst = [1, 2, 2, 3, 3, 3]
unique_lst = list(set(lst))
```

2. **成员检测**（比列表快）：
```python
# O(1) 时间复杂度
if item in large_set:  # 很快
    pass

if item in large_list:  # 较慢
    pass
```

3. **集合运算**：
```python
# 找出两组用户的交集、差集
active_users = {1, 2, 3, 4, 5}
paid_users = {3, 4, 5, 6, 7}

# 活跃且付费的用户
active_and_paid = active_users & paid_users  # {3, 4, 5}

# 活跃但未付费的用户
active_not_paid = active_users - paid_users  # {1, 2}
```

4. **frozenset（不可变集合）**：
```python
fs = frozenset([1, 2, 3])
# 可以作为字典的键或集合的元素
d = {fs: 'value'}
```

{{< /tabs >}}

**元组vs列表，集合vs列表对比**：

| 特性 | 列表 | 元组 | 集合 |
|------|------|------|------|
| 可变性 | 可变 | 不可变 | 可变 |
| 有序性 | 有序 | 有序 | 无序 |
| 重复元素 | 允许 | 允许 | 不允许 |
| 索引访问 | 支持 | 支持 | 不支持 |
| 性能 | 一般 | 稍快 | 查找快 |
| 内存 | 较大 | 较小 | 中等 |
| 作为字典键 | 不可以 | 可以 | 不可以 |

{{< /details >}}

# Python核心特性

{{< details "**什么是Lambda表达式？怎么用？有什么应用场景？**" "Python" >}}

Lambda是Python中的匿名函数，用于创建简单的、一次性使用的函数。

**基本语法**：

```python
lambda 参数: 表达式
```

特点：
- 只能包含一个表达式（不能有语句）
- 自动返回表达式的值
- 通常用于简单的功能

**基础用法**：

{{< tabs "基本示例,与普通函数对比,作为参数" >}}

**基本示例**

```python
# lambda函数
square = lambda x: x**2
print(square(5))  # 25

# 等价的普通函数
def square(x):
    return x**2

# 多个参数
add = lambda x, y: x + y
print(add(3, 4))  # 7

# 默认参数
greet = lambda name="World": f"Hello, {name}!"
print(greet())  # Hello, World!
print(greet("Alice"))  # Hello, Alice!

# 条件表达式
max_val = lambda a, b: a if a > b else b
print(max_val(3, 5))  # 5
```

|||

**与普通函数对比**

```python
# 普通函数 - 适合复杂逻辑
def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result

# Lambda - 适合简单操作
double = lambda x: x * 2
is_positive = lambda x: x > 0
```

何时用Lambda：
- 函数逻辑简单（一行）
- 函数只用一次
- 作为参数传递

何时用普通函数：
- 逻辑复杂（多行）
- 需要重复使用
- 需要文档字符串

|||

**作为参数传递**

```python
# 排序
students = [
    {'name': 'Alice', 'age': 25, 'score': 85},
    {'name': 'Bob', 'age': 22, 'score': 92},
    {'name': 'Charlie', 'age': 23, 'score': 78}
]

# 按年龄排序
sorted_by_age = sorted(students, key=lambda x: x['age'])

# 按成绩降序
sorted_by_score = sorted(students, 
                         key=lambda x: x['score'], 
                         reverse=True)

# 按多个条件（年龄升序，成绩降序）
sorted_multi = sorted(students, 
                      key=lambda x: (x['age'], -x['score']))
```

{{< /tabs >}}

**常见应用场景**：

**1. 配合map()使用**：

```python
# 对列表每个元素应用函数
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
# [1, 4, 9, 16, 25]

# 多个列表
a = [1, 2, 3]
b = [4, 5, 6]
result = list(map(lambda x, y: x + y, a, b))
# [5, 7, 9]
```

**2. 配合filter()使用**：

```python
# 筛选符合条件的元素
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even = list(filter(lambda x: x % 2 == 0, numbers))
# [2, 4, 6, 8, 10]

# 筛选数据
students = [
    {'name': 'Alice', 'score': 85},
    {'name': 'Bob', 'score': 92},
    {'name': 'Charlie', 'score': 78}
]
passed = list(filter(lambda x: x['score'] >= 80, students))
```

**3. 配合sorted()使用**：

```python
# 自定义排序规则
words = ['apple', 'Banana', 'cherry', 'Date']

# 按长度排序
sorted(words, key=lambda x: len(x))

# 忽略大小写排序
sorted(words, key=lambda x: x.lower())

# 复杂对象排序
data = [(1, 'b'), (2, 'a'), (1, 'a')]
sorted(data, key=lambda x: (x[0], x[1]))
```

**4. 配合pandas使用**：

```python
import pandas as pd

df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 22, 23],
    'salary': [5000, 6000, 5500]
})

# apply + lambda
df['age_group'] = df['age'].apply(lambda x: '20-25' if x <= 25 else '25+')

# 多列计算
df['bonus'] = df.apply(lambda row: row['salary'] * 0.1 if row['age'] > 23 else 0, axis=1)

# map替换值
df['name'] = df['name'].map(lambda x: x.upper())
```

**5. 条件判断**：

```python
# 条件表达式
status = lambda score: 'Pass' if score >= 60 else 'Fail'
print(status(75))  # Pass

# 多条件
grade = lambda score: 'A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'D'
print(grade(85))  # B
```

{{< admonition type="tip" title="Lambda最佳实践" collapse="false" >}}

**推荐用法**：
```python
# 1. 作为参数，简单转换
sorted(data, key=lambda x: x['value'])
list(map(lambda x: x*2, numbers))

# 2. 简单的一次性函数
df['category'] = df['age'].apply(lambda x: 'adult' if x >= 18 else 'minor')
```

**不推荐用法**：
```python
# 1. 赋值给变量（不如用def）
square = lambda x: x**2  # 不好
def square(x): return x**2  # 更好

# 2. 复杂逻辑
# 不好
complex = lambda x: x**2 if x > 0 else -x**2 if x < 0 else 0

# 更好
def complex(x):
    if x > 0:
        return x**2
    elif x < 0:
        return -x**2
    else:
        return 0

# 3. 多行逻辑（lambda不支持）
```

**记住**：Lambda的目的是简洁，如果不够简洁，就用普通函数。

{{< /admonition >}}

{{< /details >}}

{{< details "**字符串的常用操作有哪些？**" "Python" >}}

字符串是Python中最常用的数据类型之一，不可变、有序。

**字符串创建**：

```python
# 单引号、双引号、三引号
s = 'Hello'
s = "Hello"
s = '''多行
字符串'''

# 原始字符串（转义符不生效）
s = r'C:\new\test'  # 不会解析\n为换行

# 格式化字符串
name = 'Alice'
age = 25
s = f'My name is {name}, I am {age} years old'
s = 'My name is {}, I am {} years old'.format(name, age)
s = 'My name is %s, I am %d years old' % (name, age)
```

**字符串操作**：

{{< tabs "查找与判断,切片与拼接,大小写转换,分割与连接" >}}

**查找与判断**

```python
s = 'Hello, World!'

# 查找
s.find('World')       # 7（返回首次出现的索引，不存在返回-1）
s.index('World')      # 7（不存在会报错）
s.rfind('o')          # 8（从右开始查找）
s.count('l')          # 3（统计出现次数）

# 判断
s.startswith('Hello') # True
s.endswith('!')       # True
'World' in s          # True

# 类型判断
'123'.isdigit()       # True（全是数字）
'abc'.isalpha()       # True（全是字母）
'abc123'.isalnum()    # True（字母或数字）
'   '.isspace()       # True（全是空白字符）
'Hello'.isupper()     # False
'hello'.islower()     # True
```

|||

**切片与拼接**

```python
s = 'Hello, World!'

# 切片
s[0:5]                # 'Hello'
s[:5]                 # 'Hello'
s[7:]                 # 'World!'
s[::2]                # 'Hlo ol!'（步长为2）
s[::-1]               # '!dlroW ,olleH'（反转）

# 拼接
'Hello' + ' ' + 'World'  # 'Hello World'
' '.join(['Hello', 'World'])  # 'Hello World'
'Hello' * 3           # 'HelloHelloHello'

# 效率对比
# 不推荐（多次拼接）
s = ''
for word in words:
    s += word  # 每次创建新字符串

# 推荐
s = ''.join(words)  # 一次性拼接
```

|||

**大小写转换**

```python
s = 'Hello, World!'

s.upper()             # 'HELLO, WORLD!'
s.lower()             # 'hello, world!'
s.capitalize()        # 'Hello, world!'（首字母大写）
s.title()             # 'Hello, World!'（每个单词首字母大写）
s.swapcase()          # 'hELLO, wORLD!'（大小写互换）
```

|||

**分割与连接**

```python
s = 'apple,banana,cherry'

# 分割
s.split(',')          # ['apple', 'banana', 'cherry']
s.split(',', 1)       # ['apple', 'banana,cherry']（最多分割1次）

# 按行分割
text = 'line1\nline2\nline3'
text.splitlines()     # ['line1', 'line2', 'line3']

# 分割保留分隔符
s.partition(',')      # ('apple', ',', 'banana,cherry')
s.rpartition(',')     # ('apple,banana', ',', 'cherry')

# 连接
','.join(['a', 'b', 'c'])  # 'a,b,c'
' - '.join(['2024', '10', '29'])  # '2024 - 10 - 29'
```

{{< /tabs >}}

**字符串清理与替换**：

```python
s = '  Hello, World!  '

# 去除空白
s.strip()             # 'Hello, World!'（去除两端）
s.lstrip()            # 'Hello, World!  '（去除左边）
s.rstrip()            # '  Hello, World!'（去除右边）
s.strip('!')          # '  Hello, World  '（去除指定字符）

# 替换
s = 'Hello, World!'
s.replace('World', 'Python')  # 'Hello, Python!'
s.replace('l', 'L', 2)  # 'HeLLo, World!'（最多替换2次）

# 正则替换
import re
s = 'abc123def456'
re.sub(r'\d+', 'X', s)  # 'abcXdefX'（数字替换为X）
```

**字符串对齐与填充**：

```python
s = 'Hello'

# 对齐
s.ljust(10)           # 'Hello     '（左对齐，宽度10）
s.rjust(10)           # '     Hello'（右对齐）
s.center(10)          # '  Hello   '（居中）
s.center(10, '-')     # '--Hello---'（用-填充）

# 补零
'42'.zfill(5)         # '00042'
'-42'.zfill(5)        # '-0042'
```

**字符串编码**：

```python
# Unicode字符串 → 字节
s = '你好'
b = s.encode('utf-8')        # b'\xe4\xbd\xa0\xe5\xa5\xbd'
b = s.encode('gbk')

# 字节 → Unicode字符串
s = b.decode('utf-8')        # '你好'
```

**实用示例**：

```python
# 1. 清洗数据
text = '  Hello,   World!  \n'
clean = ' '.join(text.split())  # 'Hello, World!'（去除多余空白）

# 2. 提取数字
s = 'Total: $1,234.56'
import re
numbers = re.findall(r'\d+', s)  # ['1', '234', '56']
amount = float(s.replace('$', '').replace(',', '').split()[-1])  # 1234.56

# 3. 验证格式
email = 'user@example.com'
if '@' in email and '.' in email.split('@')[-1]:
    print('Valid email')

# 4. 生成slug
title = 'Hello World: Python Programming!'
slug = '-'.join(title.lower().split()).strip('!:')  # 'hello-world-python-programming'

# 5. 文本对齐（表格）
data = [['Name', 'Age', 'City'], 
        ['Alice', '25', 'Beijing'],
        ['Bob', '22', 'Shanghai']]

for row in data:
    print(' | '.join(item.ljust(10) for item in row))
```

{{< admonition type="warning" title="字符串使用注意事项" collapse="false" >}}

1. **字符串是不可变的**：
   ```python
   s = 'Hello'
   s[0] = 'h'  # TypeError（不能修改）
   s = 'h' + s[1:]  # 创建新字符串
   ```

2. **大量拼接用join**：
   ```python
   # 不好（慢）
   result = ''
   for i in range(10000):
       result += str(i)
   
   # 好（快）
   result = ''.join(str(i) for i in range(10000))
   ```

3. **注意编码**：
   ```python
   # 读取文件指定编码
   with open('file.txt', encoding='utf-8') as f:
       content = f.read()
   ```

{{< /admonition >}}

{{< /details >}}

{{< details "**什么是面向对象？类和实例的关系？**" "Python" >}}

面向对象编程（OOP）是一种编程范式，将数据和操作数据的方法封装在一起，形成"对象"。

**核心概念**：

- **类（Class）**：对象的模板/蓝图，定义了对象的属性和方法
- **对象/实例（Object/Instance）**：类的具体实现，一个类可以创建多个对象
- **属性（Attribute）**：对象的数据
- **方法（Method）**：对象的行为/功能

**类和实例的关系**：

```python
# 类是模板
class Dog:
    pass

# 实例是根据模板创建的具体对象
dog1 = Dog()  # 第一只狗
dog2 = Dog()  # 第二只狗

# dog1和dog2是两个不同的对象
print(dog1 is dog2)  # False
```

**基本语法**：

{{< tabs "定义类,实例化,属性和方法,特殊方法" >}}

**定义类**

```python
class Person:
    # 类属性（所有实例共享）
    species = 'Human'
    
    # 构造方法（初始化）
    def __init__(self, name, age):
        # 实例属性（每个实例独有）
        self.name = name
        self.age = age
    
    # 实例方法
    def greet(self):
        return f"Hello, I'm {self.name}"
    
    # 类方法（操作类属性）
    @classmethod
    def get_species(cls):
        return cls.species
    
    # 静态方法（与类/实例无关的工具方法）
    @staticmethod
    def is_adult(age):
        return age >= 18
```

|||

**实例化对象**

```python
# 创建实例
alice = Person('Alice', 25)
bob = Person('Bob', 17)

# 访问属性
print(alice.name)     # Alice
print(alice.age)      # 25
print(alice.species)  # Human

# 调用方法
print(alice.greet())  # Hello, I'm Alice

# 类方法
print(Person.get_species())  # Human

# 静态方法
print(Person.is_adult(20))   # True
print(alice.is_adult(15))    # False（也可以通过实例调用）
```

|||

**属性和方法**

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance  # _表示内部使用（约定）
    
    # Getter方法
    def get_balance(self):
        return self._balance
    
    # 业务方法
    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            return True
        return False
    
    def withdraw(self, amount):
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False
    
    # property装饰器（将方法变为属性）
    @property
    def balance(self):
        return self._balance
    
    @balance.setter
    def balance(self, value):
        if value >= 0:
            self._balance = value

# 使用
account = BankAccount('Alice', 1000)
account.deposit(500)
print(account.balance)  # 1500（通过property访问）
account.balance = 2000  # 通过setter修改
```

|||

**特殊方法（魔法方法）**

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # 字符串表示
    def __str__(self):
        return f'Vector({self.x}, {self.y})'
    
    def __repr__(self):
        return f'Vector({self.x}, {self.y})'
    
    # 运算符重载
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    # 长度
    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)

# 使用
v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1)           # Vector(1, 2)
v3 = v1 + v2        # Vector(4, 6)
print(v1 == v2)     # False
print(len(v1))      # 2
```

{{< /tabs >}}

**面向对象的三大特性**：

**1. 封装（Encapsulation）**：

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.__score = score  # __表示私有（name mangling）
    
    def get_score(self):
        return self.__score
    
    def set_score(self, score):
        if 0 <= score <= 100:
            self.__score = score
        else:
            raise ValueError('Score must be 0-100')

s = Student('Alice', 85)
print(s.get_score())  # 85
# print(s.__score)    # AttributeError（无法直接访问）
s.set_score(90)       # OK
```

**2. 继承（Inheritance）**：

```python
# 父类
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

# 子类继承父类
class Dog(Animal):
    def speak(self):
        return f'{self.name} says Woof!'

class Cat(Animal):
    def speak(self):
        return f'{self.name} says Meow!'

# 使用
dog = Dog('Buddy')
cat = Cat('Kitty')
print(dog.speak())  # Buddy says Woof!
print(cat.speak())  # Kitty says Meow!

# isinstance检查
print(isinstance(dog, Dog))     # True
print(isinstance(dog, Animal))  # True
```

**3. 多态（Polymorphism）**：

```python
# 不同对象调用相同方法，表现不同行为
def animal_speak(animal):
    print(animal.speak())

dog = Dog('Buddy')
cat = Cat('Kitty')

animal_speak(dog)  # Buddy says Woof!
animal_speak(cat)  # Kitty says Meow!
```

**实际应用示例**：

```python
# 数据分析中的应用
class DataProcessor:
    def __init__(self, data):
        self.data = data
        self.cleaned_data = None
    
    def load_data(self, filepath):
        import pandas as pd
        self.data = pd.read_csv(filepath)
        return self
    
    def clean_data(self):
        # 数据清洗逻辑
        self.cleaned_data = self.data.dropna()
        return self
    
    def analyze(self):
        # 分析逻辑
        return self.cleaned_data.describe()
    
    def save_result(self, filepath):
        self.cleaned_data.to_csv(filepath, index=False)
        return self

# 链式调用
processor = DataProcessor(None)
result = (processor
          .load_data('data.csv')
          .clean_data()
          .analyze())
```

{{< admonition type="tip" title="面向对象使用建议" collapse="false" >}}

**何时使用OOP**：
- 需要封装数据和行为
- 代码需要复用（继承）
- 需要维护状态
- 建模真实世界的对象

**何时不用OOP**：
- 简单脚本
- 数据处理管道（可以用函数式编程）
- 性能敏感场景（OOP有开销）

**Python的OOP特点**：
- 一切皆对象（包括函数、类本身）
- 支持多继承
- 动态语言，运行时可以修改类
- Duck Typing：关注行为而非类型

{{< /admonition >}}

{{< /details >}}

# Python实战场景

{{< details "**如何处理大文件读取避免内存溢出？**" "Python" >}}

在数据分析中经常遇到几GB甚至更大的数据文件，一次性读取会导致内存不足。

**场景**：处理一个5GB的日志文件，提取包含"ERROR"的行。

{{< tabs "分块读取,生成器方式,pandas分块,itertools处理" >}}

**分块读取文本文件**

```python
def process_large_file(filepath, chunk_size=1024*1024):
    """
    分块读取大文件
    chunk_size: 每次读取的字节数，默认1MB
    """
    error_lines = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            
            # 处理每个chunk
            lines = chunk.split('\n')
            for line in lines:
                if 'ERROR' in line:
                    error_lines.append(line)
    
    return error_lines

# 使用示例
errors = process_large_file('large_log.txt')
```

|||

**生成器逐行读取**

```python
def read_large_file(filepath):
    """
    使用生成器逐行读取，内存占用恒定
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:  # 文件对象本身就是迭代器
            yield line.strip()

def process_errors(filepath):
    """
    处理错误日志
    """
    error_count = 0
    error_types = {}
    
    for line in read_large_file(filepath):
        if 'ERROR' in line:
            error_count += 1
            # 统计错误类型
            error_type = line.split(':')[0] if ':' in line else 'Unknown'
            error_types[error_type] = error_types.get(error_type, 0) + 1
    
    return error_count, error_types

# 使用示例
count, types = process_errors('large_log.txt')
print(f"总错误数: {count}")
print(f"错误类型分布: {types}")
```

|||

**Pandas分块读取CSV**

```python
import pandas as pd

def process_large_csv(filepath, chunksize=10000):
    """
    分块处理大型CSV文件
    chunksize: 每块的行数
    """
    # 初始化统计变量
    total_revenue = 0
    user_count = 0
    
    # 分块读取
    for chunk in pd.read_csv(filepath, chunksize=chunksize):
        # 处理每个chunk
        total_revenue += chunk['revenue'].sum()
        user_count += chunk['user_id'].nunique()
        
        # 可以在这里做筛选、聚合等操作
        high_value = chunk[chunk['revenue'] > 1000]
        # 保存高价值用户到新文件
        high_value.to_csv('high_value_users.csv', 
                         mode='a',  # 追加模式
                         header=False, 
                         index=False)
    
    return total_revenue, user_count

# 使用示例
revenue, users = process_large_csv('large_data.csv')
print(f"总收入: {revenue}, 用户数: {users}")
```

|||

**使用itertools高效处理**

```python
from itertools import islice

def batch_process(filepath, batch_size=1000):
    """
    批量处理文件，适合需要批量提交的场景
    """
    with open(filepath, 'r') as f:
        while True:
            # 每次取batch_size行
            batch = list(islice(f, batch_size))
            if not batch:
                break
            
            # 批量处理这些行
            process_batch(batch)

def process_batch(lines):
    """处理一批数据"""
    # 批量插入数据库、批量API调用等
    pass

# 使用示例
batch_process('large_log.txt', batch_size=1000)
```

{{< /tabs >}}

**最佳实践总结**：

1. **文本文件**：使用文件迭代器逐行读取，内存占用最小
2. **CSV文件**：使用pandas的chunksize参数分块处理
3. **需要批处理**：使用itertools.islice按批次读取
4. **复杂数据处理**：考虑使用Dask或Vaex等专门处理大数据的库

{{< admonition type="warning" title="注意事项" >}}
- 分块大小要根据可用内存和处理速度权衡
- 跨chunk的数据（如被分割的行）需要特殊处理
- 使用生成器时注意只能迭代一次
{{< /admonition >}}

{{< /details >}}

{{< details "**如何处理API请求的重试和异常？**" "Python" >}}

在数据采集场景中，API请求经常会因为网络波动、服务端限流等原因失败，需要实现重试机制。

**场景**：从第三方API获取用户数据，需要处理各种异常情况。

{{< tabs "基础重试,装饰器实现,requests库重试,tenacity库" >}}

**基础重试逻辑**

```python
import time
import requests
from requests.exceptions import RequestException

def fetch_data_with_retry(url, max_retries=3, delay=1):
    """
    带重试的API请求
    """
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # 检查HTTP错误
            return response.json()
        
        except requests.exceptions.Timeout:
            print(f"请求超时，第{attempt + 1}次重试...")
            if attempt < max_retries - 1:
                time.sleep(delay * (attempt + 1))  # 指数退避
            else:
                raise
        
        except requests.exceptions.HTTPError as e:
            # 处理HTTP错误
            if response.status_code == 429:  # 限流
                print(f"触发限流，等待{delay * 2}秒...")
                time.sleep(delay * 2)
            elif response.status_code >= 500:  # 服务器错误，重试
                print(f"服务器错误，第{attempt + 1}次重试...")
                time.sleep(delay)
            else:  # 客户端错误，不重试
                raise
        
        except RequestException as e:
            print(f"请求异常: {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
            else:
                raise
    
    return None

# 使用示例
data = fetch_data_with_retry('https://api.example.com/users')
```

|||

**装饰器实现重试**

```python
import functools
import time

def retry(max_attempts=3, delay=1, backoff=2, exceptions=(Exception,)):
    """
    重试装饰器
    max_attempts: 最大尝试次数
    delay: 初始延迟时间
    backoff: 退避系数
    exceptions: 需要重试的异常类型
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            current_delay = delay
            
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    attempts += 1
                    if attempts >= max_attempts:
                        print(f"达到最大重试次数({max_attempts})，放弃")
                        raise
                    
                    print(f"第{attempts}次失败: {e}，{current_delay}秒后重试...")
                    time.sleep(current_delay)
                    current_delay *= backoff  # 指数退避
        
        return wrapper
    return decorator

# 使用装饰器
@retry(max_attempts=3, delay=1, backoff=2, 
       exceptions=(requests.exceptions.RequestException,))
def fetch_user_data(user_id):
    """获取用户数据"""
    response = requests.get(f'https://api.example.com/users/{user_id}')
    response.raise_for_status()
    return response.json()

# 调用
user = fetch_user_data(123)
```

|||

**使用requests的Session和适配器**

```python
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def create_retry_session(
    retries=3,
    backoff_factor=0.3,
    status_forcelist=(500, 502, 504),
):
    """
    创建带重试机制的session
    """
    session = requests.Session()
    
    retry_strategy = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
        allowed_methods=["HEAD", "GET", "OPTIONS", "POST"]
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    return session

# 使用示例
session = create_retry_session()

def fetch_batch_data(user_ids):
    """批量获取用户数据"""
    results = []
    for user_id in user_ids:
        try:
            response = session.get(
                f'https://api.example.com/users/{user_id}',
                timeout=5
            )
            response.raise_for_status()
            results.append(response.json())
        except Exception as e:
            print(f"获取用户{user_id}失败: {e}")
            results.append(None)
    
    return results
```

|||

**使用tenacity库（推荐）**

```python
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type
)
import requests

@retry(
    stop=stop_after_attempt(3),  # 最多3次
    wait=wait_exponential(multiplier=1, min=2, max=10),  # 指数退避
    retry=retry_if_exception_type(requests.exceptions.RequestException)
)
def fetch_api_data(url):
    """使用tenacity的重试装饰器"""
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()

# 更复杂的场景
from tenacity import retry_if_result

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry=retry_if_result(lambda x: x is None)  # 结果为None时重试
)
def fetch_data_until_success(url):
    """持续重试直到获取到有效数据"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data and 'result' in data:
                return data['result']
    except Exception as e:
        print(f"请求失败: {e}")
    
    return None  # 返回None会触发重试
```

{{< /tabs >}}

**实战建议**：

1. **根据HTTP状态码决定是否重试**：
   - 4xx（客户端错误）通常不应重试
   - 5xx（服务器错误）和超时应该重试
   - 429（限流）需要增加等待时间

2. **使用指数退避**：避免瞬间大量请求冲击服务器

3. **记录日志**：重试过程和失败原因要记录

4. **设置超时**：避免请求无限等待

{{< /details >}}

{{< details "**如何实现数据清洗的流水线？**" "Python" >}}

数据分析项目中，数据清洗是必不可少的环节。如何优雅地实现一个可复用的清洗流程？

**场景**：清洗用户行为数据，包括去重、填充缺失值、格式转换、异常值处理等。

```python
import pandas as pd
import numpy as np
from typing import Callable, List

class DataCleaningPipeline:
    """数据清洗流水线"""
    
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.original_shape = data.shape
        self.steps = []
    
    def add_step(self, name: str, func: Callable, **kwargs):
        """添加清洗步骤"""
        self.steps.append((name, func, kwargs))
        return self
    
    def execute(self):
        """执行所有步骤"""
        print(f"原始数据: {self.original_shape}")
        
        for step_name, func, kwargs in self.steps:
            print(f"\n执行步骤: {step_name}")
            before = len(self.data)
            
            self.data = func(self.data, **kwargs)
            
            after = len(self.data)
            print(f"  处理前: {before}行, 处理后: {after}行")
            
            if before != after:
                print(f"  删除: {before - after}行")
        
        print(f"\n最终数据: {self.data.shape}")
        return self.data
    
    def get_summary(self):
        """获取清洗摘要"""
        return {
            'original_shape': self.original_shape,
            'final_shape': self.data.shape,
            'steps': [step[0] for step in self.steps]
        }

# 定义清洗函数
def remove_duplicates(df, subset=None):
    """去除重复值"""
    return df.drop_duplicates(subset=subset, keep='first')

def fill_missing_values(df, strategy='mean', columns=None):
    """填充缺失值"""
    df = df.copy()
    if columns is None:
        columns = df.select_dtypes(include=[np.number]).columns
    
    for col in columns:
        if strategy == 'mean':
            df[col].fillna(df[col].mean(), inplace=True)
        elif strategy == 'median':
            df[col].fillna(df[col].median(), inplace=True)
        elif strategy == 'mode':
            df[col].fillna(df[col].mode()[0], inplace=True)
        elif strategy == 'forward':
            df[col].fillna(method='ffill', inplace=True)
    
    return df

def remove_outliers(df, columns, method='iqr', threshold=1.5):
    """移除异常值"""
    df = df.copy()
    
    for col in columns:
        if method == 'iqr':
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - threshold * IQR
            upper = Q3 + threshold * IQR
            df = df[(df[col] >= lower) & (df[col] <= upper)]
        
        elif method == 'zscore':
            z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
            df = df[z_scores < threshold]
    
    return df

def convert_types(df, conversions):
    """转换数据类型"""
    df = df.copy()
    for col, dtype in conversions.items():
        df[col] = df[col].astype(dtype)
    return df

def filter_rows(df, condition):
    """按条件筛选行"""
    return df[condition(df)]

def transform_columns(df, transformations):
    """转换列数据"""
    df = df.copy()
    for col, func in transformations.items():
        df[col] = df[col].apply(func)
    return df

# 使用示例
# 创建示例数据
data = pd.DataFrame({
    'user_id': [1, 2, 2, 3, 4, 5],  # 有重复
    'age': [25, 30, 30, None, 35, 200],  # 有缺失和异常值
    'income': [5000, 6000, 6000, 7000, None, 8000],
    'registration_date': ['2023-01-01', '2023-01-02', '2023-01-02', 
                          '2023-01-03', '2023-01-04', '2023-01-05']
})

# 构建清洗流水线
pipeline = DataCleaningPipeline(data)

pipeline.add_step(
    '去除重复',
    remove_duplicates,
    subset=['user_id']
).add_step(
    '填充缺失值',
    fill_missing_values,
    strategy='median',
    columns=['age', 'income']
).add_step(
    '移除异常值',
    remove_outliers,
    columns=['age'],
    method='iqr'
).add_step(
    '类型转换',
    convert_types,
    conversions={'registration_date': 'datetime64'}
).add_step(
    '筛选有效用户',
    filter_rows,
    condition=lambda df: (df['age'] >= 18) & (df['age'] <= 100)
)

# 执行清洗
cleaned_data = pipeline.execute()

# 获取摘要
summary = pipeline.get_summary()
print(f"\n清洗摘要: {summary}")
```

**输出示例**：
```
原始数据: (6, 4)

执行步骤: 去除重复
  处理前: 6行, 处理后: 5行
  删除: 1行

执行步骤: 填充缺失值
  处理前: 5行, 处理后: 5行

执行步骤: 移除异常值
  处理前: 5行, 处理后: 4行
  删除: 1行

执行步骤: 类型转换
  处理前: 4行, 处理后: 4行

执行步骤: 筛选有效用户
  处理前: 4行, 处理后: 4行

最终数据: (4, 4)

清洗摘要: {
    'original_shape': (6, 4), 
    'final_shape': (4, 4), 
    'steps': ['去除重复', '填充缺失值', '移除异常值', '类型转换', '筛选有效用户']
}
```

**优势**：
1. **可复用**：定义一次，多处使用
2. **可追踪**：记录每一步的处理结果
3. **易维护**：添加、删除、修改步骤都很方便
4. **链式调用**：代码清晰易读

{{< /details >}}

{{< details "**如何优化Python代码性能？**" "Python" >}}

在处理大数据量时，Python代码的性能优化至关重要。

**场景**：优化一个用户行为统计函数，提升10倍以上性能。

{{< tabs "列表推导式,NumPy优化,Pandas向量化,Cython加速" >}}

**使用列表推导式代替循环**

```python
import time

# 慢速版本：普通循环
def slow_filter(data, threshold):
    result = []
    for item in data:
        if item > threshold:
            result.append(item * 2)
    return result

# 快速版本：列表推导式
def fast_filter(data, threshold):
    return [item * 2 for item in data if item > threshold]

# 性能对比
data = list(range(1000000))

start = time.time()
result1 = slow_filter(data, 500000)
print(f"普通循环: {time.time() - start:.4f}秒")

start = time.time()
result2 = fast_filter(data, 500000)
print(f"列表推导式: {time.time() - start:.4f}秒")

# 典型输出：
# 普通循环: 0.1234秒
# 列表推导式: 0.0567秒  # 快2倍
```

|||

**使用NumPy向量化**

```python
import numpy as np

# 慢速版本：Python循环
def python_calculate(data):
    result = []
    for x in data:
        result.append(x ** 2 + 2 * x + 1)
    return result

# 快速版本：NumPy向量化
def numpy_calculate(data):
    arr = np.array(data)
    return arr ** 2 + 2 * arr + 1

# 性能对比
data = list(range(1000000))

start = time.time()
result1 = python_calculate(data)
print(f"Python循环: {time.time() - start:.4f}秒")

start = time.time()
result2 = numpy_calculate(data)
print(f"NumPy向量化: {time.time() - start:.4f}秒")

# 典型输出：
# Python循环: 0.2345秒
# NumPy向量化: 0.0123秒  # 快20倍！

# 实际案例：计算用户活跃度
def calculate_user_activity_slow(df):
    """慢速版本：遍历DataFrame"""
    activity_scores = []
    for idx, row in df.iterrows():
        score = (row['login_days'] * 0.3 + 
                row['purchase_count'] * 0.5 + 
                row['review_count'] * 0.2)
        activity_scores.append(score)
    return activity_scores

def calculate_user_activity_fast(df):
    """快速版本：向量化操作"""
    return (df['login_days'] * 0.3 + 
            df['purchase_count'] * 0.5 + 
            df['review_count'] * 0.2)

# 性能差异可达100倍以上！
```

|||

**Pandas避免apply，使用向量化**

```python
import pandas as pd

# 创建测试数据
df = pd.DataFrame({
    'price': np.random.randint(10, 1000, 100000),
    'quantity': np.random.randint(1, 100, 100000)
})

# 慢速版本：使用apply
def slow_calculate_total(df):
    def calc(row):
        return row['price'] * row['quantity'] * 1.1  # 加10%税
    return df.apply(calc, axis=1)

# 快速版本：向量化
def fast_calculate_total(df):
    return df['price'] * df['quantity'] * 1.1

start = time.time()
result1 = slow_calculate_total(df)
print(f"apply方式: {time.time() - start:.4f}秒")

start = time.time()
result2 = fast_calculate_total(df)
print(f"向量化: {time.time() - start:.4f}秒")

# 典型输出：
# apply方式: 2.3456秒
# 向量化: 0.0123秒  # 快190倍！

# 使用where/mask进行条件赋值
# 慢速版本
def slow_categorize(df):
    def categorize(price):
        if price < 100:
            return '低'
        elif price < 500:
            return '中'
        else:
            return '高'
    return df['price'].apply(categorize)

# 快速版本
def fast_categorize(df):
    return pd.cut(df['price'], 
                  bins=[0, 100, 500, float('inf')],
                  labels=['低', '中', '高'])
```

|||

**使用局部变量和缓存**

```python
# 优化前：频繁访问属性和全局变量
class SlowProcessor:
    def __init__(self):
        self.threshold = 100
        self.multiplier = 1.5
    
    def process(self, data):
        result = []
        for item in data:
            # 每次循环都要查找self.threshold
            if item > self.threshold:
                result.append(item * self.multiplier)
        return result

# 优化后：使用局部变量
class FastProcessor:
    def __init__(self):
        self.threshold = 100
        self.multiplier = 1.5
    
    def process(self, data):
        # 局部变量访问更快
        threshold = self.threshold
        multiplier = self.multiplier
        result = []
        append = result.append  # 缓存方法引用
        
        for item in data:
            if item > threshold:
                append(item * multiplier)
        return result

# 使用functools.lru_cache缓存结果
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_calculation(n):
    """耗时计算，结果会被缓存"""
    return sum(i ** 2 for i in range(n))

# 第一次调用：慢
result1 = expensive_calculation(10000)

# 第二次调用相同参数：快（从缓存取）
result2 = expensive_calculation(10000)
```

{{< /tabs >}}

**性能优化检查清单**：

✅ **使用合适的数据结构**
- 查找操作用`set`或`dict`（O(1)）而不是`list`（O(n)）
- 需要频繁插入删除用`collections.deque`

✅ **避免不必要的拷贝**
- 使用切片视图而不是复制
- 大对象传递使用引用

✅ **使用生成器节省内存**
- 处理大数据时用生成器表达式而不是列表推导式

✅ **批量操作**
- 数据库批量插入而不是逐条插入
- 批量API请求

✅ **使用内置函数和库**
- `sum()`, `max()`, `min()`等内置函数比循环快
- NumPy、Pandas的向量化操作

{{< admonition type="tip" title="性能分析工具" >}}
```python
# 使用cProfile分析性能瓶颈
import cProfile
import pstats

profiler = cProfile.Profile()
profiler.enable()

# 运行你的代码
your_function()

profiler.disable()
stats = pstats.Stats(profiler)
stats.sort_stats('cumulative')
stats.print_stats(10)  # 打印最慢的10个函数
```
{{< /admonition >}}

{{< /details >}}

{{< details "**如何实现多线程/多进程数据处理？**" "Python" >}}

处理大量数据时，合理使用并发可以大幅提升效率。

**多线程 vs 多进程对比**：

| 特性 | 多线程（Threading） | 多进程（Multiprocessing） |
|------|-------------------|------------------------|
| **适用场景** | IO密集型（网络请求、文件读写） | CPU密集型（计算、数据处理） |
| **GIL影响** | 受GIL限制，无法真正并行 | 独立进程，不受GIL限制 |
| **内存** | 共享内存，占用小 | 独立内存，占用大 |
| **通信** | 简单（共享变量） | 复杂（需要进程间通信） |
| **启动速度** | 快 | 慢（需要fork进程） |
| **资源开销** | 小 | 大 |
| **数据安全** | 需要加锁 | 天然隔离，更安全 |
| **使用模块** | `threading` | `multiprocessing` |
| **典型案例** | 爬虫、API请求、文件上传 | 图像处理、数据分析、科学计算 |

**场景**：批量下载用户头像、处理大量文件、并行计算等。

{{< tabs "多线程,多进程,线程池,进程池" >}}

**多线程 - 适合IO密集型任务**

```python
import threading
import requests
import time

def download_image(url, save_path):
    """下载单个图片"""
    try:
        response = requests.get(url, timeout=10)
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"下载完成: {save_path}")
    except Exception as e:
        print(f"下载失败 {url}: {e}")

# 方法1：手动创建线程
def download_images_threading(url_list):
    """多线程下载图片"""
    threads = []
    
    for idx, url in enumerate(url_list):
        save_path = f"image_{idx}.jpg"
        thread = threading.Thread(
            target=download_image,
            args=(url, save_path)
        )
        threads.append(thread)
        thread.start()
    
    # 等待所有线程完成
    for thread in threads:
        thread.join()
    
    print("所有下载完成")

# 使用示例
urls = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    # ... 更多URL
]

start = time.time()
download_images_threading(urls)
print(f"总耗时: {time.time() - start:.2f}秒")
```

|||

**多进程 - 适合CPU密集型任务**

```python
import multiprocessing as mp
import numpy as np

def calculate_stats(data_chunk):
    """计算统计信息（CPU密集型）"""
    return {
        'mean': np.mean(data_chunk),
        'std': np.std(data_chunk),
        'min': np.min(data_chunk),
        'max': np.max(data_chunk)
    }

def parallel_calculate(data, num_processes=4):
    """多进程并行计算"""
    # 分割数据
    chunk_size = len(data) // num_processes
    chunks = [
        data[i:i+chunk_size] 
        for i in range(0, len(data), chunk_size)
    ]
    
    # 创建进程池
    with mp.Pool(processes=num_processes) as pool:
        results = pool.map(calculate_stats, chunks)
    
    return results

# 使用示例
if __name__ == '__main__':
    # 生成大量数据
    data = np.random.randn(10000000)
    
    start = time.time()
    results = parallel_calculate(data, num_processes=4)
    print(f"多进程耗时: {time.time() - start:.2f}秒")
    
    # 单进程对比
    start = time.time()
    result_single = calculate_stats(data)
    print(f"单进程耗时: {time.time() - start:.2f}秒")
```

|||

**线程池 - 更优雅的线程管理**

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

def fetch_user_data(user_id):
    """获取单个用户数据"""
    try:
        response = requests.get(
            f'https://api.example.com/users/{user_id}',
            timeout=5
        )
        return user_id, response.json()
    except Exception as e:
        return user_id, None

def batch_fetch_users(user_ids, max_workers=10):
    """批量获取用户数据"""
    results = {}
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # 提交所有任务
        future_to_id = {
            executor.submit(fetch_user_data, uid): uid 
            for uid in user_ids
        }
        
        # 处理完成的任务
        for future in as_completed(future_to_id):
            user_id, data = future.result()
            results[user_id] = data
            print(f"完成: {user_id}")
    
    return results

# 使用示例
user_ids = list(range(1, 101))  # 100个用户
results = batch_fetch_users(user_ids, max_workers=20)

# 带进度显示
from tqdm import tqdm

def batch_fetch_with_progress(user_ids, max_workers=10):
    """带进度条的批量获取"""
    results = {}
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # 使用tqdm包装as_completed
        futures = {
            executor.submit(fetch_user_data, uid): uid 
            for uid in user_ids
        }
        
        for future in tqdm(as_completed(futures), total=len(user_ids)):
            user_id, data = future.result()
            results[user_id] = data
    
    return results
```

|||

**进程池 - 数据处理任务**

```python
from concurrent.futures import ProcessPoolExecutor
import pandas as pd

def process_file(filepath):
    """处理单个文件"""
    df = pd.read_csv(filepath)
    
    # 数据清洗和统计
    cleaned = df.dropna()
    stats = {
        'file': filepath,
        'total_rows': len(df),
        'valid_rows': len(cleaned),
        'revenue_sum': cleaned['revenue'].sum() if 'revenue' in cleaned else 0
    }
    
    return stats

def process_multiple_files(file_list, max_workers=None):
    """并行处理多个文件"""
    if max_workers is None:
        max_workers = mp.cpu_count()
    
    results = []
    
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        # map会按顺序返回结果
        results = list(executor.map(process_file, file_list))
    
    return results

# 使用示例
files = ['data1.csv', 'data2.csv', 'data3.csv', 'data4.csv']
results = process_multiple_files(files, max_workers=4)

# 汇总结果
total_revenue = sum(r['revenue_sum'] for r in results)
print(f"总收入: {total_revenue}")
```

{{< /tabs >}}

**选择指南**：

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 网络请求、文件IO | 多线程 / 线程池 | GIL不影响IO操作 |
| 大量计算 | 多进程 / 进程池 | 绕过GIL限制 |
| 简单任务 | `ThreadPoolExecutor` | API简单，易用 |
| 复杂任务 | `ProcessPoolExecutor` | 独立内存空间 |

{{< admonition type="warning" title="注意事项" >}}
1. **线程不适合CPU密集型**：Python的GIL限制多线程CPU性能
2. **进程开销大**：创建进程比线程慢，适合长时间任务
3. **共享数据需要同步**：使用Lock、Queue等同步机制
4. **注意资源限制**：同时打开的文件数、网络连接数有上限
{{< /admonition >}}

{{< /details >}}

{{< details "**如何实现数据去重的不同策略？**" "Python" >}}

数据去重是数据清洗的常见需求，不同场景需要不同策略。

**场景**：用户行为日志去重、订单数据去重等。

```python
import pandas as pd
import hashlib

# 示例数据
data = pd.DataFrame({
    'user_id': [1, 1, 2, 2, 3, 4, 4],
    'action': ['login', 'login', 'purchase', 'purchase', 'logout', 'login', 'login'],
    'timestamp': ['2024-01-01 10:00', '2024-01-01 10:00', 
                  '2024-01-01 10:05', '2024-01-01 10:06',
                  '2024-01-01 10:10', '2024-01-01 10:15', '2024-01-01 10:15'],
    'amount': [None, None, 100, 100, None, None, None]
})

# 策略1：完全相同的行去重
def remove_exact_duplicates(df):
    """移除完全相同的行"""
    return df.drop_duplicates()

# 策略2：基于特定列去重
def remove_by_columns(df, subset):
    """基于指定列去重"""
    # keep='first' 保留第一次出现的
    # keep='last' 保留最后一次出现的
    # keep=False 删除所有重复的
    return df.drop_duplicates(subset=subset, keep='first')

# 策略3：基于时间窗口去重（短时间内的重复点击）
def remove_by_time_window(df, time_col, window='1s'):
    """移除时间窗口内的重复"""
    df[time_col] = pd.to_datetime(df[time_col])
    df = df.sort_values(time_col)
    
    # 计算时间差
    df['time_diff'] = df.groupby('user_id')[time_col].diff()
    
    # 保留第一条和时间差大于窗口的记录
    mask = (df['time_diff'].isna()) | (df['time_diff'] > pd.Timedelta(window))
    result = df[mask].drop('time_diff', axis=1)
    
    return result

# 策略4：自定义逻辑去重（保留金额大的）
def remove_by_custom_logic(df):
    """自定义去重逻辑"""
    def keep_best(group):
        # 如果有金额，保留金额最大的
        if group['amount'].notna().any():
            return group.loc[group['amount'].idxmax()]
        else:
            return group.iloc[0]
    
    return df.groupby(['user_id', 'action'], as_index=False).apply(keep_best)

# 策略5：基于内容哈希去重（文本数据）
def remove_by_content_hash(df, text_column):
    """基于内容哈希去重"""
    def hash_text(text):
        return hashlib.md5(str(text).encode()).hexdigest()
    
    df['content_hash'] = df[text_column].apply(hash_text)
    df = df.drop_duplicates(subset=['content_hash'])
    df = df.drop('content_hash', axis=1)
    
    return df

# 策略6：保留最新数据
def keep_latest(df, id_col, time_col):
    """保留每个ID的最新记录"""
    df[time_col] = pd.to_datetime(df[time_col])
    return df.sort_values(time_col).groupby(id_col).tail(1)

# 使用示例
print("原始数据:")
print(data)

print("\n完全去重:")
print(remove_exact_duplicates(data))

print("\n基于user_id和action去重:")
print(remove_by_columns(data, subset=['user_id', 'action']))

print("\n时间窗口去重:")
print(remove_by_time_window(data.copy(), 'timestamp', window='1min'))

print("\n保留最新记录:")
print(keep_latest(data.copy(), 'user_id', 'timestamp'))
```

**大数据去重技巧**：

```python
# 对于超大数据集，分块去重
def dedupe_large_file(input_file, output_file, chunksize=10000):
    """分块处理大文件去重"""
    seen_ids = set()
    first_chunk = True
    
    for chunk in pd.read_csv(input_file, chunksize=chunksize):
        # 过滤已见过的ID
        mask = ~chunk['user_id'].isin(seen_ids)
        new_data = chunk[mask]
        
        # 更新seen_ids
        seen_ids.update(new_data['user_id'].unique())
        
        # 写入结果
        new_data.to_csv(
            output_file,
            mode='a',
            header=first_chunk,
            index=False
        )
        first_chunk = False
    
    return len(seen_ids)

# 使用Bloom Filter进行大规模去重
from pybloom_live import BloomFilter

def dedupe_with_bloom_filter(data_stream, capacity=1000000):
    """使用布隆过滤器去重（节省内存）"""
    bf = BloomFilter(capacity=capacity, error_rate=0.001)
    unique_items = []
    
    for item in data_stream:
        if item not in bf:
            bf.add(item)
            unique_items.append(item)
    
    return unique_items
```

**实战建议**：

1. **小数据集**：直接用pandas的`drop_duplicates`
2. **大数据集**：分块处理 + 集合记录已见
3. **超大数据集**：使用Bloom Filter或外部排序
4. **实时去重**：使用Redis的Set数据结构

{{< /details >}}

{{< details "**如何处理时间序列数据？**" "Python" >}}

时间序列数据在用户行为分析、业务趋势分析中很常见。

**场景**：分析用户每日活跃度、计算留存率、预测销售趋势。

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 创建示例时间序列数据
dates = pd.date_range('2024-01-01', periods=100, freq='D')
data = pd.DataFrame({
    'date': dates,
    'active_users': np.random.randint(1000, 2000, 100),
    'revenue': np.random.uniform(5000, 10000, 100)
})

# 1. 时间索引
data.set_index('date', inplace=True)

# 2. 基本时间操作
# 按月聚合
monthly = data.resample('M').agg({
    'active_users': 'mean',
    'revenue': 'sum'
})

# 按周聚合
weekly = data.resample('W').agg({
    'active_users': 'mean',
    'revenue': 'sum'
})

# 3. 移动平均（平滑数据）
data['users_ma7'] = data['active_users'].rolling(window=7).mean()  # 7日均值
data['users_ma30'] = data['active_users'].rolling(window=30).mean()  # 30日均值

# 4. 环比和同比
data['revenue_change'] = data['revenue'].pct_change()  # 日环比
data['revenue_change_7d'] = data['revenue'].pct_change(periods=7)  # 周同比

# 5. 累计值
data['revenue_cumsum'] = data['revenue'].cumsum()  # 累计收入

# 6. 季节性分解
from statsmodels.tsa.seasonal import seasonal_decompose

# 分解为趋势、季节性、残差
result = seasonal_decompose(data['active_users'], model='additive', period=7)

# 绘制分解结果
import matplotlib.pyplot as plt
fig, axes = plt.subplots(4, 1, figsize=(12, 8))
result.observed.plot(ax=axes[0], title='原始数据')
result.trend.plot(ax=axes[1], title='趋势')
result.seasonal.plot(ax=axes[2], title='季节性')
result.resid.plot(ax=axes[3], title='残差')
plt.tight_layout()

# 7. 计算留存率
def calculate_retention(df, user_col='user_id', date_col='date', periods=[1, 7, 14, 30]):
    """
    计算用户留存率
    df: 包含user_id和date的用户行为数据
    periods: 要计算的留存天数
    """
    df[date_col] = pd.to_datetime(df[date_col])
    
    # 每个用户的首次行为日期
    first_date = df.groupby(user_col)[date_col].min().reset_index()
    first_date.columns = [user_col, 'first_date']
    
    # 合并回原数据
    df = df.merge(first_date, on=user_col)
    
    # 计算距离首次的天数
    df['days_since_first'] = (df[date_col] - df['first_date']).dt.days
    
    # 计算各期留存
    retention = {}
    total_new_users = first_date[user_col].nunique()
    
    for period in periods:
        # 在period天后还活跃的用户数
        retained = df[df['days_since_first'] >= period][user_col].nunique()
        retention[f'Day {period}'] = retained / total_new_users * 100
    
    return pd.Series(retention)

# 8. 时间窗口聚合
def rolling_stats(df, value_col, windows=[7, 14, 30]):
    """计算滚动统计指标"""
    for window in windows:
        df[f'{value_col}_mean_{window}d'] = df[value_col].rolling(window).mean()
        df[f'{value_col}_std_{window}d'] = df[value_col].rolling(window).std()
        df[f'{value_col}_min_{window}d'] = df[value_col].rolling(window).min()
        df[f'{value_col}_max_{window}d'] = df[value_col].rolling(window).max()
    
    return df

# 9. 异常检测
def detect_anomalies(df, column, window=7, threshold=3):
    """
    基于移动平均和标准差检测异常
    threshold: 几倍标准差视为异常
    """
    rolling_mean = df[column].rolling(window).mean()
    rolling_std = df[column].rolling(window).std()
    
    # 计算z-score
    z_score = (df[column] - rolling_mean) / rolling_std
    
    # 标记异常
    df['is_anomaly'] = np.abs(z_score) > threshold
    
    return df

# 10. 时间特征工程
def extract_time_features(df, date_col):
    """提取时间特征用于模型训练"""
    df[date_col] = pd.to_datetime(df[date_col])
    
    df['year'] = df[date_col].dt.year
    df['month'] = df[date_col].dt.month
    df['day'] = df[date_col].dt.day
    df['dayofweek'] = df[date_col].dt.dayofweek  # 0=Monday
    df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
    df['quarter'] = df[date_col].dt.quarter
    df['week_of_year'] = df[date_col].dt.isocalendar().week
    
    return df

# 使用示例
print("原始数据:")
print(data.head())

print("\n月度聚合:")
print(monthly)

print("\n添加移动平均:")
data_with_ma = rolling_stats(data.copy(), 'active_users')
print(data_with_ma[['active_users', 'active_users_mean_7d', 'active_users_mean_30d']].head(35))

print("\n异常检测:")
data_with_anomaly = detect_anomalies(data.copy(), 'revenue')
print(data_with_anomaly[data_with_anomaly['is_anomaly']])
```

**时间序列分析要点**：

1. **数据预处理**：
   - 处理缺失时间点（插值、填充）
   - 处理异常值
   - 统一时间频率

2. **探索性分析**：
   - 趋势分析（是否增长/下降）
   - 季节性分析（周期性波动）
   - 平稳性检验

3. **特征工程**：
   - 滞后特征（lag features）
   - 滚动统计特征
   - 时间编码（周几、月份等）

4. **预测建模**：
   - ARIMA模型
   - Prophet（Facebook开源）
   - LSTM（深度学习）

{{< /details >}}

{{< details "**如何实现数据质量检查？**" "Python" >}}

数据分析前需要对数据质量进行全面检查，确保数据可用性。

**场景**：接收外部数据源，需要验证数据完整性、准确性、一致性。

```python
import pandas as pd
import numpy as np
from typing import Dict, List, Any

class DataQualityChecker:
    """数据质量检查器"""
    
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.report = {
            'basic_info': {},
            'missing_values': {},
            'duplicates': {},
            'data_types': {},
            'outliers': {},
            'distributions': {},
            'issues': []
        }
    
    def check_all(self):
        """执行所有检查"""
        self.check_basic_info()
        self.check_missing_values()
        self.check_duplicates()
        self.check_data_types()
        self.check_outliers()
        self.check_value_ranges()
        self.check_distributions()
        
        return self.get_report()
    
    def check_basic_info(self):
        """基本信息检查"""
        self.report['basic_info'] = {
            'rows': len(self.df),
            'columns': len(self.df.columns),
            'memory_usage': f"{self.df.memory_usage(deep=True).sum() / 1024 ** 2:.2f} MB",
            'column_names': self.df.columns.tolist()
        }
    
    def check_missing_values(self):
        """缺失值检查"""
        missing = self.df.isnull().sum()
        missing_pct = (missing / len(self.df)) * 100
        
        self.report['missing_values'] = {
            col: {
                'count': int(missing[col]),
                'percentage': f"{missing_pct[col]:.2f}%"
            }
            for col in self.df.columns if missing[col] > 0
        }
        
        # 警告：超过30%缺失
        for col, info in self.report['missing_values'].items():
            if float(info['percentage'].rstrip('%')) > 30:
                self.report['issues'].append(
                    f"警告: 列 '{col}' 缺失率过高 ({info['percentage']})"
                )
    
    def check_duplicates(self):
        """重复值检查"""
        total_dups = self.df.duplicated().sum()
        self.report['duplicates'] = {
            'total_duplicates': int(total_dups),
            'percentage': f"{(total_dups / len(self.df)) * 100:.2f}%"
        }
        
        if total_dups > 0:
            self.report['issues'].append(
                f"发现 {total_dups} 行重复数据"
            )
    
    def check_data_types(self):
        """数据类型检查"""
        self.report['data_types'] = {
            col: str(dtype) 
            for col, dtype in self.df.dtypes.items()
        }
        
        # 检查数值列是否错误存储为字符串
        for col in self.df.columns:
            if self.df[col].dtype == 'object':
                # 尝试转换为数值
                try:
                    pd.to_numeric(self.df[col], errors='raise')
                    self.report['issues'].append(
                        f"建议: 列 '{col}' 可能应该是数值类型但存储为文本"
                    )
                except:
                    pass
    
    def check_outliers(self, method='iqr', threshold=1.5):
        """异常值检查"""
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            Q1 = self.df[col].quantile(0.25)
            Q3 = self.df[col].quantile(0.75)
            IQR = Q3 - Q1
            
            lower_bound = Q1 - threshold * IQR
            upper_bound = Q3 + threshold * IQR
            
            outliers = self.df[
                (self.df[col] < lower_bound) | 
                (self.df[col] > upper_bound)
            ]
            
            if len(outliers) > 0:
                self.report['outliers'][col] = {
                    'count': len(outliers),
                    'percentage': f"{(len(outliers) / len(self.df)) * 100:.2f}%",
                    'range': f"[{self.df[col].min()}, {self.df[col].max()}]",
                    'expected_range': f"[{lower_bound:.2f}, {upper_bound:.2f}]"
                }
    
    def check_value_ranges(self):
        """值范围检查"""
        # 自定义业务规则检查
        # 例如：年龄应该在0-120之间
        if 'age' in self.df.columns:
            invalid_age = self.df[(self.df['age'] < 0) | (self.df['age'] > 120)]
            if len(invalid_age) > 0:
                self.report['issues'].append(
                    f"错误: 发现 {len(invalid_age)} 条年龄数据不合理"
                )
        
        # 价格不应该为负
        price_cols = [col for col in self.df.columns if 'price' in col.lower()]
        for col in price_cols:
            if (self.df[col] < 0).any():
                negative_count = (self.df[col] < 0).sum()
                self.report['issues'].append(
                    f"错误: 列 '{col}' 发现 {negative_count} 个负值"
                )
    
    def check_distributions(self):
        """分布检查"""
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            self.report['distributions'][col] = {
                'mean': float(self.df[col].mean()),
                'median': float(self.df[col].median()),
                'std': float(self.df[col].std()),
                'min': float(self.df[col].min()),
                'max': float(self.df[col].max()),
                'skewness': float(self.df[col].skew()),
                'kurtosis': float(self.df[col].kurt())
            }
    
    def get_report(self):
        """生成报告"""
        return self.report
    
    def print_report(self):
        """打印报告"""
        print("=" * 60)
        print("数据质量检查报告")
        print("=" * 60)
        
        print("\n基本信息:")
        for key, value in self.report['basic_info'].items():
            print(f"  {key}: {value}")
        
        print("\n缺失值:")
        if self.report['missing_values']:
            for col, info in self.report['missing_values'].items():
                print(f"  {col}: {info['count']} ({info['percentage']})")
        else:
            print("  无缺失值")
        
        print("\n重复数据:")
        print(f"  {self.report['duplicates']['total_duplicates']} 行 "
              f"({self.report['duplicates']['percentage']})")
        
        print("\n异常值:")
        if self.report['outliers']:
            for col, info in self.report['outliers'].items():
                print(f"  {col}: {info['count']} ({info['percentage']})")
        else:
            print("  未检测到明显异常值")
        
        print("\n问题汇总:")
        if self.report['issues']:
            for issue in self.report['issues']:
                print(f"  - {issue}")
        else:
            print("  未发现严重问题")
        
        print("=" * 60)

# 使用示例
# 创建测试数据
test_data = pd.DataFrame({
    'user_id': [1, 2, 3, 3, 4, 5],  # 有重复
    'age': [25, 30, None, 35, 150, -5],  # 有缺失和异常值
    'income': [5000, 6000, 7000, 8000, 100000, 4500],  # 有异常值
    'gender': ['M', 'F', 'M', 'F', 'M', 'F'],
    'score': ['80', '90', '85', '75', '95', '88']  # 应该是数值但存为文本
})

# 执行检查
checker = DataQualityChecker(test_data)
report = checker.check_all()

# 打印报告
checker.print_report()

# 也可以获取详细报告进行程序化处理
print("\n详细报告（JSON格式）:")
import json
print(json.dumps(report, indent=2, ensure_ascii=False))
```

**数据质量维度**：

1. **完整性**：数据是否完整，有无缺失
2. **准确性**：数据是否准确，有无错误
3. **一致性**：数据是否一致，有无矛盾
4. **及时性**：数据是否及时，有无过期
5. **唯一性**：数据是否唯一，有无重复
6. **有效性**：数据是否有效，是否符合业务规则

{{< /details >}}


