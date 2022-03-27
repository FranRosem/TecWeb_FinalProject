using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Data.Entities
{
    public class FilmFranchiseEntity
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public string Franchise { get; set; }
        public string FilmProductor { get; set; }
        public string FilmProducer { get; set; }
        public int? FirstMovieYear { get; set; }
        public int? LastMovieYear { get; set; }
        public string Description { get; set; } = "";
        public int? MovieCount { get; set; } = 0;
        public string ImagePath { get; set; }
        public ICollection<MovieEntity> Movies { get; set; }
    }
}
