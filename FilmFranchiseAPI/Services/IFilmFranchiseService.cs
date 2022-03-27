using FilmFranchiseAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Services
{
    public interface IFilmFranchiseService
    {
        Task<IEnumerable<FilmFranchiseModel>> GetFranchisesAsync(string direction, string orderBy);
        Task<FilmFranchiseModel> GetFranchiseAsync(int filmFranchiseId, bool showFilmFranchise = false);
        Task<FilmFranchiseModel> CreateFranchiseAsync(FilmFranchiseModel filmFranchise);
        Task<FilmFranchiseModel> UpdateFranchiseAsync(int filmFranchiseId, FilmFranchiseModel filmFranchise);
        Task DeleteFranchiseAsync(int filmFranchiseId);
    }
}
