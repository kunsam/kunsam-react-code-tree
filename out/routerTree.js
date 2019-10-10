"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;
const FILE_IMPORTS = require(`${ROOT_PATH}/.vscode/kReactCodeTree/workflows/file_imports.js`);
const FILE_ROUTERS_MAP = new Map();
function getRelatedFiles(path, result = []) {
    const _findFile = FILE_IMPORTS.find(p => p.path === path);
    if (_findFile) {
        _findFile.imports.forEach(file => {
            result = result.concat(getRelatedFiles(file, result));
        });
    }
    return result;
}
class KRouterTreeItem {
    constructor(node, parentId = '') {
        this.routers = [];
        this.path = node.path || '';
        this.parentId = parentId;
        this.componentRelativePath = node.componentRelativePath;
        this.id = (parentId ? parentId + '/' : '') + this.path;
        const relatedFiles = [
            node.componentRelativePath,
            ...getRelatedFiles(node.componentRelativePath)
        ];
        relatedFiles.forEach(r => {
            if (!FILE_ROUTERS_MAP.has(r)) {
                FILE_ROUTERS_MAP.set(r, [this.id]);
                return;
            }
            FILE_ROUTERS_MAP.set(r, FILE_ROUTERS_MAP.get(r).concat([this.id]));
        });
        this._addToTree(this, node.routers);
    }
    _addToTree(parent, routers = []) {
        let children;
        if (!parent) {
            children = this.routers;
        }
        else {
            if (!parent.routers) {
                parent.routers = [];
            }
            children = parent.routers;
        }
        if (!parent.routers) {
            parent.routers = [];
        }
        const parentId = parent.id;
        routers.forEach(r => {
            const node = new KRouterTreeItem(r, parentId);
            children.push(node);
            this._addToTree(node, r.routers);
        });
    }
}
exports.KRouterTreeItem = KRouterTreeItem;
// , fileTree: any, fileImports: { path: string, imports: string[] }[]
class KRouterTree {
    constructor(routers) {
        this._tree = [];
        this._treeMap = new Map();
        this._tree = routers.map(r => new KRouterTreeItem(r));
        console.log(this._tree, this._treeMap, 'KRousterTreeItem');
        FILE_ROUTERS_MAP.forEach((value, key) => {
            console.log(value, key, 'FILE_ROUTERS_MAP');
        });
    }
    queryFileAppUrl(relativePath) {
        const equalPath = relativePath.replace(/\/index.jsx?$/g, '');
        console.log(equalPath, 'equalPathequalPath');
        return FILE_ROUTERS_MAP.get(equalPath);
    }
    get tree() {
        return this._tree;
    }
}
exports.KRouterTree = KRouterTree;
//# sourceMappingURL=routerTree.js.map