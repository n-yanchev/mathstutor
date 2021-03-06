import Appointment from "../Appointment";
import TimeDate from "../TimeDate";
import Course from "../Course";
import Lesson from "../Lesson";

describe("Создание назначения без каникул", () => {

    const appointmentDataWithoutVacations = {
        startTimeStamp: 1630512000, // 01 сентября 19:00
        weekDays: [
            {number: 2, hour: 18, minute: 0, duration: null}
        ],
        vacations: null,
        course: {
            title: "ЕГЭ профильного уровня. Задания с развернутым ответом. 11 класс.",
            lessons: [{id: 1, title: "Задания 13", finalTest: null}]
        }
    }

    test("Создать назначение: на вторник с 18:00 один час без каникул", () => {

        const appointment = Appointment.create(appointmentDataWithoutVacations)

        expect(appointment._durations).toEqual([undefined, undefined, null, undefined, undefined, undefined, undefined])
        expect(appointment._dates).toEqual([
            TimeDate.create(1631026800000), // 07 september, 18:00
        ])
        expect(appointment._course).toEqual(Course.create({
            title: "ЕГЭ профильного уровня. Задания с развернутым ответом. 11 класс.",
            lessons: [{id: 1, title: "Задания 13", finalTest: null}]
        }))
    })
})

const appointmentData = {
    startTimeStamp: 1630512000, // 01 сентября 19:00
    weekDays: [
        {number: 2, hour: 18, minute: 0, duration: null},
        {number: 4, hour: 19, minute: 30, duration: 90}
    ],
    vacations: [{
        startTimeStamp: 1630875600, // 06 сентября
        finishTimeStamp: 1631998800, // 19 сентября
    }, {
        startTimeStamp: 1632258000, // 22 сентября
        finishTimeStamp: 1633640400, // 08 октября
    }, {
        startTimeStamp: 1634072400, // 13 октября
        finishTimeStamp: 1635714000 // 01 ноября
    }, {
        startTimeStamp: 1635886800, // 3 ноября
        finishTimeStamp: 1636405200 // 9 ноября
    }],
    course: {
        title: "ЕГЭ профильного уровня. Задания с развернутым ответом. 11 класс.",
        lessons: [
            {id: 1, title: "Задания 13", finalTest: null},
            {id: 2, title: "Задания 14", finalTest: null},
            {id: 3, title: "Задания 15", finalTest: null},
            {id: 4, title: "Задания 16", finalTest: null},
            {id: 5, title: "Задания 17", finalTest: null}
        ]
    }
}

describe("create", () => {

    test("Создать назначение: на вторник с 18:00 один час и четверг с 18:00 90 минут, для курса ...", () => {

        const appointment = Appointment.create(appointmentData)

        expect(appointment._durations).toEqual([undefined, undefined, null, undefined, 90, undefined, undefined])
        expect(appointment._dates).toEqual([
            TimeDate.create(1630600200000), // 02 september, 19:30
            TimeDate.create(1632236400000), // 21 september, 18:00
            TimeDate.create(1634050800000), // 12 october, 18:00
            TimeDate.create(1635865200000), // 02 november, 18:00
            TimeDate.create(1636648200000), // 11 november, 19:30
        ])
        expect(appointment._course).toEqual(Course.create({
            title: "ЕГЭ профильного уровня. Задания с развернутым ответом. 11 класс.",
            lessons: [
                {id: 1, title: "Задания 13", finalTest: null},
                {id: 2, title: "Задания 14", finalTest: null},
                {id: 3, title: "Задания 15", finalTest: null},
                {id: 4, title: "Задания 16", finalTest: null},
                {id: 5, title: "Задания 17", finalTest: null}
            ]
        }))
    })

    test("Возвращает null", () => {
        const appointment = Appointment.create(null)
        expect(appointment).toBeNull()
    })
})

const lesson1 = Lesson.create({id: 1, title: "Задания 13", finalTest: null})
const lesson2 = Lesson.create({id: 2, title: "Задания 14", finalTest: null})
const lesson3 = Lesson.create({id: 3, title: "Задания 15", finalTest: null})
const lesson4 = Lesson.create({id: 4, title: "Задания 16", finalTest: null})
const lesson5 = Lesson.create({id: 5, title: "Задания 17", finalTest: null})

