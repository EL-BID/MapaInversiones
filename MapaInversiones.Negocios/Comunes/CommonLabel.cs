
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
            get { return CommonLabel.regionLabel; }
            set { CommonLabel.regionLabel = value; }
        }


        /// </summary>
        private  static string departmentLabel;

        public static string DepartmentLabel
        {
            get { return departmentLabel; }
            set { departmentLabel = value; }
        }
       

        public static string MunicipalityLabel {get; set;}     
       
        /// </summary>
        private static string stateLabel ;

        public static string StateLabel
        {
            get { return stateLabel; }
            set { stateLabel = value; }
        }
        /// </summary>
        private static string sectorLabel;

        public static string SectorLabel
        {
            get { return sectorLabel; }
            set { sectorLabel = value; }
        }

        private static string orgFinanciadorLabel;

        public static string OrgFinanciadorLabel
        {
            get { return orgFinanciadorLabel; }
            set { orgFinanciadorLabel = value; }
        }

        private static string entidadEjecutoraLabel;
        public static string EntidadEjecutoraLabel { get => entidadEjecutoraLabel; set => entidadEjecutoraLabel = value; }


        public static string TypeLabel {get; set;}     
               
        public static string StatusLabel {get; set;}     
        
        
        public static string TypeLabelMessage {get; set;}     
       

        public static string GeoJsonLabel {get; set;}       
        

        public static string MessageLabel  {get; set;}     
        
        /// </summary>
        private static string periodsLabel;

        public static string PeriodsLabel
        {
            get { return periodsLabel; }
            set { periodsLabel = value; }
        }

       
        public static int MaximumResultsPerPage {get; set; }

        public static int MaximumResultsFotos { get; set; }

        public static int MaximumResultPerFicha { get; set; }

        public static int MaximumResultsPerDonaciones { get; set; }

        public static int MaximumResultsPerSalarios { get; set; }

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
                                            }).ToList();


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
                      
                            }                    
                   
                }

        }

    }
}
