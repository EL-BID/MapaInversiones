using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Negocios.Contratos;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Contratos
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiciosContratosController : Controller
    {
        private readonly ILogger<ServiciosContratosController> _logger;
        private readonly TransparenciaDB _connection;

        public ServiciosContratosController(ILogger<ServiciosContratosController> logger, TransparenciaDB connection)
        {
            _logger = logger;
            _connection = connection;

        }

        [HttpGet("GetAnniosContratos")]
        public ModelContratosAnios GetAnniosContratos(string Moneda, string? NombreProceso)
        {
            ModelContratosAnios objReturn = new ModelContratosAnios();
            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerAnniosContratos(Moneda, NombreProceso);
                objReturn = valores;
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

        [HttpGet("GetAnniosContratistas")]
        public ModelContratosAnios GetAnniosContratistas(string Contratista)
        {
            ModelContratosAnios objReturn = new ModelContratosAnios();
            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerAnniosContratistas(Contratista);
                objReturn = valores;
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

        [HttpGet("Contrato")]
        public ModelContratosData Contrato(int Annio, int NumeroPagina, int RegistrosPorPagina, string NombreEntidad, string NombreProceso, string Estado, string Moneda, string NombreContratista, string CodigoProveedor, string OrigenInformacion, string CodigoComprador, string CodigoContrato)
        {

            ModelContratosData objReturn = new ModelContratosData();
            ContratosFiltros filtros = new ContratosFiltros();
            filtros.Moneda = Moneda;
            filtros.Annio = Annio;
            filtros.Estado = Estado;
            filtros.NombreEntidad = NombreEntidad;
            filtros.NombreProceso = NombreProceso;
            filtros.NumeroPagina = NumeroPagina;
            filtros.RegistrosPorPagina = RegistrosPorPagina;
            filtros.CodigoProveedor = CodigoProveedor;
            filtros.OrigenInformacion = OrigenInformacion;
            filtros.CodigoComprador = CodigoComprador;
            filtros.CodigoContrato = CodigoContrato;


            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerInformacionContratosPorFiltros(filtros);
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

        [HttpGet("Contratista")]
        public ModelContratosData Contratista(int Annio, int NumeroPagina, int RegistrosPorPagina, string NombreEntidad, string NombreProceso, string Estado, string Moneda, string NombreContratista, string CodigoProveedor, string OrigenInformacion)
        {

            ModelContratosData objReturn = new ModelContratosData();
            ContratosFiltros filtros = new ContratosFiltros();
            filtros.Moneda = Moneda;
            filtros.Annio = Annio;
            filtros.Estado = Estado;
            filtros.NombreEntidad = NombreEntidad;
            filtros.NombreProceso = NombreProceso;
            filtros.NumeroPagina = NumeroPagina;
            filtros.RegistrosPorPagina = RegistrosPorPagina;
            filtros.CodigoProveedor = CodigoProveedor;
            filtros.OrigenInformacion = OrigenInformacion;


            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerInformacionContratistaPorFiltros(filtros);
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

        [HttpGet("DataContratosAnios")]
        public ModelContratosData DataContratosAnios(string Contratista)
        {

            ModelContratosData objReturn = new ModelContratosData();

            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerContratosPerAnyo(Contratista);
                objReturn.ContratosPerAnyo = valores;
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

        [HttpGet("DataValorContratosAnios")]
        public ModelContratosData DataValorContratosAnios(string Contratista)
        {

            ModelContratosData objReturn = new ModelContratosData();


            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerValorContratosPerAnyo(Contratista);
                objReturn.ContratosPerAnyo = valores;
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




        [HttpGet("GetCompradorByNombre")]
        public ModelContratosData GetCompradorByNombre(string Comprador)
        {
            ModelContratosData objReturn = new ModelContratosData();


            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerComprador(Comprador);
                objReturn.ContratosPerAnyo = valores;
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



        [HttpGet("GetContratosEntidad")]
        public ModelContratosData GetContratosEntidad(int Annio, string Moneda)
        {
            ModelContratosData objReturn = new ModelContratosData();


            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerConsolidado(Annio, Moneda);
                objReturn.Consolidados = valores;
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


        [HttpGet("GetArticulosContrato")]
        public ModelArticulosContrato GetArticulosContrato(string CodigoContrato)
        {
            ModelArticulosContrato objReturn = new ModelArticulosContrato();
            try
            {
                var aux = new ContratosBLL(_connection);
                var valores = aux.ObtenerArticulosContrato(CodigoContrato);
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

    }
}
 

