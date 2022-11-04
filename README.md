# ESPTool
Command palette access to esptool for managing ESP microcontrollers.

## Features
The goal of this extension is giving easy access to some of esptool's
functionality from within VS Code.

Most notably, it makes common tasks like erasing and flashing firmware
a point and click operation rather than an exercise in remembering and
typing command-line options.

You can also query the system on chip and flash ram characteristics.

## Caveat
All operations use auto-detect for the COM port, ESP chip model, and
flash memory size. To avoid problems, you should have only one ESP
device plugged in when using this extension.

## Requirements
The host running this extension must have Python 3 installed as well
as the esptool module.

You can get Python from: https://www.python.org/downloads/

The esptool module can be installed with pip, like this:
`py -m pip install esptool`

## 1.0.0 Release Notes
Initial release.
