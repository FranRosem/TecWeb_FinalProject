using AutoMapper;
using FilmFranchiseAPI.Data.Entities;
using FilmFranchiseAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Data
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            this.CreateMap<FilmFranchiseEntity, FilmFranchiseModel>()
                .ReverseMap();

            this.CreateMap<MovieModel, MovieEntity>()
                .ForMember(ent => ent.FilmFranchise, mod => mod.MapFrom(modSrc => new FilmFranchiseEntity() { Id = modSrc.FilmFranchiseId }))
                .ReverseMap()
                .ForMember(mod => mod.FilmFranchiseId, ent => ent.MapFrom(entSrc => entSrc.FilmFranchise.Id))
                .ReverseMap();
        }
    }
}
