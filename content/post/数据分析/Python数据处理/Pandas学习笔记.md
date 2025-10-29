---
title: "Pandas学习笔记"
date: 2024-06-05
categories: ["Python"]
tags: ["Python","Pandas"]
summary: "概述 Pandas 安装、核心数据结构、输入输出、数据清洗与操作（选择/分组/合并）、描述性统计、相关性与透视、时间序列、常用函数、可视化、性能优化及综合案例"
math: true
pin: true
---

# 1 安装

### 1.1.1 使用 pip 安装
```bash
pip --version                    # 查看 pip 版本，确认安装状态
pip install pandas               # 安装最新稳定版 Pandas
pip install --upgrade pandas     # 将已安装的 Pandas 升级到最新版本

# MySQL相关依赖
pip install pymysql              # MySQL数据库连接器
pip install sqlalchemy           # SQL工具包和对象关系映射
```

验证：
```python
import pandas as pd              # 导入 pandas 库
print(pd.__version__)            # 输出当前安装的 pandas 版本号

# 验证MySQL连接
import pymysql
try:
    conn = pymysql.connect(host='localhost', user='root', password='password', database='test')
    print("MySQL连接成功！")
    conn.close()
except Exception as e:
    print(f"MySQL连接失败：{e}")
```

### 1.1.2 使用 conda 安装
```bash
conda create -n myenv python=3.8 # 创建名为 myenv 的虚拟环境并指定 Python 3.8
conda activate myenv             # 激活该虚拟环境
conda install pandas             # 在虚拟环境中安装 Pandas
conda install pymysql            # 安装MySQL连接器
conda install sqlalchemy         # 安装SQL工具包
```

# 2 数据结构

## 2.1 Series

### 2.1.1 创建
```python
import pandas as pd                                      # 导入 pandas

data_list = [1,2,3,4,5]                                  # 普通 Python 列表
s_list = pd.Series(data_list)                           # 用列表创建 Series，自动索引 0..n-1
s_dict = pd.Series({'a':1,'b':2,'c':3})                 # 用字典创建 Series，键成为索引
s_custom = pd.Series(data_list,                         # 创建带自定义索引的 Series
                     index=['one','two','three','four','five'])  # 指定索引标签
```

### 2.1.2 访问
```python
print(s_list[0])                     # 通过位置访问第一个元素
print(s_dict['b'])                   # 通过标签访问索引 'b' 对应的值
print(s_list[:2])                    # 切片访问前两个元素（位置 0、1）
print(s_custom[['one','three']])     # 通过标签列表选取多个元素
```

### 2.1.3 属性与方法
```python
print(len(s_list),                   # Series 长度（元素个数）
      s_list.index,                  # Index 对象（索引集合）
      s_list.values)                 # 底层 ndarray 值

print(s_list.max(),                  # 最大值
      s_list.min(),                  # 最小值
      s_list.sum(),                  # 求和
      s_list.mean())                 # 平均值
```

## 2.2 DataFrame

### 2.2.1 创建
```python
import numpy as np                                      # 导入 NumPy 用于数组

df_dict = pd.DataFrame({                                # 通过字典创建 DataFrame
    'Name':['Alice','Bob','Charlie'],                   # 列 'Name'
    'Age':[25,30,35],                                   # 列 'Age'
    'City':['New York','Los Angeles','Chicago']         # 列 'City'
})

arr = np.array([[1,'Alice',25],                         # 构造二维数组：每一行是一条记录
                [2,'Bob',30],
                [3,'Charlie',35]])

df_arr = pd.DataFrame(arr,                              # 用二维数组创建 DataFrame
                      columns=['ID','Name','Age'])      # 指定列名（所有元素为对象类型）
```

### 2.2.2 访问
```python
print(df_dict.iloc[0,1])       # 按整数位置访问：第 0 行第 1 列（'Bob'）
print(df_dict.loc[1,'Name'])   # 按标签访问：索引标签 1 的行的 'Name' 列
print(df_dict.iloc[1])         # 取第 1 行的所有列（返回 Series）
print(df_dict['City'])         # 访问 'City' 列（返回 Series）
```

