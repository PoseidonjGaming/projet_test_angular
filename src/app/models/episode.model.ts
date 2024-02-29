import { Base, BaseType } from "./base.model"

export class Episode extends Base {
    id: number = 0
    name: String = ''
    summary: String = ''
    releaseDate: Date = new Date()
    seriesId: number = 0
    seasonId: number = 0
}

export class EpisodeType extends BaseType {
    id = 'id'
    name = 'string'
    summary = 'text'
    releaseDate = 'date'
    seriesId = 'foreign_id'
    seasonId = 'foreign_id'
}