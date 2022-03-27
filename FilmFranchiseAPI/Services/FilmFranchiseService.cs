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
    public class FilmFranchiseService : IFilmFranchiseService
    {
        private IFilmFranchiseRepository _franchiseRepository;
        private IMapper _mapper;
        private HashSet<string> _allowedSortValues = new HashSet<string>
        {
            "id",
            "name",
            "year"
        };

        public FilmFranchiseService(IFilmFranchiseRepository franchiseRepository, IMapper mapper)
        {
            _franchiseRepository = franchiseRepository;
            _mapper = mapper;
        }
        public async Task<FilmFranchiseModel> CreateFranchiseAsync(FilmFranchiseModel filmFranchise)
        {
            var franchiseEntity = _mapper.Map<FilmFranchiseEntity>(filmFranchise);
            _franchiseRepository.CreateFranchise(franchiseEntity);
            var result = await _franchiseRepository.SaveChangesAsync();
            if (result)
            {
                return _mapper.Map<FilmFranchiseModel>(franchiseEntity);
            }
            throw new Exception("Database Error.");
        }

        public async Task<FilmFranchiseModel> GetFranchiseAsync(int filmFranchiseId, bool showFilmFranchise = false)
        {
            var franchise = await _franchiseRepository.GetFranchiseAsync(filmFranchiseId, showFilmFranchise);

            if (franchise == null)
                throw new NotFoundElementException($"The Book Store with id:{filmFranchiseId} does not exists.");

            return _mapper.Map<FilmFranchiseModel>(franchise);
        }

        public async Task<IEnumerable<FilmFranchiseModel>> GetFranchisesAsync(string direction, string orderBy)
        {
            if (!_allowedSortValues.Contains(orderBy.ToLower()))
            {
                throw new InvalidElementOperationException($"Invalid orderBy value: {orderBy}. The allowed values for querys are: {string.Join(',', _allowedSortValues)}");
            }
            if (direction != "asc" && direction != "desc")
            {
                throw new InvalidElementOperationException($"Invalid direction value: {direction}. The only values for order in querys are: asc or desc.");
            }

            var bookStoreEntityList = await _franchiseRepository.GetFranchisesAsync(direction, orderBy);
            return _mapper.Map<IEnumerable<FilmFranchiseModel>>(bookStoreEntityList);
        }

        public async Task<FilmFranchiseModel> UpdateFranchiseAsync(int filmFranchiseId, FilmFranchiseModel filmFranchise)
        {
            await GetFranchiseAsync(filmFranchiseId);
            var filmFranchiseEntity = _mapper.Map<FilmFranchiseEntity>(filmFranchise);
            filmFranchiseEntity.Id = filmFranchiseId;

            await _franchiseRepository.UpdateFranchiseAsync(filmFranchiseId, filmFranchiseEntity);

            var result = await _franchiseRepository.SaveChangesAsync();
            if (result)
            {
                return _mapper.Map<FilmFranchiseModel>(filmFranchiseEntity);
            }

            throw new Exception("Database Error.");
        }

        public async Task DeleteFranchiseAsync(int filmFranchiseId)
        {
            await GetFranchiseAsync(filmFranchiseId);
            await _franchiseRepository.DeleteFranchiseAsync(filmFranchiseId);
            var result = await _franchiseRepository.SaveChangesAsync();
            if (!result)
            {
                throw new Exception("Database Error.");
            }
        }
    }
}
