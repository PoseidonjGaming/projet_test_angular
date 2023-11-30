import { Base } from "./base.model"

export class PageResponse<E> extends Base {
    content: E[] = []
    pageIndex: number = 0
    size: number = 0
}