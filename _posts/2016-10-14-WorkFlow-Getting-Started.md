---
layout: post
title: 工作流入门
date: 2016-10-14 13:32:24.000000000 +08:00
---


工作流（Work_Flow）引擎，用于各种信息化系统中。由开发人员共同制定的 `BPMN 2.0` 规范定义，之后布置到工作流引擎中，驱动业务流程的进行。Activiti 支持 BPMN 2.0 规范，并且在其基础上进行扩展。




## <a name="Activiti-Start"></a>第一部分：初识 Activiti

1.1, Activiti 采用 MyBatis 持久层框架，实现数据交换。


1.2, Activiti 流程设计工具 

* 基于 Eclipse IDE 的 Eclipse Desiger。
* 基于 WEB 的 Activiti Modeler。

1.3, Activiti 原生支持 Spring ，方便管理事务 和 解析表达式（Expression）。

1.4, Activiti 架构与组件

* Activiti Engine ：核心模块，提供针对 BPMN 2.0 规范的解析、执行、创建、管理（ 任务、流程实例 ）、查询历史记录，并根据结果生成报表。
* Activiti Modeler ： WEB 版 流程设计工具。
* Activiti Designer ： 基于 Eclipse 的流程设计工具，生成 XML 格式的流程文件，可以与 WEB版 兼容。
* Activiti Explorer ： 用来管理仓库、用户、组，启动流程、任务办理等。用于开发人员入门。
* Activiti Rest ： 提供 Restful 风格的服务，允许客户端以 JSON 的方式与引擎的 Rest API 交互，可以跨平台，跨语言开发。



## <a name="Environment-Part"></a>第二部分：Activiti介绍
2.1, Activiti 下载 ： [activiti][activiti-download]

2.2, Activiti 目录结构：
>* `DataBase` : 针对 Activiti 引擎表的 create 、 drop 、 upgrade 的脚本。（支持	DB2、 H2、 HSQLDB、 MS_SQL、 MySQL、 oracle 等数据库）
>* `docs` ： 文档目录
>
>| 目录     |  内容            |
>| :------------ |:-----------------       |
>| docs/javadocs | 各 Class API 介绍。     |
>| docs/userguide | 用户手册，入门文档。       |
>| docs/xsd   | 与流程定义相关的 scheme 及 Activiti 在 BPMN 2.0 规范上的扩展元素。 |
>* `libs` : Activiti 库。使用 Maven 管理依赖。
>* `wars` ： explorer 与 rest 模块的 WEB App 包，部署到 tomcat  WEB 服务器中使用。

2.3, Activiti 引擎提供七大 Service 接口，通过 ProcessEngine 获取，支持链式 API 编程风格。

| Service API   |         | Feature |
| ----------------- |:----------------- | -------- |
| `RepositoryService` | 流程仓库 Service | 管理流程仓库，如：部署、删除、读取流程资源|
| `IdentifyService`  | 身份 Service  | 管理 和 查询用户与组之间的关系 |
| `RuntimeService`  | 运行时 Service | 处理所有正在运行状态的流程实例、任务等 |
| `TaskService`    | 任务 Service  | 用于管理、查询任务，如：签收、办理、指派等|
| `FormService`    | 表单 Service  | 用于读取和流程、任务相关的表单数据|
| `HistoryService`  | 历史 Service   | 可以查询所有历史数据，如：流程实例、任务、活动、变量、附件等|
| `ManagementService` | 引擎管理 Service | 和具体业务无关，主要查询引擎配置、数据库、作业等|



2.4, Activiti Package：

1> org.activiti.engine：包含 2.3 中七大类 Service 接口，异常类 Exception ，流程引擎 Process Engine 。

2> org.activiti.engine.delegate：

3> org.activiti.engine.delegate.event：

4> org.activiti.engine.delegate.event.impl：

5> org.activiti.engine.event：

6> org.activiti.engine.form： -> FormService

7> org.activiti.engine.history： -> HistoryService

8> org.activiti.engine.identity： -> IdentifyService

9> org.activiti.engine.logging：

10> org.activiti.engine.management： -> ManagementService

11> org.activiti.engine.parse：

12> org.activiti.engine.query：

13> org.activiti.engine.repository： -> RepositoryService

14> org.activiti.engine.runtime： -> RuntimeService

15> org.activiti.engine.task： -> TaskService

16> org.activiti.engine.test：

17> org.activiti.engine.test.mock：


