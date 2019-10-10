"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
class KReactRouterTree {
    constructor(tree) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._tree = tree;
    }
    getChildren(element) {
        if (!element)
            return this._tree.tree;
        return element.routers || [];
    }
    getTreeItem(element) {
        return {
            label: element.id,
            iconPath: {
                light: path.join(__filename, '..', '..', 'resources', 'light', 'node.svg'),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', 'node.svg'),
            },
            collapsibleState: element.routers.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        };
    }
}
exports.KReactRouterTree = KReactRouterTree;
class RouterTreeView {
    constructor(kRouterTree) {
        const treeDataProvider = new KReactRouterTree(kRouterTree);
        vscode.window.createTreeView("kReactRouterTree", {
            treeDataProvider: treeDataProvider,
            showCollapseAll: true
        });
    }
}
exports.RouterTreeView = RouterTreeView;
//# sourceMappingURL=routerTreeView.js.map