using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Plan;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using SolrNet.Commands.Parameters;

namespace PlataformaTransparencia.Negocios.Entidad
{
  public class EntidadBLL : IEntidadBLL
  {
    private readonly TransparenciaDB _connection;

    public EntidadBLL(TransparenciaDB connection)
    {
      _connection = connection;
    }
    public List<infograficoEje> GetGraficaSankey(string codEntidad)
    {
      var objReturn = new List<infograficoEje>();
      //VinculacionPND_Presupuesto_x_Entidad_STP

      var infoQuery = (from info in _connection.ConsultaVinculacionPNDPresupuestoXEntidadStp
                       where info.CodNivelEntidad == codEntidad
                       orderby info.CodEjeEstrategico, info.CodObjetivoEstrategico, info.CodObjetivoEspecifico
                       select new {
                         IdCodEje = info.CodEjeEstrategico.Value,
                         EjeEstrategico = "eje|" + info.NombreEjeEstrategico,
                         IdCodObjEst = info.CodObjetivoEstrategico.Value,
                         NombreObjetivoEstrategico = "est|" + info.NombreObjetivoEstrategico,
                         IdCodObjEsp = info.CodObjetivoEspecifico.Value,
                         NombreObjetivoEspecifico = "esp|" + info.NombreObjetivoEspecifico,
                         AportePresupuesto = info.AportePresupuestalAlObjetivo.Value
                       }
                      ).Distinct().ToList();

      infograficoEje objEje = null;
      infograficoEstrategico objEstrategico = null;
      infograficoEspecifico objEspecifico = null;

      foreach (var fila in infoQuery) {
        objEje = objReturn.Find(p => p.Id == fila.IdCodEje.ToString());
        if (objEje == null) {
          objEje = new infograficoEje();
          objEje.Id = fila.IdCodEje.ToString();
          objEje.Nombre = fila.EjeEstrategico;
          objEje.presupuesto = fila.AportePresupuesto;

          objEstrategico = objEje.Detalles.Find(p => p.Id == fila.IdCodObjEst.ToString());
          if (objEstrategico == null) {
            objEstrategico = new infograficoEstrategico();
            objEstrategico.Id = fila.IdCodObjEst.ToString();
            objEstrategico.Nombre = fila.NombreObjetivoEstrategico;
            objEstrategico.presupuesto = fila.AportePresupuesto;

            objEspecifico = objEstrategico.Detalles.Find(p => p.Id == fila.IdCodObjEsp.ToString());
            if (objEspecifico == null) {
              objEspecifico = new infograficoEspecifico();
              objEspecifico.Id = fila.IdCodObjEsp.ToString();
              objEspecifico.Nombre = fila.NombreObjetivoEspecifico;
              objEspecifico.presupuesto = fila.AportePresupuesto;

              objEstrategico.Detalles.Add(objEspecifico);

            }
            else {
              objEspecifico.presupuesto += fila.AportePresupuesto;

            }

            objEje.Detalles.Add(objEstrategico);
          }
          else {
            objEstrategico.presupuesto += fila.AportePresupuesto;
            objEspecifico = objEstrategico.Detalles.Find(p => p.Id == fila.IdCodObjEsp.ToString());
            if (objEspecifico == null) {
              objEspecifico = new infograficoEspecifico();
              objEspecifico.Id = fila.IdCodObjEsp.ToString();
              objEspecifico.Nombre = fila.NombreObjetivoEspecifico;
              objEspecifico.presupuesto = fila.AportePresupuesto;

              objEstrategico.Detalles.Add(objEspecifico);

            }
            else {
              objEspecifico.presupuesto += fila.AportePresupuesto;

            }

          }

          objReturn.Add(objEje);
        }
        else {
          objEje.presupuesto += fila.AportePresupuesto;
          objEstrategico = objEje.Detalles.Find(p => p.Id == fila.IdCodObjEst.ToString());
          if (objEstrategico == null) {
            objEstrategico = new infograficoEstrategico();
            objEstrategico.Id = fila.IdCodObjEst.ToString();
            objEstrategico.Nombre = fila.NombreObjetivoEstrategico;
            objEstrategico.presupuesto = fila.AportePresupuesto;

            objEspecifico = objEstrategico.Detalles.Find(p => p.Id == fila.IdCodObjEsp.ToString());
            if (objEspecifico == null) {
              objEspecifico = new infograficoEspecifico();
              objEspecifico.Id = fila.IdCodObjEsp.ToString();
              objEspecifico.Nombre = fila.NombreObjetivoEspecifico;
              objEspecifico.presupuesto = fila.AportePresupuesto;

              objEstrategico.Detalles.Add(objEspecifico);

            }
            else {
              objEspecifico.presupuesto += fila.AportePresupuesto;

            }

            objEje.Detalles.Add(objEstrategico);
          }
          else {
            objEstrategico.presupuesto += fila.AportePresupuesto;
            objEspecifico = objEstrategico.Detalles.Find(p => p.Id == fila.IdCodObjEsp.ToString());
            if (objEspecifico == null) {
              objEspecifico = new infograficoEspecifico();
              objEspecifico.Id = fila.IdCodObjEsp.ToString();
              objEspecifico.Nombre = fila.NombreObjetivoEspecifico;
              objEspecifico.presupuesto = fila.AportePresupuesto;

              objEstrategico.Detalles.Add(objEspecifico);

            }
            else {
              objEspecifico.presupuesto += fila.AportePresupuesto;

            }

          }


        }
      }

      ///ordena primer nivel eje
      var result = objReturn.OrderByDescending(x => x.presupuesto).ToList();
      foreach (var item in result) {
        //ordena nivel obj estrategico
        item.Detalles = item.Detalles.OrderByDescending(x => x.presupuesto).ToList();
        foreach (var item_estrateg in item.Detalles) {
          //ordena nivel obj especifico
          item_estrateg.Detalles = item_estrateg.Detalles.OrderByDescending(x => x.presupuesto).ToList();
        }
      }
      return result;

    }

