module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/commands/keybinding.ts":
/*!************************************!*\
  !*** ./src/commands/keybinding.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
const select_1 = __webpack_require__(/*! ../select */ "./src/select/index.ts");
const extensionUtil_1 = __webpack_require__(/*! ../extensionUtil */ "./src/extensionUtil.ts");
class KeybindingCommands {
    constructor(_) {
        this.init();
    }
    init() {
        // 选中括号/引号内
        vscode.commands.registerCommand("extension.selectBracket", () => {
            select_1.selectText(false);
        });
        // 跳转相对路径
        vscode.commands.registerCommand("kReactCodeTree.gotoRelative", () => {
            const text = select_1.selectText(false);
            const trueFsPath = extensionUtil_1.getFileAbsolutePath(text);
            extensionUtil_1.GotoTextDocument(trueFsPath);
        });
    }
}
exports.default = KeybindingCommands;


/***/ }),

/***/ "./src/commands/nodeflow/index.ts":
/*!****************************************!*\
  !*** ./src/commands/nodeflow/index.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
const fs = __webpack_require__(/*! fs */ "fs");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const nodeFlowsUtil_1 = __webpack_require__(/*! ./nodeFlowsUtil */ "./src/commands/nodeflow/nodeFlowsUtil.ts");
const nodeFlowsView_1 = __webpack_require__(/*! ./nodeFlowsView */ "./src/commands/nodeflow/nodeFlowsView.ts");
class NodeFlowCommands {
    constructor(context) {
        this.init(context);
    }
    init(context) {
        const nodeFlowsView = new nodeFlowsView_1.NodeFlowsView();
        vscode.commands.registerCommand("kReactCodeTree.refresh", () => {
            vscode.window.showInformationMessage(`kReactCodeTree called refresh.`);
            nodeFlowsView.reset();
        });
        // 需要左边 kReactCodeTree 面板打开才执行
        context.subscriptions.push(vscode.commands.registerCommand("extension.getKReactNodeCode", () => __awaiter(this, void 0, void 0, function* () {
            const editor = vscode.window.activeTextEditor;
            const node = yield nodeFlowsUtil_1.default.getEditorCursorKReactFlowNode(editor);
            if (node) {
                vscode.env.clipboard.writeText(JSON.stringify(Object.assign(Object.assign({}, node), { filePattern: node.filePattern }), null, 2));
                vscode.window.showInformationMessage(`Successfully wrote into clipboard.`);
            }
            else {
                vscode.window.showErrorMessage(`Get KReact Node Code failed`);
            }
        })));
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
                fs.writeFile(data.requirePath, text, () => {
                    nodeFlowsView.refresh();
                    vscode.window.showInformationMessage('更新成功');
                });
            }
            catch (e) {
                console.log(e, 'errrrr');
            }
        })));
    }
}
exports.default = NodeFlowCommands;


/***/ }),

