using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Linq;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.OrganismoFinanciador;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Interfaces;
using SolrNet.Utils;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;

namespace PlataformaTransparencia.Negocios.OrganismoFinanciador
{
    public class FinanciadorBLL : IFinanciadorBLL
    {
        private readonly TransparenciaDB _connection;
        public FinanciadorBLL(TransparenciaDB connection)
        {
            _connection = connection;
        }

        #region Organismo Financiador
        public List<int> ObtenerAniosVistaPresupuesto()
        {
            List<int> result = (from presupuesto in _connection.VwPresupuestoes
                                join tiempo in _connection.CatalogoTiempoes on presupuesto.Periodo.ToString() equals tiempo.Periodo
                                select tiempo.Año).Distinct().OrderByDescending(x => x).ToList();
            return result;
        }
        public List<int> ObtenerAniosVistaPresupuestoPorCodigoFinanciador(int id)
        {
            List<int> result = (from presupuesto in _connection.VwPresupuestoes
                                join tiempo in _connection.CatalogoTiempoes on presupuesto.Periodo.ToString() equals tiempo.Periodo
                                where presupuesto.CodigoOrganismoFinanciador == id
                                select tiempo.Año).Distinct().OrderByDescending(x => x).ToList();
            return result;
        }
        public ModelDataConsolidadoFinanciador ObtenerConsolidadoOrganismosFinanciadoresPorAnioAndCodigoFuente(int anio, int codigoFuente)
        {
            var query = from vp in _connection.VwPresupuestoXProyInvs
                        join ct in _connection.CatalogoTiempoes
                        on vp.Periodo.ToString().Substring(0, 6) equals ct.Periodo
                        where vp.CodigoFuenteDeFinanciamiento == codigoFuente && ct.Año == anio
                        select new
                        {
                            vp.Bpin,
                            vp.OrganismoFinanciador,
                            vp.ValorFinanciado
                        };
            var result = query.GroupBy(x => 1)
                              .Select(g => new ModelDataConsolidadoFinanciador
                              {
                                  Status = true,
                                  Message = string.Empty,
                                  Financiadores = new(),
                                  TotalProyectosFinanciados = g.Select(x => x.Bpin).Distinct().Count(),
                                  TotalFinanciadores = g.Select(x => x.OrganismoFinanciador).Distinct().Count(),
                                  TotalAportado = Convert.ToDouble(g.Sum(x => x.ValorFinanciado ?? 0)/1000000)
                              }).FirstOrDefault();
            return result != null ? result : new ModelDataConsolidadoFinanciador { TotalAportado=0, TotalFinanciadores=0, TotalProyectosFinanciados=0, Status=true, Message=string.Empty, Financiadores=new() };
        }
        public string ObtenerNombreOrganismoPorCodigoFinanciador(int id)
        {
            var organismoFinanciador = (from catalogoOrganismoFinanciador in _connection.CatalogoOrganismoFinanciadors
                                        where catalogoOrganismoFinanciador.IdOrganismoFinanciador == id.ToString()
                                        select catalogoOrganismoFinanciador).First();
            if (organismoFinanciador == null) return string.Empty;
            return organismoFinanciador.OrganismoFinanciador;
        }
        public List<ModelDataFinanciador> ObtenerOrganismosFinanciadoresPorAnioAndCodigoFuente(int anio, int codigoFuente)
        {
            List<ModelDataFinanciador> rta = new();
            List<ModelDataConsolidadosPorOrganismoFinanciador> consolidadoFinanciadores = (from info in _connection.VwPresupuestoes
                                                                                           join ct in _connection.CatalogoTiempoes on info.Periodo.ToString() equals ct.Periodo
                                                                                           where ct.Año == anio && info.CodigoFuenteDeFinanciamiento == codigoFuente
                                                                                           group info by new { ct.Año, info.CodigoOrganismoFinanciador, info.OrganismoFinanciador } into g
                                                                                           select new ModelDataConsolidadosPorOrganismoFinanciador
                                                                                           {
                                                                                               Anio = g.Key.Año,
                                                                                               CodigoOrganismo = g.Key.CodigoOrganismoFinanciador,
                                                                                               Organismo = g.Key.OrganismoFinanciador,
                                                                                               Aprobado = g.Sum(x => x.Aprobado ?? 0),
                                                                                               Vigente = g.Sum(x => x.Vigente ?? 0)
                                                                                           }).ToList();
            if (consolidadoFinanciadores == null || consolidadoFinanciadores.Count == 0) return new();
            List<ModelDataProyectosPorOrganismoFinanciador> organismosFinanciadorEstadosProyectos = ObtenerConsolidadoProyectosPorOrganismoFinanciadorPorPorAnioAndCodigoFuente(anio, codigoFuente);
            List<Item> estados = new();
            if (organismosFinanciadorEstadosProyectos != null && organismosFinanciadorEstadosProyectos.Count > 0)
                estados= organismosFinanciadorEstadosProyectos.Select(x=>new Item { Id=x.EstadoId.ToString(), Nombre= x.Estado}).DistinctBy(x=>x.Id).ToList();
            foreach (ModelDataConsolidadosPorOrganismoFinanciador consolidadoFinanciador in consolidadoFinanciadores)
            {
                ModelDataFinanciador financiador = new () { CodigoOrganismo = consolidadoFinanciador.CodigoOrganismo, Nombre = consolidadoFinanciador.Organismo, MontoFinanciado = consolidadoFinanciador.Vigente / 1000000.0, Estados = new() };
                foreach (Item estado in estados)
                {
                    int proyectosPorEstado = organismosFinanciadorEstadosProyectos.Where(x => x.CodigoOrganismo == consolidadoFinanciador.CodigoOrganismo && x.EstadoId.ToString() == estado.Id).Count();
                    financiador.Estados.Add(new Item { Id= estado.Id, Nombre= estado.Nombre, Valor= proyectosPorEstado });
                }
                financiador.Estados.Add(financiador.Estados.Count == 0 ? new Item { Id = "-1", Nombre = "FINANCIADOS", Valor = 0 } : new Item { Id = "-1", Nombre = "FINANCIADOS", Valor = financiador.Estados.Sum(x => x.Valor) });
                rta.Add(financiador);
            }
            return rta;
        }
        public List<ModelDataProyectosPorOrganismoFinanciador> ObtenerConsolidadoProyectosPorOrganismoFinanciadorPorPorAnioAndCodigoFuente(int anio, int codigoFuente)
        {
            List<ModelDataProyectosPorOrganismoFinanciador> result = (from vppi in _connection.VwPresupuestoXProyInvs
                                                                      join tiempo in _connection.CatalogoTiempoes on vppi.Periodo.ToString() equals tiempo.Periodo
                                                                      where vppi.CodigoFuenteDeFinanciamiento == codigoFuente && tiempo.Año == anio 
                                                                      group vppi by new { tiempo.Año, vppi.IdEstado, vppi.NombreEstado, vppi.CodigoOrganismoFinanciador, vppi.OrganismoFinanciador, vppi.Nombreproyecto } into g
                                                                      select new ModelDataProyectosPorOrganismoFinanciador
                                                                      {
                                                                          Anio = g.Key.Año,
                                                                          CodigoOrganismo = g.Key.CodigoOrganismoFinanciador,
                                                                          Organismo = g.Key.OrganismoFinanciador,
                                                                          Estado= g.Key.NombreEstado,
                                                                          EstadoId= g.Key.IdEstado,
                                                                          TotalProyectos = g.Count(),
                                                                      }).ToList();
            return result;
        }

