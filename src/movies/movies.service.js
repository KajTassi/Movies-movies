const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//query to list all movies
function list() {
  return knex("movies").select("*");
}

//query to list all movie theaters where a movie is showing
function listMoviesShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*", "mt.is_showing")
    .where({ "mt.is_showing": true })
    .distinct("mt.is_showing");
}

//query to list all movies where a specific movie shows first
function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

//query to list all movies showing at theaters and in theaters; so tables must be joined
function readTheatersPlayingMovie(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ "m.movie_id": movieId });
}

//query to list all movies with a review where a critic can be inserted
function readMovieReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ "m.movie_id": movieId })
    .then((reviews) => reviews.map(addCritic));
}

module.exports = {
  list,
  listMoviesShowing,
  read,
  readTheatersPlayingMovie,
  readMovieReviews,
};
