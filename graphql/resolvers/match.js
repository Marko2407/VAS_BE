const LiveScores = require("../../models/livescores/livescores");
const MatchDetails = require("../../models/matchDetails/matchDetails");
const FavoriteMatches = require("../../models/favoriteMatches/favoriteMatch");
const MatchPreview = require("../../models/matchDetails/matchPreview");
const MatchPreviewContent = require("../../models/matchDetails/previewContent");
const Event = require("../../models/matchDetails/event");
const Events = require("../../models/matchDetails/events");
const livescores = require("../../models/livescores/livescores");

const matchResolver = {
  RootQuery: {
    currentOffer: async () => {
      try {
        const today = new Date();
        const currentDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const dateString = currentDate.toISOString().split("T")[0];

        console.log("current date", dateString);
        const liveScores = await LiveScores.find({ date: dateString });
        console.log("liveScores", liveScores);
        return Promise.all(liveScores.map(transformCurrentOffer));
      } catch (error) {
        throw error;
      }
    },
    liveScores: async () => {
      try {
        const liveScores = await LiveScores.find();
        return Promise.all(liveScores.map(transformLivescoreMatches));
      } catch (error) {
        throw error;
      }
    },
    matchDetails: async (_p, { matchId }, _c, _i) => {
      try {
        const result = matches(matchId);

        return result;
      } catch (error) {
        throw error;
      }
    },
    favoriteMatches: async (_p, args, _c, _i) => {
      try {
        const favoriteMatch = await FavoriteMatches.findOne({
          username: args.username,
        });

        console.log("fac", favoriteMatch);

        if (!favoriteMatch == null) {
          throw new Error("No favorite matches found for this user");
        }

        const transformedFavoriteMatch = await transformFavoriteMatches(
          favoriteMatch
        );
        console.log("transformedFavoriteMatch", transformedFavoriteMatch);
        return transformedFavoriteMatch;
      } catch (error) {
        throw new Error("Error fetching favorite matches:", error);
      }
    },
  },
  RootMutation: {
    createLiveScores: async (_p, args, _c, _i) => {
      try {
        const today = new Date();
        const currentDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        )
          .toISOString()
          .split("T")[0];

        let liveScores = await LiveScores.findOne({
          leagueName: args.input.leagueName,
          date: currentDate,
        });

        if (liveScores) {
          liveScores.matches = [...liveScores.matches, ...args.input.matches];
        } else {
          liveScores = new LiveScores({
            leagueName: args.input.leagueName,
            matches: args.input.matches,
            date: currentDate,
          });
        }

        const result = await liveScores.save();
        return result;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    createMatchDetails: async (_p, args, _c, _i) => {
      console.log("Match:", args.input);
      const matchDetails = new MatchDetails({
        startTime: args.input.startTime,
        league: args.input.league,
        homeTeam: args.input.homeTeam,
        awayTeam: args.input.awayTeam,
        status: args.input.status,
        minute: args.input.minute,
        winner: args.input.winner,
        events: args.input.events,
        goals: args.input.goals,
        excitementRating: args.input.excitementRating,
        oddsHome: args.input.oddsHome,
        oddsAway: args.input.oddsAway,
        oddsDraw: args.input.oddsDraw,
        matchPreview: args.input.matchPreview,
        isFavorite: args.input.isFavorite,
      });

      const result = await matchDetails.save();
      return result;
    },
    createMatchPreview: async (_p, args, _c, _i) => {
      try {
        let previewContentIds = [];
        for (const contentInput of args.input) {
          const matchPreviewContent = new MatchPreviewContent(contentInput);
          const savedContent = await matchPreviewContent.save();
          previewContentIds.push(savedContent._id); // Collecting the ID
        }

        const matchPreview = new MatchPreview({
          previewContent: previewContentIds,
        });

        const result = await matchPreview.save();
        return result;
      } catch (error) {
        throw new Error("Error creating MatchPreview:", error);
      }
    },
    createEvents: async (_p, args, _c, _i) => {
      try {
        let homeEventIds = [];
        let awayEventIds = [];
        console.log(args.inputHome);
        for (let homeEventInput of args.inputHome) {
          const homeEvent = new Event({
            name: homeEventInput.name,
            number: homeEventInput.number,
          });
          console.log(homeEventInput);
          const savedHomeEvent = await homeEvent.save();
          console.log(savedHomeEvent);
          homeEventIds.push(savedHomeEvent._id);
        }

        for (const awayEventInput of args.inputAway) {
          const awayEvent = new Event({
            name: awayEventInput.name,
            number: awayEventInput.number,
          });
          const savedAwayEvent = await awayEvent.save();
          awayEventIds.push(savedAwayEvent._id);
        }

        console.log(homeEventIds);
        console.log(awayEventIds);

        const events = new Events({
          homeEvents: homeEventIds,
          awayEvents: awayEventIds,
        });

        console.log("thjoos");
        const result = await events.save();
        return result;
      } catch (error) {
        throw new Error("Error creating Events:", error);
      }
    },
    addToFavorite: async (_p, args, _c, _i) => {
      try {
        const { username, matchID } = args;

        const movies = await MatchDetails.findById(matchID);

        if (movies) {
          movies.isFavorite = !movies.isFavorite;
          await movies.save();
        }

        let favorite = await FavoriteMatches.findOneAndUpdate(
          { username },
          { $setOnInsert: { username, match: [] } },
          { new: true, upsert: true }
        );

        const index = favorite.match.findIndex((id) => id.equals(matchID));
        if (index > -1) {
          favorite.match.splice(index, 1);
        } else {
          favorite.match.push(matchID);
        }

        await favorite.save();

        const matchDetails = await Promise.all(
          favorite.match.map((matchId) => matches(matchId))
        );

        return {
          username: favorite.username,
          match: matchDetails.filter((md) => md !== null), // Filter out any null results
        };
      } catch (error) {
        console.error(error);
        throw new Error("Error updating favorite matches:", error);
      }
    },
  },
};

module.exports = matchResolver;

// TRANSFORMATORI
const transformLivescoreMatches = async (livescore) => {
  const matchDetailsPromises = livescore.matches.map(async (matchId) => {
    return matches(matchId);
  });

  const matchDetails = await Promise.all(matchDetailsPromises);

  return {
    _id: livescore._id,
    leagueName: livescore.leagueName,
    matches: matchDetails,
  };
};

const transformCurrentOffer = async (offer) => {
  console.log("offer", offer);
  const matchDetailsPromises = offer.matches.map(async (matchId) => {
    return matches(matchId);
  });

  const matchDetails = await Promise.all(matchDetailsPromises);

  return {
    date: offer.date,
    _id: offer._id,
    leagueName: offer.leagueName,
    matches: matchDetails,
  };
};

const transformFavoriteMatches = async (favoriteMatch) => {
  const matchDetailsPromises = favoriteMatch.match.map(async (matchId) => {
    return matches(matchId);
  });

  const matchDetails = await Promise.all(matchDetailsPromises);
  console.log("matche", matchDetails);
  return {
    _id: favoriteMatch._id,
    username: favoriteMatch.username,
    match: matchDetails,
  };
};

const matches = async (matchId) => {
  try {
    const result = await MatchDetails.findById(matchId)
      .populate({
        path: "events",
        populate: {
          path: "homeEvents awayEvents",
          model: "Eventi",
        },
      })
      .populate({
        path: "matchPreview",
        populate: { path: "previewContent", model: "PreviewContent" }, // Nested population
      });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
