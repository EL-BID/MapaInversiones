using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text;

namespace PlataformaTransparencia.Modelos
{
  public class InformationGraphics
  {
    /// <summary>
    /// Descripcion del item que se va a sacar
    /// </summary>
    ///<remarks>Por ejemplo Nombre sector, Nombre recurso</remarks>
    ///
    public string labelGroup { get; set; }
    public string label { get; set; }
    public string label_inf { get; set; }
    public string label_nivel4 { get; set; }
    /// <summary>
    /// Porcentaje del item.
    /// </summary>
    public string value { get; set; }
    /// <summary>
    /// Número de registros del item que se va a sacar
    /// </summary>
    public decimal rawValue { get; set; }
    public decimal rawValue_asoc { get; set; }
    public double rawValueDouble { get; set; }
    public int rawValueInt { get; set; }
    public decimal porcentaje { get; set; }
  }

  public class InfoRecursosEmergenciaPerObjeto : InformationGraphics
  {
    public string Anio { get; set; } = string.Empty;
  }

    public class InfoRecursosContratosPerObjeto : InformationGraphics
    {
        public string Anio { get; set; } = string.Empty;
    }

    public class InfoPresupuesto : InformationGraphics
  {
    public decimal? totalGasto { get; set; }
    public decimal? totalPresupuesto { get; set; }
    public decimal? totalMH { get; set; }
    public decimal? totalClasificacion { get; set; }
    public decimal? totalClasePrograma { get; set; }
    public decimal? totalEntidad { get; set; }
    public decimal? totalProyectoActividad { get; set; }
    public int annio { get; set; }
    public string trimestre { get; set; }
    public string clasificacion { get; set; }
    public string entidad { get; set; }
    public string clasePrograma { get; set; }
    public string proyectoActividad { get; set; }
    public int version { get; set; }
    public string nombreVersion { get; set; }


  }

  public class InfoRecAsignadosPlan : InformationGraphics
  {
    public int? periodo { get; set; }
  }

  public class InfoEntidadesConsolida : InformationGraphics
  {
    public string id { get; set; }

    public decimal asignado { get; set; }

    public decimal avance { get; set; }

    public double aporteObjetivo { get; set; }
  }

  public class InfoProjectPerSector : InformationGraphics
  {
    public string url_imagen { get; set; }
    public int orden { get; set; }
    public string alias { get; set; }
    public int ordenGroup { get; set; }

    public int idSector { get; set; }
  }
  public class InfoResourcesPerDepartment : InformationGraphics
  {
  }
  public class InfoResourcesPerRegion : InformationGraphics
  {
  }
  public class InfoResourcesPerSector : InformationGraphics
  {
  }
  public class InfoProjectsPerEstado : InformationGraphics
  {

  }
  public class projectsCarteraTrans : InformationGraphics
  {
  }
  public class InfoTransferPerSector : InformationGraphics
  {
  }
  public class InfoContratosPerAnyo : InformationGraphics
  {

  }

  public class InfoSubsidiosPerDpto : InformationGraphics
  {

  }

  public class InfoRecursosBonificacionesPerEmpleo : InformationGraphics
  {

  }

  public class InfoFarmaciasPerGroup : InformationGraphics { }

  public class InfoRecAsignadosPresupuesto : InformationGraphics
  {
    public int? periodo { get; set; }

  }

  public class InfoConsolidadoPresupuesto : InformationGraphics
  {

        public int Periodo { get; set; }

        public double Vigente { get; set; }
        public double Ejecutado { get; set; }

        public double ValorComprometido { get; set; }

        public double ValorGiros { get; set; }

        public string TipoGasto { get; set; }

  
    }

    public class InfoConsolidadoEntidad : InformationGraphics
    {

        public int Periodo { get; set; }

        public double Vigente { get; set; }
        public double Ejecutado { get; set; }

        public double ValorComprometido { get; set; }

        public double ValorGiros { get; set; }

        public string TipoGasto { get; set; }

        public List<FinalidadItem> Finalidades { get; set; }

    }

    public class FinalidadItem
    {
        public string Codigo { get; set; }
        public string Nombre { get; set; }
    }


    public class InfoPerSector : InformationGraphics
    {
        public int idSector { get; set; }
        public string url_imagen { get; set; }
        public int orden { get; set; }
        public string alias { get; set; }
        public int ordenGroup { get; set; }
    }


    public class InfoParticipacionSector : InformationGraphics
    {

        public string CodigoSector { get; set; } // varchar(30)
        public string Sector { get; set; } // varchar(500)
        public int Año { get; set; } // int
        public double? ValorVigente { get; set; } // float
        public double? ValorComprometido { get; set; } // float
        public double? ValorGiros { get; set; } // float
        public double? ValorVigenteTotal { get; set; } // float
        public double? PorcPartipacion { get; set; } // float

        public string IconoSector { get; set; }  //nvarchar(100)

        public int orden { get; set; }

    }


    public class InfoParticipacionEntidad: InformationGraphics
    {

        public string CodigoInstitucion { get; set; } // varchar(30)
        public string Institucion { get; set; } // varchar(500)
        public int Año { get; set; } // int
        public double? ValorVigente { get; set; } // float
        public double? ValorVigenteTotal { get; set; } // float
        public double? PorcPartipacion { get; set; } // float

        public string parent { get; set; } // varchar(30)
        public string id { get; set; } // varchar(30)
        public double? value { get; set; } // float
    }

    public class SectoresEstrategicos
    {
        public int CodigoSector { get; set; } 
        public string Sector { get; set; } // varchar(200)

        public int NumeroProyectos { get; set; }

        public double TotalProgramado { get; set; }

        public double TotalGirado { get; set; }

        public string Icono { get; set;  }

    }

}
