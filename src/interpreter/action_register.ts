import * as ts from "typescript";
import TsSyntaxNodeResolveUtil from "./syntax_resolve";

/**
 * CustomerStore.registerActions([
  new CustomerFetchMeAction(),
  new CustomerFetchMeSuccessAction(),
  new CustomerFetchMeSuccessAction2(),
])
 *
 * @export
 * @param {ts.Node} node
 */
export function getResgerActionsNameList(node: ts.Node): string[] {
  let list = [];
  if (node.kind === 222) {
    // ExpressionStatement
    ts.forEachChild(node, child => {
      const cchildren = child.getChildren();
      // console.log(cchildren.map(c => c.kind), cchildren.map(c => c.getText() + '\n'), 'cchildrencchildren');
      if (cchildren.length >= 2) {
        const functionDispatcher = cchildren[0].getText();
        if (functionDispatcher.includes("registerActions")) {
          if (cchildren[0].kind === 190 && cchildren[2].kind === 314) {
            cchildren[2].getChildren().forEach(ccchild => {
              ccchild.getChildren().forEach(cccchild => {
                if (cccchild.kind === 314) {
                  cccchild.getChildren().forEach(ccccchild => {
                    if (ccccchild.kind === 193) {
                      const ddd = <ts.NewExpression>ccccchild;
                      list.push(ddd.getChildAt(1).getFullText());
                    }
                  });
                }
              });
            });
          }
        }
      }
    });
  }
  return list;
}

export function getActionsData(
  nameList: string[],
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker
) {
  let output: any[] = [];
  sourceFile.forEachChild(nodesOfFile => {
    if (ts.isClassDeclaration(nodesOfFile) && nodesOfFile.name) {
      const actionName = nodesOfFile.name.getText();
      const findActionClass = nameList.find(
        name => name.replace(/\"|\s|\'/g, "") === actionName
      );
      // console.log(findActionClass,nameList, actionName, 'nameList\n');
      if (findActionClass) {
        const result = this.getActionsDataFromNode(nodesOfFile, checker);
        output.push({
          name: actionName,
          ...result
        });
      }
    }
  });
  return output;
}

export function getActionsDataFromNode(
  node: ts.ClassDeclaration,
  // checker: ts.TypeChecker
): { id?: string, regiterState?: any, reducerReturn?: any } {
  let output: any = {};

  if (node.name) {
    // console.log(node.name.getText(), "\n\n---node.name.getText()-----");
    node.members.forEach(member => {
      if (member.kind === ts.SyntaxKind.PropertyDeclaration) {
        // id 155 PropertyDeclaration { 73 Identifier 10 StringLiteral }
        // state 155 PropertyDeclaration { 73 Identifier 189 ObjectLiteralExpression }
        // dispatch 155 PropertyDeclaration { 73 Identifier 198 ArrowFunction }
        // reducer 155 PropertyDeclaration { 73 Identifier 165 TypeReference 197 FunctionExpression }
        const mchildren = member.getChildren();
        mchildren.forEach((mchild, index) => {
          const next1 = mchildren[index + 1];
          const next2 = mchildren[index + 2];
          if (mchild && next1 && next2) {

            const isIdentifier = (node: ts.Node, name: string) => ts.isIdentifier(node) && node.escapedText === name;
            const isNext1Equal = next1.kind === ts.SyntaxKind.FirstAssignment
            const isNext2StringLiteral = next2.kind === ts.SyntaxKind.StringLiteral
            const isNext2ObjectLiteralExpression = next2.kind === ts.SyntaxKind.ObjectLiteralExpression

            // console.log(
            //   'kind text index \n',
            //   mchild.kind,
            //   mchild.getText(),
            //   index,
            //   isNext1Equal,
            //   isNext2StringLiteral,
            //   isNext2ObjectLiteralExpression,
            //   "\n"
            // );

            if (isIdentifier(mchild, 'id')) {
              if (isNext1Equal && isNext2StringLiteral) {
                output.id = (next2 as ts.Identifier).escapedText
              }
            }

            if (isIdentifier(mchild, 'regiterState')) {
              if (isNext1Equal && isNext2ObjectLiteralExpression) {
                const n = <ts.ObjectLiteralExpression>next2;
                const data = TsSyntaxNodeResolveUtil.resolveObjectLiteralExpressionToObject(n)
                output.regiterState = data
              }
            }

            if (isIdentifier(mchild, 'reducer')) {
              const next3 = mchildren[index + 3];
              const next4 = mchildren[index + 4];
              const isNext1ColonToken = next1.kind === ts.SyntaxKind.ColonToken
              const isNext2TypeReference = next2.kind === ts.SyntaxKind.TypeReference
              const isNext3FirstAssignment = next3.kind === ts.SyntaxKind.FirstAssignment
              const isNext4Function = next4.kind === ts.SyntaxKind.ArrowFunction || next4.kind === ts.SyntaxKind.FunctionExpression
              if (isNext1ColonToken && isNext2TypeReference && isNext3FirstAssignment && isNext4Function) {
                output.reducer = TsSyntaxNodeResolveUtil.resolveTypeReference(next2 as ts.TypeReferenceNode)
              }
            }
          }
        });
      }
    });
    // console.log(output, "outputoutput\n\n");
    return output;
  }
}


