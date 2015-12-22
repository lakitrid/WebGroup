using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebGroup.Models;

namespace WebGroup.Services
{
    public class UserService
    {
        private UserManager<IdentityUser> _userManager;
        private SignInManager<IdentityUser> _signInManager;
        private RoleManager<IdentityRole> _roleManager;

        public UserService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, RoleManager<IdentityRole> roleManager)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._roleManager = roleManager;
        }

        internal SiteUser GetCurrentUser(string name)
        {
            IdentityUser user = this._userManager.Users.Where(e => e.NormalizedUserName.Equals(name)).FirstOrDefault();
            
            SiteUser siteUser = null;

            if(user != null)
            {
                siteUser = new SiteUser
                {
                    Name = user.UserName
                };
            }

            return siteUser;
        }

        internal async Task<bool> Authenticate(UserLogin user)
        {
#if DEBUG
            await this.CheckIfAdminExists();
#endif

            var signInStatus = await this._signInManager.PasswordSignInAsync(user.Login, user.Password, true, false);
            if (signInStatus == SignInResult.Success)
            {
                return true;
            }

            return false;
        }

        internal async Task SignOut()
        {
            await this._signInManager.SignOutAsync();
        }

        private async Task CheckIfAdminExists()
        {
            IdentityUser user = await this._userManager.FindByNameAsync("admin");
            if (user == null)
            {
                IdentityRole role = new IdentityRole
                {
                    Name = "Administrtors"                    
                };

                await this._roleManager.CreateAsync(role);

                // add editor user
                user = new IdentityUser
                {
                    UserName = "admin"
                };

                await this._userManager.CreateAsync(user, "BasicPwd24!");

                await this._userManager.AddToRoleAsync(user, "Administrtors");
            }
        }
    }
}