/***/ "./src/commands/nodeflow/nodeFlowsUtil.ts":
/*!************************************************!*\
  !*** ./src/commands/nodeflow/nodeFlowsUtil.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
const path = __webpack_require__(/*! path */ "path");
const vscode = __webpack_require__(/*! vscode */ "vscode");
class NodeFlowsUtil {
    static getEditorCursorText(editor) {
        const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);
        const text = editor.document.getText(wordRange);
        return text;
    }
    static getEditorCursorKReactFlowNode(editor) {
        return __awaiter(this, void 0, void 0, function* () {
            const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);
            if (!wordRange)
                return;
            const text = editor.document.getText(wordRange);
            if (text) {
                const findResult = yield vscode.commands
                    .executeCommand("vscode.executeDocumentSymbolProvider", editor.document.uri)
                    .then((result) => {
                    result = result.filter(r => { return r.location.range.contains(wordRange); });
                    if (result.length === 1) {
                        return result;
                    }
                });
                if (findResult.length === 1) {
                    if (findResult[0].location.range.isEqual(wordRange)) {
                        return {
                            text: '节点描述',
                            symbol: findResult[0].name,
                            filePattern: path.relative(vscode.workspace.workspaceFolders[0].uri.path, editor.document.uri.path),
                        };
                    }
                    else {
                        return {
                            text: '节点描述',
                            symbol: findResult[0].name,
                            filePattern: path.relative(vscode.workspace.workspaceFolders[0].uri.path, editor.document.uri.path),
                            textPattern: text,
                        };
                    }
                }
            }
            return undefined;
        });
    }
    static dump(element) {
        let _element = {
        // _id: NodeFlowsUtil.elementId(element)
        };
        [
            'symbol',
            'text',
            'document',
            // 'children',
            'routers',
            'operationKeys',
            'textPattern',
            'filePattern',
            'requirePath'
        ].forEach(key => {
            if (element[key]) {
                _element[key] = element[key];
            }
        });
        if (element.children && !element.requirePath) {
            _element.children = element.children.map(c => (Object.assign({}, NodeFlowsUtil.dump(c))));
        }
        return _element;
    }
    static elementId(element, useRandom = false) {
        return `${element.filePattern || ''}-${element.symbol || ''}-${element.textPattern || ''}-${element.text || ''}-${useRandom ? Math.random().toFixed(6) : ''}`;
    }
    static isElementEqual(element, element2) {
        return NodeFlowsUtil.elementId(element) === NodeFlowsUtil.elementId(element2);
    }
    static findNodeLine(node, doc) {
        const originTexts = new Array(doc.lineCount - 1).fill(null).map((_, i) => ({ text: doc.lineAt(i + 1).text.replace(/\"\'/g, ''), line: i + 1 }));
        const filterArray = [
            'filePattern',
            'text',
            'symbol',
            'document',
        ].filter(a => node[a]);
        let resultLine = null;
        let minResults = originTexts;
        filterArray.every(filter => {
            const findByFilter = originTexts.filter(t => !!(t.text && t.text.indexOf(node[filter].replace(/\"\'/g, '')) > 0));
            if (findByFilter.length === 1) {
                resultLine = findByFilter[0].line;
                return false;
            }
            if (minResults.length > findByFilter.length) {
                minResults = findByFilter;
            }
            return resultLine === null;
        });
        if (resultLine === null && minResults.length && minResults.length !== originTexts.length) {
            return minResults[0].line;
        }
        return resultLine;
    }
}
exports.default = NodeFlowsUtil;


/***/ }),

/***/ "./src/commands/nodeflow/nodeFlowsView.ts":
/*!************************************************!*\
  !*** ./src/commands/nodeflow/nodeFlowsView.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const nodeFlowsUtil_1 = __webpack_require__(/*! ./nodeFlowsUtil */ "./src/commands/nodeflow/nodeFlowsUtil.ts");
const type_1 = __webpack_require__(/*! ../../type */ "./src/type.ts");
const config_1 = __webpack_require__(/*! ../../config */ "./src/config.ts");
const CONFIG_FILE_ABS_PATH = path.join(config_1.ROOT_PATH, config_1.PROJECT_DIR, '/workflows/index.js');
const iconPath1 = path.join(__filename, '..', '..', 'resources', 'light', 'node.svg');
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
                // console.log(symbolResults, '_getSymbols results')
                // 打开多个吧
                if (data.textPattern) {
                    const pureText = data.textPattern.split('#')[0];
                    const textPatternLineNumber = data.textPattern.split('#')[1];
                    const textPatternLine = textPatternLineNumber !== undefined ? parseInt(textPatternLineNumber) : 1;
                    symbolResults = symbolResults.filter((sr) => __awaiter(this, void 0, void 0, function* () {
                        const doc = yield vscode.workspace.openTextDocument(sr.location.uri);
                        const startLine = sr.location.range.start.line;
                        const endLine = sr.location.range.end.line;
                        let count = 1;
                        for (let i = startLine; i <= endLine; i++) {
                            const text = doc.lineAt(i).text;
                            const textIndex = text.indexOf(pureText);
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
                    // console.log(data.textPattern, symbolResults, 'data.textPattern symbolResults')
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
        return __awaiter(this, void 0, void 0, function* () {
            if (fs.existsSync(CONFIG_FILE_ABS_PATH)) {
                const workflows = require(`${CONFIG_FILE_ABS_PATH}`);
                this._treeDataProvider = new KReactCodeTree(workflows);
                delete require.cache[require.resolve(`${CONFIG_FILE_ABS_PATH}`)];
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
                                        this._showMatchedSymbols(data, results, config_1.ROOT_PATH);
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
                                                this._showMatchedSymbols(data, results, config_1.ROOT_PATH);
                                            }
                                        }));
                                    });
                                }
                            });
                        }
                        else {
                            getBestMatchingSymbol(data).then((results => {
                                this._showMatchedSymbols(data, results, config_1.ROOT_PATH);
                            }));
                        }
                    });
                });
            }
            else {
                vscode.window.showWarningMessage(`plz add ${CONFIG_FILE_ABS_PATH}`);
            }
        });
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
        if (!element.iconType) {
            if (element.children && element.children.length) {
                element.iconType = type_1.KC_NODE_ICON_TYPE.node;
            }
            else {
                if (element.symbol) {
                    element.iconType = type_1.KC_NODE_ICON_TYPE.node;
                }
                else {
                    if (element.filePattern) {
                        element.iconType = type_1.KC_NODE_ICON_TYPE.file;
                    }
                    else {
                        element.iconType = type_1.KC_NODE_ICON_TYPE.text;
                    }
                }
            }
        }
        if (element.requirePath) {
            // __kReactCodeTree__/workflows
            const truePath = path.join(config_1.ROOT_PATH, config_1.PROJECT_DIR, '/workflows', element.requirePath);
            try {
                element.children = require(`${truePath}`);
                delete require.cache[require.resolve(`${truePath}`)];
            }
            catch (_a) {
                vscode.window.showErrorMessage(`${truePath}有误`);
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
        return Object.assign(Object.assign({ label: element.text }, this._getIconPath(element.children && element.children.length ? type_1.KC_NODE_ICON_TYPE.node : element.iconType)), { collapsibleState: element.children && element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None });
    }
    getParent(element) {
        return element.parent;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    _getIconPath(iconType) {
        console.log(path.join(__filename, '..', '..', 'resources', 'light', 'node.svg'), '123');
        console.log(path.join(__filename, '..', 'resources', 'light', 'node.svg'), '44444');
        switch (iconType) {
            default: {
                return {};
            }
            case type_1.KC_NODE_ICON_TYPE.node: {
                return {
                    iconPath: {
                        light: `${path.join(__filename, '..', '..', 'resources', 'light', 'node.svg')}`,
                        dark: `${path.join(__filename, '..', '..', 'resources', 'dark', 'node.svg')}`,
                    }
                };
            }
            case type_1.KC_NODE_ICON_TYPE.text: {
                return {
                    iconPath: {
                        light: `${path.join(__filename, '..', '..', 'resources', 'light', 'text.svg')}`,
                        dark: `${path.join(__filename, '..', '..', 'resources', 'dark', 'text.svg')}`,
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


/***/ }),

/***/ "./src/commands/router/index.ts":
/*!**************************************!*\
  !*** ./src/commands/router/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const config_1 = __webpack_require__(/*! ../../config */ "./src/config.ts");
const routerTree_1 = __webpack_require__(/*! ./routerTree */ "./src/commands/router/routerTree.ts");
const extensionUtil_1 = __webpack_require__(/*! ../../extensionUtil */ "./src/extensionUtil.ts");
class RoutersCommand {
    constructor(context) {
        this.init(context);
    }
    loadRouters() {
        const ROUTER_FILE_ABS_PATH = path.join(config_1.ROOT_PATH, config_1.PROJECT_DIR, '/router_config.js');
        if (!fs.existsSync(ROUTER_FILE_ABS_PATH)) {
            vscode.window.showErrorMessage('未找到路由配置文件');
            return;
        }
        return require(`${ROUTER_FILE_ABS_PATH}`);
    }
    init(context) {
        this.kRouterTree = new routerTree_1.KRouterTree(this.loadRouters());
        // 右键菜单 goFileParentFile
        context.subscriptions.push(vscode.commands.registerCommand("extension.goFileParentFile", (uri) => {
            const parents = this.kRouterTree.getFileParents(uri.fsPath);
            extensionUtil_1.pickFiles2Open(parents);
        }));
        // 右键菜单 goFileTopParentFile
        context.subscriptions.push(vscode.commands.registerCommand("extension.goFileTopParentFile", (uri) => {
            let parents = this.recursiveGetParents(uri.fsPath, [], new Map());
            extensionUtil_1.pickFiles2Open(parents);
        }));
        // 右键菜单 getFileAppUrl
        context.subscriptions.push(vscode.commands.registerCommand("extension.getFileAppUrl", (uri) => {
            const routers = this.kRouterTree.queryFileAppUrl(uri.fsPath);
            if (routers) {
                // TODO 增加一个端口配置
                vscode.env.clipboard.writeText(routers.map(r => 'https://localhost:3000' + r).join('\n'));
                vscode.window.showInformationMessage('复制成功');
            }
            else {
                vscode.window.showInformationMessage('暂无结果');
            }
        }));
        // 快捷键搜索
        context.subscriptions.push(vscode.commands.registerCommand('kReactRouterTree.SearchRouter', () => __awaiter(this, void 0, void 0, function* () {
            const result = yield vscode.window.showQuickPick(this.kRouterTree.allRouters.map((r) => ({ label: r.path })), {
                placeHolder: '请输入 pathname',
            });
            if (result && result.label) {
                const componentRelativePath = this.kRouterTree.queryComponentRelativePathByPath(result.label);
                if (componentRelativePath) {
                    const filePath = extensionUtil_1.getFileAbsolutePath(componentRelativePath);
                    extensionUtil_1.GotoTextDocument(filePath);
                }
            }
        })));
    }
    recursiveGetParents(path, result, preventLoopMap) {
        if (preventLoopMap.has(path)) {
            return result;
        }
        preventLoopMap.set(path, true);
        let parents = this.kRouterTree.getFileParents(path).filter((a) => a !== path);
        if (parents) {
            parents.forEach((p) => {
                const p_parents = this.kRouterTree.getFileParents(p);
                if (!(p_parents && p_parents.length)) {
                    result.push(p);
                }
                else {
                    this.recursiveGetParents(p, result, preventLoopMap);
                }
            });
        }
        return result;
    }
}
exports.default = RoutersCommand;


/***/ }),

/***/ "./src/commands/router/routerTree.ts":
/*!*******************************************!*\
  !*** ./src/commands/router/routerTree.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
const path = __webpack_require__(/*! path */ "path");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const extensionUtil_1 = __webpack_require__(/*! ../../extensionUtil */ "./src/extensionUtil.ts");
// 文件 - 子节点表
const FILE_TREE_MAP = new Map();
// 文件 - 引入表
const FILE_IMPORTS_MAP = new Map();
// 文件 - 路由表
const FILE_ROUTERS_MAP = new Map();
// 路由表
const ROUTERS_MAP = new Map();
function getRelatedFiles(id, absPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id || !absPath) {
            return;
        }
        const mapImports = FILE_IMPORTS_MAP.get(absPath);
        const imports = mapImports || [];
        if (mapImports) {
            KRouterTreeItem.setRelatedFiles(id, mapImports);
            mapImports.forEach(item => {
                getRelatedFiles(id, item);
            });
        }
        else {
            try {
                const doc = yield vscode.workspace.openTextDocument(extensionUtil_1.getFileAbsolutePath(absPath, false));
                for (let i = 1; i < doc.lineCount - 1; i++) {
                    const lineText = doc.lineAt(i).text;
                    if (/\sfrom\s\'/.test(lineText)) {
                        const texts = lineText.split(' ');
                        if (texts[texts.length - 1]) {
                            const item = texts[texts.length - 1].replace('\'', '').replace('\"', '');
                            item && imports.push(item);
                        }
                    }
                    if (/import\(\'/.test(lineText)) {
                        const texts = lineText.split('\'');
                        if (texts[1]) {
                            const item = texts[1].replace('\'', '').replace('\"', '');
                            item && imports.push(item);
                        }
                    }
                    if (/function(.+)/.test(lineText) || /export(.+)/.test(lineText)) {
                        break;
                    }
                }
                const relativeImports = imports.filter(i => i.includes('/')).map(a => a.replace(/\'/g, '').replace(/\"/g, '')).map(item => {
                    if (/^\.+/.test(item)) {
                        return path.join(path.dirname(absPath), item);
                    }
                    if (/src\//.test(item)) {
                        return extensionUtil_1.getFileAbsolutePath(item);
                    }
                    return undefined;
                }).filter(a => !!a);
                relativeImports.forEach(nextPath => {
                    if (!FILE_ROUTERS_MAP.has(nextPath)) {
                        getRelatedFiles(id, nextPath);
                    }
                });
                FILE_IMPORTS_MAP.set(absPath, relativeImports);
                KRouterTreeItem.setRelatedFiles(id, relativeImports, absPath);
            }
            catch (_a) {
            }
        }
    });
}
class KRouterTreeItem {
    constructor(node, parentId = '') {
        this.routers = [];
        this.path = node.path || '';
        this.parentId = parentId;
        this.componentRelativePath = node.componentRelativePath;
        this.id = (parentId ? parentId + '/' : '') + this.path;
        this.uiNode = node.uiNode;
        this._addToTree(this, node.routers);
        const absPath = extensionUtil_1.getFileAbsolutePath(node.componentRelativePath);
        KRouterTreeItem.setRelatedFiles(this.id, [absPath]);
        getRelatedFiles(this.id, absPath);
    }
    static setRelatedFiles(id, relatedFiles, parentPath) {
        relatedFiles.forEach(r => {
            if (!FILE_ROUTERS_MAP.has(r)) {
                FILE_ROUTERS_MAP.set(r, [id]);
            }
            else {
                FILE_ROUTERS_MAP.set(r, FILE_ROUTERS_MAP.get(r).concat([id]));
            }
            // 写入文件树依赖
            if (parentPath) {
                if (!FILE_TREE_MAP.has(r)) {
                    FILE_TREE_MAP.set(r, [parentPath]);
                }
                else {
                    FILE_TREE_MAP.set(r, FILE_TREE_MAP.get(r).concat([parentPath]));
                }
            }
        });
    }
    _addToTree(parent, routers = []) {
        let children;
        if (!parent) {
            children = this.routers;
        }
        else {
            if (!parent.routers) {
                parent.routers = [];
            }
            children = parent.routers;
        }
        if (!parent.routers) {
            parent.routers = [];
        }
        const parentId = parent.id;
        routers.forEach(r => {
            if (r.componentRelativePath) {
                const node = new KRouterTreeItem(r, parentId);
                children.push(node);
                this._addToTree(node, r.routers);
            }
        });
    }
}
exports.KRouterTreeItem = KRouterTreeItem;
// , fileTree: any, fileImports: { path: string, imports: string[] }[]
class KRouterTree {
    // private _treeMap: Map<string, KRouterTreeItem> = new Map();
    // public flatternRouters: 
    constructor(routers) {
        this.items = [];
        this.allRouters = [];
        this.items = routers.map(r => r.componentRelativePath && new KRouterTreeItem(r));
        this._setFlatternRouters(routers, '');
        this.allRouters = this.getFlatternRouters();
    }
    queryFileAppUrl(absPath) {
        let queryPath = absPath;
        if (!FILE_ROUTERS_MAP.has(queryPath)) {
            queryPath = queryPath.replace(/\/index\.(j|t)sx?$/g, '');
        }
        if (!FILE_ROUTERS_MAP.has(queryPath)) {
            queryPath = queryPath.replace(/(\.(j|t)sx?)$/g, '');
        }
        return FILE_ROUTERS_MAP.get(queryPath);
    }
    getFileParents(absPath) {
        let queryPath = absPath;
        if (!FILE_TREE_MAP.has(queryPath)) {
            queryPath = queryPath.replace(/\/index\.(j|t)sx?$/g, '');
        }
        if (!FILE_TREE_MAP.has(queryPath)) {
            queryPath = queryPath.replace(/(\.(j|t)sx?)$/g, '');
        }
        return FILE_TREE_MAP.get(queryPath);
    }
    _setFlatternRouters(routers, parentPath) {
        if (!routers)
            return;
        routers.forEach(r => {
            if (r.path) {
                let pathname = parentPath + (r.path.includes('/') ? r.path : `/${r.path}`);
                ROUTERS_MAP.set(pathname, { path: pathname, componentRelativePath: r.componentRelativePath });
            }
            this._setFlatternRouters(r.routers, r.path);
        });
    }
    getFlatternRouters() {
        let result = [];
        ROUTERS_MAP.forEach(value => {
            result.push(value);
        });
        return result;
    }
    queryComponentRelativePathByPath(rpath) {
        const result = ROUTERS_MAP.get(rpath);
        return result && result.componentRelativePath;
    }
}
exports.KRouterTree = KRouterTree;


