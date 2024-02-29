import { Base, BaseType } from "./base.model";

export class Movie extends Base {
    id: number = 0
    name: string = ''
    summary: string = ''
    releaseDate = new Date()
    poster: string = ''
    trailerUrl: string = ''
    categoryIds: number[] = []
    characterIds: number[] = []
    nextSeriesId: number = 0
    previousSeriesId: number = 0
    nextMovieId: number = 0
    previousMovieId: number = 0
}

export class MovieType extends BaseType {
    id = 'id'
    name = 'string'
    summary = 'text'
    releaseDate = 'date'
    poster = 'string'
    trailerUrl = 'string'
    categoryIds = 'ids'
    characterIds = 'ids'
    nextSeriesId = 'foreign_id'
    previousSeriesId = 'foreign_id'
    nextMovieId = 'foreign_id'
    previousMovieId = 'foreign_id'
}