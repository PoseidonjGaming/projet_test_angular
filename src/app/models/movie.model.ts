import { Base } from "./base.model";

export class Movie extends Base {
    name: string = ''
    summary: string = ''
    releaseDate = new Date()
    categoryIds: number[] = []
}