describe("prevLesson", () => {

    const appointment = Appointment.create(appointmentData)

    test("Текущее время раньше начала первого урока. Должен вернуть null", () => {
        const lesson = appointment.prevLesson(TimeDate.create(1630494736123)) // 01 september
        expect(lesson).toBeNull()
    })

    test("Текущее время во время первого урока. Должен вернуть null", () => {
        const lesson = appointment.prevLesson(TimeDate.create(1630600523123)) // 02 september 19:35
        expect(lesson).toBeNull()
    })

    test("Текущее время между вторым и третьим уроком. Должен вернуть второй урок", () => {
        const lesson = appointment.prevLesson(TimeDate.create(1632414900453)) // 23 september
        expect(lesson).toEqual(lesson2)
    })

    test("Текущее время во время третьего урока. Должен вернуть второй урок", () => {
        const lesson = appointment.prevLesson(TimeDate.create(1634051143019)) // 12 october 18:05
        expect(lesson).toEqual(lesson2)
    })

    test("Текущее время после третьего урока. Должен вернуть третий урок", () => {
        const lesson = appointment.prevLesson(TimeDate.create(1634054743019)) // 12 october 19:05
        expect(lesson).toEqual(lesson3)
    })

    test("Текущее время во время четвертого урока. Должен вернуть третий урок", () => {
        const lesson = appointment.prevLesson(TimeDate.create(1635866143019)) // 02 november 18:52
        expect(lesson).toEqual(lesson3)
    })

    test("Текущее время после окончания пятого урока. Должен вернуть пятый урок", () => {
        const lesson = appointment.prevLesson(TimeDate.create(1636653763069)) // 11 november 21:02
        expect(lesson).toEqual(lesson5)
    })
})

describe("nowLesson", () => {

    const appointment = Appointment.create(appointmentData)

    test("Текущее время раньше начала первого урока. Должен вернуть null", () => {
        const lesson = appointment.nowLesson(TimeDate.create(1630494736123)) // 01 september
        expect(lesson).toBeNull()
    })

    test("Текущее время во время первого урока. Должен вернуть первый урок", () => {
        const lesson = appointment.nowLesson(TimeDate.create(1630600523123)) // 02 september 19:35
        expect(lesson).toEqual(lesson1)
    })

    test("Текущее время между вторым и третьим уроком. Должен вернуть null", () => {
        const lesson = appointment.nowLesson(TimeDate.create(1632414900453)) // 23 september
        expect(lesson).toBeNull()
    })

    test("Текущее время во время третьего урока. Должен вернуть третий урок", () => {
        const lesson = appointment.nowLesson(TimeDate.create(1634051143019)) // 12 october 18:05
        expect(lesson).toEqual(lesson3)
    })

    test("Текущее время после третьего урока. Должен вернуть null", () => {
        const lesson = appointment.nowLesson(TimeDate.create(1634054743019)) // 12 october 19:05
        expect(lesson).toBeNull()
    })

    test("Текущее время во время четвертого урока. Должен вернуть четвертый урок", () => {
        const lesson = appointment.nowLesson(TimeDate.create(1635866143019)) // 02 november 18:52
        expect(lesson).toEqual(lesson4)
    })

    test("Текущее время после окончания пятого урока. Должен вернуть null", () => {
        const lesson = appointment.nowLesson(TimeDate.create(1636653763069)) // 11 november 21:02
        expect(lesson).toBeNull()
    })
})

describe("nextLesson", () => {

    const appointment = Appointment.create(appointmentData)

    test("Текущее время раньше начала первого урока. Должен вернуть первый урок", () => {
        const lesson = appointment.nextLesson(TimeDate.create(1630494736123)) // 01 september
        expect(lesson).toEqual(lesson1)
    })

    test("Текущее время во время первого урока. Должен вернуть второй урок", () => {
        const lesson = appointment.nextLesson(TimeDate.create(1630600523123)) // 02 september 19:35
        expect(lesson).toEqual(lesson2)
    })

    test("Текущее время между вторым и третьим уроком. Должен вернуть третий урок", () => {
        const lesson = appointment.nextLesson(TimeDate.create(1632414900453)) // 23 september
        expect(lesson).toEqual(lesson3)
    })

    test("Текущее время во время третьего урока. Должен вернуть четвертый урок", () => {
        const lesson = appointment.nextLesson(TimeDate.create(1634051143019)) // 12 october 18:05
        expect(lesson).toEqual(lesson4)
    })

    test("Текущее время после третьего урока. Должен вернуть четвертый урок", () => {
        const lesson = appointment.nextLesson(TimeDate.create(1634054743019)) // 12 october 19:05
        expect(lesson).toEqual(lesson4)
    })

    test("Текущее время во время четвертого урока. Должен вернуть пятый урок", () => {
        const lesson = appointment.nextLesson(TimeDate.create(1635866143019)) // 02 november 18:52
        expect(lesson).toEqual(lesson5)
    })

    test("Текущее время после окончания пятого урока. Должен вернуть null", () => {
        const lesson = appointment.nextLesson(TimeDate.create(1636653763069)) // 11 november 21:02
        expect(lesson).toBeNull()
    })
})

