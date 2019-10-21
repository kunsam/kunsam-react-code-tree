"use strict";
import * as vscode from "vscode";
import KeybindingCommands from './commands/keybinding';
import NodeFlowCommands from './commands/nodeflow';
import RoutersCommand from './commands/router';



export function activate(context: vscode.ExtensionContext) {


  // 在文档右侧打开定义
  context.subscriptions.push(vscode.commands.registerCommand('extension.addOpenAsideToContextMenu', async () => {
    await vscode.commands.executeCommand('editor.action.revealDefinitionAside',
      {
        openToSide: true
      });
  }));

  new NodeFlowCommands(context)
  new KeybindingCommands(context)
  new RoutersCommand(context)



}
