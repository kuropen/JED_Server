import { readFile } from "fs"

export default async function ReadMessage(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        readFile('./message/message_text.md', (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data.toString())
        })
    })
}
