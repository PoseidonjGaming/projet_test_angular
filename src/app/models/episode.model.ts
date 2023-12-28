import { Base } from "./base.model"

export class Episode extends Base {

    id: number = 0
    name: String = ''
    summary: String = ''
    releaseDate: Date = new Date()
    seriesId: number = 0
    seasonId: number = 0
}