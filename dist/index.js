"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeJasperSt = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class NodeJasperSt {
    /**
     * NodeJasperSt contructor
     */
    constructor(JRE = process.env.JRE || '') {
        this.command = '';
        this.pathJava = '';
        this.executable = '';
        this.pathExecutable = '';
        this.windows = false;
        this.formats = [
            'pdf',
            'rtf',
            'xls',
            'xlsx',
            'docx',
            'odt',
            'ods',
            'pptx',
            'csv',
            'html',
            'xhtml',
            'xml',
            'jrprint'
        ];
        this.pathJava = path_1.default.join(JRE, 'bin', 'java');
        this.executable = `jasperstarter.jar`;
        this.pathExecutable = path_1.default.join(__dirname, '..', 'jasperstarter', 'lib');
    }
    createPathExe() {
        return `${this.pathJava} -jar ${path_1.default.join(this.pathExecutable, this.executable)}`;
    }
    checkServer() {
        return this.command = this.createPathExe();
    }
    validateExecute() {
        if (!this.command) {
            throw new Error('INVALID_COMMAND_EXECUTABLE');
        }
        const stats = fs_1.default.statSync(this.pathExecutable);
        if (!stats.isDirectory()) {
            throw new Error('INVALID_RESOURCE_DIRECTORY');
        }
    }
    execute(user = false) {
        return new Promise((resolve, reject) => {
            this.validateExecute();
            //this.addUserToCommand(user)
            (0, child_process_1.exec)(this.command, (error, stdout, stderr) => {
                if (error) {
                    return reject(new Error(stderr));
                }
                resolve(stdout);
            });
        });
    }
}
exports.NodeJasperSt = NodeJasperSt;
