using System.Collections.Generic;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using System.Linq;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos.Location;
using static PlataformaTransparencia.Modelos.ModelLocationData;
using Microsoft.Extensions.Configuration;
using static PlataformaTransparencia.Negocios.StaticStructs.LocationType;
using System;
using PlataformaTransparencia.Negocios.Proyectos;
using PlataformaTransparencia.Modelos.Entidad;
using NetTopologySuite.Utilities;

namespace PlataformaTransparencia.Negocios.Location
{
  public class LocationBLL : ILocationBLL
  {
    /// <summary>
    /// Capa de negocio para funciones perfil Localizacon 
    /// </summary>
    private IConfiguration _configuration;
    private static string _levelOne = string.Empty;
    private static string _levelTwo = string.Empty;
    public LocationBLL(IConfiguration configuration)
    {
      _configuration = configuration;
      IConfigurationSection levelOne = _configuration.GetSection("LocationLevel1");
      IConfigurationSection levelTwo = _configuration.GetSection("LocationLevel2");
      if (levelOne!=null && levelOne.Value!=null) _levelOne = levelOne.Value.ToUpper().Trim();
      if (levelTwo != null && levelTwo.Value != null) _levelTwo = levelTwo.Value.ToUpper().Trim();
    }

    public ModelHeaderLocalitacionProfileData GetHeaderLocationProfile(string locationId, string type)
    {
      locationId ??= string.Empty;
      type ??= string.Empty;
      locationId = locationId != string.Empty ? locationId.Trim() : locationId;
      ModelHeaderLocalitacionProfileData objReturn = new() { LocationId = locationId, NameType = GetTypeLocationByIdType(locationId, type), Type = type, Name = GetNameLocationByIdType(locationId, type) };
      objReturn.GeneralInformacion = GetGeneralInformationByLocationId(locationId);
      objReturn.IsProvince = type.ToUpper().Trim() == _levelOne;
      List<InfoProyectos> projectsByLocation = GetInvestingProjectsByLocationIdAndTypeLocation(locationId, type);
      //if (projectsByLocation.Count > 0)
      //{
      //  objReturn.NumberProjects = projectsByLocation.Count;
      //  objReturn.AverageDurationProjects = projectsByLocation.Select(x => x.AnioFinProyecto - x.AnioInicioProyecto).Average();
      //  objReturn.AverageCostProjects = projectsByLocation.Select(x => x.VlrTotalProyectoFuenteRegalias).Average() / 1000000;
      //}
      int locationImageId = Convert.ToInt32(objReturn.LocationId); // objReturn.LocationId.Replace("00",string.Empty);
      string nameImage = objReturn.Name.Replace(" ", "_");
      objReturn.UrlImage = objReturn.IsProvince ? $"../GaleriaEnteTerritorial/XL/comuna{locationImageId}_XL.jpg" : $"../GaleriaEnteTerritorial/XL/{nameImage}_XL.jpg";
      objReturn.Locations = GetChildsLocations(locationId, type);
      objReturn.Years = [new Modelos.Comunes.Period() { id= 2024, name="2024" }, new Modelos.Comunes.Period() { id = 2025, name = "2025" }];
      return objReturn;
    }

