import * as path from 'path'

import * as vscode from "vscode";
import { getFileAbsolutePath } from './extensionUtil';


export type PathComponentPathPair = {
	path: string
	componentRelativePath: string
}


// 文件 - 子节点表
const FILE_TREE_MAP: Map<string, string[]> = new Map();

// 文件 - 引入表
const FILE_IMPORTS_MAP: Map<string, string[]> = new Map();

// 文件 - 路由表
const FILE_ROUTERS_MAP: Map<string, string[]> = new Map();

// 路由表
const ROUTERS_MAP: Map<string, PathComponentPathPair> = new Map();


export type KRouter = {
	path?: string
	uiNode?: boolean
	routers?: KRouter[]
	IndexRoute?: boolean
	componentRelativePath: string
}



async function getRelatedFiles(id: string, absPath: string) {
	if (!id || !absPath) {
		return;
	}
	const mapImports = FILE_IMPORTS_MAP.get(absPath);
	const imports = mapImports || [];
	if (mapImports) {
		KRouterTreeItem.setRelatedFiles(id, mapImports)
		mapImports.forEach(item => {
			getRelatedFiles(id, item)
		})
	} else {
		try {
			const doc = await vscode.workspace.openTextDocument(getFileAbsolutePath(absPath, false))
			for (let i = 1; i < doc.lineCount - 1; i++) {
				const lineText = doc.lineAt(i).text;
				if (/\sfrom\s\'/.test(lineText)) {
					const texts = lineText.split(' ')
					if (texts[texts.length - 1]) {
						const item = texts[texts.length - 1].replace('\'', '').replace('\"', '');
						item && imports.push(item);
					}
				}
				if (/import\(\'/.test(lineText)) {
					const texts = lineText.split('\'')
					if (texts[1]) {
						const item = texts[1].replace('\'', '').replace('\"', '');
						item && imports.push(item);
					}
				}
				if (/function(.+)/.test(lineText) || /export(.+)/.test(lineText)) {
					break;
				}
			}
			const relativeImports = imports.filter(i => i.includes('/')).map(a => a.replace(/\'/g, '').replace(/\"/g, '')).map(item => {
				if (/^\.+/.test(item)) {
					return path.join(path.dirname(absPath), item)
				}
				if (/src\//.test(item)) {
					return getFileAbsolutePath(item)
				}
				return undefined
			}).filter(a => !!a);
			relativeImports.forEach(nextPath => {
				if (!FILE_ROUTERS_MAP.has(nextPath)) {
					getRelatedFiles(id, nextPath)
				}
			})
			FILE_IMPORTS_MAP.set(absPath, relativeImports)
			KRouterTreeItem.setRelatedFiles(id, relativeImports, absPath)
		} catch {

		}
	}
}


export class KRouterTreeItem {
	public id: string;
	public path: string;
	public parentId: string;
	public IndexRoute?: boolean;
	public routers: KRouterTreeItem[] = []
	public componentRelativePath: string;
	public uiNode?: boolean

	constructor(node: KRouter, parentId: string = '') {
		this.path = node.path || '';
		this.parentId = parentId;
		this.componentRelativePath = node.componentRelativePath;
		this.id = (parentId ? parentId + '/' : '') + this.path;
		this.uiNode = node.uiNode;
		this._addToTree(this, node.routers)
		const absPath = getFileAbsolutePath(node.componentRelativePath)
		KRouterTreeItem.setRelatedFiles(this.id, [absPath])
		getRelatedFiles(this.id, absPath)
	}

	static setRelatedFiles(id: string, relatedFiles: string[], parentPath?: string) {
		relatedFiles.forEach(r => {
			if (!FILE_ROUTERS_MAP.has(r)) {
				FILE_ROUTERS_MAP.set(r, [id]);
			} else {
				FILE_ROUTERS_MAP.set(r, FILE_ROUTERS_MAP.get(r).concat([id]))
			}
			// 写入文件树依赖
			if (parentPath) {
				if (!FILE_TREE_MAP.has(r)) {
					FILE_TREE_MAP.set(r, [parentPath]);
				} else {
					FILE_TREE_MAP.set(r, FILE_TREE_MAP.get(r).concat([parentPath]))
				}
			}
		});

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
			if (r.componentRelativePath) {
				const node = new KRouterTreeItem(r, parentId);
				children.push(node)
				this._addToTree(node, r.routers)
			}
		})
	}
}

// , fileTree: any, fileImports: { path: string, imports: string[] }[]
export class KRouterTree {

	public items: KRouterTreeItem[] = [];
	public allRouters: PathComponentPathPair[] = []

	// private _treeMap: Map<string, KRouterTreeItem> = new Map();

	// public flatternRouters: 
	constructor(routers: KRouter[]) {
		this.items = routers.map(r => r.componentRelativePath && new KRouterTreeItem(r))
		this._setFlatternRouters(routers, '')
		this.allRouters = this.getFlatternRouters()
	}

	public queryFileAppUrl(absPath: string) {
		let queryPath = absPath;
		if (!FILE_ROUTERS_MAP.has(queryPath)) {
			queryPath = queryPath.replace(/\/index\.(j|t)sx?$/g, '')
		}
		if (!FILE_ROUTERS_MAP.has(queryPath)) {
			queryPath = queryPath.replace(/(\.(j|t)sx?)$/g, '')
		}
		return FILE_ROUTERS_MAP.get(queryPath)
	}

	public getFileParents(absPath: string) {
		let queryPath = absPath;
		if (!FILE_TREE_MAP.has(queryPath)) {
			queryPath = queryPath.replace(/\/index\.(j|t)sx?$/g, '')
		}
		if (!FILE_TREE_MAP.has(queryPath)) {
			queryPath = queryPath.replace(/(\.(j|t)sx?)$/g, '')
		}
		return FILE_TREE_MAP.get(queryPath)
	}

	private _setFlatternRouters(routers?: KRouter[], parentPath?: string) {
		if (!routers) return
		routers.forEach(r => {
			if (r.path) {
				let pathname = parentPath + (r.path.includes('/') ? r.path : `/${r.path}`)
				ROUTERS_MAP.set(pathname, { path: pathname, componentRelativePath: r.componentRelativePath })
			}
			this._setFlatternRouters(r.routers, r.path)
		})
	}
	public getFlatternRouters() {
		let result = []
		ROUTERS_MAP.forEach(value => {
			result.push(value)
		})
		return result
	}
	public queryComponentRelativePathByPath(rpath: string) {
		const result = ROUTERS_MAP.get(rpath);
		return result && result.componentRelativePath
	}

}