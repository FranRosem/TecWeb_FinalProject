using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FilmFranchiseAPI.Services
{
    public interface IFileService
    {
        string UploadFile(IFormFile file);
    }
}
