using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Proyectos;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace PlataformaTransparencia.Negocios.BLL.Comunes
{
    [ExcludeFromCodeCoverage]
    public class FiltrosTotalesBLL
    {
        static string MENSAJE_ERROR = "Lo sentimos, ha ocurrido un error.";

        public static ModelDataFilters ObtenerTodosLosFiltrosAplicativo()
        {
            var objReturn = new ModelDataFilters();
            var objNegocioFiltros = new BllSearchFilters();
            try {
                objNegocioFiltros.GenerateGeographicFilters(objReturn);//Trae los filtros geograficos {Region/Dpto/Municipio}                
                objNegocioFiltros.ObtenerFiltrosEspecificosParaProyectos(objReturn);
                //objReturn.filters.AddRange(BusquedaRecursosBLL.ObtenerFiltrosEspecificosParaRecursos());//Trae Fuentes (Tipo de Recursos y Periodos para recursos)
                //objReturn.filters.AddRange(BusquedaProduccionBLL.ObtenerFiltrosEspecificosParaProduccion());//Trae Fuentes (Tipo de Recursos y Periodos para recursos)
                //objReturn.filters.AddRange(BusquedaFiscalizacionBLL.ObtenerFiltrosEspecificosParaFiscalizacion());//

                objReturn.Status = true;
            }
            catch (Exception ex) {
                LogHelper.GenerateLog(ex);
                objReturn.Message = MENSAJE_ERROR;
            }
            return objReturn;
        }

        public static Filter ObtenerFiltrosPeriodosAplicativo(GenericEnumerators.SeccionFuncionalAplicativo seccion, string nombreFiltro)
        {
            Filter objReturn = new Filter(CommonLabel.PeriodsLabel, nombreFiltro, seccion.ToString());
            objReturn.esMultiple = true;

            PeriodoDeTiempo tiempo = new PeriodoDeTiempo();
            var lst = tiempo.FechasEjecucion.Select(tipoRecurso => new itemFilters()
            {
                value = tipoRecurso.ToString(),
                name = tipoRecurso.ToString()
            }).ToList();
            objReturn.items = lst;

            System.Diagnostics.Trace.WriteLine("Obtenidos la lista del filtro de periodos.");
            return objReturn;
        }

    }
}