/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
exports.PROJECT_DIR = '/__kReactCodeTree__';
exports.ROOT_PATH = vscode.workspace.workspaceFolders[0].uri.path;


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
const vscode = __webpack_require__(/*! vscode */ "vscode");
const keybinding_1 = __webpack_require__(/*! ./commands/keybinding */ "./src/commands/keybinding.ts");
const nodeflow_1 = __webpack_require__(/*! ./commands/nodeflow */ "./src/commands/nodeflow/index.ts");
const router_1 = __webpack_require__(/*! ./commands/router */ "./src/commands/router/index.ts");
function activate(context) {
    // 在文档右侧打开定义
    context.subscriptions.push(vscode.commands.registerCommand('extension.addOpenAsideToContextMenu', () => __awaiter(this, void 0, void 0, function* () {
        yield vscode.commands.executeCommand('editor.action.revealDefinitionAside', {
            openToSide: true
        });
    })));
    new nodeflow_1.default(context);
    new keybinding_1.default(context);
    new router_1.default(context);
}
exports.activate = activate;


/***/ }),

/***/ "./src/extensionUtil.ts":
/*!******************************!*\
  !*** ./src/extensionUtil.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const vscode = __webpack_require__(/*! vscode */ "vscode");
const config_1 = __webpack_require__(/*! ./config */ "./src/config.ts");
/**
 * 获取文件绝对路径
 *
 * @export
 * @param {string} filePath
 * @param {boolean} [isRelative=true]
 * @returns
 */
