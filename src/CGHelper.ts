import { StringBuilder } from "./StringBuilder";

export abstract class CGHelper {
    static FormatDateInYearMonthDay(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 获取代码文件标注
    static GetFileHeader(author: string, date: Date | null, version: string, comment: string): string {
        const sb = new StringBuilder();
        sb.AppendLine(CGHelper.BeautyLine());
        sb.AppendLine(`// Author: ${author}`);
        if (date) {
            sb.AppendLine(`// Date: ${this.FormatDateInYearMonthDay(date)}`);
        }
        sb.AppendLine(`// Version: ${version}`);
        sb.AppendLine(`// Description: ${comment}`);
        sb.AppendLine(CGHelper.BeautyLine());
        return sb.ToString();
    }

    // 分割线
    static BeautyLine(): string {
        const sb = new StringBuilder();
        sb.Append("// ");
        for (let _ = 0; _ < 50; _++) {
            sb.Append("-");
        }
        return sb.ToString();
    }

    // 获取格式化的注释
    static GetComment(content: string, tab: number): string {
        return `${CGHelper.Tab(tab)}/** ${content} */`;
    }

    static GetClassDecorator(decorator: string, tab = 0): string {
        return `${CGHelper.Tab(tab)}@${decorator}`;
    }

    // 获取类声明
    static GetClassDeclaration(tab: number, name: string, inheritClass: string = "", mImplementInterfaces: string[] = [], exp = false, expAs = false): string {
        const sb = new StringBuilder();
        sb.Append(CGHelper.Tab(tab));
        if (exp) {
            sb.Append("export ");
            if (expAs) {
                sb.Append("default ");
            }
        }
        sb.Append("class");
        sb.Append(` ${name}`);

        if (inheritClass) {
            sb.Append(` extends ${inheritClass}`);
        }

        if (mImplementInterfaces.length > 0) {
            sb.Append(` implements ${mImplementInterfaces.join(", ")}`);
        }

        return sb.ToString();
    }

    // 获取接口声明
    static GetInterfaceDeclaration(tab: number, name: string, exp = false): string {
        const sb = new StringBuilder();
        sb.Append(CGHelper.Tab(tab));
        if (exp) {
            sb.Append("export ");
        }
        sb.Append("interface");
        sb.Append(` ${name}`);
        return sb.ToString();
    }

    // 获取属性声明
    static GetPropertyDeclaration(tab: number, access: string, type: string, name: string, defaultValue: string, sta: boolean = false): string {
        const sb = new StringBuilder();
        sb.Append(CGHelper.Tab(tab));
        if (access != "public") {
            sb.Append(access);
        }
        sb.Append(sta ? " static " : "");
        sb.Append(`${name}:`);
        sb.Append(` ${type}`);
        if (defaultValue && defaultValue.length > 0) {
            sb.Append(` = ${defaultValue}`);
        }
        sb.Append(";");
        return sb.ToString();
    }

    // 获取方法声明
    static GetMethodDeclaration(tab: number, access: string, returnType: string, name: string, sta: boolean = false, parameters: string[] = [], onlyread = false): string {
        const sb = new StringBuilder();
        sb.Append(CGHelper.Tab(tab));
        sb.Append(access);
        sb.Append(sta ? " static" : "");
        sb.Append(onlyread ? " get" : "");
        sb.Append(` ${name}(`);
        if (parameters.length > 0) {
            sb.Append(parameters.join(", "));
        }
        sb.Append("):");
        sb.Append(returnType ? ` ${returnType}` : " void");
        return sb.ToString();
    }

    // 生成制表符格式
    static Tab(tab: number): string {
        let sb = '';
        for (let _ = 0; _ < tab; _++) {
            sb += '    ';
        }
        return sb;
    }

    // 代码块开始花括号
    static BeginCodeBlock(sb: StringBuilder): void {
        sb.AppendLine(` {`);
    }

    // 代码块结束花括号
    static EndCodeBlock(sb: StringBuilder, tab: number): void {
        sb.AppendLine(`${CGHelper.Tab(tab)}}`);
    }

    // region 开始声明
    static BeginRegion(sb: StringBuilder, content: string, tab: number): void {
        sb.AppendLine(`${CGHelper.Tab(tab)}// #region ${content}`);
    }

    // region 结束声明
    static EndRegion(sb: StringBuilder, tab: number): void {
        sb.AppendLine(`${CGHelper.Tab(tab)}// #endregion`);
    }
}
