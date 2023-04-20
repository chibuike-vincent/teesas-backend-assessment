import * as Argon from "argon2"

export const hashPassword = async (password:string) => {
    return await Argon.hash(password)
}