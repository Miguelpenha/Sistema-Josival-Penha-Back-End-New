const unitSchema = {
    type: Number,
    default: 0
}

const matterSchema = {
    first: unitSchema,
    second: unitSchema,
    third: unitSchema,
    fourth: unitSchema
}

const matters = {
    portuguese: matterSchema,
    english: matterSchema,
    math: matterSchema,
    history: matterSchema,
    arts: matterSchema,
    science: matterSchema,
    geography: matterSchema,
    religion: matterSchema,
    physicalEducation: matterSchema
}

export default matters