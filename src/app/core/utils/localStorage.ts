export class LocalStorage {
    static setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value))
    }
    static getItem(key: string): any {
        const item = localStorage.getItem(key) ?? "Null"
        return JSON.parse(item)
    }
}