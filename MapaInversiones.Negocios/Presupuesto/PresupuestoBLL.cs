using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Linq;
using System.Xml.Linq;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Entidad;
//using PlataformaTransparencia.Modelos.OrganismoFinanciador;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.Interfaces;
using SolrNet.Utils;

namespace PlataformaTransparencia.Negocios.Presupuesto
{

  public class PresupuestoBLL : IPresupuestoBLL
  {
    private readonly TransparenciaDB _connection;

        public PresupuestoBLL(TransparenciaDB connection)
    {
      _connection = connection;
    }

    public InfoConsolidadoPresupuesto GetConsolidadoPeriodos(int anyo)
    {

      InfoConsolidadoPresupuesto objReturn = new InfoConsolidadoPresupuesto();
      try
      {

        var RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                      join anyos in _connection.CatalogoTiempoes
                                      on info.Periodo equals anyos.Periodo
                                      where anyos.Año == anyo
                                      group new { info, anyos } by new { anyos.Año } into g
                                      select new InfoConsolidadoPresupuesto
                                      {
                                        Id = g.Key.Año,
                                        vigente = g.Sum(g => g.info.Vigente.Value),
                                        aprobado = g.Sum(g => g.info.Aprobado.Value),
                                        ejecutado = g.Sum(g => g.info.EjecucionAcumulada.Value)
                                      }).FirstOrDefault();

        objReturn = RecursosPerObjetoQuery;
      }
      catch (Exception exception)
      {
        return null;
      }
      return objReturn;

    }

    public List<InfoConsolidadoPresupuesto> GetRecursosPerfinalidad(int annio)
    {

      List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
      var RecursosPerObjetoQuery = (from info in _connection.VwPresupuesto
                                    join ct in _connection.CatalogoTiempoes on info.Periodo equals ct.Periodo
                                    where ct.Año == annio
                                    group info by new { info.Finalidad, info.Sector } into g

                                    select new InfoConsolidadoPresupuesto
                                    {
                                      labelGroup = g.Key.Finalidad,
                                      label = g.Key.Sector,
                                      rawValueDouble = g.Sum(g => g.Vigente.Value)
                                    }).OrderBy(x => x.labelGroup).ThenBy(n => n.label).ToList();

      objReturn = RecursosPerObjetoQuery;


      return objReturn;

    }


    public List<InfoPerSector> ObtenerSectoresPerNombre(int anyo)
    {
      List<InfoPerSector> objReturn = new List<InfoPerSector>();

      objReturn = (from pre in _connection.VwPresupuesto
                   where (pre.Periodo.ToString().Contains(anyo.ToString()))
                   group pre by new { pre.IdSector, pre.Sector } into g
                   select new InfoPerSector
                   {
                     idSector = Convert.ToInt32(g.Key.IdSector),
                     label = g.Key.Sector
                   }).Distinct().OrderBy(x => x.label).ToList();




      return objReturn;

    }

    public List<itemGenerico> ObtenerOrganismosPerNombre(int anyo)
    {
      List<itemGenerico> objReturn = new List<itemGenerico>();

      objReturn = (from pre in _connection.VwPresupuesto
                   join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                   where ct.Año == anyo 
                   && pre.Vigente>0
                   group pre by new { pre.CodigoOrganismoFinanciador, pre.OrganismoFinanciador } into g
                   select new itemGenerico
                   {
                     id = g.Key.CodigoOrganismoFinanciador,
                     name = g.Key.OrganismoFinanciador
                   }).Distinct().OrderBy(x => x.name).ToList();




      return objReturn;

    }


