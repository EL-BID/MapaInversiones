using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngleSharp.Dom.Events;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos.Contratos;
using PlataformaTransparencia.Negocios;
using PlataformaTransparencia.Negocios.BLL.Contracts;
using PlataformaTransparencia.Negocios.Home;
using SolrNet;
using SolrNet.Commands.Parameters;

namespace Module1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly TransparenciaDB _connection;
        private ISolrOperations<PlataformaTransparencia.Modelos.SolrResponse> _solr;
        private IConsolidadosNacionalesBLL consolidadosNacionales;

        public List<ContratosConsolidado> Consolidados { get; set; ***REMOVED***


        public HomeController(ILogger<HomeController> logger, TransparenciaDB connection, ISolrOperations<PlataformaTransparencia.Modelos.SolrResponse> solr, IConsolidadosNacionalesBLL consolidadosNacionalesBLL)
        {
            _logger = logger;
            _connection = connection;
            _solr = solr;
            consolidadosNacionales = consolidadosNacionalesBLL;
    ***REMOVED***
        public ActionResult Index()
        {
            HomeContract homeContract = new HomeContract(_connection);
            homeContract.Fill();
            return View(homeContract.HomeModel);
            //return View();
    ***REMOVED***

        [HttpGet("Search/{SearchString***REMOVED***")]
        public async Task<List<PlataformaTransparencia.Modelos.SolrResponse>> SearchAsync(string SearchString = "", string Type = "", int start = 0, int sort=0, int rows = 10)
        {
            return (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Search(SearchString, Type, start, sort, rows);
    ***REMOVED***


        [HttpGet("AutocompleteSearch/{keywords***REMOVED***")]
        public async Task<List<PlataformaTransparencia.Modelos.SolrResponse>> GetSuggestionsAsync(string keywords)
        {
            return (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Autocomplete(keywords);
    ***REMOVED***

        [HttpGet]
        public ViewResult BusquedaResultados(string SearchString = "", string Type="", int start = 0, int sort=0, int rows = 10)
        {
            var ListResultadosBusqueda = SearchAsync(SearchString, Type, start, sort, rows).Result;
            var busquedaViewModel = new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel {
                CadenaBusqueda = SearchString,
                Type = Type
        ***REMOVED***;

            foreach (var item in ListResultadosBusqueda) {
                var busquedaItem = new PlataformaTransparencia.Modelos.ResultadoBusquedaItem() {
                    NombreProyecto = item.Principal,
                    //Id = item.Id,
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
            busquedaViewModel.ListaJerarquia = consolidadosNacionales.GetSearchHierarchyModel();
            return View(busquedaViewModel);
    ***REMOVED***

        [HttpGet("OnGetFilter")]
        public IActionResult OnGetFilter(string FilterBy)
        {
            return new JsonResult(new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel());
    ***REMOVED***

        [HttpGet("BusquedaAsync")]
        public async Task<List<PlataformaTransparencia.Modelos.ResultadoBusquedaItem>> BusquedaAsync(string SearchString = "", string Type = "", int start = 0, int sort = 0, int rows = 10)
        {
            List<PlataformaTransparencia.Modelos.SolrResponse> ListResultadosBusqueda = (List<PlataformaTransparencia.Modelos.SolrResponse>)await new MySolrRepository(_solr).Search(SearchString, Type, start, sort, rows);
            var busquedaViewModel = new PlataformaTransparencia.Modelos.ResultadoBusquedaViewModel {
                CadenaBusqueda = SearchString,
                Type = Type
        ***REMOVED***;


            foreach (var item in ListResultadosBusqueda) {
                var busquedaItem = new PlataformaTransparencia.Modelos.ResultadoBusquedaItem() {
                    NombreProyecto = item.Principal,
                    //Id = item.Id,
                    IdSector = item.IdSector,
                    Sector = item.Descripcion,
                    Url = item.Url,
                    Type = item.Type,
                    numFound=item.numFound
            ***REMOVED***;
                busquedaViewModel.ListaResultados.Add(busquedaItem);
        ***REMOVED***
            busquedaViewModel.TotalResultados =  (ListResultadosBusqueda.Count>0 ? ListResultadosBusqueda[0].numFound : busquedaViewModel.ListaResultados.Count);
            busquedaViewModel.ListaJerarquia = consolidadosNacionales.GetSearchHierarchyModel();
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

        public ActionResult PlanODS()
        {
            return View();
    ***REMOVED***

        public ActionResult PlanificacionParaguay()
        {
            return View();
    ***REMOVED***

        public ActionResult PresupuestoResultados()
        {
            return View();
    ***REMOVED***

        public ActionResult DesarrolloSostenible()
        {
            return View();
    ***REMOVED***

        public ActionResult POI()
        {
            return View();
    ***REMOVED***

        public ActionResult PND() {
            return View();
    ***REMOVED***

        public ActionResult Plansectorial()
        {
            return View();
    ***REMOVED***
        public ActionResult PEI()
        {
            return View();
    ***REMOVED***

        public ActionResult PDT()
        {
            return View();
    ***REMOVED***

        public ActionResult ProcesoCiclo()
        {
            return View();
    ***REMOVED***

        public ActionResult ProcesoGastos()
        {
            return View();
    ***REMOVED***

        public ActionResult ProcesoIngresos()
        {
            return View();
    ***REMOVED***
***REMOVED***
***REMOVED***
