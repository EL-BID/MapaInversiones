using DataModels;
using LinqToDB;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using Quartz.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;

namespace PlataformaTransparencia.Negocios.Sectores
{
    public class SectorBLL : ISectorBLL
    {
        private static TransparenciaDB DataModel;
        private static IConfiguration Configuration;
        private static IConsultasComunes _consultasComunes;
        private List<InfoProyectos> lstProyectosAprobados;

        public SectorBLL(TransparenciaDB connection, IConfiguration configuration, IConsultasComunes consultasComunes)
        {
            DataModel = connection;
            Configuration = configuration;
            _consultasComunes = consultasComunes;
        }
        public ModelLocationData ObtenerDatosLocalizacionSector(string sector_id)
        {
                ModelLocationData objReturn = new();
            try
            {
                
                if (string.IsNullOrEmpty(sector_id)) return objReturn;
                objReturn.location_id = sector_id;

                #region ENCABEZADO
                objReturn.descLocation = objReturn.tipo;
                InfoLocationSectorGen enc_aux = new InfoLocationSectorGen();
                enc_aux = ObtenerInfoLocationSectores(sector_id);

                if (enc_aux == null)
                {
                    objReturn.EncabezadoSector = new InfoLocationSectorGen()
                    {
                        IdDepartamento = "",
                        IdSector = "",
                        Costo = 0,
                        Duracion = 0,
                        CantProyectos = 0,
                        UrlImgXL = "",
                        nomSector = ""
                    };
                }
                else
                {
                    objReturn.EncabezadoSector = enc_aux;
                }
                #endregion

                #region PRESUPUESTO
                //seccion "presupeusto de la entidad"
                objReturn.Anios = ObtenerAniosPerfilSector(sector_id);

                #endregion


                ////consultar si es municipio o departamento
                FiltroBusquedaProyecto filtro_busqueda = new();
                List<string> codigo_filtro = new() { sector_id.Trim().ToUpper() };
                List<Modelos.Comunes.Departamento> lstDepartamentos = ConsultasComunes.ObtenerDepartamentosPorSectores(codigo_filtro);
                lstDepartamentos.Add(new Modelos.Comunes.Departamento { IdDepartamento = "0", NombreDepartamento = "Proyectos Nacionales" });

                #region PROYXSECTOR
                objReturn.ProjectsPerSectorGroup = ObtenerProyectosPorDepartamentoDadoSector(sector_id, lstDepartamentos);
                #endregion

                #region PROYECTOS_EN_EJECUCION
                List<int> codigo_estado = new();
                string key_estado_proy = CommonConstants.EstadoProyEjecucion.ToString();
                if (!string.IsNullOrEmpty(key_estado_proy))
                {
                    codigo_estado.Add(int.Parse(key_estado_proy));
                }
                filtro_busqueda.CodigosEstado = codigo_estado;

                objReturn.ProyectosEjecucion = _consultasComunes.ObtenerProyectosConsistentesPorSectoresPry(sector_id);
                #endregion

                objReturn.Datossectores = ObtenerTopSectores();
                objReturn.Status = true;
            }
            catch (ArgumentOutOfRangeException ex)
            {
                // imprime todo el detalle (mensaje + stack trace)
                Debug.WriteLine("catch-->" + ex.ToString());

                // si necesitas seguir propagando el error, re-lánzalo
                throw;


            }
            catch (Exception ex)
            {
                Debug.WriteLine("catch 2-->" + ex.ToString());
                throw; 

            }

            return objReturn;
        }

        private InfoLocationSectorGen ObtenerInfoLocationSectores(string sector_id)
        {

            var baseQuery = DataModel
                .VwInformacionGeneralPerfilSectors
                .Where(p => p.IdSector.ToString() == sector_id);

            if (!baseQuery.Any())
                return new InfoLocationSectorGen();

            return baseQuery
                .Select(perfil => new InfoLocationSectorGen
                {
                    IdSector = perfil.IdSector.ToString(),
                    nomSector = perfil.NombreSector,
                    Costo = Math.Round((decimal)perfil.ValorProyectosTotal, 2),
                    Duracion = Math.Round((decimal)perfil.DuracionPromedioProyectos, 2),
                    CantProyectos = Math.Round((decimal)perfil.NumeroProyectos, 2)
                    
                })
                .First();
      

        }


