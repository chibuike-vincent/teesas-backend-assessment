import * as Argon from "argon2"

export const verifyPassword = async(inputPassword: string, passwordHash:string) => {
    return await Argon.verify(passwordHash, inputPassword)
}