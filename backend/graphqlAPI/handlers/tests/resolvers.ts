type Parent = {
    finalTestId?: number
    testId?: number
}
type Args = {
    id?: number
}
type Context = {
    dataSource: DataSource
}
export type DataSource = {
    get: Get
}
export type Get = (filter: Filter) => Promise<TestData>
type Filter = {
    id: number
}
type Info = {
    fieldName: string
}
export type TestData = {
    id: number
    title: string
    exercises: ExerciseData[]
}
type ExerciseData = {
    problemIdList: number[],
    withDetailedAnswer: boolean,
    maxEstimate: number
}
type TestResponse = {
    id: number
    title: string
    exercises: ExerciseResponse[]
}
type ExerciseResponse = {
    problemId: number,
    withDetailedAnswer: boolean
}

const test = async (parent: Parent, args: Args, context: Context, info: Info): Promise<TestResponse> => {
    const {fieldName} = info
    const {dataSource} = context
    const {get} = dataSource
    const getId = () => {
        switch (fieldName) {
            case "finalTest":
                if (!parent.finalTestId) throw new Error("parent.finalTestId должен принимать значение")
                return parent.finalTestId
            case "test":
                if (parent.testId) return parent.testId
                if (args.id) return args.id
                throw new Error("args.id или parent.testId должен принимать значение")
        }
        throw new Error(`для fieldName=${fieldName} case не предусмотрен`)
    }
    const testData = await get({id: getId()})
    return getResponse(testData)
}

function getResponse(test: TestData): TestResponse {
    return {
        id: test.id,
        title: test.title,
        exercises: test.exercises.map(exercise => {
            const {problemIdList, withDetailedAnswer} = exercise
            const getProblemId = () => {
                return problemIdList[Math.floor(Math.random() * problemIdList.length)]
            }
            return {
                problemId: getProblemId(),
                withDetailedAnswer
            }
        })
    }
}

export const resolvers = {
    Lesson: {
        finalTest: test
    },
    Query: {
        test
    },
    TestResult: {
        test
    }
}