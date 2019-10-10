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
const path = require("path");
const vscode = require("vscode");
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
        // TODO id 方案不好
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
//# sourceMappingURL=nodeFlowsUtil.js.map