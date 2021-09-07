import {
    PrismaClient,
    Area,
    PeakType,
    HourlyDemand,
    FiveMinDemand
} from "@prisma/client"
import { Kind, GraphQLScalarType } from "graphql"
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
    date?: string,
    type?: PeakType,
    areaCode?: string,
}
interface TimeDemandArgs {
    limit?: number,
    areaCode?: string,
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

const convertDigit = (input: string | number): string => {
    if (
        (typeof input === "string" && parseInt(input) < 10 && input.length < 2)
        || (typeof input === "number" && input < 10)) {
        return `0${input}`
    }
    return input.toString()
}

const convertTime = (input: string): string => {
    const timeElement = input.split(":")
    return timeElement.map((section) => convertDigit(section)).join(":")
}

export default class GraphQLRoot {
    Date: GraphQLScalarType = new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return new Date(+ast.value); // ast value is always in string format
            }
            return null;
        },
    })
    authorized<T extends IncomingMessage>(_: any, req: T) {
        return authentication(req)
    }
    allArea() {
        return (async (): Promise<Area[]> => {
            // Build actual CSV URL
            const all = await prisma.area.findMany({
                select: {
                    code: true,
                    csvFile: true,
                    csvFiveMinPos: true,
                    csvHourlyPos: true,
                    hasWindData: true,
                    id: true,
                    longName: true,
                    name: true,
                    officialWeb: true,
                    peak: {
                        where: {
                            type: "PERCENTAGE"
                        },
                        orderBy: {
                            date: "desc"
                        },
                        take: 1,
                    },
                    hourly: {
                        orderBy: {
                            id: "desc"
                        },
                        take: 1,
                    }
                }
            })
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
        const currentDate = moment().tz("Asia/Tokyo").format("YYYY-MM-DD")
        if (arg.areaCode) {
            return prisma.area.findUnique({
                where: {
                    code: arg.areaCode
                }
            }).peak({
                where: {
                    date: convertDate(arg.date || currentDate),
                    type: arg.type
                },
                orderBy: {
                    id: "desc"
                }
            })
        }
        return prisma.peakElectricity.findMany({
            where: {
                date: convertDate(arg.date || currentDate),
                type: arg.type
            },
            orderBy: {
                id: "desc"
            }
        })
    }
    hourlyDemand(arg: TimeDemandArgs): Promise<HourlyDemand[]> {
        let appliedLimit = 24
        if (arg.limit && arg.limit < 100) {
            appliedLimit = arg.limit
        }
        if (arg.areaCode) {
            return prisma.area.findUnique({
                where: {
                    code: arg.areaCode
                }
            }).hourly({
                take: appliedLimit,
                orderBy: {
                    id: "desc"
                }
            })
        }
        return prisma.hourlyDemand.findMany({
            take: appliedLimit,
            orderBy: {
                id: "desc"
            }
        })
    }
    fiveMinDemand(arg: TimeDemandArgs): Promise<FiveMinDemand[]> {
        let appliedLimit = 36
        if (arg.limit && arg.limit < 150) {
            appliedLimit = arg.limit
        }
        if (arg.areaCode) {
            return prisma.area.findUnique({
                where: {
                    code: arg.areaCode
                }
            }).fivemin({
                take: appliedLimit,
                orderBy: {
                    id: "desc"
                }
            })
        }
        return prisma.fiveMinDemand.findMany({
            take: appliedLimit,
            orderBy: {
                id: "desc"
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
                amount: peakInput.amount,
                supply: peakInput.supply,
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
                absTime: `${hourlyInput.date}T${convertDigit(hourlyInput.hour)}:00:00+09:00`
            }
        })
    }
    postFiveMinDemand<T extends IncomingMessage>(arg: PostFiveMinDemandArgs, req: T) {
        if (authentication(req) === false) {
            throw "Unauthorized Access.";
        }
        const {fiveInput} = arg
        const time = convertTime(fiveInput.time)
        return prisma.fiveMinDemand.upsert({
            where: {
                areaId_date_time: {
                    areaId: fiveInput.areaId,
                    date: convertDate(fiveInput.date),
                    time: time,
                }
            },
            update: {
                amount: fiveInput.amount,
                solar: fiveInput.solar,
            },
            create: {
                ...fiveInput,
                date: convertDate(fiveInput.date),
                absTime: `${fiveInput.date}T${time}:00+09:00`,
            }
        })
    }
}
