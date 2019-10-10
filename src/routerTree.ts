
import * as vscode from "vscode";
import * as fs from 'fs';

const ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;

const FILE_IMPORTS_PATH = `${ROOT_PATH}/.vscode/kReactCodeTree/file_imports.js`;
if (!fs.existsSync(FILE_IMPORTS_PATH)) {
	vscode.window.showWarningMessage('plz add file_imports.js')
	throw new Error();
}
const FILE_IMPORTS = require(FILE_IMPORTS_PATH)

const FILE_ROUTERS_MAP: Map<string, string[]> = new Map();

export type KRouter = {
	path?: string
	routers?: KRouter[]
	IndexRoute?: boolean
	componentRelativePath: string
}

function getRelatedFiles(path: string, result: string[] = []) {
	const _findFile = FILE_IMPORTS.find(p => p.path === path);
	if (_findFile) {
		_findFile.imports.forEach(file => {
			result = result.concat(getRelatedFiles(file, result))
		})
	}
	return result
}


export class KRouterTreeItem {
	public id: string;
	public path: string;
	public parentId: string;
	public IndexRoute?: boolean;
	public routers: KRouterTreeItem[] = []
	public componentRelativePath: string;

	constructor(node: KRouter, parentId: string = '') {
		this.path = node.path || '';
		this.parentId = parentId;
		this.componentRelativePath = node.componentRelativePath;

		this.id = (parentId ? parentId + '/' : '') + this.path;

		const relatedFiles = [
			node.componentRelativePath,
			...getRelatedFiles(node.componentRelativePath)
		]
		relatedFiles.forEach(r => {
			if (!FILE_ROUTERS_MAP.has(r)) {
				FILE_ROUTERS_MAP.set(r, [ this.id ]);
				return;
			}
			FILE_ROUTERS_MAP.set(r, FILE_ROUTERS_MAP.get(r).concat([ this.id ]))
		});
		this._addToTree(this, node.routers)
	}

	private _addToTree(parent: KRouterTreeItem, routers: KRouter[] = []) {
		let children: KRouterTreeItem[];
		if (!parent) {
			children = this.routers;
		} else {
			if (!parent.routers) {
				parent.routers = [];
			}
			children = parent.routers;
		}

		if (!parent.routers) {
			parent.routers = []
		}
		const parentId = parent.id;
		routers.forEach(r => {
			const node = new KRouterTreeItem(r, parentId);
			children.push(node)
			this._addToTree(node, r.routers)
		})
	}
}

// , fileTree: any, fileImports: { path: string, imports: string[] }[]
export class KRouterTree {

	private _tree: KRouterTreeItem[] = [];
	private _treeMap: Map<string, KRouterTreeItem> = new Map();

	constructor(routers: KRouter[]) {
		this._tree = routers.map(r => new KRouterTreeItem(r))
		console.log(this._tree, this._treeMap, 'KRousterTreeItem')
		FILE_ROUTERS_MAP.forEach((value, key) => {
			console.log(value, key, 'FILE_ROUTERS_MAP')
		})
	}

	public queryFileAppUrl(relativePath: string) {
		const equalPath = relativePath.replace(/\/index.jsx?$/g, '')
		console.log(equalPath, 'equalPathequalPath')
		return FILE_ROUTERS_MAP.get(equalPath)
	}

	public get tree() {
		return this._tree;
	}

	// public getRouterItemEntryPath(id: string) {

	// }

}