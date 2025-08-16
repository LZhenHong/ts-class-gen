import { StringBuilder } from "./StringBuilder";

export abstract class CGHelper {
    static formatDateInYearMonthDay(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Get code file header
     * @param author Author name
     * @param date Creation date
     * @param version Version number
     * @param comment Description comment
     */
    static getFileHeader(author: string, date: Date | null, version: string, comment: string): string {
        const sb = new StringBuilder();
        sb.appendLine(CGHelper.beautyLine());
        sb.appendLine(`// Author: ${author}`);
        if (date) {
            sb.appendLine(`// Date: ${CGHelper.formatDateInYearMonthDay(date)}`);
        }
        sb.appendLine(`// Version: ${version}`);
        sb.appendLine(`// Description: ${comment}`);
        sb.appendLine(CGHelper.beautyLine());
        return sb.toString();
    }

    /**
     * Separator line
     */
    static beautyLine(): string {
        const sb = new StringBuilder();
        sb.append("// ");
        for (let _ = 0; _ < 50; _++) {
            sb.append("-");
        }
        return sb.toString();
    }

    /**
     * Get formatted comment
     * @param content Comment content
     * @param tab Indentation level
     */
    static getComment(content: string, tab: number): string {
        return `${CGHelper.tab(tab)}/** ${content} */`;
    }

    static getClassDecorator(decorator: string, tab = 0): string {
        return `${CGHelper.tab(tab)}@${decorator}`;
    }

    /**
     * Get class declaration
     * @param tab Indentation level
     * @param name Class name
     * @param inheritClass Extended class
     * @param implementInterfaces Implemented interfaces
     * @param isExport Whether to export
     * @param isExportAsDefault Whether to export as default
     */
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

    /**
     * Get interface declaration
     * @param tab Indentation level
     * @param name Interface name
     * @param isExport Whether to export
     * @param isExportAsDefault Whether to export as default
     */
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

    /**
     * Get property declaration
     * @param tab Indentation level
     * @param access Access modifier
     * @param type Property type
     * @param name Property name
     * @param defaultValue Default value
     * @param isStatic Whether it's static
     */
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

    /**
     * Get method declaration
     * @param tab Indentation level
     * @param access Access modifier
     * @param returnType Return type
     * @param name Method name
     * @param isStatic Whether it's static
     * @param parameters Parameter list
     * @param isReadonly Whether it's readonly
     */
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

    /**
     * Get indentation string
     * @param tab Indentation level
     */
    static tab(tab: number): string {
        let sb = '';
        for (let _ = 0; _ < tab; _++) {
            sb += '    ';
        }
        return sb;
    }

    /**
     * Begin code block
     * @param sb String builder
     */
    static beginCodeBlock(sb: StringBuilder): void {
        sb.appendLine(` {`);
    }

    /**
     * End code block
     * @param sb String builder
     * @param tab Indentation level
     */
    static endCodeBlock(sb: StringBuilder, tab: number): void {
        sb.appendLine(`${CGHelper.tab(tab)}}`);
    }

    /**
     * Begin region
     * @param sb String builder
     * @param content Region name
     * @param tab Indentation level
     */
    static beginRegion(sb: StringBuilder, content: string, tab: number): void {
        sb.appendLine(`${CGHelper.tab(tab)}// #region ${content}`);
    }

    /**
     * End region
     * @param sb String builder
     * @param tab Indentation level
     */
    static endRegion(sb: StringBuilder, tab: number): void {
        sb.appendLine(`${CGHelper.tab(tab)}// #endregion`);
    }
}
