import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
})

export const seed = async () => {
    const hokkaido = await prisma.area.upsert({
        where: {
            code: 'hokkaido'
        },
        update: {},
        create: {
            code: 'hokkaido',
            name: '北海道',
            longName: '北海道電力ネットワーク',
            officialWeb: 'http://denkiyoho.hepco.co.jp/area_forecast.html',
            csvFile: 'http://denkiyoho.hepco.co.jp/area/data/juyo_01_YYYYMMDD.csv'
        }
    })
    const tohoku = await prisma.area.upsert({
        where: {
            code: 'tohoku'
        },
        update: {
            hasWindData: true,
        },
        create: {
            code: 'tohoku',
            name: '東北',
            longName: '東北電力ネットワーク',
            officialWeb: 'https://setsuden.nw.tohoku-epco.co.jp/graph.html',
            csvFile: 'https://setsuden.nw.tohoku-epco.co.jp/common/demand/juyo_02_YYYYMMDD.csv',
            hasWindData: true,
        }
    })
    const tokyo = await prisma.area.upsert({
        where: {
            code: 'tokyo'
        },
        update: {},
        create: {
            code: 'tokyo',
            name: '関東',
            longName: '東京電力パワーグリッド',
            officialWeb: 'https://www.tepco.co.jp/forecast/',
            csvFile: 'https://www.tepco.co.jp/forecast/html/images/juyo-d-j.csv'
        }
    })
    const chubu = await prisma.area.upsert({
        where: {
            code: 'chubu'
        },
        update: {},
        create: {
            code: 'chubu',
            name: '中部',
            longName: '中部電力パワーグリッド',
            officialWeb: 'https://powergrid.chuden.co.jp/denkiyoho/',
            csvFile: 'https://powergrid.chuden.co.jp/denki_yoho_content_data/juyo_cepco003.csv'
        }
    })
    const hokuriku = await prisma.area.upsert({
        where: {
            code: 'hokuriku'
        },
        update: {},
        create: {
            code: 'hokuriku',
            name: '北陸',
            longName: '北陸電力送配電',
            officialWeb: 'http://www.rikuden.co.jp/nw/denki-yoho/index.html',
            csvFile: 'http://www.rikuden.co.jp/nw/denki-yoho/csv/juyo_05_YYYYMMDD.csv'
        }
    })
    const kansai = await prisma.area.upsert({
        where: {
            code: 'kansai'
        },
        update: {
            csvHourlyPos: 17,
            csvFiveMinPos: 58,
        },
        create: {
            code: 'kansai',
            name: '関西',
            longName: '関西電力送配電',
            officialWeb: 'https://www.kansai-td.co.jp/denkiyoho/index.html',
            csvFile: 'https://www.kansai-td.co.jp/yamasou/juyo1_kansai.csv',
            csvHourlyPos: 17,
            csvFiveMinPos: 58,
        }
    })
    const chugoku = await prisma.area.upsert({
        where: {
            code: 'chugoku'
        },
        update: {},
        create: {
            code: 'chugoku',
            name: '中国',
            longName: '中国電力ネットワーク',
            officialWeb: 'https://www.energia.co.jp/nw/jukyuu/',
            csvFile: 'https://www.energia.co.jp/nw/jukyuu/sys/juyo_07_YYYYMMDD.csv'
        }
    })
    const shikoku = await prisma.area.upsert({
        where: {
            code: 'shikoku'
        },
        update: {},
        create: {
            code: 'shikoku',
            name: '四国',
            longName: '四国電力送配電',
            officialWeb: 'https://www.yonden.co.jp/nw/denkiyoho/index.html',
            csvFile: 'https://www.yonden.co.jp/nw/denkiyoho/juyo_shikoku.csv'
        }
    })
    const kyushu = await prisma.area.upsert({
        where: {
            code: 'kyushu'
        },
        update: {},
        create: {
            code: 'kyushu',
            name: '九州',
            longName: '九州電力送配電',
            officialWeb: 'https://www.kyuden.co.jp/td_power_usages/pc.html',
            csvFile: 'https://www.kyuden.co.jp/td_power_usages/csv/juyo-hourly-YYYYMMDD.csv'
        }
    })
    const okinawa = await prisma.area.upsert({
        where: {
            code: 'okinawa'
        },
        update: {},
        create: {
            code: 'okinawa',
            name: '沖縄',
            longName: '沖縄電力',
            officialWeb: 'https://www.okiden.co.jp/denki2/',
            csvFile: 'https://www.okiden.co.jp/denki2/juyo_10_YYYYMMDD.csv'
        }
    })

    console.log({
        hokkaido,
        tohoku,
        tokyo,
        chubu,
        hokuriku,
        kansai,
        chugoku,
        shikoku,
        kyushu,
        okinawa,
    })
    process.exit(0)
}
seed()
