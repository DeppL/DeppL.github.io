---
layout: post
title: 工作流 API 介绍，及示例
date: 2016-10-22 13:32:24.000000000 +08:00
---




>group: management, sales, marketing, engineering, user, admin.
>
>user: kermit, gonzo, fozzie.

| | management | sales | marketing | engineering | user | admin |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| kermit | √ | √ | √ | √ | √ | √ |
| gonzo | √ | √ | √ |  | √ |  |
| fozzie |  |  | √ | √ | √ |  |





{% highlight java %}

目录：
│ 
├── 创建 ProcessEngine。
│     ├─ Java 代码创建
│     ├─ XML 创建
│
│
├── IdentityService 
│     ├─ user 添加用户
│     ├─ group 添加组
│     ├─ membership 添加 用户与组 的关系
│
│
├── Deploy 部署
│     ├─ bpmn 流程文件 (diagrams/VacationRequest.bpmn)
│     ├─ 流程部署
│
│
├── 流程代码演示
│     ├─ 由部署文件生成流程实例
│     ├─ 经理驳回
│     ├─ 经理同意
│ 
│

{% endhighlight %}


##一、创建 ProcessEngine。
###1.1， Java 代码创建

{% highlight java %}
ProcessEngineConfiguration processEngineConfiguration = ProcessEngineConfiguration.createStandaloneProcessEngineConfiguration();
processEngineConfiguration.setJdbcDriver("com.mysql.jdbc.Driver")
						.setJdbcUrl("jdbc:mysql://localhost:3306/activiti_sql")
						.setJdbcUsername("root")
						.setJdbcPassword("root")
						.setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
ProcessEngine processEngine = processEngineConfiguration.buildProcessEngine();
{% endhighlight %}


###1.2， XML 创建
创建 activiti.cfg.xml

{% highlight XML %}
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-2.5.xsd
http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.0.xsd">

	<bean id="processEngineConfiguration" class="org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration">
		<property name="jdbcDriver" value="com.mysql.jdbc.Driver"></property>
		<property name="jdbcUrl" value="jdbc:mysql://localhost:3306/activiti_sql"></property>
		<property name="jdbcUsername" value="root"></property>
		<property name="jdbcPassword" value="root"></property>
		<property name="databaseSchemaUpdate" value="true"></property>
	</bean>
</beans>
{% endhighlight %}

java中代码
{% highlight java %}
ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
{% endhighlight %}



##二、IdentityService
###2.1， user 添加用户

{% highlight java %}
IdentityService identityService = processEngine.getIdentityService();
User kermit = identityService.newUser("kermit");
kermit.setFirstName("Kermit");
kermit.setLastName("The Frog");
kermit.setEmail("kermit@activiti.org");
kermit.setPassword("kermit");
identityService.saveUser(kermit);
{% endhighlight %}

###2.2， group 添加组
{% highlight java %}
Group group1 = identityService.newGroup("management");
group1.setName("Management");
group1.setType("assignment");
identityService.saveGroup(group1);
{% endhighlight %}

###2.3， membership 添加 用户与组 的关系
{% highlight java %}
identityService.createMembership("kermit", "management");
{% endhighlight %}


