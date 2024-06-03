import { CGAccess } from './CGAccess';
import { CGHelper } from './CGHelper';
import { CGMethod } from './CGMethod';
import { CGProperty } from './CGProperty';
import { ICGGenerator } from './ICGGenerator';
import { StringBuilder } from './StringBuilder';

export class CGClass implements ICGGenerator {
    public Comment: string = "";
    public Access: CGAccess = CGAccess.public;
    public Name: string = "";
    public InheritClassName: string = "";
    public Export: boolean = false;
    public ExportAsDefault: boolean = false;
    private mImplementInterfaces: string[] = [];
    private mProperties: CGProperty[] = [];

    public get Properties(): CGProperty[] {
        return this.mProperties;
    }

    private mMethods: CGMethod[] = [];

    public AddImplementInterface(implInterface: string): void {
        this.mImplementInterfaces.push(implInterface);
    }

    public AddProperty(property: CGProperty): void {
        this.mProperties.push(property);
    }

    public AddMethod(method: CGMethod): void {
        this.mMethods.push(method);
    }

    public WriteTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.Comment && this.Comment.trim().length > 0) {
            writer.appendLine(CGHelper.GetComment(this.Comment, tab));
        }

        // 声明
        writer.append(
            CGHelper.GetClassDeclaration(
                tab,
                this.Name,
                this.InheritClassName,
                this.mImplementInterfaces,
                this.Export,
                this.ExportAsDefault
            )
        );
        CGHelper.BeginCodeBlock(writer);

        if (this.mProperties.length > 0) {
            // 属性
            CGHelper.BeginRegion(writer, 'Properties', tab + 1);
            for (const p of this.mProperties) {
                p.WriteTo(writer, tab + 1);
            }
            CGHelper.EndRegion(writer, tab + 1);

            if (this.mMethods.length > 0) {
                writer.appendLine();
            }
        }

        // 方法
        if (this.mMethods.length > 0) {
            CGHelper.BeginRegion(writer, 'Methods', tab + 1);
            for (const m of this.mMethods) {
                m.WriteTo(writer, tab + 1);
            }
            CGHelper.EndRegion(writer, tab + 1);
        }

        CGHelper.EndCodeBlock(writer, tab);
    }
}

