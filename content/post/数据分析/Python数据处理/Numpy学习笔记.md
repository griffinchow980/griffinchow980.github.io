---
title: "NumPy学习笔记"
date: 2024-04-10
categories: ["Python"]
tags: ["Python"]
summary: "NumPy 入门：安装、ndarray 与 dtype、属性与索引、广播与运算、重塑拼接、数学函数及可视化示例。"
math: true
---

# 1 安装NumPy

## 1.1 `pip`安装
```bash
python --version        # 核对 Python
pip --version           # 核对 pip
pip install numpy       # 最新版
pip install numpy==1.21.0   # 指定版本
# 国内加速
pip install numpy -i https://pypi.tuna.tsinghua.edu.cn/simple
```
常见：权限用 `sudo` 或管理员；未找到命令→检查 PATH。

## 1.2 `conda`安装
```bash
conda --version
conda create -n myenv python=3.11
conda activate myenv
conda install numpy
```

## 1.3 常见问题
- 找不到 `pip` / `conda`：添加到环境变量。
- 权限错误：用管理员或 `sudo`.
- 超时：换镜像或检查网络。
- 版本冲突：先 `pip list` / `conda list` 再升级。

## 1.4 验证
```python
import numpy as np
print(np.__version__)
print(np.array([1,2,3]))
```

# 2 `ndarray` 概述

## 2.1 特性
同质数据、连续内存、高效向量化、广播自动扩展维度。

## 2.2 创建
```python
import numpy as np
a1 = np.array([1,2,3,4])
a2 = np.array([[1,2,3],[4,5,6]])
ar = np.arange(0,10,2)            # 步长
ls = np.linspace(0,1,5)           # 等距
z  = np.zeros((2,3))
o  = np.ones((2,3))
e  = np.empty((2,3))              # 未初始化
r1 = np.random.rand(5)            # [0,1)均匀
r2 = np.random.randint(0,10,(2,3))
```

## 2.3 基本操作
```python
arr = np.array([[1,2,3],[4,5,6]])
print(arr[0,1])        # 访问
arr[0,1] = 10          # 修改
print(arr[0])          # 行
print(arr[:,1])        # 列
sub = arr[:2,:2]       # 切片视图
step = np.array([[1,2,3,4,5],[6,7,8,9,10]])[0,::2]  # 步长
mask = arr > 5
print(arr[mask])       # 布尔索引
idx  = np.array([0,1])
print(arr[idx,[1,2]])  # 花式索引
```

## 2.4 与列表对比
- 速度：向量化比列表推导快。
- 内存：连续块 vs 指针数组。
- 类型：数组单一 dtype；列表可混合。
```python
# 性能简对比（示意）
import time
N=1_000_00
py = list(range(N))
t=time.time(); py = [x*2 for x in py]; print("list:", time.time()-t)
np_a = np.arange(N)
t=time.time(); np_a = np_a*2; print("numpy:", time.time()-t)
```

# 3 数据类型 (`dtype`)

## 3.1 常见类型
`np.int8/16/32/64`, `np.float32/64`, `np.complex128`, `np.bool_`, `np.str_`.
```python
i32 = np.array([1,2,3], dtype=np.int32)
f64 = np.array([1.,2.5,3.7], dtype=np.float64)
c128= np.array([1+2j,3+4j], dtype=np.complex128)
b   = np.array([True,False], dtype=np.bool_)
s   = np.array(['hello','world'], dtype=np.str_)
```

## 3.2 类型转换
```python
arr  = np.array([1.5,2.7,3.9])
print(arr.astype(np.int32))      # 截断
print(np.array([1,2,3]).astype(np.float64))
print(np.array([True,False]).astype(int))
print(np.array(['1.1','2.2']).astype(float))
try:
    np.array(['1','two']).astype(float)
except ValueError as e:
    print("错误:", e)
```

# 4 数组属性
```python
arr = np.array([[1,2,3],[4,5,6]])
print(arr.shape, arr.ndim, arr.size, arr.dtype, arr.itemsize, arr.nbytes)
r   = np.arange(12).reshape(3,4)       # 重塑
col = np.array([1,2,3])[:,np.newaxis]  # 增维
```

