using System.Collections.Generic;
using System.Threading.Tasks;
using API.Controllers;
using API.Interfaces;
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
        
        private readonly IUnitOfWork _unitOfWork;

        public LikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();

            if(sourceUser.UserName == username) return BadRequest("You can not like yourself.");

            var userlike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);

            if(userlike != null) return BadRequest("You already like this user.");

            userlike = new UserLike
            {
                SourceUserId = sourceUserId,
                LikedUserId  = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userlike);

            if(await _unitOfWork.Complete())  return Ok();

            return BadRequest("failed to like user");

        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUseLikes([FromQuery]LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();
            var users =  await _unitOfWork.LikesRepository.GetUserLikes(likesParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }
        
        [HttpDelete("{username}")]
        public async Task <ActionResult> UnlikeUser(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);
            var userlike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);
            if(userlike == null) return BadRequest("You already unlike this user.");
            _unitOfWork.LikesRepository.DeleteLike(userlike);
            if(await _unitOfWork.Complete()) return Ok();
            return  BadRequest("Problem delecting your request.");
        }
    }
}