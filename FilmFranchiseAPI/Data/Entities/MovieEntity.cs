using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Data.Entities
{
    public class MovieEntity
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public string Title { get; set; }

        [DataType(DataType.Time)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:HH:mm}")]
        public DateTime? Duration { get; set; }
        public float? Gross { get; set; }
        public string Description { get; set; } = "";
        public string ImagePath { get; set; }

        [ForeignKey("FilmFranchiseId")]
        public virtual FilmFranchiseEntity FilmFranchise { get; set; }
    }
}
