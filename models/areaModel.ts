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

import { AppConfigClient, GetConfigurationCommand, GetConfigurationCommandOutput } from "@aws-sdk/client-appconfig"
import { AreaFundamentals } from "../types"

const client = new AppConfigClient({region: 'ap-northeast-1'})

const getConfiguration = async (): Promise<AreaFundamentals[]> => {
    const cmd = new GetConfigurationCommand({
        Application: 'JED',
        ClientId: 'server',
        Environment: process.env.AC_ENV || 'Testing',
        Configuration: 'AreaInfo'
    })
    const response: GetConfigurationCommandOutput = await client.send(cmd)

    const rawContent = response.Content
    const decoded = new TextDecoder().decode(rawContent)
    return JSON.parse(decoded)
}

export const getAllArea = async () => {
    return getConfiguration();
}

export const getSingleArea = async (code: string) => {
    const candidate = (await getAllArea()).filter((area) => {
        return area.code === code
    })
    if (candidate.length > 0) {
        return candidate[0]
    }
    return null
}
