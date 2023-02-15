using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class InformacionContratos
    {

        public Nullable<int> Anio { get; set; }
        public string UnidadCompra { get; set; }
        public string EstadoProceso { get; set; }
        public string CodigoContrato { get; set; }
        public string CodigoProceso { get; set; }
        public string tipodocumento { get; set; }
        public string numerodocumento { get; set; }
        public string Contratista { get; set; }
        public string DocURL { get; set; }
        public string UrlResumenAdjudicacion { get; set; }
        public string UrlInvitados { get; set; }
        public Nullable<System.DateTime> FechaIncioPublicacionProceso { get; set; }
        public Nullable<int> OfertaPeriodoDuracion { get; set; }
        public Nullable<System.DateTime> FechaPublicacion { get; set; }
        public Nullable<System.DateTime> FechaInicioContrato { get; set; }
        public Nullable<System.DateTime> FechaFinContrato { get; set; }
        public Nullable<System.DateTime> FCH_INICIO_PUBLICACION { get; set; }
        public Nullable<System.DateTime> FCH_FIN_PUBLICACION { get; set; }
        public Nullable<System.DateTime> FCH_ESTIMADA_ADJUDICACION { get; set; }
        public Nullable<long> ValorContrato { get; set; }
        public string DescripcionContrato { get; set; }
        public string DescripcionProceso { get; set; }
        public int COVID19 { get; set; }
        public string MetodoContratacion { get; set; }
        public string CategoriaContratacion { get; set; }


    }

}
