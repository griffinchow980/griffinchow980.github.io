---
title: "Pandas"
date: 2024-09-15
---

# Pandas数据处理基础

{{< details "**如何读取和查看数据的基本信息？**" "Pandas" >}}

数据读取和初步检查是数据分析的第一步，需要快速了解数据概况。

**场景**：刚拿到一个CSV文件，需要快速了解数据结构和质量。

```python
import pandas as pd
import numpy as np

# 读取数据（常见格式）
df_csv = pd.read_csv('data.csv', encoding='utf-8')
df_excel = pd.read_excel('data.xlsx', sheet_name='Sheet1')
df_json = pd.read_json('data.json')

# 数据库读取
from sqlalchemy import create_engine
engine = create_engine('mysql+pymysql://user:pass@localhost/db')
df_sql = pd.read_sql('SELECT * FROM table', engine)

# 快速查看数据
print(df.head())        # 前5行
print(df.tail(10))      # 后10行
print(df.sample(5))     # 随机5行

# 数据概览
print(df.info())        # 列类型、非空值数量、内存占用
print(df.describe())    # 数值列的统计摘要
print(df.shape)         # (行数, 列数)
print(df.columns)       # 列名列表
print(df.dtypes)        # 每列的数据类型

# 检查数据质量
print(df.isnull().sum())                    # 每列的缺失值数量
print(df.duplicated().sum())                # 重复行数量
print(df.nunique())                         # 每列的唯一值数量

# 内存优化检查
print(df.memory_usage(deep=True))           # 每列的内存占用
print(f"Total: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
```

**数据质量报告函数**：

```python
def data_quality_report(df):
    """
    生成数据质量报告
    """
    report = pd.DataFrame({
        '列名': df.columns,
        '数据类型': df.dtypes.values,
        '非空值': df.notnull().sum().values,
        '空值数量': df.isnull().sum().values,
        '空值占比': (df.isnull().sum() / len(df) * 100).round(2).values,
        '唯一值数': df.nunique().values,
        '重复值': [df[col].duplicated().sum() for col in df.columns]
    })
    
    # 添加示例值
    report['示例值'] = [
        str(df[col].dropna().iloc[0]) if len(df[col].dropna()) > 0 else 'N/A' 
        for col in df.columns
    ]
    
    return report

# 使用示例
report = data_quality_report(df)
print(report)
```

**读取大文件技巧**：

```python
# 分块读取
chunksize = 10000
chunks = []
for chunk in pd.read_csv('large_file.csv', chunksize=chunksize):
    # 对每个块进行处理
    chunk_processed = chunk[chunk['age'] > 18]
    chunks.append(chunk_processed)

df = pd.concat(chunks, ignore_index=True)

# 只读取需要的列
df = pd.read_csv('data.csv', usecols=['col1', 'col2', 'col3'])

# 指定数据类型减少内存
df = pd.read_csv('data.csv', dtype={
    'user_id': 'int32',
    'age': 'int8',
    'category': 'category'
})

# 边读边过滤
df = pd.read_csv('data.csv', 
                 nrows=10000,           # 只读前10000行
                 skiprows=range(1, 100)) # 跳过第1-99行
```

{{< /details >}}

{{< details "**如何进行数据选择和筛选？**" "Pandas" >}}

数据选择是Pandas最常用的操作，需要掌握多种筛选方式。

**基础选择**：

```python
import pandas as pd

# 创建示例数据
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [25, 30, 35, 28, 32],
    'city': ['Beijing', 'Shanghai', 'Beijing', 'Guangzhou', 'Shanghai'],
    'salary': [8000, 12000, 15000, 9000, 11000]
})

# 选择列
df['name']                      # 单列，返回Series
df[['name', 'age']]             # 多列，返回DataFrame

# 选择行（按位置）
df.iloc[0]                      # 第一行
df.iloc[0:3]                    # 前3行（0,1,2）
df.iloc[[0, 2, 4]]              # 特定行

# 选择行（按标签）
df.loc[0]                       # 索引为0的行
df.loc[0:2]                     # 索引0到2（包含2）
df.loc[df['age'] > 30]          # 条件筛选

# 选择行列
df.loc[0:2, ['name', 'age']]    # 行0-2的name和age列
df.iloc[0:3, 0:2]               # 前3行的前2列

# 快速访问单个值
df.at[0, 'name']                # 标签访问
df.iat[0, 0]                    # 位置访问
```

**条件筛选**：

```python
# 单条件
df[df['age'] > 30]
df[df['city'] == 'Beijing']
df[df['salary'] >= 10000]

# 多条件（与）
df[(df['age'] > 25) & (df['salary'] >= 10000)]

# 多条件（或）
df[(df['city'] == 'Beijing') | (df['city'] == 'Shanghai')]

# 取反
df[~(df['age'] > 30)]

# 范围筛选
df[df['age'].between(25, 30)]
df[df['age'].between(25, 30, inclusive='neither')]  # 不包含边界

# IN条件
cities = ['Beijing', 'Shanghai']
df[df['city'].isin(cities)]

# NOT IN
df[~df['city'].isin(cities)]

# 字符串匹配
df[df['name'].str.contains('li')]       # 包含'li'
df[df['name'].str.startswith('A')]      # 以A开头
df[df['name'].str.endswith('e')]        # 以e结尾

# 正则表达式
df[df['name'].str.match(r'^[A-C]')]     # 以A-C开头

# 空值筛选
df[df['age'].isnull()]                  # 空值
df[df['age'].notnull()]                 # 非空值
```

**高级筛选**：

```python
# query方法（更简洁）
df.query('age > 30')
df.query('age > 30 and salary >= 10000')
df.query('city in ["Beijing", "Shanghai"]')
df.query('age > @min_age', local_dict={'min_age': 25})

# 使用变量
threshold = 30
df.query('age > @threshold')

# filter方法（按列名筛选）
df.filter(like='age')                   # 列名包含'age'
df.filter(regex='^na')                  # 列名以na开头
df.filter(items=['name', 'age'])        # 指定列名

# where方法（条件替换）
df.where(df['age'] > 30, 0)             # 不满足条件的替换为0

# mask方法（与where相反）
df.mask(df['age'] > 30, 0)              # 满足条件的替换为0
```

**实战案例：用户筛选**：

```python
# 找出高薪且年轻的一线城市用户
result = df[
    (df['age'] < 30) &
    (df['salary'] >= 10000) &
    (df['city'].isin(['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen']))
]

# 找出名字包含特定字符且薪资在某范围的用户
result = df[
    df['name'].str.contains('a', case=False) &
    df['salary'].between(8000, 12000)
]

# 排除异常值（3倍标准差）
mean = df['salary'].mean()
std = df['salary'].std()
df_cleaned = df[
    (df['salary'] >= mean - 3*std) &
    (df['salary'] <= mean + 3*std)
]
```

{{< /details >}}

{{< details "**如何处理缺失值？**" "Pandas" >}}

缺失值处理是数据清洗的核心任务，需要根据业务场景选择合适的策略。

**识别缺失值**：

```python
import pandas as pd
import numpy as np

# 创建包含缺失值的数据
df = pd.DataFrame({
    'A': [1, 2, np.nan, 4, 5],
    'B': [np.nan, 2, 3, np.nan, 5],
    'C': [1, 2, 3, 4, 5],
    'D': ['a', None, 'c', 'd', 'e']
})

# 检查缺失值
df.isnull()                     # 布尔DataFrame
df.notnull()                    # 非空布尔
df.isnull().sum()               # 每列缺失值数量
df.isnull().sum().sum()         # 总缺失值数量
df.isnull().any()               # 每列是否有缺失值
df.isnull().all()               # 每列是否全是缺失值

# 缺失值可视化统计
missing_stats = pd.DataFrame({
    '缺失数量': df.isnull().sum(),
    '缺失比例': (df.isnull().sum() / len(df) * 100).round(2)
})
print(missing_stats)
```

**删除缺失值**：

```python
# 删除包含缺失值的行
df.dropna()                     # 任意列有缺失就删除
df.dropna(how='all')            # 全部列都是缺失才删除
df.dropna(subset=['A', 'B'])    # 只看A和B列
df.dropna(thresh=3)             # 至少3个非空值才保留

# 删除包含缺失值的列
df.dropna(axis=1)               # 任意行有缺失就删除该列
df.dropna(axis=1, how='all')    # 全部行都是缺失才删除

# 原地修改
df.dropna(inplace=True)
```

**填充缺失值**：

