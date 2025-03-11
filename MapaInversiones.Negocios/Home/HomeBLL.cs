using System;
using System.Collections.Generic;
using System.Linq;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos.Home;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using ModelContratistaData = PlataformaTransparencia.Modelos.ModelContratistaData;
using LinqToDB;
using Microsoft.Extensions.Configuration;
using DataModels;
using SolrNet.Utils;
using static LinqToDB.SqlQuery.SqlPredicate;

namespace PlataformaTransparencia.Negocios.Home
{
    public class HomeBLL : IHomeBLL
    {
        /// <summary>
        /// Capa de negocio para funciones Home - Page principal
        /// </summary>

        private readonly TransparenciaDB _connection;
        private IConfiguration _configuration;
        private static string _levelOne = string.Empty;
        private static string _levelTwo = string.Empty;
        private const string comuna = "COMUNA";
        private const string centroPoblado = "CABECERA CORREGIMIENTO";

        public HomeBLL(TransparenciaDB connection, IConfiguration configuration)
        {
            _connection = connection;
            _configuration = configuration;
            IConfigurationSection levelOne = _configuration.GetSection("LocationLevel1");
            IConfigurationSection levelTwo = _configuration.GetSection("LocationLevel2");
            if (levelOne != null && levelOne.Value != null) _levelOne = levelOne.Value.ToUpper().Trim();
            if (levelTwo != null && levelTwo.Value != null) _levelTwo = levelTwo.Value.ToUpper().Trim();
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
            return objReturn;
        }

        public ModelHomeData ObtenerDatosModeloInicio(bool esHome = true)
        {
            ModelHomeData objReturn = new();
            if (!esHome)
            {
                return objReturn;
            }

            var lastTwoPeriods = _connection.VwPresupuesto
            .Select(x => Convert.ToInt32(x.Periodo.ToString().Substring(0, 4)))
            .Distinct()
            .OrderByDescending(periodo => periodo)
            .Take(2)
            .ToList();

            int anyo_max = lastTwoPeriods.Any() ? lastTwoPeriods[0] : 0;
            int anyo_anterior = lastTwoPeriods.Count > 1 ? lastTwoPeriods[1] : 0;
            //--------------------------------------------------
            var info = GetCantidadesPresupuesto(new int[] { anyo_anterior, anyo_max });
            objReturn.InfoVigenciaAnterior = info.Where(x => x.Periodo == anyo_anterior).FirstOrDefault();
            objReturn.InfoVigenciaActual = info.Where(x => x.Periodo == anyo_max).FirstOrDefault();
            objReturn.fechasCorte = GetCorteInformacion();
            //---------------------------------------------------
            objReturn.MaxAnnioEntidades = anyo_max.ToString();
            objReturn.anteriorVigencia = anyo_anterior.ToString();
            //----------------------------------------------------
            objReturn.Entidades = GetConsolidadoEntidades(anyo_max);
            //-------------------
            List<InfoEntidadTerritorial> proyectosPorEnteTerritorial = GetProyectosPorEnteTerritorial();
            objReturn.Comunas = proyectosPorEnteTerritorial.Where(x => x.Tipo != null && x.Tipo.ToUpper().Trim() == comuna).OrderBy(x => x.Id).ToList();
            objReturn.Corregimientos = proyectosPorEnteTerritorial.Where(x => x.Tipo != null && x.Tipo.ToUpper().Trim() == centroPoblado).OrderBy(x => x.Nombre).ToList();
            objReturn.countOngoingProjects = GetTotalesProyectos();
            
            //--------------------
            objReturn.Status = true;
            return objReturn;
        }

        public itemConteoProjects GetTotalesProyectos()
        {
            var resultado =
                (from info in _connection.VwEstadoProyectosInvs
                 group info by 1 into g
                 select new itemConteoProjects
                 {
                     cantidad = g.Sum(x => x.NumeroProyectos ?? 0),
                     costo = Convert.ToDouble(g.Sum(x => x.ValorProyectos ?? 0))
                 })
                .FirstOrDefault();

            return resultado ?? new itemConteoProjects();
        }

        private itemFechasCorte GetCorteInformacion() {
            var dataFuenteFecha = (from info in _connection.FuenteDeLosRecursos
                                   where info.IdFuente == 3 //presupuesto
                                   select new itemFechasCorte
                                   {
                                       fechaActualizacion = info.FechaActualizacionFuente.ToString("yyyy-MM-dd"),
                                       fechaCorte = info.FechaCorteFuente.HasValue ? info.FechaCorteFuente.Value.ToString("yyyy-MM-dd") : ""

                                   }).FirstOrDefault();

            return dataFuenteFecha;

        }

