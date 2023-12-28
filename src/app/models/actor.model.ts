import { Base } from "./base.model";

export class Actor extends Base {
    id: number = 0
    lastname: string = ''
    firstname: string = ''
    characterIds: number[] = []
}