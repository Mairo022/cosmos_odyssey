export function isOutdated(datetime: string | Date, maxAge: number): boolean {
    return new Date(datetime).getTime() - new Date().getTime() < maxAge
}
