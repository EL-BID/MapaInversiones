using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class InformacionContratos
    {
        public string CodigoUnidadCompra { get; set; } // varchar(50)
        public string UnidadCompra { get; set; } // varchar(200)
        public string CodigoProceso { get; set; } // varchar(200)
        public string CodigoModalidad { get; set; } // varchar(50)
        public string Modalidad { get; set; } // varchar(100)
        public string TipoExcepcion { get; set; } // varchar(50)
        public string Caratula { get; set; } // varchar(250)
        public string Descripcion { get; set; } // varchar(500)
        public string EstadoProceso { get; set; } // varchar(100)
        public string FaseProceso { get; set; } // varchar(100)
        public string Moneda { get; set; } // varchar(50)
        public decimal? MontoEstimado { get; set; } // numeric(38, 6)
        public DateTime? FechaPublicacion { get; set; } // datetime2(7)
        public DateTime? FechaEnmienda { get; set; } // datetime2(7)
        public DateTime? FechaFinRecepcionOfertas { get; set; } // datetime2(7
        public DateTime? FechaAperturaOfertas { get; set; } // datetime2(7)
        public DateTime? FechaEstimadaAdjudicacion { get; set; } // datetime2(
        public DateTime? FechaSuscripcion { get; set; } // datetime2(7)
        public string DirigidoMipymes { get; set; } // varchar(50)
        public string DirigidoMipymesMujeres { get; set; } // varchar(50)
        public string ProcesoLotificado { get; set; } // varchar(50)
        public string AdquisicionPlaneada { get; set; } // varchar(50)
        public string ObjetoProceso { get; set; } // varchar(50)
        public string SubobjetoProceso { get; set; } // varchar(50)
        public string Url { get; set; } // varchar(250)
        public string MotivoCancelacion { get; set; } // varchar(2000)
        public int? Origen { get; set; } // int

    }

}
