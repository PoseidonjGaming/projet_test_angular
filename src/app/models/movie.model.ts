import { Base } from "./base.model";

export class Movie extends Base {
    name: string = ''
    summary: string = ''
    releaseDate = new Date()
    poster: string = ''
    trailerUrl: string = ''
    categoryIds: string[] = []
    characterIds: string[] = []

}