        private List<InfoEntidadTerritorial> GetProyectosPorEnteTerritorial()
        {
            List<string> tiposDeEntidad = new() { comuna, centroPoblado };
            List<InfoEntidadTerritorial> objReturn = (from estadoProyectosInv in _connection.VwEstadoProyectosInvs
                          join ente in _connection.EnteTerritorials
                              on estadoProyectosInv.IdMunicipio equals ente.IdMunicipio
                          join imagenEnte in _connection.VwGaleriaEntidadesTerritorialesMunicipios
                              on ente.IdMunicipio equals imagenEnte.IdMunicipio
                          where estadoProyectosInv.IdDepartamento == ente.IdDepartamento
                                && imagenEnte.IdDepartamento == ente.IdDepartamento
                                //&& imagenEnte.IdRegion == "1"
                                //&& ente.IdRegion == "1"
                                && ente.NombreRegion != null
                                && tiposDeEntidad.Contains(ente.NombreRegion.ToUpper().Trim())
                          group new { estadoProyectosInv, ente, imagenEnte }
                               by new
                               {
                                   //Id=ente.IdMunicipio,
                                   Nombre = ente.NombreDepartamento,
                                   Tipo = ente.NombreRegion,
                                   UrlImg = !string.IsNullOrEmpty(imagenEnte.UrlImagePequenia)? ".." + imagenEnte.UrlImagePequenia : "../img/comu1.jpg",
                                   LinkLocationProfile = (ente.NombreRegion == "COMUNA")
                                                        ? "Location/?type=" + _levelOne + "&id=" + ente.IdMunicipio
                                                        : "Location/?type=" + _levelTwo + "&id=" + ente.IdMunicipio
                               } into g
                          select new InfoEntidadTerritorial
                          {
                              Id = g.FirstOrDefault().ente.IdMunicipio,
                              Nombre = g.Key.Nombre,
                              Tipo = g.Key.Tipo,
                              UrlImg = g.Key.UrlImg,
                              LinkLocationProfile = g.Key.LinkLocationProfile,
                              CantidadProyectos = g.Sum(x => x.estadoProyectosInv.NumeroProyectos ?? 0),
                              ValorProyectos = g.Sum(x => x.estadoProyectosInv.ValorProyectos ?? 0)
                          }).ToList();


            
            return objReturn;
        }

        /// <summary>
        /// Funcion que retorna las n primeras entidades con mayor valor vigente para el año más actual, pendiente definir la cantidad de entidades
        /// </summary>
        /// <returns></returns>
        public List<InfoEntidadesConsolida> GetConsolidadoEntidades(int maxyear)
        {

            var objReturn = new List<InfoEntidadesConsolida>();
            var result = (from info in _connection.VwPresupuesto
                          join ct in _connection.CatalogoTiempoes on info.Periodo equals ct.Periodo
                          where ct.Año == maxyear
                          group info by new
                          {
                              info.CodigoInstitucion,
                              info.Institucion
                          } into g
                          select new InfoEntidadesConsolida
                          {
                              id = g.Key.CodigoInstitucion.ToString(),
                              labelGroup = g.Key.Institucion,
                              label = "",
                              avance = ((decimal)g.Sum(x => x.EjecucionAcumulada)),
                              asignado = ((decimal)g.Sum(x => x.Vigente))
                          })
             .OrderByDescending(x => x.avance)
             .Take(8)
             .ToList();

            if (result.Count > 0) {
                for (var i = 0; i < result.Count; i++)
                {
                    if (result[i].asignado > 0)
                    {
                        result[i].porcentaje = Math.Round(((decimal)(result[i].avance / result[i].asignado) * 100), 2);
                    }
                }
                objReturn = result;
            }

            
            return objReturn;


        }

        public List<InfoPresupuestoEncabezado> GetCantidadesPresupuesto(int[] anios)
        {
            List<InfoPresupuestoEncabezado> objReturn = new List<InfoPresupuestoEncabezado>();
            objReturn = (from info in _connection.VwPresupuesto
                             join ct in _connection.CatalogoTiempoes
                               on info.Periodo equals ct.Periodo
                             where anios.Contains(ct.Año)
                             group info by ct.Año into g
                             select new InfoPresupuestoEncabezado
                             {
                                 Periodo = g.Key,
                                 Presupuesto = g.Sum(x => x.Vigente.Value),
                                 Ejecutado = g.Sum(x => x.EjecucionAcumulada.Value),
                                 AprobadoFondoPropio = g.Sum(x => x.ClasificacionFondo.ToLower().Contains("recursos propios") ? x.Vigente.Value : 0)
                             }).ToList();

            return objReturn;
        }

