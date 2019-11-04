"use strict";
import * as vscode from "vscode";
import { selectText } from "./select";
import RoutersCommand from "./commands/router";
import NodeFlowCommands from "./commands/nodeflow";
import KeybindingCommands from "./commands/keybinding";
import LeStoreManager from "./commands/lestore/lestoremanager";
import { ActionClassCoder } from "le-ts-code-tool";
import { toLower, upperFirst } from "lodash";

export function activate(context: vscode.ExtensionContext) {
  // 在文档右侧打开定义
  // context.subscriptions.push(
  //   vscode.commands.registerCommand(
  //     "extension.addOpenAsideToContextMenu",
  //     async () => {
  //       await vscode.commands.executeCommand(
  //         "editor.action.revealDefinitionAside",
  //         {
  //           openToSide: true
  //         }
  //       );
  //     }
  //   )
  // );

  // 菜单右键 获取ActionReducerClass
  vscode.commands.registerCommand("kReactCodeTree.store.getActionClass", () => {
    const text = selectText({ includeBrack: false });
    if (text) {
      const splited = text
        .replace(/\_/g, ":")
        .split(":")
        .map(t => upperFirst(toLower(t)))
        .concat(["Action"]);
      splited.shift();
      const className = splited.join("");
      vscode.env.clipboard
        .writeText(`export class ${className} extends AppAction {
        static id = '${text}'
        reducer: AppReducer<{ field: any }> = function (state, action) {
          return {
          }
        }
      }
      StoreName.registerAction(${className})
      `);
    }
  });

  // 菜单右键 获取 getActionClassByQueryString
  vscode.commands.registerCommand(
    "kReactCodeTree.store.getActionClassByQueryString",
    () => {
      const qltext = selectText({
        includeBrack: false,
        disableOpenCloseBrack: true
      });
      const text = ActionClassCoder.getActionClassByQueryString(qltext);
      vscode.env.clipboard.writeText(text).then(() => {
        vscode.window.showInformationMessage("成功复制到剪切板");
      });
    }
  );
  vscode.commands.registerCommand(
    "kReactCodeTree.store.getActionClassByQueryStringSimple",
    () => {
      const qltext = selectText({
        includeBrack: false,
        disableOpenCloseBrack: true
      });
      const text = ActionClassCoder.getActionClassSimpleByQueryString(qltext);
      vscode.env.clipboard.writeText(text).then(() => {
        vscode.window.showInformationMessage("成功复制到剪切板");
      });
    }
  );
  class ActionCompletitionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(): vscode.ProviderResult<
      vscode.CompletionItem[] | vscode.CompletionList
    > {
      return new Promise(resolve => {
        const item = new vscode.CompletionItem(
          "le_at_generate: " + 'AppAction',
          vscode.CompletionItemKind.Class
        );
        item.detail = 'LeTote New Action'
        item.insertText = ActionClassCoder.getActionClassSimpleByQueryString('');
        resolve([ item ]);
      });
    }
  }
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: "file", language: "typescript" },
        { scheme: "file", language: "javascript" },
        { scheme: "file", language: "javascriptreact" },
        { scheme: "file", language: "typescriptreact" }
      ],
      new ActionCompletitionProvider(),
      "leatg"
    )
  )

  new NodeFlowCommands(context);
  new KeybindingCommands(context);
  new RoutersCommand(context);

  let leStoreManager: LeStoreManager | undefined;
  context.subscriptions.push(
    vscode.commands.registerCommand("kReactCodeTree.activeStoreManager", () => {
      if (leStoreManager) return;
      try {
        leStoreManager = new LeStoreManager();
        leStoreManager.run(context);
        context.subscriptions.push(
          vscode.commands.registerCommand(
            "kReactCodeTree.queryStoreManagedFields",
            () => {
              leStoreManager.queryManageFileds();
            }
          )
        );
        context.subscriptions.push(
          vscode.commands.registerCommand(
            "kReactCodeTree.queryStoreConnectOutFields",
            () => {
              leStoreManager.queryOutStoreFileds();
            }
          )
        );
        context.subscriptions.push(
          vscode.commands.registerCommand(
            "kReactCodeTree.queryStoreAllFields",
            () => {
              leStoreManager.queryAllFields();
            }
          )
        );
        vscode.window.showInformationMessage("激活Le-Store仓库管理");
      } catch (e) {
        console.log(e, "registedActions");
      }
    })
  );

  vscode.commands.registerCommand("kReactCodeTree.refreshStoreManager", () => {
    if (!leStoreManager) {
      vscode.window.showInformationMessage("请先激活Le-Store仓库管理");
      return;
    }
    leStoreManager.reset();
  });
}
