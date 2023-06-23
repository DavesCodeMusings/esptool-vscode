# ESPTool
Command palette access to esptool for managing ESP microcontrollers.

## Features
The goal of this extension is giving easy access to some of esptool's
functionality from within VS Code.

Most notably, it makes common tasks like erasing and flashing firmware
a point and click operation rather than an exercise in remembering and
typing command-line options.

You can also query the system on chip and flash ram characteristics.

## Requirements
The host running this extension must have Python 3 installed as well
as the esptool module.

You can get Python from: https://www.python.org/downloads/

The esptool module can be installed with pip, like this:
`py -m pip install esptool`

## Fatal error: failed to connect
If you get an error that looks like the following, press and hold the
BOOT (or FLASH) button on your ESP device when running the command.

```
A fatal error occurred: Failed to connect to Espressif device: Wrong
boot mode detected (0x13)! The chip needs to be in download mode.
```

You can read [more detail on GitHub](https://github.com/espressif/esptool/issues/741)
if you want, but the easiest workaround is to hold down the BOOT / FLASH
button on the ESP32 board.

## Release Notes

### 1.1.7
Share terminal with MPRemote extension when possible for more itegrated look and feel.

### 1.1.6
Add esptool commands to mpremote context menu when both extensions are installed.

### 1.1.5
Converted code to TypeScript.

### 1.1.4
Remove incompatible 'auto' fallback for port selection.

### 1.1.3
Prompt for flash address to account for different boards.

### 1.1.2
Fix 'invalid header' error after flashing.

### 1.1.1
Fix to use py.exe only on Windows and python on all other OS.

### 1.1.0
Added a device selection prompt for when multiple devices are attached.
