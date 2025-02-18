import { CGAccess } from "./CGAccess";
import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";

export class CGProperty implements ICGGenerator {
    // 注释
    public comment: string = '';
    // 修饰词
    public access: CGAccess = CGAccess.public;
    // 是否静态
    public isStatic: boolean = false;
    // 属性类型字符串
    public type: string = 'any';
    // 属性名
    public name: string = '';
    // 默认值
    public defaultValue: string = '';

    public writeTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.comment && this.comment.trim().length > 0) {
            writer.appendLine(CGHelper.getComment(this.comment, tab));
        }

        // 声明
        const type = this.type || 'any';
        writer.appendLine(CGHelper.getPropertyDeclaration(tab, this.access, type, this.name, this.defaultValue, this.isStatic));
    }
}
