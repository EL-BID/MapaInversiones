using DataModels;
using LinqToDB;
using LinqToDB.DataProvider.Informix;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Home;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using SolrNet.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using ModelContratistaData = PlataformaTransparencia.Modelos.ModelContratistaData;
using Microsoft.Extensions.Configuration;

namespace PlataformaTransparencia.Negocios.Home
{
  public class HomeBLL : IHomeBLL
  {
    /// <summary>
    /// Capa de negocio para funciones Home - Page principal
    /// </summary>

    private readonly TransparenciaDB _connection;
    private IConfiguration _configuration;
    private int _estadoProyEjecucion;

    public HomeBLL(TransparenciaDB connection)
    {
          _connection = connection;
          _estadoProyEjecucion = 2;

    }

    public HomeBLL(TransparenciaDB connection, IConfiguration config)
    {
        _connection = connection;
        _configuration = config;        
        _estadoProyEjecucion = int.TryParse(config["EstadoProyEjecucion"], out var v) ? v : 2;
    }



    public ModelContratistaData ObtenerDatosContratosGestion(int? tipoEmergencia, string Entidad = null)
    {
      ModelContratistaData objReturn = new();
      int? numProcesosCancelados = 0;
      decimal? valProcesosCancelados = 0;
      objReturn.listTotalContratos = ConsultasComunes.ObtenerEncabezadoGestionContratos(tipoEmergencia, Entidad);
      objReturn.listTotalProcesos = ConsultasComunes.ObtenerEncabezadoProcesosGestionContratos(out numProcesosCancelados, out valProcesosCancelados, tipoEmergencia, Entidad);
      objReturn.numProcesosCancelados = numProcesosCancelados;
      objReturn.valProcesosCancelados = valProcesosCancelados;
      objReturn.numContratos = objReturn.listTotalContratos.Sum(a => a.NroContratos);
      objReturn.valorContratos = objReturn.listTotalContratos.Sum(a => a.ValorContratado);
      objReturn.numProcesos = objReturn.listTotalProcesos.Sum(a => a.NroProcesos);
      objReturn.valorProcesos = (decimal?)objReturn.listTotalProcesos.Sum(a => a.ValorProceso);
      //objReturn.listEstadosContratos = ConsultasComunes.ObtenerEstadosGestionContratos(tipoEmergencia);
      return objReturn;
    }

    public ModelHomeData ObtenerDatosModeloInicio(bool esHome = true)
    {
      ModelHomeData objReturn = new();
      if (!esHome)
      {
        return objReturn;
      }

      string maxPeriod_presupuesto = _connection.VwPresupuesto.Max(x => x.Periodo).ToString().Substring(0, 4);
      int anyo_max;
            if (int.TryParse(maxPeriod_presupuesto, out anyo_max) ==false) {
                anyo_max = 0; 
            }

       //objReturn.priorityProjects = GetProyectosPrioritarios();
      objReturn.countOngoingProjects = GetCantProyActivos();
      objReturn.valPresupuestoEncabezado = GetCantidadesPresupuesto();
      objReturn.aniospresupuesto = GetAniosPresupuesto();
      objReturn.fuentesporAnnios = GetFuentesAniosPresupuesto();
      objReturn.MaxAnnioContratos = objReturn.valPresupuestoEncabezado.AnioActual.ToString();
      objReturn.MaxAnnioEntidades = maxPeriod_presupuesto.ToString();
      objReturn.Entidades = GetConsolidadoEntidades(anyo_max);
      objReturn.contprocesoscontratos = GetContadorProcesosContratos(anyo_max);

            objReturn.Status = true;

      return objReturn;
    }


       
        /// <summary>
        /// Funcion que retorna las n primeras entidades con mayor valor vigente para el año más actual, pendiente definir la cantidad de entidades
        /// </summary>
        /// <returns></returns>

