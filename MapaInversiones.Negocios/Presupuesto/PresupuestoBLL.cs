using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;

namespace PlataformaTransparencia.Negocios.Presupuesto
{
    public class PresupuestoBLL
    {

        private readonly TransparenciaDB _connection;

        public PresupuestoBLL(TransparenciaDB connection)
        {
            _connection = connection;
        }

        public List<InfoPresupuesto> ObtenerPresupuesto(int consulta, int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();
            if (consulta == 0) {
                //var query1 = (from notpre in _connection.PresupuestoVigenteXSectorMinHaciendas
                //              where notpre.AnioPresupuesto == annio
                //             group notpre by notpre.Sectores into g
                //             orderby g.Sum(h => h.PresupuestoVigente) descending
                //             select g.Key).Take(4);

                //objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                //             where pre.AnioPresupuesto == annio
                //             group pre by pre.Sectores into g
                //                           select new InfoPresupuesto {
                //                               rawValue = (decimal)g.Sum(g => g.PresupuestoVigente)/1000000,
                //                               labelGroup = g.Key
                //                           }).OrderByDescending(g => g.rawValue).Take(4)
                //                           //.Union(from pre in _connection.PresupuestoXSectorMinHaciendas
                //                           //       where pre.AnioPresupuesto == annio && pre.CodigoVersion == 50
                //                           //       && !pre.Sectores == query1
                //                           //       group pre by pre.Sectores into g
                //                           //       select new InfoPresupuesto {
                //                           //           rawValue = (decimal)g.Sum(g => g.Presupuesto),
                //                           //           labelGroup = g.Key
                //                           //       })
                //                           .ToList();
            }
            if (consulta == 1) {
                objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                             where pre.AnioPresupuesto == annio
                             group pre by new { pre.Sectores, pre.NombreEntidad } into g
                                           select new InfoPresupuesto {
                                               rawValue = (decimal)g.Sum(g => g.PresupuestoVigente) / 1000000,
                                               labelGroup = g.Key.Sectores,
                                               label=g.Key.NombreEntidad
                                           }).ToList();
            }
            if (consulta == 2) {
                objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                             where pre.AnioPresupuesto == annio
                             group pre by new { pre.Clasificacion, pre.NombreEntidad } into g
                                           select new InfoPresupuesto {
                                               rawValue = (decimal)g.Sum(g => g.PresupuestoVigente) / 1000000,
                                               labelGroup = g.Key.Clasificacion,
                                               label=g.Key.NombreEntidad
                                           }).ToList();
            }

