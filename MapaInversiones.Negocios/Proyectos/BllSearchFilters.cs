using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using PlataformaTransparencia.Modelos.Comunes;
using System.Collections.Generic;
using System.Linq;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Infrastructura.DataModels;

namespace PlataformaTransparencia.Negocios.Proyectos
{
    public class BllSearchFilters : RespuestaContratoBase
    {
        private static TransparenciaDB DataModel;
        public BllSearchFilters(TransparenciaDB connection)
        {
            DataModel = connection;
        }

        public BllSearchFilters()
        {
        }
        // Methods
        public void Fill(ModelDataFilters DataFilters)
        {
            DataFilters.Status = false;
            DataFilters.Message = string.Empty;
            DataFilters.filters = new List<Filter>();
            this.GenerateGeographicFilters(DataFilters);
            this.ObtenerFiltrosEspecificosParaProyectos(DataFilters);
            DataFilters.Status = true;
        }

        private Filter FillRegionsFilters(GenericEnumerators.GeographicKindEnumeration Kind, IEnumerable<itemsFilterGeography> QueryResults)
        {
            Filter filter = new Filter();
            filter.seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Comunes.ToString();
            switch (Kind) {
                case GenericEnumerators.GeographicKindEnumeration.Region:
                    filter.name = CommonLabel.RegionLabel;
                    filter.parameter = "region";
                    break;

                case GenericEnumerators.GeographicKindEnumeration.Department:
                    filter.name = CommonLabel.DepartmentLabel;
                    filter.parameter = "departamento";
                    break;

                case GenericEnumerators.GeographicKindEnumeration.Municipality:
                    filter.name = CommonLabel.MunicipalityLabel;
                    filter.parameter = "municipio";
                    break;
            }
            if (QueryResults.Count<itemsFilterGeography>() > 0) {
                filter.items = new List<itemFilters>();
                filter.items.AddRange(QueryResults);
            }
            return filter;
        }

        private Filter FillSimpleFilters(GenericEnumerators.FilterKindEnumeration Kind, IEnumerable<itemFilters> QueryResults)
        {
            Filter filter = new Filter();
            filter.seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Proyectos.ToString();
            switch (Kind) {
                case GenericEnumerators.FilterKindEnumeration.ProyectState:
                    filter.name = CommonLabel.StateLabel;
                    filter.parameter = CommonConstants.NombreFiltroProyectos_Estado;// "estado";
                    break;

                case GenericEnumerators.FilterKindEnumeration.ProyectSector:
                    filter.name = CommonLabel.SectorLabel;
                    filter.parameter = CommonConstants.NombreFiltroProyectos_Sector;//"sector";
                    break;
            }
            if (QueryResults.Count<itemFilters>() > 0) {
                filter.items = new List<itemFilters>();
                filter.items.AddRange(QueryResults);
            }
            return filter;
        }

        public void GenerateGeographicFilters(ModelDataFilters DataFilters)
        {
            DataFilters.filters = new List<Filter>();
            List<itemsFilterGeography> queryResults = new List<itemsFilterGeography>();
            List<itemsFilterGeography> list2 = new List<itemsFilterGeography>();
            List<itemsFilterGeography> list3 = new List<itemsFilterGeography>();
            var source = (from RegionFilters in ConsultasComunes.ObtenerRegiones(null) select new { name = RegionFilters.NombreRegion, value = RegionFilters.IdRegion, /*topLeft = RegionFilters.TopLeft, bottomRight = RegionFilters.BottomRight*/ }).ToList();
            if (source.Count() > 0) {
                foreach (var typef in source) {
                    itemsFilterGeography item = new itemsFilterGeography {
                        name = typef.name,
                        value = typef.value,
                        //topLeft = this.GenerateCoordinateData(typef.topLeft),
                        //bottomRight = this.GenerateCoordinateData(typef.bottomRight)
                    };
                    queryResults.Add(item);
                }
                DataFilters.filters.Add(this.FillRegionsFilters(GenericEnumerators.GeographicKindEnumeration.Region, queryResults));
                System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de Regiones.");
            }
            var list5 = (from DepartmentsFilters in ConsultasComunes.ObtenerDepartamentos(null)
                         orderby DepartmentsFilters.NombreDepartamento
                         select new { name = DepartmentsFilters.NombreDepartamento, value = DepartmentsFilters.IdDepartamento, /*topLeft = DepartmentsFilters.TopLeft, bottomRight = DepartmentsFilters.BottomRight,*/ dependsOn = new DependsOn { id = DepartmentsFilters.IdRegion, type = "region" } }).ToList();
            if (list5.Count() > 0) {
                foreach (var type in list5) {
                    itemsFilterGeography geography2 = new itemsFilterGeography {
                        name = type.name,
                        value = type.value,
                        //bottomRight = this.GenerateCoordinateData(type.bottomRight),
                        //topLeft = this.GenerateCoordinateData(type.topLeft),
                        dependsOn = new List<DependsOn> { type.dependsOn }
                    };
                    list2.Add(geography2);
                }
                DataFilters.filters.Add(this.FillRegionsFilters(GenericEnumerators.GeographicKindEnumeration.Department, list2));
                System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de Departamentos.");
            }
            var list7 = (from MunicipalityFilter in ConsultasComunes.ObtenerMunicipio(null)
                         orderby MunicipalityFilter.NombreMunicipio
                         select new { name = MunicipalityFilter.NombreMunicipio, departmentName = MunicipalityFilter.NombreDepartamento, value = MunicipalityFilter.IdMunicipio, /*topLeft = MunicipalityFilter.TopLeft, bottomRight = MunicipalityFilter.BottomRight,*/ dependsOn = new DependsOn { id = MunicipalityFilter.IdDepartamento, type = "departamento" } }).ToList();
            if (list7.Count() > 0) {
                foreach (var type2 in list7) {
                    itemsFilterGeography geography3 = new itemsFilterGeography {
                        name = type2.name + ", " + type2.departmentName,
                        value = type2.value,
                        //bottomRight = this.GenerateCoordinateData(type2.bottomRight),
                        //topLeft = this.GenerateCoordinateData(type2.topLeft),
                        dependsOn = new List<DependsOn> { type2.dependsOn }
                    };
                    list3.Add(geography3);
                }
                DataFilters.filters.Add(this.FillRegionsFilters(GenericEnumerators.GeographicKindEnumeration.Municipality, list3));
                System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de Municipios.");
            }

        }