        private List<InfoProjectsPerEstado> ObtenerProyectosEstadoPorSector(string sector_id)
        {
            List<InfoProjectsPerEstado> objReturn = new List<InfoProjectsPerEstado>();
            var datosEstadoSector = (from proyecto in DataModel.Proyectos
                                     join historiaEstado in DataModel.HistoriaEstados on proyecto.IdProyecto equals historiaEstado.IdProyecto
                                     join estado in DataModel.Estados on historiaEstado.IdEstado equals estado.IdEstado
                                     where proyecto.IdSector.ToString() == sector_id
                                     select new
                                     {
                                         estado.NombreEstado,
                                         proyecto.IdProyecto
                                     }).ToList();
            if (datosEstadoSector.Any())
            {
                var ProjectsPerEstadoQuery = (from estado in datosEstadoSector
                                              group estado by estado.NombreEstado into g
                                              orderby g.Key ascending
                                              select new InfoProjectsPerEstado
                                              {
                                                  label = g.Key,
                                                  rawValue = g.Count(),
                                                  value = g.Count().ToString()
                                              });
                objReturn = ProjectsPerEstadoQuery.ToList();
            }
            return objReturn;
        }
        private List<PlataformaTransparencia.Modelos.Comunes.Departamento> ObtenerDepartamentosPorSectores(List<string> codigosSector)
        {
            if (codigosSector == null) codigosSector = new();
            var entes = (from ente in DataModel.VwSectorPerfilDeptoInvs
                         where (codigosSector.Contains(ente.IdSector.ToString()))
                         select new PlataformaTransparencia.Modelos.Comunes.Departamento
                         {
                             IdDepartamento = ente.IdDepartamento,
                             NombreDepartamento = ente.NombreDepartamento
                         }).Distinct().ToList();
            return new List<PlataformaTransparencia.Modelos.Comunes.Departamento>(entes);
        }

