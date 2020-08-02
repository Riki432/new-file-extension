'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const util_1 = require("util");
function activate(context) {
    const headerFunc = vscode.commands.registerCommand('extension.newfile', async function () {
        const window = vscode.window;
        if (vscode.workspace.workspaceFolders) {
            const folder = vscode.workspace.workspaceFolders[0].uri.fsPath;
            let userName = vscode.workspace.getConfiguration().get('userName');
            if (!userName) {
                userName = await vscode.window.showInputBox({
                    placeHolder: "Please enter your full name."
                });
                if (userName)
                    vscode.workspace.getConfiguration().update('userName', userName);
            }
            const fileID = await vscode.window.showInputBox({
                placeHolder: 'Please enter the ID of the new file.'
            });
            if (!fileID) {
                window.showInformationMessage('No file ID given.');
                return;
            }
            let fileName = await vscode.window.showInputBox({
                placeHolder: 'Please enter the name of the file.'
            });
            if (!fileName) {
                window.showInformationMessage('No filename selected');
                return;
            }
            fileName = fileName.split(" ").join('');
            const objects = vscode.workspace.getConfiguration().get("objectTypes") || {};
            const descriptionTemplates = vscode.workspace.getConfiguration().get("descriptionTemplates") || {};
            const fileType = await vscode.window.showQuickPick(Object.keys(objects), {
                canPickMany: false,
                placeHolder: 'Please select the page type.'
            });
            if (!fileType) {
                window.showInformationMessage('No filetype selected.');
                return;
            }
            if (fileID && fileType && fileName) {
                const fileTitle = `CFS_${fileName === null || fileName === void 0 ? void 0 : fileName.toUpperCase()}-${objects[fileType]}-${fileID}`;
                const description = descriptionTemplates[fileType];
                fs.writeFile(folder + `\\${fileTitle}.al`, getHeader(fileTitle, `${userName}`, description.replace(/\$\{name\}/g, fileName)), (_) => console.log('Done with file.'));
            }
        }
        else {
            window.showInformationMessage('No workspace available.');
        }
    });
    context.subscriptions.push(headerFunc);
}
exports.activate = activate;
function getMonthText(no) {
    switch (no) {
        case 1:
            return 'January';
        case 2:
            return 'February';
        case 3:
            return 'March';
        case 4:
            return 'April';
        case 5:
            return 'May';
        case 6:
            return 'June';
        case 7:
            return 'July';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'October';
        case 11:
            return 'Novemeber';
        case 12:
            return 'December';
        default:
            return '';
    }
}
function getHeader(filename, userName, description) {
    const now = new Date();
    const month = now.getMonth() < 10 ? `0${now.getMonth()}` : `${now.getMonth()}`;
    const day = now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`;
    const configs = vscode.workspace.getConfiguration();
    const data = configs.get('headerText');
    if (util_1.isArray(data)) {
        let template = data.join('\n');
        template = template.replace(/\$\{filename\}/g, filename);
        template = template.replace(/\$\{day\}/g, day);
        template = template.replace(/\$\{month\}/g, month);
        template = template.replace(/\$\{monthText\}/g, getMonthText(now.getMonth()));
        template = template.replace(/\$\{year\}/g, `${now.getFullYear()}`);
        template = template.replace(/\$\{userName\}/g, userName);
        template = template.replace(/\$\{description\}/g, description);
        return template;
    }
    return '';
}
//# sourceMappingURL=extension.js.map