using AutoMapper;
using FilmFranchiseAPI.Data.Entities;
using FilmFranchiseAPI.Data.Repository;
using FilmFranchiseAPI.Exceptions;
using FilmFranchiseAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Services
{
    public class MovieService : IMovieService
    {
        private IFilmFranchiseRepository _franchiseRepository;
        private IMapper _mapper;
        public MovieService(IFilmFranchiseRepository franchiseRepository, IMapper mapper)
        {
            _franchiseRepository = franchiseRepository;
            _mapper = mapper;
        }

        private async Task ValidateFranchiseAsync(int franchiseId)
        {
            var franchise = await _franchiseRepository.GetFranchiseAsync(franchiseId);
            if (franchise == null)
                throw new NotFoundElementException($"The Book Store with id:{franchiseId} does not exists.");
        }

        public async Task<MovieModel> CreateMovieAsync(int filmFranchiseId, MovieModel movie)
        {
            await ValidateFranchiseAsync(filmFranchiseId);
            movie.FilmFranchiseId = filmFranchiseId;
            var movieEntity = _mapper.Map<MovieEntity>(movie);
            _franchiseRepository.CreateMovie(filmFranchiseId, movieEntity);
            var result = await _franchiseRepository.SaveChangesAsync();
            if (result)
            {
                return _mapper.Map<MovieModel>(movieEntity);
            }

            throw new Exception("Database Error.");
        }

        public async Task<MovieModel> GetMovieAsync(int filmFranchiseId, int movieId)
        {
            await ValidateFranchiseAsync(filmFranchiseId);
            var movie = await _franchiseRepository.GetMovieAsync(filmFranchiseId, movieId);
            if (movie == null)
                throw new NotFoundElementException($"The book with id:{movieId} does not exists for the given book store with id:{filmFranchiseId}.");

            var something = _mapper.Map<MovieModel>(movie);
            something.FilmFranchiseId = filmFranchiseId;
            return something;
        }

        public async Task<IEnumerable<MovieModel>> GetMoviesAsync(int filmFranchiseId)
        {
            await ValidateFranchiseAsync(filmFranchiseId);
            var movies = await _franchiseRepository.GetMoviesAsync(filmFranchiseId);
            //movies = movies.Select(a => a.FilmFranchise.Id == filmFranchiseId);
            //movies.First().FilmFranchise.Id = filmFranchiseId;
            var something = _mapper.Map<IEnumerable<MovieModel>>(movies);
            foreach (MovieModel movie in something)
            {
                movie.FilmFranchiseId = filmFranchiseId;
            }
            return something;
        }

        public async Task<MovieModel> UpdateMovieAsync(int filmFranchiseId, int movieId, MovieModel movie)
        {
            await GetMovieAsync(filmFranchiseId, movieId);
            var movieEntity = _mapper.Map<MovieEntity>(movie);
            movieEntity.Id = movieId;
            await _franchiseRepository.UpdateMovieAsync(filmFranchiseId, movieId, movieEntity);
            var result = await _franchiseRepository.SaveChangesAsync();
            if (result)
            {
                return _mapper.Map<MovieModel>(movieEntity);
            }

            throw new Exception("Database Error.");
        }

        public async Task DeleteMovieAsync(int filmFranchiseId, int movieId)
        {
            await GetMovieAsync(filmFranchiseId, movieId);
            await _franchiseRepository.DeleteMovieAsync(filmFranchiseId, movieId);
            var result = await _franchiseRepository.SaveChangesAsync();
            if (!result)
            {
                throw new Exception("Database Error.");
            }
        }
    }
}