        public List<InfoProjectPerSector> ObtenerProyectosPorDepartamentoDadoSector(string sectorId, List<PlataformaTransparencia.Modelos.Comunes.Departamento> lstDepartamentos)
        {
            List<InfoProjectPerSector> objReturn = new();
            List<InfoProjectPerSector> objReturnTemp = new();
            using (var DataModel = new TransparenciaDB())
            {
                #region Obtener los proyectos por Departamento (Ente territorial)
                var proyectosXEstadoIdDpto = (from vistaSectorEnte in DataModel.VwSectorListadoPorDeptoInvs
                                              join estado in DataModel.Estados on vistaSectorEnte.IdEstado equals estado.IdEstado
                                              where vistaSectorEnte.IdSector.ToString() == sectorId
                                              select new
                                              {
                                                  vistaSectorEnte.IdDepartamento,
                                                  estado.NombreEstado,
                                                  vistaSectorEnte.IdProyecto
                                              }).ToArray();
                var proyectosXEstadoNombreDpto = (from proyEstadoIdDpto in proyectosXEstadoIdDpto
                                                  join dpto in lstDepartamentos on proyEstadoIdDpto.IdDepartamento equals dpto.IdDepartamento
                                                  select new
                                                  {
                                                      dpto.NombreDepartamento,
                                                      proyEstadoIdDpto.NombreEstado,
                                                      proyEstadoIdDpto.IdProyecto,
                                                      dpto.IdDepartamento,
                                                  }).ToArray();
                var numProyectosXEstadoNombreDpto = (from proyEstadoNombreDpto in proyectosXEstadoNombreDpto
                                                     group proyEstadoNombreDpto by new { proyEstadoNombreDpto.NombreDepartamento, proyEstadoNombreDpto.IdDepartamento, proyEstadoNombreDpto.NombreEstado } into g
                                                     select new InfoProjectPerSector
                                                     {
                                                         label = g.Key.NombreEstado,
                                                         labelGroup = g.Key.NombreDepartamento,
                                                         rawValue = g.Count(),
                                                         value = g.Count().ToString(),
                                                         alias = g.Key.IdDepartamento
                                                     }).ToArray();
                #endregion Obtener los proyectos por Departamento (Ente territorial)
                #region Obtener los proyectos que no pertenecen a un ente territorial (Nacionales)

                var proyectosSectorConEnteTerritorial = (from proy in DataModel.VwSectorListadoPorDeptoInvs
                                                         where proy.IdSector.ToString() == sectorId
                                                         select proy.IdProyecto
                                                          ).Distinct().ToArray();
                var todosProyectosSector = (from proyecto in DataModel.Proyectos
                                            join proyectoEstado in DataModel.HistoriaEstados on proyecto.IdProyecto equals proyectoEstado.IdProyecto
                                            join estado in DataModel.Estados on proyectoEstado.IdEstado equals estado.IdEstado
                                            where proyecto.IdSector.ToString() == sectorId
                                            select new
                                            {
                                                proyecto.IdProyecto,
                                                estado.NombreEstado
                                            }).Distinct().ToArray();

                List<InfoProjectPerSector> proyectosSinEnteTerritorial = new List<InfoProjectPerSector>();
                for (int j = 0; j < todosProyectosSector.Length; j++)
                {
                    if (!proyectosSectorConEnteTerritorial.Contains(todosProyectosSector[j].IdProyecto))
                        proyectosSinEnteTerritorial.Add(new InfoProjectPerSector { label = todosProyectosSector[j].NombreEstado, rawValue = todosProyectosSector[j].IdProyecto });
                }
                var numProyectosNacionalesXEstado = (from proyNac in proyectosSinEnteTerritorial
                                                     group proyNac by proyNac.label into g
                                                     select new InfoProjectPerSector
                                                     {
                                                         labelGroup = "Proyectos Nacionales",
                                                         label = g.Key,
                                                         rawValue = g.Count(),
                                                         value = g.Count().ToString()
                                                     }).ToArray();

                #endregion Obtener los proyectos que no pertenecen a un ente territorial (Nacionales)
                #region Agrego los datos de las dos consultas en una variable temporal
                if (numProyectosNacionalesXEstado.Any()) foreach (var numProyectoNacionalXEstado in numProyectosNacionalesXEstado) objReturnTemp.Add(numProyectoNacionalXEstado);
                if (numProyectosXEstadoNombreDpto.Any()) foreach (var numProyectoDptoXEstado in numProyectosXEstadoNombreDpto) objReturnTemp.Add(numProyectoDptoXEstado);
                #endregion Agrego los datos de las dos consultas en una variable temporal

            }
            objReturn = objReturnTemp.OrderByDescending(o => o.rawValue).ToList();
            return objReturn;
        }