            return objReturn;

        }

        public List<InfoPresupuesto> ObtenerPresupuestoTotalAnnio(int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();
            objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                         where pre.AnioPresupuesto == annio
                            group pre by pre.CodigoVersion into g
                            select new InfoPresupuesto {
                                 totalGasto = (decimal)g.Sum(g => g.PresupuestoVigente),
                                 totalPresupuesto = (decimal)g.Sum(g => g.PresupuestoVigente),
                                 trimestre = "3", //cambiar cuando se tenga fecha en la tabla
                                 annio = annio
                             }).ToList();
            

            return objReturn;
    }

        public List<InfoPresupuesto> ObtenerGastoSectores(int consulta, int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();
            if (consulta == 0) {

                var query1 = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              where pre.AnioPresupuesto == annio
                              group pre by new { pre.Sectores } into g
                              select new InfoPresupuesto {
                                  rawValue = (decimal)(g.Sum(g => g.PresupuestoVigente)/1000000),
                                  label = g.Key.Sectores,
                              }).OrderByDescending(g => g.rawValue).Take(4);

                objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                             where pre.AnioPresupuesto == annio && (pre.CodigoVersion == 2 || pre.CodigoVersion == 50)
                                group pre by new { pre.Sectores, pre.CodigoVersion } into g
                                from que in query1.Where(j => j.label == g.Key.Sectores)
                                select new InfoPresupuesto {
                                    rawValue = (decimal)(g.Sum(g => g.PresupuestoVigente) / 1000000),
                                    label = g.Key.Sectores,
                                    labelGroup = (annio == 2022 ?  "Presupuesto Proyecto Ejecutivo por sector" : "Presupuesto Vigente por sector")
                                }).Union(
                             (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                             where pre.AnioPresupuesto == annio && (pre.CodigoVersion == 2 || pre.CodigoVersion == 50)
                             group pre by new { pre.Sectores, pre.CodigoVersion } into g
                             from que in query1.Where(j => j.label == g.Key.Sectores)
                             select new InfoPresupuesto {
                                 rawValue = (decimal)(g.Sum(g => g.PresupuestoAvance) / 1000000),
                                 label = g.Key.Sectores,
                                 labelGroup = "Presupuesto Avance por sector"
                             })).OrderByDescending(g => g.rawValue).ToList();

                //objReturn = (from pre in _connection.PresupuestoXSectorMinHaciendas
                //             where pre.AnioPresupuesto == annio && (pre.CodigoVersion==2 || pre.CodigoVersion == 50)
                //             orderby pre.Presupuesto descending
                //             group pre by new { pre.Sectores, pre.CodigoVersion } into g
                //             select new InfoPresupuesto {
                //                 rawValue = (decimal)g.Sum(g => g.Presupuesto),
                //                // totalGasto = g.Key.CodigoVersion == 2 ? g.Sum(g => g.Presupuesto) : null,
                //                 label = g.Key.Sectores,
                //                 labelGroup = g.Key.CodigoVersion ==2 ? "Presupuesto asignado al sector" : g.Key.CodigoVersion == 50 ? "Gasto ecónomico por sector" :""
                //             }).Take(8).ToList();
            }
            if (consulta == 1) {

                objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                             where pre.AnioPresupuesto == annio && (pre.CodigoVersion == 2 || pre.CodigoVersion == 50)
                             group pre by new { pre.Sectores, pre.CodigoVersion } into g
                             select new InfoPresupuesto {
                                 rawValue = (decimal)(g.Sum(g => g.PresupuestoVigente) / 1000000),
                                 //totalGasto = g.Key.CodigoVersion == 2 ? g.Sum(g => g.Presupuesto) : null,
                                 label = g.Key.Sectores,
                                 labelGroup = "Presupuesto Vigente por sector" 
                             }).Union
                             (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              where pre.AnioPresupuesto == annio && (pre.CodigoVersion == 2 || pre.CodigoVersion == 50)
                              group pre by new { pre.Sectores, pre.CodigoVersion } into g
                              select new InfoPresupuesto {
                                  rawValue = (decimal)(g.Sum(g => g.PresupuestoAvance) / 1000000),
                                  //totalGasto = g.Key.CodigoVersion == 2 ? g.Sum(g => g.Presupuesto) : null,
                                  label = g.Key.Sectores,
                                  labelGroup =  "Presupuesto Avance por sector" 
                              }).OrderByDescending(g => g.rawValue).ToList();
            }
    
            return objReturn;

        }


        public List<InfoPresupuesto> ObtenerPresupuestoSolicitadoAprobado(int consulta, int annio, int version1, int version2)
        {
             List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();
            if (consulta == 0) {

                var query1 = (from pre in _connection.PresupuestoXVersionMinHacientas
                              where pre.AnioPresupuesto == annio && (pre.CodigoVersion == version1)
                              group pre by new { pre.Sectores, pre.NombreVersion } into g
                              select new InfoPresupuesto {
                                  rawValue = (decimal)(g.Sum(g => g.Presupuesto) / 1000000),
                                  label = g.Key.Sectores,
                              }).OrderByDescending(g => g.rawValue).Take(4);


                objReturn = (from pre in _connection.PresupuestoXVersionMinHacientas
                             where pre.AnioPresupuesto == annio && (pre.CodigoVersion == version1 || pre.CodigoVersion == version2)
                             orderby pre.Presupuesto descending
                             group pre by new { pre.Sectores, pre.NombreVersion } into g
                             from que in query1.Where(j => j.label == g.Key.Sectores)
                             select new InfoPresupuesto {
                                 //totalPresupuesto = g.Key.CodigoVersion == 50 ? g.Sum(g => g.Presupuesto) : null,
                                 //totalGasto = g.Key.CodigoVersion == 2 ? g.Sum(g => g.Presupuesto) : null,
                                 //totalMH= g.Key.CodigoVersion == 23 ? g.Sum(g => g.Presupuesto) : null,
                                 rawValue = (decimal)(g.Sum(g => g.Presupuesto) / 1000000),
                                 label = g.Key.Sectores,
                                 labelGroup = g.Key.NombreVersion //g.Key.CodigoVersion == 2 ? "Presupuesto solicitado por entidades" : g.Key.CodigoVersion == 23 ? "Presupuesto aprobado por MH" : g.Key.CodigoVersion == 50 ? "Presupuesto por aprobado el Congreso" : ""
                             }).ToList();
            }
            if (consulta == 1) {
                objReturn = (from pre in _connection.PresupuestoXVersionMinHacientas
                             where pre.AnioPresupuesto == annio && (pre.CodigoVersion == version1 || pre.CodigoVersion == version2)
                             orderby pre.Presupuesto descending
                             group pre by new { pre.Sectores, pre.NombreVersion } into g
                             select new InfoPresupuesto {
                                 //totalPresupuesto = g.Key.CodigoVersion == 50 ? g.Sum(g => g.Presupuesto) : null,
                                 //totalGasto = g.Key.CodigoVersion == 2 ? g.Sum(g => g.Presupuesto) : null,
                                 //totalMH = g.Key.CodigoVersion == 23 ? g.Sum(g => g.Presupuesto) : null,
                                 rawValue = (decimal)(g.Sum(g => g.Presupuesto) / 1000000),
                                 label = g.Key.Sectores,
                                 labelGroup = g.Key.NombreVersion// g.Key.CodigoVersion == 2 ? "Presupuesto solicitado por entidades" : g.Key.CodigoVersion == 23 ? "Presupuesto aprobado por MH" : g.Key.CodigoVersion == 50 ? "Presupuesto por aprobado el Congreso" : ""
                             }).OrderByDescending(g => g.rawValue).ToList();
            }

            return objReturn;

        }


        public List<InfoPresupuesto> ObtenerGastoPresupuestalTiempo(int consulta, int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();
            
            if (consulta == 0) {

                var query1 = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              where  (pre.AnioPresupuesto > DateTime.Today.Year-5)
                              group pre by new { pre.Sectores, pre.AnioPresupuesto } into g
                              select new  InfoPresupuesto {
                                  totalGasto = (decimal)g.Sum(g => g.PresupuestoVigente),
                                  labelGroup = g.Key.Sectores,
                                  label = g.Key.AnioPresupuesto.ToString()
                              });
                var query2 = (from pre in query1
                              group pre by new { pre.label } into g
                              select new InfoPresupuesto {
                                  totalPresupuesto = g.Sum(t => t.totalGasto),
                                  label = g.Key.label
                              });
                objReturn = (from pre in query1
                             from gas in query2.Where(j => j.label == pre.label)
                             select new InfoPresupuesto {
                                 rawValue = (gas.totalPresupuesto > 0 ? (decimal)((pre.totalGasto / gas.totalPresupuesto) *100) : 0),
                                 labelGroup = pre.labelGroup,
                                 label = pre.label
                             }).ToList();

                
            }
            if (consulta == 1) {
                //busco total por sector en cada año
                var query1 = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              group pre by new { pre.Sectores,  pre.AnioPresupuesto } into g
                              select new InfoPresupuesto {
                                  totalGasto = (decimal)g.Sum(g => g.PresupuestoVigente), //temporal para total de cada sector
                                  labelGroup = g.Key.Sectores,
                                  label = g.Key.AnioPresupuesto.ToString()
                              });
                // busco total del presupuesto en cada año
                var query2 = (from pre in query1
                              group pre by new { pre.label } into g
                              select new InfoPresupuesto {
                                  totalPresupuesto = g.Sum(t => t.totalGasto), //temporal para total de cada año
                                  label = g.Key.label
                              });
                // obtengo porcentaje del presupuesto total por sector en cada año
                objReturn = (from pre in query1
                             from gas in query2.Where(j => j.label == pre.label)
                             select new InfoPresupuesto {
                                 rawValue = (gas.totalPresupuesto > 0 ? (decimal)((pre.totalGasto / gas.totalPresupuesto) * 100) : 0), //porcentaje
                                 labelGroup = pre.labelGroup,
                                 label = pre.label
                             }).OrderByDescending(g => g.rawValue).ToList();
            }

            return objReturn;

        }

        public List<InfoPresupuesto> ObtenerGrupoDeGasto(int consulta, int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();

            if (consulta == 0) {

                //var query0 = ((from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                //               where pre.AnioPresupuesto == annio ///presupuesto año seleccionado
                //               group pre by new { pre.DescripcionGrupo } into g
                //               select new InfoPresupuesto {
                //                   rawValue = (decimal)(g.Sum(g => g.PresupuestoVigente)),
                //                   labelGroup = g.Key.DescripcionGrupo
                //               }).OrderByDescending(g => g.rawValue).Take(4));

                var query1 = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              where (pre.AnioPresupuesto == annio - 1) //datos del año anterior al seleccionado
                              group pre by new { pre.DescripcionGrupo, pre.AnioPresupuesto } into g
                              from q0 in ((from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                                           where pre.AnioPresupuesto == annio ///top del presupuesto del año seleccionado
                                           group pre by new { pre.DescripcionGrupo } into h
                                           select new InfoPresupuesto {
                                               rawValue = (decimal)(h.Sum(h => h.PresupuestoVigente)),
                                               labelGroup = h.Key.DescripcionGrupo
                                           }).OrderByDescending(h => h.rawValue).Take(4))
                                           .Where(j => j.labelGroup == g.Key.DescripcionGrupo) //inner join
                              select new InfoPresupuesto {
                                  totalGasto = (decimal)g.Sum(g => g.PresupuestoVigente) / 1000000, 
                                  labelGroup = g.Key.DescripcionGrupo,
                                  annio = g.Key.AnioPresupuesto,
                                  rawValue=0
                              });

                var annioanterior = query1.Count(); /// saber si existendatos del año anterior al seleccionado

                var query2 = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              where (pre.AnioPresupuesto == annio) //datos año seleccionado
                              group pre by new { pre.DescripcionGrupo, pre.AnioPresupuesto } into g
                              from q0 in ((from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                                           where pre.AnioPresupuesto == annio 
                                           group pre by new { pre.DescripcionGrupo } into h
                                           select new InfoPresupuesto {
                                               rawValue = (decimal)(h.Sum(h => h.PresupuestoVigente)),
                                               labelGroup = h.Key.DescripcionGrupo
                                           }).OrderByDescending(h => h.rawValue).Take(4))
                              .Where(j => j.labelGroup == g.Key.DescripcionGrupo)
                              select new InfoPresupuesto {
                                  totalPresupuesto = (decimal)g.Sum(t => t.PresupuestoVigente) / 1000000,
                                  labelGroup = g.Key.DescripcionGrupo,
                                  annio = g.Key.AnioPresupuesto,
                                  rawValue=0
                              });
                if (annioanterior > 0) {

                    objReturn = (from gas in query1
                                      from pre in query2.Where(j => j.labelGroup == gas.labelGroup).DefaultIfEmpty()
                                      select new InfoPresupuesto {
                                          rawValue = (gas.totalGasto > 0 ? (decimal)((pre.totalPresupuesto / gas.totalGasto) * 100) - 100 : 0),
                                          labelGroup = pre.labelGroup,
                                          annio = pre.annio,
                                          totalPresupuesto = pre.totalPresupuesto

                                      }).OrderByDescending(g => g.totalPresupuesto).Union(from gas in query1
                                                                                          from pre in query2.Where(j => j.labelGroup == gas.labelGroup).DefaultIfEmpty()
                                                                                          select new InfoPresupuesto {
                                                                                              rawValue = (gas.totalGasto > 0 ? (decimal)((pre.totalPresupuesto / gas.totalGasto) * 100) - 100 : 0),
                                                                                              labelGroup = pre.labelGroup,
                                                                                              annio = gas.annio,
                                                                                              totalPresupuesto = gas.totalGasto

                                                                                          }).OrderBy(g => g.annio).ThenByDescending(g => g.totalPresupuesto)

                   .ToList();
                }
                else {
                    objReturn = query2.ToList();


                }

            }
            if (consulta == 1) {
                var query1 = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              where (pre.AnioPresupuesto == annio - 1)
                              group pre by new { pre.DescripcionGrupo, pre.AnioPresupuesto } into g
                              select new InfoPresupuesto {
                                  totalGasto = (decimal)g.Sum(g => g.PresupuestoVigente) / 1000000, ///presupuesto año anterior al seleccionado
                                  labelGroup = g.Key.DescripcionGrupo,
                                  annio = g.Key.AnioPresupuesto,
                                  rawValue = 0
                              });

                var annioanterior = query1.Count();

                var query2 = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                              where (pre.AnioPresupuesto == annio)
                              group pre by new { pre.DescripcionGrupo, pre.AnioPresupuesto } into g
                              select new InfoPresupuesto {
                                  totalPresupuesto = (decimal)g.Sum(t => t.PresupuestoVigente) / 1000000,
                                  labelGroup = g.Key.DescripcionGrupo,
                                  annio = g.Key.AnioPresupuesto,
                                  rawValue = 0
                              });
                if (annioanterior > 0) {

                    objReturn = (from gas in query1
                                 from pre in query2.Where(j => j.labelGroup == gas.labelGroup).DefaultIfEmpty()
                                 select new InfoPresupuesto {
                                     rawValue = (gas.totalGasto > 0 ? (decimal)((pre.totalPresupuesto / gas.totalGasto) * 100) - 100 : 0),
                                     labelGroup = pre.labelGroup,
                                     annio = pre.annio,
                                     totalPresupuesto = pre.totalPresupuesto

                                 }).OrderByDescending(g => g.totalPresupuesto).Union(from gas in query1
                                                                                     from pre in query2.Where(j => j.labelGroup == gas.labelGroup).DefaultIfEmpty()
                                                                                     select new InfoPresupuesto {
                                                                                         rawValue = (gas.totalGasto > 0 ? (decimal)((pre.totalPresupuesto / gas.totalGasto) * 100) - 100 : 0),
                                                                                         labelGroup = pre.labelGroup,
                                                                                         annio = gas.annio,
                                                                                         totalPresupuesto = gas.totalGasto

                                                                                     }).OrderBy(g => g.annio).ThenByDescending(g=> g.totalPresupuesto)

                   .ToList();
                }
                else {
                    objReturn = query2.ToList();


                }

                
            }
            return objReturn;
        }



        public List<InfoPresupuesto> ObtenerClasificacion(int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();

         
                objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                             where pre.AnioPresupuesto == annio
                             group pre by new { pre.Clasificacion, pre.CodigoVersion, pre.AnioPresupuesto } into g
                             select new InfoPresupuesto {
                                 totalClasificacion = (decimal)g.Sum(g => g.PresupuestoVigente),
                                 clasificacion =g.Key.Clasificacion,
                                 version=g.Key.CodigoVersion
                             }).ToList();
            return objReturn;

        }

        public List<InfoPresupuesto> ObtenerEntidad(int annio, string clasificacion)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();


            objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                         where pre.AnioPresupuesto == annio && (pre.Clasificacion == clasificacion)
                         group pre by new { pre.NombreEntidad, pre.CodigoVersion, pre.AnioPresupuesto } into g
                         select new InfoPresupuesto {
                             totalEntidad = (decimal)g.Sum(g => g.PresupuestoVigente),
                             entidad = g.Key.NombreEntidad,
                             version = g.Key.CodigoVersion
                         }).ToList();

            return objReturn;

        }
        public List<InfoPresupuesto> ObtenerClasePrograma(int annio, string clasificacion, string entidad)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();


            objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                         where pre.AnioPresupuesto == annio && (pre.Clasificacion == clasificacion) && (pre.NombreEntidad == entidad)
                         group pre by new { pre.ClasePrograma, pre.CodigoVersion, pre.AnioPresupuesto } into g
                         select new InfoPresupuesto {
                             totalClasePrograma = (decimal)g.Sum(g => g.PresupuestoVigente),
                             clasePrograma = g.Key.ClasePrograma,
                             version = g.Key.CodigoVersion
                         }).ToList();

            return objReturn;

        }



        public List<InfoPresupuesto> ObtenerProyectoActividades(int annio, string clasificacion, string entidad, string clasePrograma)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();


            objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                         where pre.AnioPresupuesto == annio && (pre.Clasificacion == clasificacion)  && (pre.NombreEntidad == entidad) && (pre.ClasePrograma == clasePrograma)
                         group pre by new { pre.NombreProyectoActividad, pre.CodigoVersion, pre.AnioPresupuesto } into g
                         select new InfoPresupuesto {
                             totalProyectoActividad = (decimal)g.Sum(g => g.PresupuestoVigente),
                             proyectoActividad = g.Key.NombreProyectoActividad,
                             version = g.Key.CodigoVersion
                         }).ToList();

            return objReturn;

        }

        public List<InfoPresupuesto> ObtenerVersiones(int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();


            objReturn = (from pre in _connection.PresupuestoXVersionMinHacientas
                         where pre.AnioPresupuesto == annio 
                         group pre by new { pre.AnioPresupuesto, pre.CodigoVersion, pre.NombreVersion } into g
                         select new InfoPresupuesto {
                             nombreVersion= g.Key.NombreVersion,
                             version = (int)g.Key.CodigoVersion
                         }).OrderBy(g => g.version).ToList();

            return objReturn;

        }

        public List<InfoPresupuesto> ObtenerEntidadOG(int annio)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();


            objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                         where pre.AnioPresupuesto == annio
                         group pre by new { pre.NombreEntidad, pre.CodigoVersion, pre.AnioPresupuesto } into g
                         select new InfoPresupuesto {
                             totalEntidad = (decimal)g.Sum(g => g.PresupuestoVigente),
                             entidad = g.Key.NombreEntidad,
                             version = g.Key.CodigoVersion
                         }).ToList();

            return objReturn;

        }

        public List<InfoPresupuesto> ObtenerProyectoActividadesOG(int annio, string entidad)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();


            objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                         where pre.AnioPresupuesto == annio && (pre.NombreEntidad == entidad) 
                         group pre by new { pre.NombreProyectoActividad, pre.CodigoVersion, pre.AnioPresupuesto } into g
                         select new InfoPresupuesto {
                             totalProyectoActividad = (decimal)g.Sum(g => g.PresupuestoVigente),
                             proyectoActividad = g.Key.NombreProyectoActividad,
                             version = g.Key.CodigoVersion
                         }).ToList();

            return objReturn;

        }

        public List<InfoPresupuesto> ObtenerObjetoGasto(int annio, string entidad, string proyectoActividad)
        {
            List<InfoPresupuesto> objReturn = new List<InfoPresupuesto>();


            objReturn = (from pre in _connection.PresupuestoVigenteXSectorMinHaciendas
                         where pre.AnioPresupuesto == annio && (pre.NombreEntidad == entidad) && (pre.NombreProyectoActividad == proyectoActividad)
                         group pre by new { pre.NombreObjetoGasto, pre.CodigoVersion, pre.AnioPresupuesto } into g
                         select new InfoPresupuesto {
                             totalPresupuesto = (decimal)g.Sum(g => g.PresupuestoVigente),
                             labelGroup = g.Key.NombreObjetoGasto,
                             version = g.Key.CodigoVersion
                         }).ToList();

            return objReturn;

        }
    }
}
