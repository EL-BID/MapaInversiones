using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.Contratos;
using PlataformaTransparencia.Negocios.Entidad;
using SolrNet;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Entidad
{
    [Route("api/serviciosentidad")]
    public class ServiciosEntidadController : Controller
    {
        private readonly ILogger<ServiciosPlanController> _logger;
        private readonly TransparenciaDB _connection;
        private ISolrOperations<Modelos.Proyectos.Proyecto> _solr;
        private IEntidadBLL consolidadosEntidades;
        public ServiciosEntidadController(ILogger<ServiciosPlanController> logger, TransparenciaDB connection, ISolrOperations<Modelos.Proyectos.Proyecto> solr, IEntidadBLL entidadesbll)
        {
            _logger = logger;
            _connection = connection;
            _solr = solr;
            consolidadosEntidades = entidadesbll;

        }


        [HttpGet("GetDatosEntidadPorAnnio")]
        public DatosEntidadAnio GetConsolidadoProgramasXCodEntidadAnio(string anio, string codEntidad)
        {
            DatosEntidadAnio objReturn = new DatosEntidadAnio();
            try
            {
                 //return consolidadosEntidades.GetDatosEntidadPorAnnio(anio, codEntidad);
            }
            catch (Exception exception)
            {

            }
            return objReturn;
        }

        [HttpGet("GetProgramasByEntidad")]
        public ModelEntidadData GetProgramasByEntidad(int annio, string codEntidad)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.infoProgramas = consolidadosEntidades.GetProgramasByEntidad(annio, codEntidad);
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }

        }

        [HttpGet("GetActividadesByPrograma")]
        public ModelEntidadData GetActividadesByPrograma(int annio, string codEntidad, int codPrograma)
        {
            ModelEntidadData objReturn = new ModelEntidadData();
            try
            {
                objReturn.infograficoActividad = consolidadosEntidades.GetActividadByPrograma(annio, codEntidad, codPrograma);
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }

        }

        //[HttpGet("GetGastoByPrograma")]
        //public ModelEntidadData GetGastoByPrograma(int annio, int codEntidad, int codPrograma, string estado, string proceso)
        //{
        //    ModelEntidadData objReturn = new ModelEntidadData();
        //    try
        //    {
        //        objReturn.infograficoEntidad = consolidadosEntidades.GetGastoByPrograma(annio, codEntidad, codPrograma, estado, proceso);

        //        objReturn.Status = true;
        //        return objReturn;
        //    }
        //    catch (Exception exception)
        //    {
        //        objReturn.Status = false;
        //        objReturn.Message = "Error: " + exception.Message;
        //        return objReturn;
        //    }

        //}

        [HttpGet("GetRecursosPerGrupos")]
        public ModelPresupuestoData GetRecursosPerGrupos(int anyo, int codEntidad)
        {
            double total = 0;
            List<InfoConsolidadoPresupuesto> info = new List<InfoConsolidadoPresupuesto>();
            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                info = consolidadosEntidades.ObtenerRecursosPerGrupos(anyo, codEntidad);
                if (info != null)
                {
                    foreach (InfoConsolidadoPresupuesto element in info)
                    {
                        total += element.rawValueDouble;
                    }
                }

                objReturn.TotalPresupuesto = (decimal)total;
                objReturn.InfoRecursos = info;
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }



        [HttpGet("ContratoXEntidad")]
        public ModelContratosXEntidadData ContratoXEntidad(int Annio, int NumeroPagina, int RegistrosPorPagina, string NombreEntidad, string NombreProceso, string IdProyecto, string Estado, string Moneda, string NombreContratista, string CodigoProveedor, string OrigenInformacion, string CodigoComprador)
        {

            ModelContratosXEntidadData objReturn = new ModelContratosXEntidadData();
            ContratosFiltros filtros = new ContratosFiltros();
            filtros.Moneda = Moneda;
            filtros.Annio = Annio;
            filtros.Estado = Estado;
            filtros.NombreEntidad = NombreEntidad;
            filtros.NombreProceso = NombreProceso;
            filtros.IdProyecto = IdProyecto;
            filtros.NumeroPagina = NumeroPagina;
            filtros.RegistrosPorPagina = RegistrosPorPagina;
            filtros.CodigoProveedor = CodigoProveedor;
            filtros.OrigenInformacion = OrigenInformacion;
            filtros.CodigoComprador = CodigoComprador;


            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = consolidadosEntidades.ObtenerInformacionContratosXEntidadPorFiltros(filtros);
                objReturn = valores;
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.InnerException;
                return objReturn;
            }
        }


        [HttpGet("GetGastoByTipo")]
        public ModelEntidadData GetGastoByTipo(int anyo, string codEntidad, string tipo, string programa)
        {
            ModelEntidadData objReturn = new() { Status=true };
            try
            {
                objReturn.detalleTipo = consolidadosEntidades.ObtenerRecursosPerTipo(anyo, codEntidad, tipo, programa);
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }


        [HttpGet("GetRecursosPorfinalidad")]
        public ModelPresupuestoData GetRecursosPorfinalidad(int anyo, string codEntidad)
        {
            List<itemNiveles> objGrupo = new List<itemNiveles>();
            List<InfoConsolidadoPresupuesto> info = new List<InfoConsolidadoPresupuesto>();
            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                info = consolidadosEntidades.GetRecursosPorfinalidad(anyo, codEntidad);
                objReturn.InfoRecursos = info;
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }


        [HttpGet("GetProcesosPorTipo")]
        public ModelPresupuestoData GetProcesosPorTipo(int anyo, string codEntidad)
        {

            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                objReturn.InfoRecursos = consolidadosEntidades.GetProcesosPorTipo(anyo, codEntidad);
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }

        [HttpGet("GetProcesosPorAnio")]
        public ModelProcesosXEntidadData GetProcesosPorAnio(int anio, string codEntidad)
        {

            ModelProcesosXEntidadData objReturn = new ModelProcesosXEntidadData();
            try
            {
                objReturn.Data = consolidadosEntidades.GetProcesosPorAnio(anio, codEntidad);
                objReturn.Status = true;
                objReturn.CantidadTotalRegistros = objReturn.Data.Count;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }


        [HttpGet("GetDistribucionGastoEntidad")]
        public ModelPresupuestoData GetDistribucionGastoEntidad(int annio, string codEntidad)
        {
            ModelPresupuestoData objReturn = new ModelPresupuestoData();
            try
            {
                List<InfoConsolidadoPresupuesto> info = consolidadosEntidades.GetDistribucionGastoEntidad(annio,  codEntidad);
                objReturn.ListInfoConsolidado = info;
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }



        [HttpGet("GetProveedorByNombre")]
        public ModelContratosXEntidadData GetProveedorByNombre(string proveedor, string institucion)
        {
            ModelContratosXEntidadData objReturn = new ModelContratosXEntidadData();


            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = consolidadosEntidades.ObtenerProveedor(proveedor, institucion);
                objReturn.Data = valores;
                objReturn.Status = true;
                return objReturn;
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.InnerException;
                return objReturn;
            }


        }

        [HttpGet("GetPresupuestoByAnnio")]
        public ModelEntidadData GetPresupuestoByAnnio(string anio, string codEntidad)
        {
            ModelEntidadData objReturn = new ModelEntidadData();

            try
            {
                    var datospresupuesto = consolidadosEntidades.GetDatosEntidadPorAnnio(anio, codEntidad);
                    objReturn.PresupuestoEjecutadoAnnioDisplay = (decimal)datospresupuesto.PresupuestoEjecutado;
                    objReturn.PresupuestoVigenteAnnioDisplay = (decimal)datospresupuesto.PresupuestoVigente;
                    objReturn.PorcEjecutadoAnnioDisplay = (decimal)(datospresupuesto.PresupuestoEjecutado / datospresupuesto.PresupuestoVigente) * 100;
                
            }
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.InnerException;
               
            }

            return objReturn;
        }


}
}
