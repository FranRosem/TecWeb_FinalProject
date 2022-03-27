using FilmFranchiseAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Services
{
    public interface IMovieService
    {
        Task<IEnumerable<MovieModel>> GetMoviesAsync(int filmFranchiseId);
        Task<MovieModel> GetMovieAsync(int filmFranchiseId, int movieId);
        Task<MovieModel> CreateMovieAsync(int filmFranchiseId, MovieModel movie);
        Task<MovieModel> UpdateMovieAsync(int filmFranchiseId, int movieId, MovieModel movie);
        Task DeleteMovieAsync(int filmFranchiseId, int movieId);
    }
}
