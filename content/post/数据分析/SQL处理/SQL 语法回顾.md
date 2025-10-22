---
title: "SQL 语法回顾"
date: 2024-09-08
categories: ["数据分析"]
tags: ["SQL","数据库", "数据分析"]
summary: "SQL 全称 Structured Query Language，结构化查询语言。操作关系型数据库的编程语言，定义了一套操作关系型数据库统一标准 "
---


# 基本语法

employees 表格

```sql
+-------------+---------------+--------+-----------+------------+---------------+
| employee_id | employee_name | salary | position  | hire_date  | department_id |
+-------------+---------------+--------+-----------+------------+---------------+
| 1           | Alice         | 5000   | Manager   | 2020-01-01 | 1             |
| 2           | Bob           | 3000   | Clerk     | 2019-05-15 | 1             |
| 3           | Charlie       | 7000   | Director  | 2018-11-20 | 2             |
| 4           | David         | 2000   | Intern    | 2022-03-01 | 3             |
+-------------+---------------+--------+-----------+------------+---------------+
```



## SELECT

> 用于从数据库表中选择数据

```sql
SELECT column1, column2, ...
FROM table_name;
```

例如：只想查看 employee_name 和 position 两列数据

```sql
SELECT employee_name, position
FROM employees;
```

运行结果：

```sql
+---------------+----------+
| employee_name | position |
+---------------+----------+
| Alice         | Manager  |
| Bob           | Clerk    |
| Charlie       | Director |
| David         | Intern   |
+---------------+----------+
```

## WHERE

> 用于过滤结果集

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition;
```

例如：我只想要月薪3000块钱以上的行

```sql
SELECT employee_name, salary
FROM employees
WHERE salary > 3000;
```

运行结果：

```sql
+---------------+--------+
| employee_name | salary |
+---------------+--------+
| Alice         | 5000   |
| Charlie       | 7000   |
+---------------+--------+
```

## ORDER BY

> 用于对结果集进行排序

```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1 ASC|DESC, column2 ASC|DESC, ...;
```

例如：我想将选出来的样本按照薪资降序排序

```sql
SELECT employee_name, salary
FROM employeesORDER BY salary DESC;
```

运行结果：

```sql
+---------------+--------+
| employee_name | salary |
+---------------+--------+
| Charlie       | 7000   |
| Alice         | 5000   |
| Bob           | 3000   |
| David         | 2000   |
+---------------+--------+
```

## GROUP BY

>通常与聚合函数（如 `COUNT()`，`SUM()`，`AVG()`，`MAX()`，`MIN()`）一起使用，将结果集分组。

```sql
SELECT column1, COUNT(column2)
FROM table_name
GROUP BY column1;
```

例如：想看一下每个部门有多少个人

```sql
SELECT department, COUNT(employee_id) as num_employees
FROM employees
GROUP BY department;
```

运行结果：

```sql
+------------+---------------+
| department | num_employees |
+------------+---------------+
| Sales      | 2             |
| HR         | 1             |
| IT         | 1             |
+------------+---------------+
```

## HAVING

> 用于过滤聚合函数的结果。（思考：这种筛选和 where 筛选有什么区别？）

```sql
SELECT column1, COUNT(column2)
FROM table_name
GROUP BY column1
HAVING COUNT(column2) > some_number;
```

例如：我想在第4个语法运行结果的基础上进行筛选，即筛选出有2人及以上的部门

```sql
SELECT department, COUNT(employee_id) as num_employees
FROM employees
GROUP BY department;
HAVING num_employees >= 2;
```

运行结果：

```sql
+---------------+---------------+
| department_id | num_employees |
+---------------+---------------+
| 1             | 2             |
+---------------+---------------+
```

## JOIN

> 用于从两个或多个表中基于相关列选择数据

- `INNER JOIN`：返回两个表中都存在的行

- `LEFT (OUTER) JOIN`：返回左表的所有行，以及与右表匹配的行

- `RIGHT (OUTER) JOIN`：返回右表的所有行，以及与左表匹配的行。

- `FULL (OUTER) JOIN`：返回左表和右表的所有行

  （ MySQL 没有 `FULL JOIN`，可以用 `UNION` 将 `LEFT JOIN` 和 `RIGHT JOIN` 何并起来，`UNION` 自带去重，确定没有重复行可以使用性能更高的 `UNION ALL` ）

假设我们还有一个 department 表格：

```sql
+---------------+----------------+------------+
| department_id | department_name| manager_id |
+---------------+----------------+------------+
| 1             | Sales          | 1          |
| 2             | HR             | 3          |
| 3             | IT             | NULL       |
+---------------+----------------+------------+
```

例如：使用左连接合并两张表来显示主表中每个人的所属部门名称

```sql
SELECT e.employee_id, e.employee_name, e.salary, e.position, e.hire_date, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

