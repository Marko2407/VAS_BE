const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type RootQuery {
    _empty: String
}
type RootMutation {
    _empty: String
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
