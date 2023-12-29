import { Base } from "./base.model";

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