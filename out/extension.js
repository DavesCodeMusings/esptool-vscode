"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path_1 = require("path");
const esptool_1 = require("./esptool");
const utility_1 = require("./utility");
async function activate(context) {
    let esptool = new esptool_1.ESPTool();
    /*
     *  Run 'esptool chip_id' to show detail about the microcontroller's system on chip.
     */
    context.subscriptions.push(vscode.commands.registerCommand('esptool.chip_id', async (args) => {
        let port = '';
        if (args === undefined || args.label === undefined) {
            port = await (0, utility_1.getDevicePort)();
        }
        else {
            port = args.label;
        }
        esptool.chipId(port);
    }));
    /*
     *  Run 'esptool erase_flash' to clear the microcotroller's flash ram.
     */
    context.subscriptions.push(vscode.commands.registerCommand('esptool.erase_flash', async (args) => {
        let port = '';
        if (args === undefined || args.label === undefined) {
            port = await (0, utility_1.getDevicePort)();
        }
        else {
            port = args.label;
        }
        vscode.window.showInformationMessage(`Erase flash memory of ESP microcontroller on ${port}?`, 'Erase', 'Cancel')
            .then(selection => {
            if (selection === 'Erase') {
                esptool.eraseFlash(port);
            }
        });
    }));
    /*
     *  Run 'esptool flash_id' to show detail about the microcontroller's flash ram.
     */
    context.subscriptions.push(vscode.commands.registerCommand('esptool.flash_id', async (args) => {
        let port = '';
        if (args === undefined || args.label === undefined) {
            port = await (0, utility_1.getDevicePort)();
        }
        else {
            port = args.label;
        }
        esptool.flashId(port);
    }));
    /*
     *  Run 'esptool write_flash' to write firmware to the microcotroller.
     */
    context.subscriptions.push(vscode.commands.registerCommand('esptool.write_flash', async (args) => {
        let port = '';
        if (args === undefined || args.label === undefined) {
            port = await (0, utility_1.getDevicePort)();
        }
        else {
            port = args.label;
        }
        const options = {
            canSelectMany: false,
            title: 'Select firmware image',
            filters: {
                // Silence complaints about not being camelCase.
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Binary images': ['bin'],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'All files': ['*']
            }
        };
        vscode.window.showOpenDialog(options)
            .then(firmwareUri => {
            if (firmwareUri && firmwareUri[0]) {
                console.debug('Selected file: ' + firmwareUri[0].fsPath);
                let options = {
                    title: 'Select flash offset address',
                    canSelectMany: false,
                    matchOnDetail: true
                };
                let addresses = [
                    {
                        label: "0x0",
                        description: "offset address",
                        detail: "Recommended for ESP8266, ESP32-C3, ESP32-S3"
                    },
                    {
                        label: "0x1000",
                        description: "offset address",
                        detail: "Recommended for ESP32, ESP32-S2"
                    }
                ];
                vscode.window.showQuickPick(addresses, options)
                    .then(choice => {
                    if (choice) {
                        vscode.window.showInformationMessage(`Overwrite ESP microcontroller on ${port} with new firmware image: ${(0, path_1.basename)(firmwareUri[0].fsPath)}?`, 'Overwrite', 'Cancel')
                            .then(selection => {
                            if (selection === 'Overwrite') {
                                let address = choice.label;
                                esptool.writeFlash(port, address, firmwareUri[0].fsPath);
                            }
                        });
                    }
                });
            }
        });
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map