"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevicePort = void 0;
const vscode = require("vscode");
const serialport_1 = require("serialport");
async function getDevicePort() {
    let portList = await serialport_1.SerialPort.list();
    return new Promise((resolve, reject) => {
        if (portList.length === 0) {
            console.debug('No device found on any port.');
            reject('No device detected.');
        }
        else if (portList.length === 1) {
            console.debug('Using device on port:', portList[0]);
            resolve(portList[0].path);
        }
        else {
            let portSelectionList = portList.map(port => {
                return {
                    label: port.path,
                    // @ts-ignore Silence mistaken idea that friendlyName does not exist.
                    detail: port.friendlyName
                };
            });
            let options = {
                title: 'Select device',
                canSelectMany: false,
                matchOnDetail: true
            };
            vscode.window.showQuickPick(portSelectionList, options)
                .then(choice => {
                if (choice !== undefined) {
                    console.debug('Using device on port:', choice);
                    resolve(choice.label);
                }
                else {
                    reject(undefined);
                }
            });
        }
    });
}
exports.getDevicePort = getDevicePort;
//# sourceMappingURL=utility.js.map