---
title: "Python面向对象"
date: 2023-09-10
categories: ["Python"]
tags: ["Python","面向对象"]
summary: "介绍 Python 面向对象的核心：类与实例、封装与属性访问、继承与 MRO、多态、类方法与静态方法、内置魔术方法、元类与其创建流程。"
math: true
---

# 1 类的定义

## 1.1 基本结构与类命名空间
类采用驼峰命名；类体中的可执行语句在类定义阶段立即运行。类属性在所有实例间共享，实例属性在各对象间独立。使用 `ClassName.__dict__` 可查看类命名空间。  
示例类 `Student` 展示类属性、实例属性、`@classmethod`、`@staticmethod` 以及实例方法：

```python
class Student:
    school = "donghua"
    address = "shanghai"
    stu_count = 0  # 注册的实例个数

    @classmethod
    def local(cls):
        print(cls.address)

    @staticmethod
    def say_hello(msg: str):
        print(msg)
        Student.local()

    def __init__(self, name: str, age: int, score: int):
        self.name = name
        self.age = age
        self.score = score
        Student.stu_count += 1

    def say_score(self):
        print(f"{self.name}的分数是{self.score}")


print(Student.say_score)  # 函数对象
s1 = Student("aini", 22, 80)
Student.say_score(s1)     # 直接用类调用实例方法需传实例
s1.say_score()            # 常规调用 (本质等价于 Student.say_score(s1))
print(s1.__dict__)        # {'name': 'aini', 'age': 22, 'score': 80}
```

实例化发生三件事：  
1. 分配空对象内存  
2. 自动调用 `__init__` 初始化  
3. 返回初始化完成的实例  

# 2 封装

## 2.1 私有属性与名称改写
以双下划线前缀 `__attr` 定义的属性会在类定义阶段触发名称改写（name mangling）为 `_类名__attr`，用于避免子类冲突而非真正安全隐藏。

```python
class Foo:
    __x = 1

    def __test(self):
        print("from __test")

    def expose(self):
        print(self.__x)       # 访问私有类属性
        self.__test()         # 调用私有方法


foo = Foo()
foo.expose()
print(Foo._Foo__x)        # 非推荐: 访问改写后的名字
print(Foo._Foo__test)     # 取得未绑定函数对象

# 后续动态添加的以 __ 开头的名字不会再被改写
Foo.__y = 3
print(Foo.__y)
```

## 2.2 `property` 使用方式
三种典型方式：只读、读写（getter + setter）、读写删（`@property` + `@name.setter` + `@name.deleter`）。

```python
# 只读属性
class Person:
    def __init__(self, name: str):
        self.__name = name

    @property
    def name(self):
        return self.__name


p = Person("aini")
print(p.name)
```

```python
# getter + setter
class Person:
    def __init__(self, name: str):
        self.__name = name

    def get_name(self):
        return self.__name

    def set_name(self, val: str):
        if not isinstance(val, str):
            raise TypeError("必须传入 str 类型")
        self.__name = val

    name = property(get_name, set_name)


p = Person("aini")
print(p.name)
p.name = "norah"
print(p.name)
```

```python
# 装饰器链式写法
class Person:
    def __init__(self, name: str):
        self.__name = name

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, val: str):
        if not isinstance(val, str):
            raise TypeError("必须传入 str 类型")
        self.__name = val

    @name.deleter
    def name(self):
        print("禁止删除该属性")
        # 不执行真正的删除
```

# 3 继承

Python3 所有类默认继承自 `object`；支持多继承。使用 `__bases__` 查看直接父类。

```python
class Parent1: ...
class Parent2: ...

class Sub1(Parent1): ...
class Sub2(Parent1, Parent2): ...

print(Sub1.__bases__)  # (<class '__main__.Parent1'>,)
print(Sub2.__bases__)  # (<class '__main__.Parent1'>, <class '__main__.Parent2'>)
```

## 3.1 基本继承实现
```python
class OldBoyPeople:
    school = "OLDBOY"

    def __init__(self, name: str, age: int, sex: str):
        self.name = name
        self.age = age
        self.sex = sex


class Student(OldBoyPeople):
    def choose_course(self):
        print(f"学生 {self.name} 正在选课")


class Teacher(OldBoyPeople):
    def __init__(self, name, age, sex, salary, level):
        super().__init__(name, age, sex)  # 推荐 super()
        self.salary = salary
        self.level = level

    def score(self):
        print(f"老师 {self.name} 正在给学生打分")


t = Teacher("agen", 25, "man", 50000, "一级")
print(t.__dict__)

stu = Student("aini", 22, "man")
print(stu.name, stu.age, stu.sex, stu.school)
stu.choose_course()
```

