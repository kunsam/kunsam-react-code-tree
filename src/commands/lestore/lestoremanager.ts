import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import * as vscode from "vscode";
import { find } from 'lodash'
import { ROOT_PATH, PROJECT_DIR } from "../../config";
import { getStoreManagerFields } from "../../interpreter/action";
import { getConnectOutStoreFields } from "../../interpreter/connect";
import { pickFiles2Open } from "../../extensionUtil";


export interface LeLocation {
	filePath: string,
	symbol?: string
}

export default class LeStoreManager {
	loadConfig() {
		const configPath = path.join(ROOT_PATH, PROJECT_DIR, '/store_config.js')
		if (!fs.existsSync(configPath)) {
			vscode.window.showErrorMessage('未找到仓库配置文件')
			return
		}
		return __non_webpack_require__(`${configPath}`);
	}

	getFileNames() {
		const config = this.loadConfig()
		let actionFiles = []
		let reducerFiles = []
		fs.readdirSync(path.join(ROOT_PATH, config.action.folderPath)).forEach(file => {
			if (!/\.tsx?/.test(file)) return
			if (config.action.exclude) {
				if (find(config.action.exclude, name => name === file)) {
					return
				}
			}
			const filePath = path.join(ROOT_PATH, config.action.folderPath, file)
			if (!fs.statSync(filePath).isDirectory()) {
				actionFiles.push(filePath)
			}
		})
		fs.readdirSync(path.join(ROOT_PATH, config.reducer.folderPath)).forEach(file => {
			if (!/\.tsx?/.test(file)) return
			if (config.reducer.exclude) {
				if (find(config.reducer.exclude, name => name === file)) {
					return
				}
			}
			const filePath = path.join(ROOT_PATH, config.reducer.folderPath, file)
			if (!fs.statSync(filePath).isDirectory()) {
				reducerFiles.push(filePath)
			}
		})
		const connectedComponent = []
		config.connectComponents.folderPaths.forEach(folder => {
			this.recursiveGetComponentFiles(path.join(ROOT_PATH, folder), connectedComponent)
		})
		return { action: actionFiles, reducer: reducerFiles, connectedComponent }
	}

	recursiveGetComponentFiles(foldPath: string, result: string[]) {
		fs.readdirSync(foldPath).forEach(file => {
			if (file.includes('__test__')) return
			const filePath = path.join(foldPath, file)
			if (!fs.statSync(filePath).isDirectory()) {
				if (!/\.tsx/.test(file)) return
				if (file.includes('.test.')) return
				result.push(filePath)
			} else {
				this.recursiveGetComponentFiles(filePath, result)
			}
		})
	}

	// 注册列表
	private _regiterStateFiledsMap: Map<string, LeLocation[]> = new Map()
	// 入库列表
	private _enterStoreFiledsMap: Map<string, LeLocation[]> = new Map()
	// 出库列表
	private _connectOutStoreFiledsMap: Map<string, LeLocation[]> = new Map()

	private _cacheFields_regiterState: { name: string, location: LeLocation }[] = []
	private _cacheFields_enterStore: { name: string, location: LeLocation }[] = []
	private _cacheFields_connectOutStore: { name: string, location: LeLocation }[] = []

	constructor() {

		const files = this.getFileNames()
		console.log(files, 'files');
		// [
		// 	// '/Users/kunsam/Downloads/le-project/wechat-web/src/app/reducers/next/current_customer_reducer.ts',
		// 	'/Users/kunsam/Downloads/le-project/wechat-web/src/app/actions/next/current_customer_action.ts'
		// ]
		const storeManagerFields = getStoreManagerFields(files.action, {
			target: ts.ScriptTarget.ES5,
			isolatedModules: true
		})
		console.log(storeManagerFields, 'storeManagerFields');
		// [
		// 	'/Users/kunsam/Downloads/le-project/wechat-web/src/app/containers/free_service/free_service_active/index.tsx'
		// ]
		const connectOutStoreFields = getConnectOutStoreFields(files.connectedComponent, {
			jsxFactory: 'react',
			target: ts.ScriptTarget.ES5,
			isolatedModules: true
		})
		console.log(connectOutStoreFields, 'connectOutStoreFields');
		// 

		storeManagerFields.enterStore.forEach(once => {
			once.fileds.forEach((field: string) => {
				const history = this._enterStoreFiledsMap.get(field) || []
				history.push({ filePath: once.filePath, symbol: once.symbol })
				this._enterStoreFiledsMap.set(field, history)
			})
		})
		storeManagerFields.regiterState.forEach(once => {
			once.fileds.forEach((field: string) => {
				const history = this._regiterStateFiledsMap.get(field) || []
				history.push({ filePath: once.filePath, symbol: once.symbol })
				this._regiterStateFiledsMap.set(field, history)
			})
		})
		connectOutStoreFields.forEach(once => {
			once.fields.forEach(field => {
				const history = this._connectOutStoreFiledsMap.get(field) || []
				history.push({ filePath: once.filePath })
				this._connectOutStoreFiledsMap.set(field, history)
			})
		})
	}

	public getRegiterStateFields() {
		if (this._cacheFields_regiterState && this._cacheFields_regiterState.length) {
			return this._cacheFields_regiterState
		}
		this._regiterStateFiledsMap.forEach((value, key) => {
			value.forEach(location => {
				this._cacheFields_regiterState.push({ name: key, location })
			})
		})
		return this._cacheFields_regiterState
	}

	public getEnterstoreFields() {
		if (this._cacheFields_enterStore && this._cacheFields_enterStore.length) {
			return this._cacheFields_enterStore
		}
		this._enterStoreFiledsMap.forEach((value, key) => {
			value.forEach(location => {
				this._cacheFields_enterStore.push({ name: key, location })
			})
		})
		return this._cacheFields_enterStore
	}

	public getConnectStoreFields() {
		if (this._cacheFields_connectOutStore && this._cacheFields_connectOutStore.length) {
			return this._cacheFields_connectOutStore
		}
		this._connectOutStoreFiledsMap.forEach((value, key) => {
			value.forEach(location => {
				this._cacheFields_connectOutStore.push({ name: key, location })
			})
		})
		return this._cacheFields_connectOutStore
	}

	public getManageFiledsLabelList() {
		const result = []
		result.push({ label: '📮注册列表-----' })
		this.getRegiterStateFields().forEach(data => {
			result.push({ label: '  ' + data.name + '    📮', target: data.location.filePath })
		})
		result.push({ label: '📩入库列表-----' })
		this.getEnterstoreFields().forEach(data => {
			result.push({ label: '  ' + data.name + '    📩', target: data.location.filePath })
		})
		return result
	}

	public getOutStoreFiledsLableList() {
		const result = []
		result.push({ label: '📨出库列表-----' })
		this.getConnectStoreFields().forEach(data => {
			result.push({ label: '  ' + data.name + '    📨', target: data.location.filePath })
		})
		return result
	}

	public queryManageFileds() {
		// 查看注册和入库列表
		pickFiles2Open(this.getManageFiledsLabelList(), false, '请输入字段名称')
	}

	public queryOutStoreFileds() {
		pickFiles2Open(this.getOutStoreFiledsLableList(), false, '请输入字段名称')
	}

	public queryAllFields() {
		pickFiles2Open([
			...this.getManageFiledsLabelList(),
			...this.getOutStoreFiledsLableList()
		], false, '请输入字段名称')
	}

}