import { execSync } from "node:child_process";
import { Actor } from "./actor.model";
import { Base, BaseType } from "./base.model";

export class Character extends Base {
    id: number = 0
    name: String = ''
    actorId: number = 0
    seriesIds: number[] = []
}

export class CharacterType extends BaseType {
    id = 'id'
    name = 'string'
    actorId = 'foreign_id'
    seriesIds = 'ids'
}