describe("nextLessonFormatTime", () => {

    const appointment = Appointment.create(appointmentData)

    test('Должен вернуть "02.09" и "19:30"', () => {
        // 01 september
        expect(appointment.nextLessonFormatTime(TimeDate.create(1630494736123), "day.month"))
            .toBe("02.09")
        expect(appointment.nextLessonFormatTime(TimeDate.create(1630494736123), "hour:minute"))
            .toBe("19:30")
    })

    test('Должен вернуть "21.09" и "18:00"', () => {
        // 02 september 19:35
        expect(appointment.nextLessonFormatTime(TimeDate.create(1630600523123), "day.month"))
            .toBe("21.09")
        expect(appointment.nextLessonFormatTime(TimeDate.create(1630600523123), "hour:minute"))
            .toBe("18:00")
    })

    test('Должен вернуть "12.10" и "18:00"', () => {
        // 23 september
        expect(appointment.nextLessonFormatTime(TimeDate.create(1632414900453), "day.month"))
            .toBe("12.10")
        expect(appointment.nextLessonFormatTime(TimeDate.create(1632414900453), "hour:minute"))
            .toBe("18:00")
    })

    test('Должен вернуть "02.11" и "18:00"', () => {
        // 12 october 18:05
        expect(appointment.nextLessonFormatTime(TimeDate.create(1634051143019), "day.month"))
            .toBe("02.11")
        expect(appointment.nextLessonFormatTime(TimeDate.create(1634051143019), "hour:minute"))
            .toBe("18:00")
    })
})

const allLessons = [
    {lesson: lesson1, date: TimeDate.create(1630600200000)}, // 02 september, 19:30
    {lesson: lesson2, date: TimeDate.create(1632236400000)}, // 21 september, 18:00
    {lesson: lesson3, date: TimeDate.create(1634050800000)}, // 12 october, 18:00
    {lesson: lesson4, date: TimeDate.create(1635865200000)}, // 02 november, 18:00
    {lesson: lesson5, date: TimeDate.create(1636648200000)}, // 11 november, 19:30
]

describe("comingLessons", () => {

    const appointment = Appointment.create(appointmentData)

    test('Текущее время раньше начала первого урока. Должен вернуть "Задания 13, Задания 14, Задания 15", "Задания 16" и "Задания 17" с датами', () => {
        const nowDate = TimeDate.create(1630494736123) // 01 september
        const lessons = appointment.comingLessons(nowDate)
        expect(lessons).toEqual(allLessons)
    })

    test('Текущее время во время первого урока. Должен вернуть "Задания 14", "Задания 15", "Задания 16" и "Задания 17" с датами', () => {
        const nowDate = TimeDate.create(1630600523123) // 02 september 19:35
        const lessons = appointment.comingLessons(nowDate)
        const result = [
            {lesson: lesson2, date: TimeDate.create(1632236400000)}, // 21 september, 18:00
            {lesson: lesson3, date: TimeDate.create(1634050800000)}, // 12 october, 18:00
            {lesson: lesson4, date: TimeDate.create(1635865200000)}, // 02 november, 18:00
            {lesson: lesson5, date: TimeDate.create(1636648200000)}, // 11 november, 19:30
        ]
        expect(lessons).toEqual(result)
    })

    test('Текущее время между вторым и третьим уроком. Должен вернуть "Задания 15", "Задания 16" и "Задания 17" с датами', () => {
        const nowDate = TimeDate.create(1632414900453) // 23 september
        const lessons = appointment.comingLessons(nowDate)
        const result = [
            {lesson: lesson3, date: TimeDate.create(1634050800000)}, // 12 october, 18:00
            {lesson: lesson4, date: TimeDate.create(1635865200000)}, // 02 november, 18:00
            {lesson: lesson5, date: TimeDate.create(1636648200000)}, // 11 november, 19:30
        ]
        expect(lessons).toEqual(result)
    })

    test('Текущее время во время третьего урока. Должен вернуть "Задания 16" и "Задания 17" с датами', () => {
        const nowDate = TimeDate.create(1634051143019) // 12 october 18:05
        const lessons = appointment.comingLessons(nowDate)
        const result = [
            {lesson: lesson4, date: TimeDate.create(1635865200000)}, // 02 november, 18:00
            {lesson: lesson5, date: TimeDate.create(1636648200000)}, // 11 november, 19:30
        ]
        expect(lessons).toEqual(result)
    })

    test('Текущее время после третьего урока. Должен вернуть "Задания 16" и "Задания 17" с датами', () => {
        const nowDate = TimeDate.create(1634054743019) // 12 october 19:05
        const lessons = appointment.comingLessons(nowDate)
        const result = [
            {lesson: lesson4, date: TimeDate.create(1635865200000)}, // 02 november, 18:00
            {lesson: lesson5, date: TimeDate.create(1636648200000)}, // 11 november, 19:30
        ]
        expect(lessons).toEqual(result)
    })

    test('Текущее время во время четвертого урока. Должен вернуть "Задания 17" с датой', () => {
        const nowDate = TimeDate.create(1635866143019) // 02 november 18:52
        const lessons = appointment.comingLessons(nowDate)
        const result = [
            {lesson: lesson5, date: TimeDate.create(1636648200000)}, // 11 november, 19:30
        ]
        expect(lessons).toEqual(result)
    })

    test('Текущее время после окончания пятого урока. Должен вернуть пустой массив', () => {
        const nowDate = TimeDate.create(1636653763069) // 11 november 21:02
        const lessons = appointment.comingLessons(nowDate)
        const result = []
        expect(lessons).toEqual(result)
    })
})

