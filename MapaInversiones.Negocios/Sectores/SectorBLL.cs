using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using System;
using System.Collections.Generic;
using System.Linq;
using PlataformaTransparencia.Negocios.Interfaces;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Entidad;
using LinqToDB;

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
            if (string.IsNullOrEmpty(sector_id))return objReturn;
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

            #region TODOSPROYECTOS
            //seccion "Todos los proyectos"
            objReturn.ProjectsPerEstado = ObtenerProyectosEstadoPorSector(sector_id);

            #endregion

            ////consultar si es municipio o departamento
            FiltroBusquedaProyecto filtro_busqueda = new();
            List<string> codigo_filtro = new() { sector_id.Trim().ToUpper() };
            List< Modelos.Comunes.Departamento > lstDepartamentos = ConsultasComunes.ObtenerDepartamentosPorSectores(codigo_filtro);
            lstDepartamentos.Add(new Modelos.Comunes.Departamento { IdDepartamento = "0", NombreDepartamento = "Proyectos Nacionales" });

            #region PROYXSECTOR
            objReturn.ProjectsPerSectorGroup = ObtenerProyectosPorDepartamentoDadoSector(sector_id, lstDepartamentos);
            //var costoProyectoXDepartamentoDadoSector = ObtenerCostoProyectosPorDepartamentoDadoSector(sector_id);
            #endregion

            #region PROYECTOS_EN_EJECUCION
            List<int> codigo_estado = new();
            string key_estado_proy = CommonConstants.EstadoProyEjecucion.ToString();
            if (!string.IsNullOrEmpty(key_estado_proy))
            {
                codigo_estado.Add(int.Parse(key_estado_proy));
            }
            filtro_busqueda.CodigosEstado = codigo_estado;

            lstProyectosAprobados = _consultasComunes.ObtenerProyectosConsistentesPorSectores(codigo_filtro, filtro_busqueda, 999);
            objReturn.ProyectosEjecucion = lstProyectosAprobados;
            #endregion

            objReturn.Datossectores = ObtenerTopSectores();
            objReturn.Status = true;
            return objReturn;
        }

        private InfoLocationSectorGen ObtenerInfoLocationSectores(string sector_id)
        {

            List<InfoLocationSectorGen> objReturn = new List<InfoLocationSectorGen>();
            objReturn = (from perfilSector in DataModel.VwInformacionGeneralPerfilSectors
                             where perfilSector.IdSector.ToString() == sector_id
                             select new InfoLocationSectorGen
                             {
                                 IdSector = perfilSector.IdSector.ToString(),
                                 nomSector = perfilSector.NombreSector,
                                 Costo = Math.Round((decimal)perfilSector.ValorProyectosTotal, 2),
                                 Duracion = Math.Round((decimal)perfilSector.DuracionPromedioProyectos, 2),
                                 CantProyectos = Math.Round((decimal)perfilSector.NumeroProyectos, 2),
                             }).ToList();
            //objReturn = queryInfo;

            return objReturn.FirstOrDefault();
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


                var RecursosPerObjetoQuery = (from info in DataModel.VwPresupuestoXProyInvs
                                              where info.Periodo.ToString().Contains(anio)
                                              group info by new { info.IdProyecto, info.Nombreproyecto} into g
                                              select new itemGenPresupuesto
                                              {

                                                  id = g.Key.IdProyecto.ToString(),
                                                  ejecutado = g.Sum(x => x.ValorEjecutado.Value) 

                                              });
                //var RecursosPerObjetoQuerysql = (from info in DataModel.VwPresupuestoXProyInvs
                //                              where info.Periodo.ToString().Contains(anio)
                //                              group info by new { info.IdProyecto, info.Nombreproyecto } into g
                //                              select new itemGenPresupuesto
                //                              {
                //                                  id = g.Key.IdProyecto.ToString(),
                //                                  ejecutado = g.Sum(x => x.ValorEjecutado.Value)

                //                              });


                var proyectosXEstadoIdDptosql = (from vistaSectorEnte in DataModel.VwSectorListadoPorDeptoInvs
                                              join estado in DataModel.Estados on vistaSectorEnte.IdEstado equals estado.IdEstado
                                              join proyecto in DataModel.Proyectos on vistaSectorEnte.IdProyecto equals proyecto.IdProyecto
                                              from ejecutado in RecursosPerObjetoQuery.LeftJoin( pr => int.Parse(pr.id)== proyecto.IdProyecto)
                                              where
                                              vistaSectorEnte.IdSector.ToString() == sector_id
                                               && (vistaSectorEnte.IdEstado.ToString() == id_estado || id_estado == null)
                                               && (proyecto.FechaInicioProyecto.Year==year || proyecto.FechaFinProyecto.Year== year)
                                              select new
                                              {
                                                  proyecto.IdProyecto,
                                                  proyecto.NombreProyecto,
                                                  proyecto.VlrTotalProyectoFuenteRegalias,
                                                  //proyecto.VlrTotalProyectoTodasLasFuentes,
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
                                               && (proyecto.FechaInicioProyecto.Year == year || proyecto.FechaFinProyecto.Year == year)
                                              select new
                                              {
                                                  proyecto.IdProyecto,
                                                  proyecto.NombreProyecto,
                                                  proyecto.VlrTotalProyectoFuenteRegalias,
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
                                                      VlrTotalProyectoFuenteRegalias = proyecto.VlrTotalProyectoFuenteRegalias,
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
            List<InfoLocationSectorGen> objReturn = (from perfilSector in DataModel.VwInformacionGeneralPerfilSectors
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
            return objReturn;
        }

        public ModelLocationData ObtenerProyectosAnios(string sector_id, string departamento_id)
        {
            ModelLocationData objReturn = new ();
            if (string.IsNullOrEmpty(sector_id)) return objReturn;
            objReturn.location_id = sector_id;

            string[]? deptoid = null;
            if (departamento_id is not null) { deptoid = departamento_id.Split(","); }
            //var aniosql = (from vistaSectorEnte in DataModel.VwSectorListadoPorDeptoInvs
            //                      join proyecto in DataModel.Proyectos on vistaSectorEnte.IdProyecto equals proyecto.IdProyecto
            //                      where vistaSectorEnte.IdSector.ToString() == sector_id
            //                      && (deptoid.Contains(vistaSectorEnte.IdDepartamento) || departamento_id == null)
            //                      group proyecto by proyecto.FechaInicioProyecto.Year into g
            //                      orderby g.Key ascending
            //                      select new { });
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
                                  join proyecto in DataModel.Proyectos on vistaSectorEnte.IdProyecto equals proyecto.IdProyecto
                                  where vistaSectorEnte.IdSector.ToString() == sector_id
                                  && vistaSectorEnte.IdDepartamento.Equals(departamento_id)
                                  group proyecto by proyecto.FechaInicioProyecto.Year into g
                                  orderby g.Key ascending
                                  select g.Key.ToString()).ToList();
            if (anios != null && anios.Count > 1) anios = anios.OrderBy(x => x).ToList();
            objReturn.Anios = anios;
            return objReturn;
        }

    }
}