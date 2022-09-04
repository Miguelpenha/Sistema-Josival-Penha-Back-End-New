import mongoose from 'mongoose'

export interface ITeacher {
    id: string
    name: string
    gender: string
    login: string
    password: string
    classCount: number
    created: {
        date: string
        hour: string
        system: Date
    }
}

export interface IClass {
    name: string
    grade: string
    shift: string
    teacher: string
    studentCount: number
    created: {
        date: string
        hour: string
        system: Date
    }
}

export interface IMatterStudent {
    first: number
    second: number
    third: number
    fourth: number
}

export interface IPaymentStudent {
    valueNumber: number
    value: string
    paid: boolean
    DueDate: string
    DueDateSystem: date
    description?: string
    method: string
}

export interface IStudent {
    name: string
    gender: string
    birth: string
    cpf: string
    responsible1: string
    responsible2: string
    telephone: string
    email: string
    address: {
        cep: string
        city: string
        neighborhood: string
        street: string
        number: number
        complement: string
    }
    matriculation: string
    class: string
    teacher: string
    situation: string
    observation: string
    matters: {
        portuguese: IMatterStudent
        english: IMatterStudent
        math: IMatterStudent
        history: IMatterStudent
        arts: IMatterStudent
        science: IMatterStudent
        geography: IMatterStudent
        religion: IMatterStudent
        physicalEducation: IMatterStudent
    }
    payments: {
        '01': IPaymentStudent
        '02': IPaymentStudent
        '03': IPaymentStudent
        '04': IPaymentStudent
        '05': IPaymentStudent
        '06': IPaymentStudent
        '07': IPaymentStudent
        '08': IPaymentStudent
        '09': IPaymentStudent
        '10': IPaymentStudent
        '11': IPaymentStudent
        '12': IPaymentStudent
    }
    photo: {
        name: string
        key: string
        size: number
        mimeType: string
        url: string
        width: number
        height: number
    }
    created: {
        date: string
        hour: string
        system: Date
    }
}