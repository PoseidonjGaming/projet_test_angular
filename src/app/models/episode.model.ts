import { Base } from "./base.model"

export class Episode extends Base {

    id: number = 0
    name: String = ''
    summary: String = ''
    releaseDate: Date = new Date()
    seasonId: number = 0
    seriesId: number = 0
}