declare module 'oracledb' {
    export const OUT_FORMAT_OBJECT: number;
    export interface Connection {
        execute(sql: string, binds?: any, options?: any): Promise<any>;
        close(): Promise<void>;
    }
    export interface ConnectionAttributes {
        user?: string;
        password?: string;
        connectString?: string;
    }
    export function getConnection(config: ConnectionAttributes): Promise<Connection>;
}
