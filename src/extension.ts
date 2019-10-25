"use strict";
import * as vscode from "vscode";
import KeybindingCommands from './commands/keybinding';
import NodeFlowCommands from './commands/nodeflow';
import RoutersCommand from './commands/router';
import { generateDocumentation } from "./compiler";
import * as ts from "typescript";
import { getStoreManagerFields } from './interpreter/action'
import { getConnectOutStoreFields } from "./interpreter/connect";
import LeStoreManager from "./commands/lestore/lestoremanager";

export function activate(context: vscode.ExtensionContext) {


  // 在文档右侧打开定义
  context.subscriptions.push(vscode.commands.registerCommand('extension.addOpenAsideToContextMenu', async () => {
    await vscode.commands.executeCommand('editor.action.revealDefinitionAside',
      {
        openToSide: true
      });
  }));

  // new NodeFlowCommands(context)
  // new KeybindingCommands(context)
  // new RoutersCommand(context)

  // vscode.workspace.openTextDocument('/Users/kunsam/Downloads/le-project/wechat-web/src/app/reducers/next/current_customer_reducer.ts').then(doc => {
  //   // vscode.window.showTextDocument(doc).then(editor => {
  //     // editor.edit()
  //   // })
  //   const text = doc.getText()
  //   const newText = text.match(/(case \'(.+)\'\:(([\s\S])(?!(case)))+)/g)
  //   newText.forEach(next => {
  //     const nexts = next.match(/(case \'(.+)\'\:(([\s\S])(?!(case)))+)/g)
  //   })
  //   console.log(newText, 'newTextnewText');
  // })

  const leStoreManager = new LeStoreManager()
  context.subscriptions.push(vscode.commands.registerCommand('kReactCodeTree.queryStoreManagedFields', () => {
      leStoreManager.queryManageFileds()
  }))

  context.subscriptions.push(vscode.commands.registerCommand('kReactCodeTree.queryStoreConnectOutFields', () => {
    leStoreManager.queryOutStoreFileds()
  }))

  context.subscriptions.push(vscode.commands.registerCommand('kReactCodeTree.queryStoreAllFields', () => {
    leStoreManager.queryAllFields()
  }))
}
