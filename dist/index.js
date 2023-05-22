"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeJasperSt = void 0;
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const InvalidInputFile_1 = require("./errors/InvalidInputFile");
const InvalidFormat_1 = require("./errors/InvalidFormat");
const InvalidCommandExecutable_1 = require("./errors/InvalidCommandExecutable");
const InvalidResourceDirectory_1 = require("./errors/InvalidResourceDirectory");
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
    async compile(input, output = '') {
        const stats = await promises_1.default.stat(input);
        if (!stats.isFile()) {
            throw new InvalidInputFile_1.InvalidInputFile();
        }
        this.checkServer();
        this.command += ' compile ';
        this.command += '"' + path_1.default.resolve(input) + '"';
        if (output) {
            this.command += ' -o ' + `"${path_1.default.resolve(output)}"`;
        }
        return this;
    }
    parseProcessOptions(options) {
        const defaultOptions = {
            'format': ['pdf'],
            'params': {},
            'resources': false,
            'locale': false,
            'db_connection': {},
        };
        return Object.assign(Object.assign({}, defaultOptions), options);
    }
    validateFormat(format) {
        if (!(format instanceof Array)) {
            format = [format];
        }
        for (let value of format) {
            if (this.formats.indexOf(value) === -1) {
                throw new InvalidFormat_1.InvalidFormat();
            }
        }
    }
    process(input, output, options = {}) {
        options = this.parseProcessOptions(options);
        if (!input) {
            throw new InvalidInputFile_1.InvalidInputFile();
        }
        this.validateFormat(options.format);
        const format = options.format;
        this.command = this.checkServer();
        if (options.locale) {
            this.command += ` --locale ${options.locale}`;
        }
        this.command += ' process ';
        this.command += `"${path_1.default.resolve(input)}"`;
        this.command += ' -o ' + `"${path_1.default.resolve(output)}"`;
        this.command += ' -f ' + format.join(' ');
        const params = options.params;
        if (Object.keys(params).length > 0) {
            this.command += ' -P ';
            for (let key in params) {
                this.command += " " + key + '="' + params[key] + '" ' + " ";
            }
        }
        const db_connection = options.db_connection;
        if (Object.keys(db_connection).length > 0) {
            const mapDbParams = {
                'driver': '-t',
                'username': '-u',
                'password': '-p',
                'host': '-H',
                'database': '-n',
                'port': '--db-port',
                'jdbc_driver': '--db-driver',
                'jdbc_url': '--db-url',
                'jdbc_dir': '--jdbc-dir',
                'db_sid': '--db-sid',
                'xml_xpath': '--xml-xpath',
                'data_file': '--data-file',
                'json_query': '--json-query',
            };
            for (let key in db_connection) {
                this.command += ` ${mapDbParams[key]} ${db_connection[key]}`;
            }
        }
        if (options.resources) {
            this.command += ` -r ${options.resources}`;
        }
        return this;
    }
    async validateExecute() {
        if (!this.command) {
            throw new InvalidCommandExecutable_1.InvalidCommandExecutable();
        }
        const stats = await promises_1.default.stat(this.pathExecutable);
        if (!stats.isDirectory()) {
            throw new InvalidResourceDirectory_1.InvalidResourceDirectory();
        }
    }
    addUserToCommand($user) {
        if ($user && !this.windows) {
            this.command = 'su -u ' + $user + " -c " + `"${this.command}"`;
        }
    }
    execute(user = '') {
        return new Promise(async (resolve, reject) => {
            await this.validateExecute();
            this.addUserToCommand(user);
            (0, child_process_1.exec)(this.command, (error, stdout, stderr) => {
                if (error) {
                    return reject(new Error(stderr));
                }
                resolve(stdout);
            });
        });
    }
    output() {
        return this.command;
    }
    printOutput() {
        return this.command + "\n";
    }
}
exports.NodeJasperSt = NodeJasperSt;
