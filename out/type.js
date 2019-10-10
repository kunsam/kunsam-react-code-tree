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
//# sourceMappingURL=type.js.map