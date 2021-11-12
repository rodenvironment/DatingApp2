using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Authorize]
  public class UsersController : BaseApiController
  {
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;

    public UsersController(
      IUserRepository userRepository,
      IMapper mapper,
      IPhotoService photoService)
    {
      _mapper = mapper;
      _userRepository = userRepository;
      _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
      var users = await _userRepository.GetMembersAsync();
      return Ok(users); 
    }

    [HttpGet("{username}", Name ="GetUser")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
      return await _userRepository.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto updateDto)
    {
      var username = User.GetUserName();
      var user = await _userRepository.GetUserByUserName(username);
      
      _mapper.Map(updateDto, user);
      _userRepository.Update(user);
      if (await _userRepository.SaveAllAsync()) return NoContent();
      return BadRequest("Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
      var user = await _userRepository.GetUserByUserName(User.GetUserName());
      var result = await _photoService.AddPhotoAsync(file);
      if (result.Error != null) return BadRequest(result.Error.Message);

      var phooto = new Photo
      {
        Url = result.SecureUrl.AbsoluteUri,
        PublicId = result.PublicId
      };

      if(user.Photos.Count == 0 )
      {
        phooto.IsMain = true;
      }
      user.Photos.Add(phooto);

      if (await _userRepository.SaveAllAsync()) {
        return CreatedAtRoute("GetUser", new { username = user.UserName} ,_mapper.Map<PhotoDto>(phooto));
      }
        

      return BadRequest("Problem Adding Photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
      var user = await _userRepository.GetUserByUserName(User.GetUserName());

      var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

      if (photo.IsMain) return BadRequest("This is already your main photo");

      var mainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
      if (mainPhoto != null) mainPhoto.IsMain = false;
      photo.IsMain = true;

      if (await _userRepository.SaveAllAsync()) return NoContent();

      return BadRequest("Failed to set main photo");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
      var user = await _userRepository.GetUserByUserName(User.GetUserName());

      var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

      if (photo == null) return NotFound();

      if (photo.IsMain) return BadRequest("You cannot delete your main photo");

      if (photo.PublicId != null) 
      {
        var result = await _photoService.DeletePhotoAsync(photo.PublicId);
        if (result.Error != null) return BadRequest(result.Error.Message); 
      }

      user.Photos.Remove(photo);

      if (await _userRepository.SaveAllAsync()) return Ok();

      return BadRequest("Failed to delete the photo");
    }

  }
}