## 3.2 单继承下的属性查找
调用父类方法时 `self` 仍是子类实例，因此内部再次访问实例或重写方法时表现为动态绑定。

```python
class Foo:
    def f1(self):
        print("Foo.f1")

    def f2(self):
        print("Foo.f2")
        self.f1()  # 动态绑定，若子类覆盖 f1 则调用子类版本


class Bar(Foo):
    def f1(self):
        print("Bar.f1")


obj = Bar()
obj.f2()
# 输出：
# Foo.f2
# Bar.f1
```

## 3.3 菱形继承与 MRO
菱形继承（钻石继承）中 Python3 使用 C3 线性化算法生成方法解析顺序 (MRO)。子类调用重写方法时按 `D.mro()` 列表顺序查找。

```python
class A: 
    def test(self): print("A")

class B(A):
    def test(self): print("B")

class C(A):
    def test(self): print("C")

class D(B, C):
    pass

d = D()
d.test()          # B
print(D.mro())    # [D, B, C, A, object]
```

## 3.4 MRO 规则概述
1. 子类优先  
2. 同层多父类按列出顺序  
3. 冲突时选择第一个合法父类（C3 保证一致性）  

## 3.5 新式类与经典类差异（历史）
在 Python2 中：未继承 `object` 的“经典类”使用深度优先；新式类使用广度（C3）优先。Python3 全部为新式类，统一采用 C3 线性化。旧差异仅作历史背景参考。

## 3.6 Mixins 机制
Mixin 类用于按功能水平拆分：只提供单一可复用能力，不表示“是一个”关系；命名常以 `Mixin`, `Able`, `Ible` 结尾。

```python
class Vehicle: ...

class FlyableMixin:
    def fly(self):
        print("I am flying")


class CivilAircraft(FlyableMixin, Vehicle):
    pass


class Helicopter(FlyableMixin, Vehicle):
    pass


class Car(Vehicle):
    pass  # 不具备 fly()
```

## 3.7 使用 Mixin 注意事项
- 必须表达“可附加的功能”，不代表实体。  
- 单一职责，一个功能一个 Mixin。  
- 不依赖具体子类内部结构。  
- 子类未继承该 Mixin 仍可正常工作，只是缺少该额外功能。  

## 3.8 方法重用与 `super()`
`super()` 按当前类的 `__mro__` 顺序向后查找，非“肉眼父类”概念；避免硬编码父类名，有利于多继承兼容。

```python
class OldBoyPeople:
    def __init__(self, name, age, sex):
        self.name = name
        self.age = age
        self.sex = sex


class Teacher(OldBoyPeople):
    def __init__(self, name, age, sex, level, salary):
        super().__init__(name, age, sex)
        self.level = level
        self.salary = salary
```

例外场景：多继承链中 `super()` 可能跨越“看起来”无关的类，但遵守 MRO 是 Python 的统一规则。

## 3.9 组合
组合是“has-a”关系；当类之间功能差异明显且一个类需要另一个类的实例作为组件时使用组合优于继承。

```python
class Course:
    def __init__(self, name, period, price):
        self.name = name
        self.period = period
        self.price = price

    def info(self):
        print(f"<{self.name} {self.period} {self.price}>")


class Date:
    def __init__(self, year, mon, day):
        self.year = year
        self.mon = mon
        self.day = day

    def birth(self):
        print(f"<{self.year}-{self.mon}-{self.day}>")


class People:
    school = "清华大学"
    def __init__(self, name, sex, age):
        self.name = name
        self.sex = sex
        self.age = age


class Teacher(People):
    def __init__(self, name, sex, age, title, year, mon, day):
        super().__init__(name, sex, age)
        self.title = title
        self.birth_date = Date(year, mon, day)
        self.courses: list[Course] = []

    def teach(self):
        print(f"{self.name} is teaching")


python = Course("python", "3mons", 3000.0)
linux = Course("linux", "5mons", 5000.0)

teacher = Teacher("lili", "female", 28, "博士生导师", 1990, 3, 23)
teacher.courses.extend([python, linux])

teacher.birth_date.birth()
for c in teacher.courses:
    c.info()
```

# 4 多态

## 4.1 基于继承的多态
同一接口 `say()` 在不同子类中表现不同行为，调用端无需关心具体类型。

```python
class Animal:
    def say(self):
        print("动物基本的发声")

class Person(Animal):
    def say(self):
        super().say()
        print("啊啊啊啊")

class Dog(Animal):
    def say(self):
        super().say()
        print("汪汪汪")

class Pig(Animal):
    def say(self):
        super().say()
        print("哼哼哼")


def animal_say(animal: Animal):
    animal.say()


for obj in (Person(), Dog(), Pig()):
    animal_say(obj)
```