        public List<InfoEntidadesConsolida> GetConsolidadoEntidades(int anyo)
        {
            var objReturn = new List<InfoEntidadesConsolida>();
            var temp= (from info in _connection.VwPresupuesto
                    join ct in _connection.CatalogoTiempoes
                        on info.Periodo.ToString() equals ct.Periodo
                    where ct.Año == anyo
                    group info by new
                    {
                        info.CodigoInstitucion,
                        info.Institucion
                    }
                    into g
                    select new InfoEntidadesConsolida
                    {
                        id = g.Key.CodigoInstitucion.ToString(),
                        labelGroup = g.Key.Institucion,
                        label = "",
                        avance = (decimal)g.Sum(x => x.EjecucionAcumulada.Value),
                        asignado = (decimal)g.Sum(x => x.Vigente.Value),
                        porcentaje = 0 
                    })
                   .OrderByDescending(x=>x.avance)
                   .Take(8)
                   .ToList();

            if (temp.Count>0) {
                objReturn = temp;
            }
            return objReturn;
        }



        public itemConteoProjects GetCantProyActivos()
    {
      itemConteoProjects objReturn = new();
      var consulta = (from info in _connection.VwProyectosAprobadosInvs
                      join he in _connection.HistoriaEstados
                      on info.IdProyecto equals he.IdProyecto
                      where he.ActualSiNo == true
                      where he.IdEstado == _estadoProyEjecucion
                      select new InfoProyectos
                      {
                        IdProyecto = info.IdProyecto,
                        approvedTotalMoney = info.VlrTotalProyectoFuenteRegalias
                      }).Distinct().ToList();

      objReturn.cantidad = consulta.Count();
      objReturn.costo = (double)consulta.Sum(x => x.approvedTotalMoney);

      return objReturn;

    }

        public InfoPresupuestoEncabezado GetCantidadesPresupuesto()
        {
            InfoPresupuestoEncabezado objReturn = new();
            var consulta = (from info in _connection.VwPresupuesto
                            join ct in _connection.CatalogoTiempoes
                            on info.Periodo.ToString() equals ct.Periodo
                            group info by new { ct.Año } into g

                            select new
                            {
                                Anio = g.Key.Año,
                                AprobadoTotal = g.Sum(x => x.Vigente)
                            }).OrderByDescending(x => x.Anio).ToList();

            if (consulta.Count > 0)
            {
                objReturn.AnioActual = consulta[0].Anio;
                objReturn.PresupuestoActual = (double)consulta[0].AprobadoTotal;
            }

            if (consulta.Count > 1)
            {
                objReturn.AnioAnterior = consulta[1].Anio;
                objReturn.PresupuestoAnterior = (double)consulta[1].AprobadoTotal;

                if (objReturn.PresupuestoAnterior != 0)
                {
                    objReturn.Porcentaje = (100 - (objReturn.PresupuestoActual * 100 / objReturn.PresupuestoAnterior)) * -1;
                }
            }
            
            return objReturn;

        }

        public InfoPresupuestoEncabezado GetContadorProcesosContratos(int periodo)
        {
            //VwProcesosXProyectosInstitucionesAnio
            InfoPresupuestoEncabezado objReturn = new();
            var consulta = (from info in _connection.VwProcesosXProyectosInstitucionesAnios
                            where info.EstadoProceso == "Proceso adjudicado y celebrado"
                            && info.AnioPresupuesto==periodo
                            select new 
                            {
                                procesos = info.Codigoproceso
                            }).Distinct().ToList();
            var consulta2 = (from info in _connection.VwContratosXProyectosInstitucionesAnios
                             where info.EstadoContrato == "Activo"
                            && info.AnioPresupuesto==periodo
                            select new
                            {
                                bpin = info.Bpin
                            }).Distinct().ToList();
            var consulta3 = (from info in _connection.VwContratosXProyectosInstitucionesAnios
                             
                             where info.EstadoContrato == "Cerrado"
                             select new
                             {
                                 bpin = info.Bpin
                             }).Distinct().ToList();

            objReturn.CantProcesosAdjudicados = consulta.Count();
            objReturn.CantContratosActivos = consulta2.Count(); ;
            objReturn.CantContratosCerrados = consulta3.Count(); ;
           
            return objReturn;

        }
        