### 2.2.3 属性与方法
```python
print(df_dict.shape,           # (行数, 列数)
      df_dict.columns,         # 列名 Index
      df_dict.index)           # 行索引 Index

print(df_dict.describe())      # 数值列的描述性统计（非数值列忽略）
print(df_dict.head())          # 前 5 行（默认）
print(df_dict.tail())          # 后 5 行（默认）
```

### 2.2.4 读取文件
```python
df_csv   = pd.read_csv('data.csv')        # 从 CSV 文件读取
df_excel = pd.read_excel('data.xlsx')     # 从 Excel 文件读取（需要 openpyxl 或 xlrd）
df_json  = pd.read_json('data.json')      # 从 JSON 文件读取
```

# 3 数据输入与输出

## 3.1 读取 CSV
```python
df = pd.read_csv('data.csv')              # 一次性读取整个 CSV 为 DataFrame
with open('data.csv','r') as f:           # 原始文件逐行读取
    for line in f:                        # 遍历每一行字符串
        print(line.strip())               # 去掉末尾换行并打印
```

## 3.2 写入 CSV
```python
df.to_csv('output.csv', index=False)      # 写出到 CSV，不包含行索引
with open('output_row_by_row.csv','w') as f:          # 手工逐行方式写出
    for _, row in df.iterrows():                      # 逐行迭代 DataFrame（较慢）
        f.write(','.join(map(str,row.values))+'\n')   # 把一行的值连接成逗号分隔写入
```

## 3.3 读取 Excel
```python
df_x = pd.read_excel('data.xlsx', sheet_name='Sheet1')  # 指定工作表读取
for _, row in df_x.iterrows():                          # 逐行遍历
    print(row['Column1'], row['Column2'])               # 按列名访问字段
```

## 3.4 写入 Excel
```python
df_x.to_excel('output.xlsx', index=False, sheet_name='Results')  # 写入到新工作表
```

## 3.5 读取 JSON
```python
df_j = pd.read_json('data.json')     # 结构化 JSON 转 DataFrame
import json                          # 导入标准库 json
with open('data.json') as f:         # 打开原始 JSON 文件
    for rec in json.load(f):         # 解析为 Python 对象后逐条遍历
        print(rec)                   # 每条记录（通常是 dict）
```

## 3.6 写入 JSON
```python
df_j.to_json('output.json',          # 输出文件名
             orient='records',       # 每行一个对象
             lines=True)             # 生成按行分隔的 JSON（NDJSON）
with open('output_row_by_row.json','w') as f:     # 手工逐行写
    for _, row in df_j.iterrows():                # 行迭代
        f.write(json.dumps(row.to_dict())+'\n')   # 转 dict 后序列化再换行
```

## 3.7 从数据库读取
```python
import pymysql                                           # 导入 pymysql
import pandas as pd

# 连接MySQL数据库
conn = pymysql.connect(
    host='localhost',                                    # 数据库主机地址
    user='username',                                     # 数据库用户名
    password='password',                                 # 数据库密码
    database='database_name',                            # 数据库名称
    charset='utf8mb4'                                    # 字符集
)

df_sql = pd.read_sql_query("SELECT * FROM tablename",    # 执行 SQL 查询转换为 DataFrame
                           conn)
for _, row in df_sql.iterrows():                         # 逐行处理结果
    print(row['column_name'])                            # 打印某一列
conn.close()                                             # 关闭连接
```

