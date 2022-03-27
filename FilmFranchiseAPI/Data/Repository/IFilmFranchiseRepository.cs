using FilmFranchiseAPI.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Data.Repository
{
    public interface IFilmFranchiseRepository
    {
        //Franchises
        Task<IEnumerable<FilmFranchiseEntity>> GetFranchisesAsync(string direction, string orderBy);
        Task<FilmFranchiseEntity> GetFranchiseAsync(int filmFranchiseId, bool showFilmFranchise = false);
        void CreateFranchise(FilmFranchiseEntity filmFranchise);
        Task UpdateFranchiseAsync(int filmFranchiseId, FilmFranchiseEntity filmFranchise);
        Task DeleteFranchiseAsync(int filmFranchiseId);


        //Movies
        Task<IEnumerable<MovieEntity>> GetMoviesAsync(int filmFranchiseId);
        Task<MovieEntity> GetMovieAsync(int filmFranchiseId, int movieId);
        void CreateMovie(int filmFranchiseId, MovieEntity movie);
        Task UpdateMovieAsync(int filmFranchiseId, int movieId, MovieEntity movie);
        Task DeleteMovieAsync(int filmFranchiseId, int movieId);


        //Método Asincronico para el Repositorio
        Task<bool> SaveChangesAsync();
    }
}