    private string ConvertirTextoMayusculaMinuscula(string texto)
    {
      if (texto == string.Empty || texto=="*") return string.Empty;
      texto = texto.ToLower();
      var primeraLetra = texto.Substring(0, 1);
      texto = texto.Remove(0, 1);
      texto = primeraLetra.ToUpper() + texto;
      return texto;
    }

    public List<ProyectosPerfilEntidad> GetActividadesClasePrograma(string clasePrograma, int anio, string codEntidad)
    {
      List<ProyectosPerfilEntidad> objReturn = new List<ProyectosPerfilEntidad>();
      #region Genero los datos de la primera pestaña del perfil
      //var proyectosHacienda = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
      //                         where info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() && info.ClasePrograma.ToUpper().Trim() == clasePrograma.ToUpper()
      //                         select new {
      //                           info.IdNegocioProyecto,
      //                           info.NombreProyectoActividad,
      //                           ResultadoInmediato = info.ResultadoInmediato.Replace("*", ""),
      //                           info.PryClasificacion,
      //                           PresupuestoVigente = info.PresupuestoVigente ?? 0,
      //                           PresupuestoAvance = info.PresupuestoAvance ?? 0,
      //                         }).Distinct().ToList();

      //var proyectosHaciendaAgrupPorPresupuesto = (from proyectoHaciendaCentral in proyectosHacienda
      //                                            group proyectoHaciendaCentral by new {
      //                                              proyectoHaciendaCentral.IdNegocioProyecto,
      //                                              proyectoHaciendaCentral.NombreProyectoActividad,
      //                                              proyectoHaciendaCentral.ResultadoInmediato,
      //                                              proyectoHaciendaCentral.PryClasificacion
      //                                            } into proyecto
      //                                            select new {
      //                                              proyecto.Key.IdNegocioProyecto,
      //                                              proyecto.Key.NombreProyectoActividad,
      //                                              proyecto.Key.ResultadoInmediato,
      //                                              proyecto.Key.PryClasificacion,
      //                                              PresupAvance = proyecto.Sum(x => x.PresupuestoAvance),
      //                                              PresupVigente = proyecto.Sum(x => x.PresupuestoVigente)
      //                                            }).Distinct().ToList();

      var proyectosHaciendaAgrupPorPresupuesto = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
                                                  where info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() && info.ClasePrograma.ToUpper().Trim() == clasePrograma.ToUpper()
                                                  group info by new {
                                                    info.IdNegocioProyecto,
                                                    info.NombreProyectoActividad,
                                                    info.ResultadoInmediato,
                                                    info.PryClasificacion
                                                  } into proyecto
                                                  select new {
                                                    proyecto.Key.IdNegocioProyecto,
                                                    proyecto.Key.NombreProyectoActividad,
                                                    proyecto.Key.ResultadoInmediato,
                                                    proyecto.Key.PryClasificacion,
                                                    PresupAvance = proyecto.Sum(x => x.PresupuestoAvance??0),
                                                    PresupVigente = proyecto.Sum(x => x.PresupuestoVigente??0)
                                                  }).ToList();

