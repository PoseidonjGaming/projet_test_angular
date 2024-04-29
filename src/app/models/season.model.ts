import { Base } from "./base.model";

export class Season extends Base {
    seriesId: string = ''
    number: number = 1;
    episodeIds: string[] = [];

    constructor(seriesId: string, number: number) {
        super()
        this.seriesId = seriesId
        this.number = number
    }
}