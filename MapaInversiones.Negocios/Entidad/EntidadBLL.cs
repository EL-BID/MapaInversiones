using DataModels;
using LinqToDB;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using SolrNet.Commands.Parameters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;

namespace PlataformaTransparencia.Negocios.Entidad
{
    public class EntidadBLL : IEntidadBLL
    {
        private readonly TransparenciaDB _connection;
        public EntidadBLL(TransparenciaDB connection)
        {
            _connection = connection;
        }

        public InfoConsolidadoEntidad GetConsolidadoPeriodos(int anyo, string codEntidad)
        {
            try
            {
                var finalidades = (
                    from pre in _connection.VwPresupuesto
                    join ct in _connection.CatalogoTiempos on pre.Periodo equals ct.Periodo
                    where pre.CodigoInstitucion == codEntidad
                        && ct.Año == anyo
                    select new FinalidadItem
                    {
                        Codigo = pre.CodigoFinalidad, 
                        Nombre = pre.Finalidad ?? string.Empty 
                    }
                )
                .Distinct()
                .ToList();

                var resultado = (
                    from info in _connection.VwPresupuesto
                    join ct in _connection.CatalogoTiempos on info.Periodo equals ct.Periodo
                    where ct.Año == anyo && info.CodigoInstitucion == codEntidad
                    group info by ct.Año into g
                    select new InfoConsolidadoEntidad
                    {
                        Periodo = g.Key,
                        Vigente = g.Sum(x => x.Vigente ?? 0f), 
                        ValorComprometido = g.Sum(x => x.Obligacion ?? 0f),
                        ValorGiros = g.Sum(x => x.Pagos ?? 0f),
                        Finalidades = finalidades
                    }
                ).FirstOrDefault();

                return resultado ?? new InfoConsolidadoEntidad
                {
                    Periodo = anyo,
                    Finalidades = finalidades
                };
            }
            catch (Exception exception)
            {
                // _logger.LogError(exception, "Error consolidado para año {Anyo} y entidad {CodEntidad}", anyo, codEntidad);
                return new InfoConsolidadoEntidad
                {
                    Periodo = anyo,
                    Finalidades = new List<FinalidadItem>()
                };
            }
        }

       

        public List<infograficoPrograma> GetClasificacionesByEntidad(int annio, string codEntidad) {
            List<infograficoPrograma> objReturn = new List<infograficoPrograma>();

            var RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                          join ct in _connection.CatalogoTiempos on info.Periodo equals ct.Periodo
                                          where ct.Año==annio && info.CodigoInstitucion == codEntidad
                                          group info by new {
                                              info.CodigoFinalidad
                                              , info.CodigoClasificacionGastoPptal
                                              , info.ClasificacionGastoPptal
                                              , info.CodigoDetalleClasificacionGastoPptal
                                              , info.DetalleClasificacionGastoPptal

                                          } into g
                                          select new infograficoPrograma
                                          {
                                              codFinalidad=g.Key.CodigoFinalidad,
                                              CodClasificacion = g.Key.CodigoClasificacionGastoPptal,
                                              Clasificacion = g.Key.ClasificacionGastoPptal,
                                              CodDetalleClasificacion=g.Key.CodigoDetalleClasificacionGastoPptal,
                                              DetalleClasificacion=g.Key.DetalleClasificacionGastoPptal,
                                              Vigente = g.Sum(x => x.Vigente ?? 0f),
                                              ValorComprometido = g.Sum(x => x.Obligacion ?? 0f),
                                              ValorGiros = g.Sum(x => x.Pagos ?? 0f),
                                          }).ToList();

  
            objReturn = RecursosPerObjetoQuery;

            return objReturn;


        }