## 3.8 写入数据库
```python
import pymysql
import pandas as pd

# 连接MySQL数据库
conn = pymysql.connect(
    host='localhost',                                    # 数据库主机地址
    user='username',                                     # 数据库用户名
    password='password',                                 # 数据库密码
    database='database_name',                            # 数据库名称
    charset='utf8mb4'                                    # 字符集
)

# 方法1：使用pandas的to_sql方法（需要sqlalchemy）
from sqlalchemy import create_engine
engine = create_engine('mysql+pymysql://username:password@localhost/database_name?charset=utf8mb4')
df_sql.to_sql('tablename', engine,                      # 将 DataFrame 写入表
              if_exists='replace',                       # 若存在则替换
              index=False)                               # 不写入行索引

# 方法2：逐行写入（适合大数据量或需要自定义处理）
cursor = conn.cursor()
for _, row in df_sql.iterrows():                         # 逐行处理
    sql = "INSERT INTO tablename (col1, col2, col3) VALUES (%s, %s, %s)"
    cursor.execute(sql, (row['col1'], row['col2'], row['col3']))
conn.commit()                                            # 提交事务
cursor.close()                                           # 关闭游标
conn.close()                                             # 关闭连接
```

# 4 数据清洗

## 4.2 缺失值
```python
df = pd.DataFrame({'A':[1,2,None,4],          # 列 A 有一个缺失
                   'B':[None,2,3,4],          # 列 B 有一个缺失
                   'C':[1,None,None,4]})      # 列 C 有两个缺失
print(df.isnull())                            # 每个元素是否缺失 True/False
print(df.isnull().sum())                      # 每列缺失值计数
```

填充：
```python
print(df.fillna(df.mean()))                   # 用各列均值填充数值缺失（非数值列忽略）
print(df.fillna(0))                           # 所有缺失用 0 填充
```

删除：
```python
print(df.dropna())                            # 删除含任意缺失值的整行
print(df.dropna(subset=['A']))                # 仅检查列 A，删除其中缺失的行
```

## 4.3 空值处理
```python
df_clean = df.replace('', None)               # 将空字符串替换为 None（视为缺失处理）
```

## 4.4 数据格式转换
```python
df_types = pd.DataFrame({'A':['1','2','3','4'],      # 数字但以字符串形式存储
                         'B':['5.5','6.1','7.3','8.2']})
df_types['A'] = df_types['A'].astype(int)            # 转换为整数类型
df_types['B'] = df_types['B'].astype(float)          # 转换为浮点数类型
```

日期：
```python
df_dates = pd.DataFrame({'date_str':['2021-01-01','2021-02-01','2021-03-01']})
df_dates['date'] = pd.to_datetime(df_dates['date_str'])   # 字符串解析为 Timestamp
```

## 4.5 去重
```python
df_dup = pd.DataFrame({'A':[1,1,2,3,4],           # A 列重复值 1
                       'B':['a','a','b','c','d']})
print(df_dup.drop_duplicates())                  # 删除完全重复行（保留首次出现）
```

## 4.6 异常值
```python
out = pd.DataFrame({'A':[10,12,13,100,15]})      # 100 可能是异常值
mean, std = out['A'].mean(), out['A'].std()      # 计算均值与标准差
out['is_outlier'] = (abs(out['A']-mean) > 3*std) # 超过 3 标准差标记为异常
clean = out[~out['is_outlier']]                  # 过滤掉异常值的行
```

# 5 数据操作

## 5.1 选择与过滤

### 5.1.1 标签选择
```python
df = pd.DataFrame({'Name':['Alice','Bob','Charlie','David'],    # 四行记录
                   'Age':[25,30,35,40],
                   'City':['New York','Los Angeles','Chicago','Houston']})
print(df['Age'])                         # 选取单列（Series）
print(df[['Name','Age']])                # 选取多列（DataFrame）
print(df.loc[1])                         # 按标签索引 1 行（第二行）
print(df.loc[1,'Age'])                   # 标签 1 行的 'Age' 值
```

### 5.1.2 位置选择
```python
print(df.iat[0,0])                       # 按整数位置：第 0 行第 0 列元素
print(df.iloc[0:2,1:3])                  # 切片：行 0-1；列 1-2（不包含列 3）
```

### 5.1.3 布尔索引
```python
print(df[df['Age']>30])                  # 过滤 Age > 30 的行
print(df[(df['Age']>30) &                 # 复合条件：Age > 30 且 City == 'Chicago'
          (df['City']=='Chicago')])
```

