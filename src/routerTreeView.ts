import * as path from 'path'
import * as vscode from "vscode";
import { KRouterTreeItem, KRouterTree } from "./routerTree";
import { getFileAbsolutePath } from './extensionUtil';
const ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;

export class KReactRouterTree implements vscode.TreeDataProvider<KRouterTreeItem> {

	public tree: KRouterTree;
	private _onDidChangeTreeData: vscode.EventEmitter<KRouterTreeItem | undefined> = new vscode.EventEmitter<KRouterTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<KRouterTreeItem | undefined> = this._onDidChangeTreeData.event;
	constructor(tree: KRouterTree) {
		this.tree = tree;
	}
	public getChildren(element: KRouterTreeItem) {
		if (!element) return this.tree.items;
		return element.routers || [];
	}

	public getTreeItem(element: KRouterTreeItem): vscode.TreeItem {
		return {
			label: element.id,
			iconPath: {
				light: path.join(__filename, '..', '..', 'resources', 'light', 'node.svg'),
				dark: path.join(__filename, '..', '..', 'resources', 'dark', 'node.svg'),
			},
			collapsibleState: element.routers.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
		}
	}
	public reset(tree: KRouterTree) {
		this.tree = tree;
		this._onDidChangeTreeData.fire();
	}

	public refresh() {
		this._onDidChangeTreeData.fire();
	}

}

export class RouterTreeView {
	private _treeDataProvider: KReactRouterTree

	constructor(kRouterTree: KRouterTree) {
		const treeDataProvider = new KReactRouterTree(kRouterTree)
		const view = vscode.window.createTreeView("kReactRouterTree", {
			treeDataProvider: treeDataProvider,
			showCollapseAll: true
		});
		this._treeDataProvider = treeDataProvider

		view.onDidChangeSelection(e => {
			e.selection.forEach((item: KRouterTreeItem) => {
				if (item.uiNode) {
					if (!(item.routers && item.routers.length)) {
						vscode.workspace.openTextDocument(getFileAbsolutePath(item.componentRelativePath, false)).then(doc => {
							vscode.window.showTextDocument(doc)
						})
					}
				}
			})
		})

	}

	public reset(kRouterTree: KRouterTree) {
		this._treeDataProvider.reset(kRouterTree)
	}

	public showFileParents(parents: string[]) {
		if (parents.length === 1) {
			vscode.workspace.openTextDocument(getFileAbsolutePath(parents[0], false)).then(doc => {
				vscode.window.showTextDocument(doc)
			})
			return;
		}
		let isReplace = false
		const items = this._treeDataProvider.tree.items;
		if (items[items.length - 1]) {
			if (items[items.length - 1].uiNode) {
				isReplace = true
			}
		}
		const newNode = new KRouterTreeItem({
			path: '结果: ',
			uiNode: true,
			componentRelativePath: '------',
			routers: parents.map(p => ({ path: path.relative(ROOT_PATH, p), componentRelativePath: p, uiNode: true }))
		})
		if (isReplace){
			items[items.length - 1] = newNode
		} else {
			items.push(newNode)
		}
		this._treeDataProvider.refresh();
	}

}