import { Base } from "./base.model"

export class Review extends Base {
    note: number = 0
    comment: string = ''
    userId: string = ''
    seriesId: string = ''
}