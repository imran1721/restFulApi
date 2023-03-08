import bcrypt from 'bcrypt';
export const hashPassword =async (plaintextPassword: string | Buffer) => {
    return bcrypt.hash(plaintextPassword, 10)
        .then( hash => {
            return hash
        })
        .catch(err => {
            console.log(err)
        })
   
}

export const comparePassword =async (plaintextPassword: any, hash: any) => {
    return bcrypt.compare(plaintextPassword, hash)
        .then((result: any) => {
            return result
        })
        .catch((err: any) => {
            console.log(err)
        })
}
