import { ICGGenerator } from "./ICGGenerator";
import { StringBuilder } from "./StringBuilder";

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