        //------------------------------------
        public List<infografico_Nivel_1> GetProyectosInvByClasificacion(int annio, string CodEntidad, string codFinalidad)
        {
            List<itemClasificacion> resultado = new List<itemClasificacion>();

            List<infografico_Nivel_1> objReturn = new List<infografico_Nivel_1>();
            resultado = (from info in _connection.VwPresupuestoXProyInvs
                         join pre in _connection.VwPresupuesto
                             on new
                             {
                                 info.IdCatalogoLineaPresupuestal,
                                 info.CodigoInstitucion,
                                 info.Periodo
                             } equals new
                             {
                                 pre.IdCatalogoLineaPresupuestal,
                                 pre.CodigoInstitucion,
                                 pre.Periodo
                             }
                         join t in _connection.CatalogoTiempos
                             on pre.Periodo equals t.Periodo
                         where t.Año == annio
                               && pre.CodigoInstitucion == CodEntidad
                               && pre.Vigente > 0
                               && pre.CodigoFinalidad== codFinalidad
                         group new { pre, info } by new
                         {
                             pre.CodigoClasificacionGastoPptal,
                             pre.ClasificacionGastoPptal,
                             info.IdProyecto,
                             info.Bpin,
                             info.Nombreproyecto
                         } into g
                         select new itemClasificacion
                         {
                             idNivel_1 = g.Key.CodigoClasificacionGastoPptal,
                             nomNivel_1 = g.Key.ClasificacionGastoPptal,
                             idNivel_2 = g.Key.IdProyecto + "|" + g.Key.Bpin,
                             nomNivel_2 = g.Key.Nombreproyecto,
                             Vigente = g.Sum(x => x.pre.Vigente ?? 0),
                             ValorComprometido = g.Sum(x => x.pre.Obligacion ?? 0),
                             ValorGiros = g.Sum(x => x.pre.Pagos ?? 0)
                         })
                  .OrderBy(x => x.idNivel_1)
                  .ThenBy(x => x.nomNivel_1)
                  .ThenBy(x => x.idNivel_2)
                  .ThenBy(x => x.nomNivel_2)
                  .ToList();

            infografico_Nivel_1 objNivel_1 = null;
            infografico_Nivel_2 objNivel_2 = null;

            foreach (var fila in resultado)
            {
                // Buscar por ID
                objNivel_1 = objReturn.Find(p => p.Id == fila.idNivel_1);
                if (objNivel_1 == null) // Primer detalle del infografico
                {
                    objNivel_1 = new infografico_Nivel_1(fila.idNivel_1, fila.nomNivel_1);
                    objNivel_1.Vigente += fila.Vigente.Value;
                    objNivel_1.ValorComprometido += fila.ValorComprometido.Value;
                    objNivel_1.ValorGiros += fila.ValorGiros.Value;

                    objNivel_2 = new infografico_Nivel_2(fila.idNivel_2, fila.nomNivel_2);
                    objNivel_2.Vigente += fila.Vigente.Value;
                    objNivel_2.ValorComprometido += fila.ValorComprometido.Value;
                    objNivel_2.ValorGiros += fila.ValorGiros.Value;

                    objNivel_1.Detalles.Add(objNivel_2);
                    objReturn.Add(objNivel_1);
                }
                else
                {
                    objNivel_1.Vigente += fila.Vigente.Value;
                    objNivel_1.ValorComprometido += fila.ValorComprometido.Value;
                    objNivel_1.ValorGiros += fila.ValorGiros.Value;

                    // Buscar por ID 
                    objNivel_2 = objNivel_1.Detalles.Find(p => p.Id == fila.idNivel_2);
                    if (objNivel_2 == null)
                    {
                        objNivel_2 = new infografico_Nivel_2(fila.idNivel_2, fila.nomNivel_2);
                        objNivel_2.Vigente += fila.Vigente.Value;
                        objNivel_2.ValorComprometido += fila.ValorComprometido.Value;
                        objNivel_2.ValorGiros += fila.ValorGiros.Value;

                        objNivel_1.Detalles.Add(objNivel_2);
                    }
                    else
                    {
                        objNivel_2.Vigente += fila.Vigente.Value;
                        objNivel_2.ValorComprometido += fila.ValorComprometido.Value;
                        objNivel_2.ValorGiros += fila.ValorGiros.Value;
                    }
                }
            }

            // Ordena primer nivel
            var result = objReturn.OrderByDescending(x => x.Vigente).ToList();
            foreach (var item_nivel1 in result)
            {
                // Ordena nivel 2
                item_nivel1.Detalles = item_nivel1.Detalles.OrderByDescending(x => x.Vigente).ToList();
            }

            return result;
        }

        public List<itemProyectosPot> GetProyectosPotPerEntidad(string CodEntidad)
        {
            List<itemProyectosPot> resultado = new List<itemProyectosPot>();
              
            resultado = (from info in _connection.VwInformacionGeneralPerfilLocalizacionDeptoxSectorxEntidads
                         where info.IdEntidadEjecutora==CodEntidad
                         select new itemProyectosPot
                         {
                             idLocalidad=info.IdDepartamento,
                             localidad=info.NombreDepartamento,
                             id=info.IdProyecto.ToString(),
                             nombre = info.NombreProyecto,
                             tipo=info.TipoProyecto

                         })
                  .ToList();


            return resultado;
        }


    }
}
