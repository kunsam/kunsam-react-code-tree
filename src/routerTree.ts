
import * as vscode from "vscode";
import { getFileAbsolutePath } from './extensionUtil';


const FILE_ROUTERS_MAP: Map<string, string[]> = new Map();

export type KRouter = {
	path?: string
	routers?: KRouter[]
	IndexRoute?: boolean
	componentRelativePath: string
}

const FILE_IMPORTS_MAP: Map<string, string[]> = new Map();

function getRelatedFiles(id: string, path: string) {
	const mapImports = FILE_IMPORTS_MAP.get(path);
	const imports = mapImports || [];

	if (mapImports) {
		KRouterTreeItem.setRelatedFiles(id, mapImports)
		mapImports.forEach(item => {
			getRelatedFiles(id, item)
		})
	} else {
		const truePath = getFileAbsolutePath(path)
		if (truePath) {
			vscode.workspace.openTextDocument(truePath).then(doc => {
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
				FILE_IMPORTS_MAP.set(path, imports)
				const relativeImports = imports.filter(i => i.includes('/'));
				KRouterTreeItem.setRelatedFiles(id, relativeImports)
				relativeImports.forEach(item => {
					getRelatedFiles(id, item)
				})
			})
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

	constructor(node: KRouter, parentId: string = '') {
		this.path = node.path || '';
		this.parentId = parentId;
		this.componentRelativePath = node.componentRelativePath;
		this.id = (parentId ? parentId + '/' : '') + this.path;
		this._addToTree(this, node.routers)
		KRouterTreeItem.setRelatedFiles(this.id, [ node.componentRelativePath ])
		getRelatedFiles(this.id, node.componentRelativePath)
	}

	static setRelatedFiles(id: string, relatedFiles: string[]) {
		relatedFiles.forEach(r => {
			if (!FILE_ROUTERS_MAP.has(r)) {
				FILE_ROUTERS_MAP.set(r, [id]);
				return;
			}
			FILE_ROUTERS_MAP.set(r, FILE_ROUTERS_MAP.get(r).concat([id]))
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

	private _tree: KRouterTreeItem[] = [];
	// private _treeMap: Map<string, KRouterTreeItem> = new Map();

	constructor(routers: KRouter[]) {
		this._tree = routers.map(r => r.componentRelativePath && new KRouterTreeItem(r))
	}

	public queryFileAppUrl(relativePath: string) {
		const equalPath = relativePath.replace(/\/index.jsx?$/g, '')
		return FILE_ROUTERS_MAP.get(equalPath)
	}

	public get tree() {
		return this._tree;
	}

}