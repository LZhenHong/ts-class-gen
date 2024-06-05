import { CGAccess } from "./CGAccess";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";
import { CGParameter } from "./CGParameter";

export class CGMethod implements ICGGenerator {
    // 注释
    public Comment: string = '';
    // 修饰词
    public Access: CGAccess = CGAccess.public;
    // 是否是静态方法
    public Static: boolean = false;
    // 是否是只读方法
    public Readonly: boolean = false;
    // 返回值类型字符串
    public ReturnType: string = 'void';
    // 方法名
    public Name: string = '';
    // 参数
    private mParameters: CGParameter[] = [];
    // 方法体代码
    private mBodyCodes: string[] = [];

    public AppendCodes(...codes: string[]): void {
        this.mBodyCodes.push(...codes);
    }

    public AddParameters(...parameters: CGParameter[]): void {
        this.mParameters.push(...parameters);
    }

    public WriteTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.Comment && this.Comment.trim().length > 0) {
            writer.AppendLine(CGHelper.GetComment(this.Comment, tab));
        }

        // 声明
        const type = this.ReturnType || "void";
        writer.Append(CGHelper.GetMethodDeclaration(tab, this.Access, type, this.Name, this.Static, this.mParameters.map(p => p.ToString()), this.Readonly));

        // 方法体
        CGHelper.BeginCodeBlock(writer);
        this.mBodyCodes.forEach(code => writer.AppendLine(`${CGHelper.Tab(tab + 1)}${code}`));
        CGHelper.EndCodeBlock(writer, tab);
    }
}
