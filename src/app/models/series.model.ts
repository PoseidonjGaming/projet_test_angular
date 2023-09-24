import { Base } from "./base.model"

export class Series extends Base {

    id: number = 0
    name: string = ''
    releaseDate: Date = new Date()
    summary: string = ''
    poster: string = ''
    trailerUrl: string = ''
    seasonsIds: number[] = []
    categoryIds: number[] = []
}