# 5 创建方式补充
```python
orig = np.array([1,2,3,4,5])
new  = np.array(orig)          # 复制
rng  = np.arange(0,10,2)
lin  = np.linspace(0,1,4)
np.random.seed(42)
print(np.random.rand(2,3))
print(np.random.randn(3,2))
print(np.random.randint(0,10,(2,3)))
```

# 6 切片与索引
```python
one = np.array([10,20,30,40])
print(one[0], one[-1])

two = np.array([[1,2,3],[4,5,6]])
print(two[0,1], two[1,2])

three = np.array([[[1,2],[3,4]], [[5,6],[7,8]]])
print(three[0,1,0])          # 多维

data = np.array([10,20,30,40,50])
print(data[data>25])         # 布尔
print(data[[0,2,4]])         # 花式
```

# 7 高级索引与视图
```python
base = np.array([[1,2,3],[4,5,6],[7,8,9]])
sub  = base[1:3,0:2]         # 视图
sub[0,0] = 99                # 修改同步到 base
print(base)

even = base[base%2==0]
rows = base[[0,2]]
gt5  = base[base>5]
print(even, rows, gt5)
```

# 8 数组运算与广播

## 8.1 基本运算
```python
a = np.array([1,2,3]); b = np.array([4,5,6])
print(a+b, b-a, a*b, b/a, a+10)
```

## 8.2 广播
```python
A = np.array([[1,2,3],[4,5,6]])
B = np.array([10,20,30])     # 广播到 (2,3)
print(A + B)
C = np.array([[1],[2],[3]])
A2= np.array([[1,2,3],[4,5,6],[7,8,9]])
print(A2 + C)
```

## 8.3 聚合
```python
print(np.sum(A), np.mean(A), np.min(A), np.max(A))
print(np.sum(A,axis=0), np.sum(A,axis=1))   # 列 & 行
```

# 9 数组操作

## 9.1 拼接
```python
x = np.array([[1,2,3],[4,5,6]])
y = np.array([[7,8,9]])
print(np.vstack((x,y)))
z = np.array([[10,11,12],[13,14,15]])
print(np.hstack((x,z)))
print(np.dstack((x,x)))
print(np.concatenate((x,y), axis=0))
```

## 9.2 重塑
```python
r = np.arange(12).reshape(4,3)
```

## 9.3 复制与视图
```python
orig = np.array([1,2,3,4,5])
cp   = orig.copy()
vw   = orig[1:4]       # 视图
vw[0]= 99
print(orig, cp, vw)
```

# 10 数学函数与示例

## 10.1 常用
```python
import numpy as np
ang = np.array([0, np.pi/2, np.pi])
print(np.sin(ang), np.cos(ang))
print(np.exp([0,1,2]))
print(np.log([1,np.e,10]))
print(np.log10([1,10,100]))
```

## 10.2 综合示例（代码关键注释）
```python
import numpy as np
# 生成等间隔角度
x = np.linspace(0, 2*np.pi, 100)
y_sin = np.sin(x)        # 正弦
y_cos = np.cos(x)        # 余弦
y_exp = np.exp(x)        # 指数
y_log = np.log(x + 1e-10)# 对数(避开0)
```

```echarts
{
  "title": {"text": "三角与指数/对数函数曲线"},
  "tooltip": {"trigger": "axis"},
  "legend": {"data": ["sin(x)", "cos(x)", "exp(x)", "log(x)"]},
  "xAxis": {"type": "category", "data": Array.from({length:100}, (_,i)=> (2*Math.PI*i/99).toFixed(2))},
  "yAxis": {"type": "value"},
  "series": [
    {"type": "line", "name": "sin(x)", "data": Array.from({length:100}, (_,i)=> Math.sin(2*Math.PI*i/99))},
    {"type": "line", "name": "cos(x)", "data": Array.from({length:100}, (_,i)=> Math.cos(2*Math.PI*i/99))},
    {"type": "line", "name": "exp(x)", "data": Array.from({length:100}, (_,i)=> Math.exp(2*Math.PI*i/99))},
    {"type": "line", "name": "log(x)", "data": Array.from({length:100}, (_,i)=> Math.log(2*Math.PI*i/99 + 1e-10))}
  ]
}
```

