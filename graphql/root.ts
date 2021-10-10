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

import { Kind, GraphQLScalarType } from "graphql"
import { getAllArea, getSingleArea } from "../models/areaModel"
import { getFiveMinDemandByArea } from "../models/fiveMinDemandModel"
import { getHourlyDemandByArea } from "../models/hourlyDemandModel"
import { getPeakElectricityByAreaAndDate, getPeakElectricityByAreaAndDateAndType, getPeakElectricityWithoutArea } from "../models/peakElectricityModel"
import { Area, FiveMinDemand, HourlyDemand } from "../types"
import getImplicitDate from "../utilities/getImplicitDate";

type PeakType = "AMOUNT" | "PERCENTAGE"

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
    areaCode: string,
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
    async allArea() {
        const rawAllArea = await getAllArea()
        const allArea: Promise<Area>[] = rawAllArea.map(async (area) => {
            const joinedArea: Area = {
                ...area,
                peak: await this.peakElectricity({areaCode: area.code, type: "PERCENTAGE"}),
                hourly: await this.hourlyDemand({areaCode: area.code, limit: 1}),
            }
            return joinedArea
        })
        return Promise.all(allArea)
    }
    areaByCode(args: AreaByCodeArgs) {
        return getSingleArea(args.code)
    }
    async peakElectricity(arg: PeakElectricityArgs) {
        const date = arg.date || getImplicitDate()
        if (arg.areaCode) {
            let result
            if (arg.type) {
                result = await getPeakElectricityByAreaAndDateAndType(arg.areaCode, date, arg.type)
            } else {
                result = await getPeakElectricityByAreaAndDate(arg.areaCode, date)
            }
            return result
        } else {
            const result = await getPeakElectricityWithoutArea(arg.date, arg.type)
            return result?.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            })
        }
    }
    async hourlyDemand(arg: TimeDemandArgs): Promise<HourlyDemand[] | undefined> {
        let appliedLimit = 24
        if (arg.limit && arg.limit < 100) {
            appliedLimit = arg.limit
        }
        return getHourlyDemandByArea(arg.areaCode, appliedLimit)
    }
    fiveMinDemand(arg: TimeDemandArgs): Promise<FiveMinDemand[] | undefined> {
        let appliedLimit = 36
        if (arg.limit && arg.limit < 150) {
            appliedLimit = arg.limit
        }
        return getFiveMinDemandByArea(arg.areaCode, appliedLimit)
    }
}
