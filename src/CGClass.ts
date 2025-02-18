import { CGAccess } from "./CGAccess";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";
import { CGMethod } from "./CGMethod";
import { CGProperty } from "./CGProperty";

export class CGClass implements ICGGenerator {
    public comment: string = "";
    public access: CGAccess = CGAccess.public;
    public name: string = "";
    public inheritClassName: string = "";
    public isExport: boolean = false;
    public isExportAsDefault: boolean = false;

    private classDecorators: string[] = [];
    private implementInterfaces: string[] = [];
    private properties: CGProperty[] = [];
    private methods: CGMethod[] = [];

    public addDecorator(decorator: string): void {
        this.classDecorators.push(decorator);
    }

    public addImplementInterface(implInterface: string): void {
        this.implementInterfaces.push(implInterface);
    }

    public addProperty(property: CGProperty): void {
        this.properties.push(property);
    }

    public addMethod(method: CGMethod): void {
        this.methods.push(method);
    }

    public writeTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.comment && this.comment.trim().length > 0) {
            writer.appendLine(CGHelper.getComment(this.comment, tab));
        }

        // 类装饰器
        this.classDecorators.forEach(decorator => {
            writer.appendLine(CGHelper.getClassDecorator(decorator, tab));
        });

        // 声明
        writer.append(
            CGHelper.getClassDeclaration(
                tab,
                this.name,
                this.inheritClassName,
                this.implementInterfaces,
                this.isExport,
                this.isExportAsDefault
            )
        );
        CGHelper.beginCodeBlock(writer);

        if (this.properties.length > 0) {
            // 属性
            CGHelper.beginRegion(writer, 'Properties', tab + 1);
            for (const p of this.properties) {
                p.writeTo(writer, tab + 1);
            }
            CGHelper.endRegion(writer, tab + 1);

            if (this.methods.length > 0) {
                writer.appendLine();
            }
        }

        // 方法
        if (this.methods.length > 0) {
            CGHelper.beginRegion(writer, 'Methods', tab + 1);
            for (const m of this.methods) {
                m.writeTo(writer, tab + 1);
            }
            CGHelper.endRegion(writer, tab + 1);
        }

        CGHelper.endCodeBlock(writer, tab);
    }
}
