"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const routerTree_1 = require("./routerTree");
const nodeFlowsUtil_1 = require("./nodeFlowsUtil");
const nodeFlowsView_1 = require("./nodeFlowsView");
const routerTreeView_1 = require("./routerTreeView");
const ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;
function activate(context) {
    const nodeFlowsView = new nodeFlowsView_1.NodeFlowsView();
    // 复制combo 可以搞各种combo放到另一个插件里
    vscode.commands.registerCommand("extension.copyCombo", () => {
        vscode.commands.executeCommand("bracket-select.select").then(() => {
            vscode.commands.executeCommand("editor.action.clipboardCopyAction").then(() => {
                vscode.window.showInformationMessage('复制成功');
            });
        });
    });
    vscode.commands.registerCommand("kReactCodeTree.refresh", () => {
        vscode.window.showInformationMessage(`kReactCodeTree called refresh.`);
        nodeFlowsView.reset();
    });
    // kReactCodeTree.editNode
    context.subscriptions.push(vscode.commands.registerCommand("kReactCodeTree.editNode", (selectedNode) => __awaiter(this, void 0, void 0, function* () {
        if (!selectedNode) {
            return;
        }
        const data = nodeFlowsView.treeDataProvider.topRequirePath(selectedNode);
        vscode.workspace.openTextDocument(data.requirePath).then(doc => {
            vscode.window.showTextDocument(doc).then(editor => {
                const line = nodeFlowsUtil_1.default.findNodeLine(selectedNode, doc);
                if (line !== null) {
                    var newSelection = new vscode.Selection(new vscode.Position(line, 0), new vscode.Position(line, 0));
                    editor.selection = newSelection;
                    editor.revealRange(new vscode.Range(newSelection.anchor, newSelection.active));
                }
            });
        });
    })));
    context.subscriptions.push(vscode.commands.registerCommand("kReactCodeTree.insertIn", (selectedNode) => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        const node = yield nodeFlowsUtil_1.default.getEditorCursorKReactFlowNode(editor);
        if (!selectedNode) {
            return;
        }
        if (!node) {
            vscode.window.showInformationMessage(`当前光标位置无效，请在文档中选择一个位置`);
            return;
        }
        if (!selectedNode.children) {
            selectedNode.children = [];
        }
        selectedNode.children.push(node);
        const data = nodeFlowsView.treeDataProvider.topRequirePath(selectedNode);
        try {
            let text = `\nmodule.exports = ${JSON.stringify(data.nodes.map(n => nodeFlowsUtil_1.default.dump(n)), null, 2)}`;
            fs.writeFile(data.requirePath, text, () => {
                nodeFlowsView.refresh();
                vscode.window.showInformationMessage('更新成功');
            });
        }
        catch (e) {
            console.log(e, 'errrrr');
        }
    })));
    context.subscriptions.push(vscode.commands.registerCommand("kReactCodeTree.insertAfter", (selectedNode) => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        const node = yield nodeFlowsUtil_1.default.getEditorCursorKReactFlowNode(editor);
        if (!selectedNode) {
            return;
        }
        if (!node) {
            vscode.window.showInformationMessage(`当前光标位置无效，请在文档中选择一个位置`);
            return;
        }
        nodeFlowsView.treeDataProvider.addChild(node, selectedNode);
        const data = nodeFlowsView.treeDataProvider.topRequirePath(selectedNode);
        try {
            let text = `\nmodule.exports = ${JSON.stringify(data.nodes.map(n => nodeFlowsUtil_1.default.dump(n)), null, 2)}`;
            // console.log(data, data.nodes.map(n => NodeFlowsUtil.dump(n)), 'datadatadatadata22')
            // '/Users/kunsam/Downloads/my-project/wechat-web-for-text/.vscode/kReactCodeTree/workflows/test.js'
            fs.writeFile(data.requirePath, text, () => {
                nodeFlowsView.refresh();
                vscode.window.showInformationMessage('更新成功');
            });
        }
        catch (e) {
            console.log(e, 'errrrr');
        }
    })));
    // 需要左边 kReactCodeTree 面板打开才执行
    let disposable = vscode.commands.registerCommand("extension.getKReactNodeCode", () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        const node = yield nodeFlowsUtil_1.default.getEditorCursorKReactFlowNode(editor);
        if (node) {
            vscode.env.clipboard.writeText(JSON.stringify(Object.assign(Object.assign({}, node), { filePattern: node.filePattern }), null, 2));
            vscode.window.showInformationMessage(`Successfully wrote into clipboard.`);
        }
        else {
            vscode.window.showErrorMessage(`Get KReact Node Code failed`);
        }
    }));
    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.commands.registerCommand('extension.addOpenAsideToContextMenu', () => __awaiter(this, void 0, void 0, function* () {
        yield vscode.commands.executeCommand('editor.action.revealDefinitionAside', {
            openToSide: true
        });
    })));
    // ROOT_PATH
    const ROUTER_FILE_RELATIVE_PATH = "/.vscode/kReactCodeTree/workflows/router_config.js";
    const ROUTER_FILE_ABS_PATH = `${ROOT_PATH}${ROUTER_FILE_RELATIVE_PATH}`;
    if (!fs.existsSync(ROUTER_FILE_ABS_PATH)) {
        vscode.window.showErrorMessage('未找到路由配置文件');
        return;
    }
    const routers = require(ROUTER_FILE_ABS_PATH);
    const kRouterTree = new routerTree_1.KRouterTree(routers);
    const routerTreeView = new routerTreeView_1.RouterTreeView(kRouterTree);
    context.subscriptions.push(vscode.commands.registerCommand('kReactRouterTree.GotoComponent', (selectedNode) => {
        // console.log(selectedNode, 'selectedNode')
        if (selectedNode && selectedNode.componentRelativePath) {
            // 没带后缀
            const fsPath = path.resolve(path.join(ROOT_PATH, selectedNode.componentRelativePath));
            let trueFsPath = '';
            if (fs.existsSync(fsPath)) {
                if (fs.statSync(fsPath).isDirectory()) {
                    fs.readdirSync(fsPath).forEach(f => {
                        if (f.includes('index') && /.jsx?|tsx?g$/g.test(f)) {
                            trueFsPath = path.join(fsPath, f);
                        }
                    });
                }
                else {
                    trueFsPath = fsPath;
                }
            }
            if (!trueFsPath) {
                vscode.window.showInformationMessage(`未找到结果`);
            }
            else {
                try {
                    vscode.workspace.openTextDocument(trueFsPath).then((doc) => {
                        vscode.window.showTextDocument(doc);
                    });
                }
                catch (e) {
                    vscode.window.showInformationMessage(`无法打开${trueFsPath}`);
                }
            }
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("extension.getFileAppUrl", (uri) => {
        const routers = kRouterTree.queryFileAppUrl(path.relative(ROOT_PATH, uri.fsPath));
        if (routers) {
            // TODO 增加一个端口配置
            vscode.env.clipboard.writeText('https://localhost:3000' + routers.join('\n'));
            vscode.window.showInformationMessage('复制成功');
        }
        else {
            vscode.window.showInformationMessage('暂无结果');
        }
    }));
    vscode.window.showInformationMessage('KReactCode准备完毕');
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map