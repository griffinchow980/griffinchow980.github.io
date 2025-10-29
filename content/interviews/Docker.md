---
title: "Docker"
date: 2023-08-10
---

{{< details "Docker 是什么？" >}}
Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。
{{< /details >}}

{{< details "Docker 的核心概念有哪些？" >}}
镜像（Image）、容器（Container）、仓库（Repository）。
{{< /details >}}

{{< details "Docker 镜像和容器有什么区别？" >}}
镜像是静态的，它是一个只读的模板。容器是动态的，它是镜像的运行实例。
{{< /details >}}

{{< details "Dockerfile 是什么？" >}}
Dockerfile 是一个用来构建镜像的文本文件，它包含了一条条的指令，每一条指令构建一层。
{{< /details >}}

{{< details "Docker 的数据卷（Volume）有什么用？" >}}
数据卷用于持久化容器中的数据。它可以将宿主机的目录挂载到容器中，从而实现数据的持久化。
{{< /details >}}

{{< details "Docker Compose 是什么？" >}}
Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。它使用 YAML 文件来配置应用程序的服务。
{{< /details >}}

{{< details "Docker Swarm 是什么？" >}}
Docker Swarm 是 Docker 官方提供的容器编排工具。它可以将多个 Docker 主机组合成一个集群，并以集群的方式来管理容器。
{{< /details >}}

{{< details "Docker 的网络模式有哪些？" >}}
bridge, host, none, container.
{{< /details >}}

{{< details "如何清理 Docker 中的无用镜像和容器？" >}}
- `docker image prune`：清理无用的镜像。
- `docker container prune`：清理无用的容器。
- `docker system prune`：清理所有无用的镜像、容器、网络和数据卷。
{{< /details >}}

{{< details "Kubernetes 和 Docker Swarm 有什么区别？" >}}
- Kubernetes 是一个更强大、更复杂的容器编排工具，它提供了更丰富的功能，例如自动扩缩容、服务发现、负载均衡等。
- Docker Swarm 更简单、更容易上手，但功能相对较少。
{{< /details >}} 