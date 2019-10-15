
import * as fs from 'fs'
import * as path from "path";
import * as vscode from "vscode";

const ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;

export function getFileAbsolutePath(filePath: string, isRelative = true) {
	// 没带后缀
	const fsPath = isRelative ? path.resolve(path.join(ROOT_PATH, filePath)) : filePath;
	let trueFsPath = ''
	if (fs.existsSync(fsPath)) {
		if (fs.statSync(fsPath).isDirectory()) {
			let NoneJSIndexes = [];
			fs.readdirSync(fsPath).forEach(f => {
				if (f.includes('index')) {
					if (/\.(jsx?|tsx?)$/g.test(f)) {
						trueFsPath = path.join(fsPath, f);
					} else {
						NoneJSIndexes.push(path.join(fsPath, f))
					}
				}
			})
			if (!trueFsPath && NoneJSIndexes.length) {
				NoneJSIndexes.forEach((indexPath) => {
					if (/\.(s?css|less|sass)$/g.test(indexPath)) {
						trueFsPath = indexPath
					}
				})
			}
		} else {
			trueFsPath = fsPath;
		}
	} else {
			// 可能是由没带后缀引起的
			const dirName = path.dirname(fsPath);
			if (fs.existsSync(dirName)) {
				fs.readdirSync(dirName).forEach(f => {
					// 只判断这两种类型
					if (/\.(jsx?|tsx?)$/g.test(f)) {
						if (f.includes(path.basename(fsPath))) {
							if (!fs.statSync(path.join(dirName, f)).isDirectory()) {
								trueFsPath = path.join(dirName, f);
							}
						}
					}
				})
			}
	}
	return trueFsPath;
}

export function GotoTextDocument(trueFsPath: string) {
	if (!trueFsPath) {
		vscode.window.showInformationMessage(`未找到结果`)
	} else {
		try {
			vscode.workspace.openTextDocument(trueFsPath).then((doc) => {
				vscode.window.showTextDocument(doc)
			})
		} catch (e) {
			vscode.window.showInformationMessage(`无法打开${trueFsPath}`)
		}
	}
}