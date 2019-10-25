import * as ts from "typescript";
import TsSyntaxNodeResolveUtil from "./syntax_resolve";
import { DataTransfromUtil } from './util'

export type ConnectOutStoreFields = {
	filePath: string,
	fields: string[]
}[]

export function getConnectOutStoreFields(fileNames: string[], options: ts.CompilerOptions): ConnectOutStoreFields {

	let result: ConnectOutStoreFields = []
	let resultMap: Map<string, string[]> = new Map()
	// Build a program using the set of root file names in fileNames
	let program = ts.createProgram(fileNames, options);

	// Get the checker, we will use it to find more about classes
	// let checker = program.getTypeChecker();
	for (const fileName of fileNames) {
		const sourceFile = program.getSourceFile(fileName)
		if (sourceFile && !sourceFile.isDeclarationFile) {
			sourceFile.forEachChild((nodesOfFile) => {
				// ### this is typescript bug TMEP FIX
				nodesOfFile.parent = sourceFile

				if (ts.isImportDeclaration(nodesOfFile)) return
				// 只要找到 AppConnect VariableStatement
				// console.log('\n=============', nodesOfFile.kind, nodesOfFile.getText(), '===========\n');
				// ClassDeclaration @connect

				if (ts.isClassDeclaration(nodesOfFile)) {
					if (nodesOfFile.decorators) {
						nodesOfFile.decorators.forEach(deco => {
							deco.parent = nodesOfFile
							deco.forEachChild(c => {
								c.parent = deco
								if (ts.isCallExpression(c)) {
									const typeNode = recursiveGetATypeReferenceNode(c)
									if (typeNode) {
										const type: any = TsSyntaxNodeResolveUtil.resolveTypeReference(typeNode, sourceFile)
										if (type.AppConnect) {
											// console.log(type.AppConnect, typeNode.getText(), 'type.AppConnect');
											const fields = DataTransfromUtil.tranformTypeReferenceResultToFields(type.AppConnect, type.storeName)
											resultMap.set(fileName, (resultMap.get(fileName) || []).concat(fields))
										}
									}
								}
							})
						})
					}
				}

				if (ts.isVariableStatement(nodesOfFile)) {
					nodesOfFile.forEachChild(node => {
						node.parent = nodesOfFile
						if (ts.isVariableDeclarationList(node)) {
							node.forEachChild(child => {
								child.parent = node
								const typeNode = recursiveGetATypeReferenceNode(child)
								if (typeNode) {
									const type: any = TsSyntaxNodeResolveUtil.resolveTypeReference(typeNode, sourceFile)
									if (type.AppConnect) {
										// console.log(type.AppConnect, typeNode.getText(), 'type.AppConnect 222');
										const fields = DataTransfromUtil.tranformTypeReferenceResultToFields(type.AppConnect, type.storeName)
										resultMap.set(fileName, (resultMap.get(fileName) || []).concat(fields))
									}
								}
							})
						}
					})
				}
			})

		}
	}

	resultMap.forEach((value, key) => {
		result.push({
			filePath: key,
			fields: value
		})
	})
	return result

	function recursiveGetATypeReferenceNode (node: ts.Node): ts.TypeReferenceNode | undefined {
		if (ts.isTypeReferenceNode(node)) {
			return node;
		} else {
			let result: ts.TypeReferenceNode | undefined
			node.forEachChild(child => {
				if (result) return;
				child.parent = node
				result = recursiveGetATypeReferenceNode(child)
			})
			return result
		}
	}
}