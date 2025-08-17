---
title: "Go"
date: 2024-05-19T10:00:00+08:00
draft: false
---

{{< details "Go 语言的 goroutine 是什么？" "并发,基础" >}}
goroutine 是 Go 语言中并发执行的单元。它由 Go 运行时管理，比线程更轻量。
{{< /details >}}

{{< details "Go 语言的 channel 是什么？" "并发,通信" >}}
channel 是 goroutine 之间通信的管道。它可以用来在 goroutine 之间传递数据。
{{< /details >}}

{{< details "Go 语言的 defer 关键字有什么作用？" "关键字,语法" >}}
defer 用于延迟一个函数或方法的执行。被延迟的函数或方法会在当前函数执行完毕后，按照后进先出的顺序执行。
{{< /details >}}

{{< details "Go 语言的 select 语句有什么用？" "并发,语法" >}}
select 语句用于在多个 channel 操作中进行选择。它会阻塞，直到其中一个 channel 操作可以进行。
{{< /details >}}

{{< details "Go 语言的 map 是线程安全的吗？" "并发,数据结构" >}}
不是。如果需要在多个 goroutine 中并发地读写一个 map，必须使用互斥锁等同步机制来保护。
{{< /details >}}

{{< details "Go 语言中的 new 和 make 有什么区别？" "内存,函数" >}}
new 用于分配内存，返回指向类型的指针，并且该指针指向的值为该类型的零值。make 用于为 slice、map 和 channel 类型分配内存并初始化，返回的是类型本身，而不是指针。
{{< /details >}}

{{< details "Go 语言的接口（interface）是什么？" "接口,面向对象" >}}
接口是一组方法的集合。一个类型只要实现了接口中定义的所有方法，就被认为是实现了该接口。
{{< /details >}}

{{< details "Go 语言的 GMP 模型是什么？" "高级,调度,并发" >}}
GMP 是 Go 语言的调度器模型，G 代表 goroutine，M 代表内核线程，P 代表处理器。调度器负责将 G 分配到 M 上执行。
{{< /details >}}

{{< details "Go 语言的垃圾回收（GC）是如何工作的？" "底层原理,高级,内存,GC" >}}
Go 语言使用三色标记清除算法进行垃圾回收。它通过并发的方式执行，以减少对程序性能的影响。
{{< /details >}}

{{< details "Go 语言中的 rune 类型是什么？" "类型,字符串" >}}
rune 是 Go 语言中 char 类型的一种别名，用于表示一个 Unicode 码点。
{{< /details >}} 