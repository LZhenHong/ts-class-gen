export class StringBuilder {
    private _strings: string[];

    get Length(): number {
        return this.ToString().length;
    }

    constructor(initialString?: string) {
        this._strings = initialString ? [initialString] : [];
    }

    Append(text: string): StringBuilder {
        this._strings.push(text);
        return this;
    }

    AppendLine(text: string = ""): StringBuilder {
        this._strings.push(text + '\n');
        return this;
    }

    ToString(): string {
        return this._strings.join('');
    }

    Clear(): void {
        this._strings = [];
    }
}