## 5.2 排序
```python
print(df.sort_values('Age'))             # 按 Age 升序
print(df.sort_values('Age', ascending=False))  # 按 Age 降序
print(df.sort_values(['City','Age']))     # 先按 City，再按 Age 升序
```

## 5.3 分组与聚合
```python
df_g = pd.DataFrame({'Name':['Alice','Bob','Charlie','David','Eve'],  # 五条记录
                     'Age':[25,30,35,25,30],
                     'City':['New York','Los Angeles','Chicago','New York','Chicago']})
grp = df_g.groupby('City')                     # 按 City 分组
print(grp['Age'].mean())                       # 每个城市 Age 平均值
print(grp.agg({'Age':['mean','max'],           # 多重聚合：平均值 + 最大值
               'Name':'count'}))               # Name 计数
print(df_g.groupby('Age').agg({'City':pd.Series.nunique,   # 每个年龄的不同城市数量
                               'Name':'count'}))           # 每个年龄的出现人数
```

## 5.4 合并与连接

### 5.4.1 merge
```python
df1 = pd.DataFrame({'EmployeeID':[1,2,3,4],          # 员工基本信息
                    'Name':['Alice','Bob','Charlie','David']})
df2 = pd.DataFrame({'EmployeeID':[3,4,5,6],          # 薪资信息（部分重叠）
                    'Salary':[70000,80000,60000,75000]})
print(pd.merge(df1, df2, on='EmployeeID', how='inner'))  # 交集
print(pd.merge(df1, df2, on='EmployeeID', how='left'))   # 左表全部
print(pd.merge(df1, df2, on='EmployeeID', how='right'))  # 右表全部
print(pd.merge(df1, df2, on='EmployeeID', how='outer'))  # 并集
```

### 5.4.2 concat
```python
df3 = pd.DataFrame({'Name':['Alice','Bob'],          # 第一批
                    'Age':[25,30]})
df4 = pd.DataFrame({'Name':['Charlie','David'],      # 第二批
                    'Age':[35,40]})
print(pd.concat([df3, df4], axis=0, ignore_index=True))  # 纵向拼接并重置索引
df5 = pd.DataFrame({'Salary':[70000,80000]})             # 单独薪资列
print(pd.concat([df3, df5], axis=1))                     # 横向拼接，按行对齐
```

### 5.4.3 join
```python
df6 = pd.DataFrame({'EmployeeID':[1,2,3],
                    'Department':['HR','Finance','IT']}).set_index('EmployeeID')   # 设索引用于连接
df7 = pd.DataFrame({'EmployeeID':[1,2,4],
                    'Salary':[70000,80000,60000]}).set_index('EmployeeID')

print(df6.join(df7, how='inner'))       # 索引交集
print(df6.join(df7, how='left'))        # 左索引全部
print(df6.join(df7, how='right'))       # 右索引全部
print(df6.join(df7, how='outer'))       # 索引并集
```



# 6 数据分析

## 6.1 描述性统计
```python
import pandas as pd                                    # 导入 pandas
df = pd.DataFrame({'A':[1,2,3,4,5],                    # 构造示例数据列 A
                   'B':[5,6,7,8,9]})                   # 构造示例数据列 B
print(df['A'].mean(), df['A'].median(), df['A'].var()) # 输出 A 列均值/中位数/方差
print(df['A'].quantile([0.25,0.5,0.75]))               # A 列 25%、50%、75% 分位数
```

## 6.2 相关性
```python
corr_ab = df['A'].corr(df['B'])    # A 与 B 的皮尔逊相关系数
corr_matrix = df.corr()            # 所有数值列的相关性矩阵
```

