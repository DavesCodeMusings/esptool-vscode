"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESPTool = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
class ESPTool {
    constructor() {
        this.pythonBinary = 'py.exe'; // Assume this is a Windows system for now.
        this.terminal = vscode.window.createTerminal('esptool');
        this.terminal.show(false); // false here lets the mpremote terminal take focus on startup
        console.debug('Operating System:', process.platform);
        if (process.platform !== 'win32') { // win32 is returned for 64-bit OS as well
            this.pythonBinary = 'python';
        }
        // Python and the mpremote module must be installed for this to work.
        console.debug('Using Python executable:', this.pythonBinary);
        try {
            let pythonVersion = (0, child_process_1.execSync)(`${this.pythonBinary} --version`).toString().split('\r\n')[0].split(' ')[1];
            console.debug('Python version:', pythonVersion);
        }
        catch (ex) {
            vscode.window.showErrorMessage(`Python is not installed or could not be run as ${this.pythonBinary}`);
        }
        try {
            let esptoolVersion = (0, child_process_1.execSync)(`${this.pythonBinary} -m esptool version`).toString().split('\r\n')[0].split(' ')[1];
            console.debug('esptool version:', esptoolVersion);
        }
        catch (ex) {
            vscode.window.showErrorMessage('esptool is not installed or could not be run as a Python module');
        }
    }
    chipId(port) {
        if (port) {
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} chip_id`);
        }
    }
    eraseFlash(port) {
        if (port) {
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} erase_flash`);
        }
    }
    flashId(port) {
        if (port) {
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} flash_id`);
        }
    }
    writeFlash(port, address, image) {
        if (port) {
            console.debug('write_flash', address, image);
            this.terminal.sendText(`${this.pythonBinary} -m esptool --chip auto --port ${port} write_flash --erase-all --flash_size=detect ${address} ${image}`);
        }
    }
}
exports.ESPTool = ESPTool;
//# sourceMappingURL=esptool.js.map