        public ModelLocationData ObtenerProyectosAnioEstado(string sector_id, string departamento_id, string? anio, string? id_estado)
        {
            ModelLocationData objReturn = new() { ProyectosAprobados= new() };
            if (string.IsNullOrEmpty(sector_id)) return objReturn;
            objReturn.location_id = sector_id;
            List<string> codigo_filtro = new() { sector_id.Trim().ToUpper() };
            int year = int.MinValue;
            anio??=string.Empty;
            if (int.TryParse(anio, out year))
            {
                List<Modelos.Comunes.Departamento> lstDepartamentos = ConsultasComunes.ObtenerDepartamentosPorSectores(codigo_filtro);
                lstDepartamentos.Add(new Modelos.Comunes.Departamento { IdDepartamento = "0", NombreDepartamento = "Proyectos Nacionales" });
                var RecursosPerObjetoQuery = (from vslpdi in DataModel.VwSectorListadoPorDeptoInvs
                                              join vff in DataModel.VwFuentesFinanciacions2024 on vslpdi.IdProyecto equals vff.IdProyecto
                                              where vslpdi.IdSector.ToString()== sector_id 
                                              && vff.Periodo.HasValue
                                              && vff.Periodo.ToString()== anio
                                              group vff by new { vff.IdProyecto } into g
                                              select new itemGenPresupuesto
                                              {
                                                id = g.Key.IdProyecto.ToString(),
                                                ejecutado = g.Sum(x => x.ValorEjecutado.Value),
                                                comprometido = g.Sum(x => x.ValorVigente.Value)
                                              });

        var proyectosXEstadoIdDptosql = (from vistaSectorEnte in DataModel.VwSectorListadoPorDeptoInvs
                                              join estado in DataModel.Estados on vistaSectorEnte.IdEstado equals estado.IdEstado
                                              join proyecto in DataModel.Proyectos on vistaSectorEnte.IdProyecto equals proyecto.IdProyecto
                                              from ejecutado in RecursosPerObjetoQuery.LeftJoin( pr => int.Parse(pr.id)== proyecto.IdProyecto)
                                              where
                                              vistaSectorEnte.IdSector.ToString() == sector_id
                                               && (vistaSectorEnte.IdEstado.ToString() == id_estado || id_estado == null)
                                               && (proyecto.FechaInicioProyecto.Year<=year && proyecto.FechaFinProyecto.Year>= year)
                                              select new
                                              {
                                                  proyecto.IdProyecto,
                                                  proyecto.NombreProyecto,
                                                  ejecutado.comprometido,
                                                  ejecutado.ejecutado,
                                                  CodigoSnip = proyecto.CodigoBPIN,
                                                  vistaSectorEnte.IdDepartamento
                                              });

                var proyectosXEstadoIdDpto = (from vistaSectorEnte in DataModel.VwSectorListadoPorDeptoInvs
                                              join estado in DataModel.Estados on vistaSectorEnte.IdEstado equals estado.IdEstado
                                              join proyecto in DataModel.Proyectos on vistaSectorEnte.IdProyecto equals proyecto.IdProyecto
                                              from ejecutado in RecursosPerObjetoQuery.LeftJoin(pr => int.Parse(pr.id) == proyecto.IdProyecto)
                                              where vistaSectorEnte.IdSector.ToString() == sector_id
                                               && (vistaSectorEnte.IdEstado.ToString() == id_estado || id_estado == null)
                                               && (proyecto.FechaInicioProyecto.Year <= year && proyecto.FechaFinProyecto.Year >= year)
                                              select new
                                              {
                                                  proyecto.IdProyecto,
                                                  proyecto.NombreProyecto,
                                                  ejecutado.comprometido,
                                                  //proyecto.VlrTotalProyectoTodasLasFuentes,
                                                  ejecutado.ejecutado,
                                                  CodigoSnip = proyecto.CodigoBPIN,
                                                  vistaSectorEnte.IdDepartamento
                                              }).ToList();
                var proyectosXEstadoNombreDpto = (from proyecto in proyectosXEstadoIdDpto
                                                  join dpto in lstDepartamentos on proyecto.IdDepartamento equals dpto.IdDepartamento
                                                  where proyecto.IdDepartamento== departamento_id || proyecto.IdDepartamento=="0"
                                                  select new InfoProyectos
                                                  {
                                                      IdProyecto = proyecto.IdProyecto,
                                                      NombreProyecto = proyecto.NombreProyecto,
                                                      VlrTotalProyectoFuenteRegalias = proyecto.comprometido,
                                                      VlrTotalProyectoTodasLasFuentes = proyecto.ejecutado,
                                                      CodigoSnip = proyecto.CodigoSnip,
                                                      IdDepartamento = dpto.IdDepartamento,
                                                      NombreDepartamento = dpto.NombreDepartamento,
                                                  }).ToList();
                if (proyectosXEstadoNombreDpto != null && proyectosXEstadoNombreDpto.Count > 1) proyectosXEstadoNombreDpto = proyectosXEstadoNombreDpto.DistinctBy(x => x.IdProyecto).ToList();
                if(proyectosXEstadoNombreDpto!=null && proyectosXEstadoNombreDpto.Count>1) proyectosXEstadoNombreDpto= proyectosXEstadoNombreDpto.OrderByDescending(x=>x.VlrTotalProyectoFuenteRegalias).ToList();
                objReturn.ProyectosAprobados = proyectosXEstadoNombreDpto;
            }
            return objReturn;
        }
        private List<InfoLocationSectorGen> ObtenerTopSectores()
        {
            List<InfoLocationSectorGen> objReturn = new List<InfoLocationSectorGen>();
            using (var DataModel = new TransparenciaDB())
            {
                objReturn = (from perfilSector in DataModel.VwInformacionGeneralPerfilSectors
                                                         join img in DataModel.VwEstadoImagenes
                                                         on perfilSector.IdSector equals img.IdSector
                                                         select new InfoLocationSectorGen
                                                         {
                                                             IdSector = perfilSector.IdSector.ToString(),
                                                             nomSector = perfilSector.NombreSector,
                                                             Costo = Math.Round((decimal)perfilSector.ValorPromedioProyecto, 2),
                                                             Duracion = Math.Round((decimal)perfilSector.DuracionPromedioProyectos, 2),
                                                             CantProyectos = Math.Round((decimal)perfilSector.NumeroProyectos, 2),
                                                             UrlImgXL = img.ImgSector
                                                         }).OrderByDescending(p => p.CantProyectos).Take(4).ToList();
            }
            return objReturn;
        }

