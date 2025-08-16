import { StringBuilder } from "./StringBuilder";
import { CGHelper } from "./CGHelper";
import { CGInterface } from "./CGInterface";
import { CGClass } from "./CGClass";
import { ICGGenerator } from "./ICGGenerator";

export class CGFile implements ICGGenerator {
    directoryPath: string = "";
    name: string = "";
    fileExtension: string = 'ts';

    get fileName(): string {
        return `${this.name}.${this.fileExtension}`;
    }

    get filePath(): string {
        return `${this.directoryPath}/${this.fileName}`;
    }

    author: string = "";
    date: Date | null = null;
    version: string = "";
    comment: string = "";

    private imports: string[] = [];
    private supplements: string[] = [];

    private interfaces: CGInterface[] = [];
    private classes: CGClass[] = [];

    addImport(imp: string): void {
        this.imports.push(imp);
    }

    addSupplement(supplement: string): void {
        this.supplements.push(supplement);
    }

    addInterface(inter: CGInterface): void {
        this.interfaces.push(inter);
    }

    addClass(clazz: CGClass): void {
        this.classes.push(clazz);
    }

    writeTo(writer: StringBuilder, tab: number = 0): void {
        const header = CGHelper.getFileHeader(this.author, this.date, this.version, this.comment);
        writer.appendLine(header);

        this.imports.forEach(imp => {
            writer.appendLine(`import ${imp};`);
        });
        writer.appendLine();

        // Supplements
        this.supplements.forEach(supplement => {
            writer.appendLine(`${CGHelper.tab(tab)}${supplement}`);
        });
        writer.appendLine();

        this.interfaces.forEach(inter => {
            CGHelper.beginRegion(writer, `Interface ${inter.name}`, tab);
            inter.writeTo(writer, tab);
            CGHelper.endRegion(writer, tab);
            writer.appendLine();
        });

        this.classes.forEach(clazz => {
            CGHelper.beginRegion(writer, `Class ${clazz.name}`, tab);
            clazz.writeTo(writer, tab);
            CGHelper.endRegion(writer, tab);
            writer.appendLine();
        });
    }
}
