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
