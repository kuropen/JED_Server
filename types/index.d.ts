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

import { AttributeValue } from "@aws-sdk/client-dynamodb"

export type AreaFundamentals = {
    id: number
    code: string
    name: string
    longName: string
    officialWeb: string
    csvFile: string
    csvFiveMinPos: number
    csvHourlyPos: number
    hasWindData: boolean
}

export type Area = AreaFundamentals & {
    peak?: PeakElectricity[]
    hourly?: HourlyDemand[]
}

export type PeakType = "AMOUNT" | "PERCENTAGE"

export type PeakElectricity = {
    area: string
    date: string
    expectedHour: string
    type: PeakType
    percentage: number
    reservePct: number
    isTomorrow: boolean
    amount: number
    supply: number
}

export type HourlyDemand = {
    createdAt: string
    area: string
    date: string
    hour: number
    amount: number
    supply: number
    percentage: number
    absDate: string
    absTime: string
}

export type FiveMinDemand = {
    createdAt: string
    area: string
    date: string
    time: string
    amount: number
    solar: number
    wind?: number
    absDate: string
    absTime: string
}

export type Dictionary<T> = {[key: string]: T}
export type DynamoResult = Dictionary<AttributeValue>
