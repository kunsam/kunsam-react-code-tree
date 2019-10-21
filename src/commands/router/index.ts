
import * as fs from 'fs'
import * as path from 'path'
import * as vscode from "vscode";
import { ROOT_PATH, PROJECT_DIR } from '../../config'
import { KRouterTree, KRouter } from './routerTree';
import { pickFiles2Open, getFileAbsolutePath, GotoTextDocument } from '../../extensionUtil';

export default class RoutersCommand {

	public kRouterTree: KRouterTree;

	constructor(context: vscode.ExtensionContext) {
		this.init(context)
	}

	loadRouters() {
		const ROUTER_FILE_ABS_PATH = path.join(ROOT_PATH, PROJECT_DIR, '/router_config.js')
		if (!fs.existsSync(ROUTER_FILE_ABS_PATH)) {
			vscode.window.showErrorMessage('未找到路由配置文件')
			return
		}
		return __non_webpack_require__(`${ROUTER_FILE_ABS_PATH}`);
	}

	init(context: vscode.ExtensionContext) {

		this.kRouterTree = new KRouterTree(this.loadRouters())

		// 右键菜单 goFileParentFile
		// context.subscriptions.push(vscode.commands.registerCommand("extension.goFileParentFile", (uri: vscode.Uri) => {
		// 	const result = this.kRouterTree.getFileParents(uri.fsPath)
		// 	if (!result.parents) {
		// 		if (result.isTopRouter) {
		// 			vscode.window.showInformationMessage('本文件是顶层Router')
		// 		} else {
		// 			vscode.window.showInformationMessage('无上层节点')
		// 		}
		// 	} else {
		// 		pickFiles2Open(result.parents.map((r: string) => ({ label: path.relative(ROOT_PATH, r), target: r })))
		// 	}
		// }))
		context.subscriptions.push(vscode.commands.registerCommand("kReactRouterTree.showFileParentsInPick", () => {
			const uri = vscode.window.activeTextEditor.document.uri;
			if (!uri) {
				vscode.window.showInformationMessage('不存在打开的文档')
				return;
			}
			const parents = this.recursiveGetParentsDepthFirt(uri.fsPath, [], new Map(), 0)
			let currentDepth = 0
			let sortResult: { path: string, depth: number }[] = []
			let result: { path: string, depth: number }[] = []
			let maxDepth = Math.max(...parents.map(p => p.depth))
			parents.forEach(p => {
				if (currentDepth > p.depth) {
					result = result.concat(sortResult.reverse())
					currentDepth = p.depth
					sortResult = []
				}
				sortResult.push({ path: p.path, depth: maxDepth - p.depth })
				currentDepth = p.depth + 1
			})
			if (sortResult.length) {
				result = result.concat(sortResult.reverse())
			}
			pickFiles2Open(result.map(r => (
				{
					label: `${new Array(r.depth).fill('    ').join('')}|-${path.relative(ROOT_PATH, r.path)}`,
					target: r.path
				})), false)
		}))

		// 右键菜单 goFileTopParentFile
		// context.subscriptions.push(vscode.commands.registerCommand("extension.goFileTopParentFile", (uri: vscode.Uri) => {
		// 	let parents = this.recursiveGetParents(uri.fsPath, [], new Map())
		// 	pickFiles2Open(parents.map((r: string) => ({ label: path.relative(ROOT_PATH, r), target: r })))
		// }))
		// 右键菜单 getFileAppUrl
		context.subscriptions.push(vscode.commands.registerCommand("extension.getFileAppUrl", (uri: vscode.Uri) => {
			const routers = this.kRouterTree.queryFileAppUrl(uri.fsPath)
			if (routers) {
				// TODO 增加一个端口配置
				vscode.env.clipboard.writeText(routers.map(r => 'https://localhost:3000' + r).join('\n'));
				vscode.window.showInformationMessage('复制成功')
			} else {
				vscode.window.showInformationMessage('暂无结果')
			}
		}))

		// 快捷键搜索
		context.subscriptions.push(vscode.commands.registerCommand('kReactRouterTree.SearchRouter', async () => {
			const result: any = await vscode.window.showQuickPick(this.kRouterTree.allRouters.map((r: KRouter) => ({ label: r.path })), {
				placeHolder: '请输入 pathname',
			});
			if (result && result.label) {
				const componentRelativePath = this.kRouterTree.queryComponentRelativePathByPath(result.label)
				if (componentRelativePath) {
					const filePath = getFileAbsolutePath(componentRelativePath)
					GotoTextDocument(filePath)
				}
			}
		}))
	}

	recursiveGetParents(path: string, result: string[], preventLoopMap: Map<string, boolean>) {
		if (preventLoopMap.has(path)) {
			return result;
		}
		preventLoopMap.set(path, true);
		const parents = (this.kRouterTree.getFileParents(path).parents || []).filter((a: string) => a !== path);
		if (parents && parents.length) {
			parents.forEach((p: string) => {
				const p_parents = this.kRouterTree.getFileParents(p).parents
				if (!(p_parents && p_parents.length)) {
					result.push(p)
				} else {
					this.recursiveGetParents(p, result, preventLoopMap)
				}
			})
		}
		return result;
	}

	recursiveGetParentsDepthFirt(path: string, result: { path: string, depth: number }[], preventLoopMap: Map<string, boolean>, depth: number): { path: string, depth: number }[] {
		if (preventLoopMap.has(path)) {
			return result;
		}
		preventLoopMap.set(path, true);
		const parents = (this.kRouterTree.getFileParents(path).parents || []).filter((a: string) => a !== path);
		if (parents && parents.length) {
			parents.forEach((p: string) => {
				result.push({ path: p, depth })
				this.recursiveGetParentsDepthFirt(p, result, preventLoopMap, depth + 1)
			})
		}
		return result;
	}

}