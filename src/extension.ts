"use strict";
import * as vscode from "vscode";
import { selectText } from "./select";
import RoutersCommand from './commands/router';
import NodeFlowCommands from './commands/nodeflow';
import KeybindingCommands from './commands/keybinding';
import LeStoreManager from "./commands/lestore/lestoremanager";

import { toLower, upperFirst } from 'lodash'
 
export function activate(context: vscode.ExtensionContext) {


  // 在文档右侧打开定义
  context.subscriptions.push(vscode.commands.registerCommand('extension.addOpenAsideToContextMenu', async () => {
    await vscode.commands.executeCommand('editor.action.revealDefinitionAside',
      {
        openToSide: true
      });
  }));

  // 菜单右键 获取ActionReducerClass
  vscode.commands.registerCommand("kReactCodeTree.store.getReducerActionClass", () => {
    const text = selectText(false)
    if (text) {
      const splited = text.replace(/\_/g, ':').split(':').map(t => upperFirst(toLower(t))).concat(['Action'])
      splited.shift()
      const className = splited.join('')
      vscode.env.clipboard.writeText(`export class ${className} extends AppAction {
        static id = '${text}'
        reducer: AppReducer<{ field: any }> = function (state, action) {
          return {

          }
        }
      }
      StoreName.registerAction(${className})
      `)
    }
  })
  // 菜单右键 获取DispatchActionClass
  vscode.commands.registerCommand("kReactCodeTree.store.getDispatchActionClass", () => {
    const text = selectText(false)
    if (text) {
      const splited = text.replace(/\_/g, ':').split(':').map(t => upperFirst(toLower(t))).concat(['Action'])
      splited.shift()
      const className = splited.join('')
      vscode.env.clipboard.writeText(`export class ${className} extends AppAction {
        static id = '${text}'
        regiterState = {}
        dispatch = (success = () => {}, error = () => {}) => ({
          type: this.id,
          API: true,
          method: 'POST',
          url: '/api/query',
          success,
          error,
          data: {
            query: '___'
          }
        })
      }
      StoreName.registerAction(className)
      `)
    }
  })

  new NodeFlowCommands(context)
  new KeybindingCommands(context)
  new RoutersCommand(context)

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

  let leStoreManager: LeStoreManager | undefined
  context.subscriptions.push(vscode.commands.registerCommand('kReactCodeTree.activeStoreManager', () => {
    if (leStoreManager) return
    try {
      leStoreManager = new LeStoreManager()
      context.subscriptions.push(vscode.commands.registerCommand('kReactCodeTree.queryStoreManagedFields', () => {
          leStoreManager.queryManageFileds()
      }))
      context.subscriptions.push(vscode.commands.registerCommand('kReactCodeTree.queryStoreConnectOutFields', () => {
        leStoreManager.queryOutStoreFileds()
      }))
      context.subscriptions.push(vscode.commands.registerCommand('kReactCodeTree.queryStoreAllFields', () => {
        leStoreManager.queryAllFields()
      }))
      vscode.window.showInformationMessage('激活Le-Store仓库管理')
    } catch (e) {
      console.log(e, 'registedActions');
    }
  }))

  vscode.commands.registerCommand("kReactCodeTree.refreshStoreManager", () => {
    if (!leStoreManager) {
      vscode.window.showInformationMessage('请先激活Le-Store仓库管理')
      return
    }
    leStoreManager.reset();
  });


}
