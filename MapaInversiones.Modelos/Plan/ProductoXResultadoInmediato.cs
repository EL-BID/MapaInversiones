using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Plan
{
    public class ProductoXResultadoInmediato
    {

        public int? ObjetivoId { get; set; } // int
        public int? ObjetivoTipoObjetivoId { get; set; } // int
        public int? ObjetivoAnho { get; set; } // int
        public int? ObjetivoVersion { get; set; } // int
        public int? ObjetivoRelId { get; set; } // int
        public int? ObjetivoRelTipoObjetivoId { get; set; } // int
        public int? ObjetivoRelAnho { get; set; } // int
        public int? ObjetivoRelVersion { get; set; } // int
        public double? Colaboracion { get; set; } // float
        public double? Influencia { get; set; } // float
        public int? Nivel { get; set; } // int
        public int? Entidad { get; set; } // int
        public int? TipoPresupuesto { get; set; } // int
        public int? Programa { get; set; } // int
        public int? Subprograma { get; set; } // int
        public int? Proyecto { get; set; } // int
        public int? Producto { get; set; } // int
        public int? UnidadResponsable { get; set; } // int
        public string ProductoConcat { get; set; } // nvarchar(max)
        public string Borrado { get; set; } // varchar(5)
        public DateTime? FechaActualizacion { get; set; } // datetime2(6)
        public DateTime? FechaInsercion { get; set; } // datetime2(6)
        public string UsuarioResponsable { get; set; } // nvarchar(max)
        public int? Id { get; set; } // int
        public string Nombre { get; set; } // nvarchar(max)
        public string Descripcion { get; set; } // nvarchar(max)
        public int? TipoObjetivoId { get; set; } // int
    }
}
