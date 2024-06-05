import { CGAccess } from "./CGAccess";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";

export class CGProperty implements ICGGenerator {
    // 注释
    public Comment: string = '';
    // 修饰词
    public Access: CGAccess = CGAccess.public;
    // 是否静态
    public Static: boolean = false;
    // 属性类型字符串
    public Type: string = 'any';
    // 属性名
    public Name: string = '';
    // 默认值
    public DefaultValue: string = '';

    public WriteTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.Comment && this.Comment.trim().length > 0) {
            writer.AppendLine(CGHelper.GetComment(this.Comment, tab));
        }

        // 声明
        const type = this.Type || 'any';
        writer.AppendLine(CGHelper.GetPropertyDeclaration(tab, this.Access, type, this.Name, this.DefaultValue, this.Static));
    }
}