```python
# 角度列表（部分角度演示）
angles = np.array([0, np.pi/6, np.pi/4, np.pi/3, np.pi/2])
sin_vals = np.sin(angles)
cos_vals = np.cos(angles)
```

```echarts
{
  "title": {"text": "角度与正弦余弦值"},
  "tooltip": {},
  "xAxis": {"type": "category", "data": ["0","π/6","π/4","π/3","π/2"]},
  "yAxis": {"type": "value"},
  "legend": {"data": ["sin","cos"]},
  "series": [
    {"type": "bar", "name": "sin", "data": [0, 0.5, 0.7071, 0.8660, 1]},
    {"type": "bar", "name": "cos", "data": [1, 0.8660, 0.7071, 0.5, 0]}
  ]
}
```

## 10.3 练习
```python
angles = np.array([0,np.pi/6,np.pi/4,np.pi/3,np.pi/2])
print(np.sin(angles), np.cos(angles))
x = np.array([1,2,3,4,5])
print(np.exp(x), np.log(x))
```

# 11 统计函数

## 11.1 概述
`NumPy` 提供描述性统计函数快速衡量数据集中趋势与离散程度：`np.mean`、`np.median`、`np.std`、`np.var` 等。可指定 `axis` 做按行或按列统计。

## 11.2 描述性统计示例
```python
import numpy as np
data = np.array([1,2,3,4,5])
print(np.mean(data))    # 均值 3.0
print(np.median(data))  # 中位数 3.0
print(np.std(data))     # 标准差 (总体) 1.4142...
print(np.var(data))     # 方差 2.0
```
注意：`np.std` / `np.var` 默认使用总体公式；样本标准差需传 `ddof=1`。

## 11.3 综合分析 + 直方图
```python
import numpy as np
import matplotlib.pyplot as plt

data = np.random.normal(loc=0, scale=1, size=1000)
mean_v, med_v, std_v, var_v = np.mean(data), np.median(data), np.std(data), np.var(data)
print(mean_v, med_v, std_v, var_v)

plt.hist(data, bins=30, alpha=0.7, edgecolor='black')
plt.axvline(mean_v, color='red', linestyle='--', label='Mean')
plt.axvline(med_v, color='gold', linestyle='--', label='Median')
plt.legend(); plt.title("Normal Distribution Sample"); plt.show()
```

```echarts
{
  "title": {"text": "正态分布样本统计"},
  "tooltip": {"trigger": "axis"},
  "xAxis": {"type": "category", "data": ["mean","median","std","var"]},
  "yAxis": {"type": "value"},
  "series": [
    {"type": "bar", "name": "value", "data": [0,0,1,1]}
  ]
}
```
(示意：真实值请运行代码后替换)

## 11.4 练习
```python
data = np.array([10,20,30,40,50,60,70,80,90,100])
print({ "mean": np.mean(data),
        "median": np.median(data),
        "std": np.std(data),
        "var": np.var(data) })
```

# 12 排序与条件选择

## 12.1 排序
```python
arr = np.array([3,1,2,5,4])
print(np.sort(arr))  # 返回新数组
arr.sort()           # 就地排序
print(arr)
idx = np.argsort(arr)        # 排序后位置索引
print(arr[idx])              # 通过索引重排
```

## 12.2 条件选择
```python
arr = np.array([10,20,30,40,50])
cond = arr > 30
print(np.where(cond))        # (array([3,4]),)
print(arr[cond])             # [40 50]

nz = np.nonzero([0,1,2,0,3])
print(nz)                    # (array([1,2,4]),)
```

## 12.3 练习
```python
arr = np.array([5,3,8,1,4])
print(np.sort(arr))
print(np.argsort(arr))
print(arr[arr>3])
print(np.nonzero(arr))
```

# 13 字符串函数

## 13.1 概述
`np.char` 命名空间提供向量化字符串操作：`add`, `split`, `find`, `replace`, `lower`, `upper` 等；适合批量处理而非逐元素循环。

## 13.2 主要示例
```python
import numpy as np
a1 = np.array(['Hello','World'])
a2 = np.array([' NumPy',' Tutorial'])
print(np.char.add(a1,a2))              # 连接

sents = np.array(['Hello NumPy Tutorial','Welcome to Python'])
print(np.char.split(sents))            # 分割 -> 列表对象

tokens = np.array(['Hello','World','NumPy'])
print(np.char.find(tokens,'o'))        # 查找字符 'o' 的位置，未找到 -1

rep = np.array(['Hello World','NumPy is great'])
print(np.char.replace(rep,'World','NumPy'))
```

