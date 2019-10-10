"use strict";
import * as fs from 'fs'
import * as path from "path";
import * as vscode from "vscode";
import { KC_Node } from './type';
import { KRouterTree } from './routerTree';
import NodeFlowsUtil from './nodeFlowsUtil';
import { NodeFlowsView } from "./nodeFlowsView";
import { RouterTreeView } from './routerTreeView';
import { selectText } from './select';
import { getFileAbsolutePath, GotoTextDocument } from './extensionUtil';

const ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;

export function activate(context: vscode.ExtensionContext) {

  const nodeFlowsView = new NodeFlowsView();

  // 复制combo 可以搞各种combo放到另一个插件里
  vscode.commands.registerCommand("kReactCodeTree.gotoRelative", () => {
    const text = selectText(false)
    const trueFsPath = getFileAbsolutePath(text)
    GotoTextDocument(trueFsPath)
  })
  vscode.commands.registerCommand("extension.selectBracket", () => {
    selectText(false);
  })

  
  vscode.commands.registerCommand("kReactCodeTree.refresh", () => {
    vscode.window.showInformationMessage(`kReactCodeTree called refresh.`);
    nodeFlowsView.reset();
  });

  // kReactCodeTree.editNode
  context.subscriptions.push(vscode.commands.registerCommand("kReactCodeTree.editNode", async (selectedNode: KC_Node) => {
    if (!selectedNode) {
      return
    }
    const data = nodeFlowsView.treeDataProvider.topRequirePath(selectedNode);
    vscode.workspace.openTextDocument(data.requirePath).then(doc => {
      vscode.window.showTextDocument(doc).then(editor => {
        const line = NodeFlowsUtil.findNodeLine(selectedNode, doc);
        if (line !== null) {
          var newSelection = new vscode.Selection(new vscode.Position(line, 0), new vscode.Position(line, 0));
          editor.selection = newSelection;
          editor.revealRange(new vscode.Range(newSelection.anchor, newSelection.active))
        }
      })
    })
  }));

  context.subscriptions.push(vscode.commands.registerCommand("kReactCodeTree.insertIn", async (selectedNode: KC_Node) => {
    const editor = vscode.window.activeTextEditor;
    const node = await NodeFlowsUtil.getEditorCursorKReactFlowNode(editor)
    if (!selectedNode) {
      return
    }
    if (!node) {
      vscode.window.showInformationMessage(`当前光标位置无效，请在文档中选择一个位置`)
      return;
    }
    if (!selectedNode.children) {
      selectedNode.children = []
    }
    selectedNode.children.push(node)
    const data = nodeFlowsView.treeDataProvider.topRequirePath(selectedNode);
    try {
      let text = `\nmodule.exports = ${JSON.stringify(data.nodes.map(n => NodeFlowsUtil.dump(n)), null, 2)}`
      fs.writeFile(data.requirePath, text, () => {
        nodeFlowsView.refresh()
        vscode.window.showInformationMessage('更新成功')
      })
    } catch (e) {
      console.log(e, 'errrrr')
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand("kReactCodeTree.insertAfter", async (selectedNode: KC_Node) => {
    const editor = vscode.window.activeTextEditor;
    const node = await NodeFlowsUtil.getEditorCursorKReactFlowNode(editor)
    if (!selectedNode) {
      return
    }
    if (!node) {
      vscode.window.showInformationMessage(`当前光标位置无效，请在文档中选择一个位置`)
      return;
    }
    nodeFlowsView.treeDataProvider.addChild(node, selectedNode);
    const data = nodeFlowsView.treeDataProvider.topRequirePath(selectedNode);
    try {
      let text = `\nmodule.exports = ${JSON.stringify(data.nodes.map(n => NodeFlowsUtil.dump(n)), null, 2)}`
      fs.writeFile(data.requirePath, text, () => {
        nodeFlowsView.refresh()
        vscode.window.showInformationMessage('更新成功')
      })
    } catch (e) {
      console.log(e, 'errrrr')
    }

  }));


  // 需要左边 kReactCodeTree 面板打开才执行
  let disposable = vscode.commands.registerCommand(
    "extension.getKReactNodeCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      const node = await NodeFlowsUtil.getEditorCursorKReactFlowNode(editor)
      if (node) {
        vscode.env.clipboard.writeText(JSON.stringify({ ...node, filePattern: node.filePattern }, null, 2))
        vscode.window.showInformationMessage(`Successfully wrote into clipboard.`)
      } else {
        vscode.window.showErrorMessage(`Get KReact Node Code failed`)
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(vscode.commands.registerCommand('extension.addOpenAsideToContextMenu', async () => {
    await vscode.commands.executeCommand('editor.action.revealDefinitionAside',
      {
        openToSide: true
      });
  }));


  const ROUTER_FILE_RELATIVE_PATH = "/.vscode/kReactCodeTree/router_config.js";
  const ROUTER_FILE_ABS_PATH = `${ROOT_PATH}${ROUTER_FILE_RELATIVE_PATH}`;
  if (!fs.existsSync(ROUTER_FILE_ABS_PATH)) {
    vscode.window.showErrorMessage('未找到路由配置文件')
    return
  }
  const routers = require(ROUTER_FILE_ABS_PATH)
  const kRouterTree = new KRouterTree(routers)
  const routerTreeView = new RouterTreeView(kRouterTree)


  context.subscriptions.push(vscode.commands.registerCommand('kReactRouterTree.GotoComponent', (selectedNode: any) => {
    // console.log(selectedNode, 'selectedNode')
    if (selectedNode && selectedNode.componentRelativePath) {
      const trueFsPath = getFileAbsolutePath(selectedNode.componentRelativePath)
      GotoTextDocument(trueFsPath)
    }
  }))

  context.subscriptions.push(vscode.commands.registerCommand("extension.getFileAppUrl", (uri: vscode.Uri) => {
    const routers = kRouterTree.queryFileAppUrl(path.relative(ROOT_PATH, uri.fsPath))
    if (routers) {
      // TODO 增加一个端口配置
      vscode.env.clipboard.writeText('https://localhost:3000' + routers.join('\n'));
      vscode.window.showInformationMessage('复制成功')
    } else {
      vscode.window.showInformationMessage('暂无结果')
    }
  }))

  vscode.window.showInformationMessage('KReactCode准备完毕')

}
