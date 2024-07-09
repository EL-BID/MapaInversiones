using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class Contratista
    {
        public string nombre { get; set; }
        public string ruc { get; set; }
        public string tipodocumento { get; set; }
        public Nullable<decimal> ValorTotalContratos { get; set; }
        public Nullable<int> NumContratos { get; set; }
        public Nullable<int> NumProcesos { get; set; }
        public string EsCovid { get; set; }
        [Column(), NotNull] public string OrigenInformacion { get; set; } // varchar(9)
    }
}
