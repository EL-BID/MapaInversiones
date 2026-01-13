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
        private List<int> entidadEjecutora = new List<int>();
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
        }

        public void Fill()
        {
            this.DataProjectSearchMap.Status = true;
            List<objectProjectsSearchMap> list = new List<objectProjectsSearchMap>();
            FiltroBusquedaProyecto filtro = this.ObtenerFiltroPorParametros();
            int cantidadProyectos = 0;
            decimal valorRegalias = 0M;
            decimal valorTotalRegalias = 0M;
            ModelDataProjectsSearchMap objReturn = null;

            try
            {
                string key = "BusquedaTabProyectos" + _consultasComunes.ObtenerKeyPorEstadoFiltro(filtro, true);

                if (filtro.Zoom < 6)
                {
                    filtro.Zoom = 6;
                }

                if (!ShortCacheHelper.Get(key, out objReturn))
                {
                    list = BusquedasProyectosBLL.ObtenerInfograficos(filtro, out cantidadProyectos, out valorRegalias, out valorTotalRegalias);
                    this.DataProjectSearchMap.objects = list;
                    this.DataProjectSearchMap.approvedMoney = Math.Round(valorRegalias);
                    this.DataProjectSearchMap.approvedMoneyTotal = Math.Round(valorTotalRegalias);
                    this.DataProjectSearchMap.approvedProjects = cantidadProyectos;
                    this.DataProjectSearchMap.totalProjectsNumber = cantidadProyectos;

                    ShortCacheHelper.Add(this.DataProjectSearchMap, key);
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("Obtenidos los pines de proyectos e infoboxes del cache corto");
                    this.DataProjectSearchMap = objReturn;
                }
                System.Diagnostics.Trace.WriteLine("Terminada consulta de proyectos (Pines e Infoboxes).");
                this.DataProjectSearchMap.Status = true;
            }
            catch (Exception exception)
            {
                base.Status = this.DataProjectSearchMap.Status = false;
                LogHelper.GenerateLog(exception);
                base.Message = "Lo sentimos, ha ocurrido un error.";
            }
        }

        public void FillTerritorio()
        {
        }

        private void GetAtributtes(Dictionary<string, string> parameters)
        {
            try
            {
                if (parameters.Keys.Contains<string>("region"))
                {
                    this.regions = (from n in parameters["region"].Split(new char[] { ',' }) select n).ToList<string>();
                }
                if (parameters.Keys.Contains<string>("department"))
                {
                    this.departments = (from n in parameters["department"].Split(new char[] { ',' }) select n).ToList<string>();
                }
                if (parameters.Keys.Contains<string>("departamento"))
                {
                    this.departments = (from n in parameters["departamento"].Split(new char[] { ',' }) select n).ToList<string>();
                }
                if (parameters.Keys.Contains<string>("municipio"))
                {
                    this.municipalities = (from n in parameters["municipio"].Split(new char[] { ',' }) select n).ToList<string>();
                }
                if (parameters.Keys.Contains<string>("sector"))
                {
                    this.sectors = (from n in parameters["sector"].Split(new char[] { ',' }) select int.Parse(n)).ToList<int>();
                }
                if (parameters.Keys.Contains<string>("estado"))
                {
                    this.status = (from n in parameters["estado"].Split(new char[] { ',' }) select int.Parse(n)).ToList<int>();
                }
                if (parameters.Keys.Contains<string>("orgfinanciador"))
                {
                    this.orgFinanciador = (from n in parameters["orgfinanciador"].Split(new char[] { ',' }) select int.Parse(n)).ToList<int>();
                }
                if (parameters.Keys.Contains<string>("entidadejecutora"))
                {
                    this.orgFinanciador = (from n in parameters["entidadejecutora"].Split(new char[] { ',' }) select int.Parse(n)).ToList<int>();
                }
                if (parameters.Keys.Contains<string>("query"))
                {
                    this.filtroNombreProyecto = parameters["query"];
                }
                if (parameters.Keys.Contains<string>("zoom"))
                {
                    this.zoom = Convert.ToInt32(parameters["zoom"]);
                }
                if (parameters.Keys.Contains<string>("topLeft"))
                {
                    this.topleft = (from n in parameters["topLeft"].Split(new char[] { ',' }) select decimal.Parse(n, CultureInfo.InvariantCulture)).ToList<decimal>();
                }
                if (parameters.Keys.Contains<string>("bottomRight"))
                {
                    this.bottomrigth = (from n in parameters["bottomRight"].Split(new char[] { ',' }) select decimal.Parse(n, CultureInfo.InvariantCulture)).ToList<decimal>();
                }
                if (parameters.Keys.Contains<string>("periodo"))
                {
                    this.periods = (from n in parameters["periodo"].Split(new char[] { ',' }) select int.Parse(n, CultureInfo.InvariantCulture)).ToList<int>();
                }
                if (parameters.Keys.Contains<string>("programa"))
                {
                    this.programa = (from n in parameters["programa"].Split(new char[] { ',' }) select int.Parse(n)).ToList<int>();
                }
                else if (parameters.Keys.Contains<string>("periods"))
                {
                    this.periods = (from n in parameters["periods"].Split(new char[] { ',' }) select int.Parse(n, CultureInfo.InvariantCulture)).ToList<int>();
                }
            }
            catch (Exception exception)
            {
                base.Status = false;
                LogHelper.GenerateLog(exception);
                base.Message = "Lo sentimos, ha ocurrido un error.";
            }
        }

        private FiltroBusquedaProyecto ObtenerFiltroPorParametros()
        {
            return new FiltroBusquedaProyecto(this.zoom, this.regions, this.departments, this.municipalities, this.sectors, this.status, this.orgFinanciador, this.entidadEjecutora, this.periods, this.filtroNombreProyecto, this.topleft, this.bottomrigth, this.programa);
        }

        // Properties
        public ModelDataProjectsSearchMap DataProjectSearchMap { get; set; }

        //public BusquedasProyectosBLL objBussinesRf { get; set; }
    }


}