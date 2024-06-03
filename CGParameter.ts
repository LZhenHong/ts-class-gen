import { ICGGenerator } from './ICGGenerator';
import { StringBuilder } from './StringBuilder';

export class CGParameter implements ICGGenerator {
    public Type: string = "";
    public Name: string = "any";
    public DefaultValue: any;

    public WriteTo(writer: StringBuilder, tab: number = 0): void {
        writer.append(this.ToString());
    }

    public ToString(): string {
        const sb = new StringBuilder();
        sb.append(`${this.Name}: ${this.Type}`);
        if (this.DefaultValue) {
            sb.append(` = ${this.DefaultValue}`);
        }
        return sb.toString();
    }
}

