import { Base, BaseType } from "./base.model"

export class Review extends Base {
    id: number = 0
    note: number = 0
    comment: string = ''
    userId: number = 0
    seriesId: number = 0
}

export class ReviewType extends BaseType {
    id = 'id'
    note = 'number'
    comment = 'text'
    userId = 'foreign_id'
    seriesId = 'foreign_id'
}