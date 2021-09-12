import { AttributeValue, DynamoDBClient, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb"
import { Dictionary, DynamoResult, PeakElectricity, PeakType } from "../types"
import DynamoClient from "./dynamoClient"

const TABLE_NAME = 'JED_PeakElectricity'

const validateType = (val?: string): PeakType => {
    if (val === "PERCENTAGE") {
        return val
    }
    return "AMOUNT"
}

const parseResult = (item: DynamoResult): PeakElectricity => {
    const itemToReturn: PeakElectricity = {
        date: item.date.S || '',
        area: item.area.S || '',
        supply: parseInt(item.supply.N || '0'),
        amount: parseInt(item.amount.N || '0'),
        percentage: parseInt(item.percentage.N || '0'),
        reservePct: parseInt(item.reservePct.N || '0'),
        expectedHour: item.expectedHour.S || '',
        type: validateType(item.type.S),
        isTomorrow: item.isTomorrow.BOOL || false,
    }
    return itemToReturn
}

export const getPeakElectricityByAreaAndDate = async (area: string, date: string) => {
    const client = DynamoClient
    
    const params: QueryCommandInput = {
        TableName: TABLE_NAME,
        IndexName: 'area-date-index',
        KeyConditionExpression: "area = :area AND #date = :date",
        ExpressionAttributeValues: {
            ':area': {S: area},
            ':date': {S: date},
        },
        ExpressionAttributeNames: {
            '#date': 'date', // date is reserved keyword
        }
    }

    const result = await client.send(new QueryCommand(params))
    const receivedItems = result.Items
    const itemsToReturn = receivedItems?.map((item) => {
        return parseResult(item)
    })

    return itemsToReturn
}

export const getPeakElectricityByAreaAndDateAndType = async (area: string, date: string, type: PeakType) => {
    const client = DynamoClient
    
    const params: QueryCommandInput = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "area = :area AND date_type = :dateType",
        ExpressionAttributeValues: {
            ':area': {S: area},
            ':dateType': {S: `${date}_${type}`},
        },
    }
    const result = await client.send(new QueryCommand(params))
    const receivedItems = result.Items
    const itemsToReturn = receivedItems?.map((item) => {
        return parseResult(item)
    })

    return itemsToReturn
}

export const getPeakElectricityWithoutArea = async (date?: string, type?: PeakType) => {
    const client = DynamoClient

    const filterExpressions = []
    const expressionVariables: Dictionary<AttributeValue> = {}
    const expressionAttributes: Dictionary<string> = {}
    if (date) {
        filterExpressions.push('#date = :date')
        expressionVariables[':date'] = {S: date}
        expressionAttributes['#date'] = 'date'
    }
    if (type) {
        filterExpressions.push('#type = :type')
        expressionVariables[':type'] = {S: type}
        expressionAttributes['#type'] = 'type'
    }

    
    const params: ScanCommandInput = {
        TableName: 'JED_PeakElectricity',
        FilterExpression: filterExpressions.join(' AND '),
        ExpressionAttributeNames: expressionAttributes,
        ExpressionAttributeValues: expressionVariables,
    }

    const result = await client.send(new ScanCommand(params))
    const receivedItems = result.Items
    const itemsToReturn = receivedItems?.map((item) => {
        return parseResult(item)
    })

    return itemsToReturn
    
}