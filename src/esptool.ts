import * as vscode from 'vscode';
import { execSync } from 'child_process';

export class ESPTool {
    terminal;
    pythonBinary = 'py.exe';  // Assume this is a Windows system for now.

    constructor() {
        // Try to reuse mpremote terminal for a more integrated look and feel.
        let mpremoteTerminal = vscode.window.terminals.find(obj => {
            return obj.name === 'mpremote';
        });
        if (mpremoteTerminal) {
            this.terminal = mpremoteTerminal;
        }
        else {
            this.terminal = vscode.window.createTerminal('esptool');
            this.terminal.show(false);  // false here lets the mpremote terminal take focus on startup
        }
        console.debug('Using terminal:', this.terminal.name);

        console.debug('Operating System:', process.platform);
        if (process.platform !== 'win32') {  // win32 is returned for 64-bit OS as well
            this.pythonBinary = 'python3';
        }
        console.debug('Using Python executable:', this.pythonBinary);

        if (vscode.workspace.getConfiguration('esptool').startupCheck.skip === false) {
            // Python and the esptool module must be installed for this to work.
            try {
                let pythonVersion = execSync(`${this.pythonBinary} --version`).toString().split('\r\n')[0].split(' ')[1];
                console.debug('Python version:', pythonVersion);
            }
            catch (ex) {
                vscode.window.showErrorMessage(`Python is not installed or could not be run as ${this.pythonBinary}`);
            }

            try {
                let esptoolVersion = execSync(`${this.pythonBinary} -m esptool version`).toString().split('\r\n')[0].split(' ')[1];
                console.debug('esptool version:', esptoolVersion);
            }
            catch (ex) {
                vscode.window.showErrorMessage('esptool is not installed or could not be run as a Python module');
            }
        }
    }

    chipId(port: string) {
        if (port) {
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} chip_id`);
        }
    }

    eraseFlash(port: string) {
        if (port) {
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} erase_flash`);
        }
    }

    flashId(port: string) {
        if (port) {
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} flash_id`);
        }
    }

    writeFlash(port: string, address: string, image: string) {
        if (port) {
            console.debug('write_flash', address, image);
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} write_flash --erase-all --flash_size=detect ${address} ${image}`);
        }
    }
}