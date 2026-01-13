using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Modelos.Presupuesto;
using PlataformaTransparencia.Negocios.Interfaces;
using System;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Emergencia
{
  [ApiController]
  [Route("api/[controller]")]
  public class ServiciosEmergenciasController : Controller
  {
    private readonly ILogger<ServiciosEmergenciasController> _logger;
    private readonly TransparenciaDB _connection;
    private readonly IEmergenciaBLL _cargaemergencia;
    private readonly IPresupuestoEmergenciaBLL _cargapresupuestoemergencia;
    public ServiciosEmergenciasController(ILogger<ServiciosEmergenciasController> logger, TransparenciaDB connection, IEmergenciaBLL cargaemergencia, IPresupuestoEmergenciaBLL cargapresupuestoemergencia)
    {
      _logger = logger;
      _connection = connection;
      _cargaemergencia = cargaemergencia;
      _cargapresupuestoemergencia = cargapresupuestoemergencia;

    }

    [HttpGet("GetInformacionContratosEmergenciaPorFiltros")]
    public ModelContratosData GetInformacionContratosEmergenciaPorFiltros(int NumeroPagina, int RegistrosPorPagina, string NombreEntidad, string NombreProceso, string Estado, int? TipoEmergencia)
    {

      ModelContratosData objReturn = new();
      ContratosFiltros filtros = new ContratosFiltros
      {
        Estado = Estado,
        NombreEntidad = NombreEntidad,
        NombreProceso = NombreProceso,
        NumeroPagina = NumeroPagina,
        RegistrosPorPagina = RegistrosPorPagina,
        OrigenInformacion = TipoEmergencia.ToString()
      };

      try
      {
        var valores = _cargaemergencia.ObtenerInformacionContratosEmergeciasPorFiltros(filtros);
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


        [HttpGet("GetEntidadContratosEmergenciaPorNombre")]
        public ModelNombreEntidad GetEntidadContratosEmergenciaPorNombre(string NombreEntidad, int? TipoEmergencia)
        {
            ContratosFiltros filtros = new ContratosFiltros
            {
                
                NombreEntidad = NombreEntidad,
                OrigenInformacion = TipoEmergencia.ToString()
            };

            // var data = req.Content.ReadAsStringAsync().Result;// to extract data
            ModelNombreEntidad objReturn = new ModelNombreEntidad();
            try
            {
                var valores = _cargaemergencia.ObtenerEntidadGestionContratosPorNombre(filtros);
                objReturn.Nombre = valores;
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


        [HttpGet("GetInformacionProcesosCanceladosEmergenciaPorFiltros")]
        public ModelInformacionContratos GetInformacionProcesosCanceladosEmergenciaPorFiltros(int NumeroPagina, int RegistrosPorPagina, string NombreEntidad, string NombreProceso, int? TipoEmergencia)
        {
           
            ContratosFiltros filtros = new ContratosFiltros
            {
            
                NombreEntidad = NombreEntidad,
                NombreProceso = NombreProceso,
                NumeroPagina = NumeroPagina,
                RegistrosPorPagina = RegistrosPorPagina,
                OrigenInformacion = TipoEmergencia.ToString()
            };
            ModelInformacionContratos objReturn = new ModelInformacionContratos();
            try
            {
                var valores = _cargaemergencia.ObtenerInformacionProcesosCanceladosEmergenciaPorFiltros(filtros);
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


        [HttpGet("ObtDistribucionPresupuestalGeneralPorTipoEmergencia")]
        public ModelCovidFuentesData ObtDistribucionPresupuestalGeneralPorTipoEmergencia(int? anyo)
        {
            ModelCovidFuentesData objReturn = new ModelCovidFuentesData();
            try
            {
                objReturn.distribucionItem = _cargapresupuestoemergencia.ObtDistribucionPresupuestalPorTipoEmergencia(null,anyo);
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


       
        [HttpGet("GetConsolidadoPresuAsignadoPorEntidadAnio")]
        public List<InfoGraficoItemPrograma> GetConsolidadoPresuAsignadoPorEntidadAnio()
        {
            List<InfoGraficoItemPrograma> objReturn = new List<InfoGraficoItemPrograma>();
            try
            {
                objReturn = _cargapresupuestoemergencia.ObtenerPresupuestoGeneralAsignadoPorEntidad();//anio
                return objReturn;
            }
            catch (Exception)
            {
                //objReturn.Status = false;
                //objReturn.Message = "Error: " + exception.Message;
                return objReturn;
            }
        }

    }
}
