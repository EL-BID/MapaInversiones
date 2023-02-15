using System;
using System.Collections.Generic;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Modelos
{
  public class Project
  {
    public Project()
    {
      latitude = 4.68592950660633M;//Latitud Defecto por si no no ha sido refrenciado;
      longitude = -74.080810546875M;
      executor = contractor = controller = EntesBeneficiados = new List<ActorFicha>();
      avance_fisico_etapas = new List<AvanceFisicoEtapas>();
      objGeneral = "";
      descripcion = string.Empty;
      fuentes_financiacion = new List<itemfuentes>();
      productos_proy = new List<itemGenerico>();
      fases_proy = new List<itemGenerico>();
      NumBeneficHombres = 0;
      NumBeneficMujeres = 0;
      Moneda = "";
      IDMoneda = "";
      TasaCambio = 0;
      Etapa = "";
      Fase = "";
      NombreActor = "";

    }
    /// <summary>
    /// Este es el id del proyecto.
    /// </summary>
    public int ProjectId { get; set; }
    /// <summary>
    /// Sector.
    /// </summary>
    public string sector { get; set; }
    /// <summary>
    /// Descripción.
    /// </summary>
    public string descripcion { get; set; }
    /// <summary>
    /// Fecha inicio proyecto.
    /// Con formato
    /// </summary>
    public string startdate { get; set; }
    /// <summary>
    /// Fecha fin proyecto.
    /// Con formato
    /// </summary>
    public string enddate { get; set; }
    /// <summary>
    /// Fecha Inicio del proyecto
    /// como viene de la base de datos
    /// </summary>
    public DateTime? startdateDateTime { get; set; }

    public string fechaAprobacion { get; set; }
    /// <summary>
    /// Fecha Fin del proyecto.
    /// como viene de la base de datos.
    /// </summary>
    public DateTime? enddateDateTime { get; set; }
    /// <summary>
    /// Ejecutor.
    /// </summary>
    public List<ActorFicha> executor { get; set; }
    /// <summary>
    /// Contratista.
    /// </summary>
    public List<ActorFicha> contractor { get; set; }
    /// <summary>
    /// Interventor.
    /// </summary>
    public List<ActorFicha> controller { get; set; }

    public List<ActorFicha> EntesBeneficiados { get; set; }


    /// <summary>
    /// Es el identificador del proyecto.
    /// </summary>
    public string BPIN { get; set; }
    /// <summary>
    /// Nombre del proyecto.
    /// </summary>
    public string name { get; set; }
    /// <summary>
    /// Es la localizacion del proyecto. Region/Departamento/Municipio.
    /// </summary>
    public string location { get; set; }
    /// <summary>
    /// Es el valor total del proyecto.
    /// </summary>
    public decimal? TotalValue { get; set; }

    /// <summary>
    /// Es el valor total del proyecto SGR.
    /// </summary>
    public decimal? TotalValueAll { get; set; }
    /// <summary>
    /// Es el estado del proyecto.
    /// </summary>
    public string Status { get; set; }
    /// <summary>
    /// Latitud donde se encuentra el proyecto
    /// </summary>
    public decimal latitude { get; set; }
    /// <summary>
    /// Longitud donde se encuentra el proyecto
    /// </summary>
    public decimal longitude { get; set; }
    /// <summary>
    /// id Ocad
    /// </summary>
    public int idOcad { get; set; }
    /// <summary>
    /// nombre de la ocad
    /// </summary>
    public string nameOcad { get; set; }

    public decimal avance_fisico { get; set; }
    public decimal avance_financiero { get; set; }

    /// <summary>
    /// Id estado del proyecto
    /// </summary>
    public int IdStatus { get; set; }

    public int contMegusta { get; set; }
    public int contComentarios { get; set; }
    public decimal duracion { get; set; }

    public List<AvanceFisicoEtapas> avance_fisico_etapas { get; set; }

    public string objGeneral { get; set; }
    public List<itemfuentes> fuentes_financiacion { get; set; }
    public List<itemGenerico> productos_proy { get; set; }
    public List<itemGenerico> fases_proy { get; set; }

    public int CantidadContratos { get; set; }
    public int AnnioContratos { get; set; }
    public List<ModeloAvanceFinancieroPorComponenteProducto> avanceFisicoInversion { get; set; }
    /// <summary>
    /// Numero beneficiarios hombres
    /// </summary>
    public decimal? NumBeneficHombres { get; set; }
    /// <summary>
    /// Numero beneficiarios mujeres
    /// </summary>
    public decimal? NumBeneficMujeres { get; set; }
    /// <summary>
    /// Subsector
    /// </summary>
    /// 
    public string Moneda { get; set; }
    /// <summary>
    /// Etapa
    /// </summary>
    public string IDMoneda { get; set; }
    public decimal? TasaCambio { get; set; }
    public string subSector { get; set; }
    /// <summary>
    /// Etapa
    /// </summary>
    public string Etapa { get; set; }
    /// <summary>
    /// Fase
    /// </summary>
    public string Fase { get; set; }
    public string NombreActor { get; set; }

    public string TipoDeProyecto { get; set; }

  }
}
