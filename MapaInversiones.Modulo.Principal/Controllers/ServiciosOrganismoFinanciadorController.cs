using Microsoft.AspNetCore.Mvc;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.OrganismoFinanciador;
using PlataformaTransparencia.Negocios.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [Route("api/ServiciosOrganismoFinanciador")]
    public class ServiciosOrganismoFinanciadorController : Controller
    {
        private IFinanciadorBLL _financiadorBll;

        public ServiciosOrganismoFinanciadorController(IFinanciadorBLL financiadorBll)
        {
            _financiadorBll = financiadorBll;
        }

        [HttpGet("GetOrganismosFinanciadoresPorAnioAndCodigoFuente")]
        public ModelDataConsolidadoFinanciador GetOrganismosFinanciadoresPorAnioAndCodigoFuente()
        {
            string annio = Request.Query.ContainsKey("anio") ? Request.Query["anio"].ToString() : string.Empty;
            string codigofuente = Request.Query.ContainsKey("codigofuente") ? Request.Query["codigofuente"].ToString() : string.Empty;
            if (!int.TryParse(annio, out int anio)) return new();
            if (!int.TryParse(codigofuente, out int codigoFuente)) return new();
            List<ModelDataFinanciador> financiadores = _financiadorBll.ObtenerOrganismosFinanciadoresPorAnioAndCodigoFuente(anio, codigoFuente);
            financiadores ??= new();
            if(financiadores.Count > 1) financiadores= financiadores.OrderBy(x=>x.Nombre).ToList();
            ModelDataConsolidadoFinanciador rta = _financiadorBll.ObtenerConsolidadoOrganismosFinanciadoresPorAnioAndCodigoFuente(anio, codigoFuente);
            rta.Financiadores = financiadores;
            return rta;
        }

        [HttpGet("ObtenerOrganismosFinanciadoresPorAnioAndCodigoFinanciador")]
        public ModelDataFinanciador ObtenerOrganismosFinanciadoresPorAnioAndCodigoFinanciador()
        {
            string annio = Request.Query.ContainsKey("anio") ? Request.Query["anio"].ToString() : string.Empty;
            string codigoFinanciador = Request.Query.ContainsKey("codigofinanciador") ? Request.Query["codigofinanciador"].ToString() : string.Empty;
            if (!int.TryParse(annio, out int anio)) return new();
            if (!int.TryParse(codigoFinanciador, out int codigoOrganismoFinanciador)) return new();
            ModelDataFinanciador rta = _financiadorBll.ObtenerDataFinanciadorPorAnioAndCodigoFinanciador(anio, codigoOrganismoFinanciador);
            return rta ?? (new());
        }

        [HttpGet("ObtenerRecursosGraficoTreeMapSectoresPorCodigoFinanciadorAnio")]
        public ModelPresupuestoData ObtenerRecursosGraficoTreeMapSectoresPorCodigoFinanciadorAnio(int anyo, int codigoFinanciador)
        {
            ModelPresupuestoData objReturn = new() { Status=true };
            try
            {
                objReturn.InfoRecursos = _financiadorBll.ObtenerRecursosGraficoTreeMapSectoresPorCodigoFinanciadorAnio(anyo, codigoFinanciador);
                return objReturn;
            }
            catch (Exception)
            {
                objReturn.Status = false;
                return objReturn;
            }
        }

        [HttpGet("ObtenerProyectosPorCodigoFinanciadorAnio")]
        public ModelProyectoTrazabilidadFinanciadorData ObtenerProyectosPorCodigoFinanciadorAnio(int anio, int codigoFinanciador)
        {
            ModelProyectoTrazabilidadFinanciadorData objReturn = new() { Status = true, Proyectos=new(), Message=string.Empty };
            try
            {
                objReturn.Proyectos = _financiadorBll.ObtenerDataProyectosPorAnioCodigoFinanciador(anio, codigoFinanciador);
                return objReturn;
            }
            catch (Exception)
            {
                objReturn.Status = false;
                return objReturn;
            }
        }

    }
}
