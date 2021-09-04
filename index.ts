import express from "express"
import { graphqlHTTP } from "./node_modules/express-graphql/index"
import { buildSchema } from "graphql"
import { readFileSync } from "fs"
import GraphQLRoot from "./graphql/root"

function jedServer() {
    const port = process.env.PORT || 4000
    const app = express()

    const schema = buildSchema(readFileSync('./graphql/schema.graphql').toString())

    app.use(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            rootValue: new GraphQLRoot(),
            graphiql: true,
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

export default jedServer
