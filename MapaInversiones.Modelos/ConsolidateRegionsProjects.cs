using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
    public class ConsolidateRegionsProjects
    {
        public string regionId { get; set; }
        public int projectNumber { get; set; }
        public decimal approvedMoney { get; set; }
        public decimal approvedTotalMoney { get; set; }
    }
}
