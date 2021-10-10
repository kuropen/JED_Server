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
