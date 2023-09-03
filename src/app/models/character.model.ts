import { Base } from "./base.model";

export class Character extends Base {
    id: number = 0
    name: String = ''
    actorIds: number[] = []
    seriesIds: number[] = []
}