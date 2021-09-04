import {
    PrismaClient,
    Area,
    PeakType
} from "@prisma/client"
import { IncomingMessage } from "http"
import moment from "moment-timezone"
import ReadMessage from "../message"
import authentication from "./authentication"
const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
})

interface AreaByCodeArgs {
    code: string
}
interface PeakElectricityArgs {
    date: string,
    type?: PeakType,
}
interface PostPeakElectricityArgs {
    peakInput: PostPeakElectricityInput
}
interface PostHourlyDemandArgs {
    hourlyInput: PostHourlyDemandInput
}
interface PostFiveMinDemandArgs {
    fiveInput: PostFiveMinDemandInput
}
interface PostPeakElectricityInput {
    areaId: number,
    date: string,
    expectedHour: string,
    type: PeakType,
    percentage: number,
    reservePct: number,
    isTomorrow: boolean,
    amount: number,
    supply: number,
}
interface PostHourlyDemandInput {
    areaId: number,
    date: string,
    hour: number,
    amount: number,
    supply: number,
    percentage: number,
}
interface PostFiveMinDemandInput {
    areaId: number,
    date: string,
    time: string,
    amount: number,
    solar: number,
}

const convertDate = (input: string): string => {
    return `${input}T00:00:00Z`
}

export default class GraphQLRoot {
    authorized<T extends IncomingMessage>(_: any, req: T) {
        return authentication(req)
    }
    allArea() {
        return (async (): Promise<Area[]> => {
            // Build actual CSV URL
            const all = await prisma.area.findMany()
            const converted = all.map((area) => {
                const date = moment().tz("Asia/Tokyo").format("YYYYMMDD")
                const actualCsv = area.csvFile.replace('YYYYMMDD', date)
                return Object.assign(area, {
                    csvFile: actualCsv
                })
            })
            return converted
        })()
    }
    areaByCode(args: AreaByCodeArgs) {
        return prisma.area.findFirst({
            where: {
                ...args
            }
        })
    }
    message() {
        return ReadMessage()
    }
    peakElectricity(arg: PeakElectricityArgs) {
        return prisma.peakElectricity.findMany({
            where: {
                date: convertDate(arg.date),
                type: arg.type
            }
        })
    }
    postPeakElectricity<T extends IncomingMessage>(arg: PostPeakElectricityArgs, req: T) {
        if (authentication(req) === false) {
            throw "Unauthorized Access.";
        }
        const {peakInput} = arg
        return prisma.peakElectricity.upsert({
            where: {
                areaId_type_date: {
                    areaId: peakInput.areaId,
                    type: peakInput.type,
                    date: convertDate(peakInput.date),
                }
            },
            update: {
                expectedHour: peakInput.expectedHour,
                percentage: peakInput.percentage,
                reservePct: peakInput.reservePct,
            },
            create: {
                ...peakInput,
                date: convertDate(peakInput.date),
            }
        })
    }
    postHourlyDemand<T extends IncomingMessage>(arg: PostHourlyDemandArgs, req: T) {
        if (authentication(req) === false) {
            throw "Unauthorized Access.";
        }
        const {hourlyInput} = arg
        return prisma.hourlyDemand.upsert({
            where: {
                areaId_date_hour: {
                    areaId: hourlyInput.areaId,
                    date: convertDate(hourlyInput.date),
                    hour: hourlyInput.hour,
                }
            },
            update: {
                percentage: hourlyInput.percentage,
                supply: hourlyInput.supply,
                amount: hourlyInput.amount,
            },
            create: {
                ...hourlyInput,
                date: convertDate(hourlyInput.date),
            }
        })
    }
    postFiveMinDemand<T extends IncomingMessage>(arg: PostFiveMinDemandArgs, req: T) {
        if (authentication(req) === false) {
            throw "Unauthorized Access.";
        }
        const {fiveInput} = arg
        return prisma.fiveMinDemand.upsert({
            where: {
                areaId_date_time: {
                    areaId: fiveInput.areaId,
                    date: convertDate(fiveInput.date),
                    time: fiveInput.time,
                }
            },
            update: {
                amount: fiveInput.amount,
                solar: fiveInput.solar,
            },
            create: {
                ...fiveInput,
                date: convertDate(fiveInput.date),
            }
        })
    }
}
