import { StringBuilder } from "./StringBuilder";

export interface ICGGenerator {
    writeTo(writer: StringBuilder, tab?: number): void;
}