        public ModelLocationData ObtenerProyectosAnios(string sector_id, string departamento_id)
        {
            ModelLocationData objReturn = new ();
            if (string.IsNullOrEmpty(sector_id)) return objReturn;
            objReturn.location_id = sector_id;

            string[]? deptoid = null;
            if (departamento_id is not null) { deptoid = departamento_id.Split(","); }

            List<string> anios = (from vistaSectorEnte in DataModel.VwSectorListadoPorDeptoInvs
                                  //join estado in DataModel.Estados on vistaSectorEnte.IdEstado equals estado.IdEstado
                                  join proyecto in DataModel.Proyectos on vistaSectorEnte.IdProyecto equals proyecto.IdProyecto
                                  where vistaSectorEnte.IdSector.ToString() == sector_id 
                                  && (deptoid.Contains(vistaSectorEnte.IdDepartamento) || departamento_id == null)
                                  group proyecto by proyecto.FechaInicioProyecto.Year into g
                                  orderby g.Key ascending
                                  select g.Key.ToString()).ToList();
            if (anios != null && anios.Count > 1) anios = anios.OrderBy(x => x).ToList();
            objReturn.Anios = anios;
            return objReturn;
        }

        public ModelLocationData ObtenerProyectosAniosPerfilSector(string sector_id, string departamento_id)
        {
            ModelLocationData objReturn = new();
            if (string.IsNullOrEmpty(sector_id)) return objReturn;
            objReturn.location_id = sector_id;
            List<string> anios = (from vistaSectorEnte in DataModel.VwSectorListadoPorDeptoInvs
                                  //join proyecto in DataModel.Proyectos on vistaSectorEnte.IdProyecto equals proyecto.IdProyecto
                                  join fuente in DataModel.VwFuentesFinanciacions2024 on vistaSectorEnte.IdProyecto equals fuente.IdProyecto
                                  where vistaSectorEnte.IdSector.ToString() == sector_id
                                  && vistaSectorEnte.IdDepartamento.Equals(departamento_id)
                                  group fuente by fuente.Periodo into g
                                  orderby g.Key ascending
                                  select g.Key.ToString()).ToList();
          if (anios != null && anios.Count > 1) anios = anios.OrderBy(x => x).ToList();
                objReturn.Anios = anios;
                return objReturn;
        }

