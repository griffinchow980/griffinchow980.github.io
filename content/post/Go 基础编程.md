---
title: "Go 基础"
categories: ["编程语言"]
tags: ["go"]
date: 2020-07-14
summary: "Go 语言是一种静态类型、编译型的编程语言。Go 最大的特点是内置并发机制，通过 goroutine 和 channel 实现高效并发编程。Go 拥有丰富的标准库，包管理简单，常用命令包括编译（go build）、运行（go run）、测试（go test）和格式化（go fmt）。适合开发高性能后端服务和云原生应用。"
---

# Go 基础

Go（又称 Golang）是一种由 Google 开发的开源编程语言，具有简洁、高效、并发友好等特点。Go 适用于后端开发、云原生、微服务等场景。

## 1. Go 语言简介

Go 语言设计目标是让开发者能够高效地构建可靠且可维护的软件。其语法简洁，编译速度快，内置垃圾回收和强大的并发支持。

- 官网：[go.dev/doc](https://go.dev/doc/)
- 中文文档：[Go 语言圣经](https://docs.kilvn.com/gopl-zh/)
- Go 入门教程：[Go 入门指南](https://docs.kilvn.com/the-way-to-go_ZH_CN/)
- Go 标准库参考：[Go 标准库](https://docs.kilvn.com/go-library/)

## 2. 基本语法示例

下面是一个简单的 Go 程序：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

## 3. 主要特性

- **静态类型**：编译时类型检查，减少运行时错误。
- **并发支持**：通过 goroutine 和 channel 实现高效并发。
- **丰富标准库**：内置大量实用包，涵盖网络、加密、文本处理等。
- **跨平台**：支持主流操作系统和架构。

## 4. 基本数据类型

- 整型：`int`, `int8`, `int16`, `int32`, `int64`
- 浮点型：`float32`, `float64`
- 布尔型：`bool`
- 字符串：`string`
- 数组与切片：`[n]T`, `[]T`
- 映射：`map[K]V`
- 结构体：`struct`
- 接口：`interface`

## 5. 并发编程

Go 的并发通过 goroutine 和 channel 实现：

```go
go func() {
    fmt.Println("并发执行")
}()
```

## 6. 包管理

Go 使用 `go mod` 进行包管理：

```shell
go mod init 项目名
go get 包名
```

## 7. 常用命令

- 编译：`go build`
- 运行：`go run 文件.go`
- 测试：`go test`
- 格式化：`go fmt`

## 8. 参考资料

- [Go 官方文档](https://go.dev/doc/)
- [Go 语言圣经（中文版）](https://docs.kilvn.com/gopl-zh/)
- [Go 入门指南](https://docs.kilvn.com/the-way-to-go_ZH_CN/)
- [Go 标准库](https://docs.kilvn.com/go-library/)

---

欢迎访问以上链接，深入学习 Go 语言！