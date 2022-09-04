import crypto from 'crypto'

function criptografar(dado: string) {
    if (dado) {
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(process.env.SECRET_KEY_CRYPTO), iv)
        let crip = cipher.update(dado, 'utf8', 'hex')

        crip += cipher.final('hex')
        
        const tag = cipher.getAuthTag().toString('hex')

        return `${crip}:${iv.toString('hex')}:${tag}`
    } else {
        return undefined
    }
}

export default criptografar