## 13.3 练习
```python
strings = np.array(['apple','banana','cherry'])
extra = np.array([' and orange',' and grape',' and kiwi'])
print(np.char.add(strings, extra))
print(np.char.find(strings,'a'))      # 每个字符串首次出现 'a' 位置
print(np.char.upper(strings))
```

# 14 线性代数

## 14.1 基础操作
```python
import numpy as np
A = np.array([[1,2],[3,4]])
B = np.array([[5,6],[7,8]])
print(A @ B)          # 矩阵乘法
print(A.T)            # 转置
print(np.linalg.det(A))
print(np.linalg.inv(A))   # 逆 (det != 0)
```

## 14.2 特征值与特征向量
```python
M = np.array([[2,1],[1,2]])
vals, vecs = np.linalg.eig(M)
print(vals)           # 特征值
print(vecs)           # 列向量为对应特征向量
```

## 14.3 练习
```python
A = np.array([[2,3],[5,4]])
B = np.array([[1,2],[3,2]])
print(A @ B)
print(A.T)
print(np.linalg.inv(A))
C = np.array([[3,1],[1,3]])
print(np.linalg.eig(C))
```

# 15 文件输入输出

## 15.1 读取
```python
# data.txt 内容：以空格分隔数值
arr = np.loadtxt('data.txt')               # 简单规则文本
arr_nan = np.genfromtxt('data_with_nan.txt', filling_values=0)  # 缺失值处理
```

## 15.2 保存
```python
data = np.array([[1,2,3],[4,5,6],[7,8,9]])
np.savetxt('out.csv', data, delimiter=',', fmt='%d')
np.save('data.npy', data)
loaded = np.load('data.npy')
```

## 15.3 练习
```python
d = np.arange(9).reshape(3,3)
np.savetxt('m.txt', d, fmt='%d')
np.save('m.npy', d)
print(np.loadtxt('m.txt'))
print(np.load('m.npy'))
```

# 16 与其他库结合

## 16.1 NumPy ↔ Pandas
```python
import numpy as np, pandas as pd
arr = np.array([[1,2,3],[4,5,6]])
df = pd.DataFrame(arr, columns=['A','B','C'])
print(df.to_numpy())            # 取底层 ndarray
print(np.mean(df, axis=0))      # 利用 NumPy 算列均值
```

## 16.2 NumPy ↔ Matplotlib
```python
import numpy as np, matplotlib.pyplot as plt
x = np.linspace(0,10,200)
plt.plot(x, np.sin(x), label='sin'); plt.plot(x, np.cos(x), label='cos')
plt.legend(); plt.grid(); plt.show()
```
```echarts
{
  "title": {"text": "sin / cos 示意"},
  "tooltip": {"trigger": "axis"},
  "xAxis": {"type": "category", "data": ["0","π/2","π","3π/2","2π"]},
  "yAxis": {"type": "value"},
  "legend": {"data": ["sin","cos"]},
  "series": [
    {"type": "line","name":"sin","data":[0,1,0,-1,0]},
    {"type": "line","name":"cos","data":[1,0,-1,0,1]}
  ]
}
```

## 16.3 NumPy ↔ SciPy
```python
from scipy.linalg import inv
A = np.array([[1,2],[3,4]])
print(inv(A))                   # 更丰富线性代数工具

from scipy.optimize import minimize
def f(x): return x**2 + 3*x + 2
res = minimize(f, 0)
print(res.x)                   # 最优点

from scipy.interpolate import interp1d
x = np.array([1,2,3,4]); y = x**2
f = interp1d(x,y,kind='linear')
x_new = np.linspace(1,4,8)
print(f(x_new))
```

## 16.4 练习
```python
import numpy as np, pandas as pd, matplotlib.pyplot as plt
from scipy import stats

df = pd.DataFrame(np.array([[1,2,3],[4,5,6]]), columns=['A','B','C'])
print(df)
x = np.linspace(0,10,100); plt.plot(x,np.cos(x)); plt.show()

# 正态分布拟合
samples = np.random.normal(0,1,1000)
count,bins,_ = plt.hist(samples,30,density=True)
pdf = stats.norm.pdf(bins,0,1)
plt.plot(bins,pdf,'r-'); plt.show()
```