```python
# 固定值填充
df.fillna(0)                            # 全部填0
df.fillna({'A': 0, 'B': -1})            # 不同列填不同值

# 统计值填充
df.fillna(df.mean())                    # 均值填充（仅数值列）
df.fillna(df.median())                  # 中位数填充
df.fillna(df.mode().iloc[0])            # 众数填充

# 前后值填充
df.fillna(method='ffill')               # 前向填充
df.fillna(method='bfill')               # 后向填充
df.fillna(method='ffill', limit=2)      # 最多填充2个连续缺失

# 插值填充
df.interpolate()                        # 线性插值
df.interpolate(method='polynomial', order=2)  # 多项式插值
df.interpolate(method='time')           # 时间序列插值
```

**高级填充策略**：

```python
# 分组填充（按类别用不同均值填充）
df['salary'] = df.groupby('department')['salary'].transform(
    lambda x: x.fillna(x.mean())
)

# 条件填充
df['age'] = df['age'].fillna(
    df['age'].median() if df['age'].median() > 0 else 18
)

# 用其他列的值填充
df['email'] = df['email'].fillna(df['phone'])

# 复杂逻辑填充
def smart_fill(row):
    if pd.isnull(row['value']):
        if row['type'] == 'A':
            return row['value_A']
        elif row['type'] == 'B':
            return row['value_B']
        else:
            return 0
    return row['value']

df['value'] = df.apply(smart_fill, axis=1)
```

**实战案例：用户数据清洗**：

```python
# 场景：用户信息表包含age、income、city等字段
user_df = pd.DataFrame({
    'user_id': range(1, 11),
    'age': [25, np.nan, 30, np.nan, 35, 28, np.nan, 32, 29, 31],
    'income': [8000, 10000, np.nan, 12000, 15000, np.nan, 11000, np.nan, 9000, 13000],
    'city': ['Beijing', None, 'Shanghai', 'Beijing', None, 'Shanghai', 'Guangzhou', 'Beijing', None, 'Shanghai']
})

# 清洗策略
# 1. age缺失：用中位数填充
user_df['age'] = user_df['age'].fillna(user_df['age'].median())

# 2. income缺失：按城市分组填充均值
user_df['income'] = user_df.groupby('city')['income'].transform(
    lambda x: x.fillna(x.mean())
)

# 3. city缺失：用众数填充
user_df['city'] = user_df['city'].fillna(user_df['city'].mode()[0])

# 4. 如果某行缺失过多（>50%），删除
threshold = len(user_df.columns) * 0.5
user_df_cleaned = user_df.dropna(thresh=threshold)

print("清洗前缺失值：")
print(user_df.isnull().sum())

print("\n清洗后缺失值：")
print(user_df_cleaned.isnull().sum())
```

**检测填充合理性**：

```python
# 填充前后对比
print("原始统计：")
print(df['salary'].describe())

df['salary_filled'] = df['salary'].fillna(df['salary'].mean())

print("\n填充后统计：")
print(df['salary_filled'].describe())

# 可视化对比（需要matplotlib）
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
df['salary'].hist(ax=axes[0], bins=20)
axes[0].set_title('填充前分布')

df['salary_filled'].hist(ax=axes[1], bins=20)
axes[1].set_title('填充后分布')

plt.tight_layout()
plt.show()
```

{{< /details >}}

{{< details "**如何进行数据分组聚合？**" "Pandas" >}}

分组聚合是数据分析的核心操作，用于计算各类别的统计指标。

**基础分组**：

```python
import pandas as pd

# 示例数据
df = pd.DataFrame({
    'department': ['Sales', 'Sales', 'IT', 'IT', 'HR', 'HR'],
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'],
    'salary': [8000, 9000, 12000, 13000, 7000, 7500],
    'age': [25, 30, 35, 28, 32, 29],
    'performance': [85, 90, 88, 92, 78, 82]
})

# 单列分组
grouped = df.groupby('department')

# 多列分组
grouped_multi = df.groupby(['department', 'age'])

# 查看分组
for name, group in grouped:
    print(f"\n{name}:")
    print(group)

# 获取单个组
sales_group = grouped.get_group('Sales')
```

**聚合函数**：

```python
# 单个聚合
df.groupby('department')['salary'].mean()
df.groupby('department')['salary'].sum()
df.groupby('department')['salary'].max()
df.groupby('department')['salary'].min()
df.groupby('department')['salary'].count()
df.groupby('department')['salary'].std()

# 多个聚合
df.groupby('department')['salary'].agg(['mean', 'sum', 'count'])

# 不同列用不同聚合
df.groupby('department').agg({
    'salary': ['mean', 'sum'],
    'age': ['min', 'max'],
    'performance': 'mean'
})

# 自定义聚合函数
def salary_range(x):
    return x.max() - x.min()

df.groupby('department')['salary'].agg([
    'mean',
    ('salary_range', salary_range),
    ('top_salary', 'max')
])

# lambda函数
df.groupby('department')['salary'].agg([
    ('avg', 'mean'),
    ('range', lambda x: x.max() - x.min()),
    ('top3_avg', lambda x: x.nlargest(3).mean())
])
```

**transform方法**：

```python
# 将分组结果广播回原DataFrame
df['dept_avg_salary'] = df.groupby('department')['salary'].transform('mean')

df['salary_rank_in_dept'] = df.groupby('department')['salary'].rank(ascending=False)

df['dept_count'] = df.groupby('department')['salary'].transform('count')

# 与组内均值的偏差
df['salary_deviation'] = df['salary'] - df.groupby('department')['salary'].transform('mean')

print(df)
```

**filter方法**：

```python
# 过滤组
# 保留平均工资>8000的部门
df.groupby('department').filter(lambda x: x['salary'].mean() > 8000)

# 保留人数>=2的部门
df.groupby('department').filter(lambda x: len(x) >= 2)

# 保留最高工资>10000的部门
df.groupby('department').filter(lambda x: x['salary'].max() > 10000)
```

**实战案例：销售分析**：

```python
# 销售数据
sales_df = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=100),
    'region': np.random.choice(['North', 'South', 'East', 'West'], 100),
    'product': np.random.choice(['A', 'B', 'C'], 100),
    'sales_amount': np.random.randint(1000, 10000, 100),
    'quantity': np.random.randint(1, 20, 100)
})

# 1. 按地区统计总销售额和平均单价
region_summary = sales_df.groupby('region').agg({
    'sales_amount': ['sum', 'mean', 'count'],
    'quantity': 'sum'
})
region_summary.columns = ['_'.join(col) for col in region_summary.columns]
region_summary['avg_price'] = region_summary['sales_amount_sum'] / region_summary['quantity_sum']
print(region_summary)

# 2. 按地区和产品交叉统计
pivot_summary = sales_df.pivot_table(
    values='sales_amount',
    index='region',
    columns='product',
    aggfunc=['sum', 'mean'],
    fill_value=0,
    margins=True  # 添加总计行列
)
print(pivot_summary)

# 3. 时间序列分组（按月）
sales_df['month'] = sales_df['date'].dt.to_period('M')
monthly_sales = sales_df.groupby('month').agg({
    'sales_amount': 'sum',
    'quantity': 'sum'
})
monthly_sales['unit_price'] = monthly_sales['sales_amount'] / monthly_sales['quantity']
print(monthly_sales)

# 4. 多维分组：地区+产品+月份
multi_dim = sales_df.groupby([
    sales_df['date'].dt.to_period('M'),
    'region',
    'product'
])['sales_amount'].sum().unstack(fill_value=0)
print(multi_dim)

# 5. 动态排名：每个地区销售额Top3的日期
top_days = sales_df.groupby('region').apply(
    lambda x: x.nlargest(3, 'sales_amount')[['date', 'sales_amount']]
).reset_index(drop=True)
print(top_days)

# 6. 累计计算
sales_df_sorted = sales_df.sort_values(['region', 'date'])
sales_df_sorted['cumulative_sales'] = sales_df_sorted.groupby('region')['sales_amount'].cumsum()
sales_df_sorted['rolling_avg_7d'] = sales_df_sorted.groupby('region')['sales_amount'].transform(
    lambda x: x.rolling(window=7, min_periods=1).mean()
)
```

**性能优化技巧**：