## 6.3 数据透视表
```python
pivot_df = pd.DataFrame({                              # 创建用于透视的 DataFrame
  'Name':['Alice','Bob','Charlie','David','Eve','Frank'],
  'City':['New York','New York','Chicago','Chicago','Los Angeles','Los Angeles'],
  'Sales':[100,150,200,300,250,400]
})
print(pivot_df.pivot_table(values='Sales', index='City', aggfunc='sum'))          # 每城市销售总和
print(pivot_df.pivot_table(values='Sales', index='City', columns='Name',          # 城市×姓名矩阵
                           aggfunc='sum', fill_value=0))                          # 缺失填 0
```

## 6.4 时间序列
```python
date_range = pd.date_range('2021-01-01', periods=5, freq='D')  # 生成 5 天日期
ts = pd.DataFrame([1,3,5,7,9], index=date_range,               # 建立时间序列 DataFrame
                  columns=['Value'])
print(ts.resample('2D').sum())                                 # 以 2 天为频率重采样求和
```

趋势可视化：
```python
import matplotlib.pyplot as plt            # 导入绘图库
plt.plot(ts.index, ts['Value'], marker='o')# 绘制时间序列折线图
plt.show()                                 # 显示图形
```

# 7 常用函数

## 7.2 字符串处理
```python
sdf = pd.DataFrame({'Name':[' Alice ','  Bob ','Charlie',' David ']})  # 含空格的姓名
sdf['Name'] = sdf['Name'].str.strip().str.upper()                      # 去空格并转大写
print(sdf[sdf['Name'].str.contains('CHARLIE')])                        # 过滤包含 CHARLIE 的行
```

## 7.3 apply / map
```python
df_apply = pd.DataFrame({'A':[1,2,3,4],'B':[10,20,30,40]})  # 示例数据
df_apply['A_plus_ten'] = df_apply['A'].apply(lambda x: x+10) # 对 A 列每个元素加 10

df_map = pd.DataFrame({'A':['apple','banana','cherry']})    # 水果单列
mapping = {'apple':'fruit_1','banana':'fruit_2','cherry':'fruit_3'}  # 映射字典
df_map['A'] = df_map['A'].map(mapping)                      # 映射替换
```

# 8 数据可视化

## 8.1 Matplotlib 基础
```python
import matplotlib.pyplot as plt, pandas as pd          # 导入所需库
df_sales = pd.DataFrame({'Year':[2017,2018,2019,2020,2021], # 年份列
                         'Sales':[150,200,250,300,350]})   # 销售列
plt.bar(df_sales['Year'], df_sales['Sales'])           # 绘制柱状图
plt.show()                                             # 显示图形

df_line = pd.DataFrame({'Month':['Jan','Feb','Mar','Apr','May','Jun'], # 月份
                        'Temp':[30,32,35,28,25,30]})                   # 温度
plt.plot(df_line['Month'], df_line['Temp'], marker='o') # 绘制折线图
plt.show()

plt.scatter(df_sales['Year'], df_sales['Sales'])       # 绘制散点图
plt.show()
```

## 8.2 Seaborn
```python
import seaborn as sns, numpy as np                     # 导入 seaborn 与 numpy
dist = np.random.normal(0,1,1000)                      # 生成正态分布数据
sns.histplot(dist, bins=30, kde=True)                  # 直方图 + KDE 曲线

df_box = pd.DataFrame({'Category':['A','A','A','B','B','B'], # 类别
                       'Value':[1,2,3,4,5,6]})
sns.boxplot(x='Category', y='Value', data=df_box)       # 绘制箱型图
sns.violinplot(x='Category', y='Value', data=df_box)    # 绘制小提琴图
```

# 9 性能优化

## 9.1 类型与内存
```python
import pandas as pd
N=1_000_00                                             # 设定重复倍数 100000
df = pd.DataFrame({
  'A':[1,2,3,4,5]*N,                                   # 大量整数
  'B':[10.5,20.5,30.5,40.5,50.5]*N,                    # 大量浮点
  'C':['Cat1','Cat2','Cat3','Cat4','Cat5']*N           # 类别字符串
})
print(df.memory_usage(deep=True))                      # 查看深度内存占用
df['A']=df['A'].astype('int32')                        # 缩小整数类型
df['B']=df['B'].astype('float32')                      # 缩小浮点类型
df['C']=df['C'].astype('category')                     # 转换为分类类型
print(df.memory_usage(deep=True))                      # 再次查看内存占用
del df['C']                                            # 删除不再需要的列释放内存
```