        public List<string> GetAniosPresupuesto()
        {
            List<string> objReturn = new List<string>();
             objReturn = (from info in _connection.VwPresupuesto
                            join ct in _connection.CatalogoTiempoes
                            on info.Periodo.ToString() equals ct.Periodo
                            group info by new { ct.Año } into g
                            orderby g.Key.Año descending
                            select  g.Key.Año.ToString()
                            ).ToList();
            return objReturn;
        }

        public List<InfoFuentesporAnnio> GetFuentesAniosPresupuesto()
        {
            //Use mathround para corregir un error del json de comas, revisar como arreglarlo
            List <InfoFuentesporAnnio> objReturn = new();
            var consulta = (from info in _connection.VwPresupuesto
                            join ct in _connection.CatalogoTiempoes
                            on info.Periodo.ToString() equals ct.Periodo
                            group info by new { ct.Año,info.CodigoFuenteDeFinanciamiento,info.FuenteDeFinanciamiento
                            } into g
                            select new InfoFuentesporAnnio
                            {
                                Anio = g.Key.Año,
                                CodigoFuente = g.Key.CodigoFuenteDeFinanciamiento,
                                Fuente = g.Key.FuenteDeFinanciamiento,
                                ValorAprobado = Math.Round(g.Sum(x => x.Aprobado.Value)),
                                ValorVigente = Math.Round(g.Sum(x => x.Vigente.Value))
                            }).OrderByDescending(x => x.Anio).ThenByDescending(x => x.ValorVigente).ToList();
            objReturn = consulta;
            return objReturn;

        }

        public List<InfoProyectos> GetProyectosPrioritarios()
    {
      List<InfoProyectos> objReturn = new();
      var query = (from info in _connection.VwProyectosAprobadosInvs
                   where info.VlrTotalProyectoFuenteRegalias > 0
                   orderby info.VlrTotalProyectoFuenteRegalias descending
                   select new InfoProyectos
                   {
                     IdProyecto = info.IdProyecto,
                     NombreProyecto = info.NombreProyecto.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""),
                     approvedTotalMoney = info.VlrTotalProyectoFuenteRegalias,
                     porcentajeGastado = info.AvanceFinanciero.Value,
                     UrlImagen = info.URLImagen,
                     NombreSector = info.NombreSector,
                     IdSector = info.IdSector,
                     cantidadFotos = info.NumeroImagenes,
                     MesInicioProyecto = info.MesInicioProyecto,
                     AnioInicioProyecto = info.AnioInicioProyecto,
                     MesFinProyecto = info.MesFinProyecto,
                     AnioFinProyecto = info.AnioFinProyecto,
                     FechaInicioProyecto = info.FechaInicioProyecto,
                     Megusta = info.MeGusta,
                     Comentarios = info.Comentarios
                   }).Take(10).ToList();


      if (query.Count > 0)
      {
        objReturn = query;
      }

      return objReturn;

    }

    public List<InfoProjectPerSector> ObtenerProyectoPorSectorGroupHome(int anyo)
    {

      itemEstado obj_aux = new();
      List<InfoProjectPerSector> objReturn = new();

            //var ProjectsPerSectoresQuery = new List<InfoProjectPerSector>();
            var ProjectsPerSectoresQuery = (from presupuesto in _connection.VwPresupuesto
                                            join ct in _connection.CatalogoTiempoes on presupuesto.Periodo.ToString() equals ct.Periodo
                                            join iconos in _connection.VwEstadoImagenes on presupuesto.Sector equals iconos.NombreSector
                                            where ct.Año==anyo
                                            group new { presupuesto,iconos } by new {
                                                presupuesto.Sector,
                                                iconos.ImgSector,
                                                presupuesto.IdSector
                                            } into g
                                           select new InfoProjectPerSector
                                          {
                                              url_imagen = "/img/" + g.Key.ImgSector,
                                              idSector = g.Max(x => x.iconos.MostrarSector) == 1 ? g.Key.IdSector : 0,
                                              label = g.Key.Sector,
                                              labelGroup = g.Max(x => x.iconos.MostrarSector) == 1 ? g.Key.Sector : "OTROS",
                                              rawValue = ((decimal)g.Sum(x => x.presupuesto.Vigente.Value)),
                                              ordenGroup = g.Max(x=>x.iconos.MostrarSector) == 1 ? 0 : 1,
                                              orden= g.Max(x => x.iconos.MostrarSector)
                                           }).OrderByDescending(x => x.rawValue).ToList();

           ///OrderBy(x => x.ordenGroup).ThenBy(y=>y.labelGroup).ToList()


            objReturn = ProjectsPerSectoresQuery;
            return objReturn;

    }

