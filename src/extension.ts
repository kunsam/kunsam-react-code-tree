"use strict";
import * as vscode from "vscode";
import NodeFlowCommands from "./commands/nodeflow";
import KeybindingCommands from "./commands/keybinding";

export async function activate(context: vscode.ExtensionContext) {
  new NodeFlowCommands(context);
  new KeybindingCommands(context);
}
