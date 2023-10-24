# Time-manager

Small command-line tool to track work on a project.

## Installation

 - Clone repo
 - `npm install`
 - `npm run build`

## Usage

Start CLI: `npm run precompiled`

## Configuration

See `src/config.ts`.  
After changing configuration, rebuild with `npm run build`.  

Unless you are running linux with `nautilus` installed, the `fileBrowser` property must be changed for the `Open folder containing files`
feature to work. 
(On windows presumably to `explorer.exe`, on linux to whatever file browser you use)

## TODO features:

- Log viewing
- Add option to print out to excel

