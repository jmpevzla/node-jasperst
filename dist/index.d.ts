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
export declare class NodeJasperSt {
    protected command: string;
    protected pathJava: string;
    protected executable: string;
    protected pathExecutable: string;
    protected windows: boolean;
    protected formats: string[];
    /**
     * NodeJasperSt contructor
     */
    constructor(JRE?: string);
    protected createPathExe(): string;
    checkServer(): string;
    compile(input: string, output?: string): Promise<this>;
    protected parseProcessOptions(options: Record<string, any>): {
        format: string[];
        params: {};
        resources: boolean;
        locale: boolean;
        db_connection: {};
    };
    protected validateFormat(format: string | string[]): void;
    process(input: string, output: string, options?: Options): this;
    protected validateExecute(): Promise<void>;
    protected addUserToCommand($user: string): void;
    execute(user?: string): Promise<string>;
    output(): string;
    printOutput(): string;
}
