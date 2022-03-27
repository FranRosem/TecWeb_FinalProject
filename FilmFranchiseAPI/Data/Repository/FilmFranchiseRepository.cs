using FilmFranchiseAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Data.Repository
{
    public class FilmFranchiseRepository : IFilmFranchiseRepository
    {
        //https://docs.microsoft.com/en-us/ef/ef6/saving/change-tracking/entity-state

        private FilmFranchiseDbContext _dbContext;
        public FilmFranchiseRepository(FilmFranchiseDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Film Franchises
        public void CreateFranchise(FilmFranchiseEntity filmFranchise)
        {
            _dbContext.FilmFranchises.Add(filmFranchise);
        }

        public async Task<FilmFranchiseEntity> GetFranchiseAsync(int filmFranchiseId, bool showFilmFranchise = false)
        {
            IQueryable<FilmFranchiseEntity> query = _dbContext.FilmFranchises;
            query = query.AsNoTracking();
            if (showFilmFranchise)
            {
                query = query.Include(f => f.Movies);
            }
            return await query.FirstOrDefaultAsync(m => m.Id == filmFranchiseId);
        }

        public async Task<IEnumerable<FilmFranchiseEntity>> GetFranchisesAsync(string direction, string orderBy)
        {
            IQueryable<FilmFranchiseEntity> query = _dbContext.FilmFranchises;
            query = query.AsNoTracking();

            switch (orderBy.ToLower())
            {
                case "id":
                    query = (direction == "asc" ? query.OrderBy(r => r.Id) : direction == "desc" ? query.OrderByDescending(r => r.Id) : query.OrderBy(r => r.Id));
                    break;
                case "name":
                    query = (direction == "asc" ? query.OrderBy(r => r.Franchise) : direction == "desc" ? query.OrderByDescending(r => r.Franchise) : query.OrderBy(r => r.Id));
                    break;
                case "year":
                    query = (direction == "asc" ? query.OrderBy(r => r.FirstMovieYear) : direction == "desc" ? query.OrderByDescending(r => r.FirstMovieYear) : query.OrderBy(r => r.Id));
                    break;
                default:
                    query = query.OrderBy(r => r.Id);
                    break;
            }

            return await query.ToListAsync();
        }

        public async Task UpdateFranchiseAsync(int filmFranchiseId, FilmFranchiseEntity filmFranchise)
        {
            var franchiseToUpdate = await _dbContext.FilmFranchises.FirstOrDefaultAsync(r => r.Id == filmFranchiseId);

            franchiseToUpdate.Franchise = filmFranchise.Franchise ?? franchiseToUpdate.Franchise;
            franchiseToUpdate.FilmProductor = filmFranchise.FilmProductor ?? franchiseToUpdate.FilmProductor;
            franchiseToUpdate.FilmProducer = filmFranchise.FilmProducer ?? franchiseToUpdate.FilmProducer;
            franchiseToUpdate.FirstMovieYear = filmFranchise.FirstMovieYear ?? franchiseToUpdate.FirstMovieYear;
            franchiseToUpdate.LastMovieYear = filmFranchise.LastMovieYear ?? franchiseToUpdate.LastMovieYear;
            //franchiseToUpdate.MovieCount = franchiseToUpdate.Movies.Count();
            franchiseToUpdate.MovieCount = filmFranchise.MovieCount ?? franchiseToUpdate.MovieCount;
            franchiseToUpdate.ImagePath = filmFranchise.ImagePath ?? franchiseToUpdate.ImagePath;
            franchiseToUpdate.Description = filmFranchise.Description ?? franchiseToUpdate.Description;
        }

        public async Task DeleteFranchiseAsync(int filmFranchiseId)
        {
            var franchiseToDelete = await _dbContext.FilmFranchises.SingleOrDefaultAsync(b => b.Id == filmFranchiseId);
            //_dbContext.Entry(franchiseToDelete).State = EntityState.Deleted;
            _dbContext.FilmFranchises.Remove(franchiseToDelete);
        }


        // Movies
        public void CreateMovie(int filmFranchiseId, MovieEntity movie)
        {
            _dbContext.Entry(movie.FilmFranchise).State = EntityState.Unchanged;
            _dbContext.Movies.Add(movie);
        }

        public async Task<MovieEntity> GetMovieAsync(int filmFranchiseId, int movieId)
        {
            IQueryable<MovieEntity> query = _dbContext.Movies;
            query = query.AsNoTracking();
            //query = query.Include(d => d.FilmFranchise);
            return await query.FirstOrDefaultAsync(d => d.Id == movieId && d.FilmFranchise.Id == filmFranchiseId);
        }

        public async Task<IEnumerable<MovieEntity>> GetMoviesAsync(int filmFranchiseId)
        {
            IQueryable<MovieEntity> query = _dbContext.Movies;
            query = query.AsNoTracking();
            query = query.Where(d => d.FilmFranchise.Id == filmFranchiseId);
            return await query.ToListAsync();
        }

        public async Task UpdateMovieAsync(int filmFranchiseId, int movieId, MovieEntity movie)
        {
            var movieToUpdate = await _dbContext.Movies.FirstOrDefaultAsync(d => d.Id == movieId && d.FilmFranchise.Id == filmFranchiseId);
            movieToUpdate.Title = movie.Title ?? movieToUpdate.Title;
            movieToUpdate.Duration = movie.Duration ?? movieToUpdate.Duration;
            movieToUpdate.Gross = movie.Gross ?? movieToUpdate.Gross;
            movieToUpdate.ImagePath = movie.ImagePath ?? movieToUpdate.ImagePath;
            movieToUpdate.Description = movie.Description ?? movieToUpdate.Description;
        }

        public async Task DeleteMovieAsync(int filmFranchiseId, int movieId)
        {
            var movieToDelete = await _dbContext.Movies.FirstOrDefaultAsync((d) => d.FilmFranchise.Id == filmFranchiseId && d.Id == movieId);
            _dbContext.Movies.Remove(movieToDelete);
        }


        // Save Changes
        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                var result = await _dbContext.SaveChangesAsync();
                return result > 0 ? true : false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
