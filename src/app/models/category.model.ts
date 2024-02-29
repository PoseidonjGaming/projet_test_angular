import { Base, BaseType } from "./base.model";

export class Category extends Base {
    id: number = 0
    name: string = ''
    seriesIds: number[] = []
}

export class CategoryType extends BaseType {
    id = 'id'
    name = 'string'
    seriesIds = 'ids'
}