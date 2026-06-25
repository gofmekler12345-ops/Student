import * as repo from '../repository/studentRepository.js'

export const addStudent = async (student) => repo.createStudent(student)


export const findStudent = async (id) => {
    let student = await repo.findStudentById(id)
    if (student) {
        student = {...student};
        student.password = undefined;
    }
    return student;
}

export const deleteStudent = async (id) => {
    let student = await repo.deleteStudentById(+id)
    if (student)
        student.password = undefined;
    return student;
}

export const updateStudent = async (id, data) => {
    let student = await repo.findStudentById(+id)
    if (student) {
        student = {...student, ...data};
        student.scores = undefined;
    }
    return student;
}

export const addScore = async (id, exam, score) => {
    const student = await repo.findStudentById(+id)
    if (student) {
        student.scores[exam] = score;
        await repo.updateStudent(student)
    }
    return student;
}

export const findStudentsByName = async (name) => {
    return await repo.findStudentsByName(name).map(student => ({...student, password: undefined}));
}

export const countStudentsByNames = async (names) => {
    names= Array.isArray(names) ? names : [names]
    return await repo.countStudentsByNames(names);
}

export const findStudentsByMinScore = async (exam, minScore) => {
    return await repo.findStudentsByMinScore(exam, minScore).map(student => ({...student, password: undefined}));
}