# 17 NumPy的性能优化

## 17.1 性能技巧概述
- 使用矢量化 (避免 Python `for` 循环)：底层 C/Fortran 实现。
- 利用广播：无需显式扩展数组。
- 合理 `dtype`：精度足够时用 `float32` 减少内存与缓存压力。
- 内置函数 (`np.sum`, `np.mean`, `np.dot`) 优于手写循环。
- 避免频繁创建临时对象：链式操作可分步减少峰值内存。
- 使用 `inplace` 替换（可行时）：如 `a += b`。
- 大规模随机需设种子 `np.random.seed()` 保复现。
- 使用 `np.memmap` 处理超大数据盘上映射。

## 17.2 示例对比
```python
import numpy as np, time

N = 1_000_000
a = np.random.rand(N); b = np.random.rand(N)

# 矢量化
t0 = time.time()
c = a + b
print("vectorized:", time.time() - t0)

# 循环
t0 = time.time()
res = [a[i] + b[i] for i in range(N)]
print("python loop:", time.time() - t0)

# dtype 控制
x64 = np.random.rand(N).astype(np.float64)
x32 = np.random.rand(N).astype(np.float32)
print(x64.nbytes, x32.nbytes)  # 内存差距
```

## 17.3 广播 & 内置
```python
v = np.arange(5)
print(v + 10)          # 广播标量
M = np.arange(12).reshape(3,4)
row_mean = M.mean(axis=1)
col_sum  = M.sum(axis=0)
```

## 17.4 练习
```python
a = np.random.rand(1_000_000)
b = np.random.rand(1_000_000)
c = a + b
mean_val = np.mean(a)
print(mean_val, c[:3])
```

```echarts
{
  "title": {"text": "性能示意(相对耗时)"},
  "tooltip": {},
  "xAxis": {"type": "category", "data": ["vectorized","loop"]},
  "yAxis": {"type": "value"},
  "series": [
    {"type": "bar","name":"time_ratio","data":[1,30]}
  ]
}
```

# 18 实际案例分析

## 18.1 数据预处理与清洗
关键步骤：缺失值识别→填充→去重→类型转换→统计。
```python
import numpy as np, pandas as pd

data = {
    "Product": ["A","B","C","A","B","C","A",None,"B"],
    "Sales":   [250,150,np.nan,300,200,np.nan,350,400,450],
    "Profit":  [50,30,10,70,20,5,np.nan,80,90],
    "Quantity":[10,5,2,15,7,np.nan,20,25,30]
}
df = pd.DataFrame(data)
miss = df.isnull().sum()
df["Sales"]    = df["Sales"].fillna(df["Sales"].mean())
df["Profit"]   = df["Profit"].fillna(df["Profit"].mean())
df["Quantity"] = df["Quantity"].fillna(df["Quantity"].median())
df["Product"]  = df["Product"].fillna("Unknown")
df = df.drop_duplicates()
df["Sales"] = df["Sales"].astype(float)
df["Profit"] = df["Profit"].astype(float)
df["Quantity"] = df["Quantity"].astype(int)
```

## 18.2 可视化替换
销售额与利润散点、产品总销售、数量分布箱形。
```echarts
{
  "title":{"text":"Sales vs Profit (by Product)"},
  "tooltip":{"trigger":"item"},
  "legend":{},
  "xAxis":{"type":"value","name":"Sales"},
  "yAxis":{"type":"value","name":"Profit"},
  "series":[
    {
      "type":"scatter",
      "name":"points",
      "data":[[250,50],[150,30],[300,70],[200,20],[350,60],[400,80],[450,90]]
    }
  ]
}
```

```echarts
{
  "title": {"text": "Total Sales by Product"},
  "tooltip": {"trigger": "axis"},
  "xAxis": {
    "type": "category",
    "data": ["A", "B", "C", "Unknown"]
  },
  "yAxis": {"type": "value"},
  "series": [
    {
      "name": "Total Sales",
      "type": "bar",
      "data": [900, 800, 600, 400],
      "itemStyle": {
        "color": "#5470C6"
      }
    }
  ]
}
```

