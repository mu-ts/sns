export interface Configurations {
    get(name: string, someDefault?: any): Promise<any | undefined>;
    getAsBoolean(name: string, someDefault?: boolean): Promise<boolean>;
    getAsNumber(name: string, someDefault?: number): Promise<number | undefined>;
    getAsString(name: string, someDefault?: string): Promise<string | undefined>;
}