        public List<string> ObtenerAniosPerfilSector(string sector_id)
        {
            List<string> anios = new List<string>();

            using (var DataModel = new TransparenciaDB())
            {
                anios = (from aniospresupuesto in DataModel.VwPresupuestoAsignadoSectors
                         where aniospresupuesto.CodigoSector.ToString() == sector_id && aniospresupuesto.TipoGasto.ToUpper() == "PRESUPUESTO ANUAL"
                         select aniospresupuesto.Año.ToString()).ToList();
                if (anios != null && anios.Count > 1) anios = anios.OrderByDescending(x => x).ToList();
                return anios;

            }
        }

        public ModelLocationData GetConsolidadoPeriodosSector(string sector_id, int anyo)
        {

            ModelLocationData objReturn = new ModelLocationData();
            try
            {

                var RecursosPerObjetoQuery = (from info in DataModel.VwPresupuestoAsignadoSectors                                        
                                              where info.Año == anyo && info.TipoGasto.ToUpper() == "PRESUPUESTO ANUAL" && info.CodigoSector==sector_id
                                              select new InfoParticipacionSector
                                              {
                                                  ValorVigente = info.ValorVigente.Value,
                                                  ValorComprometido = info.ValorComprometido.Value,
                                                  ValorGiros = info.ValorGiros.Value
                                              }).First();

                objReturn.ParticipacionSector = RecursosPerObjetoQuery;
            }
            catch (Exception exception)
            {
                return null;
            }
            return objReturn;

        }

        public List<InfoParticipacionSector> GetConsolidadoGastosSector(string sector_id, int anyo)
        {

            List<InfoParticipacionSector> objReturn = new List<InfoParticipacionSector>();

            using (var DataModel = new TransparenciaDB())
            {
                var RecursosPerObjetoQuery = (from info in DataModel.VwPresupuesto
                                              join ct in DataModel.CatalogoTiempos on info.Periodo equals ct.Periodo
                                              where info.IdSector == sector_id && ct.Año == anyo && info.TipoGasto.ToUpper() == "PRESUPUESTO ANUAL"
                                              group info by new { info.ClasificacionGastoPptal, info.DetalleClasificacionGastoPptal } into g

                                              select new InfoParticipacionSector
                                              {
                                                  labelGroup = g.Key.ClasificacionGastoPptal,
                                                  label = g.Key.DetalleClasificacionGastoPptal,
                                                  rawValueDouble = g.Sum(g => g.Vigente.Value)
                                              }).OrderBy(x => x.labelGroup).ThenBy(n => n.label).ToList();

                objReturn = RecursosPerObjetoQuery;
            }

            return objReturn;

        }

        public ModelLocationData GetODSInversion(string sector_id)
        {

            ModelLocationData objReturn = new ModelLocationData();

            using (var DataModel = new TransparenciaDB())
            {
                var cantidadProyectosUnicos = (
                    from info in DataModel.VwInformacionGeneralPerfilSectorPries
                    where info.IdSector == int.Parse(sector_id)
                    group info by info.IdProyecto into g
                    select g.Key
                ).Count();

                objReturn.ApprovedProjects = cantidadProyectosUnicos;

                var RecursosPerObjetoQuery = (from info in DataModel.VwInformacionGeneralPerfilSectorPries
                                              where info.IdSector == int.Parse(sector_id)
                                              group info by new { info.ODSId, info.ODSNombre, info.TotalProyectos } into g

                                              select new InfoOds
                                              {
                                                  ODSId = g.Key.ODSId,
                                                  ODSNombre = g.Key.ODSNombre,
                                                  TotalProyectos = g.Key.TotalProyectos

                                              }).OrderBy(x => x.ODSId).ThenBy(n => n.ODSNombre).ToList();

                objReturn.infoOds = RecursosPerObjetoQuery;

                var Entidades = (from info in DataModel.VwInformacionGeneralPerfilSectorPries
                                              where info.IdSector == int.Parse(sector_id)
                                              group info by new { info.IdEntidadEjecutora, info.EntidadEjecutora} into g

                                              select new Item
                                              {
                                                  Id = g.Key.IdEntidadEjecutora,
                                                  Nombre = g.Key.EntidadEjecutora

                                              }).OrderBy(n => n.Nombre).ToList();

                objReturn.InfoEntidades = Entidades;
            }

            return objReturn;


        }

