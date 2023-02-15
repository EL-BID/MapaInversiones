using PlataformaTransparencia.Negocios.BLL.Comunes;
using PlataformaTransparencia.Negocios.Proyectos;
using PlataformaTransparencia.Negocios.RepositorioConsultas;
using PlataformaTransparencia.Modelos.Comunes;
using PlataformaTransparencia.Modelos.Proyectos;
using PlataformaTransparencia.Utilitarios;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Negocios.Interfaces;

namespace PlataformaTransparencia.Negocios.Contracts
{
    public class ProjectsSearchMapContract : RespuestaContratoBase
    {
        // Fields
        private List<decimal> bottomrigth = new List<decimal>();
        private List<string> departments = new List<string>();
        private string filtroNombreProyecto = string.Empty;
        private List<string> municipalities = new List<string>();
        private List<int> periods = new List<int>();
        private List<string> regions = new List<string>();
        private List<int> sectors = new List<int>();
        private List<int> status = new List<int>();
        private List<int> orgFinanciador = new List<int>();
        private List<decimal> topleft = new List<decimal>();
        private int zoom = -1;
        private List<int> programa = new List<int>();
        private IConsultasComunes _consultasComunes;
        private readonly IBusquedasProyectosBLL BusquedasProyectosBLL;


        // Methods
        public ProjectsSearchMapContract(Dictionary<string, string> parameters, IConsultasComunes consultasComunes, IBusquedasProyectosBLL busquedasProyectosBLL)
        {
            this.DataProjectSearchMap = new ModelDataProjectsSearchMap();
            this.GetAtributtes(parameters);
            _consultasComunes = consultasComunes;
            BusquedasProyectosBLL = busquedasProyectosBLL;
    ***REMOVED***

        public void Fill()
        {
            this.DataProjectSearchMap.Status = true;
            List<objectProjectsSearchMap> list = new List<objectProjectsSearchMap>();
            FiltroBusquedaProyecto filtro = this.ObtenerFiltroPorParametros();
            int cantidadProyectos = 0;
            decimal valorRegalias = 0M;
            decimal valorTotalRegalias = 0M;
            ModelDataProjectsSearchMap objReturn = null;


            //this.DataProjectSearchMap = new ModelDataProjectsSearchMap();
            //this.DataProjectSearchMap.objects.Add(new ObjectProjectsSearchMapGeography() { id = "50", type = "departamento", total = 5, approvedTotalMoney = 155555, value = 34455555656 ***REMOVED***);
            //this.DataProjectSearchMap.objects.Add(new ObjectProjectsSearchMapGeography() { id = "01", type = "region", total = 24, approvedTotalMoney = 67654443223, value = 9747325235532 ***REMOVED***);
            //this.DataProjectSearchMap.approvedMoney = 383323232323 * Convert.ToDecimal((new Random().Next(4)));
            //this.DataProjectSearchMap.approvedMoneyTotal = Convert.ToDecimal(383323232323 * 1.2);
            //this.DataProjectSearchMap.approvedProjects = 523 + Convert.ToDecimal((new Random().Next(80)));
            //this.DataProjectSearchMap.collectedMoney = Convert.ToDecimal(383323232323 * 1.4);
            //this.DataProjectSearchMap.Status = true;
            //return;

            try
            {
                string key = "BusquedaTabProyectos" + _consultasComunes.ObtenerKeyPorEstadoFiltro(filtro, true);

                if (filtro.Zoom < 6)
                {
                    filtro.Zoom = 6;
            ***REMOVED***

                if (!ShortCacheHelper.Get(key, out objReturn))
                {
                    list = BusquedasProyectosBLL.ObtenerInfograficos(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias);
                    this.DataProjectSearchMap.objects = list;
                    this.DataProjectSearchMap.approvedMoney = Math.Round(valorRegalias);
                    this.DataProjectSearchMap.approvedMoneyTotal = Math.Round(valorTotalRegalias);
                    this.DataProjectSearchMap.approvedProjects = cantidadProyectos;
                    //this.DataProjectSearchMap.collectedMoney = new ConsolidadosNacionalesBLL().ObtenerPresupuestoTotalSegunFiltroProyectos(filtro);
                    this.DataProjectSearchMap.totalProjectsNumber = cantidadProyectos;
                    //if (this.DataProjectSearchMap.objects.Count<objectProjectsSearchMap>() == 0)
                    //{
                    //    this.DataProjectSearchMap.objects = new List<objectProjectsSearchMap>();
                    //    this.DataProjectSearchMap.Message = "La Consulta de proyectos  retorna datos  en ceros";
                    //    this.DataProjectSearchMap.objects = list;
                    //    this.DataProjectSearchMap.approvedMoney = Math.Round(valorRegalias);
                    //    this.DataProjectSearchMap.approvedMoneyTotal = Math.Round(valorTotalRegalias);
                    //    this.DataProjectSearchMap.approvedProjects = Math.Round(valorTotalRegalias);
                    //    this.DataProjectSearchMap.totalProjectsNumber = cantidadProyectos;
                    //***REMOVED***
                    ShortCacheHelper.Add(this.DataProjectSearchMap, key);
            ***REMOVED***
                else
                {
                    System.Diagnostics.Debug.WriteLine("Obtenidos los pines de proyectos e infoboxes del cache corto");
                    this.DataProjectSearchMap = objReturn;
            ***REMOVED***
                System.Diagnostics.Trace.WriteLine("Terminada consulta de proyectos (Pines e Infoboxes).");
                this.DataProjectSearchMap.Status = true;
        ***REMOVED***
            catch (Exception exception)
            {
                base.Status = this.DataProjectSearchMap.Status = false;
                LogHelper.GenerateLog(exception);
                base.Message = "Lo sentimos, ha ocurrido un error.";
        ***REMOVED***
    ***REMOVED***

        public void FillTerritorio()
        {
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
                if (parameters.Keys.Contains<string>("orgFinanciador"))
                {
                    this.orgFinanciador = (from n in parameters["orgFinanciador"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n)).ToList<int>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("query"))
                {
                    this.filtroNombreProyecto = parameters["query"];
            ***REMOVED***
                if (parameters.Keys.Contains<string>("zoom"))
                {
                    this.zoom = Convert.ToInt32(parameters["zoom"]);
            ***REMOVED***
                if (parameters.Keys.Contains<string>("topLeft"))
                {
                    this.topleft = (from n in parameters["topLeft"].Split(new char[] { ',' ***REMOVED***) select decimal.Parse(n, CultureInfo.InvariantCulture)).ToList<decimal>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("bottomRight"))
                {
                    this.bottomrigth = (from n in parameters["bottomRight"].Split(new char[] { ',' ***REMOVED***) select decimal.Parse(n, CultureInfo.InvariantCulture)).ToList<decimal>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("periodo"))
                {
                    this.periods = (from n in parameters["periodo"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n, CultureInfo.InvariantCulture)).ToList<int>();
            ***REMOVED***
                if (parameters.Keys.Contains<string>("programa"))
                {
                    this.programa = (from n in parameters["programa"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n)).ToList<int>();
            ***REMOVED***
                else if (parameters.Keys.Contains<string>("periods"))
                {
                    this.periods = (from n in parameters["periods"].Split(new char[] { ',' ***REMOVED***) select int.Parse(n, CultureInfo.InvariantCulture)).ToList<int>();
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
        public ModelDataProjectsSearchMap DataProjectSearchMap { get; set; ***REMOVED***

        //public BusquedasProyectosBLL objBussinesRf { get; set; ***REMOVED***
***REMOVED***


***REMOVED***