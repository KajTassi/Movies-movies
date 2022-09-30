const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validation function for a movie exisiting, the validate an existing id
async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

//function for pulling movie data
function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

//function for 
async function readTheatersPlayingMovie(req, res) {
  const movieId = res.locals.movie.movie_id;
  const data = await moviesService.readTheatersPlayingMovie(movieId);
  res.json({ data });
}

async function readMovieReviews(req, res) {
  const movieId = res.locals.movie.movie_id;
  const data = await moviesService.readMovieReviews(movieId);
  res.json({ data });
}

//validation function for if the movie is showing
async function list(req, res) {
  const { is_showing } = req.query;
  if (is_showing) {
    const data = await moviesService.listMoviesShowing();
    return res.json({ data });
  }
  const data = await moviesService.list();
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  readTheatersPlayingMovie: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheatersPlayingMovie),
  ],
  readMovieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMovieReviews),
  ],
};