```python
# 1. 使用observed=True（分类数据）
df['department'] = df['department'].astype('category')
df.groupby('department', observed=True)['salary'].mean()

# 2. 使用agg替代多次聚合
# 慢
mean_salary = df.groupby('department')['salary'].mean()
sum_salary = df.groupby('department')['salary'].sum()

# 快
result = df.groupby('department')['salary'].agg(['mean', 'sum'])

# 3. 使用numba加速自定义聚合（大数据）
from numba import jit

@jit
def custom_agg(arr):
    return arr.max() - arr.min()

# 可以结合groupby使用
```

{{< /details >}}

# Pandas数据合并与重塑

{{< details "**如何合并多个DataFrame？**" "Pandas" >}}

数据合并是将来自不同源的数据整合在一起，类似SQL的JOIN操作。

**三种合并方法对比**：

| 特性 | merge | concat | join |
|------|-------|--------|------|
| **主要用途** | 基于列值连接（SQL JOIN） | 拼接（堆叠） | 基于索引连接 |
| **连接依据** | 指定列（`on`） | 行/列索引 | DataFrame索引 |
| **方向** | 根据键值匹配 | 纵向（axis=0）或横向（axis=1） | 横向（列合并） |
| **连接类型** | inner/left/right/outer | 默认outer | left/right/outer/inner |
| **性能** | 中等 | 快（简单拼接） | 快（索引优化） |
| **适用场景** | 多表关联（如订单-用户） | 批量数据追加 | 索引对齐合并 |
| **SQL对应** | JOIN | UNION ALL | JOIN ON index |
| **典型用法** | `pd.merge(df1, df2, on='key')` | `pd.concat([df1, df2])` | `df1.join(df2)` |

**merge合并（类似SQL JOIN）**：

```python
import pandas as pd

# 示例数据
users = pd.DataFrame({
    'user_id': [1, 2, 3, 4],
    'name': ['Alice', 'Bob', 'Charlie', 'David']
})

orders = pd.DataFrame({
    'order_id': [101, 102, 103, 104, 105],
    'user_id': [1, 1, 2, 3, 5],
    'amount': [100, 150, 200, 120, 180]
})

# 内连接（INNER JOIN）
inner_merged = pd.merge(users, orders, on='user_id', how='inner')
print("内连接：")
print(inner_merged)

# 左连接（LEFT JOIN）
left_merged = pd.merge(users, orders, on='user_id', how='left')
print("\n左连接：")
print(left_merged)

# 右连接（RIGHT JOIN）
right_merged = pd.merge(users, orders, on='user_id', how='right')
print("\n右连接：")
print(right_merged)

# 外连接（FULL OUTER JOIN）
outer_merged = pd.merge(users, orders, on='user_id', how='outer')
print("\n外连接：")
print(outer_merged)

# 不同列名连接
users2 = users.rename(columns={'user_id': 'uid'})
merged = pd.merge(users2, orders, left_on='uid', right_on='user_id')

# 多列连接
df1 = pd.DataFrame({
    'key1': ['A', 'A', 'B', 'B'],
    'key2': [1, 2, 1, 2],
    'value1': [10, 20, 30, 40]
})

df2 = pd.DataFrame({
    'key1': ['A', 'A', 'B', 'C'],
    'key2': [1, 2, 2, 1],
    'value2': [100, 200, 300, 400]
})

merged_multi = pd.merge(df1, df2, on=['key1', 'key2'], how='outer')
```

**concat拼接**：

```python
# 纵向拼接（行拼接）
df1 = pd.DataFrame({'A': [1, 2], 'B': [3, 4]})
df2 = pd.DataFrame({'A': [5, 6], 'B': [7, 8]})

# 直接拼接
result = pd.concat([df1, df2])
print("纵向拼接：")
print(result)

# 重置索引
result = pd.concat([df1, df2], ignore_index=True)

# 横向拼接（列拼接）
df3 = pd.DataFrame({'C': [9, 10], 'D': [11, 12]})
result = pd.concat([df1, df3], axis=1)
print("\n横向拼接：")
print(result)

# 带标签的拼接
result = pd.concat([df1, df2], keys=['batch1', 'batch2'])
print("\n多层索引拼接：")
print(result)

# 只保留共同列
df_diff_cols = pd.DataFrame({'A': [7, 8], 'C': [9, 10]})
result = pd.concat([df1, df_diff_cols], join='inner')
```

**join方法（基于索引）**：

```python
# 准备数据（设置索引）
df_left = pd.DataFrame({
    'value1': [1, 2, 3]
}, index=['A', 'B', 'C'])

df_right = pd.DataFrame({
    'value2': [4, 5, 6]
}, index=['A', 'B', 'D'])

# 基于索引join
result = df_left.join(df_right, how='outer')
print("基于索引join：")
print(result)

# 多DataFrame join
df1 = pd.DataFrame({'A': [1, 2]}, index=[0, 1])
df2 = pd.DataFrame({'B': [3, 4]}, index=[0, 1])
df3 = pd.DataFrame({'C': [5, 6]}, index=[0, 1])

result = df1.join([df2, df3])
```

**实战案例：多表关联分析**：

```python
# 场景：分析用户购买行为
# 表1：用户信息
users = pd.DataFrame({
    'user_id': [1, 2, 3, 4, 5],
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'city': ['Beijing', 'Shanghai', 'Beijing', 'Guangzhou', 'Shanghai'],
    'vip_level': [1, 2, 1, 3, 2]
})

# 表2：订单信息
orders = pd.DataFrame({
    'order_id': [101, 102, 103, 104, 105, 106],
    'user_id': [1, 1, 2, 3, 3, 5],
    'order_date': pd.date_range('2024-01-01', periods=6),
    'amount': [100, 150, 200, 120, 180, 90]
})

# 表3：产品信息
products = pd.DataFrame({
    'order_id': [101, 102, 103, 104, 105, 106],
    'product_id': ['P1', 'P2', 'P1', 'P3', 'P2', 'P1'],
    'product_name': ['手机', '电脑', '手机', '平板', '电脑', '手机'],
    'category': ['电子', '电子', '电子', '电子', '电子', '电子']
})

# Step 1: 关联订单和用户
merged_data = pd.merge(orders, users, on='user_id', how='left')

# Step 2: 关联产品信息
merged_data = pd.merge(merged_data, products, on='order_id', how='left')

print("完整关联数据：")
print(merged_data.head())

# Step 3: 分析
# 每个城市的销售额
city_sales = merged_data.groupby('city')['amount'].agg(['sum', 'mean', 'count'])
print("\n各城市销售统计：")
print(city_sales)

# VIP等级的购买力
vip_analysis = merged_data.groupby('vip_level').agg({
    'amount': ['sum', 'mean'],
    'order_id': 'count'
})
vip_analysis.columns = ['总消费', '平均订单金额', '订单数']
print("\nVIP分析：")
print(vip_analysis)

# 产品销售排行
product_rank = merged_data.groupby('product_name')['amount'].agg([
    ('销售额', 'sum'),
    ('订单数', 'count')
]).sort_values('销售额', ascending=False)
print("\n产品销售排行：")
print(product_rank)

# 用户消费明细（加入统计列）
user_summary = merged_data.groupby('user_id').agg({
    'amount': ['sum', 'mean', 'count'],
    'product_id': lambda x: x.nunique()
})
user_summary.columns = ['总消费', '平均订单', '订单数', '购买产品种类']

# 关联回用户表
final_report = pd.merge(users, user_summary, on='user_id', how='left')
final_report = final_report.fillna(0)
print("\n用户消费汇总：")
print(final_report)
```

**合并性能优化**：

```python
# 1. 提前过滤数据
filtered_orders = orders[orders['amount'] > 100]
merged = pd.merge(users, filtered_orders, on='user_id')

# 2. 使用分类类型
users['city'] = users['city'].astype('category')

# 3. 设置索引加速（频繁merge）
users_indexed = users.set_index('user_id')
orders_indexed = orders.set_index('user_id')
merged = users_indexed.join(orders_indexed, how='left')

# 4. 批量merge
# 慢
result = df1
for df in [df2, df3, df4]:
    result = pd.merge(result, df, on='key')

# 快
from functools import reduce
dfs = [df1, df2, df3, df4]
result = reduce(lambda left, right: pd.merge(left, right, on='key'), dfs)
```

{{< /details >}}

{{< details "**如何进行数据透视和重塑？**" "Pandas" >}}

数据透视可以将长格式数据转为宽格式，重塑可以将宽格式转为长格式。

**pivot_table透视表**：

