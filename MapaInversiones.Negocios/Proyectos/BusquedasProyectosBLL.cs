using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using PlataformaTransparencia.Utilitarios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Entity.Spatial;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Infrastructura.DataModels;
using LinqToDB;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Modelos.Reportes;
using PlataformaTransparencia.Modelos.Contratos;
using DataModels;
using System.Linq.Expressions;
using System.Data.Entity.Core.Objects;
using System.Reflection.PortableExecutable;
using PlataformaTransparencia.Modelos.Location;

namespace PlataformaTransparencia.Negocios.Proyectos
{
  public class ItemFilter
  {
    public string value { get; set; } = string.Empty;
    public string name { get; set; } = string.Empty;
  }
  public class BusquedasProyectosBLL : IBusquedasProyectosBLL
  {
    private static IConfiguration Configuration;
    private static IConsultasComunes _consultasComunes;

    public static IConsultasComunes ConsultasComunes { get => _consultasComunes; set => _consultasComunes = value; }

    public BusquedasProyectosBLL(IConfiguration configuration, TransparenciaDB connection, IConsultasComunes consultasComunes)
    {
      Configuration = configuration;
      ConsultasComunes = consultasComunes;
    }

    public async Task<ProyectoPdf> ObtenerDataProyectoPdfAsync(int idProyecto)
    {
      ProyectoPdf proyecto = await ConsultasComunes.ObtenerDataProyectoPdfAsync(idProyecto);
      return proyecto;
    }


    public List<objectProjectsSearchMap> ObtenerPinesDeProyectosPorFiltro(FiltroBusquedaProyecto filtro, out decimal totalDineroAprobado,
        out int totalNumeroProyectosAprobados, out decimal totalDineroAprobadoOtrasFuentes)
    {
      List<objectProjectsSearchMap> resultadosProyectos = new List<objectProjectsSearchMap>();
      List<InfoProyectos> lstProyectos = new List<InfoProyectos>();
      GeneradorDatosProximidad generador = new GeneradorDatosProximidad(Configuration);

      lstProyectos.AddRange(ConsultasComunes.ObtenerInfoProyectos3(filtro));

      resultadosProyectos.AddRange(
          generador.ObtenerPinesDeProyectos(
              filtro.Zoom,
              filtro.TopLeft,
              filtro.BottomRight,
              lstProyectos,
              filtro
              )
          );

      totalDineroAprobado = generador.TotalValorRegalias;
      totalDineroAprobadoOtrasFuentes = generador.TotalValorTodasLasFuentes;
      totalNumeroProyectosAprobados = generador.TotalCantidadProyectos;


      return resultadosProyectos;

    }

    public List<objectProjectsSearchMap> ObtenerListadoDeProyectos(FiltroBusquedaProyecto filtro, out decimal valorTotalTodasFuentes, ref int page)
    {
      List<objectProjectsSearchMap> objReturn = new List<objectProjectsSearchMap>();
      valorTotalTodasFuentes = 0;
      using (var DataModel = new TransparenciaDB())
      {

        if (FiltroBusquedaContieneMismaGeoreferenciacion(filtro))
        {
          ComunesGeoreferenciacion georeferenciador = new ComunesGeoreferenciacion();
          DbGeography poligonoInicial = georeferenciador.ObtenerCuadradoPorCoordenadas2(filtro.TopLeft[0], filtro.TopLeft[1], filtro.BottomRight[0], filtro.BottomRight[1]);

          var proyectosQuery = (from proy in ConsultasComunes.ObtenerProyectosConsistentesMapListMode(filtro, ref page)
                                join georefrencia in DataModel.Georreferenciacions
                                  on proy.IdProyecto equals georefrencia.IdProyecto
                                where poligonoInicial.Intersects(DbGeography.FromText(georefrencia.GeoPuntoUbicacion.ToString()))
                                select new
                                {
                                  id = proy.IdProyecto,
                                  name = proy.NombreProyecto.ToUpper(),
                                  state = proy.State,
                                  EntidadEjecutora = proy.EntidadEjecutora,
                                  value = Math.Round(proy.VlrTotalProyectoFuenteRegalias),
                                  totalValue = Math.Round(proy.VlrTotalProyectoTodasLasFuentes),
                                }).ToList().Distinct().OrderBy(p => p.name);

          foreach (var item in proyectosQuery)
          {
            if (objReturn.FindAll(p => p.location == item.id.ToString()).Count == 0)
            {
              objReturn.Add(
                  new objectProjectsSearchMapProject
                  {
                    location = item.id.ToString(),//usado como key, por si un proyecto tiene 2 estados actuales
                    name = item.name,//nombre Proyecto
                    state = item.state,//estado
                    type = CommonConstants.ProjectsEnSingular,
                    value = Math.Round(item.value),//VlrTotalProyectoFuenteRegalias
                    url = GenerateProjectUrl(item.id),
                    ejecutor = item.EntidadEjecutora
                    //image = BusquedasProyectosBLL.GenerarUrlImagenProyecto(item.id)
                  });
            }
          }
          valorTotalTodasFuentes = 0;//objReturn.Sum(p => p.totalValue);


        }
        else
        {
          var lst = (from proyecto in ConsultasComunes.ObtenerProyectosConsistentesMapListMode(filtro, ref page).OrderBy(p => p.NombreProyecto)

                     select new objectProjectsSearchMapProject
                     {
                       location = proyecto.IdProyecto.ToString(),
                       name = proyecto.NombreProyecto.ToUpper(),
                       value = Math.Round(proyecto.VlrTotalProyectoFuenteRegalias),
                       state = proyecto.State,
                       ejecutor = proyecto.EntidadEjecutora,
                       type = CommonConstants.ProjectsEnSingular,
                       url = GenerateProjectUrl(proyecto.IdProyecto)
                     }).ToList();

          valorTotalTodasFuentes = 0;//objReturn.Sum(p => p.totalValue);
          objReturn.AddRange(lst);

        }
      }

      System.Diagnostics.Trace.WriteLine("Cargada la informacion de los graficos consolidados por cambio de filtro.");
      return objReturn;
    }


    private static bool FiltroBusquedaContieneMismaGeoreferenciacion(FiltroBusquedaProyecto filtro)
    {
      if (filtro.TopLeft.Count > 1 && filtro.BottomRight.Count > 1 && filtro.TopLeft[0] == filtro.BottomRight[0] && filtro.TopLeft[1] == filtro.BottomRight[1])
        return true;
      return false;
    }


