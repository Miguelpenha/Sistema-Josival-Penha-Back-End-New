import { greenBright as success } from 'chalk'

let port: number

if (process.env.PORT) {
    port = Number(process.env.PORT)

    console.log(success('> Usando a porta de produção'))
} else {
    port = Number(process.env.PORTA)

    console.log(success('>> Usando a porta de teste'))
}

export default port