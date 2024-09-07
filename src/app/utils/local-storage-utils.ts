export class LocalStorage {
    static setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value))
    }

    static getItem<T>(key: string): T | null {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    }

    static deleteItem(key: string): void {
        localStorage.removeItem(key)
    }
}