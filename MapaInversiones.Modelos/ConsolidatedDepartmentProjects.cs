using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class ConsolidatedDepartmentProjects
    {
        public string departmentId { get; set; }
        public int projectNumber { get; set; }
        public decimal approvedMoney { get; set; }
        public decimal approvedTotalMoney { get; set; }
        public string nombre { get; set; }
        public string url_img_peq { get; set; }

    }
}
