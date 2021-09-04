import { IncomingMessage } from "http"

export default function authentication(req: IncomingMessage): boolean {
    const { SERVER_KEY } = process.env
    const { authorization } = req.headers
    return SERVER_KEY === authorization
}