```python
import pandas as pd
import numpy as np

# 示例数据
sales = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=12),
    'region': ['North', 'South'] * 6,
    'product': ['A', 'B', 'A', 'B'] * 3,
    'sales': np.random.randint(100, 500, 12),
    'units': np.random.randint(10, 50, 12)
})

# 基础透视
pivot1 = sales.pivot_table(
    values='sales',
    index='region',
    columns='product',
    aggfunc='sum'
)
print("基础透视：")
print(pivot1)

# 多层索引
pivot2 = sales.pivot_table(
    values='sales',
    index=['region', sales['date'].dt.month],
    columns='product',
    aggfunc='sum'
)
print("\n多层索引透视：")
print(pivot2)

# 多个聚合值
pivot3 = sales.pivot_table(
    values=['sales', 'units'],
    index='region',
    columns='product',
    aggfunc='sum'
)
print("\n多值透视：")
print(pivot3)

# 多个聚合函数
pivot4 = sales.pivot_table(
    values='sales',
    index='region',
    columns='product',
    aggfunc=['sum', 'mean', 'count']
)
print("\n多聚合函数：")
print(pivot4)

# 添加边际合计
pivot5 = sales.pivot_table(
    values='sales',
    index='region',
    columns='product',
    aggfunc='sum',
    margins=True,           # 添加总计
    margins_name='总计'
)
print("\n带总计的透视：")
print(pivot5)

# 填充缺失值
pivot6 = sales.pivot_table(
    values='sales',
    index='region',
    columns='product',
    aggfunc='sum',
    fill_value=0
)
```

**pivot简单透视**：

```python
# pivot不进行聚合，要求index+columns唯一
df = pd.DataFrame({
    'date': ['2024-01-01', '2024-01-01', '2024-01-02', '2024-01-02'],
    'product': ['A', 'B', 'A', 'B'],
    'sales': [100, 150, 120, 180]
})

pivot_simple = df.pivot(
    index='date',
    columns='product',
    values='sales'
)
print("简单透视：")
print(pivot_simple)
```

**melt逆透视（宽转长）**：

```python
# 宽格式数据
wide_df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'Q1': [100, 120, 110],
    'Q2': [110, 130, 115],
    'Q3': [105, 125, 120],
    'Q4': [115, 135, 125]
})

# 转为长格式
long_df = pd.melt(
    wide_df,
    id_vars=['name'],           # 保持不变的列
    value_vars=['Q1', 'Q2', 'Q3', 'Q4'],  # 要转换的列
    var_name='quarter',         # 新列名（原列名）
    value_name='sales'          # 新列名（值）
)
print("宽转长：")
print(long_df)

# 所有列都转
long_df2 = pd.melt(wide_df, id_vars=['name'])
```

**stack和unstack**：

```python
# unstack: 将行索引转为列索引
df = pd.DataFrame({
    'region': ['North', 'North', 'South', 'South'],
    'product': ['A', 'B', 'A', 'B'],
    'sales': [100, 150, 120, 180]
})

df_indexed = df.set_index(['region', 'product'])
unstacked = df_indexed.unstack()
print("unstack效果：")
print(unstacked)

# stack: 将列索引转为行索引
stacked = unstacked.stack()
print("\nstack还原：")
print(stacked)

# 处理多层列索引
df_multi_col = pd.DataFrame({
    ('sales', 'A'): [100, 120],
    ('sales', 'B'): [150, 180],
    ('units', 'A'): [10, 12],
    ('units', 'B'): [15, 18]
}, index=['North', 'South'])

# 调整层级
swapped = df_multi_col.swaplevel(axis=1)
sorted_df = df_multi_col.sort_index(axis=1)
```

**实战案例：销售报表生成**：

```python
# 原始数据：销售明细
np.random.seed(42)
sales_detail = pd.DataFrame({
    'date': pd.date_range('2024-01-01', periods=90),
    'region': np.random.choice(['North', 'South', 'East', 'West'], 90),
    'product': np.random.choice(['A', 'B', 'C'], 90),
    'channel': np.random.choice(['Online', 'Offline'], 90),
    'sales': np.random.randint(1000, 10000, 90),
    'cost': np.random.randint(500, 5000, 90)
})

# 添加月份
sales_detail['month'] = sales_detail['date'].dt.to_period('M')

# 任务1：按地区和产品的销售透视表
report1 = sales_detail.pivot_table(
    values='sales',
    index='region',
    columns='product',
    aggfunc='sum',
    margins=True
)
print("地区×产品销售额：")
print(report1)

# 任务2：按月份和渠道的多指标透视
report2 = sales_detail.pivot_table(
    values=['sales', 'cost'],
    index='month',
    columns='channel',
    aggfunc={'sales': 'sum', 'cost': 'sum'}
)
# 计算利润
report2['利润率'] = ((report2['sales'] - report2['cost']) / report2['sales'] * 100).round(2)
print("\n月度渠道分析：")
print(report2)

# 任务3：多维透视（地区+产品+渠道）
report3 = sales_detail.pivot_table(
    values='sales',
    index=['region', 'product'],
    columns='channel',
    aggfunc='sum',
    fill_value=0
)
report3['总计'] = report3.sum(axis=1)
print("\n多维销售透视：")
print(report3)

# 任务4：生成交叉表（crosstab）
cross_tab = pd.crosstab(
    index=[sales_detail['region'], sales_detail['product']],
    columns=sales_detail['channel'],
    values=sales_detail['sales'],
    aggfunc='sum',
    margins=True,
    normalize='all'  # 显示占比
)
print("\n交叉占比分析：")
print((cross_tab * 100).round(2))

# 任务5：从透视表还原明细
# 使用reset_index将多层索引展开
restored = report3.reset_index()
melted = pd.melt(
    restored,
    id_vars=['region', 'product'],
    value_vars=['Online', 'Offline'],
    var_name='channel',
    value_name='sales'
)
print("\n还原长格式：")
print(melted.head())
```

**透视表美化输出**：

```python
# 带样式的透视表
pivot_styled = sales_detail.pivot_table(
    values='sales',
    index='region',
    columns='product',
    aggfunc='sum'
).style\
    .background_gradient(cmap='YlGnBu')\
    .format('{:.0f}')\
    .set_caption('销售额热力图')

# 导出为HTML
pivot_styled.to_html('sales_report.html')

# 导出为Excel（保留格式）
with pd.ExcelWriter('sales_report.xlsx', engine='openpyxl') as writer:
    pivot_styled.to_excel(writer, sheet_name='销售透视')
```

{{< /details >}}

{{< details "**如何进行时间序列处理？**" "Pandas" >}}

时间序列是数据分析中的重要场景，Pandas提供了强大的日期时间处理功能。

**日期时间创建与转换**：

```python
import pandas as pd
import numpy as np

# 创建日期时间
date1 = pd.Timestamp('2024-01-01')
date2 = pd.Timestamp('2024-01-01 12:30:45')
date3 = pd.to_datetime('2024/01/01')

# 字符串转日期
df = pd.DataFrame({
    'date_str': ['2024-01-01', '2024-01-02', '2024-01-03'],
    'value': [100, 150, 120]
})
df['date'] = pd.to_datetime(df['date_str'])

# 多种格式转换
dates = pd.to_datetime(['2024-01-01', '01/02/2024', '2024.01.03'], 
                       format='mixed')

# Unix时间戳转换
timestamps = [1704067200, 1704153600, 1704240000]
dates_from_ts = pd.to_datetime(timestamps, unit='s')

# 日期范围生成
date_range1 = pd.date_range('2024-01-01', '2024-01-31', freq='D')     # 按天
date_range2 = pd.date_range('2024-01-01', periods=12, freq='MS')       # 按月初
date_range3 = pd.date_range('2024-01-01', periods=24, freq='H')        # 按小时
date_range4 = pd.bdate_range('2024-01-01', periods=20)                 # 工作日
```

**日期时间属性提取**：

```python
# 创建带日期的DataFrame
df = pd.DataFrame({
    'datetime': pd.date_range('2024-01-01', periods=100, freq='6H'),
    'value': np.random.randint(100, 200, 100)
})

# 提取各部分
df['year'] = df['datetime'].dt.year
df['month'] = df['datetime'].dt.month
df['day'] = df['datetime'].dt.day
df['hour'] = df['datetime'].dt.hour
df['dayofweek'] = df['datetime'].dt.dayofweek       # 0=周一
df['day_name'] = df['datetime'].dt.day_name()       # Monday
df['quarter'] = df['datetime'].dt.quarter
df['is_month_end'] = df['datetime'].dt.is_month_end
df['is_weekend'] = df['datetime'].dt.dayofweek >= 5

# 周期处理
df['year_month'] = df['datetime'].dt.to_period('M')
df['year_week'] = df['datetime'].dt.to_period('W')

print(df.head())
```

