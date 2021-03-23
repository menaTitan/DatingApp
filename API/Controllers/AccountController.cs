using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using API.Interfaces;
using System.Linq;
using AutoMapper;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");
            using var hmac = new HMACSHA512();
            var user = _mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;
        
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Token = _tokenService.CreateToken(user)
                
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.Include(p => p.Photos)
            .SingleOrDefaultAsync(obj => obj.UserName == loginDto.Username.ToLower());
            if (user == null) return Unauthorized("Invalid Username or Password");

            using var hamc = new HMACSHA512(user.PasswordSalt);
            var computedHash = hamc.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Username or Password");
            }

            return new UserDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
               

            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(obj => obj.UserName == username.ToLower());
        }

    }
}