using Nancy.Json;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Utilitarios;
using System;
using System.Data.Entity.Spatial;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using LinqToDB;
using LinqToDB.Common;
using PlataformaTransparencia.Negocios.Interfaces;
using LinqToDB.Data;
using PlataformaTransparencia.Modelos.Reportes;
using PlataformaTransparencia.Negocios.Proyectos;
using PlataformaTransparencia.Modelos.Contratos;
using System.Data.Entity.Core.Objects;
using static LinqToDB.Reflection.Methods;
using System.Runtime;

namespace PlataformaTransparencia.Negocios.RepositorioConsultas
{
    public class ConsultasComunes : IConsultasComunes
    {
        public static List<TotalContrato> ObtenerEncabezadoGestionContratos(int? tipoEmergencia, string Entidad = null)
        {
            List<TotalContrato> objreturn = new();
            using (var DataModel = new TransparenciaDB())
            {
                //listInfo = await(from aprobado in DataModel.ObtenerEncabezadoContratos
                //                 where aprobado.TipoProyecto.ToUpper().Equals("NACIONAL")
                //                 where aprobado.IdSector == id_sector
                //                 select new InfoProyectos
                //                 {
                //                     IdProyecto = aprobado.IdProyecto,
                //                     NombreProyecto = aprobado.NombreProyecto
                //                 }).OrderBy(p => p.NombreProyecto).ToListAsync();
            }
                //using (PISGREntities DataModel = new PISGREntities())
                //{
                //  DataModel.Configuration.AutoDetectChangesEnabled = false;
                //  DataModel.Configuration.LazyLoadingEnabled = false;
                //  objreturn = (from data in DataModel.ObtenerEncabezadoContratos(Entidad, tipoEmergencia)
                //               select new TotalContratos
                //               {
                //                 MonedaContrato = data.MonedaContrato,
                //                 EstadoContrato = data.EstadoContrato,
                //                 ValorContratado = data.ValorContratado,
                //                 NroContratos = data.NroContratos
                //               }
                //                                ).ToList();
                //}
            return objreturn;
        }
        public static List<TotalProceso> ObtenerEncabezadoProcesosGestionContratos(out int? numProcesosCancelados, out decimal? valProcesosCancelados, int? tipoEmergencia, string Entidad = null)
        {
            List<TotalProceso> objreturn = new();
            numProcesosCancelados = 0;
            valProcesosCancelados = 0;
            //ObjectParameter numProcesosCanceladosParameter = new("TOTALPROCESOSCANCELADOS", 0);
            //ObjectParameter valProcesosCanceladosParameter = new("VALORPROCESOSCANCELADOS", 0);
            //using (PISGREntities DataModel = new PISGREntities())
            //{
            //  DataModel.Configuration.AutoDetectChangesEnabled = false;
            //  DataModel.Configuration.LazyLoadingEnabled = false;
            //  objreturn = (from data in DataModel.ObtenerEncabezadoProcesos(Entidad, numProcesosCanceladosParameter, valProcesosCanceladosParameter, tipoEmergencia)
            //               select new TotalProcesos
            //               {
            //                 MonedaProceso = data.MonedaProceso,
            //                 EstadoProceso = data.EstadoProceso,
            //                 ValorProceso = (double?)data.ValorProceso,
            //                 NroProcesos = data.NroProcesos
            //               }).ToList();
            //  if (numProcesosCanceladosParameter.Value.Equals(String.Empty) || numProcesosCanceladosParameter.Value.Equals(System.DBNull.Value)) { numProcesosCancelados = 0; } else { numProcesosCancelados = int.Parse(numProcesosCanceladosParameter.Value.ToString()); }
            //  if (valProcesosCanceladosParameter.Value.Equals(String.Empty) || valProcesosCanceladosParameter.Value.Equals(System.DBNull.Value)) { valProcesosCancelados = 0; } else { valProcesosCancelados = decimal.Parse(valProcesosCanceladosParameter.Value.ToString()); }
            //}
            return objreturn;
        }
        public static List<EstadoContratos> ObtenerEstadosGestionContratos(int? tipoEmergencia)
        {
            List<EstadoContratos> objreturn = new();
            //using (PISGREntities DataModel = new PISGREntities())
            //{
            //  DataModel.Configuration.AutoDetectChangesEnabled = false;
            //  DataModel.Configuration.LazyLoadingEnabled = false;
            //  objreturn = (from data in DataModel.EstadosGestionContratos(tipoEmergencia)
            //               select new EstadoContratos
            //               {
            //                 Nombre = data.Nombre,
            //                 EstadoContrato = data.EstadoContrato
            //               }).ToList();
            //}
            return objreturn;
        }
        public List<Infrastructura.DataModels.Proyecto> ObtenerProyectosConsistentes2(FiltroBusquedaProyecto filtros)
        {
            Func<PlataformaTransparencia.Infrastructura.DataModels.Proyecto, bool> predicate = null;
            List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> list = new List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
            string search = string.Empty;
            string criterioEstadosPendientes = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosPendientesSegunHistorico;
            string criterioEstadosEjecucion = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecucion;
            string criterioEstadosEjecutados = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecutado;

            string key = "ObtenerProyectosConsistentes" + ObtenerKeyPorEstadoFiltro(filtros);

            if (!ShortCacheHelper.Get<List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>>(key, out list))
            {

                using (var DataModel = new TransparenciaDB())
                {

                    Expression<Func<Infrastructura.DataModels.Proyecto, bool>> expression = PredicateBuilder.False<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }
                    IQueryable<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> queryable = DataModel.Proyectos.Where<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>(expression);
                    IQueryable<Estado> queryable2 = DataModel.Estados;
                    if (filtros.CodigosEstado.Count == 0)
                    {
                        queryable2 = from p in queryable2
                                     where (p.NombreEstado.Trim().ToUpper().Contains(criterioEstadosPendientes) | p.NombreEstado.Trim().ToUpper().Contains(criterioEstadosEjecucion)) | p.NombreEstado.Trim().ToUpper().Contains(criterioEstadosEjecutados)
                                     select p;
                    }
                    else
                    {
                        queryable2 = from p in queryable2
                                     where filtros.CodigosEstado.Contains(p.IdEstado) || (filtros.CodigosEstado.Count == 0)
                                     select p;
                    }
                    list = (from proyecto in queryable
                            join pxe in DataModel.ProyectoXEntidadTerritorials on proyecto.IdProyecto equals pxe.IdProyecto
                            join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                            join history in DataModel.HistoriaEstados on proyecto.IdProyecto equals history.IdProyecto
                            join estado in queryable2 on history.IdEstado equals estado.IdEstado
                            where (((history.ActualSiNo && (filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0))) && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0))) && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0))) && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0))
                            select proyecto).Distinct<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>().ToList<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
                    if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))
                    {
                        search = new string((from c in filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD)
                                             where c < '\x0080'
                                             select c).ToArray<char>());
                        if (predicate == null)
                        {
                            predicate = objProyecto => new string((from c in objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD)
                                                                   where c < '\x0080'
                                                                   select c).ToArray<char>()).ToLower().Contains(search.ToLower());
                        }
                        list = list.Where<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>(predicate).ToList<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
                    }

                }

                ShortCacheHelper.Add<List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>>(list, key);
            }

            Trace.WriteLine("Obtenidos los proyectos consistentes.");
            return list;
        }
        public List<InfoProyectos> ObtenerProyectosConsistentesMapListMode(FiltroBusquedaProyecto filtros, ref int page)
        {
            Func<InfoProyectos, bool> predicate = null;
            List<DataModels.Proyecto> list = new List<DataModels.Proyecto>();
            List<InfoProyectos> listInfo = new List<InfoProyectos>();
            string search = string.Empty;

            string key = "ObtenerProyectosConsistentesMapListMode" + ObtenerKeyPorEstadoFiltro(filtros);
            if (!ShortCacheHelper.Get<List<InfoProyectos>>(key, out listInfo))
            {
                //page = 1;

                listInfo = (from aprobado in RepositorioProyectos.ObtenerProyectosConsistentesMapListMode(filtros)
                            select new InfoProyectos
                            {
                                IdProyecto = aprobado.IdProyecto,
                                NombreProyecto = aprobado.NombreProyecto,
                                State = aprobado.nombreEstado,
                                EntidadEjecutora = aprobado.NombreActor,
                                VlrTotalProyectoTodasLasFuentes = aprobado.VlrTotalProyectoTodasLasFuentes,
                                VlrTotalProyectoFuenteRegalias = aprobado.VlrTotalProyectoFuenteRegalias
                            }).Distinct<InfoProyectos>().ToList<InfoProyectos>(); ;


                if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))
                {
                    search = new string((from c in filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD)
                                         where c < '\x0080'
                                         select c).ToArray<char>());
                    if (predicate == null)
                    {
                        predicate = objProyecto => new string((from c in objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD)
                                                               where c < '\x0080'
                                                               select c).ToArray<char>()).ToLower().Contains(search.ToLower());
                    }
                    listInfo = listInfo.Where<InfoProyectos>(predicate).ToList<InfoProyectos>();
                }
                ShortCacheHelper.Add<List<InfoProyectos>>(listInfo, key);
            }
            Trace.WriteLine("Obtenidos los proyectos consistentes lista Mapa.");
            return listInfo;
        }
        public List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> ObtenerProyectosConsistentes(FiltroBusquedaProyecto filtros)
        {
            Func<PlataformaTransparencia.Infrastructura.DataModels.Proyecto, bool> predicate = null;
            List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> list = new List<Infrastructura.DataModels.Proyecto>();
            string search = string.Empty;
            //string criterioEstadosPendientes = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosPendientesSegunHistorico;
            //string criterioEstadosEjecucion = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecucion;
            //string criterioEstadosEjecutados = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecutado;

            string key = "ObtenerProyectosConsistentes" + ObtenerKeyPorEstadoFiltro(filtros);
            if (!ShortCacheHelper.Get<List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>>(key, out list))
            {

                using (var DataModel = new TransparenciaDB())
                {

                    Expression<Func<VwProyectosAprobadosInv, bool>> expression = PredicateBuilder.False<VwProyectosAprobadosInv>();

                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<VwProyectosAprobadosInv>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }

                    IQueryable<VwProyectosAprobadosInv> queryable = DataModel.VwProyectosAprobadosInvs.Where<VwProyectosAprobadosInv>(expression);
                    IQueryable<Estado> queryable2 = DataModel.Estados;
                    if (filtros.CodigosEstado.Count == 0)
                    {
                        if (filtros.CodigosRegion.Count == 0 && filtros.CodigosDepartamentos.Count == 0 && filtros.CodigosMunicipios.Count == 0)
                        {
                            list = (from aprobado in queryable
                                    join proyecto in DataModel.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                    where (
                                     filtros.CodigosSector.Contains(aprobado.IdSector) || (filtros.CodigosSector.Count == 0))
                                    select proyecto).Distinct().ToList();

                        }
                        else
                        {
                            list = (from aprobado in queryable
                                    join proyecto in DataModel.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                    join pxe in DataModel.ProyectoXEntidadTerritorials on aprobado.IdProyecto equals pxe.IdProyecto
                                    join financiador in DataModel.VwFuenteFinanciacions on aprobado.IdProyecto equals financiador.IdProyecto
                                    join entEjecutora in DataModel.VwEntidadEjecutoras on aprobado.IdProyecto equals entEjecutora.IdProyecto
                                    join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                    where ((((filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0)))
                                    && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0)))
                                    && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0)))
                                    && (filtros.CodigosSector.Contains(aprobado.IdSector) || (filtros.CodigosSector.Count == 0))
                                    && (filtros.CodigosOrgFinanciador.Contains(int.Parse(financiador.IdOrganismoFinanciador)) || (filtros.CodigosOrgFinanciador.Count == 0))
                                    //&& (filtros.CodigosEntidadEjecutora.Contains(int.Parse(entEjecutora.IdEntidad)) || (filtros.CodigosEntidadEjecutora.Count == 0))
                                    select proyecto).Distinct<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>().ToList<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
                        }
                    }
                    else
                    {
                        queryable2 = from p in queryable2
                                     where filtros.CodigosEstado.Contains(p.IdEstado) || (filtros.CodigosEstado.Count == 0)
                                     select p;
                        list = (from proyecto in DataModel.Proyectos
                                join pxe in DataModel.ProyectoXEntidadTerritorials on proyecto.IdProyecto equals pxe.IdProyecto
                                join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                join history in DataModel.HistoriaEstados on proyecto.IdProyecto equals history.IdProyecto
                                join estado in queryable2 on history.IdEstado equals estado.IdEstado
                                join aprobado in queryable on proyecto.IdProyecto equals aprobado.IdProyecto
                                where (((history.ActualSiNo && (filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0))) && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0))) && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0))) && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0))
                                select proyecto).Distinct().ToList();
                    }
                    if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))
                    {
                        search = new string((from c in filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD)
                                             where c < '\x0080'
                                             select c).ToArray<char>());
                        if (predicate == null)
                        {
                            predicate = objProyecto => new string((from c in objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD)
                                                                   where c < '\x0080'
                                                                   select c).ToArray<char>()).ToLower().Contains(search.ToLower());
                        }
                        list = list.Where(predicate).ToList();
                    }

                }
                ShortCacheHelper.Add<List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>>(list, key);
            }
            Trace.WriteLine("Obtenidos los proyectos consistentes.");
            return list;
        }
        public async Task<List<InfoProyectos>> ObtenerProyectosNacionales(int id_sector)
        {
            List<InfoProyectos> listInfo = new List<InfoProyectos>();

            using (var DataModel = new TransparenciaDB())
            {

                if (id_sector > 0)
                {
                    IQueryable<VwProyectosAprobadosInv> queryable = DataModel.VwProyectosAprobadosInvs;
                    listInfo = await (from aprobado in queryable
                                      where aprobado.TipoProyecto.ToUpper().Equals("NACIONAL")
                                      where aprobado.IdSector == id_sector
                                      select new InfoProyectos
                                      {
                                          IdProyecto = aprobado.IdProyecto,
                                          NombreProyecto = aprobado.NombreProyecto
                                      }).OrderBy(p => p.NombreProyecto).ToListAsync();
                }
                else
                {
                    IQueryable<VwProyectosAprobadosInv> queryable = DataModel.VwProyectosAprobadosInvs;
                    listInfo = await (from aprobado in queryable
                                      where aprobado.TipoProyecto.ToUpper().Equals("NACIONAL")
                                      select new InfoProyectos
                                      {
                                          IdProyecto = aprobado.IdProyecto,
                                          NombreProyecto = aprobado.NombreProyecto
                                      }).OrderBy(p => p.NombreProyecto).ToListAsync();


                }
            }
            return listInfo;

        }
        public async Task<List<InfoProyectos>> ObtenerProyectosConsistentes_home(FiltroBusquedaProyecto filtros, int limite = 6)
        {
            List<InfoProyectos> listInfo = new List<InfoProyectos>();
            string key = "ObtenerProyectosConsistentes_home" + ObtenerKeyPorEstadoFiltro(filtros);
            if (!ShortCacheHelper.Get<List<InfoProyectos>>(key, out listInfo))
            {

                using (var DataModel = new TransparenciaDB())
                {

                    Expression<Func<VwProyectosAprobadosInv, bool>> expression = PredicateBuilder.False<VwProyectosAprobadosInv>();
                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<VwProyectosAprobadosInv>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }

                    IQueryable<VwProyectosAprobadosInv> queryable = DataModel.VwProyectosAprobadosInvs.Where<VwProyectosAprobadosInv>(expression);
                    listInfo = await (from aprobado in queryable
                                      where aprobado.TipoProyecto.Trim().ToUpper().Equals("NACIONAL")

                                      select new InfoProyectos
                                      {
                                          IdProyecto = aprobado.IdProyecto,
                                          NombreProyecto = aprobado.NombreProyecto,
                                          approvedTotalMoney = aprobado.VlrTotalProyectoFuenteRegalias,
                                          porcentajeGastado = (decimal)aprobado.AvanceFinanciero,
                                          //NombreMunicipio = region.NombreMunicipio,
                                          NombreMunicipio = aprobado.EntidadEjecutora,
                                          UrlImagen = aprobado.URLImagen,
                                          NombreSector = aprobado.NombreSector,
                                          IdSector = aprobado.IdSector,
                                          cantidadFotos = aprobado.NumeroImagenes,
                                          MesInicioProyecto = aprobado.MesInicioProyecto,
                                          AnioInicioProyecto = aprobado.AnioInicioProyecto,
                                          MesFinProyecto = aprobado.MesFinProyecto,
                                          AnioFinProyecto = aprobado.AnioFinProyecto,
                                          FechaInicioProyecto = aprobado.FechaInicioProyecto,
                                          Megusta = aprobado.MeGusta,
                                          Comentarios = aprobado.Comentarios,
                                      }).Distinct<InfoProyectos>().ToListAsync<InfoProyectos>();

                    if (limite > listInfo.Count())
                    {
                        listInfo = listInfo.GetRange(0, listInfo.Count);
                    }
                    else
                    {
                        listInfo = listInfo.GetRange(0, limite);
                    }
                }
                //consulta 
                ShortCacheHelper.Add<List<InfoProyectos>>(listInfo, key);
            }
            Trace.WriteLine("Obtenidos los proyectos nacionales home.");
            return listInfo;

        }
        public List<InfoProyectos> ObtenerProyectosConsistentes_new(FiltroBusquedaProyecto filtros, int limite = 6)
        {
            Func<PlataformaTransparencia.Infrastructura.DataModels.Proyecto, bool> predicate = null;
            List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> list = new List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
            List<InfoProyectos> listInfo = new List<InfoProyectos>();
            Random getrandom = new Random();

            string search = string.Empty;

            string key = "ObtenerProyectosConsistentes_new" + ObtenerKeyPorEstadoFiltro(filtros);
            if (!ShortCacheHelper.Get<List<InfoProyectos>>(key, out listInfo))
            {

                using (var DataModel = new TransparenciaDB())
                {

                    Expression<Func<VwProyectosAprobadosInv, bool>> expression = PredicateBuilder.False<VwProyectosAprobadosInv>();
                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<VwProyectosAprobadosInv>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }

                    IQueryable<VwProyectosAprobadosInv> queryable = DataModel.VwProyectosAprobadosInvs.Where<VwProyectosAprobadosInv>(expression);
                    IQueryable<Estado> queryable2 = DataModel.Estados;
                    if (filtros.CodigosEstado.Count == 0)
                    {
                        listInfo = (from aprobado in queryable
                                    join proyecto in DataModel.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                    join pxe in DataModel.ProyectoXEntidadTerritorials on aprobado.IdProyecto equals pxe.IdProyecto
                                    join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                    where ((((filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0))) && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0))) && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0))) && (filtros.CodigosSector.Contains(aprobado.IdSector) || (filtros.CodigosSector.Count == 0))
                                    where ((filtros.CodigosSector.Contains(aprobado.IdSector) || (filtros.CodigosSector.Count == 0)) && aprobado.VlrTotalProyectoFuenteRegalias > 0)
                                    select new InfoProyectos
                                    {
                                        IdProyecto = aprobado.IdProyecto,
                                        NombreProyecto = aprobado.NombreProyecto,
                                        approvedTotalMoney = aprobado.VlrTotalProyectoFuenteRegalias,
                                        porcentajeGastado = (decimal)aprobado.AvanceFinanciero,
                                        //NombreMunicipio = region.NombreMunicipio,
                                        NombreMunicipio = aprobado.EntidadEjecutora,
                                        UrlImagen = aprobado.URLImagen,
                                        NombreSector = aprobado.NombreSector,
                                        IdSector = aprobado.IdSector,
                                        cantidadFotos = aprobado.NumeroImagenes,
                                        MesInicioProyecto = aprobado.MesInicioProyecto,
                                        AnioInicioProyecto = aprobado.AnioInicioProyecto,
                                        MesFinProyecto = aprobado.MesFinProyecto,
                                        AnioFinProyecto = aprobado.AnioFinProyecto,
                                        FechaInicioProyecto = aprobado.FechaInicioProyecto,
                                        Megusta = aprobado.MeGusta,
                                        Comentarios = aprobado.Comentarios,

                                        //).Distinct<InfoProyectos>().ToList<InfoProyectos>().GetRange(0,1);
                                    }).Distinct<InfoProyectos>().ToList<InfoProyectos>();
                    }
                    else
                    {
                        queryable2 = from p in queryable2
                                     where filtros.CodigosEstado.Contains(p.IdEstado) || (filtros.CodigosEstado.Count == 0)
                                     select p;


                        listInfo = (from aprobado in queryable
                                    join proyecto in DataModel.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                    join sector in DataModel.Sectors on proyecto.IdSector equals sector.IdSector
                                    join pxe in DataModel.ProyectoXEntidadTerritorials on proyecto.IdProyecto equals pxe.IdProyecto
                                    join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                    join history in DataModel.HistoriaEstados on proyecto.IdProyecto equals history.IdProyecto
                                    join estado in queryable2 on history.IdEstado equals estado.IdEstado
                                    //where aprobado.TipoProyecto.ToUpper().Equals("NACIONAL")
                                    where (((history.ActualSiNo && (filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0))) && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0))) && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0))) && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0))
                                    where (history.ActualSiNo && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0)))
                                    select new InfoProyectos
                                    {
                                        IdProyecto = proyecto.IdProyecto,
                                        NombreProyecto = proyecto.NombreProyecto,
                                        approvedTotalMoney = proyecto.VlrTotalProyectoFuenteRegalias,
                                        porcentajeGastado = (decimal)aprobado.AvanceFinanciero,
                                        //NombreMunicipio = region.NombreMunicipio,
                                        NombreMunicipio = aprobado.EntidadEjecutora,
                                        UrlImagen = aprobado.URLImagen,
                                        NombreSector = sector.NombreSector,
                                        IdSector = sector.IdSector,
                                        cantidadFotos = aprobado.NumeroImagenes,
                                        MesInicioProyecto = aprobado.MesInicioProyecto,
                                        AnioInicioProyecto = aprobado.AnioInicioProyecto,
                                        MesFinProyecto = aprobado.MesFinProyecto,
                                        AnioFinProyecto = aprobado.AnioFinProyecto,
                                        FechaInicioProyecto = aprobado.FechaInicioProyecto,
                                        Megusta = aprobado.MeGusta,
                                        Comentarios = aprobado.Comentarios,

                                    }).Distinct<InfoProyectos>().ToList<InfoProyectos>();

                        //select proyecto).Distinct<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>().ToList<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
                    }
                    if (limite > listInfo.Count())
                    {
                        listInfo = listInfo.GetRange(0, listInfo.Count);
                    }
                    else
                    {
                        listInfo = listInfo.GetRange(0, limite);
                    }


                    if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))
                    {
                        search = new string((from c in filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD)
                                             where c < '\x0080'
                                             select c).ToArray<char>());
                        if (predicate == null)
                        {
                            predicate = objProyecto => new string((from c in objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD)
                                                                   where c < '\x0080'
                                                                   select c).ToArray<char>()).ToLower().Contains(search.ToLower());
                        }
                        //listInfo = listInfo.Where<InfoProyectos>(predicate).ToList<InfoProyectos>();
                        //PENDIENTE REVISAR
                    }

                }

                ShortCacheHelper.Add<List<InfoProyectos>>(listInfo, key);
            }
            else
            {
                if (limite > listInfo.Count())
                {
                    listInfo = listInfo.GetRange(0, listInfo.Count);
                }
                else
                {
                    listInfo = listInfo.GetRange(0, limite);
                }
            }
            Trace.WriteLine("Obtenidos los proyectos consistentes.");
            return listInfo;
        }
        public List<InfoProyectos> ObtenerProyectosConsistentesPorSectores(List<string> sectores, FiltroBusquedaProyecto filtros, int limite = 6)
        {
            Func<Infrastructura.DataModels.Proyecto, bool> predicate = null;
            List<Infrastructura.DataModels.Proyecto> list = new ();
            List<InfoProyectos> listInfo = new List<InfoProyectos>();
            Random getrandom = new Random();
            string search = string.Empty;
            string key = "ObtenerProyectosConsistentesPorSectores" + ObtenerKeyPorEstadoFiltro(filtros);
            if (!ShortCacheHelper.Get<List<InfoProyectos>>(key, out listInfo))
            {
                using (var DataModel = new TransparenciaDB())
                {
                    Expression<Func<VwProyectosAprobadosInv, bool>> expression = PredicateBuilder.False<VwProyectosAprobadosInv>();
                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<VwProyectosAprobadosInv>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }
                    IQueryable<VwProyectosAprobadosInv> queryable = DataModel.VwProyectosAprobadosInvs.Where<VwProyectosAprobadosInv>(expression);
                    IQueryable<Estado> queryable2 = DataModel.Estados;
                    queryable2 = from p in queryable2
                                 where filtros.CodigosEstado.Contains(p.IdEstado) || (filtros.CodigosEstado.Count == 0)
                                 select p;
                    listInfo = (from aprobado in queryable
                                join proyecto in DataModel.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                join sector in DataModel.Sectors on proyecto.IdSector equals sector.IdSector
                                join pxe in DataModel.ProyectoXEntidadTerritorials on proyecto.IdProyecto equals pxe.IdProyecto
                                join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                join history in DataModel.HistoriaEstados on proyecto.IdProyecto equals history.IdProyecto
                                join estado in queryable2 on history.IdEstado equals estado.IdEstado
                                where sectores.Contains(aprobado.IdSector.ToString())
                                where (((history.ActualSiNo && (filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0))) && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0))) && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0))) && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0))
                                where (history.ActualSiNo && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0)))
                                select new InfoProyectos
                                {
                                    IdProyecto = proyecto.IdProyecto,
                                    NombreProyecto = proyecto.NombreProyecto,
                                    approvedTotalMoney = proyecto.VlrTotalProyectoFuenteRegalias,
                                    porcentajeGastado = (decimal)aprobado.AvanceFinanciero,
                                    NombreMunicipio = region.NombreMunicipio, //aprobado.EntidadEjecutora,
                                    UrlImagen = aprobado.URLImagen,
                                    NombreSector = aprobado.NombreSector,
                                    IdSector = aprobado.IdSector,
                                    cantidadFotos = aprobado.NumeroImagenes,
                                    MesInicioProyecto = aprobado.MesInicioProyecto,
                                    AnioInicioProyecto = aprobado.AnioInicioProyecto,
                                    MesFinProyecto = aprobado.MesFinProyecto,
                                    AnioFinProyecto = aprobado.AnioFinProyecto,
                                    FechaInicioProyecto = aprobado.FechaInicioProyecto,
                                    Megusta = aprobado.MeGusta,
                                    Comentarios = aprobado.Comentarios,
                                    IdDepartamento = pxe.IdDepartamento
                                }).Distinct<InfoProyectos>().ToList<InfoProyectos>();
                    var allproyectsSector = (from proyecto in DataModel.Proyectos
                                             where sectores.Contains(proyecto.IdSector.ToString())
                                             select proyecto).ToList();

                    foreach (var allproySector in allproyectsSector)
                    {
                        var existeProyectoEnLista = (from lstInfo in listInfo
                                                     where lstInfo.IdProyecto == allproySector.IdProyecto
                                                     select lstInfo).ToArray();
                        string nombreSector = listInfo.Any() ? listInfo.First().NombreSector : string.Empty;
                        if (!existeProyectoEnLista.Any())
                        {
                            DateTimeFormatInfo dtinfo = new CultureInfo("es-ES", false).DateTimeFormat;
                            listInfo.Add(new InfoProyectos { IdProyecto = allproySector.IdProyecto, NombreProyecto = allproySector.NombreProyecto, approvedTotalMoney = allproySector.VlrTotalProyectoFuenteRegalias, porcentajeGastado = allproySector.PorcentajeAvanceFisico, NombreMunicipio = "Nacional", UrlImagen = string.Empty, NombreSector = nombreSector, IdSector = allproySector.IdSector, cantidadFotos = 0, MesInicioProyecto = dtinfo.GetMonthName(allproySector.FechaInicioProyecto.Month), AnioInicioProyecto = allproySector.FechaInicioProyecto.Year, MesFinProyecto = dtinfo.GetMonthName(allproySector.FechaFinProyecto.Month), AnioFinProyecto = allproySector.FechaFinProyecto.Year, FechaInicioProyecto = allproySector.FechaInicioProyecto, IdDepartamento = "0", Megusta = 0 }); // porcentajeGastado = allproySector.PorcentajeAvanceFinanciero.HasValue ? allproySector.PorcentajeAvanceFinanciero.Value : 
                        }
                    }
                    if (limite > listInfo.Count())
                    {
                        listInfo = listInfo.GetRange(0, listInfo.Count);
                    }
                    else
                    {
                        listInfo = listInfo.GetRange(0, limite);
                    }
                    if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))
                    {
                        search = new string((from c in filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD)
                                             where c < '\x0080'
                                             select c).ToArray<char>());
                        if (predicate == null)
                        {
                            predicate = objProyecto => new string((from c in objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD)
                                                                   where c < '\x0080'
                                                                   select c).ToArray<char>()).ToLower().Contains(search.ToLower());
                        }
                    }
                }
                ShortCacheHelper.Add<List<InfoProyectos>>(listInfo, key);
            }
            if (listInfo != null && listInfo.Count > 1) listInfo = listInfo.DistinctBy(x => x.IdProyecto).OrderBy(x=>x.AnioInicioProyecto).ToList();
            return listInfo;
        }


        [ExcludeFromCodeCoverage]
        public string ObtenerKeyPorEstadoFiltro(FiltroBusquedaProyecto filtros, bool incluirOffset = false)
        {
            StringBuilder strKey = new StringBuilder();
            strKey.Append("KeyUnicoFiltro");
            strKey.Append(filtros.Zoom.ToString());
            if (filtros.CodigosDepartamentos.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.CodigosDepartamentos));
            if (filtros.CodigosEstado.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.CodigosEstado));
            if (filtros.CodigosMunicipios.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.CodigosMunicipios));
            if (filtros.CodigosRegion.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.CodigosRegion));
            if (filtros.CodigosSector.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.CodigosSector));
            if (filtros.CodigosOrgFinanciador.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.CodigosOrgFinanciador));
            if (filtros.fechasEjecucion.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.fechasEjecucion));
            if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))
                strKey.Append(filtros.ContieneNombreProyecto);
            if (filtros.CodigoPrograma.Count > 0)
                strKey.Append(ObtenerValoresFiltroPorComas(filtros.CodigoPrograma));
            if (incluirOffset)
            {
                if (filtros.TopLeft.Count > 0)
                    strKey.Append(ObtenerValoresFiltroPorComas(filtros.TopLeft));
                if (filtros.BottomRight.Count > 0)
                    strKey.Append(ObtenerValoresFiltroPorComas(filtros.BottomRight));
            }

            return strKey.ToString();
        }

        [ExcludeFromCodeCoverage]
        internal static string ObtenerValoresFiltroPorComas(List<int> list)
        {
            StringBuilder strKey = new StringBuilder();
            foreach (int par in list)
                strKey.Append(string.Format("{0},", par.ToString()));
            return strKey.ToString();
        }

        [ExcludeFromCodeCoverage]
        internal static string ObtenerValoresFiltroPorComas(List<string> list)
        {
            StringBuilder strKey = new StringBuilder();
            foreach (string par in list)
                strKey.Append(string.Format("{0},", par));
            return strKey.ToString();
        }

        [ExcludeFromCodeCoverage]
        internal static string ObtenerValoresFiltroPorComas(List<decimal> list)
        {
            StringBuilder strKey = new StringBuilder();
            foreach (int par in list)
                strKey.Append(string.Format("{0},", par.ToString()));
            return strKey.ToString();
        }

        /// <summary>
        /// Obtiene las regiones filtrdas segun los codigos dados
        /// </summary>
        /// <param name="codigosFiltros"></param>
        /// <returns></returns>
        [ExcludeFromCodeCoverage]
        internal static List<EnteTerritorial> ObtenerRegiones(List<string> codigosFiltros)
        {
            using (var DataModel = new TransparenciaDB())
            {

                if (codigosFiltros == null)
                    codigosFiltros = new List<string>();
                string nombreTipoEnteRepresentaRegion = ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaRegion;

                List<EnteTerritorial> regions = (from region in DataModel.EnteTerritorials
                                                 where region.Tipo.ToUpper().Equals(nombreTipoEnteRepresentaRegion.ToUpper())
                                                  && (codigosFiltros.Contains(region.IdRegion.Trim()) || codigosFiltros.Count == 0)
                                                 select region).ToList();
                return regions;
            }
        }

        /// <summary>
        /// Obtiene los municipios segun los codigos dados
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [ExcludeFromCodeCoverage]
        internal static List<EnteTerritorial> ObtenerDepartamentos(List<string> codigosFiltros)
        {
            if (codigosFiltros == null)
                codigosFiltros = new List<string>();
            string nombreTipoEnteRepresentaDepartamento = ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaDpto;

            using (var DataModel = new TransparenciaDB())
            {

                List<EnteTerritorial> entes = (from ente in DataModel.EnteTerritorials
                                               where ente.Tipo.ToUpper().Equals(nombreTipoEnteRepresentaDepartamento.ToUpper())
                                                && (codigosFiltros.Contains(ente.IdDepartamento.Trim()) || codigosFiltros.Count == 0)
                                               select ente).ToList();
                return entes;
            }
        }

        [ExcludeFromCodeCoverage]
        internal static List<Modelos.Comunes.Departamento> ObtenerDepartamentosPorSectores(List<string> codigosSector)
        {
            if (codigosSector == null)
                codigosSector = new List<string>();
            using (var DataModel = new TransparenciaDB())
            {

                var entes = (from ente in DataModel.VwSectorPerfilDeptoInvs
                             where (codigosSector.Contains(ente.IdSector.ToString()))
                             select new Modelos.Comunes.Departamento
                             {
                                 IdDepartamento = ente.IdDepartamento,
                                 NombreDepartamento = ente.NombreDepartamento
                             }).Distinct().ToList();
                return new List<Modelos.Comunes.Departamento>(entes);
            }
        }

        [ExcludeFromCodeCoverage]
        internal static Sector ObtenerSectorPorCodigoSector(string codigosSector)
        {
            if (codigosSector == null) codigosSector = string.Empty;

            try
            {
                using (var DataModel = new TransparenciaDB())
                {

                    var sectores = (from sector in DataModel.VwInformacionGeneralPerfilSectors.AsEnumerable()
                                    where sector.NombreSector.ToUpper().Trim() == codigosSector.ToUpper().Trim()
                                    select sector).ToList();
                    return sectores.Any() ? new Sector { IdSector = sectores.First().IdSector, NombreSector = sectores.First().NombreSector } : null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Obtiene los municipios segun los codigos dados
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [ExcludeFromCodeCoverage]
        internal static List<EnteTerritorial> ObtenerMunicipio(List<string> codigosFiltros)
        {
            if (codigosFiltros == null)
                codigosFiltros = new List<string>();
            string nombreTipoEnteRepresentaMunicipio = ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaMunicipio;

            using (var DataModel = new TransparenciaDB())
            {

                List<EnteTerritorial> entes = (from ente in DataModel.EnteTerritorials
                                               where ente.Tipo.ToUpper().Equals(nombreTipoEnteRepresentaMunicipio.ToUpper())
                                                && (codigosFiltros.Contains(ente.IdMunicipio.Trim()) || codigosFiltros.Count == 0)
                                               select ente).ToList();
                return entes;
            }
        }

        /// <summary>
        /// Obtiene los municipios segun los codigos dados
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        public static List<EnteTerritorial> ObtenerMunicipioPorDepartamento(List<string> codigosFiltros)
        {
            if (codigosFiltros == null)
                codigosFiltros = new List<string>();
            string nombreTipoEnteRepresentaMunicipio = ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaMunicipio;

            using (var DataModel = new TransparenciaDB())
            {

                List<EnteTerritorial> entes = (from ente in DataModel.EnteTerritorials
                                               where ente.Tipo.ToUpper().Equals(nombreTipoEnteRepresentaMunicipio.ToUpper())
                                                && (codigosFiltros.Contains(ente.IdDepartamento.Trim()))
                                               select ente).ToList();
                return entes;
            }
        }


        /// <summary>
        /// Obtiene un listado que contiene información detallada del proyecto
        /// </summary>
        /// <param name="filtros">Filtros utilizados</param>
        /// <returns>devuelve un objeto tipo ProyectoInfoTotal</returns>
        [ExcludeFromCodeCoverage]
        public IEnumerable<InfoProyectos> ObtenerInfoProyectos3(FiltroBusquedaProyecto filtros)
        {
            //bool obtenerPendientesSegunHistorico = false;
            IEnumerable<InfoProyectos> list = null;
            string search = string.Empty;
            //string criterioEstadosPendientes = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosPendientesSegunHistorico;
            //string criterioEstadosEjecucion = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecucion;
            //string criterioEstadosEjecutados = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecutado;

            string key = "ObtenerInfoProyectos" + ObtenerKeyPorEstadoFiltro(filtros, true);
            if (!ShortCacheHelper.Get<IEnumerable<InfoProyectos>>(key, out list))
            {

                using (TransparenciaDB entities = new TransparenciaDB())
                {

                    DbGeography poligonoInicial = new ComunesGeoreferenciacion().ObtenerCuadradoPorCoordenadas2(filtros.TopLeft[0], filtros.TopLeft[1], filtros.BottomRight[0], filtros.BottomRight[1]);

                    Expression<Func<VwProyectosAprobado, bool>> expression = PredicateBuilder.False<VwProyectosAprobado>();
                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<VwProyectosAprobado>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }
                    IQueryable<VwProyectosAprobado> queryable = entities.VwProyectosAprobados.Where<VwProyectosAprobado>(expression);
                    IQueryable<Estado> queryable2 = entities.Estados;

                    if (filtros.CodigosEstado.Count == 0)
                    {
                        list = (from aprobado in queryable
                                join proyecto in entities.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                join geo in entities.Georreferenciacions
                                    on proyecto.IdProyecto equals geo.IdProyecto
                                join ente in entities.EnteTerritorials
                                    on geo.NombreReferencia equals ente.IdMunicipio
                                join history in entities.HistoriaEstados on proyecto.IdProyecto equals history.IdProyecto
                                join estado in queryable2 on history.IdEstado equals estado.IdEstado
                                join Financiador in entities.ProyectoOrganismoFinanciadors on proyecto.IdProyecto equals Financiador.IdProyecto
                                where (((history.ActualSiNo && (filtros.CodigosRegion.Contains(ente.IdRegion) || (filtros.CodigosRegion.Count == 0)))
                                    && (filtros.CodigosDepartamentos.Contains(ente.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0)))
                                    && (filtros.CodigosMunicipios.Contains(ente.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0)))
                                    && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0))
                                    && (filtros.CodigosOrgFinanciador.Contains((int)Financiador.IdOrganismoFinanciador) || (filtros.CodigosOrgFinanciador.Count == 0))
                                //&& poligonoInicial.Intersects(geo.GeoPuntoUbicacion)
                                select new InfoProyectos
                                {
                                    IdProyecto = proyecto.IdProyecto,
                                    NombreMunicipio = ente.NombreMunicipio,
                                    Geography = DbGeography.FromText(geo.GeoPuntoUbicacion.ToString(), 4326),
                                    NombreProyecto = proyecto.NombreProyecto.ToUpper(),
                                    Value = proyecto.VlrTotalProyectoFuenteRegalias,
                                    approvedTotalMoney = proyecto.VlrTotalProyectoTodasLasFuentes,
                                    Location = filtros.CodigosDepartamentos.Count() > 0 ? filtros.CodigosDepartamentos.FirstOrDefault() : proyecto.NombreProyecto.ToUpper(),
                                    State = estado.NombreEstado,
                                    NombreSector = Financiador.OrganismoFinanciador
                                }).ToList();
                    }
                    else
                    {
                        queryable2 = from p in queryable2
                                     where filtros.CodigosEstado.Contains(p.IdEstado) || (filtros.CodigosEstado.Count == 0)
                                     select p;
                        list = (from proyecto in entities.Proyectos
                                join history in entities.HistoriaEstados on proyecto.IdProyecto equals history.IdProyecto
                                join estado in queryable2 on history.IdEstado equals estado.IdEstado
                                join aprobado in queryable on proyecto.IdProyecto equals aprobado.IdProyecto
                                join Financiador in entities.ProyectoOrganismoFinanciadors on proyecto.IdProyecto equals Financiador.IdProyecto
                                join geo in entities.Georreferenciacions
                                    on proyecto.IdProyecto equals geo.IdProyecto
                                join ente in entities.EnteTerritorials
                                    on geo.NombreReferencia equals ente.IdMunicipio
                                where (((history.ActualSiNo && (filtros.CodigosRegion.Contains(ente.IdRegion) || (filtros.CodigosRegion.Count == 0)))
                                    && (filtros.CodigosDepartamentos.Contains(ente.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0)))
                                    && (filtros.CodigosMunicipios.Contains(ente.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0)))
                                    && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0))
                                    && (filtros.CodigosOrgFinanciador.Contains((int)Financiador.IdOrganismoFinanciador) || (filtros.CodigosOrgFinanciador.Count == 0))
                                //&& poligonoInicial.Intersects(geo.GeoPuntoUbicacion)
                                select new InfoProyectos
                                {
                                    IdProyecto = proyecto.IdProyecto,
                                    NombreMunicipio = ente.NombreMunicipio,
                                    Geography = DbGeography.FromText(geo.GeoPuntoUbicacion.ToString(), 4326),
                                    NombreProyecto = proyecto.NombreProyecto.ToUpper(),
                                    Value = proyecto.VlrTotalProyectoFuenteRegalias,
                                    approvedTotalMoney = proyecto.VlrTotalProyectoTodasLasFuentes,
                                    Location = filtros.CodigosDepartamentos.Count() > 0 ? filtros.CodigosDepartamentos.FirstOrDefault() : proyecto.NombreProyecto.ToUpper(),
                                    State = estado.NombreEstado
                                }).ToList();
                    }

                    if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))//Busqueda no sensible a acentos
                    {
                        search = new String(filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD).Where(c => c < 128).ToArray());
                        list = (from objProyecto in list
                                where new String(objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD).Where(c => c < 128).ToArray()).ToLower().Contains(search.ToLower())
                                select objProyecto).ToList();
                    }
                }
                ShortCacheHelper.Add<IEnumerable<InfoProyectos>>(list, key);
            }
            Trace.WriteLine("Obtenida la informacion de proyectos para algoritmo de proximidad.");
            return list;

        }

        /// <summary>
        /// Obtiene un listado que contiene información detallada del proyecto
        /// </summary>
        /// <param name="filtros">Filtros utilizados</param>
        /// <returns>devuelve un objeto tipo ProyectoInfoTotal</returns>
        [ExcludeFromCodeCoverage]
        internal IEnumerable<InfoProyectos> ObtenerInfoProyectos2(FiltroBusquedaProyecto filtros)
        {
            bool obtenerPendientesSegunHistorico = false;
            IEnumerable<InfoProyectos> list = null;
            string search = string.Empty;
            string criterioEstadosPendientes = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosPendientesSegunHistorico;
            string criterioEstadosEjecucion = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecucion;
            string criterioEstadosEjecutados = ArchivoRecursosNegocioMapaInversiones.CriterioEstadosEjecutado;
            if (filtros.CodigosEstado.Count == 0)
            {
                obtenerPendientesSegunHistorico = true;
            }
            string key = "ObtenerInfoProyectos2" + ObtenerKeyPorEstadoFiltro(filtros, true);
            if (!ShortCacheHelper.Get<IEnumerable<InfoProyectos>>(key, out list))
            {

                using (var DataModel = new TransparenciaDB())
                {

                    DbGeography poligonoInicial = new ComunesGeoreferenciacion().ObtenerCuadradoPorCoordenadas2(filtros.TopLeft[0], filtros.TopLeft[1], filtros.BottomRight[0], filtros.BottomRight[1]);

                    Expression<Func<PlataformaTransparencia.Infrastructura.DataModels.Proyecto, bool>> expression = PredicateBuilder.False<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }
                    IQueryable<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> queryable = DataModel.Proyectos.Where<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>(expression);
                    IQueryable<Estado> queryable2 = DataModel.Estados;
                    if (obtenerPendientesSegunHistorico)
                    {
                        queryable2 = from p in queryable2
                                     where (p.NombreEstado.Trim().ToUpper().Contains(criterioEstadosPendientes) | p.NombreEstado.Trim().ToUpper().Contains(criterioEstadosEjecucion)) | p.NombreEstado.Trim().ToUpper().Contains(criterioEstadosEjecutados)
                                     select p;
                    }
                    else
                    {
                        queryable2 = from p in queryable2
                                     where filtros.CodigosEstado.Contains(p.IdEstado) || (filtros.CodigosEstado.Count == 0)
                                     select p;
                    }
                    list = (from proyecto in queryable
                            join pxe in DataModel.ProyectoXEntidadTerritorials on proyecto.IdProyecto equals pxe.IdProyecto
                            join ente in DataModel.EnteTerritorials on pxe.IdMunicipio equals ente.IdMunicipio
                            //join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                            join history in DataModel.HistoriaEstados on new { IdProyecto = proyecto.IdProyecto, Actual = true } equals new { IdProyecto = history.IdProyecto, Actual = history.ActualSiNo } //((proyecto.IdProyecto equals history.IdProyecto) && history.ActualSiNo == true)
                            join estado in queryable2 on history.IdEstado equals estado.IdEstado
                            //join geo in DataModel.Georreferenciacions
                            //    on proyecto.IdProyecto equals geo.idProyecto

                            //on geo.NombreReferencia equals ente.IdMunicipio
                            where (((history.ActualSiNo && (filtros.CodigosRegion.Contains(ente.IdRegion) || (filtros.CodigosRegion.Count == 0)))
                                && (filtros.CodigosDepartamentos.Contains(ente.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0)))
                                && (filtros.CodigosMunicipios.Contains(ente.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0)))
                                && (filtros.CodigosSector.Contains(proyecto.IdSector) || (filtros.CodigosSector.Count == 0))
                            //&& poligonoInicial.Intersects(geo.GeoPuntoUbicacion)
                            select new InfoProyectos
                            {
                                IdProyecto = proyecto.IdProyecto,
                                NombreMunicipio = string.Empty,//ente.NombreMunicipio,
                                Geography = null,//geo.GeoPuntoUbicacion,
                                NombreProyecto = proyecto.NombreProyecto.ToUpper(),
                                Value = proyecto.VlrTotalProyectoFuenteRegalias,
                                approvedTotalMoney = proyecto.VlrTotalProyectoTodasLasFuentes,
                                Location = string.Empty,// filtros.CodigosDepartamentos.Count() > 0 ? filtros.CodigosDepartamentos.FirstOrDefault() : proyecto.NombreProyecto.ToUpper(),
                                State = estado.NombreEstado
                            }).ToList().Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => (x.IdProyecto == y.IdProyecto)));
                    //}).Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => (x.IdProyecto == y.IdProyecto && x.NombreMunicipio == y.NombreMunicipio)));
                    if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))//Busqueda no sensible a acentos
                    {
                        search = new String(filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD).Where(c => c < 128).ToArray());
                        list = (from objProyecto in list
                                where new String(objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD).Where(c => c < 128).ToArray()).ToLower().Contains(search.ToLower())
                                select objProyecto).ToList().Distinct();
                    }

                    list = (from info in list
                            join geo in DataModel.Georreferenciacions on info.IdProyecto equals geo.IdProyecto
                            //where poligonoInicial.Intersects(geo.GeoPuntoUbicacion)
                            select new InfoProyectos
                            {
                                IdProyecto = info.IdProyecto,
                                NombreMunicipio = string.Empty,//ente.NombreMunicipio,
                                                               //Geography = geo.GeoPuntoUbicacion,
                                NombreProyecto = info.NombreProyecto,
                                Value = info.Value,
                                approvedTotalMoney = info.approvedTotalMoney,
                                Location = geo.NombreReferencia,
                                State = info.State
                            }).ToList().Distinct();
                }

                ShortCacheHelper.Add<IEnumerable<InfoProyectos>>(list, key);
            }
            Trace.WriteLine("Obtenida la informacion de proyectos para algoritmo de proximidad.");
            return list;
        }


        [ExcludeFromCodeCoverage]
        internal static List<ObjectProjectsSearchMapGeography> AdicionarEnteTerritorialEnCeros(GenericEnumerators.GeographicKindEnumeration tipoEnteTerritorial)
        {
            List<ObjectProjectsSearchMapGeography> objRetorno = new List<ObjectProjectsSearchMapGeography>();
            List<string> codigosEntesTerritoriales = new List<string>();
            string entityType = string.Empty;

            using (var DataModel = new TransparenciaDB())
            {

                switch (tipoEnteTerritorial)
                {
                    case GenericEnumerators.GeographicKindEnumeration.Region:
                        entityType = "region";
                        codigosEntesTerritoriales = (from departamentos in DataModel.EnteTerritorials
                                                     where departamentos.Tipo == "REGION"
                                                     select departamentos.IdRegion).Distinct().ToList();
                        break;
                    case GenericEnumerators.GeographicKindEnumeration.Department:
                        entityType = "departamento";
                        codigosEntesTerritoriales = (from departamentos in DataModel.EnteTerritorials
                                                     where departamentos.Tipo == "DEPARTAMENTO"
                                                     select departamentos.IdDepartamento).Distinct().ToList();
                        break;
                    case GenericEnumerators.GeographicKindEnumeration.Municipality:
                        entityType = "municipio";
                        codigosEntesTerritoriales = (from departamentos in DataModel.EnteTerritorials
                                                     where departamentos.Tipo == "MUNICIPIO"
                                                     select departamentos.IdMunicipio).Distinct().ToList();
                        break;
                    default:
                        break;
                }
                //codigosFaltantes.AddRange(codigosEntesTerritoriales.TakeWhile(et => !(consolidados.Contains(et))));

                if (codigosEntesTerritoriales.Count > 0)
                {
                    foreach (var item in codigosEntesTerritoriales)
                    {
                        objRetorno.Add(
                                new ObjectProjectsSearchMapGeography
                                {
                                    id = item,
                                    approvedTotalMoney = 0,
                                    total = 0,
                                    value = 0,
                                    type = entityType
                                }
                            );
                    }
                }
            }

            return objRetorno;
        }


        public async Task<RespuestaPoligonoTerritorial> ObtenerPoligonosDepartamentosAsync()
        {
            RespuestaPoligonoTerritorial objReturn = new RespuestaPoligonoTerritorial
            {
                type = CommonConstants.Department
            };

            JavaScriptSerializer ser = new JavaScriptSerializer();

            using (var db = new TransparenciaDB())
            {

                var fromDb = await db.GetTable<EnteTerritorial>().Where(r => r.Tipo == "DEPARTAMENTO")
               .Select(g => new {
                   g.Geojson
               }).ToListAsync();
                foreach (var depto in fromDb)
                {
                    objReturn.geojson.features.Add(ser.DeserializeObject(depto.Geojson));
                }
            }

            objReturn.status = true;
            return objReturn;
        }

        public async Task<RespuestaPoligonoTerritorial> ObtenerPoligonosMunicipiosAsync()
        {
            RespuestaPoligonoTerritorial objReturn = new RespuestaPoligonoTerritorial();
            objReturn.type = CommonConstants.Municipality;


            JavaScriptSerializer ser = new JavaScriptSerializer();

            using (var db = new TransparenciaDB())
            {

                var fromDb = await db.GetTable<EnteTerritorial>().Where(r => r.Tipo == "MUNICIPIO")
               .Select(g => new {
                   g.Geojson
               }).ToListAsync();
                foreach (var depto in fromDb)
                {
                    objReturn.geojson.features.Add(ser.DeserializeObject(depto.Geojson));
                }
            }

            objReturn.status = true;
            return objReturn;
        }

        public async Task<RespuestaPoligonoTerritorial> ObtenerPoligonosRegionesAsync()
        {
            RespuestaPoligonoTerritorial objReturn = new RespuestaPoligonoTerritorial();
            objReturn.type = CommonConstants.Region;

            JavaScriptSerializer ser = new JavaScriptSerializer();

            using (var db = new TransparenciaDB())
            {

                var fromDb = await db.GetTable<EnteTerritorial>().Where(r => r.Tipo == "REGION")
               .Select(g => new {
                   g.Geojson
               }).ToListAsync();
                foreach (var depto in fromDb)
                {
                    objReturn.geojson.features.Add(ser.DeserializeObject(depto.Geojson));
                }
            }

            objReturn.status = true;
            return objReturn;
        }

        public static async Task<List<object>> ObtenerFiltrosInicio()
        {
            var filtros = new List<object>();

            using (var db = new TransparenciaDB())
            {

                var lstDptos = await (from maestro in db.EnteTerritorials.Where(p => p.Tipo == "DEPARTAMENTO").OrderBy(p => p.NombreDepartamento)
                                      select new
                                      {
                                          dependsOn = new List<DependsOn> { new DependsOn { id = maestro.IdRegion, type = "region" } },
                                          //topLeft = default(string),
                                          //bottomRight = default(string),
                                          name = maestro.NombreDepartamento,
                                          value = maestro.IdDepartamento,
                                          //subTipo = default(string)

                                      }).ToListAsync();

                var lstMcipios = await (from maestro in db.EnteTerritorials.Where(p => p.Tipo == "MUNICIPIO").OrderBy(p => p.NombreMunicipio)
                                        select new
                                        {
                                            dependsOn = new List<DependsOn> { new DependsOn { id = maestro.IdDepartamento, type = "departamento" } },
                                            ////topLeft = default(string),
                                            ////bottomRight = default(string),
                                            name = maestro.NombreMunicipio + ", " + maestro.NombreDepartamento,
                                            value = maestro.IdMunicipio,
                                            //subTipo = default(string)

                                        }).ToListAsync();

                filtros.Add(new
                {
                    name = CommonLabel.DepartmentLabel,
                    parameter = "departamento",
                    esMultiple = false,
                    usaServicioAjax = false,
                    urlServicioAjax = default(string),
                    seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Comunes.ToString(),
                    items = lstDptos
                });

                filtros.Add(new
                {
                    name = CommonLabel.MunicipalityLabel,
                    parameter = "municipio",
                    esMultiple = false,
                    usaServicioAjax = false,
                    urlServicioAjax = default(string),
                    seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Comunes.ToString(),
                    items = lstMcipios
                });
            }

            return filtros;
        }


        public async Task<List<object>> ObtenerFiltrosGeograficosAsync()
        {
            var filtros = new List<object>();

            using (var db = new TransparenciaDB())
            {
                var lstRegiones = await (from maestro in db.GetTable<EnteTerritorial>().Where(p => p.Tipo == "REGION")
                                         select new
                                         {
                                             name = maestro.NombreRegion,
                                             value = maestro.IdRegion
                                         }).ToListAsync();

                var lstDptos = await (from maestro in db.GetTable<EnteTerritorial>().Where(p => p.Tipo == "DEPARTAMENTO").OrderBy(p => p.NombreDepartamento)
                                      select new
                                      {
                                          dependsOn = new List<DependsOn> { new DependsOn { id = maestro.IdRegion, type = "region" } },
                                          //topLeft = default(string),
                                          //bottomRight = default(string),
                                          name = maestro.NombreDepartamento,
                                          value = maestro.IdDepartamento,
                                          //subTipo = default(string)

                                      }).ToListAsync();

                var lstMcipios = await (from maestro in db.GetTable<EnteTerritorial>().Where(p => p.Tipo == "MUNICIPIO").OrderBy(p => p.NombreMunicipio)
                                        select new
                                        {
                                            dependsOn = new List<DependsOn> { new DependsOn { id = maestro.IdDepartamento, type = "departamento" } },
                                            ////topLeft = default(string),
                                            ////bottomRight = default(string),
                                            name = maestro.NombreMunicipio + ", " + maestro.NombreDepartamento,
                                            value = maestro.IdMunicipio,
                                            //subTipo = default(string)

                                        }).ToListAsync();

                filtros.Add(new
                {
                    name = CommonLabel.RegionLabel,
                    parameter = "region",
                    esMultiple = false,
                    usaServicioAjax = false,
                    urlServicioAjax = default(string),
                    seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Comunes.ToString(),
                    items = lstRegiones
                });

                filtros.Add(new
                {
                    name = CommonLabel.DepartmentLabel,
                    parameter = "departamento",
                    esMultiple = false,
                    usaServicioAjax = false,
                    urlServicioAjax = default(string),
                    seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Comunes.ToString(),
                    items = lstDptos
                });

                filtros.Add(new
                {
                    name = CommonLabel.MunicipalityLabel,
                    parameter = "municipio",
                    esMultiple = false,
                    usaServicioAjax = false,
                    urlServicioAjax = default(string),
                    seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Comunes.ToString(),
                    items = lstMcipios
                });
            }
            return filtros;
        }


        public static List<VwContratosPerfilContratistaSinPrograma> ObtenerDatosContratista(string ruc)
        {
            using (var db = new TransparenciaDB())
            {

                List<VwContratosPerfilContratistaSinPrograma> contratista = (from vwcontratista
                                           in db.VwContratosPerfilContratistaSinProgramas
                                                                             where vwcontratista.Numerodocumento.ToUpper().Equals(ruc.ToUpper())
                                                                             select vwcontratista).ToList();
                return contratista;
            }
        }

        public static EncabezadoContratos ObtenerDatosContratos()
        {
            EncabezadoContratos objreturn = new EncabezadoContratos();

            int? numContratosParameter = 0;
            long? valContratosParameter = 0;
            using (var db = new TransparenciaDB())
            {

                db.EncabezadoContratosRP(ref numContratosParameter, ref valContratosParameter);
                objreturn.NumContratos = int.Parse(numContratosParameter.Value.ToString());
                objreturn.ValorTotalContratos = long.Parse(valContratosParameter.Value.ToString());
            }

            return objreturn;

        }


        public static List<EncabezadoContratosCancelados> ObtenerDatosContratosCancelados()
        {
            List<EncabezadoContratosCancelados> objreturn = new List<EncabezadoContratosCancelados>();
            using (var db = new TransparenciaDB())
            {

                objreturn = (from data in db.EncabezadoContratosCancelados()
                             select new EncabezadoContratosCancelados
                             {
                                 Estado = data.Estado,
                                 valor = data.Valor,
                                 NroContratos = data.NroContratos
                             }
                                          ).ToList();

            }

            return objreturn;

        }




        /// <summary>
        /// listado proyectos por programa
        /// </summary>
        /// <param name="filtros">filtros</param>
        /// <param name="limite">cantidad de registros</param>
        /// <returns></returns>
        public List<InfoProyectos> ObtenerProyectosPrograma(FiltroBusquedaProyecto filtros, int limite = 6)
        {
            Func<PlataformaTransparencia.Infrastructura.DataModels.Proyecto, bool> predicate = null;
            List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> list = new List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto>();
            List<InfoProyectos> listInfo = new List<InfoProyectos>();
            Random getrandom = new Random();

            string search = string.Empty;

            string key = "ObtenerProyectosPrograma" + ObtenerKeyPorEstadoFiltro(filtros);
            if (!ShortCacheHelper.Get<List<InfoProyectos>>(key, out listInfo))
            {

                using (var DataModel = new TransparenciaDB())
                {

                    Expression<Func<VwProyectosAprobadosInv, bool>> expression = PredicateBuilder.False<VwProyectosAprobadosInv>();
                    foreach (int num in filtros.fechasEjecucion)
                    {
                        int año = num;
                        expression = expression.Or<VwProyectosAprobadosInv>(p => (p.FechaInicioProyecto.Year <= año) && (p.FechaFinProyecto.Year >= año));
                    }

                    IQueryable<VwProyectosAprobadosInv> queryable = DataModel.VwProyectosAprobadosInvs.Where<VwProyectosAprobadosInv>(expression);
                    IQueryable<Estado> queryable2 = DataModel.Estados;
                    if (filtros.CodigosEstado.Count == 0)
                    {
                        listInfo = (from aprobado in queryable
                                    join proyecto in DataModel.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                    join pxe in DataModel.ProyectoXEntidadTerritorials on aprobado.IdProyecto equals pxe.IdProyecto
                                    join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                    where (((filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0))) && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0))) && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0))
                                    where ((filtros.CodigosSector.Contains(aprobado.IdSector) || (filtros.CodigosSector.Count == 0)) && aprobado.VlrTotalProyectoFuenteRegalias > 0)
                                    //where ((filtros.CodigoPrograma.Contains(aprobado.IdPrograma) || (filtros.CodigoPrograma.Count == 0)) && aprobado.VlrTotalProyectoFuenteRegalias > 0)
                                    select new InfoProyectos
                                    {
                                        IdProyecto = aprobado.IdProyecto,
                                        NombreProyecto = aprobado.NombreProyecto,
                                        approvedTotalMoney = aprobado.VlrTotalProyectoFuenteRegalias,
                                        porcentajeGastado = (decimal)aprobado.AvanceFinanciero,
                                        NombreMunicipio = aprobado.EntidadEjecutora,
                                        UrlImagen = aprobado.URLImagen,
                                        NombreSector = aprobado.NombreSector,
                                        IdSector = aprobado.IdSector,
                                        cantidadFotos = aprobado.NumeroImagenes,
                                        MesInicioProyecto = aprobado.MesInicioProyecto,
                                        AnioInicioProyecto = aprobado.AnioInicioProyecto,
                                        MesFinProyecto = aprobado.MesFinProyecto,
                                        AnioFinProyecto = aprobado.AnioFinProyecto,
                                        FechaInicioProyecto = aprobado.FechaInicioProyecto,
                                        Megusta = aprobado.MeGusta,
                                        Comentarios = aprobado.Comentarios,


                                        //).Distinct<InfoProyectos>().ToList<InfoProyectos>().GetRange(0,1);
                                    }).Distinct<InfoProyectos>().ToList<InfoProyectos>();
                    }
                    else
                    {
                        queryable2 = from p in queryable2
                                     where filtros.CodigosEstado.Contains(p.IdEstado) || (filtros.CodigosEstado.Count == 0)
                                     select p;


                        listInfo = (from aprobado in queryable
                                    join proyecto in DataModel.Proyectos on aprobado.IdProyecto equals proyecto.IdProyecto
                                    join sector in DataModel.Sectors on proyecto.IdSector equals sector.IdSector
                                    join pxe in DataModel.ProyectoXEntidadTerritorials on proyecto.IdProyecto equals pxe.IdProyecto
                                    join region in DataModel.EnteTerritorials on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                    join history in DataModel.HistoriaEstados on proyecto.IdProyecto equals history.IdProyecto
                                    join estado in queryable2 on history.IdEstado equals estado.IdEstado
                                    where history.ActualSiNo && (filtros.CodigosRegion.Contains(region.IdRegion) || (filtros.CodigosRegion.Count == 0)) && (filtros.CodigosDepartamentos.Contains(pxe.IdDepartamento) || (filtros.CodigosDepartamentos.Count == 0)) && (filtros.CodigosMunicipios.Contains(pxe.IdMunicipio) || (filtros.CodigosMunicipios.Count == 0))
                                    where ((filtros.CodigosSector.Contains(aprobado.IdSector) || (filtros.CodigosSector.Count == 0)) && aprobado.VlrTotalProyectoFuenteRegalias > 0)
                                    //where ((filtros.CodigoPrograma.Contains(aprobado.IdPrograma) || (filtros.CodigoPrograma.Count == 0)) && aprobado.VlrTotalProyectoFuenteRegalias > 0)
                                    select new InfoProyectos
                                    {
                                        IdProyecto = proyecto.IdProyecto,
                                        NombreProyecto = proyecto.NombreProyecto,
                                        approvedTotalMoney = proyecto.VlrTotalProyectoFuenteRegalias,
                                        porcentajeGastado = (decimal)aprobado.AvanceFinanciero,
                                        NombreMunicipio = aprobado.EntidadEjecutora,
                                        UrlImagen = aprobado.URLImagen,
                                        NombreSector = sector.NombreSector,
                                        IdSector = sector.IdSector,
                                        cantidadFotos = aprobado.NumeroImagenes,
                                        MesInicioProyecto = aprobado.MesInicioProyecto,
                                        AnioInicioProyecto = aprobado.AnioInicioProyecto,
                                        MesFinProyecto = aprobado.MesFinProyecto,
                                        AnioFinProyecto = aprobado.AnioFinProyecto,
                                        FechaInicioProyecto = aprobado.FechaInicioProyecto,
                                        Megusta = aprobado.MeGusta,
                                        Comentarios = aprobado.Comentarios,

                                    }).Distinct<InfoProyectos>().ToList<InfoProyectos>();

                    }
                    if (limite > listInfo.Count())
                    {
                        listInfo = listInfo.GetRange(0, listInfo.Count);
                    }
                    else
                    {
                        listInfo = listInfo.GetRange(0, limite);
                    }


                    if (!string.IsNullOrEmpty(filtros.ContieneNombreProyecto))
                    {
                        search = new string((from c in filtros.ContieneNombreProyecto.ToLower().Trim().Normalize(NormalizationForm.FormD)
                                             where c < '\x0080'
                                             select c).ToArray<char>());
                        if (predicate == null)
                        {
                            predicate = objProyecto => new string((from c in objProyecto.NombreProyecto.Normalize(NormalizationForm.FormD)
                                                                   where c < '\x0080'
                                                                   select c).ToArray<char>()).ToLower().Contains(search.ToLower());
                        }
                        //listInfo = listInfo.Where<InfoProyectos>(predicate).ToList<InfoProyectos>();
                        //PENDIENTE REVISAR
                    }
                }
                ShortCacheHelper.Add<List<InfoProyectos>>(listInfo, key);
            }
            else
            {
                if (limite > listInfo.Count())
                {
                    listInfo = listInfo.GetRange(0, listInfo.Count);
                }
                else
                {
                    listInfo = listInfo.GetRange(0, limite);
                }
            }
            Trace.WriteLine("Obtenidos los proyectos consistentes programa.");
            return listInfo;
        }

        public async Task<ProyectoPdf> ObtenerDataProyectoPdfAsync(int idProyecto)
        {
            ProyectoPdf rta = null;
            using (var DataModel = new TransparenciaDB())
            {
                rta = await (from proyectoInversion in DataModel.VwProyectosAprobadosInvs
                             join proyecto in DataModel.Proyectos on proyectoInversion.IdProyecto equals proyecto.IdProyecto
                             join historiaEstado in DataModel.HistoriaEstados on proyecto.IdProyecto equals historiaEstado.IdProyecto
                             join fase in DataModel.Fases on historiaEstado.IdFase equals fase.IdFase
                             join etapa in DataModel.Etapas on historiaEstado.IdEtapa equals etapa.IdEtapa
                             join estados in DataModel.Estados on historiaEstado.IdEstado equals estados.IdEstado
                             where proyectoInversion.IdProyecto == idProyecto
                             select new ProyectoPdf
                             {
                                 InformacionGeneral = new InformacionGeneralProyectoPdf
                                 {
                                     //CodigoBIP = proyectoInversion.CodigoSNIP,
                                     AnioInicio = proyectoInversion.AnioInicioProyecto.ToString(),
                                     AnioFinalizacion = proyectoInversion.AnioFinProyecto.ToString(),
                                     //TotalBeneficiariosHombres =  (proyectoInversion.NumeroBeneficiariosHombres ?? 0).ToString(),
                                     //TotalBeneficiariosMujeres = (proyectoInversion.NumeroBeneficiariosMujeres ?? 0).ToString(),
                                     InstitucionEjecutoraPrincipal = proyectoInversion.EntidadEjecutora,
                                     FechaInicio = proyectoInversion.FechaInicioProyecto.ToShortDateString(),
                                     FechaFinalizacion = proyectoInversion.FechaFinProyecto.ToShortDateString(),
                                     Estado = estados.NombreEstado.Trim(),
                                     Etapa = etapa.NombreEtapa,
                                     Fase = fase.NombreFase
                                 },
                                 Resumen = new ResumenProyectoPdf
                                 {
                                     Sector = proyectoInversion.NombreSector,
                                     Duracion = $"{Math.Round(proyectoInversion.DuracionProyecto ?? 0, 2).ToString().Replace(',', '.')} años",
                                     CostoEstimado = Math.Round(proyectoInversion.VlrTotalProyectoTodasLasFuentes, 2),
                                     //TasaCambio= proyectoInversion.TasaCambio.HasValue? Math.Round(proyectoInversion.TasaCambio.Value,4):0,
                                     //CostoOtraMoneda= proyectoInversion.TasaCambio.HasValue ? Math.Round(proyectoInversion.TasaCambio.Value==1?0:  proyectoInversion.TasaCambio.Value* proyectoInversion.VlrTotalProyectoTodasLasFuentes, 2) : 0,
                                     Nombre = proyectoInversion.NombreProyecto,
                                     Objetivo = proyecto.ObjetivoGeneral,
                                     //MonedaCostoProyecto= proyectoInversion.IDMoneda
                                 },
                                 InformacionFinanciera = new InformacionFinancieraProyectoPdf
                                 {
                                     AvanceFinanciero = Math.Round(proyectoInversion.AvanceFinanciero ?? 0, 2) * 100,
                                     AvanceFisico = Math.Round(proyectoInversion.AvanceFisico, 2) * 100,
                                 }
                             }).FirstOrDefaultAsync();
                if (rta != null)
                {
                    BllProjectProfile proyecto = new BllProjectProfile(DataModel);
                    List<ActorFicha> beneficiarios = proyecto.ObtenerNombresGeografiasBeneficiadas(idProyecto);
                    switch (beneficiarios.Count)
                    {
                        case 0:
                            break;
                        case 1:
                        case 2:
                            rta.Resumen.EntidadesTerritorialesBeneficiarias = string.Join(",", beneficiarios.Select(x => x.Nombre).ToList()) + ".";
                            break;
                        default:
                            rta.Resumen.EntidadesTerritorialesBeneficiarias = beneficiarios[0].Nombre + "," + beneficiarios[1].Nombre + $" y otros {beneficiarios.Count - 2}.";
                            break;
                    }
                    rta.ComponentesYActividades = new List<ComponentesYActividadesProyectoPdf>();
                    List<ComponentesProy> componentes = BusquedasProyectosBLL.ObtenerComponentesProy(idProyecto);
                    BusquedasProyectosBLL proyectosSearch = new BusquedasProyectosBLL(null, DataModel, null);
                    foreach (ComponentesProy componente in componentes)
                    {
                        List<ComponentesProy> actividades = proyectosSearch.GetActividadesByComponente(idProyecto, componente.Id.ToString());
                        rta.ComponentesYActividades.Add(new ComponentesYActividadesProyectoPdf { CodigoComponente = componente.Nombre, ActividadesComponente = actividades.Select(x => x.Nombre).ToList() });
                    }
                }
            }
            return rta;
        }
    }

    [ExcludeFromCodeCoverage]
    internal static class PredicateBuilder
    {
        //public static Expression<Func<T, bool>> True<T>() { return f => true; }
        public static Expression<Func<T, bool>> False<T>() { return f => false; }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> expr1,
                                                            Expression<Func<T, bool>> expr2)
        {
            Expression combined = Expression.OrElse(expr1.Body,
                                                    expr2.Body);

            ParameterExpression param = Expression.Parameter(typeof(T), "p");
            ParameterReplacer replacer = new ParameterReplacer(param);
            combined = replacer.Visit(combined);

            return Expression.Lambda<Func<T, bool>>(combined, param);

        }

        //public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr1,
        //                                                     Expression<Func<T, bool>> expr2)
        //{
        //    var invokedExpr = Expression.Invoke(expr2, expr1.Parameters.Cast<Expression>());
        //    return Expression.Lambda<Func<T, bool>>
        //          (Expression.AndAlso(expr1.Body, invokedExpr), expr1.Parameters);
        //}

        // Helper class to replace all parameters with the specified one
        public class ParameterReplacer : ExpressionVisitor
        {
            private readonly ParameterExpression parameter;

            internal ParameterReplacer(ParameterExpression parameter)
            {
                this.parameter = parameter;
            }

            protected override Expression VisitParameter
                (ParameterExpression node)
            {
                return parameter;
            }
        }




    }

    public class PredicateEqualityComparer<T> : EqualityComparer<T>
    {
        private Func<T, T, bool> predicate;

        public PredicateEqualityComparer(Func<T, T, bool> predicate)
            : base()
        {
            this.predicate = predicate;
        }

        public override bool Equals(T x, T y)
        {
            bool bReturn = true;

            if (x != null)
            {
                bReturn = this.predicate(x, y);
            }

            //if (y != null)
            //{
            //    return false;
            //}

            return bReturn;
        }

        public override int GetHashCode(T obj)
        {
            // Always return the same value to force the call to IEqualityComparer<T>.Equals
            return 0;
        }
    }


}