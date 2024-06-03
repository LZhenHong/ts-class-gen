import { StringBuilder } from './StringBuilder';

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
        sb.appendLine(CGHelper.BeautyLine());
        sb.appendLine(`// Author: ${author}`);
        if (date) {
            sb.appendLine(`// Date: ${this.FormatDateInYearMonthDay(date)}`);
        }
        sb.appendLine(`// Version: ${version}`);
        sb.appendLine(`// Description: ${comment}`);
        sb.appendLine(CGHelper.BeautyLine());
        return sb.toString();
    }

    // 分割线
    static BeautyLine(): string {
        const sb = new StringBuilder();
        sb.append("// ");
        for (let _ = 0; _ < 50; _++) {
            sb.append("-");
        }
        return sb.toString();
    }

    // 获取格式化的注释
    static GetComment(content: string, tab: number): string {
        return `${CGHelper.Tab(tab)}/** ${content} */`;
    }

    // 获取类声明
    static GetClassDeclaration(tab: number, name: string, inheritClass: string = "", mImplementInterfaces: string[] = [], exp = false, expAs = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.Tab(tab));
        if (exp) {
            sb.append("export ");
            if (expAs) {
                sb.append("default ");
            }
        }
        sb.append("class")
        sb.append(` ${name}`);

        if (inheritClass || mImplementInterfaces.length > 0) {
            sb.append(" extends");
        }

        let flag = false;
        if (inheritClass) {
            sb.append(` ${inheritClass}`);
            flag = true;
        }

        if (mImplementInterfaces.length > 0) {
            if (flag) {
                sb.append(",");
            }
            sb.append(` ${mImplementInterfaces.join(", ")}`);
        }

        return sb.toString();
    }

    // 获取接口声明
    static GetInterfaceDeclaration(tab: number, name: string, exp = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.Tab(tab));
        if (exp) {
            sb.append("export ");
        }
        sb.append("interface");
        sb.append(` ${name}`);
        return sb.toString();
    }

    // 获取属性声明
    static GetPropertyDeclaration(tab: number, access: string, type: string, name: string, defaultValue: string, sta: boolean = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.Tab(tab));
        if (access != "public") {
            sb.append(access);
        }
        sb.append(sta ? " static " : "");
        sb.append(`${name}:`);
        sb.append(` ${type}`);
        if (defaultValue && defaultValue.length > 0) {
            sb.append(` = ${defaultValue}`);
        }
        sb.append(";");
        return sb.toString();
    }

    // 获取方法声明
    static GetMethodDeclaration(tab: number, access: string, returnType: string, name: string, sta: boolean = false, parameters: string[] = [], onlyread = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.Tab(tab));
        sb.append(access);
        sb.append(sta ? " static" : "");
        sb.append(onlyread ? " get" : "");
        sb.append(` ${name}(`);
        if (parameters.length > 0) {
            sb.append(parameters.join(", "));
        }
        sb.append("):");
        sb.append(returnType ? ` ${returnType}` : " void");
        return sb.toString();
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
        sb.appendLine(` {`);
    }

    // 代码块结束花括号
    static EndCodeBlock(sb: StringBuilder, tab: number): void {
        sb.appendLine(`${CGHelper.Tab(tab)}}`);
    }

    // region 开始声明
    static BeginRegion(sb: StringBuilder, content: string, tab: number): void {
        sb.appendLine(`${CGHelper.Tab(tab)}// #region ${content}`);
    }

    // region 结束声明
    static EndRegion(sb: StringBuilder, tab: number): void {
        sb.appendLine(`${CGHelper.Tab(tab)}// #endregion`);
    }
}
