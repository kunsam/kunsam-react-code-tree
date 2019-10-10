import * as path from 'path'
import * as vscode from "vscode";
import { KRouterTreeItem, KRouterTree } from "./routerTree";


export class KReactRouterTree implements vscode.TreeDataProvider<KRouterTreeItem> {

	private _tree: KRouterTree;
	private _onDidChangeTreeData: vscode.EventEmitter<KRouterTreeItem | undefined> = new vscode.EventEmitter<KRouterTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<KRouterTreeItem | undefined> = this._onDidChangeTreeData.event;
	constructor(tree: KRouterTree) {
		this._tree = tree;
	}
	public getChildren(element: KRouterTreeItem) {
		if (!element) return this._tree.tree;
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
}

export class RouterTreeView {

	constructor(kRouterTree: KRouterTree) {
		const treeDataProvider = new KReactRouterTree(kRouterTree)
		vscode.window.createTreeView("kReactRouterTree", {
			treeDataProvider: treeDataProvider,
			showCollapseAll: true
		});
	}

}