---
title: "Redis"
date: 2024-05-19T10:01:00+08:00
draft: false
---

{{< details "Redis 有哪些数据结构？" >}}
String, Hash, List, Set, Sorted Set.
{{< /details >}}

{{< details "Redis 的持久化方式有哪些？" >}}
RDB 和 AOF.
{{< /details >}}

{{< details "Redis 的哨兵（Sentinel）模式有什么作用？" >}}
哨兵模式用于实现 Redis 的高可用。它可以监控 master 节点的状态，并在 master 节点宕机时，自动将一个 slave 节点提升为新的 master 节点。
{{< /details >}}

{{< details "Redis 的缓存穿透、缓存击穿和缓存雪崩是什么？" >}}
- 缓存穿透：查询一个不存在的数据，导致请求一直访问数据库。
- 缓存击穿：一个热点 key 过期，导致大量请求同时访问数据库。
- 缓存雪崩：大量 key 同时过期，导致大量请求同时访问数据库。
{{< /details >}}

{{< details "Redis 的事务支持原子性吗？" >}}
Redis 的事务只保证隔离性和一致性，不保证原子性。事务中的命令会按顺序执行，但如果其中一个命令执行失败，其他命令仍然会继续执行。
{{< /details >}}

{{< details "Redis 的过期键删除策略有哪些？" >}}
- 定期删除：每隔一段时间，随机抽取一些设置了过期时间的 key，检查是否过期，如果过期就删除。
- 惰性删除：在访问一个 key 时，先检查它是否过期，如果过期就删除。
{{< /details >}}

{{< details "Redis 的内存淘汰策略有哪些？" >}}
noeviction, allkeys-lru, volatile-lru, allkeys-random, volatile-random, volatile-ttl.
{{< /details >}}

{{< details "Redis 如何实现分布式锁？" >}}
可以使用 SETNX 命令来实现。当一个客户端执行 SETNX key value 成功时，表示它获取了锁。执行完毕后，再通过 DEL 命令释放锁。
{{< /details >}}

{{< details "Redis 的主从复制是如何工作的？" >}}
主从复制分为全量复制和增量复制。当一个 slave 节点第一次连接 master 节点时，会进行全量复制。之后，master 节点会将写操作的命令同步给 slave 节点，进行增量复制。
{{< /details >}}

{{< details "Redis Cluster 的数据分片方式是什么？" >}}
Redis Cluster 采用哈希槽（hash slot）的方式来进行数据分片。它将 16384 个哈希槽分配给不同的节点。
{{< /details >}} 