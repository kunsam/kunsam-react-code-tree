
import * as fs from 'fs'
import * as path from 'path'
import * as vscode from "vscode";
import { ROOT_PATH, PROJECT_DIR } from '../../config'
import { KRouterTree, KRouter } from './routerTree';
import { pickFiles2Open, getFileAbsolutePath, GotoTextDocument } from '../../extensionUtil';
import { groupBy } from 'lodash'
import { ShowFileParentsInPickDataNode } from './type';



export default class RoutersCommand {

	public kRouterTree: KRouterTree;
	private _queryFilesResultCacheMap: Map<string, { result: ShowFileParentsInPickDataNode[], lastQueryTime: number }> = new Map();

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

			const getResults = () => {
				const currentTime = new Date().getTime()
				const cacheResult = this._queryFilesResultCacheMap.get(uri.fsPath)
				if (cacheResult) {
					const deltaMinute = (currentTime - cacheResult.lastQueryTime) / (1000 * 60)
					if (deltaMinute < 30) {
						this._queryFilesResultCacheMap.delete(uri.fsPath)
					} else {
						if (cacheResult.result.length) {
							return cacheResult.result
						}
					}
				}
				const result = this.getFilesParentsResultShowInPick(uri)
				// console.log(uri, parents, result,groupByParents, 'parentsparentsparents')
				this._queryFilesResultCacheMap.set(uri.fsPath, { result, lastQueryTime: new Date().getTime() })
				return result
			}
			const result  = getResults()
			pickFiles2Open(result.map(r => r.labelOnly ? ({ label: r.label, target: r.path }) : (
				{
					target: r.path,
					label: `${new Array(r.depth).fill('    ').join('')}➡️${path.relative(ROOT_PATH, r.path)}`,
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

	getFilesParentsResultShowInPick(uri: vscode.Uri) {
		const parents = this.recursiveGetParentsDepthFirt(uri.fsPath, [], new Map(), 0)
		let currentDepth = 0
		const groupByParents = groupBy(parents, p => p.depth);
		let result: ShowFileParentsInPickDataNode[] = []
		let currentResult: ShowFileParentsInPickDataNode[] = []
		const writeCurrentResult = () => {
			if (!currentResult.length) {
				return
			}
			let text: string = ''
			const lastResult = currentResult[currentResult.length - 1]
			const splitedPaths = lastResult.path.split('/')
			if (splitedPaths.length >= 2) {
				text = splitedPaths[splitedPaths.length - 2] + '/' + splitedPaths[splitedPaths.length - 1]
			}
			result.push({ labelOnly: true, path: lastResult.path, label: `----------${text}`, depth: 0 })
			result = result.concat(currentResult)
		}
		parents.forEach(p => {
			if (currentDepth > p.depth) {
				writeCurrentResult()
				currentDepth = p.depth
				currentResult = []
				if (currentDepth > 0) {
					for (let i = 0;i <= currentDepth - 1;i++) {
						groupByParents[i].forEach(d => {
							currentResult.push({ path: d.path, depth: d.depth })
						})
					}
				}
			}
			currentResult.push({ path: p.path, depth: p.depth })
			currentDepth = p.depth + 1
		})
		if (currentResult.length) {
			writeCurrentResult()
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