        public List<InfoOrganismosFinan> ObtenerOrganismosPorFuenteHome(string Annio, int IdFuente)
        {
            List<InfoOrganismosFinan> objReturn = new List<InfoOrganismosFinan>();
            var consulta1 = (from info in _connection.VwPresupuesto
                            join ct in _connection.CatalogoTiempoes
                            on info.Periodo.ToString() equals ct.Periodo
                            where info.CodigoFuenteDeFinanciamiento == IdFuente
                            where ct.Año.ToString() == Annio
                            group info by new
                            {
                                ct.Año,
                                info.CodigoOrganismoFinanciador,
                                info.OrganismoFinanciador
                            } into g
                            select new InfoOrganismosFinan
                            {
                                Anio = g.Key.Año,
                                CodigoOrganismoFinanciador = g.Key.CodigoOrganismoFinanciador,
                                OrganismoFinanciador = g.Key.OrganismoFinanciador,
                                ValorAprobado = ((double)g.Sum(x => x.Aprobado.Value)),
                                ValorVigente = ((double)g.Sum(x => x.Vigente.Value))
                            });
            
            var consulta2 = (from info in _connection.VwPresupuestoXProyInvs
                             join ct in _connection.CatalogoTiempoes
                            on info.Periodo.ToString() equals ct.Periodo
                            where info.CodigoFuenteDeFinanciamiento == IdFuente
                            where ct.Año.ToString() == Annio
                            group info by new
                            {
                                ct.Año,
                                info.CodigoOrganismoFinanciador,
                                info.OrganismoFinanciador,
                            } into g
                            select new InfoOrganismosFinan
                            {
                                Anio = g.Key.Año,
                                CodigoOrganismoFinanciador = g.Key.CodigoOrganismoFinanciador,
                                OrganismoFinanciador = g.Key.OrganismoFinanciador,
                                NumeroProyectos = (double)(g.Select(m => new { m.Bpin, m.Nombreproyecto, m.IdProyecto })).Distinct().Count()
                            });
            var consulta = (from c1 in consulta1
                            from c2 in consulta2.LeftJoin(pr => pr.CodigoOrganismoFinanciador == c1.CodigoOrganismoFinanciador)
                            select new InfoOrganismosFinan
                            {
                                Anio = c1.Anio,
                                CodigoOrganismoFinanciador = c1.CodigoOrganismoFinanciador,
                                OrganismoFinanciador = c1.OrganismoFinanciador,
                                ValorAprobado = c1.ValorAprobado,
                                ValorVigente = c1.ValorVigente,
                                NumeroProyectos = c2.NumeroProyectos,
                            }).OrderByDescending(x => x.Anio).ThenByDescending(x => x.ValorAprobado).ToList();

                            
            objReturn = consulta;
            return objReturn;

        }




        public List<HierarchyModel> GetSearchHierarchyModel()
    {
      var objResultParamList = (from p in _connection.SearchResultParams
                                select new SearchResultParamModel
                                {
                                  Hierarchy = p.Hierarchy,
                                  Type = p.Type,
                                  Id = p.Id,
                                  Url = p.Url,
                                  Param = p.Param
                                }).ToList();

      var objReturn = new List<HierarchyModel>();

      foreach (var item in objResultParamList)
      {
        if (!objReturn.Exists(x => x.Hierarchy.Equals(item.Hierarchy)))
        {
          objReturn.Add(new HierarchyModel { Hierarchy = item.Hierarchy, ListaTipos = (from p in objResultParamList where p.Hierarchy.Equals(item.Hierarchy) select new TypeModel { Type = p.Type }).ToList() });
        }
      }

      return objReturn;
    }
    public class itemEstado
    {
      public int orden { get; set; }
      public string nombre { get; set; }
      public string alias { get; set; }
    }


  }
}