**时间序列操作**：

```python
# 设置日期为索引
df = df.set_index('datetime')

# 日期范围筛选
df_jan = df['2024-01']                              # 2024年1月
df_range = df['2024-01-05':'2024-01-10']            # 日期范围
df_specific = df.loc['2024-01-01 06:00':'2024-01-01 18:00']

# 重采样（Resample）
daily_avg = df['value'].resample('D').mean()        # 按天聚合平均
weekly_sum = df['value'].resample('W').sum()        # 按周聚合求和
monthly_stats = df['value'].resample('MS').agg(['sum', 'mean', 'max', 'min'])

# 前向填充（工作日到日历日）
daily_data = df['value'].resample('D').asfreq()
daily_filled = daily_data.fillna(method='ffill')

# 移动窗口
df['MA_7'] = df['value'].rolling(window=7).mean()              # 7天移动平均
df['MA_7_center'] = df['value'].rolling(window=7, center=True).mean()

# 指数加权移动平均
df['EMA_7'] = df['value'].ewm(span=7).mean()

# 差分
df['diff_1'] = df['value'].diff(1)                  # 一阶差分
df['pct_change'] = df['value'].pct_change()         # 百分比变化

# 时间偏移
df['next_day'] = df['value'].shift(-1)              # 前移（看未来）
df['prev_day'] = df['value'].shift(1)               # 后移（看过去）
```

**实战案例：股票数据分析**：

```python
# 模拟股票数据
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=252, freq='B')  # 一年交易日
stock_df = pd.DataFrame({
    'date': dates,
    'open': 100 + np.random.randn(252).cumsum(),
    'close': 100 + np.random.randn(252).cumsum(),
    'high': 105 + np.random.randn(252).cumsum(),
    'low': 95 + np.random.randn(252).cumsum(),
    'volume': np.random.randint(1000000, 10000000, 252)
})

stock_df['close'] = stock_df['close'].clip(lower=50)  # 确保价格为正
stock_df = stock_df.set_index('date')

# 计算技术指标
# 1. 移动平均线
stock_df['MA5'] = stock_df['close'].rolling(window=5).mean()
stock_df['MA10'] = stock_df['close'].rolling(window=10).mean()
stock_df['MA20'] = stock_df['close'].rolling(window=20).mean()

# 2. 布林带
stock_df['BB_middle'] = stock_df['close'].rolling(window=20).mean()
std_20 = stock_df['close'].rolling(window=20).std()
stock_df['BB_upper'] = stock_df['BB_middle'] + 2 * std_20
stock_df['BB_lower'] = stock_df['BB_middle'] - 2 * std_20

# 3. 日收益率
stock_df['daily_return'] = stock_df['close'].pct_change()

# 4. 累计收益率
stock_df['cumulative_return'] = (1 + stock_df['daily_return']).cumprod() - 1

# 5. 波动率（20日滚动标准差年化）
stock_df['volatility'] = stock_df['daily_return'].rolling(window=20).std() * np.sqrt(252)

# 6. RSI相对强弱指标
delta = stock_df['close'].diff()
gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
rs = gain / loss
stock_df['RSI'] = 100 - (100 / (1 + rs))

# 7. 成交量移动平均
stock_df['volume_MA20'] = stock_df['volume'].rolling(window=20).mean()

# 月度汇总统计
monthly_summary = stock_df.resample('MS').agg({
    'open': 'first',
    'close': 'last',
    'high': 'max',
    'low': 'min',
    'volume': 'sum'
})
monthly_summary['return'] = monthly_summary['close'].pct_change()

print("最近20天数据：")
print(stock_df[['close', 'MA5', 'MA10', 'MA20', 'RSI']].tail(20))

print("\n月度汇总：")
print(monthly_summary)
```

**时区处理**：

```python
# 创建带时区的日期
dates_utc = pd.date_range('2024-01-01', periods=24, freq='H', tz='UTC')

# 转换时区
dates_beijing = dates_utc.tz_convert('Asia/Shanghai')
dates_ny = dates_utc.tz_convert('America/New_York')

# DataFrame中的时区处理
df = pd.DataFrame({
    'datetime_utc': dates_utc,
    'value': range(24)
})

df['datetime_beijing'] = df['datetime_utc'].dt.tz_convert('Asia/Shanghai')
```

{{< /details >}}

# Pandas性能优化

{{< details "**如何优化Pandas代码性能？**" "Pandas" >}}

性能优化对于处理大数据集至关重要，需要从多个角度优化代码。

**向量化操作**：

```python
import pandas as pd
import numpy as np
import time

# 创建测试数据
df = pd.DataFrame({
    'A': np.random.randint(0, 100, 1000000),
    'B': np.random.randint(0, 100, 1000000)
})

# 方法1：循环（慢，不推荐）
start = time.time()
result = []
for i in range(len(df)):
    result.append(df.iloc[i]['A'] + df.iloc[i]['B'])
df['C_loop'] = result
print(f"循环耗时: {time.time() - start:.3f}秒")

# 方法2：向量化（快，推荐）
start = time.time()
df['C_vectorized'] = df['A'] + df['B']
print(f"向量化耗时: {time.time() - start:.3f}秒")

# 方法3：NumPy操作（更快）
start = time.time()
df['C_numpy'] = np.add(df['A'].values, df['B'].values)
print(f"NumPy耗时: {time.time() - start:.3f}秒")
```

**避免使用apply的场景**：

```python
# 慢：使用apply
df['result_slow'] = df.apply(lambda x: x['A'] * 2 + x['B'] * 3, axis=1)

# 快：向量化
df['result_fast'] = df['A'] * 2 + df['B'] * 3

# 条件计算
# 慢
df['category_slow'] = df['A'].apply(lambda x: 'High' if x > 50 else 'Low')

# 快
df['category_fast'] = np.where(df['A'] > 50, 'High', 'Low')
# 或使用cut
df['category_cut'] = pd.cut(df['A'], bins=[0, 50, 100], labels=['Low', 'High'])
```

**数据类型优化**：

```python
# 检查当前内存占用
print(f"原始内存: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")

# 优化整数类型
df['A'] = df['A'].astype('int8')    # 0-255范围可用int8
df['B'] = df['B'].astype('int16')   # 更大范围用int16

# 优化浮点类型
df_float = pd.DataFrame({'col': np.random.rand(1000000)})
df_float['col'] = df_float['col'].astype('float32')  # float64→float32

# 分类类型（重复值多）
df_cat = pd.DataFrame({
    'city': np.random.choice(['Beijing', 'Shanghai', 'Guangzhou'], 100000)
})
print(f"object类型: {df_cat.memory_usage(deep=True).sum() / 1024:.2f} KB")

df_cat['city'] = df_cat['city'].astype('category')
print(f"category类型: {df_cat.memory_usage(deep=True).sum() / 1024:.2f} KB")

# 批量优化函数
def optimize_dtypes(df):
    """
    自动优化DataFrame的数据类型
    """
    for col in df.columns:
        col_type = df[col].dtype
        
        if col_type != 'object':
            c_min = df[col].min()
            c_max = df[col].max()
            
            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
            else:
                if c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)
        else:
            # 字符串列，检查是否适合category
            if df[col].nunique() / len(df) < 0.5:  # 唯一值<50%
                df[col] = df[col].astype('category')
    
    return df

df_optimized = optimize_dtypes(df.copy())
print(f"优化后内存: {df_optimized.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
```

**分块处理大文件**：

```python
# 分块读取
def process_large_file(filename, chunksize=100000):
    """
    分块处理大文件
    """
    results = []
    
    for chunk in pd.read_csv(filename, chunksize=chunksize):
        # 对每个chunk进行处理
        chunk_filtered = chunk[chunk['value'] > 100]
        chunk_processed = chunk_filtered.groupby('category')['value'].sum()
        results.append(chunk_processed)
    
    # 合并结果
    final_result = pd.concat(results).groupby(level=0).sum()
    return final_result

# 使用Dask处理超大数据
import dask.dataframe as dd

# 读取大文件
dask_df = dd.read_csv('large_file.csv')

# Dask操作（惰性执行）
result = dask_df.groupby('category')['value'].mean()

# 触发计算
computed_result = result.compute()
```

**索引优化**：

