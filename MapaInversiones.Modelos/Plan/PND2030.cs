using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Plan
{
    public class PND2030
    {
        public int? IdPlan { get; set; } // int
        public string NombrePlan { get; set; } // varchar(max)
        public string DescripcionPlan { get; set; } // varchar(max)
        public int? IdEjeEstrategico { get; set; } // int
        public string EjeEstrategicoNombre { get; set; } // varchar(max)
        public string EjeEstrategicoDescripcion { get; set; } // varchar(max)
        public int? LineaTransversalId { get; set; } // int
        public string LineaTransversalNombre { get; set; } // varchar(max)
        public int? EstrategiaId { get; set; } // int
        public string EstrategiaNombre { get; set; } // varchar(max)
        public string Estrategiadescripcion { get; set; } // varchar(max)
        public int? IdObjetivo { get; set; } // int
        public string ObjetivoNombre { get; set; } // nvarchar(max)
        public int? Nivel { get; set; } // int
        public int? Entidad { get; set; } // int
        public int? TipoPresupuesto { get; set; } // int
        public int? Programa { get; set; } // int
        public int? Subprograma { get; set; } // int
        public int? Proyecto { get; set; } // int
        public int? Producto { get; set; } // int
    }
}
