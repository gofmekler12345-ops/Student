import {beforeEach, describe, expect, it, jest} from '@jest/globals';

const mockRepo = {
    createStudent: jest.fn(),
    findStudentById: jest.fn(),
    deleteStudent: jest.fn(),
    updateStudent: jest.fn(),
    findStudentsByName: jest.fn(),
    countStudentsByNames: jest.fn(),
    findStudentsByMinScore: jest.fn()
}

jest.unstable_mockModule('../repository/studentRepository', () => mockRepo);

const studentService = await import('../service/studentService.js');

beforeEach(() => {
    jest.clearAllMocks();
})

describe('Student Service', () => {
    it('addStudent returns false when student already exist', async () => {
        mockRepo.findStudentById.mockResolvedValue({id: 1});
        const result = await studentService.addStudent({
            id: 1,
            name: 'John',
            password: '1234'
        })
        expect(result).toBeFalsy();
        expect(mockRepo.createStudent).not.toHaveBeenCalled();
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(1);
    })
    it('addStudent returns true when student does not exist', async () => {
        mockRepo.findStudentById.mockResolvedValue(null);
        const result = await studentService.addStudent({
            id: 2,
            name: 'John Doe',
            password: 'secret'
        })
        expect(result).toBeTruthy();
        expect(mockRepo.createStudent).not.toHaveBeenCalledWith({
            id: 2,
            name: 'John Doe',
            password: 'secret'
        });
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(2);
    })
    it('findStudent returns student by id', async () => {
        mockRepo.findStudentById.mockResolvedValue({
            id: 1,
            name: 'John',
            password: 'secret',
        });
        const result = await studentService.findStudent(1)
        expect(result).toEqual(
            {
                id: 1,
                name: 'John',
                password: 'secret',
            }
        );
        expect(mockRepo.findStudentById).toHaveBeenCalledWith(1);
    })
    it('deleteStudent returns student witch he deleted', async () => {
        mockRepo.findStudentById.mockResolvedValue({
            id: 1,
            name: 'John',
            password: 'secret',
        });
        mockRepo.deleteStudent.mockResolvedValue({
            id: 1,
            name: 'John',
            password: 'secret',
        }) //Ask on the lesson
        const result = await studentService.deleteStudent(1)
        expect(result).toEqual(
            {
                id: 1,
                name: 'John',
                password: 'secret',
            }
        );
        expect(mockRepo.deleteStudent).toHaveBeenCalledWith(1)
    })
    it('updateStudent returns student with new data', async () => {
        mockRepo.updateStudent.mockResolvedValue({
                //Ask on the lesson about toObject
                toObject: () => ({
                    id: 1,
                    name: 'John Doe',
                    password: '123456'
                })
            }
        )
        const result = await studentService.updateStudent(1, {
            name: 'John Doe',
            password: '123456'
        })
        expect(result).not.toEqual(
            {
                id: 1,
                name: 'John',
                password: '1234'
            }
        );
        expect(result).toEqual(
            {
                id: 1,
                name: 'John Doe',
                password: '123456'
            }
        )
    })
    it('findStudentByName returns students by name', async () => {
        mockRepo.findStudentsByName.mockResolvedValue({
            //Ask on the lesson about findStudentsByName
            id: 1,
            name: 'John',
            password: 'secret',
        });

        const result = await studentService.findStudentsByName('John')
        expect(result).toEqual(
            {
                id: 1,
                name: 'John',
                password: 'secret',
            }
        )
        expect(mockRepo.findStudentsByName).toHaveBeenCalledWith('John')
    })
    it('countStudentsByNames returns number of students with requires names', async () => {
        mockRepo.findStudentsByName.mockResolvedValue({
            id: 1,
            name: 'John',
            password: 'secret',
        });
        mockRepo.countStudentsByNames.mockResolvedValue(1)

        const result = await studentService.countStudentsByNames('John')
        expect(result).toEqual(1)
        expect(mockRepo.countStudentsByNames).toHaveBeenCalledWith(['John'])
    })
    it('findStudentBeMinScore returns number of students with requires names', async () => {
        mockRepo.findStudentsByMinScore.mockResolvedValue({
            id: 1,
            name: 'John',
            password: 'secret',
            score: {
                Math: 90
            }
        })

        const result = await studentService.findStudentsByMinScore('Math', 80)
        expect(result).toEqual({
            id: 1,
            name: 'John',
            password: 'secret',
            score: {
                Math: 90
            }
        })
        expect(mockRepo.findStudentsByMinScore).toHaveBeenCalledWith('Math', 80)
    })
})
