---
title: "MySQL"
date: 2024-05-19T10:02:00+08:00
draft: false
---

{{< details "MySQL 的 InnoDB 和 MyISAM 存储引擎有什么区别？" >}}
- InnoDB 支持事务和外键，MyISAM 不支持。
- InnoDB 支持行级锁，MyISAM 只支持表级锁。
- InnoDB 的数据和索引是存储在同一个文件中的，MyISAM 是分开存储的。
{{< /details >}}

{{< details "MySQL 的索引有哪些类型？" >}}
普通索引、唯一索引、主键索引、组合索引、全文索引。
{{< /details >}}

{{< details "MySQL 的事务隔离级别有哪些？" >}}
读未提交、读已提交、可重复读、串行化。
{{< /details >}}

{{< details "MySQL 的 B+ 树索引有什么特点？" >}}
- 所有数据都存储在叶子节点上。
- 叶子节点之间通过指针连接，形成一个有序链表。
- 非叶子节点只存储索引，不存储数据。
{{< /details >}}

{{< details "MySQL 的 MVCC 是什么？" >}}
MVCC（多版本并发控制）是一种并发控制的方法。它通过保存数据在某个时间点的快照来实现。在 InnoDB 中，MVCC 是通过在每行记录后面保存两个隐藏的列来实现的。
{{< /details >}}

{{< details "MySQL 的 explain 命令有什么用？" >}}
explain 命令用于分析 SQL 语句的执行计划。它可以帮助我们了解 SQL 语句的执行情况，从而进行优化。
{{< /details >}}

{{< details "MySQL 的 binlog 有什么用？" >}}
binlog（二进制日志）记录了所有对数据库进行修改的操作。它可以用于数据恢复和主从复制。
{{< /details >}}

{{< details "MySQL 的慢查询日志有什么用？" >}}
慢查询日志用于记录执行时间超过指定阈值的 SQL 语句。它可以帮助我们找到性能瓶颈。
{{< /details >}}

{{< details "MySQL 的分库分表有哪些方式？" >}}
- 垂直拆分：将一个大表按列拆分成多个小表。
- 水平拆分：将一个大表按行拆分成多个小表。
{{< /details >}}

{{< details "MySQL 的索引优化有哪些方法？" >}}
- 避免在索引列上使用函数或表达式。
- 使用覆盖索引。
- 避免使用 select *。
- 使用联合索引时，遵循最左前缀原则。
{{< /details >}} 