```python
# 设置索引加速查询
df_large = pd.DataFrame({
    'id': range(1000000),
    'value': np.random.rand(1000000)
})

# 无索引查询（慢）
start = time.time()
result = df_large[df_large['id'] == 500000]
print(f"无索引查询: {time.time() - start:.4f}秒")

# 设置索引（快）
df_indexed = df_large.set_index('id')
start = time.time()
result = df_indexed.loc[500000]
print(f"有索引查询: {time.time() - start:.4f}秒")

# 多列索引
df_multi = pd.DataFrame({
    'A': np.repeat(['X', 'Y', 'Z'], 100000),
    'B': np.tile(range(100000), 3),
    'C': np.random.rand(300000)
})

df_multi_indexed = df_multi.set_index(['A', 'B'])
# 查询更快
result = df_multi_indexed.loc[('X', 50000)]
```

**并行处理**：

```python
from multiprocessing import Pool
import pandas as pd

def process_group(args):
    """
    处理单个分组
    """
    name, group = args
    # 复杂计算
    result = group['value'].apply(lambda x: x ** 2 + np.log(x + 1))
    return name, result.sum()

def parallel_groupby(df, n_cores=4):
    """
    并行分组处理
    """
    groups = list(df.groupby('category'))
    
    with Pool(n_cores) as pool:
        results = pool.map(process_group, groups)
    
    return dict(results)

# 使用Pandas内置并行（需要Python 3.8+）
# 注意：实际效果取决于操作类型
df_result = df.groupby('category').parallel_apply(lambda x: x['value'].sum())
```

**高效合并**：

```python
# 大表merge优化
# 1. 提前过滤
df1_filtered = df1[df1['date'] >= '2024-01-01']
merged = pd.merge(df1_filtered, df2, on='key')

# 2. 使用category类型
df1['key'] = df1['key'].astype('category')
df2['key'] = df2['key'].astype('category')

# 3. 避免重复merge
# 慢
result = df1
for df in [df2, df3, df4]:
    result = pd.merge(result, df, on='key')

# 快
from functools import reduce
dfs = [df1, df2, df3, df4]
result = reduce(lambda left, right: pd.merge(left, right, on='key'), dfs)
```

**性能分析工具**：

```python
# 使用%%timeit魔法命令（Jupyter）
# %%timeit
# df['result'] = df['A'] * 2

# 使用line_profiler
# %load_ext line_profiler
# %lprun -f function_name function_name(args)

# 内存分析
from memory_profiler import profile

@profile
def process_data(df):
    df['new_col'] = df['A'] * df['B']
    result = df.groupby('category')['new_col'].sum()
    return result

# Pandas自带性能测试
import pandas as pd

# 查看操作耗时
with pd.option_context('mode.chained_assignment', None):
    # 你的代码
    pass
```

**最佳实践总结**：

1. **向量化优先**：避免循环，使用NumPy操作
2. **数据类型优化**：使用合适的数据类型（int8/int16/category）
3. **分块处理**：大文件分chunk读取
4. **索引利用**：频繁查询的列设置为索引
5. **避免链式赋值**：使用`.loc`显式赋值
6. **合理使用apply**：能向量化的不用apply
7. **并行计算**：利用多核处理
8. **提前过滤**：先筛选再操作

{{< /details >}}

{{< details "**如何进行字符串处理？**" "Pandas" >}}

Pandas提供了强大的字符串处理功能，通过`.str`访问器实现。

**基础字符串操作**：

```python
import pandas as pd

# 示例数据
df = pd.DataFrame({
    'name': ['  Alice  ', 'bob', 'CHARLIE', 'David'],
    'email': ['alice@gmail.com', 'bob@outlook.com', 'charlie@qq.com', 'david@163.com'],
    'phone': ['138-0000-0000', '139-1111-1111', '186-2222-2222', '187-3333-3333']
})

# 大小写转换
df['name_upper'] = df['name'].str.upper()
df['name_lower'] = df['name'].str.lower()
df['name_title'] = df['name'].str.title()        # 首字母大写
df['name_capitalize'] = df['name'].str.capitalize()  # 只第一个字母大写

# 去除空格
df['name_strip'] = df['name'].str.strip()        # 两端
df['name_lstrip'] = df['name'].str.lstrip()      # 左侧
df['name_rstrip'] = df['name'].str.rstrip()      # 右侧

# 替换
df['phone_clean'] = df['phone'].str.replace('-', '')
df['email_domain'] = df['email'].str.replace(r'.*@', '', regex=True)

# 长度
df['name_length'] = df['name'].str.len()

# 切片
df['first_name'] = df['name'].str[:5]
df['last_char'] = df['name'].str[-1]

print(df)
```

**字符串检查与判断**：

```python
# 包含判断
df['is_gmail'] = df['email'].str.contains('gmail')
df['has_138'] = df['phone'].str.contains('138')

# 开头/结尾判断
df['starts_with_A'] = df['name'].str.startswith('A', na=False)
df['ends_with_com'] = df['email'].str.endswith('.com')

# 正则匹配
df['valid_phone'] = df['phone'].str.match(r'^\d{3}-\d{4}-\d{4}$')

# 查找位置
df['at_position'] = df['email'].str.find('@')     # 返回位置，找不到返回-1
df['at_index'] = df['email'].str.index('@')       # 返回位置，找不到报错

# 计数
df['digit_count'] = df['phone'].str.count(r'\d')
```

**字符串拆分与提取**：

```python
# 拆分为列表
df['email_parts'] = df['email'].str.split('@')

# 拆分为多列
df[['username', 'domain']] = df['email'].str.split('@', expand=True)

# 按多个分隔符拆分
df['phone_parts'] = df['phone'].str.split(r'[-/]', expand=False)

# 提取（正则）
df['area_code'] = df['phone'].str.extract(r'^(\d{3})')
df['email_provider'] = df['email'].str.extract(r'@(\w+)\.')

# 提取所有匹配（返回DataFrame）
df['all_numbers'] = df['phone'].str.findall(r'\d+')

# 获取指定位置的元素（拆分后）
df['first_digit'] = df['phone'].str.split('-').str[0]
```

**实战案例：数据清洗**：

```python
# 场景：清洗用户数据
user_df = pd.DataFrame({
    'name': ['  张三  ', 'li si', 'WANG五', '赵六  '],
    'mobile': ['138 0000 0000', '139-1111-1111', '13622222222', '187 3333 3333'],
    'id_card': ['110101199001011234', '310101198512125678', None, '440101197703033456'],
    'address': ['北京市朝阳区xx路100号', '上海市浦东新区yy街200号', '广州市天河区zz大道300号', None]
})

# 1. 清洗姓名：去空格、统一格式
user_df['name_clean'] = user_df['name'].str.strip().str.title()

# 2. 清洗手机号：去除所有非数字字符
user_df['mobile_clean'] = user_df['mobile'].str.replace(r'\D', '', regex=True)

# 3. 验证手机号格式
user_df['mobile_valid'] = user_df['mobile_clean'].str.match(r'^1[3-9]\d{9}$')

# 4. 从身份证提取信息
user_df['birth_year'] = user_df['id_card'].str[6:10]
user_df['birth_month'] = user_df['id_card'].str[10:12]
user_df['birth_day'] = user_df['id_card'].str[12:14]
user_df['gender'] = user_df['id_card'].str[-2:-1].astype(float) % 2  # 1=男, 0=女

# 5. 从地址提取城市
user_df['city'] = user_df['address'].str.extract(r'(\w+市)')

# 6. 生成标准格式手机号
user_df['mobile_formatted'] = user_df['mobile_clean'].str.replace(
    r'(\d{3})(\d{4})(\d{4})', 
    r'\1-\2-\3', 
    regex=True
)

print(user_df)
```

**高级字符串操作**：

```python
# 填充
df['name_padded'] = df['name'].str.pad(width=10, fillchar='*')       # 右填充
df['name_center'] = df['name'].str.center(width=10, fillchar='-')    # 居中填充
df['name_zfill'] = df['name'].str.zfill(10)                          # 左侧补0

# 重复
df['name_repeat'] = df['name'].str.repeat(3)

# 翻译（类似str.translate）
translation_table = str.maketrans('abc', '123')
df['name_translate'] = df['name'].str.translate(translation_table)

# 正则替换（复杂规则）
def mask_phone(x):
    if pd.isna(x):
        return x
    return x[:3] + '****' + x[-4:]

df['phone_masked'] = df['phone_clean'].apply(mask_phone)

# 或使用正则
df['phone_masked'] = df['phone_clean'].str.replace(
    r'(\d{3})\d{4}(\d{4})', 
    r'\1****\2', 
    regex=True
)

# 格式化
df['formatted'] = df.apply(
    lambda row: f"{row['name']} ({row['email']})", 
    axis=1
)
```

