using PlataformaTransparencia.Infrastructura;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using PlataformaTransparencia.Negocios.Comunes;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Infrastructura.DataModels;
using System.Threading.Tasks;
using DataModels;
using PlataformaTransparencia.Modelos.Proyectos;

namespace PlataformaTransparencia.Negocios.Proyectos
{
  /// <summary>
  /// Clase de negocio para hacer las consultas para 
  /// cargar el perfil del proyecto.
  /// </summary>
  public class BllProjectProfile : RespuestaContratoBase
  {
    private readonly TransparenciaDB DataModel;
    public BllProjectProfile(TransparenciaDB connection)
    {
      DataModel = connection;
    }

    public BllProjectProfile()
    {
    }
    /// <summary>
    /// Retorna la informacion de las fuentes de financiacion por cada uno 
    /// de los años. 
    /// </summary>
    /// <param name="IdProject">Es el id del proyecto.</param>
    /// <returns></returns>
    public void GetSourcesByProject(ModelProjectProfile ModelProjectProfile, int IdProject)
    {
      try
      {
        //Seleccionamos los años.
        //BllPeriods period = new BllPeriods();
        //List<int> listYears = period.GetYearsList();


        List<int> listYears = new List<int>();

        listYears = (from p in DataModel.EsquemaFinanciacionProyectos
                     where p.IdProyecto == IdProject
                     select p.FechaInicioVigencia.Year).Distinct().ToList();

        //TODO Falta consulta de linq de metricas por Id, Comentariar metrics, Revisar dependiendo del modelo
        List<Sources> sources = new List<Sources>();
        foreach (int year in listYears)
        {
          List<SourcesPerYear> sourcebyYear;
          var consultaFinanciacion = from financiacion in DataModel.EsquemaFinanciacionProyectos
                                     join fuente in DataModel.Fuentes
                                     on new
                                     {
                                       IdTipoRecurso = financiacion.IdTipoRecurso,
                                       IdTipoEntidad = financiacion.IdTipoEntidad,
                                       IdEntidad = financiacion.IdEntidad
                                     }
                                     equals new
                                     {
                                       IdTipoRecurso = fuente.IdTipoRecurso,
                                       IdTipoEntidad = fuente.IdTipoEntidad,
                                       IdEntidad = fuente.IdEntidad
                                     }
                                     join seguimientoEsquemaFinanciacionProyecto in DataModel.SeguimientoEsquemaFinanciacionProyectos
                                     on new
                                     {
                                       IdProyecto = financiacion.IdProyecto,
                                       IdTipoRecurso = financiacion.IdTipoRecurso,
                                       IdTipoEntidad = financiacion.IdTipoEntidad,
                                       IdEntidad = financiacion.IdEntidad,
                                       FechaInicioVigencia = financiacion.FechaInicioVigencia,
                                       FechaFinalVigencia = financiacion.FechaFinalVigencia
                                     }
                                     equals new
                                     {
                                       IdProyecto = seguimientoEsquemaFinanciacionProyecto.IdProyecto,
                                       IdTipoRecurso = seguimientoEsquemaFinanciacionProyecto.IdTipoRecurso,
                                       IdTipoEntidad = seguimientoEsquemaFinanciacionProyecto.IdTipoEntidad,
                                       IdEntidad = seguimientoEsquemaFinanciacionProyecto.IdEntidad,
                                       FechaInicioVigencia = seguimientoEsquemaFinanciacionProyecto.FechaInicioReporte,
                                       FechaFinalVigencia = seguimientoEsquemaFinanciacionProyecto.FechaFinalReporte
                                     }
                                     into proyectoEsquemafinannciacionSeguimiento
                                     from seguimientoEsquemaFinanciacionProyecto in proyectoEsquemafinannciacionSeguimiento.DefaultIfEmpty()
                                     where financiacion.IdProyecto == IdProject && financiacion.FechaInicioVigencia.Year == year
                                     select new SourcesPerYear
                                     {
                                       name = fuente.NombreTipoRecurso + " - " + fuente.NombreEntidad,
                                       total = (decimal)financiacion.ValorAprobado,
                                       current = seguimientoEsquemaFinanciacionProyecto != null ? (decimal)seguimientoEsquemaFinanciacionProyecto.ValorReportado : 0

                                     };

          sourcebyYear = consultaFinanciacion.ToList<SourcesPerYear>();
          foreach (var registro in sourcebyYear)
          {
            if (registro.total > 0)
            {
              registro.PorcentajeEjecutado = Convert.ToDecimal(ManejoPorcentajes.ValorPorcentajeString(Convert.ToDecimal(registro.total), Convert.ToDecimal(registro.current)).Replace("%", string.Empty).Trim()); //Convert.ToInt32((registro.goal - registro.current) / registro.goal);    
            }
          }
          sources.Add(new Sources { year = year, sourcesperyear = sourcebyYear });
        }
        ModelProjectProfile.Sources = sources;
        this.Status = true;
      }
      catch (Exception ex)
      {
        LogHelper.GenerateLog(ex);
      }
    }
    /// <summary>
    /// Retorna la informacion del proyecto.
    /// </summary>
    /// <param name="IdProject">Es el id del proyecto.</param>
    /// <returns>Informacion del proyecto con Id</returns>
    public Modelos.Project GetProjectInformation(int IdProject)
    {
      Modelos.Project defaultElement = new();
      var infoProyecto = (from aprobadosInv in DataModel.VwProyectosAprobadosInvs
                          join project in DataModel.Proyectos on aprobadosInv.IdProyecto equals project.IdProyecto
                          join historiaEstado in DataModel.HistoriaEstados on project.IdProyecto equals historiaEstado.IdProyecto
                          join estados in DataModel.Estados on historiaEstado.IdEstado equals estados.IdEstado
                          join fase in DataModel.Fases on historiaEstado.IdFase equals fase.IdFase
                          join etapa in DataModel.Etapas on historiaEstado.IdEtapa equals etapa.IdEtapa
                          join ActorXProyecto in DataModel.ActorXProyectos on aprobadosInv.IdProyecto equals ActorXProyecto.IDProyecto
                          join Actor in DataModel.Actors on ActorXProyecto.IDActor equals Actor.IdActor

                          where project.IdProyecto == IdProject
                          select new Modelos.Project()
                          {
                            ProjectId = project.IdProyecto,
                            BPIN = project.CodigoBPIN,
                            enddate = project.FechaFinProyecto.Year.ToString(),
                            name = project.NombreProyecto.Trim(),
                            sector = aprobadosInv.NombreSector.Trim(),
                            subSector = "",
                            startdate = project.FechaInicioProyecto.Year.ToString(),
                            TotalValue = project.VlrTotalProyectoFuenteRegalias,
                            TotalValueAll = project.VlrTotalProyectoTodasLasFuentes,
                            Status = estados.NombreEstado.Trim(),
                            IdStatus = estados.IdEstado,
                            avance_financiero = aprobadosInv.AvanceFinanciero / 100,
                            contMegusta = aprobadosInv.MeGusta,
                            contComentarios = aprobadosInv.Comentarios,
                            duracion = Math.Round(Convert.ToDecimal((project.FechaFinProyecto - project.FechaInicioProyecto).TotalDays * 12.0 / 365.0), 2), //Convert.ToDecimal(aprobadosInv.DuracionProyecto),
                            Etapa = etapa.NombreEtapa,
                            Fase = fase.NombreFase,
                            NombreActor = Actor.NombreActor,
                            TipoDeProyecto = project.TipoDeProyecto,
                            objGeneral = project.ObjetivoGeneral,
                            Horizonte = aprobadosInv.Horizonte

                          }).DefaultIfEmpty(defaultElement).FirstOrDefault();
      Modelos.Project objReturn = new();
      if (infoProyecto != null)
      {
        List<ActorFicha> beneficiarios_aux = new();
        List<ActorFicha> beneficiarios_munic = new();
        List<ActorFicha> beneficiarios_encabezado = new();
        if (infoProyecto.TipoDeProyecto.ToUpper().Equals("NACIONAL"))
        {
          var munic_query = (from municipio in ConsultasComunes.ObtenerMunicipio(null)
                             select new ActorFicha
                             {
                               Nombre = municipio.NombreMunicipio + " (" + municipio.NombreDepartamento + ")",
                               IdDepartamento = municipio.IdDepartamento,
                               IdMunicipio = municipio.IdMunicipio,
                               Tipo = municipio.Tipo
                             }).OrderBy(p => p.Nombre);
          beneficiarios_munic = munic_query.ToList();
        }
        else
        {
          beneficiarios_aux = ObtenerNombresGeografiasBeneficiadas(IdProject);

          if (infoProyecto.TipoDeProyecto.Equals("DEPARTAMENTAL"))
          {
            //beneficiarios encabezado
            beneficiarios_munic = beneficiarios_aux.Where(p => p.Tipo.Equals("MUNICIPIO")).ToList();
            beneficiarios_encabezado = beneficiarios_aux.Where(p => p.Tipo.Equals("DEPARTAMENTO")).ToList();
          }
          else
          {
            beneficiarios_munic = beneficiarios_aux;
            beneficiarios_encabezado = beneficiarios_aux;
          }
        }
        infoProyecto.EntesBeneficiados = beneficiarios_munic;
        objReturn = infoProyecto;
      }
      return objReturn;
    }

