using System.Collections.Generic;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using System.Linq;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos.Location;
using static PlataformaTransparencia.Modelos.ModelLocationData;
using Microsoft.Extensions.Configuration;
using static PlataformaTransparencia.Negocios.StaticStructs.LocationType;

namespace PlataformaTransparencia.Negocios.Location
{
    public class LocationBLL : ILocationBLL
    {
        /// <summary>
        /// Capa de negocio para funciones perfil Localizacon 
        /// </summary>
        private IConfiguration _configuration;
        public LocationBLL(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ModelHeaderLocalitacionProfileData GetHeaderLocationProfile(string locationId, string type)
        {
            locationId ??= string.Empty;
            type ??= string.Empty;
            locationId = locationId != string.Empty ? locationId.Trim() : locationId;
            ModelHeaderLocalitacionProfileData objReturn = new() { LocationId = locationId, Type = type, Name = GetNameLocationByIdType(locationId, type) };
            List<InfoProyectos> projectsByLocation = GetInvestingProjectsByLocationIdAndTypeLocation(locationId, type);
            objReturn.IsProvince = type.ToUpper().Trim() == Department.Name || type.ToUpper().Trim() == Province.Name;
            if (projectsByLocation.Count > 0)
            {
                objReturn.NumberProjects = projectsByLocation.Count;
                objReturn.AverageDurationProjects = projectsByLocation.Select(x => x.AnioFinProyecto - x.AnioInicioProyecto).Average();
                objReturn.AverageCostProjects = projectsByLocation.Select(x => x.VlrTotalProyectoFuenteRegalias).Average() / 1000000;
            }
            objReturn.UrlImage = $"../GaleriaEnteTerritorial/XL/{objReturn.LocationId}_XL.jpg"; //url('../GaleriaEnteTerritorial/XL/DistritoNacional_XL.jpg')
            objReturn.Locations = GetChildsLocations(locationId, type);
            return objReturn;
        }
        private static List<itemFilters> GetChildsLocations(string locationId, string type)
        {
            if (string.IsNullOrEmpty(locationId)) return new();
            List<itemFilters> rta = new();
            using var DataModel = new TransparenciaDB();
            switch (type.ToUpper().Trim())
            {
                case Province.Name:
                case Department.Name:
                    rta = (from info in DataModel.ProyectoXEntidadTerritorials
                           join ente in DataModel.EnteTerritorials on info.IdMunicipio equals ente.IdMunicipio
                           where info.IdDepartamento == locationId
                           select new itemFilters
                           {
                               value = info.IdMunicipio,
                               name = ente.NombreMunicipio
                           }).Distinct().OrderBy(x => x.name).ToList();
                    break;
            }
            rta.Insert(0, new itemFilters { name = "TODOS", value = "0", subTipo = string.Empty });
            return rta;
        }
        private static string GetNameLocationByIdType(string locationId, string type)
        {
            locationId ??= string.Empty;
            type ??= string.Empty;
            using var DataModel = new TransparenciaDB();
            switch (type.ToUpper().Trim())
            {
                case Province.Name:
                case Department.Name:
                    var locationLevelOne = (from info in DataModel.EnteTerritorials
                                            where (info.Tipo.ToUpper().Trim() == Department.Name || info.Tipo.ToUpper().Trim() == Province.Name) && info.IdDepartamento == locationId
                                            select info).FirstOrDefault();
                    return locationLevelOne == null ? string.Empty : locationLevelOne.NombreDepartamento;
                case District.Name:
                case Municipality.Name:
                    var locationLevelTwo = (from info in DataModel.EnteTerritorials
                                            where info.IdMunicipio == locationId
                                            select info).FirstOrDefault();
                    return locationLevelTwo == null ? string.Empty : locationLevelTwo.NombreMunicipio;
                default:
                    return string.Empty;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationId"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static List<InfoProyectos> GetInvestingProjectsByLocationIdAndTypeLocation(string locationId, string type)
        {
            locationId ??= string.Empty;
            type ??= string.Empty;
            using var DataModel = new TransparenciaDB();
            switch (type.ToUpper().Trim())
            {
                case District.Name:
                case Municipality.Name:
                    List<InfoProyectos> projectsByDistrict = (from info in DataModel.VwProyectosAprobadosInvs
                                                              join pxe in DataModel.ProyectoXEntidadTerritorials on info.IdProyecto equals pxe.IdProyecto
                                                              join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                                                              join ente in DataModel.EnteTerritorials on pxe.IdMunicipio equals ente.IdMunicipio
                                                              join histEstado in DataModel.HistoriaEstados on info.IdProyecto equals histEstado.IdProyecto
                                                              join estado in DataModel.Estados on histEstado.IdEstado equals estado.IdEstado
                                                              where ente.IdMunicipio == locationId
                                                              select new InfoProyectos
                                                              {
                                                                  IdProyecto = info.IdProyecto,
                                                                  NombreProyecto = info.NombreProyecto.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""),
                                                                  VlrTotalProyectoFuenteRegalias = info.VlrTotalProyectoFuenteRegalias,
                                                                  VlrTotalProyectoTodasLasFuentes = info.VlrTotalProyectoTodasLasFuentes,
                                                                  PartidaPresupuestaria = string.Empty,//info.PartidaPresupuestaria,
                                                                  State = estado.NombreEstado,
                                                                  UrlImagen = info.URLImagen,
                                                                  NombreMunicipio = ente.NombreMunicipio,
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
                                                                  IdDepartamento = pxe.IdDepartamento,
                                                                  IdMunicipio = ente.IdMunicipio,
                                                                  CodigoSnip = info.CodigoSNIP, //string.Empty,// info.CodigoSNIP,
                                                                  porcentajeGastado = (decimal)info.AvanceFinanciero,
                                                                  EntidadEjecutora = info.EntidadEjecutora,
                                                                  IdEntidadEjecutora = info.IdEntidadEjecutora.ToString()
                                                              }).ToList();
                    if (projectsByDistrict != null && projectsByDistrict.Count > 0) projectsByDistrict = projectsByDistrict.DistinctBy(x => x.IdProyecto).ToList();
                    return projectsByDistrict;
                case Province.Name:
                case Department.Name:
                    List<InfoProyectos> projectsByProvince = (from info in DataModel.VwProyectosAprobadosInvs
                                                              join pxe in DataModel.ProyectoXEntidadTerritorials on info.IdProyecto equals pxe.IdProyecto
                                                              join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                                                              join ente in DataModel.EnteTerritorials on pxe.IdDepartamento equals ente.IdDepartamento
                                                              join histEstado in DataModel.HistoriaEstados on info.IdProyecto equals histEstado.IdProyecto
                                                              join estado in DataModel.Estados on histEstado.IdEstado equals estado.IdEstado
                                                              where ente.IdDepartamento == locationId && pxe.IdMunicipio == ente.IdMunicipio && ente.Tipo != null && (ente.Tipo.ToUpper().Trim() == Department.ChildLocation.Type || ente.Tipo.ToUpper().Trim() == Province.ChildLocation.Type || ente.Tipo.ToUpper().Trim() == Department.Name || ente.Tipo.ToUpper().Trim() == Province.Name)
                                                              select new InfoProyectos
                                                              {
                                                                  IdProyecto = info.IdProyecto,
                                                                  NombreProyecto = info.NombreProyecto.Replace("\r\n", "").Replace("\n", "").Replace("\r", ""),
                                                                  VlrTotalProyectoFuenteRegalias = info.VlrTotalProyectoFuenteRegalias,
                                                                  VlrTotalProyectoTodasLasFuentes = info.VlrTotalProyectoTodasLasFuentes,
                                                                  PartidaPresupuestaria = string.Empty,//info.PartidaPresupuestaria,
                                                                  State = estado.NombreEstado,
                                                                  UrlImagen = info.URLImagen,
                                                                  NombreMunicipio = ente.NombreMunicipio,
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
                                                                  IdDepartamento = pxe.IdDepartamento,
                                                                  IdMunicipio = ente.IdMunicipio,
                                                                  CodigoSnip = info.CodigoSNIP, //string.Empty,
                                                                  porcentajeGastado = (decimal)info.AvanceFinanciero,
                                                                  EntidadEjecutora = info.EntidadEjecutora,
                                                                  IdEntidadEjecutora = info.IdEntidadEjecutora.ToString()
                                                              }).ToList();
                    if (projectsByProvince != null && projectsByProvince.Count > 0) projectsByProvince = projectsByProvince.DistinctBy(x => x.IdProyecto).ToList();
                    return projectsByProvince;
                default:
                    return new List<InfoProyectos>();
            }
        }

        /// <summary>
        /// obt listado sectores filtro proy ejecucion
        /// </summary>
        /// <returns></returns>
        public List<TableSectores> GetListSectores()
        {
            List<TableSectores> lstSectores = new List<TableSectores>();
            using (var DataModel = new TransparenciaDB())
            {

                lstSectores = (from maestro in DataModel.Sectors
                               select new TableSectores
                               {
                                   nombre = maestro.NombreSector,
                                   valor = maestro.IdSector.ToString()
                               }).OrderBy(p => p.nombre).ToList();
            }
            return lstSectores;
        }

        public LocationProfileDetailData GetDetailLocationProfileByLocationIdAndTypeLocation(string locationId, string typeLocation, string jurisdictionId)
        {
            locationId ??= string.Empty;
            typeLocation ??= string.Empty;
            locationId = locationId != string.Empty ? locationId.Trim() : string.Empty;
            typeLocation = typeLocation != string.Empty ? typeLocation.Trim() : string.Empty;
            List<InfoProyectos> projects = GetInvestingProjectsByLocationIdAndTypeLocation(locationId, typeLocation);
            List<Item> locations = GetInvestingProjectsLocationsByLocationIdAndType(locationId, typeLocation);
            List<LocationProfileChild> childrenLocations = GetInvestingProjectsChildrenLocationsByLocationIdAndType(typeLocation, projects, locations);
            List<InfoProjectPerSector> projectBySectors = GetInvestingProjectsSectorsByInvestingProjectsInLocation(projects);
            Item parentLocation = GetParentLocationByLocationIdAndTypeLocation(locationId, typeLocation);
            List<LocationProfileChild> locationsRelated = GetLocationRelatedByParentLocationAndTypeLocation(parentLocation, locationId, typeLocation);
            LocationProfileDetailData objReturn = new()
            {
                GeneralInformacion = new LocationProfileGeneralInformation { UrlImage = $"../img/d-{locationId}.svg", IsChildLocationEnable = childrenLocations != null && childrenLocations.Count > 0, ParentLocationName = parentLocation == null ? string.Empty : parentLocation.Nombre, ChildLocationName = GetChildLocationNameByTypeLocation(typeLocation) },
                TotalProjectsByState = GetTotalProjectsByState(projects),
                ProjectsByLocation = projects,
                LocationChilds = childrenLocations,
                ProjectsBySector = projectBySectors,
                ProjectsByFunctional = new(),
                ProjectsByFunctionalGroup = new(),
                LocationsRelated = locationsRelated,
                Status = true
            };
            return objReturn;
        }

        private static string GetChildLocationNameByTypeLocation(string typeLocation)
        {
            switch (typeLocation.ToUpper().Trim())
            {
                case Province.Name:
                case Department.Name:
                    return $"{Municipality.Name}S";
                default:
                    return string.Empty;
            }
        }

        private static List<LocationProfileChild> GetLocationRelatedByParentLocationAndTypeLocation(Item parentLocation, string locationId, string typeLocation)
        {
            if (parentLocation == null || string.IsNullOrEmpty(parentLocation.Id)) return new();
            locationId ??= string.Empty;
            typeLocation ??= string.Empty;
            using (var DataModel = new TransparenciaDB())
            {
                switch (typeLocation.ToUpper().Trim())
                {
                    case District.Name:
                    case Municipality.Name:
                        List<LocationProfileChild> rta = (from info in DataModel.EnteTerritorials
                                                          where info.IdDepartamento == parentLocation.Id && info.IdMunicipio != locationId && info.Tipo != null && (info.Tipo.ToUpper().Trim() == Department.ChildLocation.Type || info.Tipo.ToUpper().Trim() == Province.ChildLocation.Type)
                                                          select new LocationProfileChild
                                                          {
                                                              Id = info.IdMunicipio,
                                                              Name = info.NombreMunicipio
                                                          }).Distinct().ToList();
                        for (int i = 0; i < rta.Count; i++)
                        {
                            var projectsByLocation = GetInvestingProjectsByLocationIdAndTypeLocation(rta[i].Id, typeLocation);
                            rta[i].TotalProjects = projectsByLocation.Count;
                        }
                        return rta;
                }
            }
            return new();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="locationId"></param>
        /// <param name="typeLocation"></param>
        /// <returns></returns>
        private static Item GetParentLocationByLocationIdAndTypeLocation(string locationId, string typeLocation)
        {
            using (var DataModel = new TransparenciaDB())
            {
                switch (typeLocation.ToUpper().Trim())
                {
                    case District.Name:
                    case Municipality.Name:
                        return (from info in DataModel.EnteTerritorials
                                where info.IdMunicipio == locationId
                                select new Item
                                {
                                    Id = info.IdDepartamento,
                                    Nombre = info.NombreDepartamento
                                }).FirstOrDefault();
                }
            }
            return null;
        }

        private List<InfoProjectPerSector> GetInvestingProjectsSectorsByInvestingProjectsInLocation(List<InfoProyectos> projects)
        {
            if (projects == null || (projects != null && projects.Count == 0)) return new();
            List<InfoProjectPerSector> rta = (from project in projects
                                              group project by new { project.State, project.NombreSector } into g
                                              select new InfoProjectPerSector
                                              {
                                                  label = g.Key.NombreSector,
                                                  labelGroup = g.Key.State,
                                                  rawValue = g.Count(),
                                                  value = g.Count().ToString()
                                              }).OrderByDescending(x => x.rawValue).ToList();
            return rta;
        }

        private static List<LocationProfileChild> GetInvestingProjectsChildrenLocationsByLocationIdAndType(string typeLocation, List<InfoProyectos> projects, List<Item> locations)
        {
            typeLocation ??= string.Empty;
            if (projects == null || (projects != null && projects.Count == 0)) return new();
            if (locations == null || (locations != null && locations.Count == 0)) return new();
            List<LocationProfileChild> rta = new();
            switch (typeLocation.ToUpper().Trim())
            {
                case Province.Name:
                case Department.Name:
                    List<LocationProfileChild> childrenLocations = (from project in projects
                                                                    group project by new { project.IdMunicipio, project.NombreMunicipio } into g
                                                                    select new LocationProfileChild
                                                                    {
                                                                        Id = g.Key.IdMunicipio,
                                                                        Name = g.Key.NombreMunicipio,
                                                                        TotalProjects = g.Count()
                                                                    }).ToList();
                    if (childrenLocations.Count > 0)
                    {
                        if (locations.Count > 0)
                        {
                            rta = (from location in locations
                                   join childrenLocation in childrenLocations on location.Id equals childrenLocation.Id into g
                                   from loc in g.DefaultIfEmpty()
                                   select new LocationProfileChild
                                   {
                                       Id = location.Id,
                                       Name = location.Nombre,
                                       TotalProjects = loc?.TotalProjects ?? 0
                                   }).ToList();
                        }
                        //objReturn.GeneralInformacion.IsChildLocationEnable = true;
                        //objReturn.GeneralInformacion.ChildLocationName = typeLocation.ToUpper().Trim() == Province.Name ? Province.ChildLocation.Name : Department.ChildLocation.Name;
                        //objReturn.LocationChilds = new List<LocationProfileChild>(locationChildren.OrderBy(x => x.Name));
                    }
                    break;
            }
            return rta;
        }

        private static List<Item> GetInvestingProjectsLocationsByLocationIdAndType(string locationId, string type)
        {
            locationId ??= string.Empty;
            type ??= string.Empty;
            List<Item> rta = new();
            using (var DataModel = new TransparenciaDB())
            {
                switch (type.ToUpper().Trim())
                {
                    case Province.Name:
                    case Department.Name:
                        rta = (from info in DataModel.EnteTerritorials
                               where info.IdDepartamento == locationId && info.Tipo != null && (info.Tipo.ToUpper().Trim() == Department.ChildLocation.Type || info.Tipo.ToUpper().Trim() == Province.ChildLocation.Type)
                               select new Item
                               {
                                   Id = info.IdMunicipio,
                                   Nombre = info.NombreMunicipio
                               }).Distinct().ToList();
                        break;
                }
            }
            return rta;
        }

        private static List<TotalProjectByState> GetTotalProjectsByState(List<InfoProyectos> projects)
        {
            if (projects == null || projects.Count == 0) return new();
            List<TotalProjectByState> rta = (from project in projects
                                             group project by new { project.State } into g
                                             select new TotalProjectByState
                                             {
                                                 StateName = g.Key.State,
                                                 TotalProjects = g.Count(),
                                             }).ToList();
            if (rta != null && rta.Count > 0) rta = rta.OrderBy(x => x.StateName).ToList();
            return rta;
        }
    }
}
