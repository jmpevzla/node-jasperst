import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { InvalidInputFile } from './errors/InvalidInputFile';
import { InvalidFormat } from './errors/InvalidFormat';
import { InvalidCommandExecutable } from './errors/InvalidCommandExecutable';
import { InvalidResourceDirectory } from './errors/InvalidResourceDirectory';

export interface DBConnection {
  driver?: 'json' | 'xml' | 'postgres' | 'mysql' | 'generic';
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
  jdbc_driver?: string;
  jdbc_url?: string;
  jdbc_dir?: string;
  data_file?: string;
  json_query?: string;
  [key: string]: string | undefined;
}

export interface Options {
  format?: string | string[];
  params?: Record<string, string>;
  resources?: string | boolean;
  locale?: string | boolean;
  db_connection?: DBConnection;
}

export class NodeJasperSt {

  protected command: string = '';
  protected pathJava: string = '';
  protected executable: string = '';
  protected pathExecutable: string = '';
  protected windows: boolean = false;
  protected formats: string[] = [
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

  /**
   * NodeJasperSt contructor
   */
  constructor(JRE = process.env.JRE || '') {
    this.pathJava = path.join(JRE, 'bin', 'java');
    this.executable = `jasperstarter.jar`;
    this.pathExecutable = path.join(__dirname, '..', 'jasperstarter', 'lib');
  }

  protected createPathExe() {
    return `${this.pathJava} -jar ${path.join(this.pathExecutable, this.executable)}`;
  }

  public checkServer() {
    return this.command = this.createPathExe();
  }

  public async compile(input: string, output: string = '') {
    const stats = await fs.stat(input);
    if (!stats.isFile()) {
      throw new InvalidInputFile();
    }

    this.checkServer();
    this.command += ' compile ';
    this.command += '"' + path.resolve(input) + '"';

    if (output) {
        this.command += ' -o ' +  `"${path.resolve(output)}"`;
    }

    return this;
  }

  protected parseProcessOptions(options: Record<string, any>)
  {
    const defaultOptions = {
        'format': ['pdf'],
        'params': {},
        'resources': false,
        'locale': false,
        'db_connection': {},
    };

    return { ...defaultOptions, ...options };
  }

  protected validateFormat(format: string | string[])
  {
    if (!(format instanceof Array)) {
      format = [format];
    }

    for(let value of format) {
      if (this.formats.indexOf(value) === -1) {
        throw new InvalidFormat();
      }
    }
  }

  public process(input: string, output: string, options: Options = {})
  {
    options = this.parseProcessOptions(options);

    if (!input) {
      throw new InvalidInputFile();
    }

    this.validateFormat(options.format!);

    const format: string[] = options.format! as string[];
    this.command = this.checkServer();

    if (options.locale) {
      this.command += ` --locale ${options.locale}`;
    }

    this.command += ' process ';
    this.command += `"${path.resolve(input)}"`;
    this.command += ' -o ' + `"${path.resolve(output)}"`;

    this.command += ' -f ' + format.join(' '); 
    const params = options.params!;
    if (Object.keys(params).length > 0) {
      this.command += ' -P ';
      for(let key in params) {
        this.command += " " + key + '="' + params[key] + '" ' + " ";
      }
    }

    const db_connection = options.db_connection!;
    if (Object.keys(db_connection).length > 0) {
      
      const mapDbParams: Record<string, string> = {
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

      for(let key in db_connection) {
        this.command += ` ${mapDbParams[key]} ${db_connection[key]}`;
      }
    }

    if (options.resources) {
      this.command += ` -r ${options.resources}`;
    }

    return this;
  }

  protected async validateExecute() {
    if (!this.command) {
      throw new InvalidCommandExecutable();
    }

    const stats = await fs.stat(this.pathExecutable);
    if (!stats.isDirectory()) {
      throw new InvalidResourceDirectory();
    }
  }

  protected addUserToCommand($user: string)
  {
    if ($user && !this.windows) {
      this.command = 'su -u ' + $user + " -c " + `"${this.command}"`;
    }
  }

  public execute(user: string = ''): Promise<string> {
    return new Promise(async (resolve, reject) => {
      await this.validateExecute();
      this.addUserToCommand(user);

      exec(this.command, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(stderr));
        }

        resolve(stdout);
      });
    });
  }

  public output()
  {
    return this.command;
  }

  public printOutput()
  {
    return this.command + "\n";
  }
} 