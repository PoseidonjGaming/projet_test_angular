import { Base } from "./base.model"

export class Review extends Base {
    id: number = 0
    note: number = 0
    comment: string = ''
    userId: number = 0
    seriesId: number = 0
}