import { Base } from "./base.model"

export class Series extends Base {

    name: string = ''
    releaseDate: Date = new Date()
    summary: string = ''
    poster: string = ''
    trailerUrl: string = ''
    categoryIds: string[] = []
    characterIds: string[] = []
}