运行结果：

```sql
+----+----------+--------+----------+------------+------------+
| id | employee | salary | position | date       | department |
+----+----------+--------+----------+------------+------------+
| 1  | Alice    | 5000   | Manager  | 2020-01-01 | Sales      |
| 2  | Bob      | 3000   | Clerk    | 2019-05-15 | Sales      |
| 3  | Charlie  | 7000   | Director | 2018-11-20 | HR         |
| 4  | David    | 2000   | Intern   | 2022-03-01 | IT         |
+----+----------+--------+----------+------------+------------+
```

## DISTINCT

> 用于返回唯一的值，即确保返回的列中没有完全重复的行

```sql
SELECT DISTINCT column1, column2,...
FROM table_name;
```

## LIMIT

> 用于规定要返回的记录的数量

```sql
SELECT column1, column2, ...
FROM table_name
LIMIT number;
```

例如：想让返回的结果只显示2行（Python也有类似的语法）

```sql
SELECT employee_name
FROM employees
LIMIT 2;
```

运行结果

```sql
+---------------+
| employee_name |
+---------------+
| Alice         |
| Bob           |
+---------------+
```

## UNION

> 用于组合两个或多个 `SELECT` 语句的结果集，有去重效果（如果想保留重复的记录，请使用 `UNION ALL`）同样是拼接，`JOIN` 是左右拼接，而 `UNION` 是上下拼接

```sql
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;
```

例如：我想把部门的名字拼接到员工名字的后面

```sql
SELECT employee_name AS name
FROM employees
UNION
SELECT department_nameAS name
FROM departments;
```

运行结果：

```sql
+---------+
| name    |
+---------+
| Alice   |
| Bob     |
| Charlie |
| David   |
| Sales   |
| HR      |
+---------+
```

## IN

>  在指定的值列表中筛选

```sql
SELECT column_name(s)
FROM table_name
WHERE column_name IN (value1, value2, ...);
```

例如：筛选岗位名字为 Manager 或者 Director 的行

```sql
SELECT employee_name
FROM employees
WHERE position IN ('Manager', 'Director');
```

运行结果：

```
+---------------+
| employee_name |
+---------------+
| Alice         |
| Charlie       |
+---------------+
```

## LIKE

> 用于搜索模式

```sql
SELECT column_name(s)
FROM table_name
WHERE column_name LIKE pattern;
```

例如：我想要搜索 employee_name 为 A 开头的行

```sql
SELECT employee_name
FROM employees
WHERE employee_name LIKE 'A%';
```

运行结果：

```sql
+---------------+
| employee_name |
+---------------+
| Alice         |
+---------------+
```

## BETWEEN

> 用于选择范围内的值。

```sql
SELECT column_name(s)
FROM table_name
WHERE column_name BETWEEN value1 AND value2;
```

例如：将工资为 2000 到 5000 的行筛选出来

```sql
SELECT employee_name, salary
FROM employees
WHEREsalary BETWEEN 2000 AND 5000;
```

运行结果：

```sql
+---------------+--------+
| employee_name | salary |
+---------------+--------+
| Alice         | 5000   |
| Bob           | 3000   |
| David         | 2000   |
+---------------+--------+
```

## WITH (Common Table Expressions, CTE)

> WITH 子句在 SQL 中用于定义 Common Table Expressions (CTEs)，提供一种创建临时结果集的方法，在一个 SQL 语句的执行期间这些结果集是可用的。

它们通常用于将复杂的查询分解为**更简单**、**模块化**的部分，从而提高 SQL 查询的**可读性**和**维护性**。（当你需要**多次调用某一个子查询**结果时可以用）

