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
    [Route("api/[controller]")]
    public class FilmFranchisesController : ControllerBase
    {
        private IFilmFranchiseService _franchiseService;
        private IFileService _fileService;
        public FilmFranchisesController(IFilmFranchiseService franchiseService, IFileService fileService)
        {
            _franchiseService = franchiseService;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FilmFranchiseModel>>> GetFranchisesAsync([FromQuery] string direction = "asc", string orderBy = "id")
        {
            try
            {
                var franchises = await _franchiseService.GetFranchisesAsync(direction, orderBy);
                return Ok(franchises);
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidElementOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something happend.");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<FilmFranchiseModel>> GetFranchiseAsync(int id, string showFranchise)
        {
            try
            {
                bool showMoviesBoolean;
                if (!Boolean.TryParse(showFranchise, out showMoviesBoolean))
                {
                    showMoviesBoolean = false;
                }

                var franchise = await _franchiseService.GetFranchiseAsync(id, showMoviesBoolean);
                return Ok(franchise);
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

        [HttpPost("form")]
        public async Task<ActionResult<FilmFranchiseModel>> CreateFranchiseFormAsync([FromForm] FilmFranchiseFormModel newFranchise)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var file = newFranchise.Image;
                string imagePath = _fileService.UploadFile(file);

                newFranchise.ImagePath = imagePath;

                var franchise = await _franchiseService.CreateFranchiseAsync(newFranchise);
                return Created($"/api/filmfranchises/{franchise.Id}", franchise);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Something unexpected happened.");
            }
        }

        // No usado
        [HttpPost]
        public async Task<ActionResult<FilmFranchiseModel>> PostFranchiseAsync([FromBody] FilmFranchiseModel franchise)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var newBookStore = await _franchiseService.CreateFranchiseAsync(franchise);
                return Created($"/api/filmfranchises/{newBookStore.Id}", newBookStore);
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

        [HttpPost("{franchiseId:int}/form")]
        public async Task<ActionResult<FilmFranchiseModel>> PutFranchiseAsync(int franchiseId, [FromForm] FilmFranchiseFormModel filmFranchise)
        {
            try
            {
                var file = filmFranchise.Image;
                string imagePath = string.Empty;

                if (file != null)
                {
                    imagePath = _fileService.UploadFile(file);
                }
                else
                {
                    var franchiseToUpdate = await _franchiseService.GetFranchiseAsync(franchiseId, false);
                    imagePath = franchiseToUpdate.ImagePath;
                }
                filmFranchise.ImagePath = imagePath;

                var updatedFranchise = await _franchiseService.UpdateFranchiseAsync(franchiseId, filmFranchise);
                return Ok(updatedFranchise);
            }
            catch (NotFoundElementException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Something happend: {ex.Message}.");
            }
        }

        [HttpDelete("{franchiseId:int}")]
        public async Task<ActionResult> DeleteFranchise(int franchiseId)
        {
            try
            {
                await _franchiseService.DeleteFranchiseAsync(franchiseId);
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
