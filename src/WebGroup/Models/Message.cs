using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebGroup.Models
{
    public class Message
    {
        public string Action { get; set; }

        public long Id { get; set; }

        public string Text { get; set; }
    }
}