        public List<string> GetAniosPresupuesto()
        {
            List<string> objReturn = new List<string>();
            objReturn = (from info in _connection.VwPresupuesto
                         join ct in _connection.CatalogoTiempoes
                         on info.Periodo equals ct.Periodo
                         group info by new { ct.Año } into g
                         orderby g.Key.Año descending
                         select g.Key.Año.ToString()
                           ).ToList();
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

        public List<InfoParticipacionSector> ObtenerPorcentajeParticipacionSector(string annio)
        {
            List<InfoParticipacionSector> objReturn = new();
            int annioInt = int.Parse(annio);
            var queryConRanking = from p in _connection.VwPresupuestoAsignadoSectors
                                  where p.Año == annioInt
                                  let rn = (from q in _connection.VwPresupuestoAsignadoSectors
                                            where q.Año == annioInt && q.PorcPartipacion > p.PorcPartipacion
                                            select q).Count() + 1
                                  select new { p, rn };

            var top8 = (from x in queryConRanking
                        where x.rn <= 8
                        orderby x.rn
                        select new InfoParticipacionSector
                        {
                            label = x.p.Sector,
                            porcentaje = (decimal)x.p.PorcPartipacion,
                            CodigoSector = x.p.CodigoSector,
                            ValorVigente = x.p.ValorVigente,
                            PorcPartipacion = x.p.PorcPartipacion
                        }).ToList();

            //categoría "Otros"
            var otros = (from x in queryConRanking
                         where x.rn > 8
                         group x by 1 into grupo
                         select new InfoParticipacionSector
                         {
                             label = "Otros",
                             porcentaje = (decimal)grupo.Sum(x => x.p.PorcPartipacion),
                             CodigoSector = "00",
                             Sector = "Otros",
                             ValorVigente = grupo.Sum(x => x.p.ValorVigente),
                             PorcPartipacion = grupo.Sum(x => x.p.PorcPartipacion)
                         }).FirstOrDefault();

            if (otros != null)
            {
                top8.Add(otros);
            }
            
        
            objReturn = top8;
            return objReturn;

        }



        public List<InfoParticipacionEntidad> ObtenerPorcentajeParticipacionEntidad(string annio)
        {

            List<InfoParticipacionEntidad> objReturn = new();
            int annioInt = int.Parse(annio);

            var queryConRanking = from p in _connection.VwPresupuestoAsignadoEntidads
                                  where p.Año == annioInt
                                  let rn = (from q in _connection.VwPresupuestoAsignadoEntidads
                                            where q.Año == annioInt && q.PorcPartipacion > p.PorcPartipacion
                                            select q).Count() + 1
                                  select new { p, rn };

            var top_6 = (from x in queryConRanking
                        where x.rn <= 6
                        orderby x.rn
                        select new InfoParticipacionEntidad
                        {
                            id = x.p.Institucion + " <br> " + x.p.PorcPartipacion + "%",
                            label = x.p.Institucion,
                            porcentaje = (decimal)x.p.PorcPartipacion,
                            CodigoInstitucion = x.p.CodigoInstitucion,
                            ValorVigente = x.p.ValorVigente,
                            PorcPartipacion = x.p.PorcPartipacion
                        }).ToList();

            //categoría "Otros"
            var otros = (from x in queryConRanking
                         where x.rn > 6
                         group x by 1 into grupo
                         select new InfoParticipacionEntidad
                         {
                             id= "Otros" + " <br> " + grupo.Sum(x => x.p.PorcPartipacion) + "%",
                             label = "Otros",
                             porcentaje = (decimal)grupo.Sum(x => x.p.PorcPartipacion),
                             CodigoInstitucion = "00",
                             ValorVigente = grupo.Sum(x => x.p.ValorVigente),
                             PorcPartipacion = grupo.Sum(x => x.p.PorcPartipacion)
                         }).FirstOrDefault();

            if (otros != null)
            {
                top_6.Add(otros);
            }


            objReturn = top_6;
            return objReturn;
        }

    }
}
