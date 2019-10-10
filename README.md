



> kunsam react code tree( KTree) 是一些 vscode 代码工具集

# 功能一览
- 场景业务流
	- 场景业务流视图
	- 点击节点 -> 非纯文字型节点跳转对应代码
	- 右键节点 -> 编辑节点
	- 选中编辑区域代码 -> 右键节点 -> 在节点中/后插入节点
	- 编辑区域 -> 右键菜单 -> * Get kReactCodeTree Node Code -> 获取业务流节点数据

- 路由树
	- 路由树视图
	- 点击节点 -> 跳转对应入口文件
	- 在编辑区域 -> 右键菜单 -> * Get File App Url -> 可在粘贴板中获得路由列表的字符串 -> 在浏览器中粘贴访问
- 辅助命令
	- 右键菜单 -> * Open Definition Aside -> 在右侧打开Definition
	- 编辑区域 -> 点击某个位置 -> [cmd i + cmd i] -> 复制''之间的路径到粘贴板 [前提是安装 Bracket Select 插件]
	


# 使用场景业务流
> 场景业务流就是某个场景的代码执行流程，KTree提供清晰的代码执行流程UI
- 了解场景的基本逻辑
- 定位某个代码节点在项目中的物理位置
- 在代码位置上获取节点信息用于编辑业务流


## 如果创建场景流

在项目目录 ``.vscode/kReactCodeTree/index.js`` 中输出 ``KC_Node[]``

```js
export type KC_Node = {

	// 如果全局存在多个symbol最好指定 文件 filePattern
	filePattern?: string // 文件相对路径[可以右键文件tab获得] 唯一

	// 代码标志
	symbol?: string

	textPattern?: string // symbol + textPattern 模式找到调用处的位置，textPattern 可能会存在多个，#指定第几个

	// 节点说明文字
	text: string

	// 子节点
	children?: KC_Node[]

	requirePath?: string // 如果存在，使用 requirePath 加载children

	// 下列字段正在开发中
	routers?: string[] // 对应的路由列表
	document?: string
	operationKeys?: string // 会做一个操作表  在其他地方如谷歌拓展程序里查找对应的操作流，根据操作流执行，定位到具体的UI页面/组件

}
```

