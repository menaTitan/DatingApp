using System.Threading.Tasks;
using API.Entities;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Helpers;

namespace DatingApp.API.Interfaces
{
    public interface ILikesRepository
    {
        Task<UserLike> GetUserLike(int SourceUserId, int likedUserId);

        Task<AppUser> GetUserWithLikes(int userId);

        Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);

        void DeleteLike(UserLike userLike);
    }
}