      foreach (var proyectoHaciendaCentral in proyectosHaciendaAgrupPorPresupuesto) {
        var indicadoresProyectoActividad = (from info in _connection.PresupuestoIndicadoresMinHaciendas
                                            where info.AnioPresupuesto.HasValue && info.IdNegocioProyecto == proyectoHaciendaCentral.IdNegocioProyecto && info.AnioPresupuesto.Value == anio
                                            select new {
                                              CodigoIndicador = info.CodigoIndicador ?? 0,
                                              info.NombreIndicador,
                                              DescripcionIndicador = info.DescripcionIndicador.Replace("*", ""),
                                              info.UnMedidaAnioBase,
                                              info.UnidadMedidaTotal,
                                              Fuente = info.IndFuente,
                                              MetodoCalculo = info.IndMetcalculo,
                                              Numerador = info.IndNumerador ?? 0,
                                              Denominador = info.IndDenominador ?? 0,
                                              ind_frecuen = info.IndFrecuen,
                                              tipoIndicador = info.IndSupuestos,
                                              nivel = info.IndFuente,
                                              DescripcionPoblTotal = info.DescripcionPoblTotal,
                                              indAnioBase = info.IndAniobase
                                            }
                                            ).Distinct().ToList();
        ProyectosPerfilEntidad nuevoProyecto = new ProyectosPerfilEntidad() { Indicadores = new List<IndicadorProyecto>() };
        nuevoProyecto.NombreProyectoActividad = proyectoHaciendaCentral.NombreProyectoActividad == null ? string.Empty : ConvertirTextoMayusculaMinuscula(proyectoHaciendaCentral.NombreProyectoActividad);
        nuevoProyecto.PresupuestoAvance = Math.Round(proyectoHaciendaCentral.PresupAvance / 1000000);
        nuevoProyecto.PresupuestoVigente = Math.Round(proyectoHaciendaCentral.PresupVigente / 1000000, 0);
        nuevoProyecto.Descripcion = proyectoHaciendaCentral.ResultadoInmediato == null ? string.Empty : ConvertirTextoMayusculaMinuscula(proyectoHaciendaCentral.ResultadoInmediato);
        nuevoProyecto.Clasificacion = proyectoHaciendaCentral.PryClasificacion;
        foreach (var indicadorProyectoActividad in indicadoresProyectoActividad) {
          var avance = indicadorProyectoActividad.Denominador == 0 ? 0 : Math.Round(indicadorProyectoActividad.Numerador * 100 / indicadorProyectoActividad.Denominador, 2);
          nuevoProyecto.Indicadores.Add(new IndicadorProyecto {
            Avance = avance,
            Codigo = indicadorProyectoActividad.CodigoIndicador,
            Descripcion = indicadorProyectoActividad.DescripcionIndicador == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.DescripcionIndicador),
            Nombre = indicadorProyectoActividad.NombreIndicador == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.NombreIndicador),
            UnidadMedidaAnioBase = indicadorProyectoActividad.UnMedidaAnioBase == null ? string.Empty : indicadorProyectoActividad.UnMedidaAnioBase,
            UnidadMedidaTotal = indicadorProyectoActividad.UnidadMedidaTotal == null ? string.Empty : indicadorProyectoActividad.UnidadMedidaTotal,
            UnidadIndicador = "%",
            Formula = indicadorProyectoActividad.MetodoCalculo == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.MetodoCalculo),
            Fuente = indicadorProyectoActividad.Fuente == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.Fuente),
            ind_frecuen = indicadorProyectoActividad.ind_frecuen,
            tipoIndicador = indicadorProyectoActividad.tipoIndicador,
            nivel = indicadorProyectoActividad.nivel,
            DescripcionPoblTotal = indicadorProyectoActividad.DescripcionPoblTotal,
            indAnioBase = indicadorProyectoActividad.indAnioBase
          });
        }
        objReturn.Add(nuevoProyecto);
      }
      #endregion Genero los datos de la primera pestaña del perfil
      return objReturn;
    }



    public List<ProyectosProgramas> GetActividadesProgramaSustantivo(string clasePrograma, int anio, string codEntidad)
    {
      //Presupuesto_Indicadores_MinHacienda
      List<ProyectosProgramas> objReturn = new List<ProyectosProgramas>();
      try {
        #region Genero los datos de la segunda pestaña del perfil
        ////var programaProyectosHaciendaSustantivos = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
        ////                                            where info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() && info.ClasePrograma.ToUpper().Trim() == clasePrograma.ToUpper() && info.CodigoPrograma.HasValue
        ////                                            select new {
        ////                                              NombrePrograma = info.NombrePrograma.Trim(),
        ////                                              CodPrograma = info.CodigoPrograma.Value
        ////                                            }).Distinct().ToList();
        var programaProyectosHaciendaSustantivos = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
                                                     where info.PresupuestoVigente.HasValue && info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() && info.ClasePrograma.ToUpper().Trim() == clasePrograma.ToUpper() && info.CodigoPrograma.HasValue
                                                     group info by new {
                                                       info.NombrePrograma,
                                                       CodPrograma=info.CodigoPrograma.Value,
                                                       Problematica= info.Problematica,
                                                       ResultadoIntermedio= info.ResultadoIntermedio
                                                     } into proyecto
                                                    select new {
                                                      NombrePrograma = proyecto.Key.NombrePrograma,
                                                      CodPrograma = proyecto.Key.CodPrograma,
                                                      PresupuestoAsignado= proyecto.Sum(x=>x.PresupuestoVigente??0),
                                                      Problematica= proyecto.Key.Problematica,
                                                      ResultadoIntermedio = proyecto.Key.ResultadoIntermedio
                                                    }).ToList();


        foreach (var programa in programaProyectosHaciendaSustantivos) {
          //var presupuestoAsignado = _connection.PresupuestoVigenteXSectorMinHaciendas.Where(x => x.NombrePrograma.Trim() == programa.NombrePrograma && x.CodNivelEntidad.ToUpper() == codEntidad.ToUpper().Trim() && x.AnioPresupuesto == anio).Sum(x => x.PresupuestoVigente);
          //var problematicaPrograma = _connection.PresupuestoVigenteXSectorMinHaciendas.Where(x => x.NombrePrograma.Trim() == programa.NombrePrograma).Select(x => x.Problematica.Trim()).Distinct().FirstOrDefault();
          //var resultadoIntemedio = _connection.PresupuestoVigenteXSectorMinHaciendas.Where(x => x.NombrePrograma.Trim() == programa.NombrePrograma).Select(x => x.ResultadoIntermedio.Trim()).Distinct().FirstOrDefault();
          //var resultadoInmediato = _connection.PresupuestoVigenteXSectorMinHaciendas.Where(x => x.NombrePrograma.Trim() == programa.NombrePrograma).Select(x => x.ResultadoInmediato.Trim()).Distinct().FirstOrDefault();
          //ProyectosProgramas nuevoProgramaProyecto = new ProyectosProgramas { NombrePrograma = programa.NombrePrograma == null ? string.Empty : ConvertirTextoMayusculaMinuscula(programa.NombrePrograma), PresupuestoAsignado = presupuestoAsignado.HasValue ? Math.Round(presupuestoAsignado.Value / 1000000, 0) : 0, Problematica = problematicaPrograma == null ? string.Empty : ConvertirTextoMayusculaMinuscula(problematicaPrograma), ResultadoInmediato = resultadoInmediato == null ? string.Empty : ConvertirTextoMayusculaMinuscula(resultadoInmediato), ResultadoIntermedio = resultadoIntemedio == null ? string.Empty : ConvertirTextoMayusculaMinuscula(resultadoIntemedio), Proyectos = new List<ProyectosPerfilEntidad>() };
          ProyectosProgramas nuevoProgramaProyecto = new ProyectosProgramas { NombrePrograma = programa.NombrePrograma == null ? string.Empty : ConvertirTextoMayusculaMinuscula(programa.NombrePrograma), PresupuestoAsignado =  Math.Round(programa.PresupuestoAsignado / 1000000, 0), Problematica = programa.Problematica == null ? string.Empty : ConvertirTextoMayusculaMinuscula(programa.Problematica), ResultadoInmediato = string.Empty, ResultadoIntermedio = programa.ResultadoIntermedio == null ? string.Empty : ConvertirTextoMayusculaMinuscula(programa.ResultadoIntermedio), Proyectos = new List<ProyectosPerfilEntidad>() };
          //var proyectosHaciendaSustantivos = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
          //                                    where info.CodigoPrograma.HasValue && info.CodigoPrograma.Value == programa.CodPrograma && info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() && info.ClasePrograma.ToUpper().Trim() == "SUSTANTIVO"
          //                                    select new {
          //                                      info.IdNegocioProyecto,
          //                                      info.NombreProyectoActividad,
          //                                      info.ResultadoInmediato,
          //                                      info.PryClasificacion,
          //                                      PresupuestoVigente = info.PresupuestoVigente ?? 0,
          //                                      PresupuestoAvance = info.PresupuestoAvance ?? 0,
          //                                    }).Distinct().ToList();

          //var proyectosHaciendaSustantivoAgrupPorPresupuesto = (from proyectoHaciendaNoAsignable in proyectosHaciendaSustantivos
          //                                                      group proyectoHaciendaNoAsignable by new {
          //                                                        proyectoHaciendaNoAsignable.IdNegocioProyecto,
          //                                                        proyectoHaciendaNoAsignable.NombreProyectoActividad,
          //                                                        proyectoHaciendaNoAsignable.PryClasificacion,
          //                                                        proyectoHaciendaNoAsignable.ResultadoInmediato
          //                                                      } into proyecto
          //                                                      select new {
          //                                                        proyecto.Key.IdNegocioProyecto,
          //                                                        proyecto.Key.NombreProyectoActividad,
          //                                                        proyecto.Key.PryClasificacion,
          //                                                        proyecto.Key.ResultadoInmediato,
          //                                                        PresupAvance = proyecto.Sum(x => x.PresupuestoAvance),
          //                                                        PresupVigente = proyecto.Sum(x => x.PresupuestoVigente)
          //                                                      }).Distinct().ToList();

          var proyectosHaciendaSustantivoAgrupPorPresupuesto = (from info in _connection.PresupuestoVigenteXSectorMinHaciendas
                                                      where info.PresupuestoAvance.HasValue && info.CodigoPrograma.HasValue && info.CodigoPrograma.Value == programa.CodPrograma && info.AnioPresupuesto == anio && info.CodNivelEntidad.ToUpper().Trim() == codEntidad.ToUpper().Trim() && info.ClasePrograma.ToUpper().Trim() == "SUSTANTIVO"
                                                      group info by new {
                                                        info.IdNegocioProyecto,
                                                        info.NombreProyectoActividad,
                                                        info.PryClasificacion,
                                                        info.ResultadoInmediato
                                                      } into proyecto
                                                      select new {
                                                        proyecto.Key.IdNegocioProyecto,
                                                        proyecto.Key.NombreProyectoActividad,
                                                        proyecto.Key.ResultadoInmediato,
                                                        proyecto.Key.PryClasificacion,
                                                        PresupVigente = proyecto.Sum(x=>x.PresupuestoVigente??0),
                                                        PresupAvance = proyecto.Sum(x=>x.PresupuestoAvance ?? 0),
                                                      }).ToList();

          foreach (var proyectoHaciendaSustantivo in proyectosHaciendaSustantivoAgrupPorPresupuesto) {
            var indicadoresProyectoActividad = (from info in _connection.PresupuestoIndicadoresMinHaciendas
                                                where info.AnioPresupuesto.HasValue && info.IdNegocioProyecto == proyectoHaciendaSustantivo.IdNegocioProyecto && info.AnioPresupuesto.Value == anio
                                                select new {
                                                  CodigoIndicador = info.CodigoIndicador ?? 0,
                                                  info.NombreIndicador,
                                                  info.DescripcionIndicador,
                                                  info.UnMedidaAnioBase,
                                                  info.UnidadMedidaTotal,
                                                  Fuente = info.IndFuente,
                                                  MetodoCalculo = info.IndMetcalculo,
                                                  Numerador = info.IndNumerador ?? 0,
                                                  Denominador = info.IndDenominador ?? 0,
                                                  ind_frecuen = info.IndFrecuen,
                                                  tipoIndicador = info.IndSupuestos,
                                                  nivel = info.IndFuente,
                                                  DescripcionPoblTotal = info.DescripcionPoblTotal,
                                                  indAnioBase = info.IndAniobase
                                                }
                                                ).Distinct().ToList();
            ProyectosPerfilEntidad nuevoProyecto = new ProyectosPerfilEntidad() { Indicadores = new List<IndicadorProyecto>() };
            nuevoProyecto.NombreProyectoActividad = proyectoHaciendaSustantivo.NombreProyectoActividad == null ? string.Empty : ConvertirTextoMayusculaMinuscula(proyectoHaciendaSustantivo.NombreProyectoActividad);
            nuevoProyecto.PresupuestoAvance = Math.Round(proyectoHaciendaSustantivo.PresupAvance / 1000000, 0);
            nuevoProyecto.PresupuestoVigente = Math.Round(proyectoHaciendaSustantivo.PresupVigente / 1000000, 0);
            nuevoProyecto.Descripcion = proyectoHaciendaSustantivo.ResultadoInmediato == null ? string.Empty : ConvertirTextoMayusculaMinuscula(proyectoHaciendaSustantivo.ResultadoInmediato);
            nuevoProyecto.Clasificacion = proyectoHaciendaSustantivo.PryClasificacion;
            foreach (var indicadorProyectoActividad in indicadoresProyectoActividad) {
              var avance = indicadorProyectoActividad.Denominador == 0 ? 0 : Math.Round(indicadorProyectoActividad.Numerador * 100 / indicadorProyectoActividad.Denominador, 2);
              nuevoProyecto.Indicadores.Add(new IndicadorProyecto {
                Avance = avance,
                Codigo = indicadorProyectoActividad.CodigoIndicador,
                Descripcion = indicadorProyectoActividad.DescripcionIndicador == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.DescripcionIndicador),
                Nombre = indicadorProyectoActividad.NombreIndicador == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.NombreIndicador),
                UnidadMedidaAnioBase = indicadorProyectoActividad.UnMedidaAnioBase == null ? string.Empty : indicadorProyectoActividad.UnMedidaAnioBase,
                UnidadMedidaTotal = indicadorProyectoActividad.UnidadMedidaTotal == null ? string.Empty : indicadorProyectoActividad.UnidadMedidaTotal,
                Formula = indicadorProyectoActividad.MetodoCalculo == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.MetodoCalculo),
                Fuente = indicadorProyectoActividad.Fuente == null ? string.Empty : ConvertirTextoMayusculaMinuscula(indicadorProyectoActividad.Fuente),
                ind_frecuen = indicadorProyectoActividad.ind_frecuen,
                tipoIndicador = indicadorProyectoActividad.tipoIndicador,
                nivel = indicadorProyectoActividad.nivel,
                DescripcionPoblTotal = indicadorProyectoActividad.DescripcionPoblTotal,
                indAnioBase = indicadorProyectoActividad.indAnioBase
              });
            }
            nuevoProgramaProyecto.Proyectos.Add(nuevoProyecto);

          }
          objReturn.Add(nuevoProgramaProyecto);
        }
        #endregion Genero los datos de la primera pestaña del perfil
      }
      catch (Exception ex) {

      }

      return objReturn;
    }

    public List<TableIndicadorGraphics> GetGraficaIndicadores(int codigoIndicador, int anio, string codEntidad)
    {
      //Año:[AnioPresupuesto]
      //Meta Numerador: IND_METCALCULO
      //Denominador: IND_DENOMINADOR
      //Avance Numerador: IND_NUMERADOR
      //% Meta del ID: IND_PORCMETA
      //% Avance del ID:IND_PAVANCEUNITARIO

      var data = (from info in _connection.PresupuestoIndicadoresMinHaciendas
                  where info.IndNumerador.HasValue
                  && info.IndDenominador.HasValue
                  && info.CodigoIndicador.HasValue
                  && info.AnioPresupuesto.HasValue
                  && info.CodNivelEntidad == codEntidad
                  && info.CodigoIndicador.Value == codigoIndicador
                  && info.AnioPresupuesto.Value <= anio

                  select new TableIndicadorGraphics {
                    anio = info.AnioPresupuesto.Value,
                    meta_numerador = info.IndMetcalculo,
                    denominador = info.IndDenominador,
                    avance_numerador = info.IndNumerador,
                    porc_meta = info.IndPorcmeta,
                    porc_avance = info.IndPavanceunitario
                  }
      ).Distinct().OrderBy(x => x.anio).ToList();

      return data;
    }


  }
}