        public ModelLocationData GetODSDesarrollo(string sector_id)
        {

            ModelLocationData objReturn = new ModelLocationData();

            using (var DataModel = new TransparenciaDB())
            {
                var cantidadProyectosUnicos = (
                     from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
                     where info.IdSector == int.Parse(sector_id)
                     group info by info.IdProyecto into g
                     select g.Key
                 ).Count();

                objReturn.ApprovedProjects = cantidadProyectosUnicos;

                var RecursosPerObjetoQuery = (from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
                                              where info.IdSector == int.Parse(sector_id)
                                              group info by new { info.ODSId, info.ODSNombre } into g

                                              select new InfoOds
                                              {
                                                  ODSId = g.Key.ODSId,
                                                  ODSNombre = g.Key.ODSNombre,
                                                  TotalProyectos = g.Sum(x => x.TotalProyectos)

                                              }).OrderBy(x => x.ODSId).ThenBy(n => n.ODSNombre).ToList();


                objReturn.infoOds = RecursosPerObjetoQuery;

                var Entidades = (from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
                                 where info.IdSector == int.Parse(sector_id)
                                 group info by new { info.IdEntidadEjecutora, info.EntidadEjecutora } into g

                                 select new Item
                                 {
                                     Id = g.Key.IdEntidadEjecutora,
                                     Nombre = g.Key.EntidadEjecutora

                                 }).OrderBy(n => n.Nombre).ToList();

                objReturn.InfoEntidades = Entidades;
            }

            return objReturn;


        }


        public ModelLocationData GetConsolidadoODSInversion(string sector_id, int pagina, int tamanopagina, string ods = null, string entidad = null)
        {

            ModelLocationData objReturn = new ModelLocationData();

            using (var DataModel = new TransparenciaDB())
            {


                int? odsValue = string.IsNullOrEmpty(ods) ? (int?)null : int.Parse(ods);
                string? entidadValue = string.IsNullOrEmpty(entidad) ? (string?)null : entidad;

                int cantidadProyectosUnicos = (
                     from info in DataModel.VwInformacionGeneralPerfilSectorPries
                     where info.IdSector == int.Parse(sector_id)
                     && (odsValue == null || info.ODSId == odsValue)
                     && (entidadValue == null || info.IdEntidadEjecutora == entidadValue)
                     group info by info.IdProyecto into g
                     select g.Key
                 ).Count();

                objReturn.ApprovedProjects = cantidadProyectosUnicos;

                var RecursosPerObjetoQuery = (from info in DataModel.VwInformacionGeneralPerfilSectorPries
                                              where info.IdSector == int.Parse(sector_id)
                                              && (odsValue == null || info.ODSId == odsValue)
                                              && (entidadValue == null || info.IdEntidadEjecutora == entidadValue)
                                              group info by new
                                              {
                                                  info.IdProyecto,
                                                  info.CodigoProyecto,
                                                  info.NombreProyecto,
                                                  info.VlrTotalComprommetido,
                                                  info.VlrTotalGirado,
                                                  info.VlrTotalProgramado,
                                                  info.EntidadEjecutora,
                                                  info.IdEntidadEjecutora
                                              } into g
                                              select new InfoConsolidadoProyectosInversion
                                              {
                                                  IdProyecto = g.Key.IdProyecto,
                                                  CodigoProyecto = g.Key.CodigoProyecto,
                                                  NombreProyecto = g.Key.NombreProyecto,
                                                  VlrTotalComprommetido = g.Key.VlrTotalComprommetido,
                                                  VlrTotalGirado = g.Key.VlrTotalGirado,
                                                  VlrTotalProgramado = g.Key.VlrTotalProgramado,
                                                  IdEntidadEjecutora= g.Key.IdEntidadEjecutora,
                                                  EntidadEjecutora = g.Key.EntidadEjecutora
                                              }).OrderBy(x => x.ODSId).ThenBy(x => x.NombreProyecto).Skip((pagina - 1) * tamanopagina)
                                .Take(tamanopagina).ToList();

                objReturn.infoConsolidadoProyectosInversions = RecursosPerObjetoQuery;
            }

            return objReturn;


        }