describe("pastLessons", () => {

    const appointment = Appointment.create(appointmentData)

    test('Текущее время раньше начала первого урока. Должен вернуть Должен вернуть пустой массив', () => {
        const nowDate = TimeDate.create(1630494736123) // 01 september
        const lessons = appointment.pastLessons(nowDate)
        const result = []
        expect(lessons).toEqual(result)
    })

    test('Текущее время во время первого урока. Должен вернуть Должен вернуть пустой массив', () => {
        const nowDate = TimeDate.create(1630600523123) // 02 september 19:35
        const lessons = appointment.pastLessons(nowDate)
        const result = []
        expect(lessons).toEqual(result)
    })

    test('Текущее время между вторым и третьим уроком. Должен вернуть "Задания 13" и "Задания 14" с датами', () => {
        const nowDate = TimeDate.create(1632414900453) // 23 september
        const lessons = appointment.pastLessons(nowDate)
        const result = [
            {lesson: lesson1, date: TimeDate.create(1630600200000)}, // 02 september, 19:30
            {lesson: lesson2, date: TimeDate.create(1632236400000)}, // 21 september, 18:00
        ]
        expect(lessons).toEqual(result)
    })

    test('Текущее время во время третьего урока. Должен вернуть "Задания 13" и "Задания 14" с датами', () => {
        const nowDate = TimeDate.create(1634051143019) // 12 october 18:05
        const lessons = appointment.pastLessons(nowDate)
        const result = [
            {lesson: lesson1, date: TimeDate.create(1630600200000)}, // 02 september, 19:30
            {lesson: lesson2, date: TimeDate.create(1632236400000)}, // 21 september, 18:00
        ]
        expect(lessons).toEqual(result)
    })

    const resultWith13 = [
        {lesson: lesson1, date: TimeDate.create(1630600200000)}, // 02 september, 19:30
        {lesson: lesson2, date: TimeDate.create(1632236400000)}, // 21 september, 18:00
        {lesson: lesson3, date: TimeDate.create(1634050800000)}, // 12 october, 18:00
    ]

    test('Текущее время после третьего урока. Должен вернуть "Задания 13", "Задания 14" и "Задания 15" с датами', () => {
        const nowDate = TimeDate.create(1634054743019) // 12 october 19:05
        const lessons = appointment.pastLessons(nowDate)
        expect(lessons).toEqual(resultWith13)
    })

    test('Текущее время во время четвертого урока. Должен вернуть "Задания 13", "Задания 14" и "Задания 15" с датами', () => {
        const nowDate = TimeDate.create(1635866143019) // 02 november 18:52
        const lessons = appointment.pastLessons(nowDate)
        expect(lessons).toEqual(resultWith13)
    })

    test('Текущее время после окончания пятого урока. Должен вернуть "Задания 13, Задания 14, Задания 15", "Задания 16" и "Задания 17" с датами', () => {
        const nowDate = TimeDate.create(1636653763069) // 11 november 21:02
        const lessons = appointment.pastLessons(nowDate)
        expect(lessons).toEqual(allLessons)
    })
})