**性能优化**：

```python
# 对于大数据集，某些操作可以用Python内置方法加速

# 慢
df['result'] = df['text'].str.lower()

# 快
df['result'] = df['text'].str.lower()  # str访问器已经优化，差别不大

# 但对于简单操作，map可能更快
df['result'] = df['text'].map(str.lower)

# 或使用向量化的NumPy字符串函数
import numpy as np
df['result'] = np.char.lower(df['text'].values.astype(str))
```

{{< /details >}}

{{< details "**如何处理日期时间数据？**" "Pandas" >}}

日期时间处理是时间序列分析的基础，Pandas提供了丰富的功能。

**日期转换与创建**：

```python
import pandas as pd
import numpy as np

# 字符串转日期
df = pd.DataFrame({
    'date_str': ['2024-01-01', '2024/01/02', '01-03-2024', '2024年1月4日']
})

# 自动识别格式
df['date1'] = pd.to_datetime(df['date_str'], errors='coerce')

# 指定格式
df['date2'] = pd.to_datetime(df['date_str'], format='%Y-%m-%d', errors='coerce')

# 混合格式
df['date3'] = pd.to_datetime(df['date_str'], format='mixed', errors='coerce')

# 从多列创建日期
df_parts = pd.DataFrame({
    'year': [2024, 2024, 2024],
    'month': [1, 2, 3],
    'day': [15, 20, 25]
})
df_parts['date'] = pd.to_datetime(df_parts[['year', 'month', 'day']])

# Unix时间戳转换
timestamps = [1704067200, 1704153600, 1704240000]
df_ts = pd.DataFrame({'timestamp': timestamps})
df_ts['date'] = pd.to_datetime(df_ts['timestamp'], unit='s')

# 创建日期范围
date_range = pd.date_range('2024-01-01', '2024-12-31', freq='D')      # 每天
month_range = pd.date_range('2024-01-01', periods=12, freq='MS')       # 每月初
hour_range = pd.date_range('2024-01-01', periods=24, freq='H')         # 每小时
business_days = pd.bdate_range('2024-01-01', periods=20)               # 工作日
```

**日期属性提取**：

```python
# 创建示例数据
df = pd.DataFrame({
    'datetime': pd.date_range('2024-01-01', periods=100, freq='6H')
})

# 提取各部分
df['year'] = df['datetime'].dt.year
df['month'] = df['datetime'].dt.month
df['day'] = df['datetime'].dt.day
df['hour'] = df['datetime'].dt.hour
df['minute'] = df['datetime'].dt.minute
df['second'] = df['datetime'].dt.second

# 星期相关
df['dayofweek'] = df['datetime'].dt.dayofweek        # 0=周一
df['day_name'] = df['datetime'].dt.day_name()        # Monday
df['weekday'] = df['datetime'].dt.weekday
df['dayofyear'] = df['datetime'].dt.dayofyear

# 季度和周
df['quarter'] = df['datetime'].dt.quarter
df['week'] = df['datetime'].dt.isocalendar().week

# 日期判断
df['is_month_start'] = df['datetime'].dt.is_month_start
df['is_month_end'] = df['datetime'].dt.is_month_end
df['is_quarter_start'] = df['datetime'].dt.is_quarter_start
df['is_quarter_end'] = df['datetime'].dt.is_quarter_end
df['is_year_start'] = df['datetime'].dt.is_year_start
df['is_year_end'] = df['datetime'].dt.is_year_end
df['is_leap_year'] = df['datetime'].dt.is_leap_year

# 自定义判断
df['is_weekend'] = df['datetime'].dt.dayofweek >= 5
df['is_morning'] = df['datetime'].dt.hour < 12
df['is_business_hour'] = df['datetime'].dt.hour.between(9, 17)

print(df.head(20))
```

**日期计算**：

```python
# 日期加减
df['next_day'] = df['datetime'] + pd.Timedelta(days=1)
df['next_week'] = df['datetime'] + pd.Timedelta(weeks=1)
df['next_month'] = df['datetime'] + pd.DateOffset(months=1)
df['next_year'] = df['datetime'] + pd.DateOffset(years=1)

# 日期差值
df['days_since_start'] = (df['datetime'] - df['datetime'].min()).dt.days
df['days_to_end'] = (df['datetime'].max() - df['datetime']).dt.days

# 两个日期列的差值
df2 = pd.DataFrame({
    'start_date': pd.date_range('2024-01-01', periods=10),
    'end_date': pd.date_range('2024-01-05', periods=10)
})
df2['duration_days'] = (df2['end_date'] - df2['start_date']).dt.days

# 工作日计算
from pandas.tseries.offsets import BDay
df['next_business_day'] = df['datetime'] + BDay(1)
df['prev_business_day'] = df['datetime'] - BDay(1)

# 月末日期
from pandas.tseries.offsets import MonthEnd
df['month_end'] = df['datetime'] + MonthEnd(0)  # 当月月末
df['next_month_end'] = df['datetime'] + MonthEnd(1)  # 下月月末
```

**时间序列聚合**：

```python
# 创建时间序列数据
np.random.seed(42)
ts_df = pd.DataFrame({
    'datetime': pd.date_range('2024-01-01', periods=365, freq='D'),
    'value': np.random.randint(100, 1000, 365)
})
ts_df = ts_df.set_index('datetime')

# 重采样
daily_mean = ts_df.resample('D').mean()           # 按天（原本就是天）
weekly_sum = ts_df.resample('W').sum()            # 按周聚合
monthly_stats = ts_df.resample('MS').agg(['sum', 'mean', 'max', 'min'])

# 前向/后向填充
weekly_ffill = ts_df.resample('W').ffill()        # 前向填充
weekly_bfill = ts_df.resample('W').bfill()        # 后向填充

# 降采样（Down sampling）
monthly_data = ts_df.resample('M').agg({
    'value': ['sum', 'mean', 'std', 'count']
})

# 升采样（Up sampling）
hourly_data = ts_df.resample('H').asfreq()        # 生成小时数据（缺失值为NaN）
hourly_filled = ts_df.resample('H').interpolate() # 插值填充

print("月度统计：")
print(monthly_data.head())
```

**实战案例：用户行为分析**：

```python
# 场景：分析用户登录行为
login_df = pd.DataFrame({
    'user_id': np.random.randint(1, 100, 1000),
    'login_time': pd.date_range('2024-01-01', periods=1000, freq='37T'),  # 每37分钟一条
    'device': np.random.choice(['iOS', 'Android', 'Web'], 1000)
})

# 1. 提取时间特征
login_df['date'] = login_df['login_time'].dt.date
login_df['hour'] = login_df['login_time'].dt.hour
login_df['day_of_week'] = login_df['login_time'].dt.day_name()
login_df['is_weekend'] = login_df['login_time'].dt.dayofweek >= 5

# 2. 按小时统计登录量
hourly_logins = login_df.groupby(login_df['login_time'].dt.hour).size()
print("各小时登录量：")
print(hourly_logins)

# 3. 按日期和设备统计
daily_device = login_df.groupby([
    login_df['login_time'].dt.date,
    'device'
]).size().unstack(fill_value=0)
print("\n每日各设备登录量：")
print(daily_device.head())

# 4. 计算用户活跃度（按周）
login_df['week'] = login_df['login_time'].dt.to_period('W')
weekly_active_users = login_df.groupby('week')['user_id'].nunique()
print("\n每周活跃用户数：")
print(weekly_active_users)

# 5. 计算用户登录间隔
user_intervals = login_df.sort_values(['user_id', 'login_time'])
user_intervals['prev_login'] = user_intervals.groupby('user_id')['login_time'].shift(1)
user_intervals['interval_hours'] = (
    user_intervals['login_time'] - user_intervals['prev_login']
).dt.total_seconds() / 3600

# 6. 识别高峰时段
peak_hours = login_df.groupby(login_df['login_time'].dt.hour).size().nlargest(3)
print("\n登录高峰时段：")
print(peak_hours)
```

**时区处理**：

