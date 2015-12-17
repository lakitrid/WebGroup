using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebGroup.Models;

namespace WebGroup.DataAccess
{
    public class WebGroupDbContext : IdentityDbContext<IdentityUser>
    {
    }
}
