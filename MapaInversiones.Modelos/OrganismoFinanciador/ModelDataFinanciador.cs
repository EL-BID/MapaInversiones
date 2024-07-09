using PlataformaTransparencia.Modelos.Proyectos;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.OrganismoFinanciador
{

    public class ModelDataConsolidadoFinanciador : RespuestaContratoBase
    {
        public List<ModelDataFinanciador> Financiadores { get; set; } = new();
        public int TotalFinanciadores { get; set; }
        public int TotalProyectosFinanciados { get; set; }
        public double TotalAportado { get; set; }
    }

    public class ModelDataFinanciador
    {
        public int CodigoOrganismo { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public double MontoFinanciado { get; set; }
        public List<Item> Estados { get; set; } = new();
        public int ProyectosFinanciados { get; set; }
        public List<ModelDataConsolidadosPorOrganismoFinanciador> MontosPorFuenteFinanciacion { get; set; } = new();
    }

    public class ModelDataConsolidadosPorOrganismoFinanciador
    {
        public int Anio { get; set; }
        public int CodigoOrganismo { get; set; }
        public string Fuente { get; set; } = string.Empty;
        public string Organismo { get; set; } = string.Empty;
        public double Aprobado { get; set; }
        public double Vigente { get; set; }
    }

    public class ModelDataProyectosPorOrganismoFinanciador
    {
        public int Anio { get; set; }
        public int CodigoOrganismo { get; set; }
        public int EstadoId { get; set; }
        public string Organismo { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public int TotalProyectos { get; set; }
    }
}
