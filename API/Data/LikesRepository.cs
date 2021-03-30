using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Extensions;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class LikesRepository : ILikesRepository
    {

        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public LikesRepository(DataContext context, IMapper mapper){
            _context = context;
            _mapper = mapper; 
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams  likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();  
            var likes = _context.Likes.AsQueryable(); 
            // it returns list of user that the loggedin user has liked 
            if(likesParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

             if(likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers =  users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users.Include( x => x.LikedUsers).FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}