using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class ContratosFiltros
    {
        public int? Annio { get; set; }
        public string? Estado { get; set; }
        public string? Moneda { get; set; }
        public string? NombreEntidad { get; set; }
        public string? NombreProceso { get; set; }
        public int? NumeroPagina { get; set; }
        public int? RegistrosPorPagina { get; set; }
        
        public string CodigoProveedor { get; set; }
        public string CodigoComprador{ get; set; }
        public string NombreContratista { get; set; }

        public string OrigenInformacion { get; set; }

        public string? CodigoContrato { get; set; }

        public string? CodigoProceso { get; set; }

        public string? IdProyecto { get; set; }

    }
}
