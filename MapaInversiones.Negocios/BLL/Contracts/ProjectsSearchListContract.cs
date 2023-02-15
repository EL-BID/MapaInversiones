using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Negocios.Proyectos;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Comunes;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Negocios.Contracts
{
    public class ProjectsSearchListContract : RespuestaContratoBase
    {
        // Fields
        private List<decimal> bottomrigth;
        private List<string> departments;
        private string filtroNombreProyecto;
        private List<string> municipalities;
        private int page;
        private List<int> periods;
        private List<string> regions;
        private List<int> sectors;
        private List<int> status;
        private List<int> orgFinanciador;
        private List<decimal> topleft;
        private int zoom;
        private List<int> programa;
        private readonly IBusquedasProyectosBLL BusquedasProyectosBLL;
        private IConsultasComunes _consultasComunes;


        // Methods
        public ProjectsSearchListContract(Dictionary<string, string> parameters, IConsultasComunes consultasComunes, IBusquedasProyectosBLL busquedasProyectosBLL)
        {
            Inicializar();
            this.GetAtributtes(parameters);
            _consultasComunes = consultasComunes;
            BusquedasProyectosBLL = busquedasProyectosBLL;
    ***REMOVED***

        private void Inicializar()
        {
            this.regions = new List<string>();
            this.departments = new List<string>();
            this.municipalities = new List<string>();
            this.sectors = new List<int>();
            this.status = new List<int>();
            this.orgFinanciador = new List<int>();
            this.zoom = -1;
            this.topleft = new List<decimal>();
            this.bottomrigth = new List<decimal>();
            this.periods = new List<int>();
            this.page = 1;
            this.filtroNombreProyecto = string.Empty;
            this.DataProjectsSearchList = new ModelDataProjectsSearchList();
            this.programa = new List<int>();
    ***REMOVED***



        public void Fill()
        {
            this.DataProjectsSearchList.Status = true;
            try
            {
                List<objectProjectsSearchMap> source = new List<objectProjectsSearchMap>();
                FiltroBusquedaProyecto filtro = this.ObtenerFiltroPorParametros();
                decimal valorTotalTodasFuentes = 0M;
                source.AddRange(BusquedasProyectosBLL.ObtenerListadoDeProyectos(filtro, out valorTotalTodasFuentes, ref page));
                this.DataProjectsSearchList.objects = new List<objectProjectsSearchMap>();
                this.DataProjectsSearchList.pagesNumber = this.page;
                this.DataProjectsSearchList.totalNumber = this.DataProjectsSearchList.totalProjectsNumber = source.Count<objectProjectsSearchMap>();
                this.DataProjectsSearchList.totalPages = (this.DataProjectsSearchList.totalNumber > CommonLabel.MaximumResultsPerPage) ? ((this.DataProjectsSearchList.totalNumber - (this.DataProjectsSearchList.totalNumber % CommonLabel.MaximumResultsPerPage)) / CommonLabel.MaximumResultsPerPage) : 1;
                if ((this.DataProjectsSearchList.totalNumber >= CommonLabel.MaximumResultsPerPage) && ((this.DataProjectsSearchList.totalNumber % CommonLabel.MaximumResultsPerPage) > 0))
                {
                    ModelDataProjectsSearchList dataProjectsSearchList = this.DataProjectsSearchList;
                    dataProjectsSearchList.totalPages++;
            ***REMOVED***
                if (this.DataProjectsSearchList.totalNumber > CommonLabel.MaximumResultsPerPage)
                {
                    this.DataProjectsSearchList.objects.AddRange(source.Skip<objectProjectsSearchMap>(((this.page - 1) * CommonLabel.MaximumResultsPerPage)).Take<objectProjectsSearchMap>(CommonLabel.MaximumResultsPerPage));
            ***REMOVED***
                else
                {
                    this.DataProjectsSearchList.objects.AddRange(source);
            ***REMOVED***
                if (this.DataProjectsSearchList.objects.Count<objectProjectsSearchMap>() > 0)
                {
                    this.DataProjectsSearchList.Status = true;
            ***REMOVED***

                //CMC: Agregar el Ejecutor a los proyectos
                //foreach ( objectProjectsSearchMapProject proyecto in this.DataProjectsSearchList.objects)
                //{
                    
                //    proyecto.Ejecutor = string.Concat(new BllProjectProfile().NameActorByProject(CommonConstants.CodigoEjecutor, Convert.ToInt32(proyecto.location)).Select(p => p.Nombre));
                //***REMOVED***
        ***REMOVED***
            catch (Exception exception)
            {
                base.Status = this.DataProjectsSearchList.Status = false;
                LogHelper.GenerateLog(exception);
                base.Message = this.DataProjectsSearchList.Message = "Lo sentimos, ha ocurrido un error.";
        ***REMOVED***
    ***REMOVED***

        private void GetAtributtes(Dictionary<string, string> parameters)
        {
            try
            {
                if (parameters.Keys.Contains<string>("region"))
                {
                    this.regions = (from n in parameters["region"].Split(new char[] { ',' ***REMOVED***) select n).ToList<string>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("department"))
                {
                    this.departments = (from n in parameters["department"].Split(new char[] { ',' ***REMOVED***) select n).ToList<string>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("departamento"))
                {
                    this.departments = (from n in parameters["departamento"].Split(new char[] { ',' ***REMOVED***) select n).ToList<string>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("municipio"))
                {
                    this.municipalities = (from n in parameters["municipio"].Split(new char[] { ',' ***REMOVED***) select n).ToList<string>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("sector"))
                {
                    this.sectors = (from n in parameters["sector"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n)).ToList<int>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("estado"))
                {
                    this.status = (from n in parameters["estado"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n)).ToList<int>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("orgfinanciador"))
                {
                    this.orgFinanciador = (from n in parameters["orgfinanciador"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n)).ToList<int>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("query"))
                {
                    this.filtroNombreProyecto = parameters["query"];
            ***REMOVED***
                if (parameters.Keys.Contains<string>("zoom"))
                {
                    this.zoom = Convert.ToInt32(parameters["zoom"]);
            ***REMOVED***
                else
                {
                    this.zoom = 5;
            ***REMOVED***
                if (parameters.Keys.Contains<string>("topLeft"))
                {
                    this.topleft = (from n in parameters["topLeft"].Split(new char[] { ',' ***REMOVED***) select decimal.Parse(n, CultureInfo.InvariantCulture)).ToList<decimal>();
            ***REMOVED***
                else
                {
                    this.topleft.Add(4.5M);
                    this.topleft.Add(-79.5M);
            ***REMOVED***
                if (parameters.Keys.Contains<string>("bottomRight"))
                {
                    this.bottomrigth = (from n in parameters["bottomRight"].Split(new char[] { ',' ***REMOVED***) select decimal.Parse(n, CultureInfo.InvariantCulture)).ToList<decimal>();
            ***REMOVED***
                else
                {
                    this.bottomrigth.Add(decimal.Parse("12.5", CultureInfo.InvariantCulture));
                    this.bottomrigth.Add(decimal.Parse("-66.5", CultureInfo.InvariantCulture));
            ***REMOVED***
                if (parameters.Keys.Contains<string>("periods"))
                {
                    this.periods = (from n in parameters["periods"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n, CultureInfo.InvariantCulture)).ToList<int>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("page"))
                {
                    this.page = Convert.ToInt32(parameters["page"]);
            ***REMOVED***
                if (parameters.Keys.Contains<string>("programa"))
                {
                    this.programa = (from n in parameters["programa"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n)).ToList<int>();
            ***REMOVED***
        ***REMOVED***
            catch (Exception exception)
            {
                base.Status = false;
                LogHelper.GenerateLog(exception);
                base.Message = "Lo sentimos, ha ocurrido un error.";
        ***REMOVED***
    ***REMOVED***

        private FiltroBusquedaProyecto ObtenerFiltroPorParametros()
        {
            return new FiltroBusquedaProyecto(this.zoom, this.regions, this.departments, this.municipalities, this.sectors, this.status, this.orgFinanciador, this.periods, this.filtroNombreProyecto, this.topleft, this.bottomrigth, this.programa);
    ***REMOVED***

        // Properties
        public ModelDataProjectsSearchList DataProjectsSearchList { get; set; ***REMOVED***
***REMOVED***


***REMOVED***