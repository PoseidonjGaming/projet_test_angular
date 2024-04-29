import { Base } from "./base.model"

export class Episode extends Base {
    name: String = ''
    summary: String = ''
    releaseDate: Date = new Date()
    seriesId: string = ''
    seasonId: string = ''
}