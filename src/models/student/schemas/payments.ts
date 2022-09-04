import dinero from 'dinero.js'

const valuePayment = dinero({ amount: Number(process.env.VALUE_MENSALIDADE.replace(',', '').replace('.', '')), currency: 'BRL' })

const paymentSchema = {
    valueNumber: {
        type: Number,
        default: valuePayment.getAmount()
    },
    value: {
        type: String,
        default: valuePayment.toFormat()
    },
    paid: {
        type: Boolean,
        default: false
    },
    DueDate: {
        type: String,
        default: () => `10/01/${new Date().getFullYear()}`
    },
    DueDateSystem: {
        type: Date,
        default: () => new Date()
    },
    method: {
        type: String,
        default: 'Espécie'
    }
}

const payments = {
    '01': paymentSchema,
    '02': paymentSchema,
    '03': paymentSchema,
    '04': paymentSchema,
    '05': paymentSchema,
    '06': paymentSchema,
    '07': paymentSchema,
    '08': paymentSchema,
    '09': paymentSchema,
    '10': paymentSchema,
    '11': paymentSchema,
    '12': paymentSchema
}

export default payments