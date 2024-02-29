import { Base, BaseType } from "./base.model"

export class Series extends Base {

    id: number = 0
    name: string = ''
    releaseDate: Date = new Date()
    summary: string = ''
    poster: string = ''
    trailerUrl: string = ''
    seasonIds: number[] = []
    categoryIds: number[] = []
    characterIds: number[] = []
    nextMovieId: number = 0
    previousMovieId: number = 0
    nextSeriesId: number = 0
    previousSeriesId: number = 0
}

export class SeriesType extends BaseType {
    id = 'id'
    name = 'string'
    releaseDate = 'date'
    summary = 'text'
    poster = 'file'
    trailerUrl = 'string'
    seasonIds = 'ids'
    categoryIds = 'ids'
    characterIds = 'ids'
    nextMovieId = 'foreign_id'
    previousMovieId = 'foreign_id'
    nextSeriesId = 'foreign_id'
    previousSeriesId = 'foreign_id'
}