using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Contracts;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Modulo.Principal.Controllers
{
    [Route("api/serviciosproyectos")]
    public class ServiciosProyectosController : Controller
    {
        /// <summary>
        /// Servicio para la busqueda en el mapa. 
        /// </summary>
        /// <returns>Retorna el modelo de busqueda</returns>
        /// 
        private IConsultasComunes ConsultasComunes;
        private readonly IBusquedasProyectosBLL BusquedasProyectosBLL;


        // Methods
        public ServiciosProyectosController(IConsultasComunes consultasComunes, IBusquedasProyectosBLL busquedasProyectosBLL)
        {
            ConsultasComunes = consultasComunes;
            BusquedasProyectosBLL = busquedasProyectosBLL;
    ***REMOVED***


        [HttpGet("busqueda")]
        public ModelDataProjectsSearchMap busquedaGet()
        {
            //leemos el querystring. lo convertimos a un diccionario.   
            Dictionary<string, string> parameters = Request.Query.ToDictionary(q => q.Key, q => (string)q.Value);
            ProjectsSearchMapContract projectsSearchMapContract = new ProjectsSearchMapContract(parameters, ConsultasComunes, BusquedasProyectosBLL);
            projectsSearchMapContract.Fill();
            return projectsSearchMapContract.DataProjectSearchMap;

    ***REMOVED***


        [HttpGet("listado")]
        public ModelDataProjectsSearchList listadoGet()
        {
            //leemos el querystring. lo convertimos a un diccionario.
            Dictionary<string, string> parameters = Request.Query.ToDictionary(q => q.Key, q => (string)q.Value);
            ProjectsSearchListContract projectsSearchListContract = new ProjectsSearchListContract(parameters, ConsultasComunes, BusquedasProyectosBLL);
            projectsSearchListContract.Fill();
            return projectsSearchListContract.DataProjectsSearchList;

    ***REMOVED***


        [HttpGet("GetFotosAprobar")]
        public async Task<object> GetFotosAprobar(int page)
        {
            ModelDataProyecto objReturn = new ModelDataProyecto();
            List<ImagesUsuario> source = new List<ImagesUsuario>();
            source.AddRange(await BusquedasProyectosBLL.ObtenerFotosUsuariosParaAprobarAsync());
            objReturn.totalNumber = source.Count<ImagesUsuario>();
            objReturn.pagesNumber = page;
            objReturn.totalPages = (objReturn.totalNumber > CommonLabel.MaximumResultsFotos) ? ((objReturn.totalNumber - (objReturn.totalNumber % CommonLabel.MaximumResultsFotos)) / CommonLabel.MaximumResultsFotos) : 1;
            if ((objReturn.totalNumber >= CommonLabel.MaximumResultsFotos) && ((objReturn.totalNumber % CommonLabel.MaximumResultsFotos) > 0))
            {
                objReturn.totalPages++;
        ***REMOVED***
            if (objReturn.totalNumber > CommonLabel.MaximumResultsFotos)
            {
                objReturn.FotosU.AddRange(source.Skip<ImagesUsuario>(((page - 1) * CommonLabel.MaximumResultsFotos)).Take<ImagesUsuario>(CommonLabel.MaximumResultsFotos));
        ***REMOVED***
            else
            {
                objReturn.FotosU.AddRange(source);
        ***REMOVED***
            objReturn.Status = true;
            return objReturn;
    ***REMOVED***

        [HttpGet("GetFotosEstados")]
        public object GetFotosEstados(int page, int estado)
        {
            ModelDataProyecto objReturn = new ModelDataProyecto();
            objReturn = BusquedasProyectosBLL.ObtenerFotosUsuariosPerEstados(estado, page);
            objReturn.Status = true;
            return objReturn;
    ***REMOVED***

        [HttpGet("GetFotosAprobarCant")]
        public object GetFotosAprobarCant()
        {
            ModelDataProyecto objReturn = new ModelDataProyecto();
            var cantImages = BusquedasProyectosBLL.ObtenerFotosUsuariosParaAprobarCant();
            objReturn.totalNumber = cantImages;
            objReturn.FotosU = null;
            objReturn.Status = true;
            return objReturn;
    ***REMOVED***


        [HttpGet("GetProyNacionales")]
        public async Task<object> GetProyNacionales(int page, int sector)
        {
            ModelDataProyecto objReturn = new ModelDataProyecto();
            List<InfoProyectos> source = new List<InfoProyectos>();
            source.AddRange(await ConsultasComunes.ObtenerProyectosNacionales(sector));
            objReturn.totalNumber = source.Count<InfoProyectos>();
            objReturn.pagesNumber = page;
            objReturn.totalPages = (objReturn.totalNumber > CommonLabel.MaximumResultsPerPage) ? ((objReturn.totalNumber - (objReturn.totalNumber % CommonLabel.MaximumResultsPerPage)) / CommonLabel.MaximumResultsPerPage) : 1;
            if ((objReturn.totalNumber >= CommonLabel.MaximumResultsPerPage) && ((objReturn.totalNumber % CommonLabel.MaximumResultsPerPage) > 0))
            {
                objReturn.totalPages++;
        ***REMOVED***
            if (objReturn.totalNumber > CommonLabel.MaximumResultsPerPage)
            {
                objReturn.proyNacionales.AddRange(source.Skip<InfoProyectos>(((page - 1) * CommonLabel.MaximumResultsPerPage)).Take<InfoProyectos>(CommonLabel.MaximumResultsPerPage));
        ***REMOVED***
            else
            {
                objReturn.proyNacionales.AddRange(source);
        ***REMOVED***

            objReturn.Status = true;
            return objReturn;
    ***REMOVED***


        [HttpGet("GetActividadesComponentes")]
        public object GetActividadesComponentes()
        {
            ModelDataProyecto objReturn = new ModelDataProyecto();
            Dictionary<string, string> parameters = Request.Query.ToDictionary(q => q.Key, q => (string)q.Value);
            if (parameters.Keys.Contains<string>("IdProyecto"))
            {
                string id_proyecto = parameters["IdProyecto"].ToString();
                if (!string.IsNullOrEmpty(id_proyecto))
                {
                    if (parameters.Keys.Contains<string>("codComponente"))
                    {
                        string cod_componente = parameters["codComponente"].ToString();
                        if (!string.IsNullOrEmpty(cod_componente))
                        {
                           
                            var valores_actividad = BusquedasProyectosBLL.GetActividadesByComponente(Convert.ToInt16(id_proyecto), cod_componente);
                            objReturn.componentes = valores_actividad;
                            objReturn.Status = true;
                    ***REMOVED***

                ***REMOVED***
                    else
                    {
                        objReturn.Status = false;
                        objReturn.Message = "Error: Componente de proyecto nulo";
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            else
            {
                objReturn.Status = false;
                objReturn.Message = "Error: Identificación de proyecto nula";
        ***REMOVED***

            return objReturn;
    ***REMOVED***

        [HttpGet("GetFuentesPeriodo")]
        public ModelDataProyecto GetFuentesPeriodo()
        {
            ModelDataProyecto objReturn = new ModelDataProyecto();
            Dictionary<string, string> parameters = Request.Query.ToDictionary(q => q.Key, q => (string)q.Value);
            if (parameters.Keys.Contains<string>("IdProyecto"))
            {
                string id_proyecto = parameters["IdProyecto"].ToString();
                if (!string.IsNullOrEmpty(id_proyecto))
                {
                    if (parameters.Keys.Contains<string>("IdPeriodo"))
                    {
                        string id_periodo = parameters["IdPeriodo"].ToString();
                        if (!string.IsNullOrEmpty(id_periodo))
                        {
                            var valores_actividad = BusquedasProyectosBLL.GetFuentesByPeriodo(Convert.ToInt16(id_proyecto), Convert.ToInt16(id_periodo));
                            objReturn.fuentesFinanciacion = valores_actividad;
                            objReturn.Status = true;

                            objReturn.Status = true;
                    ***REMOVED***
                ***REMOVED***
                    else
                    {
                        objReturn.Status = false;
                        objReturn.Message = "Error: Periodo nulo";
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***
            else
            {
                objReturn.Status = false;
                objReturn.Message = "Error: Identificación de proyecto nula";
        ***REMOVED***


            return objReturn;
    ***REMOVED***


        [HttpGet("GetAnniosProcesoContratacion")]
        public ModelProcesoContratacionAnios GetAnniosContratos(int? IdProyecto)
        {
            ModelProcesoContratacionAnios objReturn = new ModelProcesoContratacionAnios();
            try
            {
                var valores = BusquedasProyectosBLL.ObtenerAnniosProcesoContratacion(IdProyecto);
                objReturn = valores;
                objReturn.Status = true;
                return objReturn;
        ***REMOVED***
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.Message;
                return objReturn;
        ***REMOVED***
    ***REMOVED***

        [HttpGet("ProcesosContratacion")]
        public ModelProcesosContratacionData ProcesosContratacion(int Annio, int Semestre, int IdProyecto, int NumeroPagina, int RegistrosPorPagina)
        {

            ModelProcesosContratacionData objReturn = new ModelProcesosContratacionData();
            ProcesosContratacionFiltros filtros = new ProcesosContratacionFiltros();
            filtros.Annio = Annio;
            filtros.Semestre = Semestre;
            filtros.IdProyecto = IdProyecto;
            filtros.NumeroPagina = NumeroPagina;
            filtros.RegistrosPorPagina = RegistrosPorPagina;

            try
            {
                var valores = BusquedasProyectosBLL.ObtenerInformacionProcesosContratacionPorFiltros(filtros);
                objReturn = valores;
                objReturn.Status = true;
                return objReturn;
        ***REMOVED***
            catch (Exception exception)
            {
                objReturn.Status = false;
                objReturn.Message = "Error: " + exception.InnerException;
                return objReturn;
        ***REMOVED***
    ***REMOVED***



***REMOVED***

***REMOVED***