    public List<objectProjectsSearchMap> ObtenerInfograficosOld(FiltroBusquedaProyecto filtro, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {

      List<objectProjectsSearchMap> objReturn = new List<objectProjectsSearchMap>();

      cantidadProyectos = 0;
      valorRegalias = 0;
      valorTotalRegalias = 0;

      int cantidadProyectosGeo = 0;
      decimal valorRegaliasGeo = 0;
      decimal valorTotalRegaliasGeo = 0;

      List<int> ZoomPushpinsFlag = new List<int>();
      List<int> ZoomDepartmentsFlag = new List<int>();
      List<int> ZoomMunicipFlag = new List<int>();
      bool existenFiltros =
              filtro.CodigosDepartamentos.Count() > 0 ||
              filtro.CodigosEstado.Count() > 0 ||
              filtro.CodigosMunicipios.Count() > 0 ||
              filtro.CodigosRegion.Count() > 0 ||
              filtro.CodigosSector.Count() > 0 ||
              //  filtro.CodigosEntidadEjecutora.Count() > 0 ||
              filtro.ContieneNombreProyecto.Count() > 0 ||
              !filtro.FechasPorDefecto;
      int ZoomMaxValue = int.Parse(Configuration["ZommMaxValueVisualization"]);
      ZoomPushpinsFlag.AddRange(GetKeyValues(GenericEnumerators.GeographicKindEnumeration.Default));
      ZoomDepartmentsFlag.AddRange(GetKeyValues(GenericEnumerators.GeographicKindEnumeration.Department));
      ZoomMunicipFlag.AddRange(GetKeyValues(GenericEnumerators.GeographicKindEnumeration.Municipality));


      //try
      //{              
      //Departamentos
      if (RomperGeografiaPorZoom(ZoomDepartmentsFlag, filtro.Zoom, ZoomMaxValue))
      {
        //Siempre traiga region tambien para el caso del ver por regiones solo para departamentos
        //Pintar polígonos
        //Regiones
        objReturn.AddRange(FormarInfograficoPorRegion(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
        objReturn.AddRange(FormarInfograficoPorDepartamento(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      }
      //Municipios
      if ((RomperGeografiaPorZoom(ZoomMunicipFlag, filtro.Zoom, ZoomMaxValue) || FiltroContieneUnDeptoMuyGrande(filtro)) && RomperGeografiaPorZoom(ZoomMunicipFlag, filtro.Zoom, ZoomMaxValue))
      {
        objReturn.AddRange(FormarInfograficoPorMunicipio(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      }

      //Pintar pushpins
      if (RomperGeografiaPorZoom(ZoomPushpinsFlag, filtro.Zoom, ZoomMaxValue))
      {
        //objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectos, out valorTotalRegaliasGeo)); 
        if (filtro.Zoom == 6 && existenFiltros)
        {
          objReturn.AddRange(ObtenerPinesDeProyectosPorFiltro(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
        }
        else if (filtro.Zoom != 6)
        {
          objReturn.AddRange(ObtenerPinesDeProyectosPorFiltro(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
        }

      }
      #region Old Code (Switch)
      //switch (filtro.Zoom)
      //{
      //    case 5:
      //        break;
      //    case 6:
      //    case 7:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorDepartamento(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || filtro.Zoom >= ZoomPushpinsFlag.Max())
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }

      //            break;
      //        }
      //    case 8:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorDepartamento(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || ZoomPushpinsFlag.Max() >= 16)
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }
      //            break;// Ya se traen las regiones desde el comienzo
      //        }

      //    case 9:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorMunicipio(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || ZoomPushpinsFlag.Max() >= 16)
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }
      //            break;// Ya se traen las regiones desde el comienzo
      //        }
      //    // del 10 en adelante municipios
      //    default:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorMunicipio(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || ZoomPushpinsFlag.Max() >= 16)
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }
      //            break;
      //        }
      //}
      #endregion
      //}
      //catch (Exception ex)
      //{
      //    Shared.LogHelper.GenerateLog(ex);
      //}
      System.Diagnostics.Trace.WriteLine("Cargada la informacion de los graficos consolidados por cambio de filtro.");
      return objReturn;
    }


    public List<objectProjectsSearchMap> ObtenerInfograficos(FiltroBusquedaProyecto filtro, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {

      List<objectProjectsSearchMap> objReturn = new List<objectProjectsSearchMap>();

      cantidadProyectos = 0;
      valorRegalias = 0;
      valorTotalRegalias = 0;

      int cantidadProyectosGeo = 0;
      decimal valorRegaliasGeo = 0;
      decimal valorTotalRegaliasGeo = 0;

      List<int> ZoomPushpinsFlag = new List<int>();
      List<int> ZoomDepartmentsFlag = new List<int>();
      List<int> ZoomMunicipFlag = new List<int>();
      bool existenFiltros =
              filtro.CodigosDepartamentos.Count() > 0 ||
              filtro.CodigosEstado.Count() > 0 ||
              filtro.CodigosMunicipios.Count() > 0 ||
              filtro.CodigosRegion.Count() > 0 ||
              filtro.CodigosSector.Count() > 0 ||
              // filtro.CodigosEntidadEjecutora.Count() > 0 ||
              filtro.CodigosOrgFinanciador.Count() > 0 ||
              filtro.ContieneNombreProyecto.Count() > 0 ||
              !filtro.FechasPorDefecto;
      int ZoomMaxValue = int.Parse(Configuration["ZommMaxValueVisualization"]);
      ZoomPushpinsFlag.AddRange(GetKeyValues(GenericEnumerators.GeographicKindEnumeration.Default));
      ZoomDepartmentsFlag.AddRange(GetKeyValues(GenericEnumerators.GeographicKindEnumeration.Department));
      ZoomMunicipFlag.AddRange(GetKeyValues(GenericEnumerators.GeographicKindEnumeration.Municipality));


      //try
      //{              
      //Departamentos
      if (RomperGeografiaPorZoom(ZoomDepartmentsFlag, filtro.Zoom, ZoomMaxValue))
      {
        //Siempre traiga region tambien para el caso del ver por regiones solo para departamentos
        //Pintar polígonos
        //Regiones
        objReturn.AddRange(FormarInfograficoPorRegion2(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
        objReturn.AddRange(FormarInfograficoPorDepartamento2(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      }
      //Municipios
      if ((RomperGeografiaPorZoom(ZoomMunicipFlag, filtro.Zoom, ZoomMaxValue) || FiltroContieneUnDeptoMuyGrande(filtro)) && RomperGeografiaPorZoom(ZoomMunicipFlag, filtro.Zoom, ZoomMaxValue))
      {
        objReturn.AddRange(FormarInfograficoPorMunicipio2(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      }

      //Pintar pushpins
      if (RomperGeografiaPorZoom(ZoomPushpinsFlag, filtro.Zoom, ZoomMaxValue))
      {
        //objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectos, out valorTotalRegaliasGeo)); 
        if (filtro.Zoom == 6 && existenFiltros)
        {
          objReturn.AddRange(ObtenerPinesDeProyectosPorFiltro(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
        }
        else if (filtro.Zoom != 6)
        {
          objReturn.AddRange(ObtenerPinesDeProyectosPorFiltro(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
        }
        if (cantidadProyectos == 0)
          cantidadProyectos = cantidadProyectosGeo;
        if (valorRegalias == 0)
          valorRegalias = valorRegaliasGeo;
        if (valorTotalRegalias == 0)
          valorTotalRegalias = valorTotalRegaliasGeo;

      }
      #region Old Code (Switch)
      //switch (filtro.Zoom)
      //{
      //    case 5:
      //        break;
      //    case 6:
      //    case 7:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorDepartamento(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || filtro.Zoom >= ZoomPushpinsFlag.Max())
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }

      //            break;
      //        }
      //    case 8:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorDepartamento(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || ZoomPushpinsFlag.Max() >= 16)
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }
      //            break;// Ya se traen las regiones desde el comienzo
      //        }

      //    case 9:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorMunicipio(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || ZoomPushpinsFlag.Max() >= 16)
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }
      //            break;// Ya se traen las regiones desde el comienzo
      //        }
      //    // del 10 en adelante municipios
      //    default:
      //        {
      //            objReturn.AddRange(FormarInfograficoPorMunicipio(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias));
      //            if (ZoomPushpinsFlag.Contains(filtro.Zoom) || ZoomPushpinsFlag.Max() >= 16)
      //            {
      //                objReturn.AddRange(ObtenerProyectosPorFiltros(filtro, out valorRegaliasGeo, out cantidadProyectosGeo, out valorTotalRegaliasGeo));
      //            }
      //            break;
      //        }
      //}
      #endregion
      //}
      //catch (Exception ex)
      //{
      //    Shared.LogHelper.GenerateLog(ex);
      //}
      System.Diagnostics.Trace.WriteLine("Cargada la informacion de los graficos consolidados por cambio de filtro.");
      return objReturn;
    }




    private static bool FiltroContieneUnDeptoMuyGrande(FiltroBusquedaProyecto filtro)
    {
      //Resuelve problema rompimiento Deparatmentos muy grandes para resolucion minima
      //Choco - Amazonas  - Caquetá - Meta
      string codigosDeptosMuyGrandesParaResolucionMinima = Configuration["codigosDeptosMuyGrandesParaResolucionMinima"];
      if (string.IsNullOrEmpty(codigosDeptosMuyGrandesParaResolucionMinima))
        codigosDeptosMuyGrandesParaResolucionMinima = "27,91,18,50";
      List<string> lstCodigosDptos = codigosDeptosMuyGrandesParaResolucionMinima.Split(',').ToList<string>();
      //si solo filtran por un departamento que esta entre los muy grandes returna true
      if (filtro.CodigosDepartamentos.Count == 1 && filtro.CodigosMunicipios.Count == 0 && lstCodigosDptos.Contains(filtro.CodigosDepartamentos.ElementAt(0)))
        return true;
      else
        return false;
    }


    private static List<ObjectProjectsSearchMapGeography> FormarInfograficoPorRegion(FiltroBusquedaProyecto filtro, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {
      List<ObjectProjectsSearchMapGeography> objReturn = new List<ObjectProjectsSearchMapGeography>();
      string key = "FormarInfograficoPorRegion" + ConsultasComunes.ObtenerKeyPorEstadoFiltro(filtro);

      var lstProyectosConsistentes = ConsultasComunes.ObtenerProyectosConsistentes(filtro);
      //CollectedMoney = 0;//Recursos presupuestados para inversión SGR -- No se tienen valores del dinero presupuestado pues no hay cargue de los origenes de las agencias
      valorRegalias = lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoFuenteRegalias);//Recursos aprobados SGR
      cantidadProyectos = lstProyectosConsistentes.Count();//cantidad Proyectos consstentes
      valorTotalRegalias = lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoTodasLasFuentes);//Valor total de los recursos aprobados

      if (!ShortCacheHelper.Get(key, out objReturn))
      {
        var lstBase = ConsolidadosNacionalesBLL.ObtenerInfograficoPorRegiones(lstProyectosConsistentes);
        var lstReturn = (from var in lstBase
                         select new ObjectProjectsSearchMapGeography
                         {
                           id = var.regionId,
                           total = var.projectNumber,//Cantidad de proyectos en el departamento
                           value = Math.Round(var.approvedMoney), //valor total de los proyectos en el departamento
                           approvedTotalMoney = Math.Round(var.approvedTotalMoney), //valor total de los proyectos en el departamento
                           type = "region"
                         }
                         ).ToList();
        objReturn = lstReturn;
        ShortCacheHelper.Add(objReturn, key);
      }
      else
        System.Diagnostics.Debug.WriteLine("Obtenida los infograficos region del cache corto");

      return objReturn;
    }


    private static List<ObjectProjectsSearchMapGeography> FormarInfograficoPorRegion2(FiltroBusquedaProyecto filtro, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {
      List<ObjectProjectsSearchMapGeography> objReturn = new List<ObjectProjectsSearchMapGeography>();
      string key = "FormarInfograficoPorRegion2" + ConsultasComunes.ObtenerKeyPorEstadoFiltro(filtro);

      var resumenes = RepositorioProyectos.ObtenerResumenesProyectosPorFiltros(filtro);

      valorRegalias = Convert.ToDecimal(resumenes.FirstOrDefault().VlrRegalias);//Recursos aprobados SGR
      cantidadProyectos = Convert.ToInt32(resumenes.FirstOrDefault().CantidadProyectos); ;//cantidad Proyectos consstentes
      valorTotalRegalias = Convert.ToDecimal(resumenes.FirstOrDefault().VlrTotal);//Valor total de los recursos aprobados

      if (!ShortCacheHelper.Get(key, out objReturn))
      {
        var lstReturn = (RepositorioProyectos.ObtenerProyectosPorRegionPorFiltros(filtro).Select(var => new ObjectProjectsSearchMapGeography()
        {
          id = var.IdEntidad,
          total = Convert.ToInt32(var.CantidadProyectos),//Cantidad de proyectos en el departamento
          value = Math.Round(Convert.ToDecimal(var.VlrRegalias)), //valor total de los proyectos en el departamento
          approvedTotalMoney = Math.Round(Convert.ToDecimal(var.VlrTotal)), //valor total de los proyectos en el departamento
          type = "region"
        })).ToList();


        objReturn = lstReturn;
        ShortCacheHelper.Add(objReturn, key);
      }
      else
        System.Diagnostics.Debug.WriteLine("Obtenida los infograficos region del cache corto");

      return objReturn;
    }



    private static List<ObjectProjectsSearchMapGeography> FormarInfograficoPorDepartamento(FiltroBusquedaProyecto filtros, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {
      List<ObjectProjectsSearchMapGeography> objReturn = new List<ObjectProjectsSearchMapGeography>();
      string key = "FormarInfograficoPorDepartamento" + ConsultasComunes.ObtenerKeyPorEstadoFiltro(filtros);

      var lstProyectosConsistentes = ConsultasComunes.ObtenerProyectosConsistentes(filtros);
      valorRegalias = lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoFuenteRegalias);//Recursos aprobados SGR
      cantidadProyectos = lstProyectosConsistentes.Count;//cantidad Proyectos consstentes
      valorTotalRegalias = lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoTodasLasFuentes);//Valor total de los recursos aprobados

      if (!ShortCacheHelper.Get(key, out objReturn))
      {
        var lstBase = ConsolidadosNacionalesBLL.ObtenerInfograficoPorDepartamentos(lstProyectosConsistentes);
        var lstReturn = (from var in lstBase
                         where (filtros.CodigosDepartamentos.Contains(var.departmentId) || filtros.CodigosDepartamentos.Count == 0)
                         select new ObjectProjectsSearchMapGeography
                         {
                           id = var.departmentId,
                           total = var.projectNumber,//Cantidad de proyectos en el departamento
                           value = Math.Round(var.approvedMoney), //valor total de los proyectos en el departamento
                           approvedTotalMoney = Math.Round(var.approvedTotalMoney), //valor total de los proyectos en el departamento
                           type = "departamento"
                         }
                         ).ToList();
        if (lstReturn.Count == 0)
        {
          lstReturn.AddRange(RepositorioConsultas.ConsultasComunes.AdicionarEnteTerritorialEnCeros(GenericEnumerators.GeographicKindEnumeration.Department));
        }
        objReturn = lstReturn;
        ShortCacheHelper.Add(objReturn, key);
      }
      else
        System.Diagnostics.Debug.WriteLine("Obtenida los infograficos depto del cache corto");

      //CollectedMoney = 0;//Recursos presupuestados para inversión SGR -- No se tienen valores del dinero presupuestado pues no hay cargue de los origenes de las agencias

      return objReturn;
    }


    private static List<ObjectProjectsSearchMapGeography> FormarInfograficoPorDepartamento2(FiltroBusquedaProyecto filtros, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {
      List<ObjectProjectsSearchMapGeography> objReturn = new List<ObjectProjectsSearchMapGeography>();
      string key = "FormarInfograficoPorDepartamento2" + ConsultasComunes.ObtenerKeyPorEstadoFiltro(filtros);

      var resumenes = RepositorioProyectos.ObtenerResumenesProyectosPorFiltros(filtros);

      valorRegalias = Convert.ToDecimal(resumenes.FirstOrDefault().VlrRegalias);//Recursos aprobados SGR
      cantidadProyectos = Convert.ToInt32(resumenes.FirstOrDefault().CantidadProyectos); ;//cantidad Proyectos consstentes
      valorTotalRegalias = Convert.ToDecimal(resumenes.FirstOrDefault().VlrTotal);//Valor total de los recursos aprobados

      if (!ShortCacheHelper.Get(key, out objReturn))
      {

        var lstReturn = (RepositorioProyectos.ObtenerProyectosPorDepartamentoPorFiltros(filtros).Select(var => new ObjectProjectsSearchMapGeography()
        {
          id = var.IdEntidad,
          total = Convert.ToInt32(var.CantidadProyectos),//Cantidad de proyectos en el departamento
          value = Math.Round(Convert.ToDecimal(var.VlrRegalias)), //valor total de los proyectos en el departamento
          approvedTotalMoney = Math.Round(Convert.ToDecimal(var.VlrTotal)), //valor total de los proyectos en el departamento
          type = "departamento"
        })).ToList();


        if (lstReturn.Count == 0)
        {
          lstReturn.AddRange(RepositorioConsultas.ConsultasComunes.AdicionarEnteTerritorialEnCeros(GenericEnumerators.GeographicKindEnumeration.Department));
        }
        objReturn = lstReturn;
        ShortCacheHelper.Add(objReturn, key);
      }
      else
        System.Diagnostics.Debug.WriteLine("Obtenida los infograficos depto del cache corto");


      return objReturn;
    }



    private static List<ObjectProjectsSearchMapGeography> FormarInfograficoPorMunicipio(FiltroBusquedaProyecto filtro, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {
      List<ObjectProjectsSearchMapGeography> objReturn = new List<ObjectProjectsSearchMapGeography>();
      string key = "FormarInfograficoPorMunicipio" + ConsultasComunes.ObtenerKeyPorEstadoFiltro(filtro);

      var lstProyectosConsistentes = ConsultasComunes.ObtenerProyectosConsistentes(filtro);
      //CollectedMoney = 0;//Recursos presupuestados para inversión SGR -- No se tienen valores del dinero presupuestado pues no hay cargue de los origenes de las agencias
      valorRegalias = lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoFuenteRegalias);//Recursos aprobados SGR
      cantidadProyectos = lstProyectosConsistentes.Count;//cantidad Proyectos consstentes
      valorTotalRegalias = lstProyectosConsistentes.Sum(p => p.VlrTotalProyectoTodasLasFuentes);//Valor total de los recursos aprobados

      if (!ShortCacheHelper.Get(key, out objReturn))
      {
        var lstBase = ConsolidadosNacionalesBLL.ObtenerInfograficoPorMunicipio(lstProyectosConsistentes, filtro);
        var lstReturn = (from var in lstBase
                         where (filtro.CodigosMunicipios.Contains(var.MunicipioId) || filtro.CodigosMunicipios.Count == 0)
                         select new ObjectProjectsSearchMapGeography
                         {
                           id = var.MunicipioId,
                           total = var.projectNumber,//Cantidad de proyectos en el departamento
                           value = Math.Round(var.approvedMoney), //valor total de los proyectos en el departamento
                           approvedTotalMoney = Math.Round(var.approvedTotalMoney), //valor total de los proyectos en el departamento
                           type = "municipio"
                         }
                         ).ToList();
        if (lstReturn.Count == 0)
        {
          lstReturn.AddRange(RepositorioConsultas.ConsultasComunes.AdicionarEnteTerritorialEnCeros(GenericEnumerators.GeographicKindEnumeration.Municipality));
        }
        objReturn = lstReturn;
        ShortCacheHelper.Add(objReturn, key);
      }
      else
        System.Diagnostics.Debug.WriteLine("Obtenida los infograficos Municipio del cache corto");

      return objReturn;
    }


    private static List<ObjectProjectsSearchMapGeography> FormarInfograficoPorMunicipio2(FiltroBusquedaProyecto filtro, out int cantidadProyectos, out decimal valorRegalias, out decimal valorTotalRegalias)
    {
      List<ObjectProjectsSearchMapGeography> objReturn = new List<ObjectProjectsSearchMapGeography>();
      string key = "FormarInfograficoPorMunicipio2" + ConsultasComunes.ObtenerKeyPorEstadoFiltro(filtro);

      var resumenes = RepositorioProyectos.ObtenerResumenesProyectosPorFiltros(filtro);

      valorRegalias = Convert.ToDecimal(resumenes.FirstOrDefault().VlrRegalias);//Recursos aprobados SGR
      cantidadProyectos = Convert.ToInt32(resumenes.FirstOrDefault().CantidadProyectos); ;//cantidad Proyectos consstentes
      valorTotalRegalias = Convert.ToDecimal(resumenes.FirstOrDefault().VlrTotal);//Valor total de los recursos aprobados

      if (!ShortCacheHelper.Get(key, out objReturn))
      {
        var lstReturn = (RepositorioProyectos.ObtenerProyectosPorMunicipioPorFiltros(filtro).Select(var => new ObjectProjectsSearchMapGeography()
        {
          id = var.IdEntidad,
          total = Convert.ToInt32(var.CantidadProyectos),//Cantidad de proyectos en el departamento
          value = Math.Round(Convert.ToDecimal(var.VlrRegalias)), //valor total de los proyectos en el departamento
          approvedTotalMoney = Math.Round(Convert.ToDecimal(var.VlrTotal)), //valor total de los proyectos en el departamento
          type = "municipio"
        })).ToList();

        if (lstReturn.Count == 0)
        {
          lstReturn.AddRange(RepositorioConsultas.ConsultasComunes.AdicionarEnteTerritorialEnCeros(GenericEnumerators.GeographicKindEnumeration.Municipality));
        }
        objReturn = lstReturn;
        ShortCacheHelper.Add(objReturn, key);
      }
      else
        System.Diagnostics.Debug.WriteLine("Obtenida los infograficos Municipio del cache corto");

      return objReturn;
    }



    /// <summary>
    /// Obtiene valores del config que permiten saber a qué nivel de zoom
    /// se van a pintar pushpins y polígonos
    /// </summary>
    /// <param name="enumFilters">Enumerador común que decide si se usan polígonos o pushpins</param>
    /// <remarks>
    /// - Department --> "ZommDepartmentsVisualization"
    /// - Municipality --> "ZommMunicipalitiesVisualization"
    /// - Default --> "ZommPushpinsVisualization"
    /// </remarks>
    /// <returns></returns>
    public static List<int> GetKeyValues(GenericEnumerators.GeographicKindEnumeration enumFilters)
    {
      string keyName = string.Empty;

      switch (enumFilters)
      {
        case GenericEnumerators.GeographicKindEnumeration.Department:
          keyName = "ZommDepartmentsVisualization";
          break;
        case GenericEnumerators.GeographicKindEnumeration.Municipality:
          keyName = "ZommMunicipalitiesVisualization";
          break;
        case GenericEnumerators.GeographicKindEnumeration.Default:
          keyName = "ZommPushpinsVisualization";
          break;
          //default:
          //    break;
      }


      List<int> result = new List<int>();
      List<string> auxStringList = new List<string>();
      auxStringList.AddRange(Configuration[keyName].ToString().Split(";".ToCharArray()));
      foreach (var item in auxStringList)
      {
        result.Add(int.Parse(item));
      }

      return result;
    }

    /// <summary>
    /// Genera la url del proyecto a buscar
    /// </summary>
    /// <param name="ProjectId">Id del proyecto</param>
    /// <returns>url del proyecto</returns>
    public static string GenerateProjectUrl(int ProjectId)
    {
      return string.Format(CommonConstants.ServicesLink, ProjectId.ToString());
    }

    /// <summary>
    /// Genera la ruta de la imágen del proyecto
    /// </summary>
    /// <param name="ProjectId">Id del proyecto</param>
    /// <returns>ruta de la imágen del proyecto</returns>

    /// <summary>
    /// Permite saber si para un conjunto de datos que se traen de configuración, 
    /// es válido ejecutar el proceso dependiendo del zoom
    /// </summary>
    /// <param name="lstFlagsGeograficos">arreglo de niveles de zoom que traigo de la configuración del ciclo</param>
    /// <param name="zoom">nivel de zoom actual</param>
    /// <returns>true si la validación se cumple, false si no</returns>
    public static bool RomperGeografiaPorZoom(List<int> lstFlagsGeograficos, int zoom, int maxZoomValue)
    {
      return lstFlagsGeograficos.Contains(zoom) || zoom >= maxZoomValue;
    }

    public static string GenerateStatusName(int ProjectId)
    {
      string retorno = string.Empty;
      using (var DataModel = new TransparenciaDB())
      {

        var estado = (from historia in DataModel.HistoriaEstados
                      join est in DataModel.Estados
                      on historia.IdEstado equals est.IdEstado
                      where historia.ActualSiNo == true
                      && historia.IdProyecto == ProjectId
                      select est).FirstOrDefault();
        retorno = estado.NombreEstado;

      }
      return retorno;
    }

    public static string GenerarUrlImagenProyecto(int idProyecto)
    {
      string imageUrl = string.Empty;
      using (var DataModel = new TransparenciaDB())
      {

        var imageList = (from fotos in DataModel.Fotos
                         where (fotos.IdProyectoPOT == idProyecto || fotos.IdProyectoInv == idProyecto)
                         orderby fotos.Fecha descending
                         select fotos.RutaFotoPequeno).FirstOrDefault();

        if (imageList != null)
        {
          imageUrl = imageList;
        }
        else
        {
          imageUrl = CommonConstants.DefaultImagePath;
        }
      }
      return imageUrl;
    }

    public async Task<List<object>> ObtenerFiltrosEspecificosParaProyectosAsync()
    {
      var filtros = new List<object>();

      using (var db = new TransparenciaDB())
      {


        var lstEstados = await (from maestro in db.GetTable<DataModels.Estado>()
                                select new
                                {
                                  name = maestro.NombreEstado,
                                  value = maestro.IdEstado.ToString(),
                                  //subTipo = default(string)
                                }).ToListAsync();

        var lstSectores = await (from maestro in db.GetTable<DataModels.Sector>()
                                 select new
                                 {
                                   name = maestro.NombreSector,
                                   value = maestro.IdSector.ToString(),
                                   //subTipo = default(string)
                                 }).OrderBy(p => p.name).ToListAsync();

        List<ItemFilter> lstOrgFinanciador = new List<ItemFilter>();
        var instituciones = await (from maestro in db.GetTable<DataModels.Fuente>()
                                   select new ItemFilter
                                   {
                                     name = maestro.NombreTipoEntidad,
                                     value = maestro.IdTipoEntidad.ToString()
                                   }).OrderBy(p => p.name).ToListAsync();
        var institucionesValue = instituciones.Select(x => x.value).Distinct().ToList();
        if (instituciones.Count > 0 && institucionesValue.Count > 0)
        {
          //for (int w = 0; w < lstOrgFinanciador.Count; w++)
          //  lstOrgFinanciador[w].name = lstOrgFinanciador[w].name.Replace("\r\n", string.Empty).Replace("\n\r", string.Empty);
          for (int w = 0; w < institucionesValue.Count; w++)
          {
            ItemFilter organismo = instituciones.Where(x => x.value == institucionesValue[w]).FirstOrDefault();
            if (organismo != null) lstOrgFinanciador.Add(organismo);
          }
        }

        var lstEntidadEjecutora = await (from maestro in db.GetTable<DataModels.VwEntidadEjecutora>()
                                         select new ItemFilter
                                         {
                                           name = maestro.NombreEntidad,
                                           value = maestro.IdEntidad.ToString()
                                         }).OrderBy(p => p.name).ToListAsync();

        var lstEntidadEjecutoraFinal = lstEntidadEjecutora.Select(a => new { a.name, a.value }).Distinct().ToList();

        filtros.Add(new
        {
          name = CommonLabel.StateLabel,
          parameter = CommonConstants.NombreFiltroProyectos_Estado,
          esMultiple = false,
          usaServicioAjax = false,
          urlServicioAjax = default(string),
          seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Proyectos.ToString(),
          items = lstEstados
        });

        filtros.Add(new
        {
          name = CommonLabel.SectorLabel,
          parameter = CommonConstants.NombreFiltroProyectos_Sector,
          esMultiple = false,
          usaServicioAjax = false,
          urlServicioAjax = default(string),
          seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Proyectos.ToString(),
          items = lstSectores
        });

        filtros.Add(new
        {
          name = CommonLabel.OrgFinanciadorLabel,
          parameter = CommonConstants.OrganismoFinanciador,
          esMultiple = false,
          usaServicioAjax = false,
          urlServicioAjax = default(string),
          seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Proyectos.ToString(),
          items = lstOrgFinanciador
        });

        //filtros.Add(new
        //{
        //    name = CommonLabel.EntidadEjecutoraLabel,
        //    parameter = CommonConstants.EntidadEjecutora,
        //    esMultiple = false,
        //    usaServicioAjax = false,
        //    urlServicioAjax = default(string),
        //    seccionAplicativo = GenericEnumerators.SeccionFuncionalAplicativo.Proyectos.ToString(),
        //    items = lstEntidadEjecutoraFinal
        //});

        filtros.Add(FiltrosTotalesBLL.ObtenerFiltrosPeriodosAplicativo(GenericEnumerators.SeccionFuncionalAplicativo.Proyectos, "periods"));
      }

      return filtros;

    }

    public static List<ImagesUsuario> ObtenerFotosUsusarioPerProyecto(int Id)
    {
      var objReturn = new List<ImagesUsuario>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = (from images in DataModel.FotoUsuarios
                        .Where(p => (p.IdProyectoPOT == Id || p.IdProyectoInv == Id) && p.Aprobado == true && p.Eliminado == false).OrderBy(p => p.Fecha)
                     select new ImagesUsuario
                     {
                       description = images.Descripcion,
                       large = images.RutaFotoGrande,
                       thumbnail = images.RutaFotoPequeno,
                       idFoto = images.IdFotoUsuario,
                       fechaFoto = images.Fecha


                     }).ToList();
      }
      return objReturn;
    }


    public static List<Images> ObtenerImagenesParaProyecto(int Id)
    {
      var objReturn = new List<Images>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = (from images in DataModel.Fotos
                        .Where(p => (p.IdProyectoPOT == Id || p.IdProyectoInv == Id) && p.Aprobado == true && p.Eliminado == false).OrderBy(p => p.Fecha)
                     select new Images
                     {
                       description = images.Descripcion,
                       large = images.RutaFotoGrande,
                       thumbnail = images.RutaFotoPequeno,
                       idFoto = images.IdFoto,
                       fechaFoto = images.Fecha,
                       priority = images.Header

                     }).ToList();
      }
      return objReturn;
    }

    public static List<itemEntregable> ObtenerEntregablesProyecto(int Id)
    {
      var objReturn = new List<itemEntregable>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = (from entregable in DataModel.Entregables
                     join unidad in DataModel.UnidadMedidas
                     on entregable.IdUnidadMedida equals unidad.IdUnidadMedida
                     where entregable.IdProyecto == Id
                     select new itemEntregable
                     {
                       IdEntregable = entregable.IdEntregable,
                       IdProyecto = entregable.IdProyecto,
                       EntregableColumn = entregable.EntregableColumn,
                       Cantidad = entregable.Cantidad,
                       IdUnidadMedida = entregable.IdUnidadMedida,
                       NombreUnidadMedida = unidad.NombreUnidadMedida
                     }).ToList();
      }
      return objReturn;
    }
    public static async Task<List<Images>> ObtenerImagenesParaProyectoAsync(int Id)
    {
      var objReturn = new List<Images>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = await (from images in DataModel.Fotos
                                    .Where(p => (p.IdProyectoPOT == Id || p.IdProyectoInv == Id) && p.Aprobado == true && p.Eliminado == false).OrderBy(p => p.Fecha)
                           select new Images
                           {
                             description = images.Descripcion,
                             large = images.RutaFotoGrande,
                             thumbnail = images.RutaFotoPequeno,
                             idFoto = images.IdFoto,
                             fechaFoto = images.Fecha
                           }).ToListAsync();
      }
      return objReturn;
    }

    public ModelDataProyecto ObtenerFotosUsuariosPerEstados(int estado, int page)
    {
      ModelDataProyecto objReturn = new ModelDataProyecto();
      var comentarios = new List<object>();

      List<ImagesUsuario> listInfo = new List<ImagesUsuario>();
      int? total_reg = 0;
      //AND           int reg_per_page = CommonLabel.MaximumResultPerFicha;
      int reg_per_page = 6;
      //ObjectParameter total_registros = new ObjectParameter("TOTALREGISTROS", typeof(Int32));
      using (var DataModel = new TransparenciaDB())
      {

        listInfo = (from images in DataModel.ObtenerFotosPorEstados(estado, page, reg_per_page, ref total_reg)
                    select new ImagesUsuario
                    {
                      description = images.Descripcion,
                      large = images.RutaFotoGrande,
                      thumbnail = images.RutaFotoPequeno,
                      idFoto = images.IdFotoUsuario,
                      fechaFoto = images.Fecha,
                      idDepartamento = images.IdDepartamento,
                      idMunicipio = images.IdMunicipio,
                      nombreDepartamento = images.NombreDepartamento,
                      nombreMunicipio = images.NombreMunicipio,
                      idProyecto = images.IdProyecto,
                      nombreProyecto = images.NombreProyecto,
                      idUsuario = images.IdUsuario,
                      nombreUsuario = images.Nombre,
                      asociacion = images.Tipo

                    }).OrderBy(p => p.fechaFoto).ToList();

        objReturn.totalNumber = (int)total_reg.Value;
        objReturn.totalPages = (objReturn.totalNumber > reg_per_page) ? ((objReturn.totalNumber - (objReturn.totalNumber % reg_per_page)) / reg_per_page) : 1;
        if ((objReturn.totalNumber >= reg_per_page) && ((objReturn.totalNumber % reg_per_page) > 0))
        {
          objReturn.totalPages++;
        }

        objReturn.FotosU = listInfo;

      }
      return objReturn;
    }

    public static async Task<List<ImagesUsuario>> ObtenerFotosUsuariosParaProyectoAsync(int Id)
    {
      var objReturn = new List<ImagesUsuario>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = await (from images in DataModel.FotoUsuarios
                           join Entidades in DataModel.EnteTerritorials
                            on new
                            {
                              IdDepartamento = images.IdDepartamento,
                              IdMunicipio = images.IdMunicipio
                            }
                            equals
                            new
                            {
                              IdDepartamento = Entidades.IdDepartamento,
                              IdMunicipio = Entidades.IdMunicipio
                            }
                           where ((images.IdProyectoPOT == Id || images.IdProyectoInv == Id) && images.Aprobado == true && images.Eliminado == false)
                           orderby (images.Fecha)
                           select new ImagesUsuario
                           {
                             description = images.Descripcion,
                             large = images.RutaFotoGrande,
                             thumbnail = images.RutaFotoPequeno,
                             idFoto = images.IdFotoUsuario,
                             fechaFoto = images.Fecha,
                             idDepartamento = images.IdDepartamento,
                             idMunicipio = images.IdMunicipio,
                             nombreDepartamento = Entidades.NombreDepartamento,
                             nombreMunicipio = Entidades.NombreMunicipio
                           }).ToListAsync();
      }
      return objReturn;
    }

    public int ObtenerFotosUsuariosParaAprobarCant()
    {
      int? total_reg = 0;
      using (var DataModel = new TransparenciaDB())
      {

        List<ImagesUsuario> listInfo = new List<ImagesUsuario>();
        //ObjectParameter total_registros = new ObjectParameter("TOTALREGISTROS", typeof(Int32));
        listInfo = (from images in DataModel.ObtenerFotosPorEstados(1, 1, 99, ref total_reg)
                    select new ImagesUsuario
                    {
                      idFoto = images.IdFotoUsuario,
                    }).ToList();
        total_reg = (int)total_reg.Value;
      }
      return (int)total_reg;
    }

    public async Task<List<ImagesUsuario>> ObtenerFotosUsuariosParaAprobarAsync()
    {
      var objReturn = new List<ImagesUsuario>();
      using (var DataModel = new TransparenciaDB())
      {

                //objReturn = await (from images in DataModel.FotoUsuarios
                //                   join Proyectos in DataModel.Proyectos
                //                   on images.IdProyectoPOT equals Proyectos.IdProyecto
                //                   join Usuarios in DataModel.Usuarios
                //                   on images.IdUsuario equals Usuarios.IdUsuario
                //                   join Entidades in DataModel.EnteTerritorials
                //                    on new
                //                    {
                //                      IdDepartamento = images.IdDepartamento,
                //                      IdMunicipio = images.IdMunicipio
                //                    }
                //                    equals
                //                    new
                //                    {
                //                      IdDepartamento = Entidades.IdDepartamento,
                //                      IdMunicipio = Entidades.IdMunicipio
                //                    }
                //                   where (images.Aprobado == false && images.Eliminado == false)
                //                   orderby (images.Fecha)
                //                   select new ImagesUsuario
                //                   {
                //                     description = images.Descripcion,
                //                     large = images.RutaFotoGrande,
                //                     thumbnail = images.RutaFotoPequeno,
                //                     idFoto = images.IdFotoUsuario,
                //                     fechaFoto = images.Fecha,
                //                     idDepartamento = images.IdDepartamento,
                //                     idMunicipio = images.IdMunicipio,
                //                     nombreDepartamento = Entidades.NombreDepartamento,
                //                     nombreMunicipio = Entidades.NombreMunicipio,
                //                     idProyecto = Proyectos.IdProyecto,
                //                     nombreProyecto = Proyectos.NombreProyecto,
                //                     idUsuario = Usuarios.IdUsuario,
                //                     nombreUsuario = Usuarios.Nombre
                //                   }).ToListAsync();


                // primera consulta: con Proyectos
                var query1 = from images in DataModel.FotoUsuarios
                             join Proyectos in DataModel.Proyectos
                                 on images.IdProyectoPOT equals Proyectos.IdProyecto
                             join Usuarios in DataModel.Usuarios
                                 on images.IdUsuario equals Usuarios.IdUsuario
                             join Entidades in DataModel.EnteTerritorials
                                 on new
                                 {
                                     IdDepartamento = images.IdDepartamento,
                                     IdMunicipio = images.IdMunicipio
                                 }
                                 equals
                                 new
                                 {
                                     IdDepartamento = Entidades.IdDepartamento,
                                     IdMunicipio = Entidades.IdMunicipio
                                 }
                             where (images.Aprobado == false && images.Eliminado == false)
                             select new ImagesUsuario
                             {
                                 description = images.Descripcion,
                                 large = images.RutaFotoGrande,
                                 thumbnail = images.RutaFotoPequeno,
                                 idFoto = images.IdFotoUsuario,
                                 fechaFoto = images.Fecha,
                                 idDepartamento = images.IdDepartamento,
                                 idMunicipio = images.IdMunicipio,
                                 nombreDepartamento = Entidades.NombreDepartamento,
                                 nombreMunicipio = Entidades.NombreMunicipio,
                                 idProyecto = Proyectos.IdProyecto,
                                 nombreProyecto = Proyectos.NombreProyecto,
                                 idUsuario = Usuarios.IdUsuario,
                                 nombreUsuario = Usuarios.Nombre,
                                 asociacion = "POT"
                             };

                // segunda consulta: con ProyectosPry
                var query2 = from images in DataModel.FotoUsuarios
                             join ProyectosPry in DataModel.ProyectoPries
                                 on images.IdProyectoInv equals ProyectosPry.IdProyecto
                             join Usuarios in DataModel.Usuarios
                                 on images.IdUsuario equals Usuarios.IdUsuario
                             join Entidades in DataModel.EnteTerritorials
                                 on new
                                 {
                                     IdDepartamento = images.IdDepartamento,
                                     IdMunicipio = images.IdMunicipio
                                 }
                                 equals
                                 new
                                 {
                                     IdDepartamento = Entidades.IdDepartamento,
                                     IdMunicipio = Entidades.IdMunicipio
                                 }
                             where (images.Aprobado == false && images.Eliminado == false)
                             select new ImagesUsuario
                             {
                                 description = images.Descripcion,
                                 large = images.RutaFotoGrande,
                                 thumbnail = images.RutaFotoPequeno,
                                 idFoto = images.IdFotoUsuario,
                                 fechaFoto = images.Fecha,
                                 idDepartamento = images.IdDepartamento,
                                 idMunicipio = images.IdMunicipio,
                                 nombreDepartamento = Entidades.NombreDepartamento,
                                 nombreMunicipio = Entidades.NombreMunicipio,
                                 idProyecto = ProyectosPry.IdProyecto,
                                 nombreProyecto = ProyectosPry.NombreProyecto,
                                 idUsuario = Usuarios.IdUsuario,
                                 nombreUsuario = Usuarios.Nombre,
                                 asociacion = "INV"
                             };

                // unión de ambas
                objReturn = await query1
                    .Union(query2) // o .Concat(query2) si no quieres eliminar duplicados
                    .OrderBy(x => x.fechaFoto)
                    .ToListAsync();
            }
      return objReturn;
    }

    public static async Task<List<MetricperYear>> ObtenerMetricasParaProyectoAsync(int Id)
    {
      var objReturn = new List<MetricperYear>();
      using (var DataModel = new TransparenciaDB())
      {

        var listYears = await (from specifObjetive in DataModel.ObjetivoEspecificos
                               join product in DataModel.Productos on specifObjetive.IdObjetivoEspecifico equals product.IdObjetivoEspecifico
                               join indicators in DataModel.MetaIndicadorProductos on product.IdProducto equals indicators.IdProducto
                               where specifObjetive.IdProyecto == Id
                               select indicators.FechaInicioMeta.Year).Distinct().ToListAsync();
        foreach (int year in listYears)
        {
          var metricaDelAño = await (from specifObjetive in DataModel.ObjetivoEspecificos
                                     join product in DataModel.Productos on specifObjetive.IdObjetivoEspecifico equals product.IdObjetivoEspecifico
                                     join indicators in DataModel.MetaIndicadorProductos on product.IdProducto equals indicators.IdProducto
                                     join tracing in DataModel.SeguimientoMetaIndicadorProductos
                                      on new
                                      {
                                        IdProducto = indicators.IdProducto,
                                        IdIndicador = indicators.IdIndicador,
                                        FechaInicio = indicators.FechaInicioMeta,
                                        FechaFin = indicators.FechaFinMeta
                                      }
                                      equals
                                          new
                                          {
                                            IdProducto = tracing.IdProducto,
                                            IdIndicador = tracing.IdIndicador,
                                            FechaInicio = tracing.FechaInicioReporte,
                                            FechaFin = tracing.FechaFinReporte
                                          }
                                     into MetricasConSeguimiento
                                     where specifObjetive.IdProyecto == Id && indicators.FechaInicioMeta.Year == year
                                     from seguimiento in MetricasConSeguimiento.DefaultIfEmpty()
                                     select new Metric
                                     {
                                       name = indicators.NombreIndicador,
                                       current = seguimiento != null ? seguimiento.ValorReportado : 0,
                                       goal = indicators.ValorMeta,
                                       product = product.NombreProducto,
                                       goalDescription = specifObjetive.NombreObjetivoEspecifico,
                                       UnidadDeMedida = product.UnidadProducto
                                     }).Distinct().ToListAsync();

          foreach (var registro in metricaDelAño)
          {
            if (registro.goal > 0)
              registro.PorcentajeEjecutado = Convert.ToDecimal(ManejoPorcentajes.ValorPorcentajeString(Convert.ToDecimal(registro.goal), Convert.ToDecimal(registro.current)).Replace("%", string.Empty).Trim()); //Convert.ToInt32((registro.goal - registro.current) / registro.goal);    
          }


          objReturn.Add(new MetricperYear { year = year, metrics = metricaDelAño });
        }
      }
      return objReturn;
    }

    public static async Task<List<Modelos.Project>> ObtenerOtrosProyectosOcadProyectoAsync(int Id)
    {
      var objReturn = new List<Modelos.Project>();
      using (var DataModel = new TransparenciaDB())
      {

        var IdOCAD = (from proyecto in DataModel.Proyectos
                      where proyecto.IdProyecto == Id
                      select proyecto.IdOCAD).FirstOrDefault();

        objReturn = await (from projects in DataModel.Proyectos
                           join history in DataModel.HistoriaEstados
                           on projects.IdProyecto equals history.IdProyecto
                           join status in DataModel.Estados
                           on history.IdEstado equals status.IdEstado
                           where projects.IdProyecto != Id && projects.IdOCAD == IdOCAD
                           && history.ActualSiNo == true
                           select new Modelos.Project
                           {
                             BPIN = projects.CodigoBPIN,
                             ProjectId = projects.IdProyecto,
                             enddateDateTime = projects.FechaFinProyecto,
                             enddate = projects.FechaFinProyecto.ToString(),
                             startdateDateTime = projects.FechaInicioProyecto,
                             startdate = projects.FechaInicioProyecto.ToString(),
                             name = projects.NombreProyecto,
                             TotalValue = projects.VlrTotalProyectoFuenteRegalias,
                             Status = status.NombreEstado
                           }).Take(4).ToListAsync();
        foreach (var proyecto in objReturn)
        {
          var instancia = new BllProjectProfile();
          proyecto.executor = instancia.NameActorByProject(CommonConstants.CodigoEjecutor, Id);
          proyecto.contractor = instancia.NameActorByProject(CommonConstants.CodigoContratista, Id);
          proyecto.controller = instancia.NameActorByProject(CommonConstants.CodigoInterventor, Id);
          proyecto.location = instancia.LocalizationByProject(Id);
        }
      }
      return objReturn;
    }

    private static string UppercaseFirst(string s)
    {
      if (string.IsNullOrEmpty(s))
      {
        return string.Empty;
      }
      return char.ToUpper(s[0]) + s.Substring(1).ToLowerInvariant();
    }

    public static async Task<Modelos.Project> ObtenerDetalleProyectoAsync(int Id)
    {
      Modelos.Project objReturn = new Modelos.Project();
      using (var DataModel = new TransparenciaDB())
      {

        var datoFechaAprobacion = await DataModel.DatosAdicionalesAprobacions.Where(p => p.IdProyecto == Id)
                                                        .OrderByDescending(p => p.FechaUltimaAprobacion).FirstOrDefaultAsync();


        var infoProyecto = await (from aprobadosInv in DataModel.VwProyectosAprobadosInvs
                                  join project in DataModel.Proyectos
                                  on aprobadosInv.IdProyecto equals project.IdProyecto
                                  join historiaEstado in DataModel.HistoriaEstados
                                  on project.IdProyecto equals historiaEstado.IdProyecto
                                  join estados in DataModel.Estados
                                  on historiaEstado.IdEstado equals estados.IdEstado
                                  join geo in DataModel.Georreferenciacions
                                  on project.IdProyecto equals geo.IdProyecto
                                  where project.IdProyecto == Id
                                  && historiaEstado.ActualSiNo == true
                                  select new
                                  {
                                    IdProject = project.IdProyecto,
                                    BPIN = project.CodigoBPIN,
                                    enddate = project.FechaFinProyecto.Year.ToString(),
                                    name = project.NombreProyecto.Trim(),
                                    //sector = project.Sector.NombreSector.Trim(),
                                    startdate = project.FechaInicioProyecto.Year.ToString(),
                                    TotalValue = project.VlrTotalProyectoFuenteRegalias,
                                    TotalValueAll = project.VlrTotalProyectoTodasLasFuentes,
                                    longitude = geo.GeoPuntoUbicacion.Long,
                                    latitude = geo.GeoPuntoUbicacion.Lat,
                                    idOcad = project.IdOCAD,
                                    nameOcad = project.NombreOCAD.Trim(),
                                    Status = estados.NombreEstado.Trim(),
                                    IdStatus = estados.IdEstado,
                                    avance_fisico = aprobadosInv.AvanceFisico,
                                    avance_financiero = aprobadosInv.AvanceFinanciero,
                                    contMegusta = aprobadosInv.MeGusta,
                                    contComentarios = aprobadosInv.Comentarios,
                                    duracion = aprobadosInv.DuracionProyecto,
                                    tipo_proyecto = aprobadosInv.TipoProyecto.Trim()
                                  }).FirstOrDefaultAsync();


        var instancia = new BllProjectProfile();
        if (infoProyecto != null)
        {

          List<ActorFicha> beneficiarios_aux = new List<ActorFicha>();
          List<ActorFicha> beneficiarios_munic = new List<ActorFicha>();
          List<ActorFicha> beneficiarios_encabezado = new List<ActorFicha>();

          if (infoProyecto.tipo_proyecto.ToUpper().Equals("NACIONAL"))
          {
            var munic_query = (from municipio in RepositorioConsultas.ConsultasComunes.ObtenerMunicipio(null)
                               select new ActorFicha
                               {
                                 Nombre = municipio.NombreMunicipio + " (" + municipio.NombreDepartamento + ")",
                                 IdDepartamento = municipio.IdDepartamento,
                                 IdMunicipio = municipio.IdMunicipio,
                                 Tipo = municipio.Tipo
                               }).OrderBy(p => p.Nombre);
            beneficiarios_munic = munic_query.ToList();
          }
          else
          {
            beneficiarios_aux = instancia.ObtenerNombresGeografiasBeneficiadas(Id);

            if (infoProyecto.tipo_proyecto.Equals("DEPARTAMENTAL"))
            {
              //beneficiarios encabezado
              beneficiarios_munic = beneficiarios_aux.Where(p => p.Tipo.Equals("MUNICIPIO")).ToList();
              beneficiarios_encabezado = beneficiarios_aux.Where(p => p.Tipo.Equals("DEPARTAMENTO")).ToList();
            }
            else
            {
              beneficiarios_munic = beneficiarios_aux;
              beneficiarios_encabezado = beneficiarios_aux;
            }
          }

          string cod_bpin = infoProyecto.BPIN;
          string key_estado_proy = Configuration["EstadoProyEstudio"].ToString();
          if (infoProyecto.IdStatus == Convert.ToInt16(key_estado_proy))
          {
            cod_bpin = "";
          }

          objReturn = new Modelos.Project()
          {
            ProjectId = infoProyecto.IdProject,
            BPIN = cod_bpin,
            enddate = infoProyecto.enddate,
            name = UppercaseFirst(infoProyecto.name.Trim()),
            //sector = infoProyecto.sector.Trim(),
            startdate = infoProyecto.startdate,
            TotalValue = infoProyecto.TotalValue,
            TotalValueAll = infoProyecto.TotalValueAll,
            longitude = Convert.ToDecimal(infoProyecto.longitude),
            latitude = Convert.ToDecimal(infoProyecto.latitude),
            idOcad = infoProyecto.idOcad,
            nameOcad = infoProyecto.nameOcad.Trim(),
            Status = infoProyecto.Status,
            IdStatus = infoProyecto.IdStatus,
            executor = instancia.NameActorByProject(CommonConstants.CodigoEjecutor, Id),
            contractor = instancia.NameActorByProject(CommonConstants.CodigoContratista, Id),
            controller = instancia.NameActorByProject(CommonConstants.CodigoInterventor, Id),
            EntesBeneficiados = beneficiarios_munic,
            location = instancia.LocalizationByProject(Id),
            fechaAprobacion = datoFechaAprobacion != null ? datoFechaAprobacion.FechaUltimaAprobacion != null ? datoFechaAprobacion.FechaUltimaAprobacion.Value.Year.ToString() : default(string) : default(string),
            avance_fisico = infoProyecto.avance_fisico,
            //avance_financiero = infoProyecto.avance_financiero,
            contMegusta = infoProyecto.contMegusta,
            contComentarios = infoProyecto.contComentarios,
            duracion = Convert.ToDecimal(infoProyecto.duracion)
            //tipo_proyecto = infoProyecto.tipo_proyecto,
            //EntesBeneficEncabezado = beneficiarios_encabezado
            //rendiciones = await new RendicionCuentasBLL().ObtenerRendicionesPorProyectoAsync(Id)
          };
        }
      }
      return objReturn;
    }

    public static async Task<List<Sources>> ObtenerFuentesParaProyectoAsync(int Id)
    {
      var objReturn = new List<Sources>();
      List<int> listYears = new List<int>();
      using (var DataModel = new TransparenciaDB())
      {

        listYears = (from p in DataModel.EsquemaFinanciacionProyectos
                     where p.IdProyecto == Id
                     select p.FechaInicioVigencia.Year).Distinct().ToList();

        foreach (int year in listYears)
        {
          var sourcebyYear = await (from financiacion in DataModel.EsquemaFinanciacionProyectos
                                    join fuente in DataModel.Fuentes
                                    on new
                                    {
                                      IdTipoRecurso = financiacion.IdTipoRecurso,
                                      IdTipoEntidad = financiacion.IdTipoEntidad,
                                      IdEntidad = financiacion.IdEntidad
                                    }
                                    equals new
                                    {
                                      IdTipoRecurso = fuente.IdTipoRecurso,
                                      IdTipoEntidad = fuente.IdTipoEntidad,
                                      IdEntidad = fuente.IdEntidad
                                    }
                                    //join seguimientoEsquemaFinanciacionProyecto in DataModel.SeguimientoEsquemaFinanciacionProyecto
                                    join seguimientoEsquemaFinanciacionProyecto in DataModel.SeguimientoEsquemaFinanciacionProyectos
                                    on new
                                    {
                                      IdProyecto = financiacion.IdProyecto,
                                      IdTipoRecurso = financiacion.IdTipoRecurso,
                                      IdTipoEntidad = financiacion.IdTipoEntidad,
                                      IdEntidad = financiacion.IdEntidad,
                                      FechaInicioVigencia = financiacion.FechaInicioVigencia,
                                      FechaFinalVigencia = financiacion.FechaFinalVigencia
                                    }
                                    equals new
                                    {
                                      IdProyecto = seguimientoEsquemaFinanciacionProyecto.IdProyecto,
                                      IdTipoRecurso = seguimientoEsquemaFinanciacionProyecto.IdTipoRecurso,
                                      IdTipoEntidad = seguimientoEsquemaFinanciacionProyecto.IdTipoEntidad,
                                      IdEntidad = seguimientoEsquemaFinanciacionProyecto.IdEntidad,
                                      FechaInicioVigencia = seguimientoEsquemaFinanciacionProyecto.FechaInicioReporte,
                                      FechaFinalVigencia = seguimientoEsquemaFinanciacionProyecto.FechaFinalReporte
                                    }
                                    into proyectoEsquemafinannciacionSeguimiento
                                    from seguimientoEsquemaFinanciacionProyecto in proyectoEsquemafinannciacionSeguimiento.DefaultIfEmpty()
                                    where financiacion.IdProyecto == Id && financiacion.FechaInicioVigencia.Year == year
                                    select new SourcesPerYear
                                    {
                                      name = fuente.NombreTipoRecurso + " - " + fuente.NombreEntidad,
                                      total = financiacion.ValorAprobado,
                                      current = seguimientoEsquemaFinanciacionProyecto != null ? (decimal)seguimientoEsquemaFinanciacionProyecto.ValorReportado : 0

                                    }).ToListAsync();

          foreach (var registro in sourcebyYear)
          {
            if (registro.total > 0)
            {
              registro.PorcentajeEjecutado = Convert.ToDecimal(ManejoPorcentajes.ValorPorcentajeString(Convert.ToDecimal(registro.total), Convert.ToDecimal(registro.current)).Replace("%", string.Empty).Trim()); //Convert.ToInt32((registro.goal - registro.current) / registro.goal);    
            }
          }
          objReturn.Add(new Sources { year = year, sourcesperyear = sourcebyYear });
        }
      }
      return objReturn;


    }


    public static List<ComponentesProy> ObtenerComponentesProy(int Id)
    {
      List<ComponentesProy> objReturn = new List<ComponentesProy>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = (from componentes in DataModel.VwComponentesActividades
                     where componentes.IdProyecto == Id
                     group componentes by new
                     {
                       componentes.IdComponente,
                       componentes.Componente
                     } into g
                     select new ComponentesProy
                     {
                       Id = (int)g.Key.IdComponente,
                       Nombre = g.Key.Componente
                     }).OrderBy(p => p.Codigo).ToList();
      }
      return objReturn;

    }

    public static List<Period> ObtenerPeriodosFuentes(int Id)
    {
      List<Period> objReturn = new List<Period>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = (from fuentes in DataModel.VwFuentesFinanciacion
                     where fuentes.IdProyecto == Id
                     group fuentes by new
                     {
                       fuentes.Periodo
                     } into g
                     select new Period
                     {
                       id = (int)g.Key.Periodo,
                       name = g.Key.Periodo.ToString()
                     }).OrderBy(p => p.id).ToList();
      }
      return objReturn;
    }


    public List<ComponentesProy> GetActividadesByComponente(int id_proy, string cod_componente)
    {
      List<ComponentesProy> objReturn = new List<ComponentesProy>();
      List<ComponentesProy> objReturn_aux = new List<ComponentesProy>();
      using (var DataModel = new TransparenciaDB())
      {

        objReturn = (from componentes in DataModel.VwComponentesActividades
                       //where componentes.IdProyecto == id_proy && componentes.CodigoComponente.Equals(cod_componente)
                     where componentes.IdProyecto == id_proy && componentes.IdComponente.ToString().Equals(cod_componente)
                     group componentes by new
                     {
                       componentes.CodigoComponente,
                       componentes.Componente
                     } into g
                     select new ComponentesProy
                     {
                       Codigo = g.Key.CodigoComponente,
                       Nombre = g.Key.Componente,
                       CodigoNum = g.Key.CodigoComponente.Substring(1, g.Key.CodigoComponente.Length)
                     }).ToList();

        objReturn_aux = objReturn.OrderBy(o => Convert.ToInt16(o.CodigoNum)).ToList();
      }
      return objReturn_aux;

    }

    public List<itemFuentes> GetFuentesByPeriodo(int id_proy, int idPeriodo)
    {
      List<itemFuentes> objReturn = new List<itemFuentes>();
      using (var DataModel = new TransparenciaDB())
      {
        objReturn = (from fuentes in DataModel.VwFuentesFinanciacions2024
                     where fuentes.IdProyecto == id_proy && fuentes.Periodo.HasValue && fuentes.Periodo.Value == idPeriodo
                     select new itemFuentes
                     {
                       Id = fuentes.IdFuenteFinanciacion,
                       Nombre = fuentes.OrganismoFinanciador + "-" + fuentes.FuenteFinanciacion,
                       Porcentaje = fuentes.ValorVigente.HasValue && fuentes.ValorEjecutado.HasValue && fuentes.ValorVigente.Value > 0 ? Math.Round(((fuentes.ValorEjecutado.Value / fuentes.ValorVigente.Value) * 100), 2) : 0,
                       ValorEjecutado = fuentes.ValorEjecutado ?? 0,
                       ValorPresupuesto = fuentes.ValorVigente ?? 0
                     }).OrderBy(p => p.Id).ToList();
      }
      return objReturn;

    }

    public static List<itemActores> ObtenerActoresByCategoriaProy(int id_proy)
    {
      List<itemActores> objReturn = new List<itemActores>();
      using (var DataModel = new TransparenciaDB())
      {
        //Select a.IDProyecto,a.IDActor,a.IdRol,b.NombreActor actor, c.NombreRol grupo from ActorXProyecto a
        // inner join Actor b on a.IDActor = b.IdActor
        // inner join Rol c on a.IDRol = c.IdRol And b.IDRol = c.IdRol
        //where a.IDProyecto = 22102
        objReturn = (from info in DataModel.ActorXProyectos
                     join actores in DataModel.Actors on info.IDActor equals actores.IdActor
                     join grupos in DataModel.Rols on new { x1 = info.IDRol, x2 = actores.IDRol } equals new { x1 = grupos.IdRol, x2 = grupos.IdRol }
                     where info.IDProyecto == id_proy
                     select new itemActores
                     {
                       idCategoria = grupos.IdRol,
                       Categoria = grupos.IdRol.ToString() + '|' + grupos.NombreRol,
                       idActor = actores.IdActor,
                       nomActor = actores.NombreActor

                     }).OrderBy(x => x.Categoria).ThenBy(y => y.nomActor).ToList();
      }
      return objReturn;
    }
    public static List<Period> ObtenerAniosFuentesFinanciacionPorProyecto(int id)
    {
      List<Period> rta = new();
      using (var DataModel = new TransparenciaDB())
      {
        //Informacion basica del proyecto SACAMOS: 
        rta = (from fuente in DataModel.VwFuentesFinanciacions2024
               where fuente.IdProyecto == id
               && fuente.Periodo.HasValue
               select new Period
               {
                 id = fuente.Periodo.Value,
                 name = fuente.Periodo.Value.ToString()
               }).Distinct().ToList();
        if (rta.Count == 0) rta.Add(new Period() { id = 2024, name = "2024" });
      }
      if (rta.Count > 1) rta = new List<Period>(rta.OrderByDescending(x => x.id));
      return rta;
    }

    public static List<Period> ObtenerAniosFuentesFinanciacionPorProyectoInversion(int id)
    {
      List<Period> rta = [];
      using (var DataModel = new TransparenciaDB())
      {
        //Informacion basica del proyecto SACAMOS: 
        rta = (from fuente in DataModel.VwProyectosInversionPresupuestoxVigencias
               where fuente.IdProyecto == id.ToString()
               select new Period
               {
                 id = fuente.Vigencia,
                 name = fuente.Vigencia.ToString()
               }).Distinct().ToList();
      }
      if (rta.Count > 1) rta = new List<Period>(rta.OrderBy(x => x.id));
      return rta;
    }

    public static List<Item> ObtenerPlanesMetaProductoPorProyectoInversion(int id)
    {
      List<Item> rta = [];
      using (var DataModel = new TransparenciaDB())
      {
        //Informacion basica del proyecto SACAMOS: 
        rta = (from actividad in DataModel.VwActividadesPries
               where actividad.IdProyecto == id.ToString()
               select new Item
               {
                 Id = actividad.PlanMetaProductoId,
                 Nombre = actividad.PlanMetaProductoNombre
               }).Distinct().ToList();
      }
      if (rta.Count > 1) rta = new List<Item>(rta.OrderBy(x => x.Nombre));
      return rta;
    }

    public static List<Item> EstadosProyectos()
    {
      List<Item> rta = [];
      using (var DataModel = new TransparenciaDB())
      {
        //Informacion basica del proyecto SACAMOS: 
        rta = [.. (from actividad in DataModel.Estados
               select new Item
               {
                 Id = actividad.IdEstado.ToString(),
                 Nombre = actividad.NombreEstado
               }).Distinct().OrderBy(x=>x.Nombre)];
        rta.Insert(0,new Item() { Id = "0", Nombre = "TODOS" });
      }
      return rta;
    }

    public static List<Item> ObtenerHorizontesProyectosInversionAsync()
    {
      List<Item> rta = [];
      using (var DataModel = new TransparenciaDB())
      {
        //Informacion basica del proyecto SACAMOS: 
        rta = [.. (from proyecto in DataModel.Proyectos
                   where proyecto.Horizonte!=null
               select new Item
               {
                 Id = proyecto.Horizonte.ToString(),
                 Nombre = proyecto.Horizonte.ToString().ToUpper().Trim()
               }).Distinct().OrderBy(x=>x.Nombre)];
        rta.Insert(0, new Item() { Id = "0", Nombre = "TODOS" });
      }
      return rta;
    }



    public static List<ModeloAvanceFinancieroPorComponenteProducto> ObtenerAvanceFisicoPorComponenteProductoFaseProyecto(int id)
    {
      List<ModeloAvanceFinancieroPorComponenteProducto> objReturn = new();
      using (var DataModel = new TransparenciaDB())
      {
        objReturn = (from transferencias in DataModel.VwSeguimientoAvanceFisicos
                     where transferencias.IdProyecto == id.ToString()
                     select new ModeloAvanceFinancieroPorComponenteProducto
                     {
                       //IdentificadorFase = transferencias.IdFase,
                       //Fase = transferencias.Fase,
                       //CodComponente = transferencias.IdComponente.HasValue ? transferencias.IdComponente.Value : 0,
                       //Componente = transferencias.Componente,
                       //idProducto = transferencias.IdProducto,
                       //Producto = transferencias.Producto,
                       //UnidadProducto = transferencias.UnidadProducto,
                       //Meta = transferencias.MetaProgramada,
                       //Ejecutado = transferencias.MetaEjecutada,
                       AvanceFisico = transferencias.PorcentajeAvanceFisico,
                       Componente = string.Empty
                     }
                          ).OrderBy(m => new { m.IdentificadorFase, m.CodComponente, m.idProducto }).ToList();

        foreach (var obj in objReturn)
          obj.Componente = obj.Componente.Replace("\"", string.Empty);
      }
      return objReturn;
    }
    public ModelProcesoContratacionAnios ObtenerAnniosProcesoContratacion(int? IdProyecto)
    {
      ModelProcesoContratacionAnios _objreturn = new ModelProcesoContratacionAnios();
      int? IdProyect = null;
      if (IdProyecto != null && IdProyecto != 0) { IdProyect = IdProyecto; }
      using (var DataModel = new TransparenciaDB())
      {

        _objreturn.Detalles = (from cont in DataModel.VwContratosXProyectoInvDetalles
                               where (cont.IdProyecto == IdProyect || IdProyect == null)
                               group cont by new { cont.AnioUltimaActualizacion } into g
                               orderby g.Key.AnioUltimaActualizacion descending
                               select new AnioProcesoContratacion
                               {
                                 anio = (int)g.Key.AnioUltimaActualizacion
                               }).Distinct().OrderBy(x => x.anio).ToList();
      }
      return _objreturn;
    }
    public ModelProcesosContratacionData ObtenerInformacionProcesosContratacionPorFiltros(ProcesosContratacionFiltros filtros)
    {
      ModelProcesosContratacionData _objreturn = new ModelProcesosContratacionData();
      int? Annio = null;
      int? IdProyecto = null;
      String NombreProceso = null;



      if (filtros.Annio > 0) { Annio = filtros.Annio; }
      if (filtros.IdProyecto > 0) { IdProyecto = filtros.IdProyecto; }
      if (filtros.NombreProceso != null && filtros.NombreProceso.Trim() != "") { NombreProceso = filtros.NombreProceso; }
      using (var DataModel = new TransparenciaDB())
      {
        try
        {
          _objreturn.CantidadTotalRegistros = (from cont in DataModel.VwContratosXProyectoInvDetalles
                                               where (cont.AnioUltimaActualizacion == Annio || Annio == null)
                                                                                      && (cont.DescripcionProceso.Contains(NombreProceso)
                                                                                       || cont.CodigoProceso.TrimStart() == NombreProceso || NombreProceso == null)
                                                                                      && (cont.IdProyecto == IdProyecto || IdProyecto == null)
                                                                                      && cont.ValorContratado != 0
                                                                                       && cont.CodigoOrigenInformacion == 0
                                               let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.Comprador).ThenBy(cont.CodigoProceso).ThenBy(cont.OrigenInformacion).ToValue()
                                               orderby NUMBER descending
                                               select NUMBER
                         ).First();
        }
        catch
        {
          _objreturn.CantidadTotalRegistros = 0;
        }

        _objreturn.Data = (from cont in DataModel.VwContratosXProyectoInvDetalles
                           where
                           (cont.AnioUltimaActualizacion == Annio || Annio == null)
                           && (cont.DescripcionProceso.Contains(NombreProceso)
                           || cont.CodigoProceso.TrimStart() == NombreProceso || NombreProceso == null)
                          && (cont.IdProyecto == IdProyecto || IdProyecto == null)
                           && cont.ValorContratado != 0
                            && cont.CodigoOrigenInformacion == 0
                           let NUMBER = Sql.Ext.DenseRank().Over().OrderBy(cont.Comprador).ThenBy(cont.CodigoProceso).ThenBy(cont.OrigenInformacion).ToValue()
                           where
                           NUMBER > ((filtros.NumeroPagina - 1) * filtros.RegistrosPorPagina)
                           && NUMBER <= (filtros.NumeroPagina * filtros.RegistrosPorPagina)
                           select new ContratosData
                           {
                             AnioUltimaActualizacion = cont.AnioUltimaActualizacion,
                             DescripcionProceso = cont.DescripcionProceso,
                             EstadoProceso = cont.EstadoProceso,
                             CodigoContrato = cont.CodigoContrato,
                             CodigoProceso = cont.CodigoProceso,
                             CodigoProveedor = cont.CodigoProveedor,
                             TipoCodigoProveedor = cont.TipoCodigoProveedor,
                             Contratista = cont.Contratista,
                             ValorPlaneado = (double)cont.ValorPlaneado,
                             ValorAdjudicado = cont.ValorAdjudicado,
                             ValorContratado = (double)cont.ValorContratado,
                             MonedaContrato = cont.MonedaContrato,
                             UrlContrato = cont.UrlContrato.ToString(),
                             CodigoComprador = cont.CodigoComprador,
                             Comprador = cont.Comprador,
                             DocURL = cont.DocURL,
                             OrigenInformacion = cont.OrigenInformacion,
                             FechaInicioContrato = cont.FechaInicioContrato,
                             FechaFinContrato = cont.FechaFinContrato,
                             FechaInicioEjecucionContrato = cont.FechaInicioEjecucionContrato,
                             FechaFinEjecucionContrato = cont.FechaFinEjecucionContrato,
                             FechaEstimadaAdjudicacion = cont.FechaEstimadaAdjudicacion,
                             FechaIncioPublicacionProceso = cont.FechaIncioPublicacionProceso,
                             FechaInicioRecepcionOfertas = cont.FechaInicioRecepcionOfertas,
                             DescripcionContrato = cont.DescripcionContrato

                           }
                         ).ToList();


      }
      return _objreturn;
    }

    public ModelDataPresupuestoAnualProyecto GetInformacionGeneralProyectoPorAnioPresupuestal(int proyectoId, int anio)
    {
      ModelDataPresupuestoAnualProyecto rta = new() { EjecucionFinanciera = 0, EjecucionFisica = 0, PropuestoAsignadoVigencia = 0, PropuestoEjecutado = 0, PropuestoObligado = 0 };
      using (var DataModel = new TransparenciaDB())
      {
        var data = (from fuente in DataModel.VwFuentesFinanciacions2024
                    where fuente.IdProyecto == proyectoId && fuente.Periodo.HasValue && fuente.Periodo.Value == anio
                    select new ModelDataPresupuestoAnualProyecto
                    {
                      PropuestoAsignadoVigencia = fuente.ValorVigente ?? 0,
                      PropuestoEjecutado = fuente.ValorEjecutado ?? 0,
                      PropuestoObligado = fuente.ValorObligado ?? 0
                    }).Distinct().ToList();
        var dataFisica = (from seguimiento in DataModel.VwSeguimientoAvanceFisicos
                          where seguimiento.IdProyecto == proyectoId.ToString() && seguimiento.Periodo == anio
                          select new ModelDataPresupuestoAnualProyecto
                          {
                            EjecucionFisica = seguimiento.PorcentajeAvanceFisico ?? 0,
                          }).Distinct().ToList();
        if (data != null && data.Count > 0)
        {
          rta = new ModelDataPresupuestoAnualProyecto() { PropuestoAsignadoVigencia = data.Sum(x => x.PropuestoAsignadoVigencia), PropuestoEjecutado = data.Sum(x => x.PropuestoEjecutado), PropuestoObligado = data.Sum(x => x.PropuestoObligado) };
          rta.EjecucionFinanciera = rta.PropuestoAsignadoVigencia == 0 ? 0 : Math.Round(rta.PropuestoObligado * 100 / rta.PropuestoAsignadoVigencia, 2);
        }
        if (dataFisica != null && dataFisica.Count > 0) rta.EjecucionFisica = dataFisica.Sum(x => x.EjecucionFisica);
        rta.PropuestoEjecutado = Math.Round(rta.PropuestoEjecutado / 1000000, 3);
        rta.PropuestoAsignadoVigencia = Math.Round(rta.PropuestoAsignadoVigencia / 1000000, 3);
        rta.PropuestoObligado = Math.Round(rta.PropuestoObligado / 1000000, 3);
      }
      return rta;
    }

    public ModelDataPresupuestoAnualProyecto GetInformacionGeneralProyectoInversionPorAnioPresupuestal(int proyectoId, int anio)
    {
      ModelDataPresupuestoAnualProyecto rta = new() { EjecucionFinanciera = 0, EjecucionFisica = 0, PropuestoAsignadoVigencia = 0, PropuestoEjecutado = 0, PropuestoObligado = 0 };
      using (var DataModel = new TransparenciaDB())
      {
        var data = (from fuente in DataModel.VwProyectosInversionPresupuestoxVigencias
                    where fuente.IdProyecto == proyectoId.ToString() && fuente.Vigencia == anio
                    select new ModelDataPresupuestoAnualProyecto
                    {
                      PropuestoAsignadoVigencia = fuente.ValorProgramado ?? 0,
                      PropuestoEjecutado = fuente.ValorGirado ?? 0,
                      PropuestoObligado = fuente.ValorComprometido ?? 0,
                    }).Distinct().ToList();
        if (data != null && data.Count > 0)
        {
          rta = new ModelDataPresupuestoAnualProyecto() { PropuestoAsignadoVigencia = data.Sum(x => x.PropuestoAsignadoVigencia), PropuestoEjecutado = data.Sum(x => x.PropuestoEjecutado), PropuestoObligado = data.Sum(x => x.PropuestoObligado) };
          rta.EjecucionFinanciera = rta.PropuestoObligado == 0 ? 0 : Math.Round(rta.PropuestoEjecutado * 100 / rta.PropuestoAsignadoVigencia, 2);
        }
        rta.PropuestoEjecutado = Math.Round(rta.PropuestoEjecutado, 3);
        rta.PropuestoAsignadoVigencia = Math.Round(rta.PropuestoAsignadoVigencia, 3);
        rta.PropuestoObligado = Math.Round(rta.PropuestoObligado, 3);
      }
      return rta;
    }
    public List<Item> GetActividadesPorProyectoMeta(int proyectoId, string meta)
    {
      List<Item> rta = [];
      using (var DataModel = new TransparenciaDB())
      {
        rta = (from proyecto in DataModel.VwActividadesPries
                    where proyecto.IdProyecto == proyectoId.ToString() && proyecto.PlanMetaProductoId == meta
                    select new Item
                    {
                      Id= proyecto.ActividadCodigo,
                      Nombre= proyecto.ActividadNombre//.Substring(4)
                    }).Distinct().OrderBy(x=>x.Nombre).ToList();
      }
      return rta;
    }
    public ActividadProyectoInversion GetActividadesPorProyectoMetaActividad(int proyectoId, string meta, string actividad)
    {
      ActividadProyectoInversion rta =new();
      using (var DataModel = new TransparenciaDB())
      {
        var actividadPorMetaProyecto = (from acti in DataModel.VwActividadesPries
                                        where acti.IdProyecto == proyectoId.ToString() && acti.PlanMetaProductoId == meta && acti.ActividadCodigo == actividad
                                        select acti).FirstOrDefault();
        if (actividadPorMetaProyecto != null)
        {
          rta.Nombre = actividadPorMetaProyecto.ActividadNombre;
          rta.AvanceFinancieroGirado = actividadPorMetaProyecto.ValorGiradoTotal ??= 0;
          rta.AvanceFinancieroComprometido = actividadPorMetaProyecto.ValorComprometidoTotal ??= 0;
          rta.AvanceFinancieroProgramado = actividadPorMetaProyecto.ValorProgramadoTotal ??= 0;
          rta.AvanceFisicoMagnitudEntregada= actividadPorMetaProyecto.MagnitudEntregadoTotal ??= 0;
          rta.AvanceFisicoMagnitudProgramada = actividadPorMetaProyecto.MagnitudProgramadaTotal ??= 0;
          rta.AvanceFisicoPorcentajeMagnitudComprometida = (actividadPorMetaProyecto.MagnitudPorcentajeComprometidoTotal ??=0)/100;
          rta.AvanceFisicoPorcentajeMagnitudEntregada = (actividadPorMetaProyecto.MagnitudPorcentajeEntregadoTotal ??= 0)/100;
          var actividadesPorPeriodo = (from acti in DataModel.VwActividadesxPresupuestoxAvanceFisicoxVigenciaPries
                                       where acti.IdProyecto == proyectoId.ToString() && acti.PlanMetaProductoId == meta && acti.ActividadCodigo == actividad
                                       select acti).OrderBy(x => x.Vigencia).ToList();
          foreach (var actividadPorPeriodo in actividadesPorPeriodo)
          {
            decimal valorProgramado = actividadPorPeriodo.ValorProgramado ??= 0;
            decimal valorGirado = actividadPorPeriodo.ValorGirado ??= 0;
            rta.Detalle.Add(new DetalleActividadProyectoInversion
            {
              Anio = actividadPorPeriodo.Vigencia,
              AvanceFinancieroComprometido = actividadPorPeriodo.ValorCompromiso ??= 0,
              AvanceFinancieroGirado = valorGirado,
              AvanceFinancieroProgramado = valorProgramado,
              AvanceFisicoMagnitudProgramada = actividadPorPeriodo.MagnitudProgramada ??= 0,
              AvanceFisicoMagnitudComprometida = actividadPorPeriodo.MagnitudComprometido ??=0,
              AvanceFinancieroPorcentaje = valorProgramado != 0 ? valorGirado*100/ valorProgramado: 0,
              AvanceFisicoPorcentajeMagnitudComprometida = actividadPorPeriodo.MagnitudPorcentajeComprometido ??= 0
            });
          }
        }

      }
      return rta;
    }
    public List<ModelDataInformacionPresupuestalPorClasificacionDeFondo> GetInformacionPresupuestalProyectoAnioPorClasificacionDeFondo(int proyectoId, int anio)
    {
      List<ModelDataInformacionPresupuestalPorClasificacionDeFondo> rta = new();
      using (var DataModel = new TransparenciaDB())
      {
        var data = (from fuente in DataModel.VwFuentesFinanciacionPries
                    where fuente.IdProyecto == proyectoId && fuente.Periodo != null && fuente.Periodo == anio.ToString()
                    select new ModelDataInformacionPresupuestalPorClasificacionDeFondo
                    {
                      ClasificacionFondo = fuente.ClasificacionFondo,
                      PresupuestoAsignado = fuente.ValorVigente ?? 0,
                      PresupuestoObligado = fuente.ValorGirado ?? 0,
                    }).ToList();
        if (data != null && data.Count > 0)
        {
          List<ModelDataInformacionPresupuestalPorClasificacionDeFondo> dataByClasificacion = (from dt in data
                                                                                               group dt by new
                                                                                               {
                                                                                                 dt.ClasificacionFondo
                                                                                               } into g
                                                                                               select new ModelDataInformacionPresupuestalPorClasificacionDeFondo()
                                                                                               {
                                                                                                 ClasificacionFondo = g.Key.ClasificacionFondo,
                                                                                                 PresupuestoAsignado = Math.Round(g.Sum(x => x.PresupuestoAsignado) / 1000000, 3),
                                                                                                 PresupuestoObligado = Math.Round(g.Sum(x => x.PresupuestoObligado) / 1000000, 3)
                                                                                               }).ToList();
          foreach (ModelDataInformacionPresupuestalPorClasificacionDeFondo dtByClasificacion in dataByClasificacion)
          {
            rta.Add(new ModelDataInformacionPresupuestalPorClasificacionDeFondo() { ClasificacionFondo = dtByClasificacion.ClasificacionFondo, IdClasificacion = dtByClasificacion.IdClasificacion, PresupuestoAsignado = dtByClasificacion.PresupuestoAsignado, PresupuestoObligado = dtByClasificacion.PresupuestoObligado, Porcentaje = dtByClasificacion.PresupuestoAsignado == 0 ? 0 : Math.Round(dtByClasificacion.PresupuestoObligado * 100 / dtByClasificacion.PresupuestoAsignado, 2) });
          }
          if (rta.Count > 1) rta = rta.OrderByDescending(x => x.PresupuestoAsignado).ToList();
        }
      }
      return rta;
    }

    public static string ObtenerNombreOrganismoFinanciadorPorProyecto(int proyectoId)
    {
      string rta = string.Empty;
      using (var DataModel = new TransparenciaDB())
      {
        var data = (from fuente in DataModel.VwFuentesFinanciacions2024
                    where fuente.IdProyecto == proyectoId && fuente.OrganismoFinanciador != null
                    select new
                    {
                      fuente.OrganismoFinanciador
                    }).Distinct().ToList();
        if (data != null && data.Count > 0)
        {
          string organismoFinanciador = data.First().OrganismoFinanciador.ToUpper().Trim();
          if (Configuration != null)
          {
            rta = Convert.ToString(Configuration["Proyectos:" + organismoFinanciador]);
          }
          else
          {
            if (organismoFinanciador == "ORGANISMO") rta = "Definido por el ente gestor";
            else if (organismoFinanciador == "TERRITORIO") rta = "Definido por la comunidad en el presupuesto participativo";
          }
        }
      }
      return rta;
    }


    public static List<PlanOrdenamientoTerritorialProyectos> ObtenerPlanOrdenamientoTerritorialProyectos(int id_proy)
    {
      List<PlanOrdenamientoTerritorialProyectos> objReturn = new List<PlanOrdenamientoTerritorialProyectos>();
      using (var DataModel = new TransparenciaDB())
      {
        objReturn = (from info in DataModel.VwPlanOrdenamientoTerritorialProyectosPots
                     where info.IdProyecto == id_proy
                     select new PlanOrdenamientoTerritorialProyectos
                     {
                       IdProyecto = info.IdProyecto,
                       CodigoBPIN = info.CodigoBPIN,
                       CodigoObjetivoEstrategicoPOT = info.CodigoObjetivoEstrategicoPOT,
                       ObjetivoEstrategicoPOT = info.ObjetivoEstrategicoPOT,
                       CodigoEstrategiaPOT = info.CodigoEstrategiaPOT,
                       EstrategiaPOT = info.EstrategiaPOT,
                       CodigoProgramaPOT = info.CodigoProgramaPOT,
                       ProgramaPOT = info.ProgramaPOT,
                       CodigoSubProgramaPOT = info.CodigoSubProgramaPOT,
                       SubProgramaPOT = info.SubProgramaPOT,
                       CodigoMetaPOT = info.CodigoMetaPOT,
                       MetaSubprogramaPOT = info.MetaSubprogramaPOT
                     }).OrderBy(x => x.EstrategiaPOT).ToList();
      }
      return objReturn;
    }

    public static List<PlanDesarrolloProyectos> ObtenerPlanDesarrolloProyectos(int id_proy)
    {
      List<PlanDesarrolloProyectos> objReturn = new List<PlanDesarrolloProyectos>();
      using (var DataModel = new TransparenciaDB())
      {
        objReturn = (from info in DataModel.VwPlanDesarrolloProyectoPots
                     where info.IdProyecto == id_proy
                     select new PlanDesarrolloProyectos
                     {
                       IdProyecto = info.IdProyecto,
                       CodigoBPIN = info.CodigoBPIN,
                       CodigoObjetivoPlanDesarrollo = info.CodigoObjetivoPlanDesarrollo,
                       ObjetivoPlanDesarrollo = info.ObjetivoPlanDesarrollo,
                       CodigoProgramaPOT = info.CodigoProgramaPOT,
                       ProgramaPlanDesarrollo = info.ProgramaPlanDesarrollo,
                       CodigoMetaProductoPlanDesarrollo = info.CodigoMetaProductoPlanDesarrollo,
                       MetaPlanDesarrollo = info.MetaPlanDesarrollo,
                       ProgramadoMeta = info.ProgramadoMeta,
                       Anio = info.Anio
                     }).OrderBy(x => x.CodigoObjetivoPlanDesarrollo).ToList();
      }
      return objReturn;
    }

    public List<InfoProyectos> ObtenerListadoProyectosPry(string id_proy)
    {
      List<InfoProyectos> objReturn = new List<InfoProyectos>();
      using (var DataModel = new TransparenciaDB())
      {
        objReturn = (from a in DataModel.VwProyectosPOTxProyectosInvs
                     where a.IdProyectoPOT == id_proy
                     from c in DataModel.VwProyectosAprobadosInvPries
                     .Where(c => c.IdProyecto.ToString() == a.CodigoProyectoInv)
                     .DefaultIfEmpty() // LEFT JOIN 
                     select new InfoProyectos
                     {
                       IdProyecto = c.IdProyecto,
                       NombreSector = c.NombreSector,
                       NombreProyecto = c.NombreProyecto,
                       EntidadEjecutora = c.EntidadEjecutora,
                       CodigoSnip = a.CodigoBPINProyectoInv

                     }).OrderBy(x => x.IdProyecto).ToList();
      }
      return objReturn;
    }


    public ModelLocationProjectInv ObtenerListadoProyectosPotByProyectoInversionId(string idProyectoInversion,string idEstado, int pagina, int tamanoPagina)
    {
      ModelLocationProjectInv objReturn = new() { InvProjects = [] };
      idEstado ??= string.Empty;
      using (var DataModel = new TransparenciaDB())
      {
        objReturn.InvProjects = [.. (from a in DataModel.VwProyectosPOTxProyectosInvs
                                        join c in DataModel.VwProyectosAprobadosInvs on a.IdProyectoPOT equals c.IdProyecto.ToString()
                                        where a.CodigoProyectoInv == idProyectoInversion
                                        select new InfoProyectos
                                        {
                                          IdProyecto = c.IdProyecto,
                                          TipoProyecto = c.TipoProyecto,
                                          NombreProyecto = c.NombreProyecto,
                                          HorizontePot = c.Horizonte,
                                          Estado = c.NombreEstado,
                                          IdEstado= c.IdEstado.ToString()
                                        }).OrderBy(x => x.IdProyecto)];
        if (objReturn.InvProjects != null && objReturn.InvProjects.Count > 0 && idEstado != "0") objReturn.InvProjects = objReturn.InvProjects.Where(x => x.IdEstado == idEstado).ToList();
        objReturn.TotalProjects = objReturn.InvProjects.Count;
        if (objReturn.InvProjects != null && objReturn.InvProjects.Count > 0) objReturn.InvProjects = objReturn.InvProjects.Skip((pagina - 1) * tamanoPagina).Take(tamanoPagina).ToList();
      }
      return objReturn;
    }

    public ModelLocationProjectInv ObtenerListadoProyectosPotByProyectoInversionIdEstadoHorizonte(string idProyectoInversion, string idEstado, string horizonte, int pagina, int tamanoPagina)
    {
      ModelLocationProjectInv objReturn = new() { InvProjects = [] };
      idEstado ??= string.Empty;
      horizonte ??= string.Empty;
      using (var DataModel = new TransparenciaDB())
      {
        objReturn.InvProjects = [.. (from a in DataModel.VwProyectosPOTxProyectosInvs
                                        join c in DataModel.VwProyectosAprobadosInvs on a.IdProyectoPOT equals c.IdProyecto.ToString()
                                        where a.CodigoProyectoInv == idProyectoInversion && c.Horizonte!=null
                                        select new InfoProyectos
                                        {
                                          IdProyecto = c.IdProyecto,
                                          TipoProyecto = c.TipoProyecto,
                                          NombreProyecto = c.NombreProyecto,
                                          HorizontePot = c.Horizonte,
                                          Estado = c.NombreEstado,
                                          IdEstado= c.IdEstado.ToString()
                                        }).OrderBy(x => x.NombreProyecto)];
        if (objReturn.InvProjects != null && objReturn.InvProjects.Count > 0 && idEstado != "0") objReturn.InvProjects = objReturn.InvProjects.Where(x => x.IdEstado == idEstado).ToList();
        if (objReturn.InvProjects != null && objReturn.InvProjects.Count > 0 && horizonte != "0") objReturn.InvProjects = objReturn.InvProjects.Where(x => x.HorizontePot.ToUpper().Trim() == horizonte.ToUpper().Trim()).ToList();
        objReturn.TotalProjects = objReturn.InvProjects.Count;
        if (objReturn.InvProjects != null && objReturn.InvProjects.Count > 0) objReturn.InvProjects = objReturn.InvProjects.Skip((pagina - 1) * tamanoPagina).Take(tamanoPagina).ToList();
      }
      return objReturn;
    }


  }

}