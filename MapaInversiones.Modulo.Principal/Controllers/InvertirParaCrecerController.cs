using DocumentFormat.OpenXml.Office2010.ExcelAc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Emprestitos;
using PlataformaTransparencia.Modelos.Entidad;
using PlataformaTransparencia.Negocios.Emprestitos;
using PlataformaTransparencia.Negocios.Entidad;
using PlataformaTransparencia.Negocios.Home;
using PlataformaTransparencia.Negocios.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public class InvertirParaCrecerController : Controller
    {

        private readonly ILogger<PresupuestoController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IEmprestitosBLL _consolidadosEmprestito;


        public InvertirParaCrecerController(ILogger<PresupuestoController> logger, TransparenciaDB connection, IEmprestitosBLL consolidadosEmprestitoBLL)
        {
            _logger = logger;
            _connection = connection;
            _consolidadosEmprestito = consolidadosEmprestitoBLL;

        }

        public ActionResult InfografiaPrestamosCali()
        {
            ModelEmprestitoData modelo = _consolidadosEmprestito.GetEmprestitoData();

            ViewData["ruta"] = "InvertirParaCrecer";
            return View(modelo);
        }

        public ActionResult PerfilPrestamo(int? id)
        {
            int idPerfil = id ?? 0;
            if (idPerfil == 0)
            {
                return BadRequest("El id del préstamo no puede ser cero.");
            }
            EmprestitosBLL emprestitoBll = new(_connection);
            return View(emprestitoBll.Fill(idPerfil));
        }


    }
}