function getFileAbsolutePath(filePath, isRelative = true) {
    // 没带后缀
    const fsPath = isRelative ? path.resolve(path.join(config_1.ROOT_PATH, filePath)) : filePath;
    let trueFsPath = '';
    if (fs.existsSync(fsPath)) {
        if (fs.statSync(fsPath).isDirectory()) {
            let NoneJSIndexes = [];
            fs.readdirSync(fsPath).forEach(f => {
                if (f.includes('index')) {
                    if (/\.(jsx?|tsx?)$/g.test(f)) {
                        trueFsPath = path.join(fsPath, f);
                    }
                    else {
                        NoneJSIndexes.push(path.join(fsPath, f));
                    }
                }
            });
            if (!trueFsPath && NoneJSIndexes.length) {
                NoneJSIndexes.forEach((indexPath) => {
                    if (/\.(s?css|less|sass)$/g.test(indexPath)) {
                        trueFsPath = indexPath;
                    }
                });
            }
        }
        else {
            trueFsPath = fsPath;
        }
    }
    else {
        // 可能是由没带后缀引起的
        const dirName = path.dirname(fsPath);
        if (fs.existsSync(dirName)) {
            fs.readdirSync(dirName).forEach(f => {
                // 只判断这两种类型
                if (/\.(jsx?|tsx?)$/g.test(f)) {
                    if (f.includes(path.basename(fsPath))) {
                        if (!fs.statSync(path.join(dirName, f)).isDirectory()) {
                            trueFsPath = path.join(dirName, f);
                        }
                    }
                }
            });
        }
    }
    return trueFsPath;
}
exports.getFileAbsolutePath = getFileAbsolutePath;
/**
 * vscode打开文件[绝对路径]
 *
 * @export
 * @param {string} trueFsPath
 */
