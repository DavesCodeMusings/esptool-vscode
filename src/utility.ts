import * as vscode from 'vscode';
import { SerialPort } from 'serialport';

export async function getDevicePort(): Promise<string> {
    let portList = await SerialPort.list();
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
