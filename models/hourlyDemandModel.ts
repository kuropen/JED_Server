import { DynamoDBClient, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { DynamoResult, HourlyDemand } from "../types"
import DynamoClient from "./dynamoClient"

const TABLE_NAME = 'JED_HourlyDemand'

const parseResult = (item: DynamoResult): HourlyDemand => {
    const itemToReturn: HourlyDemand = {
        date: item.date.S || '',
        area: item.area.S || '',
        supply: parseInt(item.supply.N || '0'),
        amount: parseInt(item.amount.N || '0'),
        percentage: parseInt(item.percentage.N || '0'),
        absDate: item.absDate.S || '',
        createdAt: item.createdAt.S || '',
        hour: parseInt(item.hour.N || '0'),
        absTime: item.absDate.S || '',
    }
    return itemToReturn
}

export const getHourlyDemandByArea = async (area: string, limit: number) => {
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

export const getHourlyDemandWithoutArea = async (limit: number) => {
    const client = DynamoClient

    const params: ScanCommandInput = {
        TableName: TABLE_NAME,
        Limit: limit,
    }

    const result = await client.send(new ScanCommand(params))
    const receivedItems = result.Items
    const itemsToReturn = receivedItems?.map((item) => {
        return parseResult(item)
    })

    return itemsToReturn
}