        public ModelLocationData GetConsolidadoODSDesarrollo(string sector_id, int pagina, int tamanopagina, string ods = null, string entidad = null)
        {

            ModelLocationData objReturn = new ModelLocationData();
            using (var DataModel = new TransparenciaDB())
            {
                int? odsValue = string.IsNullOrEmpty(ods) ? (int?)null : int.Parse(ods);
                string? entidadValue = string.IsNullOrEmpty(entidad) ? (string?)null : entidad;

                int cantidadProyectosUnicos = (
                     from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
                     where info.IdSector == int.Parse(sector_id)
                     && (odsValue == null || info.ODSId == odsValue)
                     && (entidadValue == null || info.IdEntidadEjecutora == entidadValue)
                     group info by info.IdProyecto into g
                     select g.Key
                 ).Count();

                objReturn.ApprovedProjects = cantidadProyectosUnicos;



                var RecursosPerObjetoQuery = (from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
                                              where info.IdSector == int.Parse(sector_id)
                                                && (odsValue == null || info.ODSId == odsValue)
                                                && (entidadValue == null || info.IdEntidadEjecutora == entidadValue)
                                              group info by new
                                              {
                                                  info.IdProyecto,
                                                  info.CodigoProyecto,
                                                  info.NombreProyecto,
                                                  info.VlrTotalComprommetido,
                                                  info.VlrTotalGirado,
                                                  info.VlrTotalProgramado,
                                                  info.EntidadEjecutora,
                                                  info.IdEntidadEjecutora

                                              } into g
                                              select new InfoConsolidadoProyectosInversion
                                              {
                                                  IdProyecto = g.Key.IdProyecto,
                                                  CodigoProyecto = g.Key.CodigoProyecto,
                                                  NombreProyecto = g.Key.NombreProyecto,
                                                  VlrTotalComprommetido = g.Key.VlrTotalComprommetido,
                                                  VlrTotalGirado = g.Key.VlrTotalGirado,
                                                  VlrTotalProgramado = g.Key.VlrTotalProgramado,
                                                  IdEntidadEjecutora = g.Key.IdEntidadEjecutora,
                                                  EntidadEjecutora = g.Key.EntidadEjecutora
                                              }).OrderBy(x => x.ODSId).ThenBy(x => x.NombreProyecto).Skip((pagina - 1) * tamanopagina)
                                                .Take(tamanopagina).ToList();

                objReturn.infoConsolidadoProyectosInversions = RecursosPerObjetoQuery;
            }


            return objReturn;


        }


        public ModelLocationData GetProyectosPotSector(string sector_id)
        {
            ModelLocationData resultado = new ModelLocationData();
            using (var DataModel = new TransparenciaDB())
            {
                 resultado.ProyectosAprobados = (from data in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoxSectorxEntidads
                             where data.IdSector == int.Parse(sector_id)
                             select new InfoProyectos
                             {
                                 IdDepartamento = data.IdDepartamento,
                                 NombreDepartamento = data.NombreDepartamento,
                                 IdProyecto = data.IdProyecto,
                                 NombreProyecto = data.NombreProyecto,
                                 TipoProyecto = data.TipoProyecto

                             })
                  .ToList();

            }
            return resultado;
        }
    }
}