```sql
WITH cte_name AS (
    SELECT column_name(s)
    FROM table_name
    WHERE condition
)
SELECT * FROM cte_name;
```

# 进阶语法

## 子查询（Subqueries）

> 子查询是嵌套在主查询中的SQL查询，可以作为数据源、条件或数据处理等。

**使用场景**：

- 在 WHERE 子句中，进行条性筛选，过滤主查询的结果
- 在 FROM 子句中，作为一个临时表
- 在 SELECT 子句中，返回一个值

**示例**：使用子查询找出低于平均工资的员工

```sql
SELECT employee_name, salary
FROM employees
WHERE salary < (SELECT AVG(salary) FROM employees);
```

**运行结果**：

```sql
+---------------+--------+
| employee_name | salary |
+---------------+--------+
| Bob           | 3000   |
| David         | 2000   |
+---------------+--------+
```

## 窗口函数 (Window Functions)

> SQL 中的**窗口函数**提供了在数据集的**特定部分（称为窗口）**上执行计算的能力，同时保持行的独立性。它们在处理涉及行之间关系的复杂查询时特别有用，如计算累计总和、移动平均或行的排名。

**主要开窗函数**：

- `ROW_NUMBER()`：这是一个常用的窗口函数，当我们需要为数据集的每一行分配一个唯一的序列号时，它非常实用。它经常被用于复杂的分页查询，或者当我们想要基于某些排序规则查看每个分组内的前几行数据时。
- `RANK()`：用于对窗口内的数据进行排名（比如：1,1,3,4,4,6...）
- `DENSE_RANK()`：和 `RANK()` 类似，但 `DENSE_RANK()` 在遇到并列的排名的时候不会跳过（比如：1,1,2,3,3,4...）
- `LEAD()`和 `LAG()`：允许我们直接在当前行访问前后行数据，而不需要复杂的自连接。
- `FIRST_VALUE()` 和 `LAST_VALUE()`：可以快速的获取窗口内第一个和最后一个值，例如我们需要提取某个月第一天或者最后一天的销售额。（在MySQL中不可用，了解即可）
- `NTILE(n)`：可以快速将数据分段，例如 `NTILE(4)` 可以快速将数据分成四等分并且分配对应的值。

**基本语法结构**：

```sql
<窗口函数>([参数表达式]) OVER (
    [PARTITION BY <分区块名>]
    [ORDERBY <排序列名> [ASC | DESC]]
) [AS <别名>]
```

**示例**：对每位员工的薪资进行降序排名

```sql
SELECTemployee_name, salary,
       RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;
```

**运行结果**：

```sql
+---------------+--------+------+
| employee_name | salary | rank |
+---------------+--------+------+
| Charlie       | 7000   | 1    |
| Alice         | 5000   | 2    |
| Bob           | 3000   | 3    |
| David         | 2000   | 4    |
+---------------+--------+------+
```

## CASE WHEN 语句

> 在 SQL 中用于实现条件逻辑。它类似于编程语言中的 if-else 语句。`CASE WHEN` 可以在 `SELECT`、`UPDATE` 和 `WHERE` 子句中使用，允许在查询结果中根据条件逻辑返回不同的值。

**基本语法结构**：

```sql
CASE
  WHEN <条件1> THEN <结果1>
  WHEN <条件2> THEN <结果2>
  ...
  ELSE <默认结果>
END
```

常见于SELECT语句中：用于根据某些条件更改列的显示方式，基于员工工资判断他们的收入等级:

**示例**：对员工的薪资进行分级

```sql
SELECT employee_name, salary,
CASE
  WHEN salary > 5000 THEN '高'
  WHEN salary BETWEEN 3000AND 5000 THEN '中'
  ELSE '低'
END AS salary_level
FROM employees;
```

**运行结果**：

```sql
+---------------+--------+--------------+
| employee_name | salary | salary_level |
+---------------+--------+--------------+
| Alice         | 5000   | 中           |
| Bob           | 3000   | 中           |
| Charlie       | 7000   | 高           |
| David         | 2000   | 低           |
+---------------+--------+--------------+
```