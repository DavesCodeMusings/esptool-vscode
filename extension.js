const vscode = require('vscode')
const childProcess = require('child_process')
const path = require('path')

/**
 * Check for Python prerequisites and register commands.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Python and the esptool module must be installed for this to work.
	try {
		let pythonVersion = childProcess.execSync('py --version').toString().split('\r\n')[0].split(' ')[1]
		console.debug('Python version:', pythonVersion)
	}
	catch (ex) {
		vscode.window.showErrorMessage('Python is not installed or could not be run as py.exe', ex)
	}

	try {
		let esptoolVersion = childProcess.execSync('py -m esptool version').toString().split('\r\n')[1]
		console.debug('esptool version:', esptoolVersion)
	}
	catch (ex) {
		vscode.window.showErrorMessage('esptool is not installed or could not be run as a Python module')
	}

	// All commands are run in the integrated terminal so output is visible.
	const term = vscode.window.createTerminal('esptool')
	term.show(false)

	// chip_id is useful for identifying boards
	let chipIdCommand = vscode.commands.registerCommand('esptool.chip_id', () => {
		term.sendText('py.exe -m esptool --chip auto chip_id')
	})

	context.subscriptions.push(chipIdCommand);

	// chip_id is useful for identifying boards
	let flashIdCommand = vscode.commands.registerCommand('esptool.flash_id', () => {
		term.sendText('py.exe -m esptool --chip auto flash_id')
	})

	context.subscriptions.push(flashIdCommand);

	// erase_flash is somewhat redundant, because it's also included as a step prior to writing
	let eraseFlashCommand = vscode.commands.registerCommand('esptool.erase_flash', () => {
		vscode.window.showInformationMessage(`Erase flash memory?`, 'Erase', 'Cancel')
			.then(selection => {
				if (selection === 'Erase') {
					term.sendText('py.exe -m esptool --chip auto erase_flash')
				}
			})
	})

	context.subscriptions.push(eraseFlashCommand);

	// Let user select flash image with a dialog box
	let writeFlashCommand = vscode.commands.registerCommand('esptool.write_flash', () => {
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
					console.log('Selected file: ' + firmwareUri[0].fsPath)
					vscode.window.showInformationMessage(`Erase flash and overwrite with new image: ${path.basename(firmwareUri[0].fsPath)}?`, 'Overwrite', 'Cancel')
						.then(selection => {
							if (selection === 'Overwrite') {
								term.sendText(`py.exe -m esptool --chip auto write_flash --erase-all --flash_size=detect 0 ${firmwareUri[0].fsPath}`)
							}
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
