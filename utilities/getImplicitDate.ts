import moment from "moment-timezone";

const getImplicitDate = (): string => {
    // The first update of the day is 2:10 am JST
    const FIRST_UPDATE_MINUTE = 130
    let targetDate = new Date()
    if ((((targetDate.getUTCHours() + 9) % 24) * 60 + targetDate.getUTCMinutes()) < FIRST_UPDATE_MINUTE) {
        targetDate = new Date(targetDate.getTime() - (1000 * 60 * 60 * 24))
    }
    const targetDateString = moment(targetDate).tz("Asia/Tokyo").format('YYYY-MM-DD')

    return targetDateString
}

export default getImplicitDate
