import { greenBright as success, redBright as error } from 'chalk'

let urlMongo: string

if (process.env.URL_MONGO_PRODUCAO || process.env.URL_MONGO_TESTE) {
    if (process.env.NODE_ENV == 'production') {
        urlMongo = process.env.URL_MONGO_PRODUCAO
        
        console.log(success('>> Usando o banco de dados de produção'))
    } else {
        urlMongo = process.env.URL_MONGO_TESTE
        
        console.log(success('>> Usando o banco de dados de teste'))
    }
} else {
    console.log(error('>> Não há um banco de dados sendo usado'))
}

export default urlMongo