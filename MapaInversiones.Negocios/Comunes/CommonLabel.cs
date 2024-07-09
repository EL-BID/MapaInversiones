
using Microsoft.Extensions.Configuration;
using PlataformaTransparencia.Infrastructura.DataModels;
using System;
using System.Linq;

namespace PlataformaTransparencia.Negocios.Comunes
{
    public static class CommonLabel
    {
        private static TransparenciaDB _connection;
        private static IConfiguration Configuration;

        /// </summary>
        private static string regionLabel;

        public static string RegionLabel
        {
            get { return CommonLabel.regionLabel; ***REMOVED***
            set { CommonLabel.regionLabel = value; ***REMOVED***
    ***REMOVED***


        /// </summary>
        private  static string departmentLabel;

        public static string DepartmentLabel
        {
            get { return departmentLabel; ***REMOVED***
            set { departmentLabel = value; ***REMOVED***
    ***REMOVED***
       

        public static string MunicipalityLabel {get; set;***REMOVED***     
       
        /// </summary>
        private static string stateLabel ;

        public static string StateLabel
        {
            get { return stateLabel; ***REMOVED***
            set { stateLabel = value; ***REMOVED***
    ***REMOVED***
        /// </summary>
        private static string sectorLabel;

        public static string SectorLabel
        {
            get { return sectorLabel; ***REMOVED***
            set { sectorLabel = value; ***REMOVED***
    ***REMOVED***

        private static string orgFinanciadorLabel;

        public static string OrgFinanciadorLabel
        {
            get { return orgFinanciadorLabel; ***REMOVED***
            set { orgFinanciadorLabel = value; ***REMOVED***
    ***REMOVED***

        private static string entidadEjecutoraLabel;
        public static string EntidadEjecutoraLabel { get => entidadEjecutoraLabel; set => entidadEjecutoraLabel = value; ***REMOVED***


        public static string TypeLabel {get; set;***REMOVED***     
               
        public static string StatusLabel {get; set;***REMOVED***     
        
        
        public static string TypeLabelMessage {get; set;***REMOVED***     
       

        public static string GeoJsonLabel {get; set;***REMOVED***       
        

        public static string MessageLabel  {get; set;***REMOVED***     
        
        /// </summary>
        private static string periodsLabel;

        public static string PeriodsLabel
        {
            get { return periodsLabel; ***REMOVED***
            set { periodsLabel = value; ***REMOVED***
    ***REMOVED***

       
        public static int MaximumResultsPerPage {get; set; ***REMOVED***

        public static int MaximumResultsFotos { get; set; ***REMOVED***

        public static int MaximumResultPerFicha { get; set; ***REMOVED***

        public static int MaximumResultsPerDonaciones { get; set; ***REMOVED***

        public static int MaximumResultsPerSalarios { get; set; ***REMOVED***

        public static void Init(TransparenciaDB connection, IConfiguration configuration)
        {
            _connection = connection;
            Configuration = configuration;

            MaximumResultsPerPage =Convert.ToInt32(Configuration["MaximumResultsPerPage"]);
            MaximumResultsFotos = Convert.ToInt32(Configuration["MaximumResultsFotos"]);
            MaximumResultPerFicha = Convert.ToInt32(Configuration["MaximumResultsPerFicha"]);
            MaximumResultsPerDonaciones = Convert.ToInt32(Configuration["MaximumResultsPerDonaciones"]);
            MaximumResultsPerSalarios = Convert.ToInt32(Configuration["MaximumResultsPerSalarios"]);


            var listTitulos = (from paraTitulos in _connection.ParametrizacionTitulos
                               where paraTitulos.Llave.Contains("Label")
                                            select new  {
                                            Texto=paraTitulos.Texto,
                                            Label=paraTitulos.Label,
                                            Llave=paraTitulos.Llave,
                                        ***REMOVED***).ToList();


                foreach (var item in listTitulos)
                {
                    switch (item.Label)
                    {                            
                                case "RegionLabel":
                                RegionLabel = item.Texto;
                                    break;

                                case "DepartmentLabel":
                                    DepartmentLabel = item.Texto;
                                    break;
                                case "MunicipalityLabel":
                                    MunicipalityLabel = item.Texto;
                                    break;
                                case "StateLabel":
                                    StateLabel = item.Texto;
                                    break;
                                case "SectorLabel":
                                    SectorLabel = item.Texto;
                                    break;
                                case "OrgFinanciadorLabel":
                                    OrgFinanciadorLabel = item.Texto;
                                    break;
                                case "EntidadEjecutoraLabel":
                                    EntidadEjecutoraLabel = item.Texto;
                                    break;
                                case "TypeLabel":
                                    TypeLabel = item.Texto;
                                    break;
                                case "StatusLabel":
                                    StatusLabel = item.Texto;
                                    break;
                                case "TypeLabelMessage":
                                    TypeLabelMessage = item.Texto;
                                    break;
                                case "GeoJsonLabel":
                                    GeoJsonLabel = item.Texto;
                                    break;
                                case "MessageLabel":
                                    MessageLabel = item.Texto;
                                    break;
                                case "PeriodsLabel":
                                    PeriodsLabel = item.Texto;
                                    break;
                      
                        ***REMOVED***                    
                   
            ***REMOVED***

    ***REMOVED***

***REMOVED***
***REMOVED***
