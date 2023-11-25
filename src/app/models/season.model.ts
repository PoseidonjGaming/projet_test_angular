import { Base } from "./base.model";

export class Season extends Base {
    id: number = 0
    seriesId: number = 0
    number: number = 1;
    episodeIds: number[] = [];

    constructor(seriesId: number, number: number) {
        super()
        this.seriesId = seriesId
        this.number = number
    }
}