        public List<ModelDataProyectosPorOrganismoFinanciador> ObtenerConsolidadoProyectosOrganismoFinanciadorPorPorAnioAndCodigoOrganismoFinanciador(int anio, int codigoFinanciador)
        {
            var proyectosPorFinanciadorAnio = (from info in _connection.VwPresupuestoXProyInvs
                                               join ct in _connection.CatalogoTiempoes on info.Periodo.ToString() equals ct.Periodo
                                               where ct.Año == anio && info.CodigoOrganismoFinanciador == codigoFinanciador && info.Nombreproyecto != null
                                               select new
                                               {
                                                   ct.Año,
                                                   info.Bpin,
                                                   info.CodigoOrganismoFinanciador,
                                                   info.OrganismoFinanciador,
                                                   info.IdEstado,
                                                   info.NombreEstado,
                                                   info.Nombreproyecto
                                               }).Distinct().ToList();
            List<ModelDataProyectosPorOrganismoFinanciador> result = (from ppfa in proyectosPorFinanciadorAnio
                                                                group ppfa by new { ppfa.Año, ppfa.CodigoOrganismoFinanciador, ppfa.OrganismoFinanciador, ppfa.IdEstado, ppfa.NombreEstado } into g
                                                                select new ModelDataProyectosPorOrganismoFinanciador
                                                                {
                                                                    Anio = g.Key.Año,
                                                                    CodigoOrganismo = g.Key.CodigoOrganismoFinanciador,
                                                                    Organismo = g.Key.OrganismoFinanciador.ToUpper().Trim(),
                                                                    Estado= g.Key.NombreEstado.ToUpper().Trim(),
                                                                    EstadoId= g.Key.IdEstado,
                                                                    TotalProyectos = g.Count(),
                                                                }).ToList();
            return result;
        }
        public ModelDataFinanciador ObtenerDataFinanciadorPorAnioAndCodigoFinanciador(int anio, int codigoOrganismoFinanciador)
        {
            List<ModelDataConsolidadosPorOrganismoFinanciador> datosOrganismoFinanciador = (from presupuesto in _connection.VwPresupuestoes
                                                                                            join tiempo in _connection.CatalogoTiempoes on presupuesto.Periodo.ToString() equals tiempo.Periodo
                                                                                            where presupuesto.CodigoOrganismoFinanciador == codigoOrganismoFinanciador && tiempo.Año == anio
                                                                                            group presupuesto by new { tiempo.Año, presupuesto.CodigoOrganismoFinanciador, presupuesto.OrganismoFinanciador, presupuesto.FuenteDeFinanciamiento } into g
                                                                                            select new ModelDataConsolidadosPorOrganismoFinanciador
                                                                                            {
                                                                                                Anio = g.Key.Año,
                                                                                                CodigoOrganismo = g.Key.CodigoOrganismoFinanciador,
                                                                                                Organismo = g.Key.OrganismoFinanciador,
                                                                                                Fuente = g.Key.FuenteDeFinanciamiento,
                                                                                                Aprobado = g.Sum(x => x.Aprobado ?? 0)/1000000,
                                                                                                Vigente = g.Sum(x => x.Vigente ?? 0) / 1000000
                                                                                            }).ToList();
            if (datosOrganismoFinanciador == null) return new();
            string organismo = datosOrganismoFinanciador.Count > 0 ? datosOrganismoFinanciador.First().Organismo : string.Empty;
            List <ModelDataProyectosPorOrganismoFinanciador> organismosFinanciadorProyectos = ObtenerConsolidadoProyectosOrganismoFinanciadorPorPorAnioAndCodigoOrganismoFinanciador(anio, codigoOrganismoFinanciador);
            organismosFinanciadorProyectos ??= new();
            List<Item> estados= organismosFinanciadorProyectos.Select(x=>new Item { Id= x.EstadoId.ToString(), Nombre= x.Estado, Valor= x.TotalProyectos }).DistinctBy(x=>x.Id).ToList();
            //estados.Insert(0, new Item { Id = "-1", Nombre = "FINANCIADOS", Valor = estados.Any()? estados.Sum(x => x.Valor): 0 });
            ModelDataFinanciador rta = new() { CodigoOrganismo = codigoOrganismoFinanciador, MontoFinanciado = datosOrganismoFinanciador.Sum(x=>x.Vigente), Nombre = organismo, Estados= estados, MontosPorFuenteFinanciacion= datosOrganismoFinanciador, ProyectosFinanciados = estados.Any() ? estados.Sum(x => x.Valor) : 0  };
            return rta;
        }
        #endregion Organismo Financiador

