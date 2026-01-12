using DataModels;
using LinqToDB;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Home;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using SolrNet.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using static LinqToDB.SqlQuery.SqlPredicate;
using ModelContratistaData = PlataformaTransparencia.Modelos.ModelContratistaData;


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

            if (anyo_anterior > 0)
            {
                objReturn.InfoVigenciaAnterior = info.Where(x => x.Periodo == anyo_anterior).FirstOrDefault();
            }
            else {
                objReturn.InfoVigenciaAnterior= info.Where(x => x.Periodo == anyo_max).FirstOrDefault();
            }
            objReturn.InfoVigenciaActual = info.Where(x => x.Periodo == anyo_max).FirstOrDefault();
            //objReturn.fechasCorte = GetCorteInformacion();
            //---------------------------------------------------
            objReturn.MaxAnnioEntidades = anyo_max.ToString();
            
            objReturn.anteriorVigencia = anyo_anterior.ToString();
            //----------------------------------------------------
            //objReturn.Entidades = GetConsolidadoEntidades(anyo_max);
            //-------------------
            List<InfoEntidadTerritorial> proyectosPorEnteTerritorial = GetProyectosPorEnteTerritorial();
            objReturn.Localidades = proyectosPorEnteTerritorial.OrderBy(x => x.Nombre).ToList();
            objReturn.countOngoingProjects = GetTotalesProyectos();
            //--------------------
            objReturn.TopSectoresEstrategicos = GetSectoresEstrategicos();
            objReturn.Status = true;
            return objReturn;
        }

        public itemConteoProjects GetTotalesProyectos()
        {
            var resultado = _connection.VwProyectosPOTProyectosInvLocalidads
            .Select(x => new itemConteoProjects
            {
                num_proyectos_pdl = x.TotalProyectoPDL ?? 0,
                num_proyectos_pot = x.TotalProyectoPOT ?? 0
            })
            .FirstOrDefault();
            return resultado ?? new itemConteoProjects();
        }

        public List<SectoresEstrategicos> GetSectoresEstrategicos() 
        {
            string icono_default = "icono-sector-default.png";
            var resultado = (from info in _connection.VwProyectosInversionxSectors
                             join sector in _connection.Sectors
                                 on info.IdSector equals sector.IdSector
                             orderby info.TotalProgramado descending
                             select new SectoresEstrategicos
                             {
                                 CodigoSector = info.IdSector,
                                 Sector = info.NombreSector,
                                 NumeroProyectos = info.NumeroProyectos ?? 0,
                                 TotalProgramado = (double)(info.TotalProgramado ?? 0),
                                 TotalGirado = (double)(info.TotalGirado ?? 0),
                                 Icono = string.IsNullOrEmpty(sector.IconoSector)
                                         ? icono_default
                                         : sector.IconoSector
                             })
                 .Take(4)
                 .ToList();

            return resultado ?? new List<SectoresEstrategicos>();

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
            List<InfoEntidadTerritorial> objReturn = new List<InfoEntidadTerritorial>();
            objReturn = (
            from proy in _connection.VwProyectosPOTProyectosInvLocalidads
            join imagenEnte in _connection.VwGaleriaEntidadesTerritorialesMunicipios
                on proy.IdLocalidad equals imagenEnte.IdDepartamento into imagenJoin
            from imagenEnte in imagenJoin.DefaultIfEmpty()
            where imagenEnte == null || imagenEnte.IdRegion == "0"
            select new InfoEntidadTerritorial
            {
                 Id = proy.IdLocalidad,
                 Nombre = proy.NombreLocalidad,
                UrlImg = !string.IsNullOrEmpty(imagenEnte != null ? imagenEnte.UrlImagePequenia : null)
                            ? ".." + imagenEnte.UrlImagePequenia
                            : "../img/comu1.jpg",
                LinkLocationProfile = "Location/?type=" + _levelOne + "&id=" + proy.IdLocalidad,
                NumeroProyectosPDL = proy.NumeroProyectosPDL ?? 0,
                NumeroProyectosPOT = proy.NumeroProyectosPOT ?? 0
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
                          join ct in _connection.CatalogoTiempos on info.Periodo equals ct.Periodo
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
                             join ct in _connection.CatalogoTiempos
                               on info.Periodo equals ct.Periodo
                             where anios.Contains(ct.Año)
                             && info.TipoGasto != null
                             && info.TipoGasto.ToUpper() == "PRESUPUESTO ANUAL"

                         group info by ct.Año into g
                             select new InfoPresupuestoEncabezado
                             {
                                 Periodo = g.Key,
                                 Presupuesto = g.Sum(x => x.Vigente.Value),
                                 Ejecutado = g.Sum(x => x.EjecucionAcumulada.Value),
                                 valorComprometido = g.Sum(x => x.Obligacion.Value),
                                 valorGiros = g.Sum(x => x.Pagos.Value),

                             }).ToList();

            return objReturn;
        }

        public List<string> GetAniosPresupuesto()
        {
            List<string> objReturn = new List<string>();
            objReturn = (from info in _connection.VwPresupuesto
                         join ct in _connection.CatalogoTiempos
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
            string icono_default = "icono-sector-default.png";

            var datosFiltrados = (from info in _connection.VwPresupuestoAsignadoSectors
                                  join sector in _connection.Sectors
                                      on info.CodigoSector equals sector.IdSector.ToString()
                                  where info.Año == annioInt
                                     && info.TipoGasto != null
                                     && info.TipoGasto.ToUpper() == "PRESUPUESTO ANUAL"
                                  orderby info.PorcPartipacion descending
                                  select new
                                  {
                                      info.CodigoSector,
                                      info.Sector,
                                      info.PorcPartipacion,
                                      info.ValorVigente,
                                      sector.IconoSector
                                  }).ToList();



            // Ranking secuencial y top 8
            var top8 = datosFiltrados
                .Take(8)
                .Select(p => new InfoParticipacionSector
                {
                    label = p.Sector,
                    porcentaje = (decimal)p.PorcPartipacion,
                    CodigoSector = p.CodigoSector,
                    Sector = p.Sector,
                    ValorVigente = p.ValorVigente,
                    IconoSector=p.IconoSector,
                    orden=0
                    
                })
                .ToList();

            // Otros (del 9 en adelante, agrupados)
            var otrosData = datosFiltrados
                .Skip(8)
                .ToList();

            if (otrosData.Any())
            {
                var otros = new InfoParticipacionSector
                {
                    label = "Otros",
                    porcentaje = (decimal)otrosData.Sum(x => x.PorcPartipacion),
                    CodigoSector = "00",
                    Sector = "Otros",
                    ValorVigente = otrosData.Sum(x => x.ValorVigente),
                    IconoSector= icono_default,
                    orden = 1
                };
                top8.Add(otros);
            }
                       
        
            objReturn = top8
            .OrderBy(e => e.orden)
            .ThenByDescending(e => e.porcentaje)
            .ToList();
            return objReturn;

        }
        public List<InfoParticipacionEntidad> ObtenerPorcentajeParticipacionEntidad(string annio)
        {
            int annioInt = int.Parse(annio);

            var datosFiltrados = _connection.VwPresupuestoAsignadoEntidads
            .Where(p => p.Año == annioInt
                   && p.TipoGasto != null
                   && p.TipoGasto.ToUpper() == "PRESUPUESTO ANUAL")
            .OrderByDescending(p => p.PorcPartipacion)
            .Select(x => new
            {
                x.Institucion,
                x.PorcPartipacion,
                x.CodigoInstitucion,
                x.ValorVigente
            })
            .ToList(); 

            if (!datosFiltrados.Any())
                return new List<InfoParticipacionEntidad>();

            // Top 6 lugares
            var top6 = datosFiltrados
                .Take(6)
                .Select(x => new InfoParticipacionEntidad
                {
                    id = x.Institucion + " <br> " + x.PorcPartipacion + "%",
                    label = x.Institucion,
                    porcentaje = (decimal)x.PorcPartipacion,
                    CodigoInstitucion = x.CodigoInstitucion,
                    ValorVigente = x.ValorVigente
                })
                .ToList();

            // Calcular "Otros" si hay más de 6 registros
            var otrosData = datosFiltrados.Skip(6).ToList();

            if (otrosData.Any())
            {
                var sumaPorcentajeOtros = otrosData.Sum(x => x.PorcPartipacion);
                var porcentajePrimerLugar = (double)datosFiltrados.First().PorcPartipacion;

                // Solo agregar "Otros" si su porcentaje es menor o igual al primer lugar
                if (sumaPorcentajeOtros <= porcentajePrimerLugar)
                {
                    var otros = new InfoParticipacionEntidad
                    {
                        id = "Otros <br> " + sumaPorcentajeOtros + "%",
                        label = "Otros",
                        porcentaje = (decimal)sumaPorcentajeOtros,
                        CodigoInstitucion = "00",
                        ValorVigente = otrosData.Sum(x => x.ValorVigente)
                        
                    };

                    top6.Add(otros);
                }
            }

            // Reordenar por porcentaje descendente
            return top6.OrderByDescending(e => e.porcentaje).ToList();
        }


    }
}
