const { buildSchema } = require("graphql");

module.exports = buildSchema(`

enum Status{
    LIVE
    FINISHED
    HALFTIME
    UNKNOWN
    PREMATCH
}

enum EventsType{
    RED_CARD
    YELLOW_CARD
    SUBS
    PENAL
    CORNERS
    UNKNOWN
    HOME
    AWAY
}

input LiveScoreInput{
    leagueName: String!,
    matches: [ID!]
}

input MatchDetailsInput{
    startTime: String!
    league: String
    homeTeam: String,
    awayTeam: String,
    status: Status!
    minute: Int!
    winner: String,
    events: ID
    goals: String
    excitementRating: String
    oddsHome: Float,
    oddsAway: Float,
    oddsDraw: Float,
    matchPreview: ID
    isFavorite: Boolean
}

input EventsInput{
    homeEvents: [ID]
    awayEvents: [ID]
}

input EventInput{
    name: EventsType,
    number: String
}

input MatchPreviewInput{
    previewContent: [ID]
}

input PreviewContentInput{
    content: String
    name: String
}

type MatchDetails{
    _id: ID!
    startTime: String!
    league: String
    homeTeam: String,
    awayTeam: String,
    status: Status!
    minute: Int!
    winner: String,
    events: Events
    goals: String
    excitementRating: String
    oddsHome: Float,
    oddsAway: Float,
    oddsDraw: Float,
    matchPreview: MatchPreview
    isFavorite: Boolean
}

type LiveScores{
    _id: ID!
    leagueName: String,
    matches: [MatchDetails]
}

type FavoriteMatches{
    username: String
    match: [MatchDetails]
}

type MatchPreview{
    _id: ID!
    previewContent: [PreviewContent]
}

type PreviewContent{
    _id: ID!
    content: String
    name: String
}

type Events{
    _id: ID!
    homeEvents: [Event]
    awayEvents: [Event]
}
type Event{
    _id: ID!
    name: EventsType,
    number: String
}

type RootQuery {
    liveScores: [LiveScores]
    matchDetails(matchId : ID!): MatchDetails
    favoriteMatches(username: String!): FavoriteMatches
}
type RootMutation {
   createLiveScores(input: LiveScoreInput): LiveScores
   createMatchDetails(input: MatchDetailsInput!): MatchDetails
   createMatchPreview(input: [PreviewContentInput!]): MatchPreview
   createEvents(inputHome: [EventInput], inputAway: [EventInput]): Events
   addToFavorite(username: String, matchID: ID): FavoriteMatches
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