```python
# 创建带时区的时间
df_tz = pd.DataFrame({
    'datetime_utc': pd.date_range('2024-01-01', periods=24, freq='H', tz='UTC')
})

# 转换时区
df_tz['datetime_beijing'] = df_tz['datetime_utc'].dt.tz_convert('Asia/Shanghai')
df_tz['datetime_ny'] = df_tz['datetime_utc'].dt.tz_convert('America/New_York')

# 去除时区信息
df_tz['datetime_naive'] = df_tz['datetime_utc'].dt.tz_localize(None)

# 为无时区时间添加时区
df_naive = pd.DataFrame({
    'datetime': pd.date_range('2024-01-01', periods=10)
})
df_naive['datetime_utc'] = df_naive['datetime'].dt.tz_localize('UTC')
```

{{< /details >}}

{{< details "**如何进行数据去重？**" "Pandas" >}}

数据去重是数据清洗的重要环节，需要根据业务规则选择合适的策略。

**基础去重**：

```python
import pandas as pd
import numpy as np

# 创建包含重复的示例数据
df = pd.DataFrame({
    'user_id': [1, 2, 2, 3, 3, 3, 4],
    'name': ['Alice', 'Bob', 'Bob', 'Charlie', 'Charlie', 'Charlie', 'David'],
    'age': [25, 30, 30, 35, 35, 36, 28],  # 注意第三个Charlie年龄不同
    'city': ['Beijing', 'Shanghai', 'Shanghai', 'Beijing', 'Beijing', 'Beijing', 'Guangzhou']
})

# 查看重复行
print("完全重复的行：")
print(df[df.duplicated()])

# 查看重复行（包括第一次出现）
print("\n所有重复值（包括首次）：")
print(df[df.duplicated(keep=False)])

# 统计重复数量
print(f"\n重复行数量：{df.duplicated().sum()}")

# 删除完全重复的行
df_dedupe = df.drop_duplicates()
print("\n删除重复后：")
print(df_dedupe)
```

**按列去重**：

```python
# 按指定列去重
df_dedupe_user = df.drop_duplicates(subset=['user_id'])
print("按user_id去重：")
print(df_dedupe_user)

# 按多列去重
df_dedupe_multi = df.drop_duplicates(subset=['name', 'age'])
print("\n按name和age去重：")
print(df_dedupe_multi)

# 保留策略
df_keep_first = df.drop_duplicates(subset=['user_id'], keep='first')   # 保留第一个
df_keep_last = df.drop_duplicates(subset=['user_id'], keep='last')     # 保留最后一个
df_keep_none = df.drop_duplicates(subset=['user_id'], keep=False)      # 全部删除

print("\n保留第一个：")
print(df_keep_first)
print("\n保留最后一个：")
print(df_keep_last)
print("\n全部删除：")
print(df_keep_none)
```

**高级去重策略**：

```python
# 场景：订单表，保留金额最大的订单
orders_df = pd.DataFrame({
    'order_id': [1, 2, 3, 4, 5, 6],
    'user_id': [1, 1, 2, 2, 3, 3],
    'amount': [100, 150, 200, 180, 90, 120],
    'order_date': pd.date_range('2024-01-01', periods=6)
})

# 方法1：先排序，再去重（保留金额最大的）
orders_sorted = orders_df.sort_values('amount', ascending=False)
orders_dedupe = orders_sorted.drop_duplicates(subset=['user_id'], keep='first')
print("保留金额最大的订单：")
print(orders_dedupe)

# 方法2：使用groupby + idxmax
max_amount_idx = orders_df.groupby('user_id')['amount'].idxmax()
orders_max = orders_df.loc[max_amount_idx]
print("\n使用groupby保留最大值：")
print(orders_max)

# 方法3：保留最新的记录
latest_idx = orders_df.groupby('user_id')['order_date'].idxmax()
orders_latest = orders_df.loc[latest_idx]
print("\n保留最新订单：")
print(orders_latest)
```

**复杂去重规则**：

```python
# 场景：用户登录记录，需要去除5分钟内的重复登录
login_df = pd.DataFrame({
    'user_id': [1, 1, 1, 2, 2, 3, 3, 3],
    'login_time': pd.to_datetime([
        '2024-01-01 10:00:00',
        '2024-01-01 10:02:00',  # 2分钟后，应去重
        '2024-01-01 10:10:00',  # 10分钟后，保留
        '2024-01-01 11:00:00',
        '2024-01-01 11:03:00',  # 3分钟后，应去重
        '2024-01-01 12:00:00',
        '2024-01-01 12:04:00',  # 4分钟后，应去重
        '2024-01-01 12:15:00',  # 15分钟后，保留
    ])
})

# 按用户排序
login_df = login_df.sort_values(['user_id', 'login_time'])

# 计算与上次登录的时间差
login_df['time_diff'] = login_df.groupby('user_id')['login_time'].diff()

# 标记是否应保留（第一条或时间差>5分钟）
login_df['keep'] = (login_df['time_diff'].isna()) | (login_df['time_diff'] > pd.Timedelta(minutes=5))

# 过滤
login_deduped = login_df[login_df['keep']].drop(columns=['time_diff', 'keep'])
print("去除5分钟内重复登录：")
print(login_deduped)
```

**模糊去重（相似性去重）**：

```python
# 场景：公司名称可能有细微差异
companies_df = pd.DataFrame({
    'company': [
        '北京科技有限公司',
        '北京科技有限公司 ',  # 多了空格
        '北京科技有限责任公司',  # 略有不同
        '上海贸易公司',
        '上海贸易有限公司',
    ]
})

# 方法1：去除空格后比较
companies_df['company_clean'] = companies_df['company'].str.strip()
companies_dedupe1 = companies_df.drop_duplicates(subset=['company_clean'])

# 方法2：使用fuzzywuzzy进行模糊匹配
from fuzzywuzzy import fuzz

def fuzzy_dedupe(df, column, threshold=90):
    """
    基于相似度的去重
    """
    keep_indices = []
    processed = set()
    
    for idx, value in df[column].items():
        if idx in processed:
            continue
        
        keep_indices.append(idx)
        processed.add(idx)
        
        # 查找相似的行
        for idx2, value2 in df[column].items():
            if idx2 not in processed:
                similarity = fuzz.ratio(str(value), str(value2))
                if similarity >= threshold:
                    processed.add(idx2)
    
    return df.loc[keep_indices]

# companies_fuzzy = fuzzy_dedupe(companies_df, 'company', threshold=85)
# print("模糊去重后：")
# print(companies_fuzzy)
```

**标记重复而不删除**：

```python
# 场景：需要保留所有数据，但标记哪些是重复的
df_with_flag = df.copy()

# 标记是否重复
df_with_flag['is_duplicate'] = df_with_flag.duplicated(subset=['user_id'], keep=False)

# 添加重复组编号
df_with_flag['duplicate_group'] = df_with_flag.groupby('user_id').ngroup()

# 标记是第几个重复
df_with_flag['duplicate_rank'] = df_with_flag.groupby('user_id').cumcount() + 1

print("标记重复信息：")
print(df_with_flag)
```

**去重统计报告**：

```python
def dedup_report(df, subset=None):
    """
    生成去重报告
    """
    total_rows = len(df)
    
    if subset:
        duplicates = df.duplicated(subset=subset, keep=False)
        unique_rows = len(df.drop_duplicates(subset=subset))
    else:
        duplicates = df.duplicated(keep=False)
        unique_rows = len(df.drop_duplicates())
    
    duplicate_rows = duplicates.sum()
    duplicate_rate = (duplicate_rows / total_rows * 100) if total_rows > 0 else 0
    
    report = pd.DataFrame({
        '指标': ['总行数', '唯一行数', '重复行数', '重复率(%)'],
        '数值': [total_rows, unique_rows, duplicate_rows, f'{duplicate_rate:.2f}']
    })
    
    return report

# 使用示例
print(dedup_report(df, subset=['user_id']))
```

**批量去重（大数据）**：

```python
# 对于超大DataFrame，分块去重
def chunk_dedupe(df, chunksize=10000, subset=None):
    """
    分块去重，适用于内存不足的情况
    """
    unique_df = pd.DataFrame()
    
    for start in range(0, len(df), chunksize):
        chunk = df.iloc[start:start+chunksize]
        
        # 当前chunk去重
        chunk_unique = chunk.drop_duplicates(subset=subset)
        
        # 与已有结果合并后再去重
        unique_df = pd.concat([unique_df, chunk_unique])
        unique_df = unique_df.drop_duplicates(subset=subset)
    
    return unique_df

# 使用示例
# large_df_deduped = chunk_dedupe(large_df, chunksize=10000, subset=['user_id'])
```

{{< /details >}}

