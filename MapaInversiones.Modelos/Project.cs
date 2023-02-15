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

***REMOVED***
    /// <summary>
    /// Este es el id del proyecto.
    /// </summary>
    public int ProjectId { get; set; ***REMOVED***
    /// <summary>
    /// Sector.
    /// </summary>
    public string sector { get; set; ***REMOVED***
    /// <summary>
    /// Descripción.
    /// </summary>
    public string descripcion { get; set; ***REMOVED***
    /// <summary>
    /// Fecha inicio proyecto.
    /// Con formato
    /// </summary>
    public string startdate { get; set; ***REMOVED***
    /// <summary>
    /// Fecha fin proyecto.
    /// Con formato
    /// </summary>
    public string enddate { get; set; ***REMOVED***
    /// <summary>
    /// Fecha Inicio del proyecto
    /// como viene de la base de datos
    /// </summary>
    public DateTime? startdateDateTime { get; set; ***REMOVED***

    public string fechaAprobacion { get; set; ***REMOVED***
    /// <summary>
    /// Fecha Fin del proyecto.
    /// como viene de la base de datos.
    /// </summary>
    public DateTime? enddateDateTime { get; set; ***REMOVED***
    /// <summary>
    /// Ejecutor.
    /// </summary>
    public List<ActorFicha> executor { get; set; ***REMOVED***
    /// <summary>
    /// Contratista.
    /// </summary>
    public List<ActorFicha> contractor { get; set; ***REMOVED***
    /// <summary>
    /// Interventor.
    /// </summary>
    public List<ActorFicha> controller { get; set; ***REMOVED***

    public List<ActorFicha> EntesBeneficiados { get; set; ***REMOVED***


    /// <summary>
    /// Es el identificador del proyecto.
    /// </summary>
    public string BPIN { get; set; ***REMOVED***
    /// <summary>
    /// Nombre del proyecto.
    /// </summary>
    public string name { get; set; ***REMOVED***
    /// <summary>
    /// Es la localizacion del proyecto. Region/Departamento/Municipio.
    /// </summary>
    public string location { get; set; ***REMOVED***
    /// <summary>
    /// Es el valor total del proyecto.
    /// </summary>
    public decimal? TotalValue { get; set; ***REMOVED***

    /// <summary>
    /// Es el valor total del proyecto SGR.
    /// </summary>
    public decimal? TotalValueAll { get; set; ***REMOVED***
    /// <summary>
    /// Es el estado del proyecto.
    /// </summary>
    public string Status { get; set; ***REMOVED***
    /// <summary>
    /// Latitud donde se encuentra el proyecto
    /// </summary>
    public decimal latitude { get; set; ***REMOVED***
    /// <summary>
    /// Longitud donde se encuentra el proyecto
    /// </summary>
    public decimal longitude { get; set; ***REMOVED***
    /// <summary>
    /// id Ocad
    /// </summary>
    public int idOcad { get; set; ***REMOVED***
    /// <summary>
    /// nombre de la ocad
    /// </summary>
    public string nameOcad { get; set; ***REMOVED***

    public decimal avance_fisico { get; set; ***REMOVED***
    public decimal avance_financiero { get; set; ***REMOVED***

    /// <summary>
    /// Id estado del proyecto
    /// </summary>
    public int IdStatus { get; set; ***REMOVED***

    public int contMegusta { get; set; ***REMOVED***
    public int contComentarios { get; set; ***REMOVED***
    public decimal duracion { get; set; ***REMOVED***

    public List<AvanceFisicoEtapas> avance_fisico_etapas { get; set; ***REMOVED***

    public string objGeneral { get; set; ***REMOVED***
    public List<itemfuentes> fuentes_financiacion { get; set; ***REMOVED***
    public List<itemGenerico> productos_proy { get; set; ***REMOVED***
    public List<itemGenerico> fases_proy { get; set; ***REMOVED***

    public int CantidadContratos { get; set; ***REMOVED***
    public int AnnioContratos { get; set; ***REMOVED***
    public List<ModeloAvanceFinancieroPorComponenteProducto> avanceFisicoInversion { get; set; ***REMOVED***
    /// <summary>
    /// Numero beneficiarios hombres
    /// </summary>
    public decimal? NumBeneficHombres { get; set; ***REMOVED***
    /// <summary>
    /// Numero beneficiarios mujeres
    /// </summary>
    public decimal? NumBeneficMujeres { get; set; ***REMOVED***
    /// <summary>
    /// Subsector
    /// </summary>
    /// 
    public string Moneda { get; set; ***REMOVED***
    /// <summary>
    /// Etapa
    /// </summary>
    public string IDMoneda { get; set; ***REMOVED***
    public decimal? TasaCambio { get; set; ***REMOVED***
    public string subSector { get; set; ***REMOVED***
    /// <summary>
    /// Etapa
    /// </summary>
    public string Etapa { get; set; ***REMOVED***
    /// <summary>
    /// Fase
    /// </summary>
    public string Fase { get; set; ***REMOVED***
    public string NombreActor { get; set; ***REMOVED***

    public string TipoDeProyecto { get; set; ***REMOVED***

  ***REMOVED***
***REMOVED***
