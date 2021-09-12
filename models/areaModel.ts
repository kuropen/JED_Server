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