        #region Organismo Financiador Detalle
        /// <summary>
        /// Estructura infografica Sankey 4 niveles
        /// </summary>
        /// <param name="annio">periodo o año</param>
        /// <param name="opcion">Nombre sector</param>
        /// <returns>Array Json con padres e hijos según jerarquia de 4 niveles</returns>
        public List<InfograficoFuentes_Nivel_1> ObtenerDataGraficoSankeyPorAnioCodigoFinanciadorSector(int annio, int codigoOrganismoFinanciador, int sectorId)
        {
            List<InfograficoFuentes_Nivel_1> objReturn = new();
            List<itemSankey> RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                                       join t in _connection.CatalogoTiempoes on info.Periodo.ToString() equals t.Periodo
                                                       where t.Año == annio
                                                                   && (!string.IsNullOrEmpty(info.FuenteDeFinanciamiento))
                                                                   && (info.FuenteDeFinanciamiento != "NULL")
                                                                   && (!string.IsNullOrEmpty(info.Sector))
                                                                   && (info.Sector != "NULL")
                                                                   && info.IdSector == sectorId
                                                                   && info.CodigoOrganismoFinanciador == codigoOrganismoFinanciador
                                                                   && info.Vigente > 0
                                                       orderby info.FuenteDeFinanciamiento, info.Institucion, info.Programa descending
                                                       select new itemSankey
                                                       {
                                                           idNivel_1 = info.CodigoFuenteDeFinanciamiento.ToString(),
                                                           nomNivel_1 = "fue|" + info.FuenteDeFinanciamiento,
                                                           idNivel_2 = info.CodigoInstitucion,
                                                           nomNivel_2 = "ent|" + info.Institucion,
                                                           idNivel_3 = info.TipoGasto,
                                                           nomNivel_3 = "gast|" + info.TipoGasto,
                                                           idNivel_4 = info.CodigoObjetoDeGasto,
                                                           nomNivel_4 = "obj|" + info.ObjetoDeGasto,
                                                           Avance = (decimal)info.EjecucionAcumulada,
                                                           Presupuesto = (decimal)info.Vigente
                                                       }).ToList();
            InfograficoFuentes_Nivel_1 objNivel_1 = null;  //fuente de financiacion/recurso
            InfograficoFuentes_Nivel_2 objNivel_2 = null;   //entidad o institucion
            InfograficoFuentes_Nivel_3 objNivel_3 = null;  //tipo de gasto
            InfograficoFuentes_Nivel_4 objNivel_4 = null;  //objeto o detalle del gasto
            foreach (var fila in RecursosPerObjetoQuery)
            {
                var nomNivel1_aux = fila.nomNivel_1;
                var vec_fuente = fila.nomNivel_1.Split("_");
                if (vec_fuente.Length > 0) nomNivel1_aux = vec_fuente[0];
                objNivel_1 = objReturn.Find(p => p.Nombre == nomNivel1_aux);
                if (objNivel_1 == null) //Primer detalle del infografico
                {
                    objNivel_1 = new InfograficoFuentes_Nivel_1(fila.idNivel_1, nomNivel1_aux);
                    objNivel_1.presupuesto += (decimal)fila.Presupuesto;
                    objNivel_1.avance += (decimal)fila.Avance;
                    objNivel_2 = objNivel_1.Detalles.Find(p => p.Nombre == fila.nomNivel_2);
                    if (objNivel_2 == null)
                    {
                        objNivel_2 = new InfograficoFuentes_Nivel_2(fila.idNivel_2, fila.nomNivel_2);
                        objNivel_2.presupuesto += (decimal)fila.Presupuesto;
                        objNivel_2.avance += (decimal)fila.Avance;
                        objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3);
                        if (objNivel_3 == null)
                        {
                            objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;
                            objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
                            if (objNivel_4 == null)
                            {
                                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                                objNivel_3.Detalles.Add(objNivel_4);
                            }
                            else
                            {
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                            }
                            objNivel_2.Detalles.Add(objNivel_3);
                        }
                        else
                        {
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;
                            objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
                            if (objNivel_4 == null)
                            {
                                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                                objNivel_3.Detalles.Add(objNivel_4);
                            }
                            else
                            {
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                            }
                        }
                        objNivel_1.Detalles.Add(objNivel_2);
                    }
                    else
                    {
                        objNivel_2.presupuesto += (decimal)fila.Presupuesto;
                        objNivel_2.avance += (decimal)fila.Avance;
                        objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3);
                        if (objNivel_3 == null)
                        {
                            objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;
                            objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
                            if (objNivel_4 == null)
                            {
                                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;

                                objNivel_3.Detalles.Add(objNivel_4);
                            }
                            else
                            {
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                            }
                            objNivel_2.Detalles.Add(objNivel_3);
                        }
                        else
                        {
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;

                        }
                    }
                    objReturn.Add(objNivel_1);
                }
                else
                {
                    objNivel_1.presupuesto += (decimal)fila.Presupuesto;
                    objNivel_1.avance += (decimal)fila.Avance;
                    objNivel_2 = objNivel_1.Detalles.Find(p => p.Nombre == fila.nomNivel_2);
                    if (objNivel_2 == null)
                    {
                        objNivel_2 = new InfograficoFuentes_Nivel_2(fila.idNivel_2, fila.nomNivel_2);
                        objNivel_2.presupuesto += (decimal)fila.Presupuesto;
                        objNivel_2.avance += (decimal)fila.Avance;
                        objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3.ToString());
                        if (objNivel_3 == null)
                        {
                            objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;

                            objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
                            if (objNivel_4 == null)
                            {
                                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;

                                objNivel_3.Detalles.Add(objNivel_4);
                            }
                            else
                            {
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                            }
                            objNivel_2.Detalles.Add(objNivel_3);
                        }
                        else
                        {
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;

                            objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
                            if (objNivel_4 == null)
                            {
                                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;

                                objNivel_3.Detalles.Add(objNivel_4);
                            }
                            else
                            {
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                            }
                        }
                        objNivel_1.Detalles.Add(objNivel_2);
                    }
                    else
                    {
                        objNivel_2.presupuesto += (decimal)fila.Presupuesto;
                        objNivel_2.avance += (decimal)fila.Avance;
                        objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3);
                        if (objNivel_3 == null)
                        {
                            objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;

                            objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
                            if (objNivel_4 == null)
                            {
                                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;

                                objNivel_3.Detalles.Add(objNivel_4);
                            }
                            else
                            {
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                            }
                            objNivel_2.Detalles.Add(objNivel_3);
                        }
                        else
                        {
                            objNivel_3.presupuesto += (decimal)fila.Presupuesto;
                            objNivel_3.avance += (decimal)fila.Avance;
                            objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
                            if (objNivel_4 == null)
                            {
                                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;

                                objNivel_3.Detalles.Add(objNivel_4);
                            }
                            else
                            {
                                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                                objNivel_4.avance += (decimal)fila.Avance;
                            }
                        }
                    }
                }
            }
            ///ordena primer nivel
            var result = objReturn.OrderByDescending(x => x.presupuesto).ToList();
            foreach (var item_nivel1 in result)
            {
                //ordena nivel 2
                item_nivel1.Detalles = item_nivel1.Detalles.OrderByDescending(x => x.presupuesto).ToList();
                foreach (var item_nivel2 in item_nivel1.Detalles)
                {
                    //ordena nivel 3
                    item_nivel2.Detalles = item_nivel2.Detalles.OrderByDescending(x => x.presupuesto).ToList();
                    foreach (var item_nivel3 in item_nivel2.Detalles)
                    {
                        //ordena nivel 4
                        item_nivel3.Detalles = item_nivel3.Detalles.OrderByDescending(x => x.presupuesto).Take(5).ToList();
                    }
                }
            }
            return result;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="anio"></param>
        /// <param name="codigoOrganismoFinanciador"></param>
        /// <param name="sectorId"></param>
        /// <returns></returns>
        public List<itemGenPresupuesto> ObtenerDataProyectosPorAnioCodigoFinanciador(int anio, int codigoOrganismoFinanciador)
        {
            var proyectosPorFinanciadorAnio = (from info in _connection.VwPresupuestoXProyInvs
                                               join ct in _connection.CatalogoTiempoes on info.Periodo.ToString() equals ct.Periodo
                                               where ct.Año == anio && info.CodigoOrganismoFinanciador == codigoOrganismoFinanciador //&& info.Bpin != null
                                               select new
                                               {
                                                   ct.Año,
                                                   Bpin=info.Bpin!=null? info.Bpin: string.Empty,
                                                   IdProyecto = info.IdProyecto ?? 0,
                                                   info.CodigoOrganismoFinanciador,
                                                   info.OrganismoFinanciador,
                                                   info.NombreEstado,
                                                   info.IdEstado,
                                                   info.Nombreproyecto,
                                                   ValorFinanciadoxOrganismo = info.ValorFinanciado??0,
                                                   ValorEjecutadoxOrganismo =info.ValorEjecutado??0,
                                                   ValorProyecto= info.ValorProyecto??0,
                                                   AvanceFinanciero= info.Avancefinanciero ?? 0
                                               }).OrderByDescending(x=>x.IdEstado).ThenBy(x=>x.Nombreproyecto).ToList();
            List<itemGenPresupuesto> objReturn = (from ppfa in proyectosPorFinanciadorAnio
                                                  group ppfa by new { ppfa.Bpin, ppfa.IdProyecto, ppfa.Nombreproyecto, ppfa.NombreEstado} into g
                                                  select new itemGenPresupuesto
                                                  {
                                                    id= g.Key.IdProyecto.ToString(),
                                                    nombre= g.Key.Nombreproyecto,
                                                    ejecutado = g.Sum(x=>x.ValorEjecutadoxOrganismo)/1000000,
                                                    vigente = g.Sum(x => x.ValorFinanciadoxOrganismo)/1000000, //g.Sum(x=>x.ValorFinanciadoxOrganismo) / 1000000,
                                                    aprobado= g.Max(x=>x.ValorProyecto) /1000000,
                                                    avance_financiero= Convert.ToDouble(g.Max(x=>x.AvanceFinanciero)),
                                                    AvanceFinancieroOrganismo= g.Average(x => x.ValorFinanciadoxOrganismo)== 0? 0:  Convert.ToDouble(Math.Round(g.Average(x => x.ValorEjecutadoxOrganismo)/ g.Average(x => x.ValorFinanciadoxOrganismo),3)),
                                                    estado = g.Key.NombreEstado
                                                  }).ToList();
            return objReturn;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="annio"></param>
        /// <param name="codigoFinanciador"></param>
        /// <returns></returns>
        public List<InfoConsolidadoPresupuesto> ObtenerRecursosGraficoTreeMapSectoresPorCodigoFinanciadorAnio(int annio, int codigoFinanciador)
        {
            List<InfoConsolidadoPresupuesto> objReturn = new();
            var proyectosPorSector = (from info in _connection.VwPresupuestoXProyInvs
                                               join ct in _connection.CatalogoTiempoes on info.Periodo.ToString() equals ct.Periodo
                                               where ct.Año == annio && info.CodigoOrganismoFinanciador == codigoFinanciador && info.Nombreproyecto != null
                                               select new
                                               {
                                                   info.Bpin,
                                                   info.NombreSector,
                                                   info.Finalidad,
                                                   info.NombreEstado,
                                                   info.Nombreproyecto,
                                                   info.IdProyecto
                                               }).Distinct().ToList();
            if (proyectosPorSector == null || proyectosPorSector.Count == 0) return new();
            var RecursosPerObjetoQuery = (from ppfa in proyectosPorSector
                                          group ppfa by new { ppfa.NombreSector } into g
                                          select new InfoConsolidadoPresupuesto
                                          {
                                              //labelGroup = g.Key.Finalidad,
                                              //label = g.Key.NombreSector,
                                              labelGroup= g.Key.NombreSector,
                                              label= string.Empty,
                                              rawValueDouble = Convert.ToDouble(g.Count())
                                          }).OrderBy(x => x.labelGroup).ThenBy(n => n.label).ToList();
            objReturn = RecursosPerObjetoQuery;
            return objReturn;
        }
        #endregion Organismo Financiador Detalle
    }
}
