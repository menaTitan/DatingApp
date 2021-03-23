using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using CloudinaryDotNet.Actions;

namespace DatingApp.API.Helpers
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    } 
}