function GotoTextDocument(trueFsPath) {
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
exports.GotoTextDocument = GotoTextDocument;
/**
 * vscode pick 文件列表并打开选中文件 [绝对路径]
 *
 * @export
 * @param {string[]} files
 */
function pickFiles2Open(files) {
    if (files.length === 1) {
        GotoTextDocument(files[0]);
    }
    else {
        if (files.length > 1) {
            vscode.window.showQuickPick(files.map((r) => ({ label: path.relative(config_1.ROOT_PATH, r), target: r })), {
                placeHolder: '请选择打开的文件',
            }).then(result => {
                if (result && result.target) {
                    GotoTextDocument(result.target);
                }
            });
        }
    }
}
exports.pickFiles2Open = pickFiles2Open;


/***/ }),

/***/ "./src/select/bracketUtil.ts":
/*!***********************************!*\
  !*** ./src/select/bracketUtil.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// https://github.com/wangchunsen/vscode-bracket-select/edit/master/src/bracketSelectMain.ts

Object.defineProperty(exports, "__esModule", { value: true });
var bracketUtil;
(function (bracketUtil) {
    let openBarcket = ['(', '{', '['];
    let closeBracket = [')', '}', ']'];
    let quoteBrackets = ['"', "'"];
    function isMatch(open, close) {
        let opentIndex = openBarcket.indexOf(open);
        if (opentIndex >= 0) {
            return closeBracket[opentIndex] == close;
        }
        else if (isQuoteBracket(open)) {
            return open == close;
        }
        return false;
    }
    bracketUtil.isMatch = isMatch;
    function isOpenBracket(char) {
        return openBarcket.indexOf(char) >= 0;
    }
    bracketUtil.isOpenBracket = isOpenBracket;
    function isCloseBracket(char) {
        return closeBracket.indexOf(char) >= 0;
    }
    bracketUtil.isCloseBracket = isCloseBracket;
    function isQuoteBracket(char) {
        return quoteBrackets.indexOf(char) >= 0;
    }
    bracketUtil.isQuoteBracket = isQuoteBracket;
})(bracketUtil = exports.bracketUtil || (exports.bracketUtil = {}));


/***/ }),

