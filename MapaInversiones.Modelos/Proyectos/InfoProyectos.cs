using System;
using System.Data.Entity.Spatial;

namespace PlataformaTransparencia.Modelos.Proyectos
{
  public class InfoProyectos
  {
    public int IdProyecto { get; set; }
    public string NombreProyecto { get; set; }
    public DbGeography Geography { get; set; }
    public string State { get; set; }
    public string Location { get; set; }
    public decimal Value { get; set; }
    public decimal approvedTotalMoney { get; set; }
    public string NombreMunicipio { get; set; }
    public string UrlImagen { get; set; }
    public Nullable<int> cantidadFotos { get; set; }
    public decimal porcentajeGastado { get; set; }
    public string NombreSector { get; set; }
    public int IdSector { get; set; }
    public decimal VlrTotalProyectoFuenteRegalias { get; set; }
    public decimal VlrTotalProyectoTodasLasFuentes { get; set; }
    public string MesInicioProyecto { get; set; }
    public int AnioInicioProyecto { get; set; }
    public string MesFinProyecto { get; set; }
    public int AnioFinProyecto { get; set; }
    public DateTime FechaInicioProyecto { get; set; }
    public int Megusta { get; set; }
    public int Comentarios { get; set; }
    public string IdDepartamento { get; set; }
    public string IdEntidadEjecutora { get; set; }
    public string EntidadEjecutora { get; set; }
    public string CodigoSnip { get; set; }
    public string GrupoFuncional { get; set; }
    public string PartidaPresupuestaria { get; set; }
    public string IdMunicipio { get; set; }
        public string NombreDepartamento { get; set; }
    }
}
