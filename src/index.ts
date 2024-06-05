// #region StringBuilder
export class StringBuilder {
    private _strings: string[];

    get Length(): number {
        return this.ToString().length;
    }

    constructor(initialString?: string) {
        this._strings = initialString ? [initialString] : [];
    }

    Append(text: string): StringBuilder {
        this._strings.push(text);
        return this;
    }

    AppendLine(text: string = ""): StringBuilder {
        this._strings.push(text + '\n');
        return this;
    }

    ToString(): string {
        return this._strings.join('');
    }

    Clear(): void {
        this._strings = [];
    }
}
// #endregion

// #region CGFile
export class CGFile implements ICGGenerator {
    DirectoryPath: string = "";
    Name: string = "";
    FileExtension: string = 'ts';

    get FileName(): string {
        return `${this.Name}.${this.FileExtension}`;
    }

    get FilePath(): string {
        return `${this.DirectoryPath}/${this.FileName}`;
    }

    Author: string = "";
    Date: Date | null = null;
    Version: string = "";
    Comment: string = "";

    private mImports: string[] = [];
    private mSupplements: string[] = [];

    private mInterfaces: CGInterface[] = [];
    private mClasses: CGClass[] = [];

    AddImport(imp: string): void {
        this.mImports.push(imp);
    }

    AddSupplement(supplement: string): void {
        this.mSupplements.push(supplement);
    }

    AddInterface(inter: CGInterface): void {
        this.mInterfaces.push(inter);
    }

    AddClass(clazz: CGClass): void {
        this.mClasses.push(clazz);
    }

    WriteTo(writer: StringBuilder, tab: number = 0): void {
        const header = CGHelper.GetFileHeader(this.Author, this.Date, this.Version, this.Comment);
        writer.AppendLine(header);

        this.mImports.forEach(imp => {
            writer.AppendLine(`import ${imp};`);
        });
        writer.AppendLine();

        // 补充
        this.mSupplements.forEach(supplement => {
            writer.AppendLine(`${CGHelper.Tab(tab)}${supplement}`);
        });
        writer.AppendLine();

        this.mInterfaces.forEach(inter => {
            CGHelper.BeginRegion(writer, `Interface ${inter.Name}`, tab);
            inter.WriteTo(writer, tab);
            CGHelper.EndRegion(writer, tab);
            writer.AppendLine();
        });

        this.mClasses.forEach(clazz => {
            CGHelper.BeginRegion(writer, `Class ${clazz.Name}`, tab);
            clazz.WriteTo(writer, tab);
            CGHelper.EndRegion(writer, tab);
            writer.AppendLine();
        });
    }
}

// #endregion

// #region CGAccess
export enum CGAccess {
    public = 'public',
    private = 'private',
    protected = 'protected',
}
// #endregion

// #region ICGGenerator
export interface ICGGenerator {
    WriteTo(writer: StringBuilder, tab?: number): void;
}
// #endregion

// #region CGClass
export class CGClass implements ICGGenerator {
    public Comment: string = "";
    public Access: CGAccess = CGAccess.public;
    public Name: string = "";
    public InheritClassName: string = "";
    public Export: boolean = false;
    public ExportAsDefault: boolean = false;

    private mClassDecorators: string[] = [];
    private mImplementInterfaces: string[] = [];
    private mProperties: CGProperty[] = [];
    private mMethods: CGMethod[] = [];

    public AddDecorator(decorator: string): void {
        this.mClassDecorators.push(decorator);
    }

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
            writer.AppendLine(CGHelper.GetComment(this.Comment, tab));
        }

        // 类装饰器
        this.mClassDecorators.forEach(decorator => {
            writer.AppendLine(CGHelper.GetClassDecorator(decorator, tab));
        });

        // 声明
        writer.Append(
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
                writer.AppendLine();
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
// #endregion

// #region CGProperty
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
// #endregion

// #region CGMethod
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
// #endregion

// #region CGParameter
export class CGParameter implements ICGGenerator {
    public Type: string = "";
    public Name: string = "any";
    public DefaultValue: any;

    public WriteTo(writer: StringBuilder, tab: number = 0): void {
        writer.Append(this.ToString());
    }

    public ToString(): string {
        const sb = new StringBuilder();
        sb.Append(`${this.Name}: ${this.Type}`);
        if (this.DefaultValue) {
            sb.Append(` = ${this.DefaultValue}`);
        }
        return sb.ToString();
    }
}
// #endregion

// #region CGInterface
export class CGInterface implements ICGGenerator {
    public Comment: string = "";
    public Name: string = "";
    public Export: boolean = false;

    private mProperties: CGProperty[] = [];

    public AddProperty(property: CGProperty): void {
        this.mProperties.push(property);
    }

    public WriteTo(writer: StringBuilder, tab: number = 0): void {
        // 注释
        if (this.Comment && this.Comment.trim().length > 0) {
            writer.AppendLine(CGHelper.GetComment(this.Comment, tab));
        }

        // 声明
        writer.Append(CGHelper.GetInterfaceDeclaration(tab, this.Name, this.Export));
        CGHelper.BeginCodeBlock(writer);

        if (this.mProperties.length > 0) {
            for (const p of this.mProperties) {
                p.WriteTo(writer, tab + 1);
            }
        }

        CGHelper.EndCodeBlock(writer, tab);
    }
}

// #endregion

// #region CGHelper
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
        sb.Append("class")
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
// #endregion