/***/ "./src/select/index.ts":
/*!*****************************!*\
  !*** ./src/select/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __webpack_require__(/*! vscode */ "vscode");
const bracketUtil_1 = __webpack_require__(/*! ./bracketUtil */ "./src/select/bracketUtil.ts");
// https://github.com/wangchunsen/vscode-bracket-select/edit/master/src/bracketSelectMain.ts
class SearchResult {
    constructor(bracket, offset) {
        this.bracket = bracket;
        this.offset = offset;
    }
}
function findBackward(text, index) {
    const bracketStack = [];
    for (let i = index; i >= 0; i--) {
        let char = text.charAt(i);
        // if it's a quote, we can not infer it is a open or close one 
        //so just return, this is for the case current selection is inside a string; 
        if (bracketUtil_1.bracketUtil.isQuoteBracket(char) && bracketStack.length == 0) {
            return new SearchResult(char, i);
        }
        if (bracketUtil_1.bracketUtil.isOpenBracket(char)) {
            if (bracketStack.length == 0) {
                return new SearchResult(char, i);
            }
            else {
                let top = bracketStack.pop();
                if (!bracketUtil_1.bracketUtil.isMatch(char, top)) {
                    throw 'Unmatched bracket pair';
                }
            }
        }
        else if (bracketUtil_1.bracketUtil.isCloseBracket(char)) {
            bracketStack.push(char);
        }
    }
    //we are get to edge
    return null;
}
function findForward(text, index) {
    const bracketStack = [];
    for (let i = index; i < text.length; i++) {
        let char = text.charAt(i);
        if (bracketUtil_1.bracketUtil.isQuoteBracket(char) && bracketStack.length == 0) {
            return new SearchResult(char, i);
        }
        if (bracketUtil_1.bracketUtil.isCloseBracket(char)) {
            if (bracketStack.length == 0) {
                return new SearchResult(char, i);
            }
            else {
                let top = bracketStack.pop();
                if (!bracketUtil_1.bracketUtil.isMatch(top, char)) {
                    throw 'Unmatched bracket pair';
                }
            }
        }
        else if (bracketUtil_1.bracketUtil.isOpenBracket(char)) {
            bracketStack.push(char);
        }
    }
    return null;
}
function showInfo(msg) {
    vscode.window.showInformationMessage(msg);
}
function getSearchContext() {
    const editor = vscode.window.activeTextEditor;
    const selection = editor.selection;
    let selectionStart = editor.document.offsetAt(editor.selection.anchor);
    let selectionEnd = editor.document.offsetAt(editor.selection.active);
    if (selection.isReversed) {
        //exchange
        [selectionStart, selectionEnd] = [selectionEnd, selectionStart];
    }
    return {
        backwardStarter: selectionStart - 1,
        forwardStarter: selectionEnd,
        text: editor.document.getText()
    };
}
function doSelection(start, end) {
    const editor = vscode.window.activeTextEditor;
    editor.selection = new vscode.Selection(editor.document.positionAt(start + 1), //convert text index to vs selection index
    editor.document.positionAt(end));
}
function isMatch(r1, r2) {
    return r1 != null && r2 != null && bracketUtil_1.bracketUtil.isMatch(r1.bracket, r2.bracket);
}
function selectText(includeBrack) {
    const searchContext = getSearchContext();
    let { text, backwardStarter, forwardStarter } = searchContext;
    if (backwardStarter < 0 || forwardStarter >= text.length) {
        return;
    }
    let selectionStart, selectionEnd;
    var backwardResult = findBackward(searchContext.text, searchContext.backwardStarter);
    var forwardResult = findForward(searchContext.text, searchContext.forwardStarter);
    while (forwardResult != null
        && !isMatch(backwardResult, forwardResult)
        && bracketUtil_1.bracketUtil.isQuoteBracket(forwardResult.bracket)) {
        forwardResult = findForward(searchContext.text, forwardResult.offset + 1);
    }
    while (backwardResult != null
        && !isMatch(backwardResult, forwardResult)
        && bracketUtil_1.bracketUtil.isQuoteBracket(backwardResult.bracket)) {
        backwardResult = findBackward(searchContext.text, backwardResult.offset - 1);
    }
    if (!isMatch(backwardResult, forwardResult)) {
        showInfo('Unmatched bracket pair');
        return;
    }
    // we are next to a bracket
    // this is the case for doule press select
    if (backwardStarter == backwardResult.offset && forwardResult.offset == forwardStarter) {
        selectionStart = backwardStarter - 1;
        selectionEnd = forwardStarter + 1;
    }
    else {
        if (includeBrack) {
            selectionStart = backwardResult.offset - 1;
            selectionEnd = forwardResult.offset + 1;
        }
        else {
            selectionStart = backwardResult.offset;
            selectionEnd = forwardResult.offset;
        }
    }
    doSelection(selectionStart, selectionEnd);
    const editor = vscode.window.activeTextEditor;
    return editor.document.getText(new vscode.Range(editor.document.positionAt(selectionStart + 1), editor.document.positionAt(selectionEnd)));
}
exports.selectText = selectText;


/***/ }),

/***/ "./src/type.ts":
/*!*********************!*\
  !*** ./src/type.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// 先指定 filePattern
// 然后寻找 symbol 查找节点必须存在，不存在未纯文字展示类型
// a.b.c 分步查找 symbol
// 根据 textPattern 过滤 查找结果
// 将结果写入node 子节点中并展开
// 点击子节点跳转到对应文档位置
var KC_NODE_ICON_TYPE;
(function (KC_NODE_ICON_TYPE) {
    KC_NODE_ICON_TYPE["text"] = "text";
    KC_NODE_ICON_TYPE["node"] = "node";
    KC_NODE_ICON_TYPE["result"] = "result";
    KC_NODE_ICON_TYPE["file"] = "file";
})(KC_NODE_ICON_TYPE = exports.KC_NODE_ICON_TYPE || (exports.KC_NODE_ICON_TYPE = {}));


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map