```echarts
{
  "title": {"text": "Quantity Distribution (Boxplot)"},
  "tooltip": {"trigger": "item"},
  "xAxis": {
    "type": "category",
    "data": ["A", "B", "C", "Unknown"]
  },
  "yAxis": {"type": "value", "name": "Quantity"},
  "series": [
    {
      "name": "Quantity",
      "type": "boxplot",
      "data": [
        [10, 10, 15, 20, 20],
        [5, 5, 7, 30, 30],
        [2, 2, 7, 12, 12],
        [25, 25, 25, 25, 25]
      ]
    }
  ]
}
```

## 18.3 NumPy统计分析
```python
sales    = df["Sales"].to_numpy()
profit   = df["Profit"].to_numpy()
quantity = df["Quantity"].to_numpy()

mean_sales = sales.mean()
std_sales  = sales.std()
profit_margin = profit / sales
corr = np.corrcoef(sales, profit)[0,1]
total_sales  = sales.sum()
total_profit = profit.sum()
```
```echarts
{
  "title":{"text":"Profit Margin Distribution"},
  "tooltip":{"trigger":"axis"},
  "xAxis":{"type":"category","data":["A1","B1","C1","A2","B2","C2","A3","Unknown","B3"]},
  "yAxis":{"type":"value"},
  "series":[
    {"type":"bar",
     "data":[0.2,0.2,0.033,0.233,0.1,0.033,0.171,0.2,0.2]
    }
  ]
}
```

## 18.4 完整清洗 + 分析核心
```python
import numpy as np, pandas as pd
df = pd.DataFrame(data)
df = (df
      .assign(Sales=lambda d: d["Sales"].fillna(d["Sales"].mean()),
              Profit=lambda d: d["Profit"].fillna(d["Profit"].mean()),
              Quantity=lambda d: d["Quantity"].fillna(d["Quantity"].median()),
              Product=lambda d: d["Product"].fillna("Unknown"))
      .drop_duplicates())
sales, profit = df["Sales"].to_numpy(), df["Profit"].to_numpy()
pm = profit / sales
corr = np.corrcoef(sales, profit)[0,1]
```

# 19 练习题

## 19.1 K-Means 聚类 (简实现)
```python
import numpy as np
np.random.seed(0)
X = np.random.rand(300,2)

def kmeans(X, k, max_iters=100):
    centroids = X[np.random.choice(len(X), k, replace=False)]
    for _ in range(max_iters):
        dist = np.linalg.norm(X[:,None] - centroids, axis=2)   # shape (n,k)
        labels = dist.argmin(axis=1)
        new_centroids = np.array([X[labels==i].mean(axis=0) for i in range(k)])
        if np.allclose(centroids, new_centroids, atol=1e-6):
            break
        centroids = new_centroids
    return labels, centroids

labels, centers = kmeans(X, 3)
```
```echarts
{
  "title":{"text":"K-Means 聚类示意"},
  "xAxis":{"type":"value"},
  "yAxis":{"type":"value"},
  "series":[
    {"type":"scatter","name":"cluster0","data":[[0.1,0.2],[0.15,0.25]]},
    {"type":"scatter","name":"cluster1","data":[[0.7,0.8],[0.75,0.77]]},
    {"type":"scatter","name":"cluster2","data":[[0.4,0.5],[0.45,0.55]]},
    {"type":"scatter","name":"centroids","data":[[0.13,0.23],[0.72,0.78],[0.43,0.53]],
     "symbolSize":14,"itemStyle":{"color":"red"}}
  ]
}
```

## 19.2 PCA 降维
```python
data = np.random.rand(100,5)
centered = data - data.mean(axis=0)
cov = np.cov(centered, rowvar=False)
eigvals, eigvecs = np.linalg.eig(cov)
top = eigvecs[:, eigvals.argsort()[-2:]]   # 取最大两主成分
reduced = centered @ top
```
```echarts
{
  "title":{"text":"PCA 前两主成分散点"},
  "xAxis":{"type":"value","name":"PC1"},
  "yAxis":{"type":"value","name":"PC2"},
  "series":[
    {"type":"scatter","data":[[0.1,0.05],[0.2,-0.03],[0.15,0.08]]}
  ]
}
```