    public List<Period> ObtenerPeriodosFuentes(int Id)
    {
      List<Period> objReturn = new List<Period>();

      objReturn = (from fuentes in DataModel.VwFuentesFinanciacion
                   where fuentes.IdProyecto == Id
                   group fuentes by new
                   {
                     fuentes.Periodo
                   } into g
                   select new Period
                   {
                     id = (int)g.Key.Periodo,
                     name = g.Key.Periodo.ToString()
                   }).OrderBy(p => p.id).ToList();


      return objReturn;
    }



    public List<ActorFicha> ObtenerNombresGeografiasBeneficiadas(int IdProject)
    {
      return RepositorioProyectos.ObtenerNombresGeografiasBeneficiadasProyecto(IdProject);
    }

    /// <summary>
    /// Retorna el nombre de las localizaciones
    /// </summary>
    /// <param name="IdProject">Es el id del proyecto</param>
    /// <returns>El nombre de las localizaciones Region,Departamento,Municipio</returns>
    public string LocalizationByProject(int IdProject)
    {
      string strLocations = "";

      //TODO Mejora, cuando un proyecto esta en Nombres regiones,departamentos, municipios 
      //varias localizaciones, revisar si se puede obtener la ubicacion.
      //Esta es la localizacion del proyecto.

      var queryLocalizacion = (from locations in DataModel.ProyectoXEntidadTerritorials
                               join Ente in DataModel.EnteTerritorials
                               on locations.IdMunicipio equals Ente.IdMunicipio
                               orderby Ente.NombreRegion + " " + Ente.NombreDepartamento + " " + Ente.NombreMunicipio
                               where locations.IdProyecto == IdProject
                               select new
                               {
                                 Ente.NombreRegion,
                                 Ente.NombreDepartamento,
                                 Ente.NombreMunicipio
                               });
      //Seleccionamos por si hay mas de una localizacion.               
      List<string> lista = new List<string>();
      foreach (var item in queryLocalizacion)
      {
        if (!string.IsNullOrEmpty(item.NombreRegion))
          lista.Add(item.NombreRegion);
        if (!string.IsNullOrEmpty(item.NombreDepartamento))
          lista.Add(item.NombreDepartamento);
        if (!string.IsNullOrEmpty(item.NombreMunicipio))
          lista.Add(item.NombreMunicipio);
      }
      if (lista.Count > 1)
      {
        if (lista.Count > 3)
        {
          List<string> listaTmp = new List<string>();
          listaTmp.Add(lista[0]);
          listaTmp.Add(lista[1]);
          listaTmp.Add(lista[2]);
          lista = listaTmp;
        }
        strLocations = string.Join(",", lista);
      }

      return strLocations;
    }
    /// <summary>
    /// Metodo privado que me permite sacar el nombre de los actores separados por ,
    /// </summary>
    /// <param name="rol">Es el Rol del cual queremos sacar el nombre</param>
    /// <returns>El nombre del Actor para el proyecto</returns>
    internal List<ActorFicha> NameActorByProject(Int32 IRrol, int IdProject)
    {
      return RepositorioProyectos.ObtenerNombresActoresPorRolYProyecto(IdProject, IRrol);
    }
    /// <summary>
    /// Se debe calcular el progreso del proyecto.
    /// </summary>
    /// <param name="IdProject">Es el id del proyecto</param>
    /// <returns>Progresso del proyecto.</returns>
    public void GetProgressProject(ModelProjectProfile ModelProjectProfile, int IdProject)
    {
      var query = (from project in DataModel.Proyectos
                   where project.IdProyecto == IdProject
                   select project).SingleOrDefault();
      if (query != null)
      {
        ModelProjectProfile.Progress = query.PorcentajeAvanceFisico;
      }
      this.Status = true;

    }
    /// <summary>
    /// Retorna la lista de imagenes
    /// </summary>
    /// <param name="id">Id del proyecto</param>
    /// <returns>Lista de imagenes</returns>
    public void GetListImagesbyId(ModelProjectProfile ModelProjectProfile, int IdProject)
    {

      var query = (from images in DataModel.Fotos
                   orderby images.Fecha
                   where (images.IdProyectoPOT == IdProject || images.IdProyectoInv == IdProject)
                          && images.Aprobado == true
                          && images.Eliminado == false
                   select new Images
                   {
                     description = images.Descripcion,
                     large = images.RutaFotoGrande,
                     thumbnail = images.RutaFotoPequeno
                   });
      ModelProjectProfile.Images = query.ToList<Images>();

      this.Status = true;

    }


