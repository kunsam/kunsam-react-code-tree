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
const nodeFlowsUtil_1 = require("./nodeFlowsUtil");
const type_1 = require("./type");
const ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;
const CONFIG_FILE_RELATIVE_PATH = "/.vscode/kReactCodeTree/workflows/index.js";
const CONFIG_FILE_ABS_PATH = `${ROOT_PATH}${CONFIG_FILE_RELATIVE_PATH}`;
function _getSymbols(data, symbols, currentIndex, lastResults, results, doc) {
    return new Promise((res) => {
        function filterResultsByFilePattern(symbols) {
            return (data.filePattern && symbols.filter(r => r.location.uri.path.includes(data.filePattern))) || symbols;
        }
        function handleSearchSymbolResult(result) {
            return new Promise(promiseRes => {
                let filterResult = filterResultsByFilePattern(result).filter(r => {
                    // 过滤掉相关符号
                    const equivalentName = r.name.replace(/\(|\)|\{|\}|\[|\]/g, '');
                    // console.log(r.name, equivalentName, symbols[currentIndex], 'equivalentNameequivalentName')
                    return equivalentName === symbols[currentIndex];
                });
                if (symbols[currentIndex + 1]) {
                    _getSymbols(data, symbols, currentIndex + 1, filterResult, results).then(d => promiseRes(d));
                }
                else {
                    results = results.concat(filterResult);
                    promiseRes(results);
                }
            });
        }
        if (currentIndex === 0) {
            // executeDocumentSymbolProvider not work
            vscode.commands
                .executeCommand("vscode.executeWorkspaceSymbolProvider", symbols[currentIndex])
                .then((result) => {
                if (doc) {
                    // 筛选filePattern指定的文件来源
                    result = result.filter(r => r.location.uri.path === doc.uri.path);
                }
                handleSearchSymbolResult(result).then(r => res(r));
            });
            return;
        }
        else {
            const lastResultsMap = {};
            lastResults.forEach(s => {
                if (s.name) {
                    const equivalentName = s.name.replace(/\(|\)|\{|\}|\[|\]/g, '');
                    lastResultsMap[equivalentName] = true;
                }
            });
            lastResults.forEach(() => {
                vscode.commands
                    .executeCommand("vscode.executeWorkspaceSymbolProvider", symbols[currentIndex])
                    .then((result) => {
                    // console.log(currentIndex, lastResultsMap, result, 'lastResultsMap executeWorkspaceSymbolProvider')
                    handleSearchSymbolResult(result.filter(r => lastResultsMap[r.containerName])).then(r => res(r));
                });
            });
            return;
        }
    });
}
function getBestMatchingSymbol(data, doc) {
    // let onlyResult: vscode.SymbolInformation | undefined = undefined;
    return new Promise((res) => {
        if (!data.symbol) {
            res([]);
            return;
        }
        if (data.symbol) {
            const symbols = data.symbol.split(".");
            _getSymbols(data, symbols, 0, [], [], doc).then(symbolResults => {
                console.log(symbolResults, '_getSymbols results');
                // 打开多个吧
                if (data.textPattern) {
                    const textPatternLineNumber = data.text.split('#')[1];
                    const textPatternLine = textPatternLineNumber !== undefined ? parseInt(textPatternLineNumber) : 1;
                    symbolResults = symbolResults.filter((sr) => __awaiter(this, void 0, void 0, function* () {
                        const doc = yield vscode.workspace.openTextDocument(sr.location.uri);
                        const startLine = sr.location.range.start.line;
                        const endLine = sr.location.range.end.line;
                        let count = 1;
                        for (let i = startLine; i <= endLine; i++) {
                            const text = doc.lineAt(i).text;
                            const textIndex = text.indexOf(data.textPattern);
                            if (textIndex >= 0) {
                                if (count === textPatternLine) {
                                    sr.location.range = sr.location.range.with(new vscode.Position(i, textIndex), new vscode.Position(i, textIndex + text.length));
                                    return true;
                                }
                                else {
                                    count++;
                                }
                            }
                        }
                        return false;
                    }));
                    console.log(data.textPattern, symbolResults, 'data.textPattern symbolResults');
                }
                res(symbolResults);
            });
        }
    });
}
class NodeFlowsView {
    constructor() {
        this._initNodeFlowsView();
    }
    _initNodeFlowsView() {
        if (fs.existsSync(CONFIG_FILE_ABS_PATH)) {
            const workflows = require(CONFIG_FILE_ABS_PATH);
            this._treeDataProvider = new KReactCodeTree(workflows);
            delete require.cache[require.resolve(CONFIG_FILE_ABS_PATH)];
            this._view = vscode.window.createTreeView("kReactCodeTree", {
                treeDataProvider: this._treeDataProvider,
                showCollapseAll: true
            });
            this._view.onDidChangeSelection(e => {
                e.selection.forEach(data => {
                    if (data.children && data.children.length)
                        return;
                    console.log(data, "onDidChangeSelection selection");
                    if (data.location) {
                        this._showlocatedDoc(data.location);
                        return;
                    }
                    // todo 存在Location直接跳转
                    // 如果有filePattern 先加载这个fileDocument
                    if (data.filePattern) {
                        vscode.workspace.findFiles(data.filePattern).then(files => {
                            console.log(files, "findFiles");
                            if (files.length > 1) {
                                vscode.window.showInformationMessage(`filePattern对应了多个文件，请确定唯一性`);
                                return;
                            }
                            if (!files.length) {
                                vscode.window.showErrorMessage(`未找到filePattern对应文件 ${data.filePattern}`);
                                getBestMatchingSymbol(data).then((results => {
                                    this._showMatchedSymbols(data, results, ROOT_PATH);
                                }));
                            }
                            else {
                                const file = files[0];
                                vscode.workspace.openTextDocument(file).then(doc => {
                                    getBestMatchingSymbol(data, doc).then((results => {
                                        // 仅有 filepattern结果
                                        if (!results.length) {
                                            vscode.window.showTextDocument(doc);
                                        }
                                        else {
                                            this._showMatchedSymbols(data, results, ROOT_PATH);
                                        }
                                    }));
                                });
                            }
                        });
                    }
                    else {
                        getBestMatchingSymbol(data).then((results => {
                            this._showMatchedSymbols(data, results, ROOT_PATH);
                        }));
                    }
                });
            });
        }
    }
    get treeDataProvider() {
        return this._treeDataProvider;
    }
    refresh() {
        this._treeDataProvider.refresh();
    }
    reset() {
        this._initNodeFlowsView();
    }
    _showlocatedDoc(location) {
        vscode.workspace.openTextDocument(location.uri).then(doc => {
            vscode.window.showTextDocument(doc).then(editor => {
                editor.revealRange(location.range);
                // var newPosition = position.with(position.line, 0);
                var newSelection = new vscode.Selection(location.range.start, location.range.end);
                editor.selection = newSelection;
            });
        });
    }
    // 用一种封装的Node
    _showMatchedSymbols(data, symbolResults, rootPath) {
        // 更新节点
        if (!data.children)
            data.children = [];
        symbolResults.forEach(sr => {
            // 暂时没封装 addChild
            data.children.push({
                text: `${sr.name} - ${path.relative(rootPath, sr.location.uri.path)}`,
                location: sr.location,
                parent: data,
                iconType: type_1.KC_NODE_ICON_TYPE.result
            });
        });
        this._treeDataProvider.refresh();
        this._view.reveal(data.children[0], { select: false, expand: true, focus: true });
        if (symbolResults.length === 1) {
            this._showlocatedDoc(symbolResults[0].location);
        }
    }
}
exports.NodeFlowsView = NodeFlowsView;
class KReactCodeTree {
    constructor(tree) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        tree.forEach(ct => {
            this._initTree(ct);
        });
        this._tree = tree;
    }
    _initTree(element) {
        if (!element.symbol) {
            if (element.filePattern) {
                element.iconType = type_1.KC_NODE_ICON_TYPE.file;
            }
            else {
                element.iconType = type_1.KC_NODE_ICON_TYPE.text;
            }
        }
        else {
            element.iconType = type_1.KC_NODE_ICON_TYPE.node;
        }
        if (element.requirePath) {
            try {
                element.children = require(element.requirePath);
            }
            catch (_a) {
                vscode.window.showErrorMessage(`${element.requirePath}有误`);
            }
        }
        if (element.children && element.children.length) {
            element.children.forEach(c => {
                c.parent = element;
                this._initTree(c);
            });
        }
    }
    addChild(element, selectedNode) {
        let queue = this._tree;
        if (selectedNode.parent) {
            if (!selectedNode.parent.children) {
                selectedNode.parent.children = [];
            }
            queue = selectedNode.parent.children;
        }
        const findIndex = queue.findIndex(c => nodeFlowsUtil_1.default.isElementEqual(c, selectedNode));
        if (findIndex >= 0) {
            queue.splice(findIndex + 1, 0, element);
        }
        else {
            queue.push(element);
        }
    }
    topRequirePath(element) {
        let topParent = element;
        if (!element.parent) {
            return {
                nodes: this._tree,
                requirePath: CONFIG_FILE_ABS_PATH
            };
        }
        while (topParent.parent && !topParent.requirePath) {
            topParent = topParent.parent;
        }
        if (!topParent.parent && topParent.requirePath) {
            return {
                nodes: topParent.children,
                requirePath: topParent.requirePath
            };
        }
        else {
            return {
                nodes: this._tree,
                requirePath: CONFIG_FILE_ABS_PATH
            };
        }
    }
    getChildren(element) {
        if (!element)
            return this._tree;
        return element.children || [];
    }
    getTreeItem(element) {
        return Object.assign(Object.assign({ label: element.text }, this._getIconPath(element.iconType)), { collapsibleState: element.children && element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None });
    }
    getParent(element) {
        return element.parent;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    _getIconPath(iconType) {
        switch (iconType) {
            default: {
                return {};
            }
            case type_1.KC_NODE_ICON_TYPE.node: {
                return {
                    iconPath: {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'node.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'node.svg'),
                    }
                };
            }
            case type_1.KC_NODE_ICON_TYPE.text: {
                return {
                    iconPath: {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'text.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'text.svg'),
                    }
                };
            }
            case type_1.KC_NODE_ICON_TYPE.result: {
                return {
                    iconPath: {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'gou.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'gou.svg'),
                    }
                };
            }
            case type_1.KC_NODE_ICON_TYPE.file: {
                return {
                    iconPath: {
                        light: path.join(__filename, '..', '..', 'resources', 'light', 'document.svg'),
                        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'document.svg'),
                    }
                };
            }
        }
    }
}
exports.KReactCodeTree = KReactCodeTree;
class KReactCodeTreeItem extends vscode.TreeItem {
    constructor(label, version, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.version = version;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
        };
        this.contextValue = 'dependency';
    }
    get tooltip() {
        return `${this.label}-${this.version}`;
    }
    get description() {
        return this.version;
    }
}
exports.KReactCodeTreeItem = KReactCodeTreeItem;
//# sourceMappingURL=nodeFlowsView.js.map