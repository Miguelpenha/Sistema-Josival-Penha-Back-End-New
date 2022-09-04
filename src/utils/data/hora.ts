export default function hora() {
    const hora = new Date().toLocaleTimeString('pt-br').split(':')

    return `${hora[0]}:${hora[1]}`
}

export const completa = () => new Date().toLocaleTimeString('pt-br')