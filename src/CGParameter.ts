import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";

export class CGParameter implements ICGGenerator {
    public type: string = "";
    public name: string = "any";
    public defaultValue: any;

    public writeTo(writer: StringBuilder, tab: number = 0): void {
        writer.append(this.toString());
    }

    public toString(): string {
        const sb = new StringBuilder();
        sb.append(`${this.name}: ${this.type}`);
        if (this.defaultValue) {
            sb.append(` = ${this.defaultValue}`);
        }
        return sb.toString();
    }
}
