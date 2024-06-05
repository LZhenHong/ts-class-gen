import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";
import { CGInterface } from "./CGInterface";
import { CGClass } from "./CGClass";
import { ICGGenerator } from "./ICGGenerator";

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
