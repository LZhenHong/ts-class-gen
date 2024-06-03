export class StringBuilder {
    private _strings: string[];

    // Get the length of the StringBuilder content
    get length(): number {
        return this.toString().length;
    }

    constructor(initialString?: string) {
        this._strings = initialString ? [initialString] : [];
    }

    // Append a string to the StringBuilder
    append(text: string): StringBuilder {
        this._strings.push(text);
        return this;
    }

    // Append a line to the StringBuilder
    appendLine(text: string = ""): StringBuilder {
        this._strings.push(text + '\n');
        return this;
    }

    // Convert the StringBuilder to a string
    toString(): string {
        return this._strings.join('');
    }

    // Clear the StringBuilder
    clear(): void {
        this._strings = [];
    }
}
