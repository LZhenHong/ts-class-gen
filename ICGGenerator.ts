import { StringBuilder } from "./StringBuilder";

export interface ICGGenerator {
    WriteTo(writer: StringBuilder, tab?: number): void;
}
