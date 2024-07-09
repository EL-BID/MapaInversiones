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

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly TransparenciaDB _connection;
        private ISolrOperations<PlataformaTransparencia.Modelos.SolrResponse> _solr;
        private IHomeBLL consolidadosHome;

        public List<ContratosConsolidado> Consolidados { get; set; ***REMOVED***


        public HomeController(ILogger<HomeController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.SolrResponse> solr, IHomeBLL consolidadosHomeBLL)
        {
            _logger = logger;
            _connection = connection;
            _solr = solr;
            consolidadosHome = consolidadosHomeBLL;
    ***REMOVED***
        public ActionResult Index()
        {
            HomeContract homeContract = new HomeContract(_connection);
            homeContract.Fill();
            return View(homeContract.HomeModel);
  
    ***REMOVED***

        [HttpGet("Search/{SearchString***REMOVED***")]
        public async Task<List<PlataformaTransparencia.Modelos.SolrResponse>> SearchAsync(string SearchString = "", string Type = "", string Id = "", int start = 0, int sort=0, int rows = 10)
        {
            return (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Search(SearchString, Type, Id, start, sort, rows);
    ***REMOVED***


        [HttpGet("AutocompleteSearch/{keywords***REMOVED***")]
        public async Task<List<PlataformaTransparencia.Modelos.SolrResponse>> GetSuggestionsAsync(string keywords)
        {
            return (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Autocomplete(keywords);
    ***REMOVED***

        [HttpGet]
        public ViewResult BusquedaResultados(string SearchString = "", string Type="", string Id = "", int start = 0, int sort=0, int rows = 10)
        {
            var ListResultadosBusqueda = SearchAsync(SearchString, Type, Id, start, sort, rows).Result;
            var busquedaViewModel = new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel {
                CadenaBusqueda = SearchString,
                Type = Type
        ***REMOVED***;

            foreach (var item in ListResultadosBusqueda) {
                var busquedaItem = new PlataformaTransparencia.Modelos.ResultadoBusquedaItem() {
                    NombreProyecto = item.Principal,
                    IdSector = item.IdSector,
                    Sector = item.Descripcion,
                    Url = item.Url,
                    Type = item.Type,
                    numFound = item.numFound
            ***REMOVED***;
                busquedaViewModel.ListaResultados.Add(busquedaItem);
        ***REMOVED***
            busquedaViewModel.TotalResultados = (ListResultadosBusqueda.Count>0 ? ListResultadosBusqueda[0].numFound : busquedaViewModel.ListaResultados.Count);
            busquedaViewModel.Type= (Type!="" ? Type : "");
            busquedaViewModel.ListaJerarquia = consolidadosHome.GetSearchHierarchyModel();
            return View(busquedaViewModel);
    ***REMOVED***

        [HttpGet("OnGetFilter")]
        public IActionResult OnGetFilter(string FilterBy)
        {
            return new JsonResult(new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel());
    ***REMOVED***

        [HttpGet("BusquedaAsync")]
        public async Task<List<PlataformaTransparencia.Modelos.ResultadoBusquedaItem>> BusquedaAsync(string SearchString = "", string Type = "", string Id = "", int start = 0, int sort = 0, int rows = 10)
        {
            List<PlataformaTransparencia.Modelos.SolrResponse> ListResultadosBusqueda = (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Search(SearchString, Type, Id, start, sort, rows);
            var busquedaViewModel = new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel {
                CadenaBusqueda = SearchString,
                Type = Type
        ***REMOVED***;


            foreach (var item in ListResultadosBusqueda) {
                var busquedaItem = new PlataformaTransparencia.Modelos.ResultadoBusquedaItem() {
                    NombreProyecto = item.Principal,
                    IdSector = item.IdSector,
                    Sector = item.Descripcion,
                    Url = item.Url,
                    Type = item.Type,
                    numFound=item.numFound
            ***REMOVED***;
                busquedaViewModel.ListaResultados.Add(busquedaItem);
        ***REMOVED***
            busquedaViewModel.TotalResultados =  (ListResultadosBusqueda.Count>0 ? ListResultadosBusqueda[0].numFound : busquedaViewModel.ListaResultados.Count);
            busquedaViewModel.ListaJerarquia = consolidadosHome.GetSearchHierarchyModel();
            return busquedaViewModel.ListaResultados;
    ***REMOVED***

        public ActionResult perfilEntidad()
        {
            return View();
    ***REMOVED***

        public ActionResult PerfilMenu()
        {
            return View();
    ***REMOVED***

        public ActionResult InversionesPrioritarias()
        {
            return View();
    ***REMOVED***

        public ActionResult ArticulacionPlan()
        {
            return View();
    ***REMOVED***
        public ActionResult PlanificacionResultados()
        {
            return View();
    ***REMOVED***

        public ActionResult ProcesoCiclo()
        {
            return View();
    ***REMOVED***

***REMOVED***
***REMOVED***
