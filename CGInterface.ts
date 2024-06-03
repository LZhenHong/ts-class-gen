import { CGHelper } from "./CGHelper";
import { CGProperty } from "./CGProperty";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";

export class CGInterface implements ICGGenerator {
    public Comment: string = "";
    public Name: string = "";
    public Export: boolean = false;

    private mProperties: CGProperty[] = [];

    public AddProperty(property: CGProperty): void {
        this.mProperties.push(property);
    }

    public WriteTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.Comment && this.Comment.trim().length > 0) {
            writer.appendLine(CGHelper.GetComment(this.Comment, tab));
        }

        // 声明
        writer.append(CGHelper.GetInterfaceDeclaration(tab, this.Name, this.Export));
        CGHelper.BeginCodeBlock(writer);

        if (this.mProperties.length > 0) {
            for (const p of this.mProperties) {
                p.WriteTo(writer, tab + 1);
            }
        }

        CGHelper.EndCodeBlock(writer, tab);
    }
}
