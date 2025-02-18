import { CGAccess } from "./CGAccess";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";
import { CGParameter } from "./CGParameter";

export class CGMethod implements ICGGenerator {
    // 注释
    public comment: string = '';
    // 修饰词
    public access: CGAccess = CGAccess.public;
    // 是否是静态方法
    public isStatic: boolean = false;
    // 是否是只读方法
    public isReadonly: boolean = false;
    // 返回值类型字符串
    public returnType: string = 'void';
    // 方法名
    public name: string = '';
    // 参数
    private parameters: CGParameter[] = [];
    // 方法体代码
    private bodyCodes: string[] = [];

    public appendCodes(...codes: string[]): void {
        this.bodyCodes.push(...codes);
    }

    public addParameters(...parameters: CGParameter[]): void {
        this.parameters.push(...parameters);
    }

    public writeTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.comment && this.comment.trim().length > 0) {
            writer.appendLine(CGHelper.getComment(this.comment, tab));
        }

        // 声明
        const type = this.returnType || "void";
        writer.append(CGHelper.getMethodDeclaration(tab, this.access, type, this.name, this.isStatic, this.parameters.map(p => p.toString()), this.isReadonly));

        // 方法体
        CGHelper.beginCodeBlock(writer);
        this.bodyCodes.forEach(code => writer.appendLine(`${CGHelper.tab(tab + 1)}${code}`));
        CGHelper.endCodeBlock(writer, tab);
    }
}
