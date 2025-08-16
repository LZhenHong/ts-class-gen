import { CGProperty } from "./CGProperty";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";

export class CGInterface implements ICGGenerator {
    public comment: string = "";
    public name: string = "";
    public isExport: boolean = false;
    public isExportAsDefault: boolean = false;

    private properties: CGProperty[] = [];

    public addProperty(property: CGProperty): void {
        this.properties.push(property);
    }

    public writeTo(writer: StringBuilder, tab: number = 0): void {
        // Comment
        if (this.comment && this.comment.trim().length > 0) {
            writer.appendLine(CGHelper.getComment(this.comment, tab));
        }

        // Declaration
        writer.append(CGHelper.getInterfaceDeclaration(tab, this.name, this.isExport, this.isExportAsDefault));
        CGHelper.beginCodeBlock(writer);

        if (this.properties.length > 0) {
            for (const p of this.properties) {
                p.writeTo(writer, tab + 1);
            }
        }

        CGHelper.endCodeBlock(writer, tab);
    }
}
