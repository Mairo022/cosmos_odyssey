if (!Array.prototype.isEmpty) {
    Array.prototype.isEmpty = function(): boolean {
        return this.length === 0
    }
}
