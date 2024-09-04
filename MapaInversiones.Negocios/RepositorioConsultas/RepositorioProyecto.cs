using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Comunes;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using LinqToDB;
using LinqToDB.Common;
using static PlataformaTransparencia.Infrastructura.DataModels.TransparenciaDBStoredProcedures;
using LinqToDB.Data;

namespace PlataformaTransparencia.Negocios.RepositorioConsultas
{
    public static class RepositorioProyectos
    {

        [ExcludeFromCodeCoverage]
        internal static List<ObtenerProyectosPorRegionPorFiltrosResult> ObtenerProyectosPorRegionPorFiltros(FiltroBusquedaProyecto filtro)
        {
            List<ObtenerProyectosPorRegionPorFiltrosResult> objReturn = new List<ObtenerProyectosPorRegionPorFiltrosResult>();

            using (var db = new TransparenciaDB()) {

                objReturn = db.ObtenerProyectosPorRegionPorFiltros(filtro.CodigosRegion.FirstOrDefault(),
                                                                    filtro.CodigosDepartamentos.FirstOrDefault(),
                                                                    filtro.CodigosMunicipios.FirstOrDefault(),
                                                                    filtro.CodigosSector.FirstOrDefault(),
                                                                    filtro.CodigosOrgFinanciador.FirstOrDefault(),
                                                                    filtro.CodigosEntidadEjecutora.FirstOrDefault(),
                                                                    filtro.ContieneNombreProyecto,
                                                                    Utilitarios.Utilidades.ListaToCsv(filtro.fechasEjecucion),
                                                                    filtro.CodigosEstado.FirstOrDefault()).ToList();

            }
            return objReturn;
        }

        [ExcludeFromCodeCoverage]
        internal static List<ObtenerProyectosPorDepartamentoPorFiltrosResult> ObtenerProyectosPorDepartamentoPorFiltros(FiltroBusquedaProyecto filtro)
        {
            List<ObtenerProyectosPorDepartamentoPorFiltrosResult> objReturn = new List<ObtenerProyectosPorDepartamentoPorFiltrosResult>();

            using (var db = new TransparenciaDB()) {

                objReturn = db.ObtenerProyectosPorDepartamentoPorFiltros(filtro.CodigosRegion.FirstOrDefault(),
                                                                    filtro.CodigosDepartamentos.FirstOrDefault(),
                                                                    filtro.CodigosMunicipios.FirstOrDefault(),
                                                                    filtro.CodigosSector.FirstOrDefault(),
                                                                    filtro.CodigosOrgFinanciador.FirstOrDefault(),
                                                                    filtro.CodigosEntidadEjecutora.FirstOrDefault(),
                                                                    filtro.ContieneNombreProyecto,
                                                                    Utilitarios.Utilidades.ListaToCsv(filtro.fechasEjecucion),
                                                                    filtro.CodigosEstado.FirstOrDefault()).ToList();
            }

            return objReturn;
        }

        [ExcludeFromCodeCoverage]
        internal static List<ObtenerProyectosPorMunicipioPorFiltrosResult> ObtenerProyectosPorMunicipioPorFiltros(FiltroBusquedaProyecto filtro)
        {
            List<ObtenerProyectosPorMunicipioPorFiltrosResult> objReturn = new List<ObtenerProyectosPorMunicipioPorFiltrosResult>();

            using (var db = new TransparenciaDB()) {
                objReturn = db.ObtenerProyectosPorMunicipioPorFiltros(filtro.CodigosRegion.FirstOrDefault(),
                                                                        filtro.CodigosDepartamentos.FirstOrDefault(),
                                                                        filtro.CodigosMunicipios.FirstOrDefault(),
                                                                        filtro.CodigosSector.FirstOrDefault(),
                                                                        filtro.CodigosOrgFinanciador.FirstOrDefault(),
                                                                        filtro.CodigosEntidadEjecutora.FirstOrDefault(),
                                                                        filtro.ContieneNombreProyecto,
                                                                        Utilitarios.Utilidades.ListaToCsv(filtro.fechasEjecucion),
                                                                        filtro.CodigosEstado.FirstOrDefault()).ToList();
            }

            return objReturn;
        }

