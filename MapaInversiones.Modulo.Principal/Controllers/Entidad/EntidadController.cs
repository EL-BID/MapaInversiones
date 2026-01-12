using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Entidad;
using PlataformaTransparencia.Negocios.Interfaces;
using Quartz.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modulo.Principal.Controllers.Entidad
{
    public class EntidadController : Controller
    {

        private readonly ILogger<EntidadController> _logger;
        private readonly TransparenciaDB _connection;

        public EntidadController(ILogger<EntidadController> logger, TransparenciaDB connection)
        {
            _logger = logger;
            _connection = connection;
            
        }     
                
        public IActionResult perfilEntidad(string codEntidad)
        {
            if (string.IsNullOrWhiteSpace(codEntidad))
            {
                return BadRequest("codEntidad no puede ser vacío o nulo");
            }
            ModelEntidadData modelo = new ModelEntidadData();
            
            using (var DataModel = new TransparenciaDB())
            {
                var grupos = (from pre in _connection.VwPresupuesto
                              join ct in _connection.CatalogoTiempos on pre.Periodo equals ct.Periodo
                              where pre.CodigoInstitucion == codEntidad
                              group pre by ct.Año into g
                              select new 
                              {
                                  id = g.Key,
                                  name = g.Key.ToString(),
                                  institucion = g.First().Institucion
                              }).Distinct().OrderByDescending(x => x.id).ToList();

                modelo.periodos = grupos.Any() ? grupos.Select(g => new Period { id = g.id, name = g.name }).ToList() : new List<Period>();
                modelo.Nombre = grupos.Any() ? grupos.First().institucion : string.Empty;
                modelo.Codigo = codEntidad;
            }

            return View(modelo);
        }

    }
}
