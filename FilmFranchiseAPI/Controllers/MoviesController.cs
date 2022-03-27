using FilmFranchiseAPI.Exceptions;
using FilmFranchiseAPI.Models;
using FilmFranchiseAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Controllers
{
    [Authorize(Roles = "Admin,NormalUser")]
    [Route("api/filmfranchises/{franchiseId:int}/[controller]")]
    public class MoviesController : ControllerBase
    {
        private IMovieService _movieService;
        private IFileService _fileService;

        public MoviesController(IMovieService movieService, IFileService fileService)
        {
            _movieService = movieService;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieModel>>> GetMoviesAsync(int franchiseId)
        {
            try
            {
                return Ok(await _movieService.GetMoviesAsync(franchiseId));
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happend.");
            }
        }

        [HttpGet("{movieId:int}")]
        public async Task<ActionResult<MovieModel>> GetMovieAsync(int franchiseId, int movieId)
        {
            try
            {
                return Ok(await _movieService.GetMovieAsync(franchiseId, movieId));
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happend.");
            }
        }

        [HttpPost("Form")]
        public async Task<ActionResult<MovieModel>> CreateBookFormAsync(int franchiseId, [FromForm] MovieFormModel newMovie)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var file = newMovie.Image;
                string imagePath = _fileService.UploadFile(file);

                newMovie.ImagePath = imagePath;

                var movie = await _movieService.CreateMovieAsync(franchiseId, newMovie);
                return Created($"/api/filmfranchises/{movie.FilmFranchiseId}/movies/{movie.Id}", movie);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something unexpected happened.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<MovieModel>> PostMovieAsync(int franchiseId, [FromBody] MovieModel newMovie)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var movie = await _movieService.CreateMovieAsync(franchiseId, newMovie);
                return Created($"/api/filmfranchises/{movie.FilmFranchiseId}/movies/{movie.Id}", movie);
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happend.");
            }
        }

        [HttpPost("{movieId:int}/form")]
        public async Task<ActionResult<MovieModel>> UpdateMovieAsync(int franchiseId, int movieId, [FromForm] MovieFormModel movie)
        {
            try
            {
                var file = movie.Image;
                string imagePath = string.Empty;

                if (file != null)
                {
                    imagePath = _fileService.UploadFile(file);
                }
                else
                {
                    var movieToUpdate = await _movieService.GetMovieAsync(franchiseId, movieId);
                    imagePath = movieToUpdate.ImagePath;
                }
                movie.ImagePath = imagePath;
                var updatedMovie = await _movieService.UpdateMovieAsync(franchiseId, movieId, movie);
                return Ok(updatedMovie);
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happend.");
            }
        }

        [HttpDelete("{movieId:int}")]
        public async Task<ActionResult<MovieModel>> DeleteMovieAsync(int franchiseId, int movieId)
        {
            try
            {
                await _movieService.DeleteMovieAsync(franchiseId, movieId);
                return Ok();
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happend.");
            }
        }
    }
}