    private static itemConteoProjects GetGeneralInformationByLocationId(string locationId)
    {
      int locationIdLength= locationId.Length;
      if (locationIdLength == 1) locationId = string.Concat("0", locationId);
      using var DataModel = new TransparenciaDB();
      var resultado = DataModel.VwProyectosPOTProyectosInvLocalidads
      .Where(x=>x.IdLocalidad==locationId)
      .Select(x => new itemConteoProjects
      {
        num_proyectos_pdl = x.NumeroProyectosPDL ?? 0,
        num_proyectos_pot = x.NumeroProyectosPOT ?? 0
      })
      .FirstOrDefault();
      return resultado ?? new itemConteoProjects();
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
      if (rta.Count > 0) rta.Insert(0, new itemFilters { name = "TODOS", value = "0", subTipo = string.Empty });
      return rta;
    }
    private static string GetNameLocationByIdType(string locationId, string type)
    {
      locationId ??= string.Empty;
      type ??= string.Empty;
      using var DataModel = new TransparenciaDB();
      if (_levelOne == type.ToUpper().Trim())
      {
        var locationLevelOne = (from info in DataModel.EnteTerritorials
                                where (info.Tipo.ToUpper().Trim() == Department.Name || info.Tipo.ToUpper().Trim() == Province.Name || info.Tipo.ToUpper().Trim() == Commune.Name) && info.IdDepartamento == locationId
                                select info).FirstOrDefault();
        return locationLevelOne == null ? string.Empty : locationLevelOne.NombreDepartamento;
      }
      else if (_levelTwo == type.ToUpper().Trim())
      {
        var locationLevelTwo = (from info in DataModel.EnteTerritorials
                                where info.IdMunicipio == locationId
                                select info).FirstOrDefault();
        return locationLevelTwo == null ? string.Empty : locationLevelTwo.NombreMunicipio;
      }
      else return string.Empty;
    }
    private static string GetTypeLocationByIdType(string locationId, string type)
    {
      locationId ??= string.Empty;
      type ??= string.Empty;
      using var DataModel = new TransparenciaDB();
      if (_levelOne == type.ToUpper().Trim())
      {
        EnteTerritorial locationLevelOne = (from info in DataModel.EnteTerritorials
                                where (info.Tipo.ToUpper().Trim() == Department.Name || info.Tipo.ToUpper().Trim() == Province.Name || info.Tipo.ToUpper().Trim() == Commune.Name) && info.IdDepartamento == locationId
                                select info).FirstOrDefault();
        return locationLevelOne == null ? string.Empty : locationLevelOne.NombreRegion;
      }
      else if (_levelTwo == type.ToUpper().Trim())
      {
        EnteTerritorial locationLevelTwo = (from info in DataModel.EnteTerritorials
                                            where info.IdMunicipio == locationId
                                            select info).FirstOrDefault();
        return locationLevelTwo == null ? string.Empty : locationLevelTwo.NombreRegion;
      }
      else return string.Empty; 
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
      if (_levelOne == type.ToUpper().Trim())
      {
        List<InfoProyectos> projectsByDistrict = (from info in DataModel.VwProyectosAprobadosInvs
                                                  join pxe in DataModel.ProyectoXEntidadTerritorials on info.IdProyecto equals pxe.IdProyecto
                                                  join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                                                  join ente in DataModel.EnteTerritorials on pxe.IdDepartamento equals ente.IdDepartamento
                                                  join histEstado in DataModel.HistoriaEstados on info.IdProyecto equals histEstado.IdProyecto
                                                  join estado in DataModel.Estados on histEstado.IdEstado equals estado.IdEstado
                                                  where ente.IdDepartamento == locationId
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
        if (projectsByDistrict != null && projectsByDistrict.Count > 0)
        {
          for (int i=0; i< projectsByDistrict.Count; i++)
            projectsByDistrict[i].Periodos = BusquedasProyectosBLL.ObtenerAniosFuentesFinanciacionPorProyecto(projectsByDistrict[i].IdProyecto);
          projectsByDistrict = projectsByDistrict.DistinctBy(x => x.IdProyecto).ToList();
        }
        return projectsByDistrict;
      }
      else if (_levelTwo == type.ToUpper().Trim())
      {
        List<InfoProyectos> projectsByProvince = (from info in DataModel.VwProyectosAprobadosInvs
                                                  join pxe in DataModel.ProyectoXEntidadTerritorials on info.IdProyecto equals pxe.IdProyecto
                                                  join sector in DataModel.Sectors on info.IdSector equals sector.IdSector
                                                  join ente in DataModel.EnteTerritorials on pxe.IdDepartamento equals ente.IdDepartamento
                                                  join histEstado in DataModel.HistoriaEstados on info.IdProyecto equals histEstado.IdProyecto
                                                  join estado in DataModel.Estados on histEstado.IdEstado equals estado.IdEstado
                                                  where ente.IdDepartamento == locationId && pxe.IdMunicipio == ente.IdMunicipio && ente.Tipo != null && (ente.Tipo.ToUpper().Trim() == Commune.ChildLocation.Type || ente.Tipo.ToUpper().Trim() == Department.ChildLocation.Type || ente.Tipo.ToUpper().Trim() == Province.ChildLocation.Type || ente.Tipo.ToUpper().Trim() == Department.Name || ente.Tipo.ToUpper().Trim() == Province.Name)
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
        if (projectsByProvince != null && projectsByProvince.Count > 0)
        {
          for (int i = 0; i < projectsByProvince.Count; i++)
            projectsByProvince[i].Periodos = BusquedasProyectosBLL.ObtenerAniosFuentesFinanciacionPorProyecto(projectsByProvince[i].IdProyecto);
          projectsByProvince = projectsByProvince.DistinctBy(x => x.IdProyecto).ToList();
        }
        return projectsByProvince;
      }
      else return new List<InfoProyectos>();
    }

    /// <summary>
    /// obt listado sectores filtro proy ejecucion
    /// </summary>
    /// <returns></returns>
    public List<TableSectores> GetListSectores()
    {
      List<TableSectores> lstSectores = new();
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
    public BudgetFundsLocation GetBudgetFundsByLocationIdAndYear(string locationId, int year)
    {
      BudgetFundsLocation objReturn = new();
      int locationIdLength = locationId.Length;
      switch (locationIdLength)
      {
        case 1:
          locationId = string.Concat("000", locationId);
          break;
        case 2:
          locationId = string.Concat("00", locationId);
          break;
        case 3:
          locationId = string.Concat("0", locationId);
          break;
      }
      using var DataModel = new TransparenciaDB();
      BudgetFundsLocation rta=new();
      List<BudgetFundsLocation> presupuestosXLocalidadAnio = [.. (from info in DataModel.VwPresupuestoXLocalidadXAnios
                                                              where info.Anio == year && info.CodigoLocalidad == locationId
                                                              select new BudgetFundsLocation
                                                              {
                                                                Comprometido = info.ValorCompromisos ?? 0.0,
                                                                Disponible = info.ValorPagos ?? 0.0,
                                                                Vigente = info.ValorVigente ?? 0.0
                                                              })];
      if (presupuestosXLocalidadAnio.Count > 0)
      {
        double comprometido = presupuestosXLocalidadAnio.Sum(x => x.Comprometido);
        double disponible = presupuestosXLocalidadAnio.Sum(x => x.Disponible);
        double vigente = presupuestosXLocalidadAnio.Sum(x => x.Vigente);
        double ejecucionComprometida= vigente>0 ? comprometido*100.0/vigente : 0.0;
        double ejecucionDisponible = vigente > 0 ? disponible * 100.0 / vigente : 0.0;
        rta = new() { Comprometido= comprometido, Vigente= vigente, Disponible= disponible, EjecucionComprometida= ejecucionComprometida, EjecucionDisponible= ejecucionDisponible };
        objReturn = rta;
      }
      return objReturn;
    }
    public BudgetFundsLocation GetConsolidatedCostByLocationAndYear(string locationId, int year)
    {
      BudgetFundsLocation objReturn = new();
      int locationIdLength= locationId.Length;
      switch (locationIdLength)
      {
        case 1:
          locationId = string.Concat("000", locationId);
          break;
        case 2:
          locationId = string.Concat("00", locationId);
          break;
        case 3:
          locationId = string.Concat("0", locationId);
          break;
      }
      using var DataModel = new TransparenciaDB();
      BudgetFundsLocation rta = (from info in DataModel.VwPresupuestoXLocalidadXAnios
                                                where info.Anio == year && info.CodigoLocalidad == locationId
                                                select new BudgetFundsLocation
                                                {
                                                 Comprometido= info.ValorCompromisos ?? 0.0,
                                                 Disponible= info.ValorPagos ?? 0.0,
                                                 Vigente= info.ValorVigente ?? 0.0
                                                }).FirstOrDefault();
      if (rta != null)
      {
        rta.EjecucionComprometida = rta.Vigente > 0 ? rta.Comprometido * 100.0 / rta.Vigente:0.0;
        rta.EjecucionDisponible = rta.Vigente > 0 ? rta.Disponible * 100.0 / rta.Vigente : 0.0;
        objReturn = rta;
      }
      return objReturn;
    }

    public ModelDistribucionPorTipoGastoByLocalizacionIdAndYear GetBudgetConsolidateByLocationIdAndYear(string locationId, int year)
    {
      ModelDistribucionPorTipoGastoByLocalizacionIdAndYear objReturn = new() { Data=[], FechaCorte=string.Empty };
      int locationIdLength = locationId.Length;
      switch (locationIdLength)
      {
        case 1:
          locationId = string.Concat("000", locationId);
          break;
        case 2:
          locationId = string.Concat("00", locationId);
          break;
        case 3:
          locationId = string.Concat("0", locationId);
          break;
      }
      using var DataModel = new TransparenciaDB();
      List<InfoParticipacionSector> resultadosXlocalidadAnio = [.. (from info in DataModel.VwPresupuestoXLocalidadXAnios
                                                              where info.Anio == year && info.CodigoLocalidad == locationId
                                                              select new InfoParticipacionSector
                                                              {
                                                                label = info.DetalleClasificacionGastoPptal !=null && info.DetalleClasificacionGastoPptal.ToUpper().Contains("UN NUEVO CONTRATO SOCIAL Y AMBIENTAL PARA LA BOGOTÁ DEL SIGLO XXI")? "Plan de Desarrollo Local:"+ info.DetalleClasificacionGastoPptal :info.DetalleClasificacionGastoPptal ,
                                                                labelGroup = info.ClasificacionGastoPptal,
                                                                rawValueDouble = info.ValorVigente ?? 0.0,
                                                                label_inf = info.FechaCorte.HasValue? info.FechaCorte.Value.ToShortDateString(): string.Empty,
                                                                label_nivel4= info.Fuente
                                                              })];

      List<InfoParticipacionSector> resultadoAgrupado = [..(from resultadoXlocalidadAnio in resultadosXlocalidadAnio
                                                            group resultadoXlocalidadAnio by new { resultadoXlocalidadAnio.label, resultadoXlocalidadAnio.labelGroup } into g
                                                            select new InfoParticipacionSector
                                                            { 
                                                              label= g.Key.label,
                                                              labelGroup= g.Key.labelGroup,
                                                              rawValueDouble=  g.Sum(x=>x.rawValueDouble)
                                                            })];

      objReturn.Data = resultadoAgrupado;
      objReturn.FechaCorte = resultadosXlocalidadAnio.Count > 0 ? resultadosXlocalidadAnio.First().label_inf : string.Empty;
      objReturn.FuenteDatos = resultadosXlocalidadAnio.Count > 0 ? resultadosXlocalidadAnio.First().label_nivel4 : string.Empty;
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

    public ModelLocationProjectPot GetPotProjectsLocationsByLocationIdAndYear(string locationId, string sectorId, int pagina, int tamanoPagina)
    {
      ModelLocationProjectPot resultado = new() { PotProjects = [] };
      using (var DataModel = new TransparenciaDB())
      {
        resultado.PotProjects = [.. (from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoxSectorxEntidads
                                     where info.IdDepartamento == locationId
                                     select new itemProyectosPot
                                     {
                                       idLocalidad = info.IdDepartamento,
                                       localidad = info.NombreDepartamento,
                                       id = info.IdProyecto.ToString(),
                                       nombre = info.NombreProyecto,
                                       tipo = info.TipoProyecto,
                                       sectorId= info.IdSector.ToString()
                                     }).OrderBy(x=>x.nombre)];
        if (resultado.PotProjects != null && resultado.PotProjects.Count > 0 && !string.IsNullOrEmpty(sectorId)) resultado.PotProjects = resultado.PotProjects.Where(x => x.sectorId == sectorId).Select(x => x).ToList();
        resultado.TotalProjects= resultado.PotProjects.Count;
        if (resultado.PotProjects != null && resultado.PotProjects.Count > 0) resultado.PotProjects = resultado.PotProjects.Skip((pagina - 1) * tamanoPagina).Take(tamanoPagina).ToList();
      }
      return resultado;
    }
    public ModelLocationData GetODSLocation(string locationId)
    {
      locationId ??= string.Empty;
      ModelLocationData objReturn = new();
      using (var DataModel = new TransparenciaDB())
      {
        var cantidadProyectosUnicos = (
            from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
            where info.IdDepartamento == locationId
            group info by info.IdProyecto into g
            select g.Key
        ).Count();
        objReturn.ApprovedProjects = cantidadProyectosUnicos;

        List<pry_VwInformacionGeneralPerfilLocalizacionDeptoPry> data = [.. (from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
                                                                         where info.IdDepartamento == locationId
                                                                         select info)];

        if (data.Count > 0)
        {
          List<InfoOds> odsByLocation = [.. (from dt in data
                                             where !string.IsNullOrEmpty(dt.ODSNombre)
                                             group dt by new { dt.ODSId, dt.ODSNombre, dt.TotalProyectos } into g
                                             select new InfoOds
                                             {
                                               ODSId = g.Key.ODSId,
                                               ODSNombre = g.Key.ODSNombre,
                                               TotalProyectos = g.Key.TotalProyectos
                                             }).OrderBy(x => x.ODSId).ThenBy(n => n.ODSNombre)];
          List<Item> sectoresByLocation = [.. (from dt in data
                                              where !string.IsNullOrEmpty(dt.NombreSector)
                                             group dt by new { dt.IdSector, dt.NombreSector } into g
                                             select new Item
                                             {
                                               Id = g.Key.IdSector.ToString(),
                                               Nombre = g.Key.NombreSector,
                                             }).OrderBy(x => x.Nombre)];
          List<Item> entidadesByLocation = [.. (from dt in data
                                                 where !string.IsNullOrEmpty(dt.EntidadEjecutora)
                                             group dt by new { dt.IdEntidadEjecutora, dt.EntidadEjecutora } into g
                                             select new Item
                                             {
                                               Id = g.Key.IdEntidadEjecutora,
                                               Nombre = g.Key.EntidadEjecutora,
                                             }).OrderBy(x => x.Nombre)];
          objReturn.infoOds = odsByLocation;
          objReturn.InfoSectores = sectoresByLocation;
          objReturn.InfoDestacados = [new Item { Id = "0", Nombre = "No" }, new Item { Id = "1", Nombre = "Si" }];
          objReturn.InfoEntidades = entidadesByLocation;
        }
      }
      return objReturn;
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

    public ModelLocationData GetConsolidadoODSInversionLocalizacion(string idLocalizacion, string idSector, string idEntidad, string destacados, int pagina, int tamanopagina)
    {
      idLocalizacion ??= string.Empty;
      idSector ??=string.Empty;
      idEntidad ??= string.Empty;
      destacados ??= "0";
      ModelLocationData objReturn = new();
      using (var DataModel = new TransparenciaDB())
      {
        var recursosPerObjetoQuery = (from info in DataModel.VwInformacionGeneralPerfilLocalizacionDeptoPries
                                      where info.IdDepartamento == idLocalizacion
                                      group info by new
                                      {
                                        info.IdProyecto,
                                        info.CodigoProyecto,
                                        info.NombreProyecto,
                                        info.VlrTotalComprommetido,
                                        info.VlrTotalGirado,
                                        info.VlrTotalProgramado,
                                        info.IdSector,
                                        info.IdEntidadEjecutora,
                                        info.ProyectoDestacado
                                      } into g
                                      select new InfoConsolidadoProyectosInversion
                                      {
                                        IdProyecto = g.Key.IdProyecto,
                                        CodigoProyecto = g.Key.CodigoProyecto,
                                        NombreProyecto = g.Key.NombreProyecto,
                                        VlrTotalComprommetido = g.Key.VlrTotalComprommetido,
                                        VlrTotalGirado = g.Key.VlrTotalGirado,
                                        VlrTotalProgramado = g.Key.VlrTotalProgramado,
                                        PorcentajeComprometido= g.Key.VlrTotalProgramado != 0? Math.Round(g.Key.VlrTotalComprommetido*100/ g.Key.VlrTotalProgramado,3): 0,
                                        PorcentajeGirado= g.Key.VlrTotalProgramado != 0 ? Math.Round(g.Key.VlrTotalGirado * 100 / g.Key.VlrTotalProgramado,3) : 0,
                                        IdSector = g.Key.IdSector,
                                        IdEntidadEjecutora= g.Key.IdEntidadEjecutora,
                                        ProyectoDestacado= g.Key.ProyectoDestacado
                                      }).OrderBy(x=>x.NombreProyecto).ToList();
        if (recursosPerObjetoQuery != null && recursosPerObjetoQuery.Count > 0)
        {
          int sectorId = 0;
          if (int.TryParse(idSector,out sectorId)) recursosPerObjetoQuery = recursosPerObjetoQuery.Where(x => x.IdSector == sectorId).Select(x => x).ToList();
        }
        if (recursosPerObjetoQuery != null && recursosPerObjetoQuery.Count > 0 && idEntidad != string.Empty) recursosPerObjetoQuery = recursosPerObjetoQuery.Where(x => x.IdEntidadEjecutora == idEntidad).Select(x => x).ToList();
        if(destacados=="1") recursosPerObjetoQuery = recursosPerObjetoQuery.Where(x => x.ProyectoDestacado == 1).Select(x => x).ToList();
        objReturn.ApprovedProjects = recursosPerObjetoQuery.Count;
        if (recursosPerObjetoQuery != null && recursosPerObjetoQuery.Count > 0)
          recursosPerObjetoQuery= recursosPerObjetoQuery.Skip((pagina - 1) * tamanopagina).Take(tamanopagina).ToList();
        objReturn.infoConsolidadoProyectosInversions = recursosPerObjetoQuery;
      }
      return objReturn;
    }
  }
}
