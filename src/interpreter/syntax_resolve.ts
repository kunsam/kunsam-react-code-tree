import * as ts from "typescript";

export default class TsSyntaxNodeResolveUtil {

	public static getNodeValue(node: ts.Node) {
		if (node.kind === ts.SyntaxKind.NumericLiteral || node.kind === ts.SyntaxKind.StringLiteral) {
			return node.getText()
		}
		if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
			return this.resolveObjectLiteralExpressionToObject(node as ts.ObjectLiteralExpression)
		}
		if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {
			return this.resolveArrayLiteralExpressionToObject(node as ts.ArrayLiteralExpression)
		}
	}

	public static resolveTypeReference(node: ts.TypeReferenceNode, sourceFile?: ts.SourceFile) {
		let output: any = {}
		let storeName = ''
		node.typeArguments.forEach(tnode => {
			tnode.parent = node
			output = {
				...output,
				...this.resolveTypeNode(tnode, sourceFile)
			}
		})
		if (node.typeArguments[0] && ts.isLiteralTypeNode(node.typeArguments[0])) {
			storeName = node.typeArguments[0].getText().replace(/\'|\"/g, '')
		}
		return {
			storeName,
			[node.typeName.getText(sourceFile)]: output
		}
	}

	public static resolveTypeNode(node: ts.TypeNode, sourceFile?: ts.SourceFile) {
		let outPut = {}
		node.forEachChild(child => {
			child.parent = node
			if (ts.isPropertySignature(child)) {
				if (ts.isIdentifier(child.getChildAt(0)) && child.getChildAt(1).kind === ts.SyntaxKind.ColonToken) {
					const childChild2 = child.getChildAt(2);
					childChild2.parent = child
					// any[] | { a: number }[] | {a: string, b: any[]}
					if (ts.isTypeLiteralNode(childChild2) || ts.isArrayTypeNode(childChild2)) {
						const nodeChildren = []
						childChild2.forEachChild(nextChild => {
							nextChild.parent = childChild2
							nodeChildren.push(nextChild)
						})
						if (ts.isPropertySignature(nodeChildren[0])) {
							outPut[child.name.getText(sourceFile)] = this.resolveTypeNode(childChild2, sourceFile)
						} else {
							outPut[child.name.getText(sourceFile)] = childChild2.getText(sourceFile)
						}
					} else {
						outPut[child.name.getText(sourceFile)] = childChild2.getText(sourceFile)
					}
				}
			}
		})
		return outPut
	}

	public static resolveObjectLiteralExpressionToObject(node: ts.ObjectLiteralExpression, result: any = {}) {
		const properties: ts.PropertyAssignment[] = node.properties.filter(p => p.kind === ts.SyntaxKind.PropertyAssignment) as ts.PropertyAssignment[]
		properties.forEach(p => {
			result[p.name.getText()] = this.getNodeValue(p.initializer)
		})
		return result
	}

	public static resolveArrayLiteralExpressionToObject(node: ts.ArrayLiteralExpression, result: any[] = []) {
		node.forEachChild(child => {
			result.push(this.getNodeValue(child))
		})
		return result
	}
}

