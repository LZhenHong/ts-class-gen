import { StringBuilder } from "./StringBuilder";

export abstract class CGHelper {
    static formatDateInYearMonthDay(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 获取代码文件标注
    static getFileHeader(author: string, date: Date | null, version: string, comment: string): string {
        const sb = new StringBuilder();
        sb.appendLine(CGHelper.beautyLine());
        sb.appendLine(`// Author: ${author}`);
        if (date) {
            sb.appendLine(`// Date: ${this.formatDateInYearMonthDay(date)}`);
        }
        sb.appendLine(`// Version: ${version}`);
        sb.appendLine(`// Description: ${comment}`);
        sb.appendLine(CGHelper.beautyLine());
        return sb.toString();
    }

    // 分割线
    static beautyLine(): string {
        const sb = new StringBuilder();
        sb.append("// ");
        for (let _ = 0; _ < 50; _++) {
            sb.append("-");
        }
        return sb.toString();
    }

    // 获取格式化的注释
    static getComment(content: string, tab: number): string {
        return `${CGHelper.tab(tab)}/** ${content} */`;
    }

    static getClassDecorator(decorator: string, tab = 0): string {
        return `${CGHelper.tab(tab)}@${decorator}`;
    }

    // 获取类声明
    static getClassDeclaration(tab: number, name: string, inheritClass: string = "", implementInterfaces: string[] = [], isExport = false, isExportAsDefault = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.tab(tab));
        if (isExport) {
            sb.append("export ");
            if (isExportAsDefault) {
                sb.append("default ");
            }
        }
        sb.append("class");
        sb.append(` ${name}`);

        if (inheritClass) {
            sb.append(` extends ${inheritClass}`);
        }

        if (implementInterfaces.length > 0) {
            sb.append(` implements ${implementInterfaces.join(", ")}`);
        }

        return sb.toString();
    }

    // 获取接口声明
    static getInterfaceDeclaration(tab: number, name: string, isExport = false, isExportAsDefault = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.tab(tab));
        if (isExport) {
            sb.append("export ");
            if (isExportAsDefault) {
                sb.append("default ");
            }
        }
        sb.append("interface");
        sb.append(` ${name}`);
        return sb.toString();
    }

    // 获取属性声明
    static getPropertyDeclaration(tab: number, access: string, type: string, name: string, defaultValue: string, isStatic: boolean = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.tab(tab));
        if (access != "public") {
            sb.append(access);
        }
        sb.append(isStatic ? " static " : "");
        sb.append(`${name}:`);
        sb.append(` ${type}`);
        if (defaultValue && defaultValue.length > 0) {
            sb.append(` = ${defaultValue}`);
        }
        sb.append(";");
        return sb.toString();
    }

    // 获取方法声明
    static getMethodDeclaration(tab: number, access: string, returnType: string, name: string, isStatic: boolean = false, parameters: string[] = [], isReadonly = false): string {
        const sb = new StringBuilder();
        sb.append(CGHelper.tab(tab));
        sb.append(access);
        sb.append(isStatic ? " static" : "");
        sb.append(isReadonly ? " get" : "");
        sb.append(` ${name}(`);
        if (parameters.length > 0) {
            sb.append(parameters.join(", "));
        }
        sb.append("):");
        sb.append(returnType ? ` ${returnType}` : " void");
        return sb.toString();
    }

    // 生成制表符格式
    static tab(tab: number): string {
        let sb = '';
        for (let _ = 0; _ < tab; _++) {
            sb += '    ';
        }
        return sb;
    }

    // 代码块开始花括号
    static beginCodeBlock(sb: StringBuilder): void {
        sb.appendLine(` {`);
    }

    // 代码块结束花括号
    static endCodeBlock(sb: StringBuilder, tab: number): void {
        sb.appendLine(`${CGHelper.tab(tab)}}`);
    }

    // region 开始声明
    static beginRegion(sb: StringBuilder, content: string, tab: number): void {
        sb.appendLine(`${CGHelper.tab(tab)}// #region ${content}`);
    }

    // region 结束声明
    static endRegion(sb: StringBuilder, tab: number): void {
        sb.appendLine(`${CGHelper.tab(tab)}// #endregion`);
    }
}
