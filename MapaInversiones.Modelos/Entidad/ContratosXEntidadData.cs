using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class ContratosXEntidadData
    {
        public string CodigoInstitucion { get; set; } // varchar(30)
        public string Bpin { get; set; } // varchar(40)
        public string Tipodocproveedor { get; set; } // varchar(50)
        public string Documentoproveedor { get; set; } // varchar(50)
        public string Proveedor { get; set; } // varchar(250)
        public string Estadocontrato { get; set; } // varchar(50)
        public string Referenciacontrato { get; set; } // varchar(50)
        public decimal? Valorcontrato { get; set; } // numeric(20, 2)
        public string Urlproceso { get; set; } // nvarchar(max)
        public string Vigenciacontrato { get; set; } // varchar(50)
        public string Objetodelcontrato { get; set; } // nvarchar(max)
        public string CodigoProceso { get; set; } // varchar(30)
        public string DescripcionProceso { get; set; } // varchar(4000)
    }
}