        public void ObtenerFiltrosEspecificosParaProyectos(ModelDataFilters DataFilters)
        {
            List<itemFilters> queryResults = new List<itemFilters>();
            List<itemFilters> list2 = new List<itemFilters>();
            List<itemFilters> list3 = new List<itemFilters>();
            List<itemFilters> list4 = new List<itemFilters>();
            List<itemFilters> list5 = new List<itemFilters>();

            var source = (from StateFilters in DataModel.Estados select new { name = StateFilters.NombreEstado, value = StateFilters.IdEstado }).ToList();
            if (source.Count() > 0) {
                foreach (var typee in source) {
                    itemFilters item = new itemFilters {
                        name = typee.name,
                        value = typee.value.ToString()
                    };
                    queryResults.Add(item);
                }
                DataFilters.filters.Add(this.FillSimpleFilters(GenericEnumerators.FilterKindEnumeration.ProyectState, queryResults));
                System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de estados para proyectos.");
            }
            var list6 = (from SectorFilters in DataModel.Sectors select new { name = SectorFilters.NombreSector, value = SectorFilters.IdSector }).ToList();
            if (list6.Count() > 0) {
                foreach (var typee2 in list6) {
                    itemFilters filters2 = new itemFilters {
                        name = typee2.name,
                        value = typee2.value.ToString()
                    };
                    list2.Add(filters2);
                }
                DataFilters.filters.Add(this.FillSimpleFilters(GenericEnumerators.FilterKindEnumeration.ProyectSector, list2));
                System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de sectores de proyectos.");
            }

            var list7 = (from Fuente in DataModel.Fuentes select new { name = Fuente.NombreTipoEntidad, value = Fuente.IdTipoEntidad }).ToList();
            if (list7.Count > 0) {
                foreach (var item in list7) {
                    itemFilters filters4 = new itemFilters {
                        name = item.name,
                        value = item.value.ToString()
                    };
                    list4.Add(filters4);
                }
                DataFilters.filters.Add(this.FillSimpleFilters(GenericEnumerators.FilterKindEnumeration.ProyectOrgFinanciador, list4));
                System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de organismo financiador de proyectos.");
            }

            var list8 = (from EntidadEjecutoraFilters in DataModel.VwEntidadEjecutoras select new { name = EntidadEjecutoraFilters.NombreEntidad, value = EntidadEjecutoraFilters.IdEntidad }).ToList();
            if (list8.Count > 0)
            {
                foreach (var item in list8)
                {
                    itemFilters filters5 = new itemFilters
                    {
                        name = item.name,
                        value = item.value.ToString()
                    };
                    list5.Add(filters5);
                }
                DataFilters.filters.Add(this.FillSimpleFilters(GenericEnumerators.FilterKindEnumeration.ProyectoEntidadEjecutora, list5));
                System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de entidades ejecutoras.");
            }
            DataFilters.filters.Add(FiltrosTotalesBLL.ObtenerFiltrosPeriodosAplicativo(GenericEnumerators.SeccionFuncionalAplicativo.Proyectos, "periods"));
        }


    }


}