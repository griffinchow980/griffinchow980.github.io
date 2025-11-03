---
title: "Web页面新功能用户点击率AB-test数据分析"
date: 2024-11-08
categories: ["项目"]
tags: ["数据分析", "埋点分析", "A/B测试", "可视化"]
summary: "基于12万条AB测试数据，运用Mann-Whitney U检验分析Web新功能点击率提升效果；实验组点击率3.86%显著高于对照组3.47%（p<0.05），提升11.52%；涵盖完整AB测试流程：改动确定、核心指标确定、样本量计算、实验周期确定、分流与随机化、数据埋点设计、灰度测试、假设检验、效应量评估及多维度可视化分析"
math: true
---

# 1. 数据概况
s
该数据为模拟数据，模拟场景为公司为推出新的页面/功能而进行的AB测试。数据集包含相同大小的对照组和实验组，以及对应的测试记录数据：浏览量和点击量。合计数据120000条，对照组60000条，实验组60000条，属于大样本，进行AB测试的数据分析时可选用合适的大样本统计检验方法。通过统计假设检验分析该数据集，可以推断新页面或功能对业务核心指标的提升效果是否显著，进而辅助公司管理层决定是否进行页面或功能改造。

**数据字段说明：**

| 字段名 | 说明 |
|--------|------|
| `user_id` | 用户唯一标识符 |
| `group` | 测试分组，`control`为对照组，`test`为实验组 |
| `views` | 用户浏览页面的次数 |
| `clicks` | 页面上某个关键按钮的点击次数（作为用户转化的核心标识） |


**分析目标：**
- 计算每个用户对应的点击率（CTR）
- 将点击率作为核心指标，通过统计假设检验分析实验组的点击率是否有显著提升
- 通过多维度数据可视化对比，全面评估AB测试效果

# 2. AB-test理论基础与流程

## 2.1 实验改动点确定

根据业务需求或是公司当下最需要的增长点，确定针对产品或业务流程最有价值的改动方案，再启动AB-test对改动方案的预期效果进行初步验证。在AB-test开始前，需要和业务部门确定准确的实验改动点，**实验改动点是实验中唯一的影响变量**。

## 2.2 核心指标确定

确定实验改动点后，需要确定本次实验的核心指标。可以通过当期项目的**北极星指标**辅助判断，基于业务需求，选择最有价值的核心指标，进而拆解为对应的便于观测的关键性指标。

比如本项目的数据集，假设公司的北极星指标是用户转化率，当前的业务需求是提升用户的活跃度和转化率，那么可以选择核心指标为**用户点击率（CTR）**，再将其拆解为用户浏览量和点击量，设置数据埋点，进行数据记录。

## 2.3 实验所需样本量计算

确定核心指标后，为节约成本，需要计算实验所需的最小样本量。AB-test所需最小样本量计算公式如下：

$$
n = \frac{\sigma^2}{\delta^2} \Big(Z_{1-\frac{\alpha}{2}} + Z_{1-\beta}\Big)^2
$$

**公式参数说明：**

- $n$：AB-test中对照组和实验组各组所需要的样本量，总样本即为 $2n$
- $\sigma$：标准差，用于衡量总体分布的波动性大小
- $\delta$：对照组和实验组核心指标的差值大小，在本项目中，$\delta$ 等于实验组的点击率减去对照组的点击率
- $\alpha$：犯第一类错误的概率（弃真错误），在假设检验中，为保护原假设，我们一般取 $\alpha = 0.01$ 或 $0.05$

$$
\alpha = P(\text{拒绝 } H_0 \mid H_0 \text{ 为真})
$$

- $\beta$：犯第二类错误的概率（纳伪错误），在假设检验中，犯第二类错误的概率一般难以计算，且无法同时控制两类错误概率的大小，因此只控制犯第一类错误的概率在合理范围内，不让犯第二类错误的概率过大即可

$$
\beta = P(\text{接受 } H_0 \mid H_0 \text{ 为假})
$$

- $Z_p$：标准正态分布的 $p$ 分位数

