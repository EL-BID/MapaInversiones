using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using AngleSharp.Dom.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using SolrNet.Commands.Parameters;
using Microsoft.Extensions.Configuration;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly TransparenciaDB _connection;
        private ISolrOperations<PlataformaTransparencia.Modelos.SolrResponse> _solr;
        private IHomeBLL consolidadosHome;
        private readonly IConfiguration _configuration;

        public List<ContratosConsolidado> Consolidados { get; set; }


        public HomeController(IConfiguration configuration, ILogger<HomeController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.SolrResponse> solr, IHomeBLL consolidadosHomeBLL)
        {
            _logger = logger;
            _connection = connection;
            _solr = solr;
            consolidadosHome = consolidadosHomeBLL;
            _configuration = configuration;
        }
        public ActionResult Index()
        {
            HomeContract homeContract = new HomeContract(_configuration, _connection);
            homeContract.Fill();
            return View(homeContract.HomeModel);

        }

        [HttpGet("Search/{SearchString}")]
        public async Task<List<PlataformaTransparencia.Modelos.SolrResponse>> SearchAsync(string SearchString = "", string Type = "", string Id = "", int start = 0, int sort = 0, int rows = 10)
        {
            return (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Search(SearchString, Type, Id, start, sort, rows);
        }


        [HttpGet("AutocompleteSearch/{keywords}")]
        public async Task<List<PlataformaTransparencia.Modelos.SolrResponse>> GetSuggestionsAsync(string keywords)
        {
            return (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Autocomplete(keywords);
        }

        [HttpGet]
        public ViewResult BusquedaResultados(string SearchString = "", string Type = "", string Id = "", int start = 0, int sort = 0, int rows = 10)
        {
            var ListResultadosBusqueda = SearchAsync(SearchString, Type, Id, start, sort, rows).Result;
            var busquedaViewModel = new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel {
                CadenaBusqueda = SearchString,
                Type = Type
            };

            foreach (var item in ListResultadosBusqueda) {
                var busquedaItem = new PlataformaTransparencia.Modelos.ResultadoBusquedaItem() {
                    NombreProyecto = item.Principal,
                    IdSector = item.IdSector,
                    Sector = item.Descripcion,
                    Url = item.Url,
                    Type = item.Type,
                    numFound = item.numFound
                };
                busquedaViewModel.ListaResultados.Add(busquedaItem);
            }
            busquedaViewModel.TotalResultados = (ListResultadosBusqueda.Count > 0 ? ListResultadosBusqueda[0].numFound : busquedaViewModel.ListaResultados.Count);
            busquedaViewModel.Type = (Type != "" ? Type : "");
            busquedaViewModel.ListaJerarquia = consolidadosHome.GetSearchHierarchyModel();
            return View(busquedaViewModel);
        }

        [HttpGet("OnGetFilter")]
        public IActionResult OnGetFilter(string FilterBy)
        {
            return new JsonResult(new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel());
        }

        [HttpGet("BusquedaAsync")]
        public async Task<List<PlataformaTransparencia.Modelos.ResultadoBusquedaItem>> BusquedaAsync(string SearchString = "", string Type = "", string Id = "", int start = 0, int sort = 0, int rows = 10)
        {
            List<PlataformaTransparencia.Modelos.SolrResponse> ListResultadosBusqueda = (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Search(SearchString, Type, Id, start, sort, rows);
            var busquedaViewModel = new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel {
                CadenaBusqueda = SearchString,
                Type = Type
            };


            foreach (var item in ListResultadosBusqueda) {
                var busquedaItem = new PlataformaTransparencia.Modelos.ResultadoBusquedaItem() {
                    NombreProyecto = item.Principal,
                    IdSector = item.IdSector,
                    Sector = item.Descripcion,
                    Url = item.Url,
                    Type = item.Type,
                    numFound = item.numFound
                };
                busquedaViewModel.ListaResultados.Add(busquedaItem);
            }
            busquedaViewModel.TotalResultados = (ListResultadosBusqueda.Count > 0 ? ListResultadosBusqueda[0].numFound : busquedaViewModel.ListaResultados.Count);
            busquedaViewModel.ListaJerarquia = consolidadosHome.GetSearchHierarchyModel();
            return busquedaViewModel.ListaResultados;
        }

        public ActionResult perfilEntidad()
        {
            return View();
        }

        public ActionResult PerfilMenu()
        {
            return View();
        }

        public ActionResult InversionesPrioritarias()
        {
            return View();
        }

        public ActionResult ArticulacionPlan()
        {
            return View();
        }
        public ActionResult PlanificacionResultados()
        {
            return View();
        }

        public ActionResult ProcesoCiclo()
        {
            return View();
        }

        

    }
}
