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

import express from "express"
import { graphqlHTTP } from "./node_modules/express-graphql/index"
import { buildSchema } from "graphql"
import { readFileSync } from "fs"
import GraphQLRoot from "./graphql/root"
import cors from "cors"

function jedServer() {
    const isDevelop = (process.env.NODE_ENV || 'develop') === 'develop'
    const port = process.env.PORT || 4000
    const app = express()

    const schema = buildSchema(readFileSync('./graphql/schema.graphql').toString())

    app.use(cors())

    app.use(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            rootValue: new GraphQLRoot(),
            graphiql: isDevelop,
        })
    )

    // redirect to GraphiQL for while
    app.get('/', (_, res) => {
        res.redirect(307, '/graphql')
    })

    app.listen(port)
    console.log('Server listening on `localhost:' + port + '`.')
}

jedServer()
