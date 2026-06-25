import Student from '../model/student.js';

const students = new Map();
let collection;
export const init = db => {
    collection = db.collection('college')
};

export const createStudent = async ({id, name, password}) => {
    const stringId=String(id);
    const existingStudent = await collection.findOne({_id: stringId});
    if (existingStudent) {
        return false;
    }
    await collection.insertOne({_id: stringId, name, password, scores: {}});
    return true;
}

export const findStudentById = async (id) => {
    return await collection.findOne({_id: String(id)});
}

export const deleteStudentById = async (id) => {
    const student = await collection.findOne({_id: id});
    if (student){
        await collection.deleteOne({_id: id});
    }
    return student;
}

export const updateStudent = async (student) => {
    if (students.has(student.id)) {
        students.set(student.id, student);
        return student;
    }
}

export const findStudentsByName = async (name) => [...students.values()].filter(student => student.name.toLowerCase() === name.toLowerCase());

export const countStudentsByNames = async (names) => {
    names = names.map(name => name.toLowerCase());
    return [...students.values()].filter(student => names.includes(student.name.toLowerCase())).length;
}

export const findStudentsByMinScore = async (exam, minScore) => [...students.values()].filter(s => s.scores[exam] >= minScore);