import {Course, DataSource} from "./resolvers";
import type {DynamoNumber, DynamoNumberList, DynamoString} from "dynamoDBAPI";

type GetDataSource = (dbAPI: DbAPI) => DataSource
type DbAPI = {
    getItem: (tableName: string, key: Key) => Promise<Item>
}
type Key = {
    id: DynamoNumber
}
type Item = {
    id: DynamoNumber,
    title: DynamoString,
    lessonIdList: DynamoNumberList
}

export const getDataSource: GetDataSource = (dbAPI) => {

    const {getItem} = dbAPI

    const get = async (id: number) : Promise<Course> => {
        const {title, lessonIdList} = await getItem("courses", {id: {N: String(id)}})
        return {
            id,
            title: title.S,
            lessonIdList: lessonIdList.L.map(id => Number(id.N))
        }
    }

    return {get}
}