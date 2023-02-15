using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public class MapController : Controller
    {
        private readonly ILogger<MapController> _logger;
        private readonly TransparenciaDB _connection;
        private readonly IGestorTitulos _gestorTitulos;
        private readonly IConfiguration Configuration;


        public MapController(ILogger<MapController> logger, TransparenciaDB connection, IGestorTitulos gestorTitulos, IConfiguration configuration)
        {
            _logger = logger;
            _connection = connection;
            _gestorTitulos = gestorTitulos;
            Configuration = configuration;
            CommonLabel.Init(connection, configuration);
        }
        public IActionResult MapView()
        {
            var horaInicio = DateTime.UtcNow;
            ViewBag.TitulosHome = _gestorTitulos;

            HomeContract homeContract = new HomeContract(_connection);
            homeContract.Fill();
            Debug.WriteLine("HomeController - Acción Index ejecutó en {0} ms", (horaInicio - DateTime.UtcNow).Milliseconds);
            return View(homeContract.HomeModel);
        }

        public IActionResult MapViewMobile()
        {
            var horaInicio = DateTime.UtcNow;
            ViewBag.TitulosHome = _gestorTitulos;

            HomeContract homeContract = new HomeContract(_connection);
            homeContract.Fill();
            Debug.WriteLine("HomeController - Acción Index ejecutó en {0} ms", (horaInicio - DateTime.UtcNow).Milliseconds);
            return View(homeContract.HomeModel);
        }
    }
}