**参考工具：** [AB-test最小样本量计算器](https://www.evanmiller.org/ab-testing/sample-size.html)

## 2.4 确定实验周期

在计算出AB-test所需的最小样本量后，需要结合当前的 **日均活跃用户量（DAU）** 来确定实验周期。将每组的最小样本量除以每日每组活跃用户数，即可得出最小实验周期。在实际操作中，为了考虑用户行为的周期性波动，实验周期通常需要适当延长，以确保结果的统计学可靠性。

## 2.5 流量分割与随机化

在计算出所需的最小样本量和实验周期后，需要对样本流量进行合理的分割。这一步是实验设计中至关重要的环节，其目的是确保实验组和对照组的样本分布均匀且具有随机性，从而最大程度地减少其他因素对实验结果的干扰。

合理的样本分割应遵循 **随机化原则**，使实验组和对照组在性别、年龄、地区、设备类型、活跃程度等关键特征上尽可能一致，以避免潜在的系统性偏差（Selection Bias）。通过这样的方法，可以确保在实验期间，只有实验改动点这一因素对核心指标产生影响，而其他无关变量被有效控制。

此外，合理的随机分组有助于避免 **辛普森悖论（Simpson's Paradox）** 的发生。辛普森悖论指的是，当数据被分组分析时，总体趋势可能会被分组内的特定趋势掩盖或逆转，从而得出错误的结论。在实验设计中，通过合理的流量分割和随机化，可以确保实验组和对照组的样本特征一致，使得实验结果的因果关系更为清晰，统计结论也更加可靠。

## 2.6 数据埋点和灰度测试

### 2.6.1 数据埋点概述

数据埋点（Event Tracking）是AB测试中数据收集的核心环节，指在Web页面或App中嵌入数据采集代码，用于记录用户行为数据并上报至后端服务器。合理的数据埋点设计是确保AB测试数据质量的基础。

**埋点设计原则：**

1. **最小化干扰**：埋点代码不应影响页面性能和用户体验
2. **数据完整性**：确保关键行为数据不遗漏
3. **隐私合规**：遵守数据隐私法规（GDPR、CCPA等）
4. **可扩展性**：支持灵活添加新的tracking事件

### 2.6.2 AB测试分组策略

用户分组通常在用户首次访问时进行，常用方法包括：

1. **用户ID哈希分组**：基于user_id的哈希值进行分组，保证同一用户始终在同一组
2. **随机分组**：对新用户随机分配到实验组或对照组
3. **分层抽样**：按用户特征（如地域、设备类型）进行分层后随机分组

### 2.6.3 前端埋点代码示例

以下是一个典型的Web页面AB测试埋点实现示例（基于JavaScript）：
{{< admonition type="info" title="代码与输出" collapse="true" >}}
```javascript
// AB-test配置与分组逻辑
class ABTestTracker {
    constructor(experimentId, userId) {
        this.experimentId = experimentId;
        this.userId = userId;
        this.group = this.assignGroup();
        this.sessionId = this.generateSessionId();
    }
    
    // 用户分组：基于userId哈希值确定分组
    assignGroup() {
        // 使用简单哈希函数确保同一用户始终分配到同一组
        const hash = this.hashCode(this.userId);
        return (hash % 2 === 0) ? 'control' : 'test';
    }
    
    // 简单哈希函数
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    // 生成会话ID
    generateSessionId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // 页面浏览事件追踪
    trackPageView(pageUrl) {
        this.sendEvent({
            event_type: 'page_view',
            user_id: this.userId,
            group: this.group,
            page_url: pageUrl,
            timestamp: new Date().toISOString(),
            session_id: this.sessionId
        });
    }
    
    // 按钮点击事件追踪
    trackButtonClick(buttonId, buttonName) {
        this.sendEvent({
            event_type: 'button_click',
            user_id: this.userId,
            group: this.group,
            button_id: buttonId,
            button_name: buttonName,
            timestamp: new Date().toISOString(),
            session_id: this.sessionId
        });
    }
    
    // 发送事件到后端
    sendEvent(eventData) {
        // 使用navigator.sendBeacon确保数据可靠发送
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/track', JSON.stringify(eventData));
        } else {
            // 降级方案：使用fetch API
            fetch('/api/track', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(eventData),
                keepalive: true  // 确保页面关闭时也能发送
            }).catch(err => console.error('Tracking failed:', err));
        }
    }
}

// 初始化AB-test追踪器
const userId = getUserId(); // 从cookie或localStorage获取用户ID
const abTracker = new ABTestTracker('new_feature_test_v1', userId);

// 追踪页面浏览
abTracker.trackPageView(window.location.href);

// 为关键按钮添加点击追踪
document.getElementById('cta-button').addEventListener('click', function() {
    abTracker.trackButtonClick('cta-button', 'Call To Action');
});
```
{{< /admonition >}}

### 2.6.4 后端数据聚合

后端接收到前端上报的事件数据后，需要按用户进行聚合统计：

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# Python后端数据聚合示例
import pandas as pd
from collections import defaultdict

def aggregate_user_data(event_logs):
    """
    将用户行为事件日志聚合为AB-test分析所需的格式
    """
    user_data = defaultdict(lambda: {
        'user_id': None,
        'group': None,
        'views': 0,
        'clicks': 0
    })
    
    for event in event_logs:
        user_id = event['user_id']
        user_data[user_id]['user_id'] = user_id
        user_data[user_id]['group'] = event['group']
        
        if event['event_type'] == 'page_view':
            user_data[user_id]['views'] += 1
        elif event['event_type'] == 'button_click':
            user_data[user_id]['clicks'] += 1
    
    # 转换为DataFrame
    df = pd.DataFrame(list(user_data.values()))
    return df

# 保存聚合后的数据用于AB-test分析
# aggregated_df = aggregate_user_data(event_logs)
# aggregated_df.to_csv('ab_test_results.csv', index=False)
```
{{< /admonition >}}

### 2.6.5 灰度测试

在正式开启AB-test之前，为了确保实验的改动不会对系统或用户体验造成巨大的异常影响，通常需要先选取一小部分用户样本进行 **灰度测试（Gray Release）**。灰度测试是一种渐进式的实验方法，旨在通过对少量用户的观察，评估实验改动点的风险和稳定性。

在此过程中，实验组和对照组的分流比例会设置得较低，例如只对5%或10%的用户进行分组，以便在影响范围较小的情况下，尽早发现可能存在的异常问题或不良反应。通过灰度测试，可以验证实验的功能是否正常，用户体验是否符合预期，以及核心指标是否出现重大波动。

## 2.7 AB-test上线与数据收集

完成灰度测试后，如果测试结果显示实验改动点的功能正常且风险可控，则可以正式启动AB-test。在这一阶段，需要按照预先设定的样本量和实验周期，合理分配流量，确保实验组和对照组的用户分布具有随机性和均匀性。

正式的AB-test过程中，需持续监控核心指标和其他相关指标的变化情况，并对实验数据进行实时记录，确保数据的完整性和准确性。在实验周期结束后，进入数据分析阶段，通过严谨的统计学方法对实验数据进行深入分析。

## 2.8 假设检验方法论

在获得实验结果后，需要选择合适的假设检验方法对AB-test的结果进行显著性检验，以判断实验改动点是否对核心指标产生了统计学意义上的显著影响。

### 2.8.1 假设的建立

设对照组的点击率为 $k_0$，实验组的点击率为 $k_1$，则：

**原假设（Null Hypothesis）：**
$$
H_0: k_0 = k_1
$$

**备择假设（Alternative Hypothesis）：**
$$
H_1: k_0 < k_1
$$

### 2.8.2 常用假设检验方法

#### （1）独立双样本 Z 检验

**适用场景：** 两组样本相互独立，均服从正态分布或近似正态分布，方差已知或方差未知但样本量足够大。

**检验统计量：**

当方差已知时：
$$
Z = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{\frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2}}}
$$

当总体方差未知但样本量较大时，可用样本方差代替：
$$
Z = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}
$$

**拒绝域：** $Z \leq Z_\alpha$

#### （2）独立双样本 t 检验

**适用场景：** 两组样本相互独立，均服从正态分布或近似正态分布，方差未知但相等。

**检验统计量：**
$$
t = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{s_w^2 \left( \frac{1}{n_1} + \frac{1}{n_2} \right)}}
$$

其中，合并方差：
$$
s_w^2 = \frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}
$$

**拒绝域：** $t \leq t_{\alpha}(n_1 + n_2 - 2)$

#### （3）Welch's t 检验

**适用场景：** 两组样本相互独立，均服从正态分布或近似正态分布，方差未知且不相等（不需要方差齐性假设）。

**检验统计量：**
$$
t = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}
$$

**自由度：**
$$
df = \frac{\left( \frac{s_1^2}{n_1} + \frac{s_2^2}{n_2} \right)^2}{\frac{\left( \frac{s_1^2}{n_1} \right)^2}{n_1 - 1} + \frac{\left( \frac{s_2^2}{n_2} \right)^2}{n_2 - 1}}
$$

**拒绝域：** $t < t_{\alpha}(df)$

#### （4）Wilcoxon (Mann-Whitney) 秩和检验

**适用场景：** 两组样本相互独立但不服从正态分布（非参数检验）。

**检验统计量：**
$$
W = R_1 = \sum_{i=1}^{n_1} R(X_i)
$$

其中，$R(X_i)$ 是 $X_i$ 在两组样本合并后的秩。

当 $H_0$ 成立时：
$$
W \sim N\left(\frac{n_1 (n_1 + n_2 + 1)}{2}, \frac{n_1 n_2 (n_1 + n_2 + 1)}{12}\right)
$$

**标准化统计量：**
$$
Z = \frac{W - \frac{n_1 (n_1 + n_2 + 1)}{2}}{\sqrt{\frac{n_1 n_2 (n_1 + n_2 + 1)}{12}}}
$$

**拒绝域：** $Z < Z_\alpha$

#### （5）McNemar's 检验

**适用场景：** 样本数据为二分类变量，常用于检验两个分类变量在实验前后或两种处理方式下的一致性（配对数据）。

**检验统计量：**
$$
\chi^2 = \frac{(n_{12} - n_{21})^2}{n_{12} + n_{21}}
$$

**拒绝域：** $\chi^2 > \chi^2_{\alpha}(1)$

# 3. 数据准备与清洗

## 3.1 导入必要的库

导入数据分析所需的Python库，包括数据处理（NumPy、Pandas）、统计检验（SciPy）和可视化（Pyecharts）。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 数据处理库
import numpy as np
import pandas as pd
from scipy import stats  # pyright: ignore[reportMissingImports]
from scipy.stats import mannwhitneyu  # pyright: ignore[reportMissingImports]
import warnings

# 可视化库 - 使用Pyecharts
from pyecharts import options as opts  # pyright: ignore[reportMissingImports]
from pyecharts.charts import Bar, Line, Pie, Grid, Scatter, Boxplot  # pyright: ignore[reportMissingImports]
from pyecharts.globals import ThemeType  # pyright: ignore[reportMissingImports]

# 配置
warnings.filterwarnings('ignore')
pd.set_option('display.max_columns', None)
pd.set_option('display.max_rows', 100)
pd.set_option('display.float_format', lambda x: '%.4f' % x)

print("✓ 所有库导入成功！")
```

```
✓ 所有库导入成功！
```
{{< /admonition >}}



## 3.2 读取数据集

读取AB测试原始数据，并查看数据的基本信息和样本分布情况。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 读取AB-test原始数据
original_data = pd.read_csv('ab_test_results.csv', encoding='utf-8')

print(f"数据集规模：{original_data.shape[0]} 行 × {original_data.shape[1]} 列")
print(f"对照组样本量：{(original_data['group'] == 'control').sum()}")
print(f"实验组样本量：{(original_data['group'] == 'test').sum()}")
print("\n前5行数据预览：")
original_data.head()
```

```
数据集规模：120000 行 × 4 列
对照组样本量：60000
实验组样本量：60000

前5行数据预览：
   user_id    group   views  clicks
0        1  control 10.0000  0.0000
1        2  control  1.0000  0.0000
2        3  control  1.0000  0.0000
3        4  control  2.0000  0.0000
4        5  control  3.0000  0.0000
```
{{< /admonition >}}



## 3.3 数据质量评估

数据评估主要从两个方面进行：**结构（整齐度）**和**内容（干净度）**。

- **结构性问题**：不符合"每个变量为一列，每个观察值为一行，每种类型的观察单位为一个表格"的规范（Tidy Data原则）
- **内容性问题**：包括缺失数据、重复数据、异常值、不一致数据等

### 3.3.1 数据整齐度评估

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 创建数据副本用于清洗
cleaned_data = original_data.copy()
print("✓ 已创建数据副本")
```

```
✓ 已创建数据副本
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 随机抽样查看数据结构
print("随机抽样5行数据：")
cleaned_data.sample(5)
```

```
        user_id    group  views  clicks
2524       2525  control 2.0000  2.0000
43527     43528  control 1.0000  1.0000
109727   109728     test 7.0000  0.0000
34158     34159  control 2.0000  0.0000
33540     33541  control 4.0000  0.0000
```
{{< /admonition >}}



任取5行数据查看，发现数据符合"每个变量为一列，每个观察值为一行，每种类型的观察单位为一个表格"这三个标准。数据整洁，没有结构性问题。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 查看数据基本信息和缺失值情况
print("=" * 60)
print("数据集基本信息：")
print("=" * 60)
cleaned_data.info()

print("\n" + "=" * 60)
print("各列缺失值统计：")
print("=" * 60)
missing_df = pd.DataFrame({
    '列名': cleaned_data.columns,
    '缺失值数量': cleaned_data.isnull().sum().values,
    '缺失率': (cleaned_data.isnull().sum() / len(cleaned_data) * 100).values
})
print(missing_df.to_string(index=False))
```

```
============================================================
数据集基本信息：
============================================================
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 120000 entries, 0 to 119999
Data columns (total 4 columns):
 #   Column   Non-Null Count   Dtype  
---  ------   --------------   -----  
 0   user_id  120000 non-null  int64  
 1   group    120000 non-null  object 
 2   views    120000 non-null  float64
 3   clicks   120000 non-null  float64
dtypes: float64(2), int64(1), object(1)
memory usage: 3.7+ MB

============================================================
各列缺失值统计：
============================================================
     列名  缺失值数量    缺失率
user_id      0 0.0000
  group      0 0.0000
  views      0 0.0000
 clicks      0 0.0000
```
{{< /admonition >}}



**评估结论：** 数据集各变量均无缺失值，数据完整性良好。`group`变量理论上只有两个取值（control和test），可将其类型优化为category以节省内存。

### 3.3.2 缺失值检测

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 检测完全重复的行
duplicate_rows = cleaned_data.duplicated().sum()
print(f"完全重复的行数：{duplicate_rows}")
```

```
完全重复的行数：0
```
{{< /admonition >}}



### 3.3.3 重复值检测

`user_id`作为每个用户的唯一标识符不应出现重复，需单独检测：

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 检测user_id是否存在重复
duplicate_users = cleaned_data['user_id'].duplicated().sum()
print(f"重复的user_id数量：{duplicate_users}")
print(f"唯一用户数：{cleaned_data['user_id'].nunique()}")
```

```
重复的user_id数量：0
唯一用户数：120000
```
{{< /admonition >}}



**评估结论：** 数据集不存在重复记录，每个user_id唯一，数据质量良好。

### 3.3.4 分组一致性检测

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 检查分组分布
print("分组分布统计：")
group_counts = cleaned_data['group'].value_counts()
print(group_counts)

print(f"\n分组比例：")
print(f"对照组：{group_counts['control'] / len(cleaned_data) * 100:.2f}%")
print(f"实验组：{group_counts['test'] / len(cleaned_data) * 100:.2f}%")
```

```
分组分布统计：
group
control    60000
test       60000
Name: count, dtype: int64

分组比例：
对照组：50.00%
实验组：50.00%
```
{{< /admonition >}}



**评估结论：** `group`变量只有对照组（control）和实验组（test）两个取值，分组均衡，不存在不一致数据。

### 3.3.5 异常值检测

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 查看数值型变量的描述性统计
print("数值型变量描述性统计：")
print("=" * 80)
cleaned_data.describe().T
```

```
数值型变量描述性统计：
================================================================================
              count       mean        std    min        25%        50%  \
user_id 120000.0000 60000.5000 34641.1605 1.0000 30000.7500 60000.5000   
views   120000.0000     4.9911     5.9152 1.0000     2.0000     3.0000   
clicks  120000.0000     0.1827     0.4725 0.0000     0.0000     0.0000   

              75%         max  
user_id 90000.2500 120000.0000  
views       6.0000    205.0000  
clicks      0.0000      9.0000  
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 检查views和clicks是否为整数
views_int = cleaned_data['views'].apply(lambda x: x.is_integer()).sum()
clicks_int = cleaned_data['clicks'].apply(lambda x: x.is_integer()).sum()
total_records = len(cleaned_data)

print(f"views列为整数的记录数：{views_int} / {total_records}")
print(f"clicks列为整数的记录数：{clicks_int} / {total_records}")

# 检查逻辑一致性：clicks不应大于views
invalid_records = (cleaned_data['clicks'] > cleaned_data['views']).sum()
print(f"\n点击量大于浏览量的异常记录数：{invalid_records}")
```

```
views列为整数的记录数：120000 / 120000
clicks列为整数的记录数：120000 / 120000

点击量大于浏览量的异常记录数：0
```
{{< /admonition >}}



**评估结论：** 从描述性统计来看，数据分布合理，无明显异常值。所有数值均为整数（浏览和点击次数应为整数），且点击量不大于浏览量，符合业务逻辑。

## 3.4 数据清洗与特征工程

根据数据评估结果以及分析需求，需要完成如下数据清洗和特征工程工作：

1. **类型优化**：将`group`变量类型修改为`category`，节省内存
2. **特征工程**：计算每个用户的点击率（CTR），添加为新列`rate`

点击率计算公式：
$$
\text{CTR} = \frac{\text{clicks}}{\text{views}} \times 100\%
$$

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 步骤1：优化group变量类型
cleaned_data['group'] = cleaned_data['group'].astype('category')
print("✓ 已将group列转换为category类型")
```

```
✓ 已将group列转换为category类型
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
cleaned_data.info()
```

```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 120000 entries, 0 to 119999
Data columns (total 4 columns):
 #   Column   Non-Null Count   Dtype   
---  ------   --------------   -----   
 0   user_id  120000 non-null  int64   
 1   group    120000 non-null  category
 2   views    120000 non-null  float64 
 3   clicks   120000 non-null  float64 
dtypes: category(1), float64(2), int64(1)
memory usage: 2.9 MB
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 步骤2：计算点击率（CTR）
# 注意：对于views为0的情况，点击率设为0（避免除零错误）
cleaned_data['rate'] = cleaned_data.apply(
    lambda row: row['clicks'] / row['views'] if row['views'] > 0 else 0, 
    axis=1
)

print("✓ 已计算点击率（CTR）")
print(f"\n整体平均点击率：{cleaned_data['rate'].mean():.4f} ({cleaned_data['rate'].mean()*100:.2f}%)")
```

```
✓ 已计算点击率（CTR）

整体平均点击率：0.0367 (3.67%)
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 查看清洗后的数据样本
print("清洗后的数据样本（含点击率）：")
cleaned_data.sample(10)
```

```
清洗后的数据样本（含点击率）：
        user_id    group   views  clicks   rate
110763   110764     test  4.0000  0.0000 0.0000
26513     26514  control  3.0000  0.0000 0.0000
101508   101509     test  2.0000  0.0000 0.0000
88990     88991     test  2.0000  0.0000 0.0000
57479     57480  control  4.0000  0.0000 0.0000
72530     72531     test  2.0000  0.0000 0.0000
110904   110905     test  4.0000  1.0000 0.2500
66814     66815     test 10.0000  0.0000 0.0000
89160     89161     test  1.0000  0.0000 0.0000
45922     45923  control 15.0000  0.0000 0.0000
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 保存清洗后的数据
cleaned_data.to_csv('cleaned_data.csv', index=False, encoding='utf-8')
print("✓ 清洗后的数据已保存至 cleaned_data.csv")
```

```
✓ 清洗后的数据已保存至 cleaned_data.csv
```
{{< /admonition >}}



# 4. 探索性数据分析（EDA）

在进行假设检验前，先对两组数据进行探索性分析，直观了解数据分布和差异。

## 4.1 分组数据提取与基本统计

将数据集按分组拆分为对照组和实验组两个样本：

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 提取对照组数据
control_data = cleaned_data.query('group == "control"')['rate']
control_group = cleaned_data.query('group == "control"')

print(f"对照组样本量：{len(control_data)}")
print(f"对照组点击率均值：{control_data.mean():.4f}")
print(f"对照组点击率标准差：{control_data.std():.4f}")
print(f"对照组点击率中位数：{control_data.median():.4f}")
```

```
对照组样本量：60000
对照组点击率均值：0.0347
对照组点击率标准差：0.1146
对照组点击率中位数：0.0000
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 提取实验组数据
test_data = cleaned_data.query('group == "test"')['rate']
test_group = cleaned_data.query('group == "test"')

print(f"实验组样本量：{len(test_data)}")
print(f"实验组点击率均值：{test_data.mean():.4f}")
print(f"实验组点击率标准差：{test_data.std():.4f}")
print(f"实验组点击率中位数：{test_data.median():.4f}")
```

```
实验组样本量：60000
实验组点击率均值：0.0386
实验组点击率标准差：0.1209
实验组点击率中位数：0.0000
```
{{< /admonition >}}



{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 计算两组点击率及差异
ctrl_rate = control_data.mean()
test_rate = test_data.mean()
absolute_lift = test_rate - ctrl_rate
relative_lift = (test_rate - ctrl_rate) / ctrl_rate * 100

print("=" * 70)
print("两组点击率对比：")
print("=" * 70)
print(f"对照组平均点击率：{ctrl_rate:.4f} ({ctrl_rate*100:.2f}%)")
print(f"实验组平均点击率：{test_rate:.4f} ({test_rate*100:.2f}%)")
print(f"\n绝对提升：{absolute_lift:.4f} ({absolute_lift*100:.2f} 个百分点)")
print(f"相对提升：{relative_lift:.2f}%")
print("=" * 70)
```

```
======================================================================
两组点击率对比：
======================================================================
对照组平均点击率：0.0347 (3.47%)
实验组平均点击率：0.0386 (3.86%)

绝对提升：0.0040 (0.40 个百分点)
相对提升：11.52%
======================================================================
```
{{< /admonition >}}



**初步观察：** 实验组相较于对照组，点击率有一定提升，但这可能是由随机误差引起的。因此，需要通过严格的统计假设检验来验证这个差异是否具有统计显著性。

## 4.2 点击率分布直方图

使用Pyecharts绘制对照组和实验组的点击率分布直方图，直观展示两组数据的分布特征。通过直方图可以观察数据的偏态、集中趋势和离散程度。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 使用Pyecharts绘制点击率分布直方图
# 准备直方图数据
def prepare_histogram_data(data, bins=30):
    """将数据转换为直方图所需的格式"""
    counts, bin_edges = np.histogram(data, bins=bins)
    bin_centers = [(bin_edges[i] + bin_edges[i+1]) / 2 for i in range(len(bin_edges)-1)]
    return bin_centers, counts.tolist()

# 对照组直方图数据
control_bins, control_counts = prepare_histogram_data(control_data, bins=30)
# 实验组直方图数据
test_bins, test_counts = prepare_histogram_data(test_data, bins=30)

# 创建对照组直方图
bar_control = (
    Bar(init_opts=opts.InitOpts(theme=ThemeType.LIGHT, width="900px", height="450px"))
    .add_xaxis([f"{x:.3f}" for x in control_bins])
    .add_yaxis(
        "频数", 
        control_counts,
        itemstyle_opts=opts.ItemStyleOpts(color="#5470C6"),
        label_opts=opts.LabelOpts(is_show=False)
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(
            title="对照组点击率分布",
            pos_left="center"
        ),
        xaxis_opts=opts.AxisOpts(
            name="点击率 (CTR)",
            axislabel_opts=opts.LabelOpts(rotate=45, interval=2)
        ),
        yaxis_opts=opts.AxisOpts(name="频数"),
        datazoom_opts=[opts.DataZoomOpts(type_="inside")],
        toolbox_opts=opts.ToolboxOpts(is_show=True)
    )
)

# 创建实验组直方图
bar_test = (
    Bar(init_opts=opts.InitOpts(theme=ThemeType.LIGHT, width="900px", height="450px"))
    .add_xaxis([f"{x:.3f}" for x in test_bins])
    .add_yaxis(
        "频数", 
        test_counts,
        itemstyle_opts=opts.ItemStyleOpts(color="#91CC75"),
        label_opts=opts.LabelOpts(is_show=False)
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(
            title="实验组点击率分布",
            pos_left="center"
        ),
        xaxis_opts=opts.AxisOpts(
            name="点击率 (CTR)",
            axislabel_opts=opts.LabelOpts(rotate=45, interval=2)
        ),
        yaxis_opts=opts.AxisOpts(name="频数"),
        datazoom_opts=[opts.DataZoomOpts(type_="inside")],
        toolbox_opts=opts.ToolboxOpts(is_show=True)
    )
)

print("对照组点击率分布直方图：")
bar_control.render_notebook()

print("\n实验组点击率分布直方图：")
bar_test.render_notebook()

print("\n从直方图可以看出，两组数据的点击率分布均呈现明显的右偏分布，不符合正态分布。")
```
{{< /admonition >}}

```echarts
{
  "title": {
    "text": "对照组点击率分布",
    "left": "center"
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "xAxis": {
    "type": "category",
    "name": "点击率 (CTR)",
    "data": ["0.017", "0.050", "0.083", "0.117", "0.150", "0.183", "0.217", "0.250", "0.283", "0.317", "0.350", "0.383", "0.417", "0.450", "0.483", "0.517", "0.550", "0.583", "0.617", "0.650", "0.683", "0.717", "0.750", "0.783", "0.817", "0.850", "0.883", "0.917", "0.950", "0.983"],
    "axisLabel": {
      "rotate": 45,
      "interval": 2
    }
  },
  "yAxis": {
    "type": "value",
    "name": "频数"
  },
  "series": [{
    "name": "频数",
    "type": "bar",
    "data": [54697, 4010, 786, 264, 121, 54, 25, 13, 11, 6, 3, 2, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    "itemStyle": {
      "color": "#5470C6"
    }
  }],
  "dataZoom": [{
    "type": "inside"
  }],
  "toolbox": {
    "show": true,
    "feature": {
      "saveAsImage": {},
      "restore": {},
      "dataView": {},
      "dataZoom": {},
      "magicType": {
        "type": ["line", "bar"]
      }
    }
  }
}
```

```echarts
{
  "title": {
    "text": "实验组点击率分布",
    "left": "center"
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "xAxis": {
    "type": "category",
    "name": "点击率 (CTR)",
    "data": ["0.017", "0.050", "0.083", "0.117", "0.150", "0.183", "0.217", "0.250", "0.283", "0.317", "0.350", "0.383", "0.417", "0.450", "0.483", "0.517", "0.550", "0.583", "0.617", "0.650", "0.683", "0.717", "0.750", "0.783", "0.817", "0.850", "0.883", "0.917", "0.950", "0.983"],
    "axisLabel": {
      "rotate": 45,
      "interval": 2
    }
  },
  "yAxis": {
    "type": "value",
    "name": "频数"
  },
  "series": [{
    "name": "频数",
    "type": "bar",
    "data": [53759, 4438, 958, 451, 189, 98, 44, 25, 13, 8, 4, 4, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    "itemStyle": {
      "color": "#91CC75"
    }
  }],
  "dataZoom": [{
    "type": "inside"
  }],
  "toolbox": {
    "show": true,
    "feature": {
      "saveAsImage": {},
      "restore": {},
      "dataView": {},
      "dataZoom": {},
      "magicType": {
        "type": ["line", "bar"]
      }
    }
  }
}
```

从直方图可以看出，两组数据的点击率分布均呈现明显的右偏分布，不符合正态分布。

# 5. 假设检验

## 5.1 假设的建立

设对照组的点击率为 $k_0$，实验组的点击率为 $k_1$，则：

**原假设（$H_0$）：** 实验改动点对核心指标无影响
$$
H_0: k_0 = k_1
$$

**备择假设（$H_1$）：** 实验组点击率显著高于对照组
$$
H_1: k_0 < k_1
$$

## 5.2 正态性检验

为选择合适的假设检验方法，首先需要检验两组样本是否服从正态分布。由于每组样本量为60000，属于大样本，选用**Kolmogorov-Smirnov检验（K-S检验）**。

建立原假设和备择假设后，需要根据样本的特点，选用合适的假设检验方法进行检验。  
先检验两组样本是否符合正态性假设，由于每组样本的样本量为6000，属于大样本，因此选用Kolmogorov-Smirnov检验方法。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# K-S正态性检验
alpha = 0.05

# 标准化函数
def standardized(x):
    """将数据标准化为均值0，标准差1"""
    return (x - np.mean(x)) / np.std(x)

print("=" * 70)
print("Kolmogorov-Smirnov 正态性检验")
print("=" * 70)

# 对照组K-S检验
stat_control, p_value_control = stats.kstest(standardized(control_data), 'norm')
print(f"\n【对照组】")
print(f"  KS 检验统计量: {stat_control:.4f}")
print(f"  p 值: {p_value_control:.6f}")
if p_value_control < alpha:
    print(f"  结论：拒绝原假设（p < {alpha}），对照组数据 **不服从** 正态分布")
else:
    print(f"  结论：无法拒绝原假设（p >= {alpha}），对照组数据服从正态分布")

# 实验组K-S检验
stat_test, p_value_test = stats.kstest(standardized(test_data), 'norm')
print(f"\n【实验组】")
print(f"  KS 检验统计量: {stat_test:.4f}")
print(f"  p 值: {p_value_test:.6f}")
if p_value_test < alpha:
    print(f"  结论：拒绝原假设（p < {alpha}），实验组数据 **不服从** 正态分布")
else:
    print(f"  结论：无法拒绝原假设（p >= {alpha}），实验组数据服从正态分布")

print("=" * 70)
```

```
======================================================================
Kolmogorov-Smirnov 正态性检验
======================================================================

【对照组】
  KS 检验统计量: 0.4718
  p 值: 0.000000
  结论：拒绝原假设（p < 0.05），对照组数据 **不服从** 正态分布

【实验组】
  KS 检验统计量: 0.4637
  p 值: 0.000000
  结论：拒绝原假设（p < 0.05），实验组数据 **不服从** 正态分布
======================================================================
```
{{< /admonition >}}



**检验结论：** K-S检验结果和直方图均表明两组样本都 **不服从正态分布**（p值接近0，远小于0.05）。这是点击率数据的常见情况，因为点击率通常呈现右偏分布。

在这种情况下，不适合使用依赖正态性假设的参数检验方法（如t检验、Z检验），应选择 **非参数统计方法** 进行检验。

## 5.3 Mann-Whitney U 检验（Wilcoxon秩和检验）

由于两组样本相互独立但不服从正态分布，本项目选用 **Mann-Whitney U检验**（也称Wilcoxon秩和检验）进行假设检验。这是一种非参数检验方法，通过比较两组数据的秩来判断是否存在显著差异。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# Mann-Whitney U 检验
print("=" * 70)
print("Mann-Whitney U 检验（Wilcoxon秩和检验）")
print("=" * 70)

# 执行单侧检验（alternative='less'表示检验对照组是否小于实验组）
u_statistic, p_value = mannwhitneyu(control_data, test_data, alternative='less')

print(f"\nU 统计量: {u_statistic:,.0f}")
print(f"p 值: {p_value:.10f}")
print(f"显著性水平 α: {alpha}")

print("\n" + "-" * 70)
print("检验结论：")
print("-" * 70)

if p_value < alpha:
    print(f"✓ p值 ({p_value:.10f}) < α ({alpha})")
    print(f"✓ 在{(1-alpha)*100}%的置信水平下，**拒绝原假设**")
    print(f"✓ 结论：实验组的点击率 **显著高于** 对照组")
    print(f"✓ 实验改动点对核心指标（点击率）有 **统计学显著提升**")
else:
    print(f"✗ p值 ({p_value:.10f}) >= α ({alpha})")
    print(f"✗ 在{(1-alpha)*100}%的置信水平下，**无法拒绝原假设**")
    print(f"✗ 结论：无充分证据表明实验组点击率高于对照组")
    print(f"✗ 实验改动点对核心指标的提升不显著")

print("=" * 70)
```

```
======================================================================
Mann-Whitney U 检验（Wilcoxon秩和检验）
======================================================================

U 统计量: 1,773,003,355
p 值: 0.0000000000
显著性水平 α: 0.05

----------------------------------------------------------------------
检验结论：
----------------------------------------------------------------------
✓ p值 (0.0000000000) < α (0.05)
✓ 在95.0%的置信水平下，**拒绝原假设**
✓ 结论：实验组的点击率 **显著高于** 对照组
✓ 实验改动点对核心指标（点击率）有 **统计学显著提升**
======================================================================
```
{{< /admonition >}}



## 5.4 效应量评估

虽然假设检验表明差异具有统计显著性，但统计显著不等于业务显著。在大样本情况下，即便核心指标只提升了微小的量，在统计假设检验中也可能被检测为显著。因此，还需要评估 **效应量（Effect Size）**，即提升的实际幅度是否具有业务价值。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 效应量计算
print("=" * 70)
print("效应量（Effect Size）评估")
print("=" * 70)

# Cohen's d（标准化效应量）
pooled_std = np.sqrt(((len(control_data)-1) * control_data.std()**2 + 
                       (len(test_data)-1) * test_data.std()**2) / 
                      (len(control_data) + len(test_data) - 2))
cohens_d = (test_rate - ctrl_rate) / pooled_std

print(f"\n1. 绝对提升：")
print(f"   点击率提升: {absolute_lift:.4f} ({absolute_lift*100:.2f} 个百分点)")

print(f"\n2. 相对提升：")
print(f"   提升比例: {relative_lift:.2f}%")

print(f"\n3. Cohen's d（标准化效应量）：")
print(f"   Cohen's d = {cohens_d:.4f}")
if abs(cohens_d) < 0.2:
    effect_size_interpretation = "小效应"
elif abs(cohens_d) < 0.5:
    effect_size_interpretation = "中等效应"
else:
    effect_size_interpretation = "大效应"
print(f"   效应量大小: {effect_size_interpretation}")

print(f"\n4. 业务影响预估：")
total_views_test = test_group['views'].sum()
total_clicks_control_rate = total_views_test * ctrl_rate
total_clicks_test_rate = total_views_test * test_rate
additional_clicks = total_clicks_test_rate - total_clicks_control_rate

print(f"   如果实验组的浏览量为 {total_views_test:,.0f}，")
print(f"   使用对照组点击率预期点击数: {total_clicks_control_rate:,.0f}")
print(f"   使用实验组点击率实际点击数: {total_clicks_test_rate:,.0f}")
print(f"   增加的点击数: {additional_clicks:,.0f} （提升 {relative_lift:.2f}%）")

print("=" * 70)
```

```
======================================================================
效应量（Effect Size）评估
======================================================================

1. 绝对提升：
   点击率提升: 0.0040 (0.40 个百分点)

2. 相对提升：
   提升比例: 11.52%

3. Cohen's d（标准化效应量）：
   Cohen's d = 0.0339
   效应量大小: 小效应

4. 业务影响预估：
   如果实验组的浏览量为 301,785，
   使用对照组点击率预期点击数: 10,458
   使用实验组点击率实际点击数: 11,663
   增加的点击数: 1,205 （提升 11.52%）
======================================================================
```
{{< /admonition >}}



# 6. 数据可视化对比分析

## 6.1 点击率对比柱状图

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 使用Pyecharts绘制点击率对比柱状图
bar_chart = (
    Bar(init_opts=opts.InitOpts(theme=ThemeType.LIGHT, width="900px", height="500px"))
    .add_xaxis(["对照组 (Control)", "实验组 (Test)"])
    .add_yaxis(
        "平均点击率 (CTR)", 
        [round(ctrl_rate * 100, 2), round(test_rate * 100, 2)],
        label_opts=opts.LabelOpts(
            is_show=True,
            position="top",
            formatter="{c}%"
        ),
        itemstyle_opts=opts.ItemStyleOpts(
            color="#5470C6"
        )
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(
            title="AB测试点击率对比",
            pos_left="center"
        ),
        yaxis_opts=opts.AxisOpts(
            name="点击率 (%)",
            axislabel_opts=opts.LabelOpts(formatter="{value}%")
        ),
        xaxis_opts=opts.AxisOpts(
            name="分组"
        ),
        toolbox_opts=opts.ToolboxOpts(
            is_show=True,
            feature=opts.ToolBoxFeatureOpts(
                save_as_image=opts.ToolBoxFeatureSaveAsImageOpts(title="保存为图片"),
                restore=opts.ToolBoxFeatureRestoreOpts(title="还原"),
                data_view=opts.ToolBoxFeatureDataViewOpts(title="数据视图"),
            )
        )
    )
)

bar_chart.render_notebook()
```
{{< /admonition >}}

```echarts
{
  "title": {
    "text": "AB测试点击率对比",
    "left": "center"
  },
  "tooltip": {
    "trigger": "item",
    "formatter": "{b}: {c}%"
  },
  "xAxis": {
    "type": "category",
    "name": "分组",
    "data": ["对照组 (Control)", "实验组 (Test)"]
  },
  "yAxis": {
    "type": "value",
    "name": "点击率 (%)",
    "axisLabel": {
      "formatter": "{value}%"
    }
  },
  "series": [{
    "name": "平均点击率 (CTR)",
    "type": "bar",
    "data": [3.47, 3.86],
    "itemStyle": {
      "color": "#5470C6"
    },
    "label": {
      "show": true,
      "position": "top",
      "formatter": "{c}%"
    }
  }],
  "toolbox": {
    "show": true,
    "left": "80%",
    "feature": {
      "saveAsImage": {
        "title": "保存为图片"
      },
      "restore": {
        "title": "还原"
      },
      "dataView": {
        "title": "数据视图"
      },
      "dataZoom": {
        "show": true
      },
      "magicType": {
        "show": true,
        "type": ["line", "bar", "stack", "tiled"]
      }
    }
  }
}
```

## 6.2 总浏览量与总点击量对比

对比分析对照组和实验组的总浏览量和总点击量，从总体数据量角度评估两组的差异。

{{< admonition type="info" title="代码与输出" collapse="true" >}}
```python
# 计算汇总数据
control_summary = {
    'total_views': control_group['views'].sum(),
    'total_clicks': control_group['clicks'].sum(),
    'avg_ctr': ctrl_rate * 100
}

test_summary = {
    'total_views': test_group['views'].sum(),
    'total_clicks': test_group['clicks'].sum(),
    'avg_ctr': test_rate * 100
}

# 使用Pyecharts绘制分组柱状图
bar_multi = (
    Bar(init_opts=opts.InitOpts(theme=ThemeType.LIGHT, width="900px", height="500px"))
    .add_xaxis(["对照组", "实验组"])
    .add_yaxis(
        "总浏览量 (Views)", 
        [int(control_summary['total_views']), int(test_summary['total_views'])],
        label_opts=opts.LabelOpts(is_show=True, position="top", formatter="{c}"),
    )
    .add_yaxis(
        "总点击量 (Clicks)", 
        [int(control_summary['total_clicks']), int(test_summary['total_clicks'])],
        label_opts=opts.LabelOpts(is_show=True, position="top", formatter="{c}"),
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(
            title="浏览量与点击量对比",
            pos_left="center"
        ),
        yaxis_opts=opts.AxisOpts(name="数量"),
        xaxis_opts=opts.AxisOpts(name="分组"),
        legend_opts=opts.LegendOpts(pos_top="5%"),
        toolbox_opts=opts.ToolboxOpts(is_show=True)
    )
)

bar_multi.render_notebook()
```
{{< /admonition >}}

```echarts
{
  "title": {
    "text": "浏览量与点击量对比",
    "left": "center"
  },
  "tooltip": {
    "trigger": "item"
  },
  "legend": {
    "top": "5%",
    "data": ["总浏览量 (Views)", "总点击量 (Clicks)"]
  },
  "xAxis": {
    "type": "category",
    "name": "分组",
    "data": ["对照组", "实验组"]
  },
  "yAxis": {
    "type": "value",
    "name": "数量"
  },
  "series": [
    {
      "name": "总浏览量 (Views)",
      "type": "bar",
      "data": [297144, 301785],
      "label": {
        "show": true,
        "position": "top",
        "formatter": "{c}"
      }
    },
    {
      "name": "总点击量 (Clicks)",
      "type": "bar",
      "data": [10303, 11620],
      "label": {
        "show": true,
        "position": "top",
        "formatter": "{c}"
      }
    }
  ],
  "toolbox": {
    "show": true,
    "feature": {
      "saveAsImage": {},
      "restore": {},
      "dataView": {},
      "dataZoom": {},
      "magicType": {
        "type": ["line", "bar", "stack", "tiled"]
      }
    }
  }
}
```

# 7. 总结

## 行业CTR基准数据对比

| 应用场景 | 典型CTR范围 | 优秀提升幅度 | 数据来源 | 备注 |
|---------|------------|-------------|---------|------|
| **网页按钮点击** | 2-5% | 8-15% | Nielsen Norman Group, Google Analytics | 主要CTA按钮（如"购买"、"注册"） |
| **展示广告点击** | 0.5-2% | 10-20% | Google Ads, Facebook Ads Benchmarks | Banner广告、信息流广告 |
| **搜索广告点击** | 1.5-3% | 15-25% | Google Ads Industry Benchmarks | SEM搜索结果页广告 |
| **邮件打开率** | 15-25% | 5-10% | Mailchimp, Campaign Monitor | 营销邮件（非交易类） |
| **邮件点击率** | 2-5% | 10-15% | HubSpot Email Benchmarks | 邮件内链接点击 |
| **App功能使用** | 5-15% | 10-20% | Mixpanel, Amplitude | 新功能30天采用率 |
| **社交媒体互动** | 0.5-3% | 15-30% | Hootsuite, Sprout Social | 点赞、评论、分享等 |
| **视频播放率** | 20-40% | 5-10% | Wistia, Vidyard | 用户主动播放视频 |

## AB测试提升幅度评价标准

| 相对提升幅度 | 评价等级 | 建议行动 | 业务价值 |
|-------------|---------|---------|---------|
| < 3% | 微小改进 | 需要进一步优化或重新设计 | 可能不值得投入资源 |
| 3-5% | 小幅改进 | 可以考虑实施，需评估成本 | 有一定价值 |
| 5-10% | 良好改进 | 建议实施 | 值得投入 |
| **10-20%** | **优秀改进** | **强烈推荐上线** | **高投资回报** |
| 20-50% | 卓越改进 | 立即全量上线 | 极高价值 |
| > 50% | 突破性改进 | 立即上线并深度分析成功因素 | 可能改变业务格局 |

## 本案例对比分析

| 指标项 | 本案例数据 | 行业基准 | 评估结果 |
|-------|----------|---------|---------|
| **应用场景** | Web页面按钮点击 | 2-5% | 匹配 |
| **对照组CTR** | 3.47% | 2-5% | 符合行业正常范围 |
| **实验组CTR** | 3.86% | - | 高于对照组 |
| **绝对提升** | +0.39个百分点 | - | 显著提升 |
| **相对提升** | **+11.52%** | 8-15%（优秀） | **优秀级别** |
| **样本量** | 120,000 | - | 大样本，结论可靠 |
| **统计显著性** | p ≈ 0 | p < 0.05 | 极其显著 |
| **综合评价** | - | - | **强烈推荐上线** |

## AB-test结论
**实验改动点对核心指标点击率有显著性提升，提升幅度为0.4个百分点，涨幅为11%，预估带来较大的用户转化和经济效益，该项改进值得推广上线。**

