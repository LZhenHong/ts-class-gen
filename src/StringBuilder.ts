export class StringBuilder {
    private _strings: string[];

    get length(): number {
        return this.toString().length;
    }

    constructor(initialString?: string) {
        this._strings = initialString ? [initialString] : [];
    }

    append(text: string): StringBuilder {
        this._strings.push(text);
        return this;
    }

    appendLine(text: string = ""): StringBuilder {
        this._strings.push(text + '\n');
        return this;
    }

    toString(): string {
        return this._strings.join('');
    }

    clear(): void {
        this._strings = [];
    }
}
