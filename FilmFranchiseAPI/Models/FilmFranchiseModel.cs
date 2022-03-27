using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Models
{
    public class FilmFranchiseModel
    {
        public int Id { get; set; }
        [Required]
        public string Franchise { get; set; }
        [Required]
        public string FilmProductor { get; set; }
        [Required]
        public string FilmProducer { get; set; }
        [Required]
        public int? FirstMovieYear { get; set; }
        public int? LastMovieYear { get; set; }
        public string Description { get; set; } = "";
        public int? MovieCount { get; set; } = 0;
        public string ImagePath { get; set; }
        public IEnumerable<MovieModel> Movies { get; set; }
    }
}
