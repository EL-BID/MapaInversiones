using System;

namespace PlataformaTransparencia.Modelos.Proyectos
{
  public class InfoConsolidadoProyectosInversion
  {
    public int IdProyecto { get; set; } // int
    public string CodigoProyecto { get; set; } // varchar(max)
    public string NombreProyecto { get; set; } // varchar(max)
    public int IdSector { get; set; } // int
    public string NombreSector { get; set; } // varchar(200)
    public string IdEntidadEjecutora { get; set; } // varchar(100)
    public string EntidadEjecutora { get; set; } // varchar(200)
    public int? ODSId { get; set; } // int
    public string ODSNombre { get; set; } // varchar(100)
    public string TipoProyecto { get; set; } // varchar(max)
    public int ProyectoDestacado { get; set; } // int
    public decimal VlrTotalProgramado { get; set; } // decimal(18, 2)
    public decimal VlrTotalComprommetido { get; set; } // decimal(18, 2)
    public decimal VlrTotalGirado { get; set; } // decimal(18, 2)
    public decimal? PorcentajeComprometido { get; set; } // decimal(18, 2)
    public decimal? PorcentajeGirado { get; set; } // decimal(18, 2)
    public int? TotalProyectos { get; set; } // int
    public DateTime? FechaCorte { get; set; } // datetime
    public string Actualizacion { get; set; } // varchar(10)
    public string Fuente { get; set; } // nvarchar(653)
  }
}