##三、Deploy 部署
###3.1， bpmn 流程文件 (diagrams/VacationRequest.bpmn)
{% highlight xml %}
  <process id="vacationRequest" name="Vacation Request" isExecutable="true">
    <startEvent id="request" activiti:initiator="employeeName">
      <extensionElements>
        <activiti:formProperty id="numberOfDays" name="Number of days" type="long" required="true"></activiti:formProperty>
        <activiti:formProperty id="startDate" name="First day of holiday (dd-MM-yyy)" type="date" datePattern="dd-MM-yyyy hh:mm" required="true"></activiti:formProperty>
        <activiti:formProperty id="vacationMotivation" name="Motivation" type="string"></activiti:formProperty>
      </extensionElements>
    </startEvent>
    <sequenceFlow id="flow1" sourceRef="request" targetRef="handleRequest"></sequenceFlow>
    <userTask id="handleRequest" name="Handle vacation request" activiti:candidateGroups="management">
      <documentation>${employeeName} would like to take ${numberOfDays} day(s) of vacation (Motivation: ${vacationMotivation}).</documentation>
      <extensionElements>
        <activiti:formProperty id="vacationApproved" name="Do you approve this vacation" type="enum" required="true">
          <activiti:value id="true" name="Approve"></activiti:value>
          <activiti:value id="false" name="Reject"></activiti:value>
        </activiti:formProperty>
        <activiti:formProperty id="managerMotivation" name="Motivation" type="string"></activiti:formProperty>
      </extensionElements>
    </userTask>
    <sequenceFlow id="flow2" sourceRef="handleRequest" targetRef="requestApprovedDecision"></sequenceFlow>
    <exclusiveGateway id="requestApprovedDecision" name="Request approved?"></exclusiveGateway>
    <sequenceFlow id="flow3" sourceRef="requestApprovedDecision" targetRef="sendApprovalMail">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${vacationApproved == 'true'}]]></conditionExpression>
    </sequenceFlow>
    <userTask id="sendApprovalMail" name="Send confirmation e-mail"></userTask>
    <sequenceFlow id="flow4" sourceRef="sendApprovalMail" targetRef="theEnd1"></sequenceFlow>
    <endEvent id="theEnd1"></endEvent>
    <sequenceFlow id="flow5" sourceRef="requestApprovedDecision" targetRef="adjustVacationRequestTask">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${vacationApproved == 'false'}]]></conditionExpression>
    </sequenceFlow>
    <userTask id="adjustVacationRequestTask" name="Adjust vacation request" activiti:assignee="${employeeName}">
      <documentation>Your manager has disapproved your vacation request for ${numberOfDays} days.
        Reason: ${managerMotivation}</documentation>
      <extensionElements>
        <activiti:formProperty id="numberOfDays" name="Number of days" type="long" required="true"></activiti:formProperty>
        <activiti:formProperty id="startDate" name="First day of holiday (dd-MM-yyy)" type="date" datePattern="dd-MM-yyyy hh:mm" required="true"></activiti:formProperty>
        <activiti:formProperty id="vacationMotivation" name="Motivation" type="string"></activiti:formProperty>
        <activiti:formProperty id="resendRequest" name="Resend vacation request to manager?" type="enum" required="true">
          <activiti:value id="true" name="Yes"></activiti:value>
          <activiti:value id="false" name="No"></activiti:value>
        </activiti:formProperty>
      </extensionElements>
    </userTask>
    <sequenceFlow id="flow6" sourceRef="adjustVacationRequestTask" targetRef="resendRequestDecision"></sequenceFlow>
    <exclusiveGateway id="resendRequestDecision" name="Resend Request Decision"></exclusiveGateway>
    <sequenceFlow id="flow8" sourceRef="resendRequestDecision" targetRef="handleRequest">
      <conditionExpression xsi:type="tFormalExpression"><![CDATA[${resendRequest == 'true'}]]></conditionExpression>
    </sequenceFlow>
    <endEvent id="theEnd2"></endEvent>
    <sequenceFlow id="flow9" sourceRef="resendRequestDecision" targetRef="theEnd2">
    	<conditionExpression xsi:type="tFormalExpression"><![CDATA[${resendRequest == 'false'}]]></conditionExpression>
    </sequenceFlow>
  </process>{% endhighlight %}


###3.2， 流程部署
{% highlight java %}
RepositoryService repositoryService = processEngine.getRepositoryService();
DeploymentBuilder deploymentBuilder = repositoryService.createDeployment();

deploymentBuilder.addClasspathResource("diagrams/VacationRequest.bpmn")
						 .addClasspathResource("diagrams/VacationRequest.png")
						 .name("请假测试")
						 .category("请假");
deploymentBuilder.deploy();
{% endhighlight %}


##四、流程代码演示
###4.1， 由部署文件生成流程实例

{% highlight java %}
identityService.setAuthenticatedUserId("fozzie"); // 配合 activiti:initiator 使用
ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
					.processDefinitionKey("vacationRequest")
					.orderByProcessDefinitionId()
					.desc().list().get(0);
Map<String, Object> variables = new HashMap<String, Object>();
variables.put("numberOfDays", "3");
variables.put("vacationMotivation", "请假原因。");
variables.put("startDate", new Date());
runtimeService.startProcessInstanceById(processDefinition.getId(),variables);

{% endhighlight %}


###4.2， 经理驳回
{% highlight java %}
// 经理获得 任务
User manager = identityService.createUserQuery()
							.memberOfGroup("management")
							.orderByUserId().desc().list().get(0);
Task task = taskService.createTaskQuery()
							.taskCandidateGroup("management")
							.orderByTaskId().desc().list().get(0);
taskService.claim(task.getId(), manager.getId());

// 经理执行 reject   "vacationApproved"
Map<String, Object> variables = new HashMap<String, Object>();
variables.put("vacationApproved", "false");
taskService.complete(task.getId(), variables);

// 员工修改内容
Task reSentTask = taskService.createTaskQuery()
						.taskInvolvedUser("fozzie")
						.orderByTaskId().desc().list().get(0);
Map<String, Object> adjustVar = new HashMap<String, Object>();
adjustVar.put("numberOfDays", 3);
adjustVar.put("vacationMotivation", "2");
adjustVar.put("resendRequest", "true");
taskService.complete(reSentTask.getId(), adjustVar);


{% endhighlight %}

###4.3，  经理同意
{% highlight java %}

// 经理获得 任务
User manager = identityService.createUserQuery()
							.memberOfGroup("management")
							.orderByUserId().desc().list().get(0);
Task task = taskService.createTaskQuery()
							.taskCandidateGroup("management")
							.orderByTaskId().desc().list().get(0);
taskService.claim(task.getId(), manager.getId());

// 经理执行 approve   "vacationApproved"
Map<String, Object> variables = new HashMap<String, Object>();
variables.put("vacationApproved", "true");
taskService.complete(task.getId(), variables);

// 员工发送邮件
Task mailTask = taskService.createTaskQuery()
							.taskInvolvedUser("fozzie")
							.orderByTaskId().desc().list().get(0);
taskService.complete(mailTask.getId());
{% endhighlight %}




