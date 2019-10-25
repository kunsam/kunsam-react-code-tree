import * as ts from "typescript";
import { getResgerActionsNameList, getActionsData } from "./action_register";
import { DataTransfromUtil } from "./util";

export type StoreManagerFields = {
	filePath: string
	symbol: string
	fileds: string[]
}[]

export function getStoreManagerFields(fileNames: string[], options: ts.CompilerOptions): { enterStore: StoreManagerFields, regiterState: StoreManagerFields } {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
	let checker = program.getTypeChecker();

	let result: {
		regiterState: StoreManagerFields
		enterStore: StoreManagerFields
	} = { regiterState: [], enterStore: [] }

	for (const fileName of fileNames) {
		const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
			// ts.forEachChild(sourceFile, visit);
			let registedActions = []
			let storeName = ''
			sourceFile.forEachChild((nodesOfFile) => {
				if (nodesOfFile.kind === ts.SyntaxKind.ExpressionStatement && nodesOfFile.getText().includes('registerActions')) {
					nodesOfFile.forEachChild(child => {
						child.forEachChild(cchild => {
							if (cchild.kind === ts.SyntaxKind.PropertyAccessExpression) {
								storeName = cchild.getText().replace(/\.registerActions/g, '').replace('/\s/g', '')
							}
						})
					})
					registedActions = registedActions.concat(getResgerActionsNameList(nodesOfFile))
				}
			})
			
			const actionsData = getActionsData(registedActions, sourceFile, checker)
			// console.log(actionsData, 'actionsData');
			actionsData.forEach(action => {
				if (action.regiterState) {
					result.regiterState.push({
						symbol: action.name,
						filePath: fileName,
						fileds: DataTransfromUtil.tranformTypeReferenceResultToFields(action.regiterState, storeName)
					})
				}
				if (action.reducer) {
					result.enterStore.push({
						symbol: action.name,
						filePath: fileName,
						fileds: DataTransfromUtil.tranformTypeReferenceResultToFields(action.reducer.AppReducer, storeName)
					})
				}
			})              
    }
	}

	return result
}
