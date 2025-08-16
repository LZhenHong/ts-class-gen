import { CGAccess } from "./CGAccess";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";
import { CGParameter } from "./CGParameter";

export class CGMethod implements ICGGenerator {
    // Comment
    public comment: string = '';
    // Access modifier
    public access: CGAccess = CGAccess.public;
    // Whether it's a static method
    public isStatic: boolean = false;
    // Whether it's a readonly method
    public isReadonly: boolean = false;
    // Return type string
    public returnType: string = 'void';
    // Method name
    public name: string = '';
    // Parameters
    private parameters: CGParameter[] = [];
    // Method body code
    private bodyCodes: string[] = [];

    public appendCodes(...codes: string[]): void {
        this.bodyCodes.push(...codes);
    }

    public addParameters(...parameters: CGParameter[]): void {
        this.parameters.push(...parameters);
    }

    public writeTo(writer: StringBuilder, tab: number = 0): void {
        // Comment
        if (this.comment && this.comment.trim().length > 0) {
            writer.appendLine(CGHelper.getComment(this.comment, tab));
        }

        // Declaration
        const type = this.returnType || "void";
        writer.append(CGHelper.getMethodDeclaration(tab, this.access, type, this.name, this.isStatic, this.parameters.map(p => p.toString()), this.isReadonly));

        // Method body
        CGHelper.beginCodeBlock(writer);
        this.bodyCodes.forEach(code => writer.appendLine(`${CGHelper.tab(tab + 1)}${code}`));
        CGHelper.endCodeBlock(writer, tab);
    }
}
