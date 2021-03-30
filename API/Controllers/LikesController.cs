using System.Collections.Generic;
using System.Threading.Tasks;
using API.Controllers;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Extensions;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;

        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();

            if(sourceUser.UserName == username) return BadRequest("You can not like yourself.");

            var userlike = await _likesRepository.GetUserLike(sourceUserId, likedUser.Id);

            if(userlike != null) return BadRequest("You already like this user.");

            userlike = new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId  = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userlike);

            if(await _userRepository.SaveAllAsync())  return Ok();

            return BadRequest("failed to like user");

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUseLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users =  await _likesRepository.GetUserLikes(likesParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }
        
    }
}