    private List<Images> ObtenerListadoDeImagenesPorDefecto()
    {
      List<Images> lstReturn = new List<Images>();
      lstReturn.Add(new Images() { description = "Sin Imagen.", large = CommonConstants.DefaultImagePath, thumbnail = CommonConstants.DefaultImagePath });
      lstReturn.Add(new Images() { description = "Sin Imagen.", large = CommonConstants.DefaultImagePath, thumbnail = CommonConstants.DefaultImagePath });
      lstReturn.Add(new Images() { description = "Sin Imagen.", large = CommonConstants.DefaultImagePath, thumbnail = CommonConstants.DefaultImagePath });
      lstReturn.Add(new Images() { description = "Sin Imagen.", large = CommonConstants.DefaultImagePath, thumbnail = CommonConstants.DefaultImagePath });
      return lstReturn;
    }
    /// <summary>
    /// Devuelve las metricas por año para los diferentes 
    /// proyectos.
    /// </summary>
    /// <param name="IdProject">Es el Id del proyecto.</param>
    /// <returns></returns>
    public void GetListMetricbyId(ModelProjectProfile ModelProjectProfile, int IdProject)
    {


      List<int> listYears = new List<int>();
      List<MetricperYear> metrics = new List<MetricperYear>();

      listYears = (from specifObjetive in DataModel.ObjetivoEspecificos
                   join product in DataModel.Productos on specifObjetive.IdObjetivoEspecifico equals product.IdObjetivoEspecifico
                   join indicators in DataModel.MetaIndicadorProductos on product.IdProducto equals indicators.IdProducto
                   where specifObjetive.IdProyecto == IdProject
                   select indicators.FechaInicioMeta.Year).Distinct().ToList();

      foreach (int year in listYears)
      {
        List<Metric> metricsbyYear = new List<Metric>();

        var queryMetrics = (from specifObjetive in DataModel.ObjetivoEspecificos
                            join product in DataModel.Productos on specifObjetive.IdObjetivoEspecifico equals product.IdObjetivoEspecifico
                            join indicators in DataModel.MetaIndicadorProductos on product.IdProducto equals indicators.IdProducto
                            join tracing in DataModel.SeguimientoMetaIndicadorProductos
                             on
                                 new
                                 {
                                   IdProducto = indicators.IdProducto,
                                   IdIndicador = indicators.IdIndicador,
                                   FechaInicio = indicators.FechaInicioMeta,
                                   FechaFin = indicators.FechaFinMeta

                                 }
                             equals
                                 new
                                 {
                                   IdProducto = tracing.IdProducto,
                                   IdIndicador = tracing.IdIndicador,
                                   FechaInicio = tracing.FechaInicioReporte,
                                   FechaFin = tracing.FechaFinReporte

                                 }
                            into MetricasConSeguimiento
                            where specifObjetive.IdProyecto == IdProject && indicators.FechaInicioMeta.Year == year
                            from seguimiento in MetricasConSeguimiento.DefaultIfEmpty()
                            select new Metric
                            {
                              name = indicators.NombreIndicador,
                              current = seguimiento != null ? seguimiento.ValorReportado : 0,
                              goal = indicators.ValorMeta,
                              product = product.NombreProducto,
                              goalDescription = specifObjetive.NombreObjetivoEspecifico,
                              UnidadDeMedida = product.UnidadProducto
                            }).Distinct().ToList();
        metricsbyYear = queryMetrics;

        foreach (var registro in metricsbyYear)
        {
          if (registro.goal > 0)
          {
            registro.PorcentajeEjecutado = Convert.ToDecimal(ManejoPorcentajes.ValorPorcentajeString(Convert.ToDecimal(registro.goal), Convert.ToDecimal(registro.current)).Replace("%", string.Empty).Trim()); //Convert.ToInt32((registro.goal - registro.current) / registro.goal);    
          }
        }


        metrics.Add(new MetricperYear { year = year, metrics = metricsbyYear });
      }
      ModelProjectProfile.Metrics = metrics;
      this.Status = true;

    }
    /// <summary>
    /// Retorna otros proyectos de la misma OCAD.
    /// </summary>
    /// <param name="IdProject">Es el Id del proyecto.</param>
    /// <returns></returns>
    public void GetOtherProjectsbyId(ModelProjectProfile ModelProjectProfile, int IdProject)
    {

      //TODO Tener en cuenta que esta consulta creo que va por sector, Tener en cuenta que no se seleccione el mismo proyecto.
      List<Modelos.Project> projectbysomeOCADS;
      int IdOCAD = Convert.ToInt32((from proyecto in DataModel.Proyectos
                                    where proyecto.IdProyecto == IdProject
                                    select proyecto.IdOCAD).FirstOrDefault());

      var query = (from projects in DataModel.Proyectos
                   join history in DataModel.HistoriaEstados
                   on projects.IdProyecto equals history.IdProyecto
                   join status in DataModel.Estados
                   on history.IdEstado equals status.IdEstado
                   where projects.IdProyecto != IdProject && projects.IdOCAD == IdOCAD
                   && history.ActualSiNo == true
                   select new Modelos.Project
                   {
                     BPIN = projects.CodigoBPIN,
                     ProjectId = projects.IdProyecto,
                     enddateDateTime = projects.FechaFinProyecto,
                     startdateDateTime = projects.FechaInicioProyecto,
                     name = projects.NombreProyecto,
                     TotalValue = projects.VlrTotalProyectoFuenteRegalias,
                     Status = status.NombreEstado


                   }).Take(4);
      projectbysomeOCADS = query.ToList<Modelos.Project>();

      for (int i = 0; i < projectbysomeOCADS.Count; i++)
      {
        //
        projectbysomeOCADS[i].enddate = projectbysomeOCADS[i].enddateDateTime.ToString();
        projectbysomeOCADS[i].startdate = projectbysomeOCADS[i].startdateDateTime.ToString();
        projectbysomeOCADS[i].executor = this.NameActorByProject(CommonConstants.CodigoEjecutor, projectbysomeOCADS[i].ProjectId);
        projectbysomeOCADS[i].contractor = this.NameActorByProject(CommonConstants.CodigoContratista, projectbysomeOCADS[i].ProjectId);
        projectbysomeOCADS[i].controller = this.NameActorByProject(CommonConstants.CodigoInterventor, projectbysomeOCADS[i].ProjectId);
        projectbysomeOCADS[i].location = this.LocalizationByProject(projectbysomeOCADS[i].ProjectId);
      }
      ModelProjectProfile.OtherProjects = projectbysomeOCADS;
      this.Status = true;

    }

