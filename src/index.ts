import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

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
    this.pathJava = path.join(JRE, 'bin', 'java')
    this.executable = `jasperstarter.jar`
    this.pathExecutable = path.join(__dirname, '..', 'jasperstarter', 'lib');
  }

  protected createPathExe() {
    return `${this.pathJava} -jar ${path.join(this.pathExecutable, this.executable)}`
  }

  public checkServer() {
    return this.command = this.createPathExe()
  }

  protected validateExecute() {
    if (!this.command) {
      throw new Error('INVALID_COMMAND_EXECUTABLE')
    }

    const stats = fs.statSync(this.pathExecutable)
    if (!stats.isDirectory()) {
      throw new Error('INVALID_RESOURCE_DIRECTORY')
    }
  }

  public execute(user = false): Promise<any> {
    return new Promise((resolve, reject) => {
      this.validateExecute()
      //this.addUserToCommand(user)

      exec(this.command, (error, stdout, stderr) => {
        if (error) {
          return reject(new Error(stderr));
        }

        resolve(stdout);
      })
    })
  }
} 