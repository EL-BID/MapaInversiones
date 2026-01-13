using Newtonsoft.Json;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Modelos.Comunes;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using PlataformaTransparencia.Negocios.Comunes;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Negocios.Proyectos
{
    public class ConsolidadosNacionalesBLL : IConsolidadosNacionalesBLL
    {
        private List<DataModels.Proyecto> lstProyectosConsistentes;
        private List<EnteTerritorial> lstDepartamentosIni;
        private List<EnteTerritorial> lstMunicipiosIni;
        private List<InfoProyectos> lstProyectosAprobados;
        private List<InfoProyectos> lstProyectosAll;
        private List<InfoProyectos> lstProyNacionales;

        private static TransparenciaDB DataModel;
        private static IConfiguration Configuration;
        private static IConsultasComunes _consultasComunes;


        public ConsolidadosNacionalesBLL(TransparenciaDB connection, IConfiguration configuration, IConsultasComunes consultasComunes)
        {
            DataModel = connection;
            Configuration = configuration;
            _consultasComunes = consultasComunes;
        }
        public class cad_auxiliar
        {
            public string parameter { get; set; }
            public string Id { get; set; }
            public string Nombre { get; set; }
        }

        public ConsolidadosNacionalesBLL()
        {
            this.lstProyectosConsistentes = new List<DataModels.Proyecto>();
            this.lstDepartamentosIni = new List<EnteTerritorial>();
            this.lstMunicipiosIni = new List<EnteTerritorial>();
            this.lstProyectosAprobados = new List<InfoProyectos>();
            this.lstProyectosAll = new List<InfoProyectos>();
        }

        /// <summary>
        /// Constructor que Genera los datos a partir de las consultas
        /// para su uso posterior
        /// </summary>

        public ModelHomeData ObtenerDatosModeloInicio(bool esHome = true)
        {
            ModelHomeData objReturn = new ModelHomeData();
            if (!esHome)
                return objReturn;

            //this.lstProyectosConsistentes = ConsultasComunes.ObtenerProyectosConsistentes(new FiltroBusquedaProyecto());
            this.lstProyectosAll = _consultasComunes.ObtenerProyectosConsistentes_new(new FiltroBusquedaProyecto(), 999);
            //this.lstProyectosAprobados = await ConsultasComunes.ObtenerProyectosConsistentes_home(new FiltroBusquedaProyecto(),6);
            objReturn.ProyectosAprobados = this.lstProyectosAprobados;

            #region RESUMEN CONSOLIDADOS

            //objReturn.CollectedMoney = ObtenerPresupuestoTotalSegunFiltroProyectos(filtros);//Recursos presupuestados para inversión SGR -- No se tienen valores del dinero presupuestado pues no hay cargue de los origenes de las agencias
            objReturn.ApprovedMoney = Math.Round(this.lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoFuenteRegalias));//Recursos aprobados SGR
            objReturn.ApprovedProjects = this.lstProyectosConsistentes.Count();//cantidad Proyectos consstentes
            objReturn.ApprovedMoneyTotal = Math.Round(this.lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoTodasLasFuentes));//Valor total de los recursos aprobados 

            #endregion

            #region GRAFICAS DATOS CONSOLIDADOS

            //objReturn.ProjectsPerSector = ObtenerProyectosPorSector(this.lstProyectosConsistentes);
            //objReturn.ResourcesPerSector = ObtenerRecursosPorSector(this.lstProyectosConsistentes);
            //objReturn.ResourcesPerRegion = ObtenerRecursosPorRegion(this.lstProyectosConsistentes);
            //objReturn.ResourcesPerDepartment = ObtenerRecursosPorDepartamento(this.lstProyectosConsistentes);


            #endregion

            #region PERIODOS

            // objReturn.Periods = new Shared.BllPeriods().GetPeriodsList();

            #endregion

            #region INFO GENERAL PARAMETRIZABLE

            //objReturn.Facts = ObtenerDatosDeInformacionNacional();
            //objReturn.DataCommonSections = WebSite.ConsultarValoresFuenteDeLosDatos();

            #endregion

            #region INFOGRAFICA


            objReturn.DepartmentProjectData = ObtenerListaDepartamentosHome();
            objReturn.MunicipioProjectData = ObtenerListaMunicipiosHome();


            #endregion

            objReturn.Status = true;

            return objReturn;
        }

        public ModelLocationData ObtenerDatosLocalizacionInicio(string location_id)
        {
            ModelLocationData objReturn = new ModelLocationData();
            if (string.IsNullOrEmpty(location_id))
                return objReturn;
            objReturn.location_id = location_id;
            //consultar si es municipio o departamento

            List<string> codigo_filtro = new List<string>();
            codigo_filtro.Add(location_id);
            FiltroBusquedaProyecto filtro_busqueda = new FiltroBusquedaProyecto();

            List<EnteTerritorial> lstDepartamentos = ConsultasComunes.ObtenerDepartamentos(codigo_filtro);
            if (lstDepartamentos.Count > 0)
            {
                filtro_busqueda.CodigosDepartamentos = codigo_filtro;
                objReturn.tipo = "DEPARTAMENTO";
                objReturn.nomLocation = lstDepartamentos[0].NombreDepartamento;
            }
            else
            {
                List<EnteTerritorial> lstMunicipio = ConsultasComunes.ObtenerMunicipio(codigo_filtro);
                if (lstMunicipio.Count > 0)
                {
                    filtro_busqueda.CodigosMunicipios = codigo_filtro;
                    objReturn.tipo = "MUNICIPIO";
                    objReturn.parent_nombre = lstMunicipio[0].NombreDepartamento;
                    objReturn.parent_id = lstMunicipio[0].IdDepartamento;
                    objReturn.parent_tipo = "DEPARTAMENTO";
                    objReturn.nomLocation = lstMunicipio[0].NombreMunicipio;

                }
                else
                {
                    return objReturn;
                }
            }

            //this.lstProyectosConsistentes = ConsultasComunes.ObtenerProyectosConsistentes(filtro_busqueda);
            #region PROYECTOS_EN_EJECUCION
            List<int> codigo_estado = new List<int>();
            string key_estado_proy = Configuration["EstadoProyEjecucion"].ToString();
            if (!string.IsNullOrEmpty(key_estado_proy))
            {
                codigo_estado.Add(Int32.Parse(key_estado_proy));
            }

            filtro_busqueda.CodigosEstado = codigo_estado;
            this.lstProyectosAprobados = _consultasComunes.ObtenerProyectosConsistentes_new(filtro_busqueda, 999);
            objReturn.ProyectosEjecucion = this.lstProyectosAprobados;
            #endregion

            #region GENERAL
            objReturn.descLocation = objReturn.tipo;
            Modelos.Location.InfoLocationGen enc_aux = new Modelos.Location.InfoLocationGen();
            enc_aux = ObtenerInfoLocation(filtro_busqueda);
            if (enc_aux == null)
            {
                objReturn.Encabezado = new Modelos.Location.InfoLocationGen()
                {
                    urlImgXL = "",
                    IdMunicipio = "",
                    IdDepartamento = "",
                    Duracion = 0,
                    Costo = 0,
                    CantProyectos = 0
                };
            }
            else
            {
                objReturn.Encabezado = enc_aux;
            }


            #endregion

            #region TODOSPROYECTOS
            //seccion "Todos los proyectos"
            objReturn.ProjectsPerEstado = ObtenerProyectosPorEstado(filtro_busqueda);

            #endregion

            #region FILTROS
            //habilitar en caso de no usarse web api, sino carga directa desde el controlador
            //objReturn.Filtros = addFiltroProyectos();
            #endregion

            #region PROYXSECTOR
            objReturn.ProjectsPerSectorGroup = ObtenerProyectosPorSectorGroup(filtro_busqueda);
            //objReturn.nomLocation = "MUNICIPIO";
            if (objReturn.ProjectsPerSectorGroup.Count > 0)
            {
                objReturn.sectorPrincipal = objReturn.ProjectsPerSectorGroup[0].labelGroup;
            }


            #endregion

            objReturn.Status = true;

            return objReturn;
        }

        public ModelLocationData ObtenerDatosLocalizacionSector(string sector_id)
        {
            ModelLocationData objReturn = new ModelLocationData();
            if (string.IsNullOrEmpty(sector_id))
                return objReturn;
            objReturn.location_id = sector_id;
            //consultar si es municipio o departamento
            List<string> codigo_filtro = new List<string>();
            codigo_filtro.Add(sector_id.Trim().ToUpper());
            FiltroBusquedaProyecto filtro_busqueda = new FiltroBusquedaProyecto();
            List<Modelos.Comunes.Departamento> lstDepartamentos = ConsultasComunes.ObtenerDepartamentosPorSectores(codigo_filtro);
            lstDepartamentos.Add(new Modelos.Comunes.Departamento { IdDepartamento = "0", NombreDepartamento = "Proyectos Nacionales" });
            if (sector_id != null)
            {
                //filtro_busqueda.CodigosSector = codigo_filtro;
                objReturn.tipo = "SECTOR";
                //objReturn.nomLocation = sector_id;
            }
            #region PROYECTOS_EN_EJECUCION
            List<int> codigo_estado = new List<int>();
            string key_estado_proy = Configuration["EstadoProyEjecucion"].ToString();
            if (!string.IsNullOrEmpty(key_estado_proy))
            {
                codigo_estado.Add(Int32.Parse(key_estado_proy));
            }
            filtro_busqueda.CodigosEstado = codigo_estado;
            lstProyectosAprobados = _consultasComunes.ObtenerProyectosConsistentesPorSectores(codigo_filtro, filtro_busqueda, 999);
            objReturn.ProyectosEjecucion = lstProyectosAprobados;
            #endregion
            #region GENERAL
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

            #region FILTROS
            //habilitar en caso de no usarse web api, sino carga directa desde el controlador
            //objReturn.Filtros = addFiltroProyectos();
            #endregion

            #region PROYXSECTOR
            objReturn.ProjectsPerSectorGroup = ObtenerProyectosPorDepartamentoDadoSector(sector_id, lstDepartamentos);
            //var costoProyectoXDepartamentoDadoSector = ObtenerCostoProyectosPorDepartamentoDadoSector(sector_id);

            //objReturn.nomLocation = "MUNICIPIO";
            if (objReturn.ProjectsPerSectorGroup.Count > 0)
            {
                var departamentosXNumeroProyectosAprobadosYEjecucion = (from ppsg in objReturn.ProjectsPerSectorGroup
                                                                        where ppsg.label.ToUpper().Trim() == "EN EJECUCIÓN" || ppsg.label.ToUpper().Trim() == "APROBADO"
                                                                        group ppsg by ppsg.labelGroup into g
                                                                        select new
                                                                        {
                                                                            Dpto = g.Key,
                                                                            Total = g.Sum(x => x.rawValue)
                                                                        }).ToList().OrderByDescending(x => x.Total);
                if (departamentosXNumeroProyectosAprobadosYEjecucion.Any())
                {
                    var maxProy = departamentosXNumeroProyectosAprobadosYEjecucion.Max(y => y.Total);
                    var w = 0;
                    var totalreg = departamentosXNumeroProyectosAprobadosYEjecucion.Count();
                    //decimal totalInversion = 0;
                    objReturn.sectorPrincipal = string.Empty;
                    while (w < totalreg)
                    {
                        if (departamentosXNumeroProyectosAprobadosYEjecucion.ElementAt(w).Total >= maxProy)
                        {
                            objReturn.sectorPrincipal = objReturn.sectorPrincipal == string.Empty ? departamentosXNumeroProyectosAprobadosYEjecucion.ElementAt(w).Dpto : objReturn.sectorPrincipal + "," + departamentosXNumeroProyectosAprobadosYEjecucion.ElementAt(w).Dpto;
                        }
                        w++;
                    }
                    objReturn.CostoProyectosDpto = Math.Round(maxProy * 100 / departamentosXNumeroProyectosAprobadosYEjecucion.Sum(x => x.Total), 2).ToString(); ; //  Math.Round(((totalInversion / (costoProyectoXDepartamentoDadoSector.Sum(x => x.rawValue))) * 100), 2).ToString();
                }
                //else if (costoProyectoXDepartamentoDadoSector.Any())
                //{
                //  decimal totalInversion = 0;
                //  foreach (var cpdds in costoProyectoXDepartamentoDadoSector)
                //  {
                //    if (cpdds.rawValue > totalInversion)
                //    {
                //      totalInversion = cpdds.rawValue;
                //      objReturn.sectorPrincipal = cpdds.label;
                //    }
                //    else if (cpdds.rawValue > totalInversion)
                //    {
                //      objReturn.sectorPrincipal = objReturn.sectorPrincipal == string.Empty ? cpdds.label : objReturn.sectorPrincipal + " ," + objReturn.sectorPrincipal;
                //    }
                //  }
                //  objReturn.CostoProyectosDpto = Math.Round(((totalInversion / (costoProyectoXDepartamentoDadoSector.Sum(x => x.rawValue))) * 100), 2).ToString();
                //}
            }
            #endregion
            objReturn.Status = true;
            return objReturn;
        }

        /// <summary>
        /// Funcion que retorna únicamente los filtros correspondientes a proyectos
        /// </summary>
        /// <returns></returns>

        private List<ModelLocationData.cad_filtro> addFiltroProyectos()
        {
            //FILTROS ESPECÍFICOS DE PROYECTOS --- opcion carga directa desde la funcion de proyectos
            List<ModelLocationData.cad_filtro> listaFiltros = new List<ModelLocationData.cad_filtro>();
            ModelDataFilters DataFilters = new ModelDataFilters();
            BllSearchFilters SearchFilters = new BllSearchFilters();
            SearchFilters.ObtenerFiltrosEspecificosParaProyectos(DataFilters);
            DataFilters.Status = true;

            for (int i = 0; i < DataFilters.filters.Count; i++)
            {
                for (int j = 0; j < DataFilters.filters[i].items.Count; j++)
                {
                    ModelLocationData.cad_filtro filtro_new = new ModelLocationData.cad_filtro();
                    filtro_new.item_value = DataFilters.filters[i].items[j].value;
                    filtro_new.item_name = DataFilters.filters[i].items[j].name;
                    filtro_new.parameter = DataFilters.filters[i].parameter;
                    filtro_new.name = DataFilters.filters[i].name;
                    listaFiltros.Add(filtro_new);
                }

            }
            return listaFiltros;
        }

        //internal decimal ObtenerPresupuestoTotalSegunFiltroProyectos(FiltroBusquedaProyecto filtroProyectos)
        //{
        //    FiltroBusquedaRecursos filtroRecursos = new FiltroBusquedaRecursos();
        //    if (filtroProyectos.CodigosRegion.Count > 0)
        //        filtroRecursos.CodigoRegion = filtroProyectos.CodigosRegion.First();
        //    if (filtroProyectos.CodigosDepartamentos.Count > 0)
        //        filtroRecursos.CodigoDepartamento = filtroProyectos.CodigosDepartamentos.First();
        //    if (filtroProyectos.CodigosMunicipios.Count > 0)
        //        filtroRecursos.CodigoMunicipio = filtroProyectos.CodigosMunicipios.First();
        //    filtroRecursos.Periodos = filtroProyectos.fechasEjecucion;

        //    return Convert.ToDecimal(RepositorioRecursos.ObtenerPresupuestoPorRegionPorFiltros(filtroRecursos).Sum(p => p.ValorPresupuesto));
        //}

        #region INFOGRAFICA

        internal static List<ConsolidateRegionsProjects> ObtenerInfograficoPorRegiones(List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> listProyectos)
        {

            List<ConsolidateRegionsProjects> objReturn = new List<ConsolidateRegionsProjects>();

            var ProjectsPerSectorQuery = (from proyecto in listProyectos
                                          join pxe in DataModel.ProyectoXEntidadTerritorials
                                              on proyecto.IdProyecto equals pxe.IdProyecto
                                          join region in DataModel.EnteTerritorials
                                              on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                          select new
                                          {
                                              projectId = proyecto.IdProyecto,
                                              regionId = region.IdRegion,
                                              approvedMoney = Math.Round(proyecto.VlrTotalProyectoFuenteRegalias),
                                              approvedTotalMoney = Math.Round(proyecto.VlrTotalProyectoTodasLasFuentes),
                                          }).Distinct().GroupBy(a => a.regionId).Select(b =>
                                       new ConsolidateRegionsProjects
                                       {
                                           regionId = b.Key.Trim(),
                                           approvedMoney = Math.Round(b.Sum(c => (decimal)c.approvedMoney)),
                                           approvedTotalMoney = Math.Round(b.Sum(d => (decimal)d.approvedTotalMoney)),
                                           projectNumber = b.Select(e => e.projectId).Count()
                                       }).Distinct(new PredicateEqualityComparer<ConsolidateRegionsProjects>((x, y) => x.regionId == y.regionId));
            objReturn = ProjectsPerSectorQuery.ToList();
            System.Diagnostics.Trace.WriteLine("Obtenidos los infograficos de Regiones");

            return objReturn;
        }

        public static List<ConsolidatedDepartmentProjects> ObtenerInfograficoPorDepartamentos(List<PlataformaTransparencia.Infrastructura.DataModels.Proyecto> listProyectos)
        {
            List<ConsolidatedDepartmentProjects> objReturn = new List<ConsolidatedDepartmentProjects>();

            var ProjectsPerSectorQuery = (from proyecto in listProyectos
                                          join pxe in DataModel.ProyectoXEntidadTerritorials
                                              on proyecto.IdProyecto equals pxe.IdProyecto
                                          join departamento in ConsultasComunes.ObtenerDepartamentos(null)
                                             on pxe.IdDepartamento.Trim() equals departamento.IdDepartamento.Trim()
                                          group proyecto by new
                                          {
                                              departamento.IdDepartamento,
                                              departamento.NombreDepartamento
                                          } into g
                                          select new ConsolidatedDepartmentProjects
                                          {
                                              departmentId = g.Key.IdDepartamento.ToString().Trim(),
                                              nombre = g.Key.NombreDepartamento.ToString(),
                                              approvedMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<Infrastructura.DataModels.Proyecto>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoFuenteRegalias)),
                                              approvedTotalMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<Infrastructura.DataModels.Proyecto>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoTodasLasFuentes)),
                                              projectNumber = g.Distinct(new PredicateEqualityComparer<Infrastructura.DataModels.Proyecto>((x, y) => x.IdProyecto == y.IdProyecto)).Count()
                                          }).Distinct(new PredicateEqualityComparer<ConsolidatedDepartmentProjects>((x, y) => (x.departmentId == y.departmentId)));

            objReturn = ProjectsPerSectorQuery.ToList();

            System.Diagnostics.Trace.WriteLine("Obtenidos los infograficos de departamentos");
            return objReturn;
        }

        public static List<ConsolidatedDepartmentProjects> ObtenerListaDepartamentosHome()
        {
            List<ConsolidatedDepartmentProjects> objReturn = new List<ConsolidatedDepartmentProjects>();

            var result = DataModel.ObtenerListaDepartamentosHome().ToList();

            var dep_query = (from Departamento in result
                             select new ConsolidatedDepartmentProjects
                             {
                                 departmentId = Departamento.IdDepartamento.ToString().Trim(),
                                 nombre = Departamento.NombreDepartamento.ToString(),
                                 url_img_peq = Departamento.UrlImagePequenia.ToString(),
                                 approvedMoney = Math.Round((decimal)Departamento.VlrTotalProyectoFuenteRegalias),
                                 approvedTotalMoney = Math.Round((decimal)Departamento.VlrTotalProyectoTodasLasFuentes),
                                 projectNumber = (int)Departamento.projectNumber
                             });

            if (dep_query.Count() > 0)
            {
                objReturn = dep_query.ToList();
            }

            return objReturn;
        }

        public static List<ProyectoConsolidadoPorMunicipio> ObtenerListaMunicipiosHome()
        {
            List<ProyectoConsolidadoPorMunicipio> objReturn = new List<ProyectoConsolidadoPorMunicipio>();

            var result = DataModel.ObtenerListaMunicipiosHome().ToList();

            var dep_query = (from municipio in result
                             select new ProyectoConsolidadoPorMunicipio
                             {
                                 MunicipioId = municipio.IdMunicipio.ToString().Trim(),
                                 nombre = municipio.NombreMunicipio.ToString(),
                                 url_img_peq = municipio.UrlImagePequenia.ToString(),
                                 approvedMoney = Math.Round((decimal)municipio.VlrTotalProyectoFuenteRegalias),
                                 approvedTotalMoney = Math.Round((decimal)municipio.VlrTotalProyectoTodasLasFuentes),
                                 projectNumber = (int)municipio.projectNumber
                             });

            if (dep_query.Count() > 0)
            {
                objReturn = dep_query.ToList();
            }

            return objReturn;
        }



        public static List<ConsolidatedDepartmentProjects> ObtenerInfograficoPorDepartamentosAprobados(List<InfoProyectos> listProyectos)
        {
            List<ConsolidatedDepartmentProjects> objReturn = new List<ConsolidatedDepartmentProjects>();

            //Obtiene valores de proyectos por region 
            var dep_query = (from departamento in ConsultasComunes.ObtenerDepartamentos(null)
                             join galeria in DataModel.VwGaleriaEntidadesTerritorialesDepartamentos
                             on departamento.IdDepartamento equals galeria.IdDepartamento
                             //.Where(w => w.IdDepartamento == departamento.IdDepartamento).DefaultIfEmpty()
                             select new
                             {
                                 departamento.IdDepartamento,
                                 departamento.NombreDepartamento,
                                 galeria.UrlImagePequenia
                             });

            var ProjectsPerSectorQuery = (from proyecto in listProyectos
                                          join pxe in DataModel.ProyectoXEntidadTerritorials
                                              on proyecto.IdProyecto equals pxe.IdProyecto
                                          join departamento in dep_query
                                             on pxe.IdDepartamento.Trim() equals departamento.IdDepartamento.Trim()
                                          group proyecto by new
                                          {
                                              departamento.IdDepartamento,
                                              departamento.NombreDepartamento,
                                              departamento.UrlImagePequenia
                                          } into g
                                          select new ConsolidatedDepartmentProjects
                                          {
                                              departmentId = g.Key.IdDepartamento.ToString().Trim(),
                                              nombre = g.Key.NombreDepartamento.ToString(),
                                              url_img_peq = g.Key.UrlImagePequenia.ToString(),
                                              approvedMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoFuenteRegalias)),
                                              approvedTotalMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoTodasLasFuentes)),
                                              projectNumber = g.Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => x.IdProyecto == y.IdProyecto)).Count()
                                          }).Distinct(new PredicateEqualityComparer<ConsolidatedDepartmentProjects>((x, y) => (x.departmentId == y.departmentId)));
            //});
            if (ProjectsPerSectorQuery.Count() > 10)
            {
                objReturn = ProjectsPerSectorQuery.ToList().GetRange(0, 10);
            }
            else
            {
                objReturn = ProjectsPerSectorQuery.ToList();
            }

            System.Diagnostics.Trace.WriteLine("Obtenidos los infograficos de departamentos");
            return objReturn;
        }

        public static List<ProyectoConsolidadoPorMunicipio> ObtenerInfograficoPorMunicipio(List<Infrastructura.DataModels.Proyecto> listProyectos, FiltroBusquedaProyecto filtro)
        {
            List<ProyectoConsolidadoPorMunicipio> objReturn = new List<ProyectoConsolidadoPorMunicipio>();

            //Obtiene valores de proyectos por region 
            var ProjectsPerSectorQuery = (from proyecto in listProyectos
                                          join pxe in DataModel.ProyectoXEntidadTerritorials
                                              on proyecto.IdProyecto equals pxe.IdProyecto
                                          join municipio in ConsultasComunes.ObtenerMunicipio(null)
                                             on pxe.IdMunicipio.Trim() equals municipio.IdMunicipio.Trim()
                                          where (filtro.CodigosDepartamentos.Contains(pxe.IdDepartamento) || filtro.CodigosDepartamentos.Count == 0)
                                          //group proyecto by municipio.IdMunicipio into g
                                          group proyecto by new
                                          {
                                              municipio.IdMunicipio,
                                              municipio.NombreMunicipio
                                          } into g

                                          select new ProyectoConsolidadoPorMunicipio
                                          {
                                              MunicipioId = g.Key.IdMunicipio.ToString().Trim(),
                                              nombre = g.Key.NombreMunicipio.ToString().Trim(),
                                              approvedMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<Infrastructura.DataModels.Proyecto>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoFuenteRegalias)),
                                              approvedTotalMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<Infrastructura.DataModels.Proyecto>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoTodasLasFuentes)),
                                              projectNumber = g.Distinct(new PredicateEqualityComparer<Infrastructura.DataModels.Proyecto>((x, y) => x.IdProyecto == y.IdProyecto)).Count()
                                          }).Distinct(new PredicateEqualityComparer<ProyectoConsolidadoPorMunicipio>((x, y) => (x.MunicipioId == y.MunicipioId)))
                                          ;

            objReturn = ProjectsPerSectorQuery.ToList();
            System.Diagnostics.Trace.WriteLine("Obtenidos los infograficos de municipios");
            return objReturn;
        }

        public static List<ProyectoConsolidadoPorMunicipio> ObtenerInfograficoPorMunicipioAprobados(List<InfoProyectos> listProyectos, FiltroBusquedaProyecto filtro)
        {
            List<ProyectoConsolidadoPorMunicipio> objReturn = new List<ProyectoConsolidadoPorMunicipio>();

            var munic_query = (from municipio in ConsultasComunes.ObtenerMunicipio(null)
                               join galeria in DataModel.VwGaleriaEntidadesTerritorialesMunicipios
                               on municipio.IdMunicipio equals galeria.IdMunicipio
                               select new
                               {
                                   municipio.IdMunicipio,
                                   municipio.NombreMunicipio,
                                   galeria.UrlImagePequenia
                               });

            //Obtiene valores de proyectos por region 
            var ProjectsPerSectorQuery = (from proyecto in listProyectos
                                          join pxe in DataModel.ProyectoXEntidadTerritorials
                                              on proyecto.IdProyecto equals pxe.IdProyecto
                                          join municipio in munic_query
                                             on pxe.IdMunicipio.Trim() equals municipio.IdMunicipio.Trim()
                                          where (filtro.CodigosDepartamentos.Contains(pxe.IdDepartamento) || filtro.CodigosDepartamentos.Count == 0)
                                          //group proyecto by municipio.IdMunicipio into g
                                          group proyecto by new
                                          {
                                              municipio.IdMunicipio,
                                              municipio.NombreMunicipio,
                                              municipio.UrlImagePequenia
                                          } into g

                                          select new ProyectoConsolidadoPorMunicipio
                                          {
                                              MunicipioId = g.Key.IdMunicipio.ToString().Trim(),
                                              nombre = g.Key.NombreMunicipio.ToString().Trim(),
                                              url_img_peq = g.Key.UrlImagePequenia.ToString(),
                                              approvedMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoFuenteRegalias)),
                                              approvedTotalMoney = Math.Round(g.Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => x.IdProyecto == y.IdProyecto)).Sum(p => p.VlrTotalProyectoTodasLasFuentes)),
                                              projectNumber = g.Distinct(new PredicateEqualityComparer<InfoProyectos>((x, y) => x.IdProyecto == y.IdProyecto)).Count()
                                          }).Distinct(new PredicateEqualityComparer<ProyectoConsolidadoPorMunicipio>((x, y) => (x.MunicipioId == y.MunicipioId)))
                                          ;

            if (ProjectsPerSectorQuery.Count() > 10)
            {
                objReturn = ProjectsPerSectorQuery.ToList().GetRange(0, 10);
            }
            else
            {
                objReturn = ProjectsPerSectorQuery.ToList();
            }


            System.Diagnostics.Trace.WriteLine("Obtenidos los infograficos de municipios");
            return objReturn;
        }


        #endregion

        #region INFO GENERAL PARAMETRIZABLE

        //public List<Fact> ObtenerDatosDeInformacionNacional()
        //{
        //    List<Fact> FactsList = new List<Fact>();
        //    try {

        //        ///Query que obtiene los datos de hechos
        //        ///Genera el listado de Facts
        //        var FactsListQuery = (from facts in DataModel.ResumenEstadisticasNacionals
        //                              select new {
        //                                  icon = facts.RutaIcono,
        //                                  query = facts.ConsultaSQL,
        //                                  phrase = facts.Descripcion,
        //                                  seccion = facts.SeccionAplicativo

        //                              });
        //        ///para cada ítem, se genera la consulta y el resultado
        //        foreach (var item in FactsListQuery) {
        //            List<string> query = new List<string>();
        //            ///Variable para el query
        //            string returnedQueryValue = string.Empty;
        //            ///Si el query no tiene data, permite pasar sin realizar consulta
        //            if (!string.IsNullOrEmpty(item.query)) {                            ///ejecución del query
        //                query = DataModel.Database.SqlQuery<string>(item.query).ToList();
        //            }
        //            else {
        //                query = new List<string>();
        //            }
        //            ///si el query retorna datos se obtiene la consulta
        //            ///Observación: La consulta debe retornar siempre una cantidad y debe llegar en 
        //            ///string. en el query se debe utilizar la sentencia CONVERT().
        //            if (query.Count() > 0) {
        //                returnedQueryValue = query.First().ToString();
        //            }

        //            FactsList.Add(
        //                       new Fact {
        //                           icon = item.icon,
        //                           phrase = item.phrase.Replace(CommonConstants.ReplaceTokenFactQuery, returnedQueryValue),
        //                           title = item.seccion.Split('_').Length > 1 ? item.seccion.Split('_')[0] : item.seccion,
        //                           subTipo = item.seccion.Split('_').Length > 1 ? item.seccion.Split('_')[1] : null
        //                       }
        //                    );
        //        }
        //    }
        //    catch (Exception ex) {
        //        LogHelper.GenerateLog(ex);
        //    }
        //    System.Diagnostics.Trace.WriteLine("Obtenida los Datos De Informacion Nacional");
        //    return FactsList;
        //}

        #endregion

        #region GRAFICAS DATOS CONSOLIDADOS

        public List<InfoResourcesPerDepartment> ObtenerRecursosPorDepartamento(List<DataModels.Proyecto> listProyectos)
        {
            List<InfoResourcesPerDepartment> objReturn = new List<InfoResourcesPerDepartment>();

            //Obtiene valores de proyectos por region
            var ProjectsPerSectorQuery = (from proyecto in listProyectos
                                          join pxe in DataModel.ProyectoXEntidadTerritorials
                                              on proyecto.IdProyecto equals pxe.IdProyecto
                                          join ent in DataModel.EnteTerritorials on
                                          pxe.IdDepartamento equals ent.IdDepartamento
                                          where ent.Tipo == ArchivoRecursosNegocioMapaInversiones.nombreTipoEnteRepresentaDpto
                                          join departamento in ConsultasComunes.ObtenerDepartamentos(null)
                                             on pxe.IdDepartamento.Trim() equals departamento.IdDepartamento.Trim()
                                             into JoinPxeDpto
                                          from departamento in JoinPxeDpto.DefaultIfEmpty()
                                          group proyecto by departamento.NombreDepartamento into g
                                          select new InfoResourcesPerDepartment
                                          {
                                              label = (g.Key.Trim()),
                                              rawValue = Math.Round(g.Distinct().Sum(p => p.VlrTotalProyectoFuenteRegalias)),
                                              value = string.Empty
                                              //value = ManejoPorcentajes.ValorPorcentajeString(sumaTotal, g.Distinct().Sum(p => p.VlrTotalProyectoFuenteRegalias))
                                          }).ToList();


            //orderby order.Products.Max(p=>p.SequenceNumber)

            //Obtiene el valor total de fuente regalias con el fin de tener el dato para los porcentajes
            decimal sumaTotal = Convert.ToDecimal(ProjectsPerSectorQuery.Sum(p => p.rawValue));
            foreach (var registro in ProjectsPerSectorQuery)
            {
                registro.value = ManejoPorcentajes.ValorPorcentajeString(sumaTotal, registro.rawValue);
            }

            var IdDepartamentos = (from departamentos in DataModel.EnteTerritorials
                                   where departamentos.Tipo == "DEPARTAMENTO"
                                   select departamentos.NombreDepartamento).ToList();
            List<string> IdListado = new List<string>();
            IdListado = ProjectsPerSectorQuery.Select(d => d.label).ToList();
            foreach (var item in IdDepartamentos)
            {
                if (!(IdListado.Contains(item)))
                {
                    ProjectsPerSectorQuery.Add(
                            new InfoResourcesPerDepartment
                            {
                                label = item,
                                rawValue = 0,
                                value = "0"

                            }
                        );
                }
            }

            objReturn = ProjectsPerSectorQuery.OrderBy(p => p.label).ToList();
            System.Diagnostics.Trace.WriteLine("Obtenidos los recursos Por Dpto.");
            return objReturn;
        }

        public List<InfoResourcesPerRegion> ObtenerRecursosPorRegion(List<DataModels.Proyecto> listProyectos)
        {
            List<InfoResourcesPerRegion> objReturn = new List<InfoResourcesPerRegion>();

            //Obtiene valores de proyectos por region 
            var ProjectsPerSectorQuery = (from proyecto in listProyectos
                                          join pxe in DataModel.ProyectoXEntidadTerritorials
                                              on proyecto.IdProyecto equals pxe.IdProyecto
                                          join region in DataModel.EnteTerritorials
                                              on new { idDepartamento = pxe.IdDepartamento.Trim(), idMunicipio = pxe.IdMunicipio.Trim() } equals new { idDepartamento = region.IdDepartamento.Trim(), idMunicipio = region.IdMunicipio.Trim() }
                                          group proyecto by region.NombreRegion into g
                                          select new InfoResourcesPerRegion
                                          {
                                              label = g.Key.Trim(),
                                              rawValue = Math.Round(Convert.ToDecimal(g.Distinct().Sum(p => p.VlrTotalProyectoFuenteRegalias))),
                                              value = string.Empty//Aqui va el porccentaje como string
                                                                  //value = ManejoPorcentajes.ValorPorcentajeString(sumaTotal, g.Distinct().Sum(p => p.VlrTotalProyectoFuenteRegalias))
                                          }).ToList();


            decimal sumaTotal = Convert.ToDecimal(ProjectsPerSectorQuery.Sum(p => p.rawValue));
            //Se muestra bien su hay más de un dato o no se muestra si no hay datos
            //CMC: o > 1 o = 0  significa siempre ya que no puede haber negativos
            //if (ProjectsPerSectorQuery.Count > 1 || ProjectsPerSectorQuery.Count == 0)
            //{
            foreach (var registro in ProjectsPerSectorQuery)
            {
                registro.value = ManejoPorcentajes.ValorPorcentajeString(sumaTotal, registro.rawValue);
            }

            objReturn = ProjectsPerSectorQuery;
            System.Diagnostics.Trace.WriteLine("Obtenidos los recursos Por Region");

            return objReturn;
        }

        public List<InfoResourcesPerSector> ObtenerRecursosPorSector(List<DataModels.Proyecto> listProyectos)
        {
            List<InfoResourcesPerSector> objReturn = new List<InfoResourcesPerSector>();

            //Obtiene valores de proyectos por sector 
            var ProjectsPerSectorQuery = (from projects in listProyectos
                                          join sectores in DataModel.Sectors on
                                             projects.IdSector equals sectores.IdSector
                                          group projects by sectores.NombreSector into g
                                          select new InfoResourcesPerSector
                                          {
                                              label = g.Key.Trim(),
                                              rawValue = Math.Round(Convert.ToDecimal(g.Sum(p => p.VlrTotalProyectoFuenteRegalias))),
                                              value = string.Empty
                                              //value = ManejoPorcentajes.ValorPorcentajeString(sumaTotal, g.Sum(p => p.VlrTotalProyectoFuenteRegalias))
                                          }).ToList();
            //Obtiene el valor total de fuente regalias con el fin de tener el dato para los porcentajes
            decimal sumaTotal = Convert.ToDecimal(ProjectsPerSectorQuery.Sum(p => p.rawValue));

            //Se muestra bien su hay más de un dato o no se muestra si no hay datos
            //if (ProjectsPerSectorQuery.Count > 1 || ProjectsPerSectorQuery.Count == 0) // O sea siempre
            //{
            foreach (var item in ProjectsPerSectorQuery)
            {
                item.value = ManejoPorcentajes.ValorPorcentajeString(sumaTotal, item.rawValue);
                decimal valorPorcentaje = Convert.ToDecimal(item.value.Replace("%", string.Empty).Trim());
                if (valorPorcentaje > Convert.ToDecimal(ArchivoRecursosNegocioMapaInversiones.PorcentajeProyectosPorSectorMostrtar))
                {
                    objReturn.Add(item);
                }
            }
            System.Diagnostics.Trace.WriteLine("Obtenenidos los recursos Por Sector");
            return objReturn;

        }

        public List<InfoProjectPerSector> ObtenerProyectosPorSector(List<DataModels.Proyecto> listProyectos)
        {
            List<InfoProjectPerSector> objReturn = new List<InfoProjectPerSector>();
            //Obtiene el número total de proyectos con el fin de tener el dato para los porcentajes
            int cantidadTotalProyectos = listProyectos.Count();


            //Obtiene cantidades total de proyectos por sector 
            var ProjectsPerSectorQuery = from projects in listProyectos
                                         join sectores in DataModel.Sectors on
                                            projects.IdSector equals sectores.IdSector
                                         group sectores by sectores.NombreSector into g
                                         select new InfoProjectPerSector
                                         {
                                             label = g.Key.Trim(),
                                             rawValue = g.Count(),
                                             value = ManejoPorcentajes.ValorPorcentajeString(cantidadTotalProyectos, g.Count())
                                         };

            // Descartar los menores al porcertaje dado
            foreach (var item in ProjectsPerSectorQuery.OrderBy(p => p.label))
            {
                decimal valorPorcentaje = Convert.ToDecimal(item.value.Replace("%", string.Empty).Trim());
                if (valorPorcentaje > Convert.ToDecimal(ArchivoRecursosNegocioMapaInversiones.PorcentajeProyectosPorSectorMostrtar))
                {
                    objReturn.Add(item);
                }
            }

            System.Diagnostics.Trace.WriteLine("Obtenenidos los Proyectos Por Sector");
            return objReturn;
        }

        #endregion


        public List<InfoProjectsPerEstado> ObtenerProyectosPorEstado(FiltroBusquedaProyecto filtros)
        {
            List<InfoProjectsPerEstado> objReturn = new List<InfoProjectsPerEstado>();
            if (filtros.CodigosDepartamentos.Count > 0)
            {
                //departamentos
                var ProjectsPerEstadoQuery = (from projects in DataModel.VwEstadoProyectosDeptoInvs
                                              where ((filtros.CodigosDepartamentos.Contains(projects.IdDepartamento) && (filtros.CodigosMunicipios.Count == 0)))
                                              select new InfoProjectsPerEstado
                                              {
                                                  label = projects.NombreEstado,
                                                  rawValue = ((decimal)projects.NumeroProyectos),
                                                  value = ((decimal)projects.NumeroProyectos).ToString()
                                              });
                objReturn = ProjectsPerEstadoQuery.ToList();
            }
            else
            {
                //municipios
                var ProjectsPerEstadoQuery = (from projects in DataModel.VwEstadoProyectosInvs
                                              where ((filtros.CodigosMunicipios.Contains(projects.IdMunicipio) && (filtros.CodigosDepartamentos.Count == 0)))
                                              select new InfoProjectsPerEstado
                                              {
                                                  label = projects.NombreEstado,
                                                  rawValue = ((decimal)projects.NumeroProyectos),
                                                  value = ((decimal)projects.NumeroProyectos).ToString()
                                              });

                objReturn = ProjectsPerEstadoQuery.ToList();
            }

            return objReturn;

        }

        public List<InfoProjectsPerEstado> ObtenerProyectosEstadoPorSector(string sectorId)
        {
            List<InfoProjectsPerEstado> objReturn = new();

            var datosEstadoSector = (from proyecto in DataModel.Proyectos
                                     join historiaEstado in DataModel.HistoriaEstados on proyecto.IdProyecto equals historiaEstado.IdProyecto
                                     join estado in DataModel.Estados on historiaEstado.IdEstado equals estado.IdEstado
                                     where proyecto.IdSector.ToString() == sectorId
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

        public List<InfoProjectsPerEstado> ObtenerProyectosPorEstadoSector(FiltroBusquedaProyecto filtros)
        {
            List<InfoProjectsPerEstado> objReturn = new List<InfoProjectsPerEstado>();

            if (filtros.CodigosDepartamentos.Count > 0)
            {
                //departamentos
                var ProjectsPerEstadoQuery = (from projects in DataModel.VwEstadoProyectosDeptoInvs
                                              where ((filtros.CodigosDepartamentos.Contains(projects.IdDepartamento) && (filtros.CodigosMunicipios.Count == 0)))
                                              select new InfoProjectsPerEstado
                                              {
                                                  label = projects.NombreEstado,
                                                  rawValue = ((decimal)projects.NumeroProyectos),
                                                  value = ((decimal)projects.NumeroProyectos).ToString()
                                              });
                objReturn = ProjectsPerEstadoQuery.ToList();
            }
            else
            {
                //municipios
                var ProjectsPerEstadoQuery = (from projects in DataModel.VwEstadoProyectosInvs
                                              where ((filtros.CodigosMunicipios.Contains(projects.IdMunicipio) && (filtros.CodigosDepartamentos.Count == 0)))
                                              select new InfoProjectsPerEstado
                                              {
                                                  label = projects.NombreEstado,
                                                  rawValue = ((decimal)projects.NumeroProyectos),
                                                  value = ((decimal)projects.NumeroProyectos).ToString()
                                              });

                objReturn = ProjectsPerEstadoQuery.ToList();
            }

            return objReturn;

        }

        public List<InfoProjectPerSector> ObtenerProyectosPorDepartamentoDadoSector(string sectorId, List<Modelos.Comunes.Departamento> lstDepartamentos)
        {
            List<InfoProjectPerSector> objReturn = new List<InfoProjectPerSector>();
            List<InfoProjectPerSector> objReturnTemp = new List<InfoProjectPerSector>();

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
                                                  proyEstadoIdDpto.IdProyecto
                                              }).ToArray();
            var numProyectosXEstadoNombreDpto = (from proyEstadoNombreDpto in proyectosXEstadoNombreDpto
                                                 group proyEstadoNombreDpto by new { proyEstadoNombreDpto.NombreDepartamento, proyEstadoNombreDpto.NombreEstado } into g
                                                 select new InfoProjectPerSector
                                                 {
                                                     label = g.Key.NombreEstado,
                                                     labelGroup = g.Key.NombreDepartamento,
                                                     rawValue = g.Count(),
                                                     value = g.Count().ToString()
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
            objReturn = objReturnTemp;

            return objReturn;
        }

        public List<InfoProjectPerSector> ObtenerCostoProyectosPorDepartamentoDadoSector(string sectorId)
        {
            List<InfoProjectPerSector> objReturn = new List<InfoProjectPerSector>();
            List<InfoProjectPerSector> objReturnTemp = new List<InfoProjectPerSector>();

            var costoProjectsPerSectoresQuery = (from proyecto in DataModel.Proyectos
                                                 join proyectoEntidadTerritorial in DataModel.ProyectoXEntidadTerritorials on proyecto.IdProyecto equals proyectoEntidadTerritorial.IdProyecto
                                                 join enteTerritorial in DataModel.EnteTerritorials on proyectoEntidadTerritorial.IdDepartamento equals enteTerritorial.IdDepartamento
                                                 where enteTerritorial.IdMunicipio == proyectoEntidadTerritorial.IdMunicipio && proyecto.IdSector.ToString() == sectorId && proyecto.VlrTotalProyectoTodasLasFuentes > 0
                                                 select new
                                                 {
                                                     Departamento = enteTerritorial.NombreDepartamento,
                                                     CostoProyecto = (proyecto.VlrTotalProyectoTodasLasFuentes / 1000000),
                                                     proyecto.IdProyecto
                                                 }).Distinct().ToList();
            var costoUnitarioProyecto = (from proyecto in costoProjectsPerSectoresQuery
                                         group proyecto by proyecto.IdProyecto into g
                                         select new
                                         {
                                             IdProyecto = g.Key,
                                             CostoProyecto = g.Average(x => x.CostoProyecto),
                                             NumeroBeneficiarios = g.Count()
                                         }).Distinct().ToList();
            var costoUnitarioProyectoDpto = (from cup in costoUnitarioProyecto
                                             join cppsq in costoProjectsPerSectoresQuery on cup.IdProyecto equals cppsq.IdProyecto
                                             select new
                                             {
                                                 cppsq.Departamento,
                                                 CostoProyecto = (decimal)cup.CostoProyecto / cup.NumeroBeneficiarios
                                             }).ToArray();

            var rta = (from cppsq in costoUnitarioProyectoDpto
                       group cppsq by cppsq.Departamento into g
                       select new InfoProjectPerSector
                       {
                           label = g.Key,
                           rawValue = g.Sum(x => x.CostoProyecto),
                           value = (g.Sum(y => y.CostoProyecto)).ToString()
                       }).ToList();
            #region Cálculo del costo para proyectos Nacionales
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

            List<int> proyectosSectorSinEnteTerritorial = new List<int>();
            for (int j = 0; j < todosProyectosSector.Length; j++)
            {
                if (!proyectosSectorConEnteTerritorial.Contains(todosProyectosSector[j].IdProyecto))
                    proyectosSectorSinEnteTerritorial.Add(todosProyectosSector[j].IdProyecto);
            }

            var costoProyectosNacionales = (from proyecto in DataModel.Proyectos
                                            join proyectoSectorNacional in proyectosSectorSinEnteTerritorial on proyecto.IdProyecto equals proyectoSectorNacional
                                            select new
                                            {
                                                Departamento = "Proyectos Nacionales",
                                                CostoProyecto = proyecto.VlrTotalProyectoTodasLasFuentes
                                            }).ToArray().Sum(x => x.CostoProyecto) / 1000000;

            #endregion Cálculo del costo para proyectos Nacionales

            if (costoProyectosNacionales > 0) rta.Add(new InfoProjectPerSector { label = "Proyectos Nacionales", rawValue = costoProyectosNacionales, value = costoProyectosNacionales.ToString() });
            objReturn = rta;

            return objReturn;
        }



        public List<InfoProjectPerSector> ObtenerProyectosPorSectorGroup(FiltroBusquedaProyecto filtros)
        {
            List<InfoProjectPerSector> objReturn = new List<InfoProjectPerSector>();

            if (filtros.CodigosDepartamentos.Count > 0)
            {
                //departamento
                var ProjectsPerSectoresQuery = (from sectores in DataModel.VwSectorProyectosDeptoInvs
                                                where ((filtros.CodigosDepartamentos.Contains(sectores.IdDepartamento) && (filtros.CodigosMunicipios.Count == 0)))
                                                orderby sectores.NumeroProyectosSect descending
                                                select new InfoProjectPerSector
                                                {
                                                    label = sectores.NombreEstado,
                                                    labelGroup = sectores.NombreSector,
                                                    rawValue = ((decimal)sectores.NumeroProyectosSect),
                                                    value = (sectores.NumeroProyectosSect).ToString()
                                                });

                objReturn = ProjectsPerSectoresQuery.ToList();

            }
            else
            {
                //municipio
                var ProjectsPerSectoresQuery = (from sectores in DataModel.VwSectorProyectosInvs
                                                where (filtros.CodigosMunicipios.Contains(sectores.IdMunicipio) && (filtros.CodigosDepartamentos.Count == 0))
                                                orderby sectores.NumeroProyectosSect descending
                                                select new InfoProjectPerSector
                                                {
                                                    label = sectores.NombreEstado,
                                                    labelGroup = sectores.NombreSector,
                                                    rawValue = ((decimal)sectores.NumeroProyectosSect),
                                                    value = (sectores.NumeroProyectosSect).ToString()
                                                });
                objReturn = ProjectsPerSectoresQuery.ToList();
            }

            return objReturn;

        }

        public InfoLocationSectorGen ObtenerInfoLocationSectores(string sector)
        {
            //TO:DO Quedé aquí, falta hacer ajustes
            InfoLocationSectorGen objReturn = new InfoLocationSectorGen();

            var queryInfo = (from perfilSector in DataModel.VwInformacionGeneralPerfilSectors
                             where perfilSector.IdSector.ToString() == sector
                             select new InfoLocationSectorGen
                             {
                                 nomSector = perfilSector.NombreSector,
                                 Costo = Math.Round((decimal)perfilSector.ValorPromedioProyecto, 2),
                                 Duracion = Math.Round((decimal)perfilSector.DuracionPromedioProyectos, 2),
                                 CantProyectos = Math.Round((decimal)perfilSector.NumeroProyectos, 2),
                             }).FirstOrDefault();
            objReturn = queryInfo;

            return objReturn;
        }

        public Modelos.Location.InfoLocationGen ObtenerInfoLocation(FiltroBusquedaProyecto filtros)
        {
            Modelos.Location.InfoLocationGen objReturn = new Modelos.Location.InfoLocationGen();
            if (filtros.CodigosDepartamentos.Count > 0)
            {

                var queryInfo = (from perfil in DataModel.VwInformacionGeneralPerfilLocalizacionDeptos
                                 from galeria in DataModel.VwGaleriaEntidadesTerritorialesDepartamentos
                                 .Where(w => w.IdDepartamento == perfil.IdDepartamento).DefaultIfEmpty()
                                 where ((filtros.CodigosDepartamentos.Contains(perfil.IdDepartamento)))
                                 select new Modelos.Location.InfoLocationGen
                                 {
                                     IdDepartamento = perfil.IdDepartamento,
                                     Costo = Math.Round((decimal)perfil.ValorPromedioProyecto, 2),
                                     Duracion = Math.Round((decimal)perfil.DuracionPromedioProyectos, 2),
                                     CantProyectos = Math.Round((decimal)perfil.NumeroProyectos, 2),
                                     urlImgXL = galeria.UrlImageGrande
                                 }).FirstOrDefault();
                objReturn = queryInfo;
            }
            else if (filtros.CodigosMunicipios.Count > 0)
            {

                var queryInfo = (from perfil in DataModel.VwInformacionGeneralPerfilLocalizacions
                                 from galeria in DataModel.VwGaleriaEntidadesTerritorialesMunicipios
                                 .Where(w => w.IdMunicipio == perfil.IdMunicipio).DefaultIfEmpty()
                                 where (filtros.CodigosMunicipios.Contains(perfil.IdMunicipio))
                                 select new Modelos.Location.InfoLocationGen
                                 {
                                     IdDepartamento = perfil.IdDepartamento,
                                     IdMunicipio = perfil.IdMunicipio,
                                     Costo = Math.Round((decimal)perfil.ValorPromedioProyecto, 2),
                                     Duracion = Math.Round((decimal)perfil.DuracionPromedioProyectos, 2),
                                     CantProyectos = Math.Round((decimal)perfil.NumeroProyectos, 2),
                                     urlImgXL = galeria.UrlImageGrande
                                 }).FirstOrDefault();
                objReturn = queryInfo;

            }
            return objReturn;
        }


        public ModelContratistaData ObtenerDatosContratista(string ruc)
        {
            ModelContratistaData objReturn = new ModelContratistaData();
            if (string.IsNullOrEmpty(ruc))
                return objReturn;
            objReturn.ruc = ruc;

            List<VwContratosPerfilContratistaSinPrograma> lstContratistas = ConsultasComunes.ObtenerDatosContratista(ruc);
            if (lstContratistas.Count > 0)
            {
                objReturn.nomContratista = lstContratistas[0].Contratista;
                objReturn.numContratos = lstContratistas[0].NumContratos;
                objReturn.valorContratos = lstContratistas[0].ValorTotalContratos;
            }

            //objReturn.Status = true;

            return objReturn;
        }

        public ModelContratistaData ObtenerDatosContratos()
        {
            ModelContratistaData objReturn = new ModelContratistaData();

            EncabezadoContratos lstContratistas = ConsultasComunes.ObtenerDatosContratos();

            // objReturn.nomContratista = lstContratistas[0].Contratista;
            objReturn.numContratos = lstContratistas.NumContratos;
            objReturn.valorContratos = lstContratistas.ValorTotalContratos;


            //objReturn.Status = true;

            objReturn.listEncabezadoContratosCancelados = ConsultasComunes.ObtenerDatosContratosCancelados();

            return objReturn;
        }

        public List<InfoProyectos> GetProyectosNacionales()
        {
            List<InfoProyectos> objReturn = new List<InfoProyectos>();
            objReturn = (from info in DataModel.VwProyectosAprobadosInvs
                         join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                         where info.VlrTotalProyectoFuenteRegalias > 0 && info.TipoProyecto == "NACIONAL"
                         select new InfoProyectos
                         {
                             IdProyecto = info.IdProyecto,
                             NombreProyecto = info.NombreProyecto.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""),
                             approvedTotalMoney = info.VlrTotalProyectoFuenteRegalias,
                             porcentajeGastado = (decimal)info.AvanceFinanciero,
                             UrlImagen = info.URLImagen,
                             NombreSector = sector.NombreSector,
                             IdSector = sector.IdSector,
                             cantidadFotos = info.NumeroImagenes,
                             MesInicioProyecto = info.MesInicioProyecto,
                             AnioInicioProyecto = info.AnioInicioProyecto,
                             MesFinProyecto = info.MesFinProyecto,
                             AnioFinProyecto = info.AnioFinProyecto,
                             FechaInicioProyecto = info.FechaInicioProyecto,
                             Megusta = info.MeGusta,
                             Comentarios = info.Comentarios,
                         }).ToList();
            if (objReturn.Count > 8)
            {
                objReturn = objReturn.Take(8).ToList();
            }

            return objReturn;

        }

        public List<InfoProyectos> GetProyectosNacionalesfiltro(string campo)
        {
            List<InfoProyectos> objReturn = new List<InfoProyectos>();
            if (campo == "montodesc")
            {
                objReturn = (from info in DataModel.VwProyectosAprobadosInvs
                             join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                             where info.VlrTotalProyectoFuenteRegalias > 0 && info.TipoProyecto == "NACIONAL"
                             orderby info.VlrTotalProyectoFuenteRegalias descending
                             select new InfoProyectos
                             {
                                 IdProyecto = info.IdProyecto,
                                 NombreProyecto = info.NombreProyecto.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""),
                                 approvedTotalMoney = info.VlrTotalProyectoFuenteRegalias,
                                 porcentajeGastado = (decimal)info.AvanceFinanciero,
                                 UrlImagen = info.URLImagen,
                                 NombreSector = sector.NombreSector,
                                 IdSector = sector.IdSector,
                                 cantidadFotos = info.NumeroImagenes,
                                 MesInicioProyecto = info.MesInicioProyecto,
                                 AnioInicioProyecto = info.AnioInicioProyecto,
                                 MesFinProyecto = info.MesFinProyecto,
                                 AnioFinProyecto = info.AnioFinProyecto,
                                 FechaInicioProyecto = info.FechaInicioProyecto,
                                 Megusta = info.MeGusta,
                                 Comentarios = info.Comentarios,
                             }).ToList();
            }
            else if (campo == "montoasc")
            {
                objReturn = (from info in DataModel.VwProyectosAprobadosInvs
                             join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                             where info.VlrTotalProyectoFuenteRegalias > 0 && info.TipoProyecto == "NACIONAL"
                             orderby info.VlrTotalProyectoFuenteRegalias ascending
                             select new InfoProyectos
                             {
                                 IdProyecto = info.IdProyecto,
                                 NombreProyecto = info.NombreProyecto.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""),
                                 approvedTotalMoney = info.VlrTotalProyectoFuenteRegalias,
                                 porcentajeGastado = (decimal)info.AvanceFinanciero,
                                 UrlImagen = info.URLImagen,
                                 NombreSector = sector.NombreSector,
                                 IdSector = sector.IdSector,
                                 cantidadFotos = info.NumeroImagenes,
                                 MesInicioProyecto = info.MesInicioProyecto,
                                 AnioInicioProyecto = info.AnioInicioProyecto,
                                 MesFinProyecto = info.MesFinProyecto,
                                 AnioFinProyecto = info.AnioFinProyecto,
                                 FechaInicioProyecto = info.FechaInicioProyecto,
                                 Megusta = info.MeGusta,
                                 Comentarios = info.Comentarios,
                             }).ToList();
            }
            if (objReturn.Count > 8)
            {
                objReturn = objReturn.Take(8).ToList();
            }

            return objReturn;

        }


    }

}