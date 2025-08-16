import { CGAccess } from "./CGAccess";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";

export class CGProperty implements ICGGenerator {
    // Comment
    public comment: string = '';
    // Access modifier
    public access: CGAccess = CGAccess.public;
    // Whether it's static
    public isStatic: boolean = false;
    // Property type string
    public type: string = 'any';
    // Property name
    public name: string = '';
    // Default value
    public defaultValue: string = '';

    public writeTo(writer: StringBuilder, tab: number = 0): void {
        // Comment
        if (this.comment && this.comment.trim().length > 0) {
            writer.appendLine(CGHelper.getComment(this.comment, tab));
        }

        // Declaration
        const type = this.type || 'any';
        writer.appendLine(CGHelper.getPropertyDeclaration(tab, this.access, type, this.name, this.defaultValue, this.isStatic));
    }
}
