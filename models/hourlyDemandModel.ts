/*!
    Japan Electricity Dashboard : GraphQL Server
    Copyright (C) 2021 Hirochika Yuda, a.k.a. Kuropen.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb"
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
