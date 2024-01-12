import { Base } from "./base.model"

export class Review extends Base{
    note: number = 0
    comment: string = ''
    userId: number = 0
    seriesId: number = 0
}