    public string ObtenerURLAuditoriaVisiblePorProyecto(int projectId)
    {
      return RepositorioProyectos.ObtenerURLAuditoriaVisiblePorProyecto(projectId);
    }


    /// <summary>
    /// Retorna la informacion de un proyecto de inversión.
    /// </summary>
    /// <param name="idProject">Es el id del proyecto de inversión.</param>
    /// <returns>Informacion del proyecto de inversión con Id</returns>
    public Modelos.Project GetInvestmentProjectInformation(int idProject)
    {
      Modelos.Project infoProyecto = (from aprobadosInv in DataModel.VwProyectosAprobadosInvPries
                                      join historiaEstado in DataModel.HistoriaEstadoPries on aprobadosInv.IdProyecto equals historiaEstado.IdProyecto
                                      join estados in DataModel.EstadoPries on historiaEstado.IdEstado equals estados.IdEstado
                                      where aprobadosInv.IdProyecto == idProject
                                      select new Modelos.Project()
                                      {
                                        ProjectId = aprobadosInv.IdProyecto,
                                        BPIN = aprobadosInv.CodigoProyecto,
                                        enddate = aprobadosInv.FechaFinProyecto.Year.ToString(),
                                        name = aprobadosInv.NombreProyecto.Trim(),
                                        sector = aprobadosInv.NombreSector.Trim(),
                                        subSector = string.Empty,
                                        startdate = aprobadosInv.FechaInicioProyecto.Year.ToString(),
                                        TotalValue = aprobadosInv.VlrTotalGirado,
                                        TotalValueProgramado = aprobadosInv.VlrTotalProgramado,
                                        TotalValueAll = aprobadosInv.VlrTotalComprommetido,
                                        Status = estados.NombreEstado.Trim(),
                                        IdStatus = estados.IdEstado,
                                        avance_financiero = aprobadosInv.AvanceFinanciero.HasValue ? aprobadosInv.AvanceFinanciero.Value : 0,
                                        contMegusta = aprobadosInv.MeGusta,
                                        contComentarios = aprobadosInv.Comentarios,
                                        duracion = Math.Round(Convert.ToDecimal((aprobadosInv.FechaFinProyecto - aprobadosInv.FechaInicioProyecto).TotalDays / 365.0), 2), //Convert.ToDecimal(aprobadosInv.DuracionProyecto),
                                        Etapa = string.Empty,
                                        Fase = string.Empty,
                                        NombreActor = string.Empty,
                                        TipoDeProyecto = aprobadosInv.TipoProyecto,
                                        objGeneral = aprobadosInv.ObjetivoGeneral,
                                        IdEntidad= aprobadosInv.IdEntidadEjecutora,
                                        NombreEntidad= aprobadosInv.EntidadEjecutora
                                      }).DefaultIfEmpty(new()).FirstOrDefault();
      Item planDesarrollo = (from plan in DataModel.VwPlanDesarrolloProyectoInversions
                             where plan.IdProyecto== idProject
                             select new Item
                             {
                               Id = plan.ObjetivoPlanDesarrollo,
                               Nombre = plan.ProgramaPlanDesarrollo
                             }).FirstOrDefault();
      if (planDesarrollo != null)
      {
        infoProyecto.ObjetivoEstrategico = planDesarrollo.Id;
        infoProyecto.ProgramaPlanDesarrolloDistrital = planDesarrollo.Nombre;
      }
      Modelos.Project objReturn = new() { name=string.Empty };
      if (infoProyecto != null) objReturn = infoProyecto;
      return objReturn;
    }
  }
}