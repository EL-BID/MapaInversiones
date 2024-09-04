using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ContratosData
    {
        public int? AnioUltimaActualizacion { get; set; } // int
        public string DescripcionProceso { get; set; } // varchar(4000)
        public string DescripcionContrato { get; set; } // varchar(4000)
        public string EstadoProceso { get; set; } // varchar(30)
        public string CodigoContrato { get; set; } // varchar(30)
        public string CodigoProceso { get; set; } // varchar(30)
        public string CodigoProveedor { get; set; } // varchar(50)
        public string TipoCodigoProveedor { get; set; } // varchar(32)
        public string Contratista { get; set; } // varchar(250)
        public double? ValorPlaneado { get; set; } // float
        public double? ValorAdjudicado { get; set; } // float
        public double? ValorContratado { get; set; } // float
        public string MonedaContrato { get; set; } // varchar(10)
        public string UrlContrato { get; set; } // varchar(800)
        public string CodigoComprador { get; set; } // varchar(30)
        public string Comprador { get; set; } // varchar(200)
        public string EntidadOrigenFondos { get; set; } // varchar(200)
        public string OrigenFondos { get; set; } // varchar(200)
        public string DocURL { get; set; } // varchar(800) 
        public string OrigenInformacion { get; set; } // varchar(20)
        public int CodigoOrigenInformacion { get; set; } // int
        public DateTime? FechaIncioPublicacionProceso { get; set; } // datetime2(7)
        public DateTime? FechaEstimadaAdjudicacion { get; set; } // datetime2(7)
        public DateTime? FechaInicioRecepcionOfertas { get; set; } // datetime2(7)
        public DateTime? FechaInicioContrato { get; set; } // datetime2(7)
        public DateTime? FechaFinContrato { get; set; } // datetime2(7)
        public DateTime? FechaInicioEjecucionContrato { get; set; } // datetime2(7)
        public DateTime? FechaFinEjecucionContrato { get; set; } // datetime2(7)
        public string UnidadCompra { get; set; } // nvarchar(200)
        public string EstadoContrato { get; set; }
    }
}