    /// <summary>
    /// Estructura infografica Sankey 4 niveles
    /// </summary>
    /// <param name="annio">periodo o año</param>
    /// <param name="opcion">Nombre sector</param>
    /// <returns>Array Json con padres e hijos según jerarquia de 4 niveles</returns>
    public List<InfograficoFuentes_Nivel_1> ObtDistribucionBySectorFuentes(int annio, string opcion, string tipo)
    {
      List<itemSankey> RecursosPerObjetoQuery = new List<itemSankey>();

      int idAux = 0;
      if (opcion != "" && opcion != null)
      {
        if (int.TryParse(opcion, out int id_aux))
        {
          idAux = id_aux;
        }

      }
      List<InfograficoFuentes_Nivel_1> objReturn = new List<InfograficoFuentes_Nivel_1>();
            if (tipo.Equals("sector"))
            {
                //SECTOR
                RecursosPerObjetoQuery = (from info in _connection.VwPresupuestoXProyInvs
                                          join pre in _connection.VwPresupuesto on new { info.IdCatalogoLineaPresupuestal, info.CodigoFondo, info.CodigoInstitucion, info.Periodo } equals new { pre.IdCatalogoLineaPresupuestal, pre.CodigoFondo, pre.CodigoInstitucion, pre.Periodo }
                                          join t in _connection.CatalogoTiempoes on pre.Periodo equals t.Periodo
                                          where t.Año == annio
                                              && (!string.IsNullOrEmpty(pre.Sector))
                                              && (pre.Sector != "NULL")
                                              && pre.IdSector == idAux.ToString()
                                              && pre.Vigente > 0
                                          group new { info, pre } by new { pre.CodigoSubFuncion, pre.SubFuncion, pre.Sector, pre.CodigoInstitucion, pre.Institucion, pre.CodigoFondo, pre.Fondo, info.IdProyecto, info.Nombreproyecto } into g
                                          select new itemSankey
                                          {
                                              idNivel_1 = g.Key.CodigoSubFuncion,
                                              nomNivel_1 = "n1|" + g.Key.SubFuncion,
                                              idNivel_2 = g.Key.CodigoInstitucion,
                                              nomNivel_2 = "n2|" + g.Key.Institucion,
                                              idNivel_3 = g.Key.CodigoFondo,
                                              nomNivel_3 = "n3|" + g.Key.Fondo,
                                              idNivel_4 = g.Key.IdProyecto.ToString(),
                                              nomNivel_4 = "n4|" + g.Key.Nombreproyecto,
                                              Avance = (decimal)g.Sum(x => x.pre.EjecucionAcumulada)/1000000,
                                              Presupuesto = (decimal)g.Sum(x => x.pre.Vigente)/1000000
                                          }).ToList();

            }
            else
            {
                //TAB ORGANISMOS
                RecursosPerObjetoQuery = (from info in _connection.VwPresupuestoXProyInvs
                                          join pre in _connection.VwPresupuesto on new { info.IdCatalogoLineaPresupuestal, info.CodigoFondo, info.CodigoInstitucion, info.Periodo } equals new { pre.IdCatalogoLineaPresupuestal, pre.CodigoFondo, pre.CodigoInstitucion, pre.Periodo }
                                          join t in _connection.CatalogoTiempoes on pre.Periodo equals t.Periodo
                                          where t.Año == annio
                                          && pre.CodigoOrganismoFinanciador == idAux
                                          && pre.Vigente > 0


                                  group new { info, pre } by new { pre.IdSector, pre.Sector, pre.CodigoInstitucion, pre.Institucion,info.IdProyecto, info.Nombreproyecto } into g
                                  select new itemSankey
                                  {
                                    idNivel_1 = g.Key.IdSector.ToString(),
                                    nomNivel_1 = "n1|" + g.Key.Sector,
                                    idNivel_2 = g.Key.CodigoInstitucion,
                                    nomNivel_2 = "n2|" + g.Key.Institucion,
                                    idNivel_3 = g.Key.IdProyecto.ToString(),
                                    nomNivel_3 = "n3|" + g.Key.Nombreproyecto,
                                    //idNivel_4 = "",
                                    //nomNivel_4 = "n4|",
                                    Avance = (decimal)g.Sum(x => x.pre.EjecucionAcumulada)/1000000,
                                    Presupuesto = (decimal)g.Sum(x => x.pre.Vigente)/ 1000000
                                  }).ToList();

      }


      InfograficoFuentes_Nivel_1 objNivel_1 = null;  //fuente de financiacion/recurso
      InfograficoFuentes_Nivel_2 objNivel_2 = null;  //entidad o institucion
      InfograficoFuentes_Nivel_3 objNivel_3 = null;  //tipo de gasto
      InfograficoFuentes_Nivel_4 objNivel_4 = null;  //objeto o detalle del gasto

      foreach (var fila in RecursosPerObjetoQuery)
      {
        var nomNivel1_aux = fila.nomNivel_1;
        var vec_fuente = fila.nomNivel_1.Split("_");

        if (vec_fuente.Length > 0)
        {
          nomNivel1_aux = vec_fuente[0];
        }

        objNivel_1 = objReturn.Find(p => p.Nombre == nomNivel1_aux);
        if (objNivel_1 == null) //Primer detalle del infografico
        {
          objNivel_1 = new InfograficoFuentes_Nivel_1(fila.idNivel_1, nomNivel1_aux);
          objNivel_1.presupuesto += (decimal)fila.Presupuesto;
          objNivel_1.avance += (decimal)fila.Avance;

          objNivel_2 = objNivel_1.Detalles.Find(p => p.Nombre == fila.nomNivel_2);
          if (objNivel_2 == null)
          {
            objNivel_2 = new InfograficoFuentes_Nivel_2(fila.idNivel_2, fila.nomNivel_2);
            objNivel_2.presupuesto += (decimal)fila.Presupuesto;
            objNivel_2.avance += (decimal)fila.Avance;
            objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3);
            if (objNivel_3 == null)
            {
              objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;

              objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
              if (objNivel_4 == null)
              {
                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

                objNivel_3.Detalles.Add(objNivel_4);
              }
              else
              {
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

              }

              objNivel_2.Detalles.Add(objNivel_3);

            }
            else
            {
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;
              objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
              if (objNivel_4 == null)
              {
                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

                objNivel_3.Detalles.Add(objNivel_4);
              }
              else
              {
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;
              }
            }
            objNivel_1.Detalles.Add(objNivel_2);
          }
          else
          {
            objNivel_2.presupuesto += (decimal)fila.Presupuesto;
            objNivel_2.avance += (decimal)fila.Avance;
            objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3);
            if (objNivel_3 == null)
            {
              objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;
              objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
              if (objNivel_4 == null)
              {
                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

                objNivel_3.Detalles.Add(objNivel_4);
              }
              else
              {
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;
              }


              objNivel_2.Detalles.Add(objNivel_3);
            }
            else
            {
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;

            }
          }
          objReturn.Add(objNivel_1);
        }
        else
        {
          objNivel_1.presupuesto += (decimal)fila.Presupuesto;
          objNivel_1.avance += (decimal)fila.Avance;
          objNivel_2 = objNivel_1.Detalles.Find(p => p.Nombre == fila.nomNivel_2);
          if (objNivel_2 == null)
          {
            objNivel_2 = new InfograficoFuentes_Nivel_2(fila.idNivel_2, fila.nomNivel_2);
            objNivel_2.presupuesto += (decimal)fila.Presupuesto;
            objNivel_2.avance += (decimal)fila.Avance;
            objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3.ToString());
            if (objNivel_3 == null)
            {
              objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;

              objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
              if (objNivel_4 == null)
              {
                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

                objNivel_3.Detalles.Add(objNivel_4);
              }
              else
              {
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;
              }

              objNivel_2.Detalles.Add(objNivel_3);
            }
            else
            {
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;

              objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
              if (objNivel_4 == null)
              {
                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

                objNivel_3.Detalles.Add(objNivel_4);
              }
              else
              {
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;
              }

            }
            objNivel_1.Detalles.Add(objNivel_2);
          }
          else
          {
            objNivel_2.presupuesto += (decimal)fila.Presupuesto;
            objNivel_2.avance += (decimal)fila.Avance;
            objNivel_3 = objNivel_2.Detalles.Find(p => p.Nombre == fila.nomNivel_3);
            if (objNivel_3 == null)
            {
              objNivel_3 = new InfograficoFuentes_Nivel_3(fila.idNivel_3, fila.nomNivel_3);
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;

              objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
              if (objNivel_4 == null)
              {
                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

                objNivel_3.Detalles.Add(objNivel_4);
              }
              else
              {
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;
              }

              objNivel_2.Detalles.Add(objNivel_3);
            }
            else
            {
              objNivel_3.presupuesto += (decimal)fila.Presupuesto;
              objNivel_3.avance += (decimal)fila.Avance;

              objNivel_4 = objNivel_3.Detalles.Find(p => p.Nombre == fila.nomNivel_4);
              if (objNivel_4 == null)
              {
                objNivel_4 = new InfograficoFuentes_Nivel_4(fila.idNivel_4, fila.nomNivel_4);
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;

                objNivel_3.Detalles.Add(objNivel_4);
              }
              else
              {
                objNivel_4.presupuesto += (decimal)fila.Presupuesto;
                objNivel_4.avance += (decimal)fila.Avance;
              }

            }
          }
        }
      }

      ///ordena primer nivel
      var result = objReturn.OrderByDescending(x => x.presupuesto).ToList();
      foreach (var item_nivel1 in result)
      {
        //ordena nivel 2
        item_nivel1.Detalles = item_nivel1.Detalles.OrderByDescending(x => x.presupuesto).ToList();
        foreach (var item_nivel2 in item_nivel1.Detalles)
        {
          //ordena nivel 3
          item_nivel2.Detalles = item_nivel2.Detalles.OrderByDescending(x => x.presupuesto).ToList();
          foreach (var item_nivel3 in item_nivel2.Detalles)
          {
            //ordena nivel 4
            item_nivel3.Detalles = item_nivel3.Detalles.OrderByDescending(x => x.presupuesto).Take(5).ToList();
          }
        }
      }

      return result;

    }


    public List<infograficoEntidadPerPresup> GetInfograficoPerEntidad(int annio, string id, string tipo)
    {

      var objReturn = new List<infograficoEntidadPerPresup>();
      if (id != null && id != "")
      {
        if (tipo.Equals("sector"))
        {
          var infoQuery = (from info in _connection.VwPresupuesto
                           join ct in _connection.CatalogoTiempoes on info.Periodo equals ct.Periodo
                           where ct.Año == annio && info.IdSector.ToString().Equals(id)
                           group info by new
                           {
                             info.CodigoInstitucion,
                             info.Institucion,
                           } into g
                           select new infograficoEntidadPerPresup
                           {
                             Id = g.Key.CodigoInstitucion,
                             Nombre = g.Key.Institucion,
                             presupuesto = (g.Sum(g => g.Vigente.Value)),
                             aprobado = (g.Sum(g => g.Aprobado.Value)),
                             avance = (g.Sum(g => g.EjecucionAcumulada.Value))
                           }
                          ).Distinct().OrderByDescending(x => x.presupuesto);
          objReturn = infoQuery.ToList();
        }
        else
        {
          var infoQuery = (from info in _connection.VwPresupuesto
                           join ct in _connection.CatalogoTiempoes on info.Periodo equals ct.Periodo
                           where ct.Año == annio && info.CodigoOrganismoFinanciador.ToString().Equals(id)
                           group info by new
                           {
                             info.CodigoInstitucion,
                             info.Institucion,
                           } into g
                           select new infograficoEntidadPerPresup
                           {
                             Id = g.Key.CodigoInstitucion,
                             Nombre = g.Key.Institucion,
                             presupuesto = (g.Sum(g => g.Vigente.Value)),
                             aprobado = (g.Sum(g => g.Aprobado.Value)),
                             avance = (g.Sum(g => g.EjecucionAcumulada.Value))
                           }
                          ).Distinct().OrderByDescending(x => x.presupuesto);
          objReturn = infoQuery.ToList();
        }



      }

      return objReturn;

    }

    public List<InfoConsolidadoPresupuesto> ObtenerGastoEntidades(int anyo, List<string> filtro_sec)
    {
            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            List<InfoConsolidadoPresupuesto> query1 = new List<InfoConsolidadoPresupuesto>();
            List<InfoConsolidadoPresupuesto> query2 = new List<InfoConsolidadoPresupuesto>();

            var queryTotalVigente = (from pre in _connection.VwPresupuesto
                                     join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                                     where ct.Año == anyo
                                     group new { pre, ct } by new { ct.Año } into g
                                     select new InfoConsolidadoPresupuesto
                                     {
                                         label = "Vigente",
                                         rawValue = (decimal)g.Sum(g => g.pre.Vigente) / 1000000,
                                         periodo = (int)g.Key.Año
                                     }).ToList();

            var queryTotalAvance = (from pre in _connection.VwPresupuesto
                                    join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                                    where ct.Año == anyo
                                    group new { pre, ct } by new { ct.Año } into g
                                    select new InfoConsolidadoPresupuesto
                                    {
                                        label = "Ejecutado",
                                        rawValue = (decimal)g.Sum(g => g.pre.EjecucionAcumulada) / 1000000,
                                        periodo = (int)g.Key.Año
                                    }).ToList();

            if (filtro_sec.Count > 0)
            {
                //sectores seleccionados
                query1 = (from pre in _connection.VwPresupuesto
                          join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                          where ct.Año == anyo
                          && filtro_sec.Contains(pre.Institucion)
                          group new { ct, pre } by new { ct.Año, pre.Institucion} into g
                          
                          select new InfoConsolidadoPresupuesto
                          {
                              labelGroup = "Vigente",
                              label = g.Key.Institucion,
                              rawValue = (decimal)g.Sum(g => g.pre.Vigente) / 1000000,
                              periodo = (int)g.Key.Año
                          }).ToList();


                query2 = (from pre in _connection.VwPresupuesto
                          join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                          where ct.Año == anyo
                          && filtro_sec.Contains(pre.Institucion)
                          group new { ct, pre } by new { ct.Año, pre.Institucion } into g
                          select new InfoConsolidadoPresupuesto
                          {
                              labelGroup = "Ejecutado",
                              label = g.Key.Institucion,
                              rawValue = (decimal)g.Sum(g => g.pre.EjecucionAcumulada) / 1000000,
                              periodo = (int)g.Key.Año
                          }).ToList();

                query1.AddRange(query2);
            }
            else
            {
                //top 4
                var q0 = ((from pre in _connection.VwPresupuesto
                           join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                           where ct.Año == anyo
                           ///top del presupuesto del año seleccionado
                           group pre by new { pre.Institucion } into h
                           select new InfoConsolidadoPresupuesto
                           {
                               rawValue = (decimal)h.Sum(h => h.Vigente) / 1000000,
                               labelGroup = h.Key.Institucion
                           }).OrderByDescending(h => h.rawValue).Take(4));

                query1 = (from pre in _connection.VwPresupuesto
                          join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                          where ct.Año == anyo
                          group new { ct, pre } by new { ct.Año, pre.Institucion } into g
                          from top in q0
                          .Where(j => j.labelGroup == g.Key.Institucion) //inner join
                          select new InfoConsolidadoPresupuesto
                          {
                              rawValue = (decimal)g.Sum(g => g.pre.Vigente) / 1000000,
                              labelGroup = "Vigente",
                              periodo = (int)g.Key.Año,
                              label = g.Key.Institucion
                          }).ToList();

                query2 = (from pre in _connection.VwPresupuesto
                          join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                          where ct.Año == anyo
                           group new { ct, pre } by new { ct.Año, pre.Institucion } into g
                          from top in q0
                          .Where(j => j.labelGroup == g.Key.Institucion) //inner join
                          select new InfoConsolidadoPresupuesto
                          {
                              rawValue = (decimal)g.Sum(g => g.pre.EjecucionAcumulada) / 1000000,
                              labelGroup = "Ejecutado",
                              periodo = (int)g.Key.Año,
                              label = g.Key.Institucion
                          }).ToList();

                query1.AddRange(query2);
            }


            objReturn = query1.OrderByDescending(x => x.rawValue).ToList();

            foreach (var item in objReturn)
            {
                //calculo porcentaje
                if (item.labelGroup.ToLower() == "vigente")
                {
                    var objTotalPeriodo = queryTotalVigente.Find(p => p.periodo == item.periodo);
                    if (objTotalPeriodo != null)
                    {
                        if (objTotalPeriodo.rawValue > 0) {
                            item.porcentaje = Math.Round((item.rawValue / objTotalPeriodo.rawValue) * 100, 2);
                        }
                    }
                }
                else
                {
                    var objTotalPeriodo = queryTotalAvance.Find(p => p.periodo == item.periodo);
                    if (objTotalPeriodo != null)
                    {
                        if (objTotalPeriodo.rawValue > 0) {
                            item.porcentaje = Math.Round((item.rawValue / objTotalPeriodo.rawValue) * 100, 2);
                        }
                    }
                }
            }

            return objReturn;

    }


    public List<InformationGraphics> ObtenerEntidadesPerNombre(int anyo)
    {
            List<InformationGraphics> objReturn = new List<InformationGraphics>();

            objReturn = (from pre in _connection.VwPresupuesto
                         join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                         where ct.Año == anyo
                         && pre.Vigente>0
                         group pre by pre.Institucion into g
                         select new InformationGraphics
                         {
                             label = g.Key
                         }).Distinct().OrderBy(x => x.label).ToList();




            return objReturn;

    }

  public List<InfoConsolidadoPresupuesto> ObtenerGastoPerTiempoEntidades(int anyo, List<string> filtro_sec)
        {
            List<InfoConsolidadoPresupuesto> objReturn = new List<InfoConsolidadoPresupuesto>();
            List<InfoConsolidadoPresupuesto> query1 = new List<InfoConsolidadoPresupuesto>();

            if (filtro_sec.Count > 0)
            {
                //sectores seleccionados
                query1 = (from pre in _connection.VwPresupuestoHistoricoes
                          join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                          where ct.Año == anyo
                          && filtro_sec.Contains(pre.Institucion)
                          group pre by new { pre.Institucion, pre.Periodo, pre.Mes } into g
                          select new InfoConsolidadoPresupuesto
                          {
                              labelGroup = g.Key.Institucion,
                              label = g.Key.Mes,
                              rawValue = (decimal)g.Sum(g => g.Pagos) / 1000000
                          }).OrderByDescending(x => x.rawValue).ToList();


            }
            else
            {
                //top 4
                var q0 = ((from pre in _connection.VwPresupuestoHistoricoes
                           join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                           where ct.Año == anyo
                           group pre by new { pre.Institucion } into h
                           select new InfoConsolidadoPresupuesto
                           {
                               rawValue = (decimal)h.Sum(h => h.Pagos) / 1000000,
                               labelGroup = h.Key.Institucion
                           }).OrderByDescending(h => h.rawValue).Take(4));


                query1 = (from pre in _connection.VwPresupuestoHistoricoes
                          join ct in _connection.CatalogoTiempoes on pre.Periodo equals ct.Periodo
                          where ct.Año == anyo
                          group pre by new { pre.Institucion, pre.Periodo, pre.Mes } into g
                          from top in q0
                          .Where(j => j.labelGroup == g.Key.Institucion) //inner join
                          select new InfoConsolidadoPresupuesto
                          {
                              labelGroup = g.Key.Institucion,
                              label = g.Key.Mes,
                              rawValue = (decimal)g.Sum(g => g.Pagos) / 1000000,

                          }).ToList();


            }


            objReturn = query1;
            return objReturn;

        }

        public List<itemGenPresupuesto> GetInfograficoPerProyecto(int annio, string id)
        {
            var idAux = 0;
            var objReturn = new List<itemGenPresupuesto>();
            if (int.TryParse(id, out int id_aux))
            {
                idAux = id_aux;
            }

               var RecursosPerObjetoQuery = (from info in _connection.VwPresupuestoXProyInvs
                                          join t in _connection.CatalogoTiempoes on info.Periodo equals t.Periodo
                                          where t.Año == annio
                                          && info.CodigoOrganismoFinanciador == idAux
                                          && info.ValorFinanciado > 0
                                          group  info by new { info.IdProyecto, info.Nombreproyecto,info.NombreEstado } into g
                                          select new itemGenPresupuesto
                                          {

                                              id = g.Key.IdProyecto!=null?g.Key.IdProyecto.Value.ToString():"0",
                                              nombre = g.Key.Nombreproyecto,
                                              ejecutado = g.Sum(x => x.ValorEjecutado.Value)/1000000,
                                              vigente = g.Sum(x => x.ValorFinanciado.Value) / 1000000, 
                                              aprobado = g.Max(x => x.ValorProyecto.Value) / 1000000,
                                              avance_financiero = Convert.ToDouble(g.Max(x => x.Avancefinanciero.Value) / 1000000),
                                              AvanceFinancieroOrganismo = g.Average(x => x.ValorFinanciado) == 0 ? 0 : Convert.ToDouble(Math.Round(g.Average(x => x.ValorEjecutado.Value) / g.Average(x => x.ValorFinanciado.Value), 3)),
                                              estado = g.Key.NombreEstado

                                          }).OrderBy(h => h.nombre).ToList();

            objReturn = RecursosPerObjetoQuery;

            return objReturn;

        }

    }
}