        [ExcludeFromCodeCoverage]
        internal static List<ObtenerResumenesProyectosPorFiltrosResult> ObtenerResumenesProyectosPorFiltros(FiltroBusquedaProyecto filtro)
        {
            List<ObtenerResumenesProyectosPorFiltrosResult> objReturn = new List<ObtenerResumenesProyectosPorFiltrosResult>();

            ComunesGeoreferenciacion objNegocioGeoreferenciacion = new ComunesGeoreferenciacion();
            using (var db = new TransparenciaDB()) {
                objReturn = db.ObtenerResumenesProyectosPorFiltros(filtro.CodigosRegion.FirstOrDefault(),
                                                                        filtro.CodigosDepartamentos.FirstOrDefault(),
                                                                        filtro.CodigosMunicipios.FirstOrDefault(),
                                                                        filtro.CodigosSector.FirstOrDefault(),
                                                                        filtro.CodigosOrgFinanciador.FirstOrDefault(),
                                                                        filtro.CodigosEntidadEjecutora.FirstOrDefault(),
                                                                        filtro.ContieneNombreProyecto,
                                                                        Utilitarios.Utilidades.ListaToCsv(filtro.fechasEjecucion),
                                                                        filtro.CodigosEstado.FirstOrDefault()).ToList();
            }

            return objReturn;
        }

        [ExcludeFromCodeCoverage]
        internal static List<ObtenerProyectosConsistentesMapListModeResult> ObtenerProyectosConsistentesMapListMode(FiltroBusquedaProyecto filtro)
        {
            List<ObtenerProyectosConsistentesMapListModeResult> objReturn = new List<ObtenerProyectosConsistentesMapListModeResult>();

            ComunesGeoreferenciacion objNegocioGeoreferenciacion = new ComunesGeoreferenciacion();
            using (var db = new TransparenciaDB()) {

                objReturn = db.ObtenerProyectosConsistentesMapListMode(filtro.CodigosRegion.FirstOrDefault(),
                                                                    filtro.CodigosDepartamentos.FirstOrDefault(),
                                                                    filtro.CodigosMunicipios.FirstOrDefault(),
                                                                    filtro.CodigosSector.FirstOrDefault(),
                                                                    filtro.CodigosOrgFinanciador.FirstOrDefault(),
                                                                    filtro.CodigosEntidadEjecutora.FirstOrDefault(),
                                                                    filtro.ContieneNombreProyecto,
                                                                    Utilitarios.Utilidades.ListaToCsv(filtro.fechasEjecucion),
                                                                    filtro.CodigosEstado.FirstOrDefault()).ToList();
            }

            return objReturn;
        }

        [ExcludeFromCodeCoverage]
        internal static List<ActorFicha> ObtenerNombresActoresPorRolYProyecto(Int32 idProyecto, Int32 idRol)
        {
            List<ActorFicha> objReturn = null;
            using (var db = new TransparenciaDB()) {

                var lst = db.ObtenerNombresActoresPorRolYProyecto(Convert.ToInt32(idRol), Convert.ToInt32(idProyecto)).Select(p => new ActorFicha() {
                    Nombre = p.NombreActor,
                    Tipo = p.Rol
                }).ToList();

            objReturn = lst;
            }

            return objReturn;
        }

        [ExcludeFromCodeCoverage]
        internal static List<ActorFicha> ObtenerNombresGeografiasBeneficiadasProyecto(Int32 idProyecto)
        {
            List<ActorFicha> objReturn = null;
            using (var db = new TransparenciaDB()) {

                var lst = db.ObtenerNombresGeografiasBeneficiadasProyecto(Convert.ToInt32(idProyecto)).Select(p => new ActorFicha() {
                    Nombre = p.NombreEntidad,
                    IdDepartamento = p.IdDepartamento,
                    IdMunicipio = p.IdMunicipio,
                    Tipo = p.Tipo
                }).OrderBy(p => p.Nombre).ToList();
                objReturn = lst;
            }
            return objReturn;
        }

        internal static string ObtenerURLAuditoriaVisiblePorProyecto(int idProyecto)
        {
            string objReturn = string.Empty;
            using (var db = new TransparenciaDB()) {

                objReturn = db.ObtenerURLAuditoriaVisiblePorProyecto(Convert.ToInt32(idProyecto)).FirstOrDefault().ToString();
            }
            return objReturn;
        }

        internal static async System.Threading.Tasks.Task<string> ObtenerUrlReporteEmpalmeEjecutorAsync(int idProyecto)
        {
            string objReturn = null;
            using (var db = new TransparenciaDB()) {

                var codigoEntidadGesproy = await (from ejecutor in db.DatosAdicionalesEjecutores
                                                  join ejecutorGesProy in db.EntidadesEjecutorasGesProys
                                                  on ejecutor.NitEjecutor equals ejecutorGesProy.NIT
                                                  where ejecutor.IdProyecto == idProyecto
                                                  select ejecutorGesProy.CodigoEntidad).FirstOrDefaultAsync();
                if (codigoEntidadGesproy != 0) {
                    objReturn = codigoEntidadGesproy.ToString();
                }
            }
            return objReturn;
        }
    }
}
