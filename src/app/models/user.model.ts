import { Base } from "./base.model"

export class User extends Base {
    id: number = 0
    username: string = ''
    roles: string[] = []
    password: string | null = null
    avatarFile: string = ''
}