## 9.2 大数据处理
```python
# 分块读取 large_file.csv —— 示例：逐块计算 A 列均值
chunk_means=[]                                         # 存储各块均值
for chunk in pd.read_csv('large_file.csv', chunksize=100_000):  # 每块 10 万行
    chunk_means.append(chunk['A'].mean())              # 计算并存储当前块均值
overall_mean = sum(chunk_means)/len(chunk_means)       # 汇总整体均值
print(overall_mean)                                    # 输出结果
```

Dask：
```python
import dask.dataframe as dd                            # 导入 Dask DataFrame
ddf = dd.read_csv('large_file.csv')                    # 延迟读取大文件
print(ddf['A'].mean().compute())                       # 触发实际计算
```

# 10 案例分析

## 10.1 清洗与描述
```python
raw = pd.DataFrame({                                   # 构造原始数据集
 'Name':['Alice','Bob','Charlie','David','Eve','Frank',None,'Bob'], # 含缺失/重复
 'Age':[25,30,None,35,40,45,150,30],                   # 年龄列含缺失和异常值 150
 'City':['New York','Los Angeles','Chicago','Houston','Chicago',None,'New York','Los Angeles'],
 'Salary':[70000,80000,None,120000,95000,100000,110000,95000]
})
print(raw.isnull().sum())                              # 每列缺失值统计
raw['Age'].fillna(raw['Age'].mean(), inplace=True)     # 用年龄均值填充缺失
raw['City'].fillna('Unknown', inplace=True)            # 缺失城市填充 Unknown
raw['Salary'].fillna(raw['Salary'].median(), inplace=True) # 薪资缺失填中位数
raw = raw[raw['Age']<=100].drop_duplicates()           # 去掉异常年龄与重复行
print(raw.describe(include='all'))                     # 全部列描述统计
```

## 10.2 销售可视化
```python
sales = pd.DataFrame({                                 # 月份+类别销售数据
 'Month':['Jan','Jan','Feb','Feb','Mar','Mar','Apr','Apr','May','May'],
 'Sales':[150,200,250,300,350,400,450,500,550,600],
 'Category':['A','B','A','B','A','B','A','B','A','B']
})
tot = sales.groupby('Category')['Sales'].sum()         # 按类别汇总总销售
best = tot.idxmax()                                    # 找到销售最高的类别
pivot = sales.pivot_table(values='Sales',              # 生成透视表：月×类别
                          index='Month',
                          columns='Category',
                          aggfunc='sum')
```

## 10.3 时间序列预测（ARIMA 简例）
```python
from statsmodels.tsa.arima.model import ARIMA          # 导入 ARIMA 模型
date_idx = pd.date_range('2021-01-01', periods=24, freq='M') # 24 个月索引
series = pd.Series(                                    # 销售时间序列
 [100,120,130,150,170,180,190,200,210,220,230,250,
  260,270,280,300,310,320,330,350,360,370,380,400],
 index=date_idx)
model = ARIMA(series, order=(1,1,1)).fit()             # 拟合 ARIMA(1,1,1)
forecast = model.forecast(steps=6)                     # 预测未来 6 期
```

## 10.4 产品销售趋势
```python
prod = pd.DataFrame({                                  # 产品月度销售
 'Product':['A','B','C','A','B','C','A','B','C'],
 'Sales':[100,150,200,130,170,220,140,180,250],
 'Month':['Jan','Jan','Jan','Feb','Feb','Feb','Mar','Mar','Mar']
})
total = prod.groupby('Product')['Sales'].sum()         # 按产品汇总总销售额
monthly = prod.groupby(['Month','Product'])['Sales']   # 月+产品分组
monthly = monthly.sum().unstack()                      # 转换成宽格式（列为产品）
```
