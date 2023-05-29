const vscode = require('vscode')
const serialport = require('serialport')
const childProcess = require('child_process')
const path = require('path')

/**
 * Check for Python prerequisites and register commands.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Assume this is a Windows system, but adjust if not.
	let PYTHON_BIN = 'py.exe'
	console.debug('Operating System:', process.platform)
	if (process.platform != 'win32') {  // win32 is returned for 64-bit OS as well
		PYTHON_BIN = 'python'
	}
	console.debug('Using Python executable:', PYTHON_BIN)
	
	// Python and the esptool module must be installed for this to work.
	try {
		let pythonVersion = childProcess.execSync(`${PYTHON_BIN} --version`).toString().split('\r\n')[0].split(' ')[1]
		console.debug('Python version:', pythonVersion)
	}
	catch (ex) {
		vscode.window.showErrorMessage(`Python is not installed or could not be run as ${PYTHON_BIN}`, ex)
	}

	try {
		let esptoolVersion = childProcess.execSync(`${PYTHON_BIN} -m esptool version`).toString().split('\r\n')[1]
		console.debug('esptool version:', esptoolVersion)
	}
	catch (ex) {
		vscode.window.showErrorMessage('esptool is not installed or could not be run as a Python module')
	}

	// All commands are run in the integrated terminal so output is visible.
	const term = vscode.window.createTerminal('esptool')
	term.show(false)

	/**
	 *  Return COM port of attached device. Prompt user to choose when multiple devices are found.
	 */
  async function getDevicePort() {
		let comPortList = await serialport.SerialPort.list()

		return new Promise((resolve, reject) => {
			if (comPortList == null || comPortList.length == 0) {
				resolve('auto')  // detection failed but maybe esptool can still figure it out
			}
			else if (comPortList.length == 1) {
				resolve(comPortList[0].path)
			}
			else {
  			let portSelectionList = comPortList.map(port => {
					return {
            label: port.path,
						detail: port.friendlyName
					}
			  })
				console.debug('Attached devices:', comPortList)
				let options = {
					title: 'Select device',
					canSelectMany: false,
					matchOnDetail: true
				}
				vscode.window.showQuickPick(portSelectionList, options)
				.then(choice => {
  				resolve(choice.label)
			  })
			}	
		})
	}

	// chip_id is useful for identifying boards
	let chipIdCommand = vscode.commands.registerCommand('esptool.chip_id', async () => {
		let port = await getDevicePort()
		term.sendText(`${PYTHON_BIN} -m esptool --chip auto --port ${port} chip_id`)
	})

	context.subscriptions.push(chipIdCommand);

	// flash_id is useful for determining flash memory size
	let flashIdCommand = vscode.commands.registerCommand('esptool.flash_id', async () => {
		let port = await getDevicePort()
		term.sendText(`${PYTHON_BIN} -m esptool --chip auto --port ${port} flash_id`)
	})

	context.subscriptions.push(flashIdCommand);

	// erase_flash is somewhat redundant, because it's also included as a step prior to write_flash
	let eraseFlashCommand = vscode.commands.registerCommand('esptool.erase_flash', async () => {
		let port = await getDevicePort()
		vscode.window.showInformationMessage(`Erase flash memory of ESP microcontroller on ${port}?`, 'Erase', 'Cancel')
			.then(selection => {
				if (selection === 'Erase') {
					term.sendText(`${PYTHON_BIN} -m esptool --chip auto --port ${port} erase_flash`)
				}
			})
	})

	context.subscriptions.push(eraseFlashCommand);

	// Let user select flash image with a dialog box
	let writeFlashCommand = vscode.commands.registerCommand('esptool.write_flash', async () => {
		let port = await getDevicePort()
		const options = {
			canSelectMany: false,
			title: 'Select firmware image',
			filters: {
				'Binary images': ['bin'],
				'All files': ['*']
			}
		}
		vscode.window.showOpenDialog(options)
			.then(firmwareUri => {
				if (firmwareUri && firmwareUri[0]) {
					console.debug('Selected file: ' + firmwareUri[0].fsPath)
					let options = {
						title: 'Select flash offset address',
						canSelectMany: false,
						matchOnDetail: true
					}
					let addresses = [
						{
							label: "Offset address = 0x0",
							detail: "Recommended for ESP8266, ESP32-C3, ESP32-S3"
						},
						{
							label: "Offset address = 0x1000",
							detail: "Recommended for ESP32, ESP32-S2"
						}
					]
					vscode.window.showQuickPick(addresses, options)
					.then(choice => {
						vscode.window.showInformationMessage(`Overwrite ESP microcontroller on ${port} with new firmware image: ${path.basename(firmwareUri[0].fsPath)}?`, 'Overwrite', 'Cancel')
						.then(selection => {
							if (selection === 'Overwrite') {
								let address = choice.label
								term.sendText(`${PYTHON_BIN} -m esptool --chip auto --port ${port} write_flash --erase-all --flash_size=detect ${address} ${firmwareUri[0].fsPath}`)
							}
						})
					})
				}
			})
	})

	context.subscriptions.push(writeFlashCommand);
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}
