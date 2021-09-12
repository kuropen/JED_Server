import { QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { DynamoResult, FiveMinDemand } from "../types"
import DynamoClient from "./dynamoClient"

const TABLE_NAME = 'JED_FiveMinDemand'

const parseResult = (item: DynamoResult): FiveMinDemand => {
    const itemToReturn: FiveMinDemand = {
        date: item.date.S || '',
        area: item.area.S || '',
        amount: parseInt(item.amount.N || '0'),
        absTime: item.absDate.S || '',
        createdAt: item.createdAt.S || '',
        solar: parseInt(item.solar.N || '0'),
        time: item.time.S || '',
        wind: parseInt(item.wind.N || '0'),
        absDate: item.absDate.S || '',
    }
    return itemToReturn
}

export const getFiveMinDemandByArea = async (area: string, limit: number) => {
    const client = DynamoClient
    
    const params: QueryCommandInput = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "area = :area",
        ExpressionAttributeValues: {
            ':area': {S: area},
        },
        Limit: limit,
        ScanIndexForward: false,
    }

    const result = await client.send(new QueryCommand(params))
    const receivedItems = result.Items
    const itemsToReturn = receivedItems?.map((item) => {
        return parseResult(item)
    })

    return itemsToReturn
}