## 19.3 时间序列移动平均
```python
import pandas as pd, numpy as np
dates = pd.date_range("2021-01-01", periods=100)
values = np.random.rand(100) * 100
ts = pd.Series(values, index=dates)
ma7 = ts.rolling(7).mean()
```
```echarts
{
  "title":{"text":"7日移动平均示意"},
  "tooltip":{"trigger":"axis"},
  "legend":{"data":["raw","ma7"]},
  "xAxis":{"type":"category","data":["d1","d20","d40","d60","d80","d100"]},
  "yAxis":{"type":"value"},
  "series":[
    {"type":"line","name":"raw","data":[50,60,55,65,58,62]},
    {"type":"line","name":"ma7","data":[52,57,56,60,59,61]}
  ]
}
```

## 19.4 标准化与归一化
```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler
data = np.random.rand(10,2) * 100
std = StandardScaler().fit_transform(data)
norm = MinMaxScaler().fit_transform(data)
```

## 19.5 t 检验
```python
from scipy import stats
s1 = np.random.normal(50,10,100)
s2 = np.random.normal(55,10,100)
t_stat, p_val = stats.ttest_ind(s1, s2)
```

## 19.6 自定义函数作用于数组
```python
def custom_operation(x):
    return np.sin(x) + np.log1p(x)  # log1p(x) 安全处理 x≈0
x = np.linspace(0,10,100)
y = custom_operation(x)
```
```echarts
{
  "title":{"text":"f(x)=sin(x)+log(1+x)"},
  "xAxis":{"type":"category","data":["0","2","4","6","8","10"]},
  "yAxis":{"type":"value"},
  "series":[{"type":"line","data":[0,1.46,1.03,0.42,0.97,1.30]}]
}
```

## 19.7 多维数组列归一化
```python
def normalize(col):
    return (col - col.min()) / (col.max() - col.min() + 1e-12)
data = np.random.rand(5,3) * 100
norm_cols = np.apply_along_axis(normalize, 0, data)
```

## 19.8 多项式拟合
```python
x = np.linspace(0,10,30)
y = 2*x + np.random.randn(30)*2
coef = np.polyfit(x,y,1)
poly = np.poly1d(coef)
y_fit = poly(x)
```
```echarts
{
  "title":{"text":"线性拟合示意"},
  "xAxis":{"type":"value"},
  "yAxis":{"type":"value"},
  "series":[
    {"type":"scatter","data":[[0,0],[5,11],[10,19]]},
    {"type":"line","data":[[0,1],[10,20]]}
  ]
}
```

## 19.9 DBSCAN 聚类 (调用库版)
```python
from sklearn.datasets import make_moons
from sklearn.cluster import DBSCAN
X, _ = make_moons(n_samples=300, noise=0.1)
labels = DBSCAN(eps=0.2, min_samples=5).fit_predict(X)
```
```echarts
{
  "title":{"text":"DBSCAN 聚类示意"},
  "xAxis":{"type":"value"},
  "yAxis":{"type":"value"},
  "series":[
    {"type":"scatter","name":"clusterA","data":[[0.1,0.2],[0.2,0.25]]},
    {"type":"scatter","name":"clusterB","data":[[1.0,0.3],[0.9,0.35]]}
  ]
}
```

## 19.10 ARIMA 时间序列预测 (简示)
```python
import numpy as np, pandas as pd
from statsmodels.tsa.arima.model import ARIMA
series = np.random.randn(100).cumsum()
dates = pd.date_range("2021-01-01", periods=100)
ts = pd.Series(series, index=dates)
model = ARIMA(ts, order=(1,1,1)).fit()
forecast = model.forecast(steps=10)
```
```echarts
{
  "title":{"text":"ARIMA 预测示意"},
  "xAxis":{"type":"category","data":["t90","t92","t94","t96","t98","t100","t101","t102","t103","t104","t105"]},
  "yAxis":{"type":"value"},
  "legend":{"data":["actual","forecast"]},
  "series":[
    {"type":"line","name":"actual","data":[90,91,92,93,94,95]},
    {"type":"line","name":"forecast","data":[95.2,95.4,95.6,95.7,95.8]}
  ]
}
```

