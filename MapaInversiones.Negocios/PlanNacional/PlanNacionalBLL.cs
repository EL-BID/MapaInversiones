using System;
using System.Collections.Generic;
using System.Linq;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Negocios.PlanNacional
{
  public class PlanNacionalBLL: IPlanNacionalBLL
  {
    private readonly TransparenciaDB _connection;

    public PlanNacionalBLL(TransparenciaDB connection)
    {
      _connection = connection;
    }
   
    /// <summary>
    /// Datos para treemap presupuestado y vista plan Nacional
    /// </summary>
    /// <param name="idEjeEstrategico">Es el id del eje estratégico</param>
    /// <returns>Un listado con cada objetivo general y sus respectivos objetivos específicos</returns>
    public List<ObjetivosGeneralPorEjeEstrategico> ObtenerObjetivosPorEjeEstrategico(int idEjeEstrategico)
    {
      List<ObjetivosGeneralPorEjeEstrategico> objReturn = new List<ObjetivosGeneralPorEjeEstrategico>();
      var objetivosQuery = (from info in _connection.VinculacionIndicadoresPNDXEntidadesStps0    //VinculacionIndicadoresPNDXEntidadesStp //VwObjetivosPNDStp
                            where info.CodObjetivoEstrategico.HasValue && info.CodEjeEstrategico.HasValue && info.CodEjeEstrategico.Value == idEjeEstrategico
                            select new ObjetivosGeneralPorEjeEstrategico {
                              Id= info.CodObjetivoEstrategico.Value,
                              Nombre= info.NombreObjetivoEstrategico,
                              Descripcion=info.DescripcionObjetivoEstrategico,
                              Ods= new List<AlineacionOds>()
                            }
                           ).Distinct().OrderBy(x=>x.Nombre).ToList();
      for (var j = 0; j < objetivosQuery.Count; j++) {
        var alineacionOds = (from info in _connection.ConsultaVinculacionPNDPresupuestoXEntidadStp//   VinculacionIndicadoresPNDPresupuestoXEntidadesSTPV2 //VwObjetivosPNDStp
                             where info.CodODS.HasValue && info.CodObjetivoEstrategico.HasValue && info.CodEjeEstrategico.HasValue && info.CodEjeEstrategico.Value == idEjeEstrategico && info.CodObjetivoEstrategico == objetivosQuery[j].Id
                             select new AlineacionOds {
                               CodOds = info.CodODS,
                               Nombre = info.NombreODS
                             }
                           ).Distinct().OrderBy(x => x.CodOds.Value).ToList();
        objetivosQuery[j].Ods = alineacionOds;
      }
      foreach (var objetivoQuery in objetivosQuery) {
        var objetivosEspecificosQuery = (from info in _connection.VinculacionIndicadoresPNDXEntidadesStps0  //VinculacionIndicadoresPNDXEntidadesStp //VwObjetivosPNDStp
                                         where info.CodObjetivoEspecifico.HasValue && info.CodObjetivoEstrategico.HasValue &&  info.CodEjeEstrategico.HasValue &&   info.CodEjeEstrategico.Value == idEjeEstrategico && info.CodObjetivoEstrategico.Value == objetivoQuery.Id
                                         select new Modelos.Plan.ObjetivoEspecifico {
                                           Id = info.CodObjetivoEspecifico.Value,
                                           Nombre=  info.NombreObjetivoEspecifico.Trim().Replace(info.CodEjeEstrategico.Value + "." + info.CodObjetivoEstrategico.Value + "." + info.CodObjetivoEspecifico.Value + ".", string.Empty).Trim().Replace(info.CodEjeEstrategico.Value + "." + info.CodObjetivoEstrategico.Value + "." + info.CodObjetivoEspecifico.Value, string.Empty).Trim(),
                                           Codigo= info.CodEjeEstrategico.Value + "." + info.CodObjetivoEstrategico.Value + "." + info.CodObjetivoEspecifico.Value
                                         }
                                        ).Distinct().OrderBy(x => x.Id).ToList();

        objetivoQuery.ObjetivoEspecifico = objetivosEspecificosQuery;
      }
      objReturn = new List<ObjetivosGeneralPorEjeEstrategico>(objetivosQuery);
      return objReturn;
    }

    /// <summary>
    /// Entidades que hacen parte del plan nacional de desarrollo
    /// </summary>
    /// <returns>Un listado con las entidades relacionadas con el plan Nacional de desarrollo</returns>
    public List<InfoEntidad> ObtenerEntidadesPlanNacional()
    {
      List<InfoEntidad> objReturn = new List<InfoEntidad>();
      var entidadesPlanNacional = (from info in _connection.CatalogoEntidades
                                   select new InfoEntidad {
                                     CodEntidad = info.CodigoInstitucion,
                                     Nombre = info.Institucion,
                                   }
                                   ).Distinct().OrderBy(x => x.Nombre).ToList();
      objReturn = new List<InfoEntidad>(entidadesPlanNacional.Count>6 ?  entidadesPlanNacional.OrderBy(x=>x.Nombre).Take(6) : entidadesPlanNacional.OrderBy(x => x.Nombre));
      return objReturn;
    }

    /// <summary>
    /// Entidades que hacen parte del plan nacional de desarrollo sin alcaldías
    /// </summary>
    /// <returns>Un listado con las entidades relacionadas con el plan Nacional de desarrollo sin alcaldías</returns>
    public List<InfoEntidad> ObtenerEntidadesPlanNacionalNoAlcaldias()
    {
      List<InfoEntidad> objReturn = new List<InfoEntidad>();
      var entidadesPlanNacional = (from info in _connection.CatalogoEntidades
                                   where info.Institucion!=null && !info.Institucion.ToUpper().Contains("ALCALD")
                                   select new InfoEntidad
                                   {
                                     CodEntidad = info.CodigoInstitucion,
                                     Nombre = info.Institucion,
                                   }
                                   ).Distinct().OrderBy(x => x.Nombre).ToList();
      objReturn = new List<InfoEntidad>(entidadesPlanNacional.Count > 6 ? entidadesPlanNacional.OrderBy(x => x.Nombre).Take(6) : entidadesPlanNacional.OrderBy(x => x.Nombre));
      return objReturn;
    }

    /// <summary>
    /// Datos para treemap presupuestado y vista plan Nacional
    /// </summary>
    /// <param name="idObjetivoEspecifico">Es el id del eje estratégico</param>
    /// <returns>Un listado con cada objetivo general y sus respectivos objetivos específicos</returns>
    public List<IndicadorObjetivoEspecifico> ObtenerIndicadoresXIdObjetivoEspecifico(int idEje, int idObjetivoEstrategico, int idObjetivoEspecifico)
    {
      List<IndicadorObjetivoEspecifico> objReturn = new List<IndicadorObjetivoEspecifico>();
      var indicadoresQuery = (from info in _connection.VinculacionIndicadoresPNDXEntidadesStps0
                            where info.CodEjeEstrategico.HasValue && info.CodObjetivoEstrategico.HasValue && info.CodObjetivoEspecifico.HasValue &&  info.CodEjeEstrategico.Value == idEje && info.CodObjetivoEstrategico.Value== idObjetivoEstrategico && info.CodObjetivoEspecifico== idObjetivoEspecifico
                            select new IndicadorObjetivoEspecifico {
                              IdIndicador = ((int)info.IdIndicador),
                              Nombre = info.Indicador,//.Replace("/1.",string.Empty)
                              UnidadEscala = info.UnidadEscala,
                              AnioBase=  info.AñoBaseIndicador.HasValue? info.AñoBaseIndicador.Value.ToString() : string.Empty, //Math.Round(info.AñoBaseIndicador.Value,0).ToString()
                              ValorAnioBase = info.ValorInidicador,//info.ValorInidicador.HasValue? Math.Round(info.ValorInidicador.Value,0): info.ValorInidicador,
                              Meta2023 = info.Meta2023.HasValue? Math.Round(info.Meta2023.Value, 2):  info.Meta2023,
                              Meta2030= info.Meta2030.HasValue ? Math.Round(info.Meta2030.Value, 2) : info.Meta2030,
                              Avance= info.Avance.HasValue? Math.Round(info.Avance.Value,2): info.Avance
                            }
                           ).Distinct().OrderBy(x => x.IdIndicador).ToList();
      objReturn = new List<IndicadorObjetivoEspecifico>(indicadoresQuery);
      return objReturn;
    }
  }
}
