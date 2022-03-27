using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Models
{
    public class MovieModel
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        [DataType(DataType.Time)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:HH:mm}")]
        public DateTime? Duration { get; set; }
        [Required]
        public float? Gross { get; set; }
        public string Description { get; set; } = "";
        public string ImagePath { get; set; }
        public int FilmFranchiseId { get; set; }
    }
}