多态同样体现在通用协议：如任意对象实现 `__len__` 即可用于内置 `len()`。

```python
def my_len(val):
    return val.__len__()

print(my_len("aini"))
print(my_len([1, 12, 3]))
print(my_len({"name": "aini", "age": 22}))
```

## 4.2 鸭子类型
无需继承自同一父类，只要对象实现所需方法即可被视为“兼容”。

```python
class Cpu:
    def read(self): print("cpu read")
    def write(self): print("cpu write")

class Mem:
    def read(self): print("mem read")
    def write(self): print("mem write")

class Txt:
    def read(self): print("txt read")
    def write(self): print("txt write")


def io_trace(dev):
    dev.read()
    dev.write()


for d in (Cpu(), Mem(), Txt()):
    io_trace(d)
```

# 5 `@classmethod` 示例
类方法接收 `cls` 而非实例，用于提供替代构造或访问类级资源。

```python
# 假设 setting.py 定义 IP, PORT
import setting

class Mysql:
    def __init__(self, ip: str, port: int):
        self.ip = ip
        self.port = port

    def connect(self):
        print(f"Connecting {self.ip}:{self.port}")

    @classmethod
    def from_conf(cls):
        return cls(setting.IP, setting.PORT)


obj = Mysql.from_conf()
print(obj.__dict__)
```

# 6 `@staticmethod` 示例
静态方法不接收隐式 `self`/`cls`，常用于工具函数。

```python
import uuid

class Mysql:
    def __init__(self, ip: str, port: int):
        self.ip = ip
        self.port = port

    @staticmethod
    def create_id():
        return uuid.uuid4()


obj = Mysql("127.0.0.1", 3306)
print(Mysql.create_id())
print(obj.create_id())
```

# 7 内置魔术方法

## 7.1 概念
以 `__name__` 包裹的特殊方法（如 `__str__`, `__del__`, `__call__`, `__len__` 等）在特定场景被自动触发，用于定制对象行为。

## 7.2 `__str__` 与 `__del__`
`__str__` 返回用户友好的字符串表示；`__del__` 在对象即将被垃圾回收时调用，适合释放非 Python 管理的资源（如文件句柄）。

```python
class People:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
        self.fp = open("aini.txt", "w", encoding="utf-8")  # 示例资源

    def __str__(self):
        return f"<{self.name}:{self.age}>"

    def __del__(self):
        # 释放系统资源
        if not self.fp.closed:
            self.fp.close()
        print("People 对象已清理")

p = People("aini", 22)
print(p)
del p
```

# 8 元类介绍

## 8.1 元类与类的创建
元类是“用来创建类的类”，默认元类是 `type`。`type` 本身可通过三参数形式动态创建类：`type(name, bases, namespace)`。

```python
class People:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

print(type(People))  # <class 'type'>
print(type(int))     # <class 'type'>
```

动态等价构造：
```python
class_body = '''
def __init__(self, name, age):
    self.name = name
    self.age = age

def say(self):
    print(f"<{self.name}:{self.age}>")
'''

ns = {}
exec(class_body, {}, ns)
DynamicPeople = type("DynamicPeople", (object,), ns)
dp = DynamicPeople("aini", 22)
dp.say()
```

## 8.2 自定义元类
通过继承 `type`，重写 `__new__` / `__init__` / `__call__` 控制类创建与调用过程。

```python
class StrictNameMeta(type):
    def __new__(mcls, name, bases, namespace):
        # 可在这里预处理命名空间
        return super().__new__(mcls, name, bases, namespace)

    def __init__(cls, name, bases, namespace):
        if not name[:1].isupper():
            raise NameError("类名首字母必须大写")
        super().__init__(name, bases, namespace)

    def __call__(cls, *args, **kwargs):
        # 控制实例化流程
        obj = super().__call__(*args, **kwargs)
        obj.__dict__["_created_by_meta"] = True
        return obj


class People(metaclass=StrictNameMeta):
    def __init__(self, name, age):
        self.name = name
        self.age = age


p = People("aini", 22)
print(p._created_by_meta)
```

## 8.3 `__new__` 与 `__call__` 区分
- `__new__(cls, *args, **kwargs)`：创建并返回实例（静态或类方法语义，先于 `__init__`）。  
- `__init__(self, *args, **kwargs)`：接管已创建实例的初始化。  
- `__call__(self, *args, **kwargs)`：使对象可调用；元类的 `__call__` 决定“调用类名()”时的整体流程（内部会先走类的 `__new__` 再 `__init__`）。  

## 8.4 属性查找原则
实例属性查找顺序：实例 → 类 → 基类链（按 MRO）→ 不查元类。元类主要影响类对象本身的行为，不参与普通实例的属性链。
