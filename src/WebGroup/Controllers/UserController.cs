using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using WebGroup.Models;
using WebGroup.Services;
using System.Net;
using Microsoft.AspNet.Authorization;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace WebGroup.Controllers
{
    [Route("services/[controller]"), Authorize]
    public class UserController : Controller
    {
        [FromServices]
        public UserService UserService { get; set; }

        // POST services/user/login
        [HttpPost, Route("login"), AllowAnonymous]
        public async Task Post([FromBody]UserLogin user)
        {
            if (!await UserService.Authenticate(user))
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
        }

        [HttpGet, Route("logout")]
        public async Task Logout()
        {
            await UserService.SignOut();
        }

        [HttpGet, Route("isAuth")]
        public void IsAuth()
        {
            return;
        }
    }
}
