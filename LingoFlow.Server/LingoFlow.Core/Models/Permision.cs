using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LingoFlow.Core.Models
{
    public class Permision
    {
        [Key]
        public int Id { get; set; } // ���� ������
        public string PermissionName { get; set; } // �� ������
        public string Description { get; set; } // ����� ������
    }
}
