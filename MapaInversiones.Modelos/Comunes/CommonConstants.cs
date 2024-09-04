using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Comunes
{
    public class CommonConstants
    {
        /// <summary>
        /// Constante para las etiquetas de los servicios para
        /// "region"
        /// </summary>
        public const string Region = "region";
        /// <summary>
        /// Constante para las etiquetas de los servicios para
        /// "department"
        /// </summary>
        public const string Department = "departamento";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Departamento"
        /// </summary>
        public const string DepartmentLabel = "Departamento";
        /// <summary>
        /// Constante para las etiquetas de los servicios para
        /// "municipio"
        /// </summary>
        public const string Municipality = "municipio";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Municipio"
        /// </summary>
        public const string MunicipalityLabel = "Municipio";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "estado"
        /// </summary>
        public const string State = "estado";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Estados del proyecto"
        /// </summary>
        public const string StateLabel = "Estados del proyecto";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "sector"
        /// </summary>
        public const string Sector = "sector";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Sector del proyecto"
        /// </summary>
        public const string SectorLabel = "Sector del proyecto";
        /// <summary>
        /// "tipo"
        /// </summary>
        public const string OrganismoFinanciador = "orgfinanciador";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Sector del proyecto"
        /// </summary>
        public const string OrgFinanciadorLabel = "Organismo financiador";
        /// <summary>
        /// "tipo"
        /// </summary>
        public const string EntidadEjecutora = "entidadejecutora";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Sector del proyecto"
        /// </summary>
        public const string EntidadEjecutoraLabel = "Entidad Ejecutora";
        /// <summary>
        /// "tipo"
        /// </summary>
        public const string Type = "tipo";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Tipo de proyecto"
        /// </summary>
        public const string TypeLabel = "Tipo de proyecto";
        /// <summary>
        /// Constante que indica si el actor es de 
        /// tipo ejecutor
        /// </summary>
        public const string Executor = "EJECUTOR";
        /// <summary>
        /// Constante que indica si el actor es de 
        /// tipo contratista
        /// </summary>
        public const string Contractor = "CONTRATISTA";
        /// <summary>
        /// Constante que indica si el actor es de 
        /// tipo interventor
        /// </summary>
        public const string Controller = "INTERVENTOR";

        public const int CodigoEjecutor = 1;
        /// <summary>
        /// Constante que indica si el actor es de 
        /// tipo contratista
        /// </summary>
        public const int CodigoContratista = 2;
        /// <summary>
        /// Constante que indica si el actor es de 
        /// tipo interventor
        /// </summary>
        public const int CodigoInterventor = 3;
        /// <summary>
        /// Constante utilizada para los mensajes generales
        /// </summary>
        public const string GeneralErrorMessage = "ERROR EN EL SISTEMA";
        /// <summary>
        /// Constante utilizada en el estado del mensaje.
        /// </summary>
        public const string StatusLabel = "status";
        /// <summary>
        /// Constante utilizada en el mensaje de la respuesta.
        /// </summary>
        public const string LastUpdated = "lastUpdated";
        /// <summary>
        /// Utilizado cuando se arma el mensaje de la respuesta.
        /// </summary>
        public const string TypeLabelMessage = "type";
        /// <summary>
        /// Utilizado cuando se arma el mensaje de la respuesta
        /// con json ... con formato geojson.
        /// </summary>
        public const string GeoJsonLabel = "geojson";
        /// <summary>
        /// Etiqueta del mensaje.
        /// </summary>
        public const string MessageLabel = "message";
        /// <summary>
        /// Constante para uso de Links para servicios
        /// </summary>
          public const string ServicesLink = "/projectprofile/{0}"; // "/projectprofile/{0}";
        /// <summary>
        /// Constante que se usa como identificador de
        /// imágenes pequeñas
        /// </summary>
        public const string SmallImageFormat = "sm";
        /// <summary>
        /// Constante que se usa como identificador de
        /// imágenes medianas
        /// </summary>
        public const string MediumImageFormat = "md";
        /// <summary>
        /// Constante que se usa como identificador de
        /// imágenes grandes
        /// </summary>
        public const string LargeImageFormat = "lg";
        /// <summary>
        /// Constante para uso de url's de imágenes
        /// </summary>
        public const string ImagesLink = "/Imagenes/{0}/{0}{1}.jpg";


        public const int FiftyKilometers = 50000;
        /// <summary>
        /// Constante correspondiente a 30 Kilómetros        
        /// <summary>
        /// Radio de la Tierra en metros
        /// </summary>
        public const double EarthRadius = 6378137;
        /// <summary>
        /// Utilizado en los filtros.
        /// </summary>
        public const string All = "ALL";
        /// <summary>
        /// Contrante para la generación de datos geográficos usando POINT con string.Format
        /// </summary>
        public const string PointsCoordinates = "POINT ({0} {1})";
        /// <summary>
        /// Máximo de resultados por página
        /// </summary>
        public const int MaximumResultsPerPage = 3;
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "periods" 
        /// </summary>
        public const string Periods = "periods";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "Periodos" 
        /// </summary>
        public const string PeriodsLabel = "Periodos";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "projects" 
        /// </summary>
        public const string ProjectsEnPlural = "projects";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "project" 
        /// </summary>
        public const string ProjectsEnSingular = "project";
        /// <summary>
        /// Constante para las etiquetas de los servicios para 
        /// "group"
        /// </summary>
        public const string ProjectsGroup = "group";
        /// <summary>
        /// Imágen por defecto
        /// </summary>
        public const string DefaultImagePath = "/Imagenes/DefaultPhoto/default.jpg";
        /// <summary>
        /// Constante para reemplazar en los datos del
        /// objeto Fact
        /// </summary>
        public const string ReplaceTokenFactQuery = "|queryvar|";

        /// <summary>
        /// Representa la nomenclatura de un Filtro Fuente en recursos
        /// </summary>
        public const string NombreFiltroRecursos_TipoFuentes = "fuentes";

        /// <summary>
        /// Representa la nomenclatura de un Filtro Periodos en recursos
        /// </summary>
        public const string NombreFiltroRecursos_Periodos = "periodosRecursos";

        /// <summary>
        /// Representa la nomenclatura del codigo a usar para una seleccion de filtros todos
        /// </summary>
        public const string CodigoOpcionTodos = "-1";

        public const int CodigoOpcionTodosInt = -1;

        /// <summary>
        /// Representa la nomenclatura de un Tipo de infografico General para recursos
        /// </summary>
        public const string CodigoTipoInfograficoGeneralRecursos = "G";

        /// <summary>
        /// Representa la nomenclatura de un Tipo de infografico General para recursos
        /// </summary>
        public const string CodigoTipoInfograficoTipoRecursos = "TR";

        /// <summary>
        /// Representa la nomenclatura del detalle subtipo para Infografico Recursos
        /// </summary>
        public const string CantidadProyectosAprobados = "CantidadProyectosAprobados";

        /// <summary>
        /// Representa la nomenclatura del detalle subtipo para Infografico Recursos
        /// </summary>
        public const string TotalPresupuesto = "TotalPresupuesto";

        /// <summary>
        /// Representa la nomenclatura del detalle subtipo para Infografico Recursos
        /// </summary>
        public const string TotalAprobado = "TotalAprobado";

        /// <summary>
        /// Representa la nomenclatura de un Filtro Recurso Natural en Produccion
        /// </summary>
        public const string NombreFiltroProducion_RecursoNatural = "recursoNatural";

        /// <summary>
        /// Representa la nomenclatura de un Filtro Periodos en recursos
        /// </summary>
        public const string NombreFiltroProducion_CampoMina = "campoProyecto";

        /// <summary>
        /// Representa la nomenclatura de un Filtro Periodos en recursos
        /// </summary>
        public const string NombreFiltroProduccion_Periodos = "periodosProduccion";

        /// <summary>
        /// Representa la nomenclatura de un Tipo de infografico Campo O Mina para produccion
        /// </summary>
        public const string CodigoTipoInfograficoMinaEnProduccion = "CoM";

        /// <summary>
        /// Representa la nomenclatura de un Tipo de infografico no fiscalizado
        /// </summary>
        public const string CodigoTipoInfograficoNoMinaEnProduccion = "NoCoM";


        /// <summary>
        /// Representa la nomenclatura para todos los proyectos
        /// </summary>
        public const string TodosLosProyectos = "Todos";

        /// <summary>
        /// Representa la nomenclatura para los proyectos aprobados
        /// </summary>
        public const string ProyectosAprobados = "Aprobados";

        /// <summary>
        /// Representa la nomenclatura para los proyectos ejecutados
        /// </summary>
        public const string ProyectosEjecutados = "Ejecutados";


        #region Graficas consolidadas produccion

        /// <summary>
        /// Representa los nombres de las gráficas consolidadas para Producción
        /// </summary>
        public const string GraficaConsolidadaProduccionPorRecursos = "ProduccionPorRecursos";
        public const string GraficaConsolidadaLiquidadoPorDepartamento = "LiquidadoPorDepartamento";
        public const string GraficaConsolidadaLiquidadoPorRecurso = "LiquidadoPorRecurso";
        public const string GraficaConsolidadaLiquidadoPorTipoRecurso = "LiquidadoPorTipoRecurso";


        #endregion

        public const string NombreFiltroProyectos_Estado = "estado";

        public const string NombreFiltroProyectos_Sector = "sector";

        #region FISCALIZACION

        /// <summary>
        /// Representa la nomenclatura de un Filtro Recurso Natural en Fiscalización
        /// </summary>
        public const string NombreFiltroFiscalizacion_RecursoNatural = "recursoNaturalFiscalizacion";

        /// <summary>
        /// Representa la nomenclatura de un Filtro de un Tipo de Recurso Natural en Fiscalización
        /// </summary>
        public const string NombreFiltroFiscalizacion_TipoRecursoNatural = "tipoRecursoNaturalFiscalizacion";

        /// <summary>
        /// Representa la nomenclatura de un Filtro Periodos en recursos
        /// </summary>
        public const string NombreFiltroFiscalizacion_CampoMina = "campoProyectoFiscalizacion";

        /// <summary>
        /// Representa la nomenclatura de un Filtro Periodos en recursos
        /// </summary>
        public const string NombreFiltroFiscalizacion_Periodos = "periodosFiscalizacion";

        /// <summary>
        /// Representa la nomenclatura de un Filtro tipo Fiscalizacion
        /// </summary>
        public const string NombreFiltroFiscalizacion_TipoFiscalizacion = "tipoFiscalizacion";

        /// <summary>
        /// Representa la nomenclatura de un Filtro etapa Campo o Proyecto
        /// </summary>
        public const string NombreFiltroFiscalizacion_EtapaCampoOProyecto = "etapaCampoOProyecto";

        /// <summary>
        /// Representa la nomenclatura de un Filtro estado jurídico Campo o Proyecto
        /// </summary>
        public const string NombreFiltroFiscalizacion_EstadoJuridicoCampoOProyecto = "estadoJuridicoCampoOProyecto";
        #endregion

        #region Graficas consolidadas fiscalizacion

        /// <summary>
        /// Representa los nombres de las gráficas consolidadas para Fiscalización
        /// </summary>
        public const string GraficaConsolidadaFiscalizacionPorTipoRecurso = "FiscalizacionPorTipoRecurso";
        public const string GraficaConsolidadaFiscalizacionPorTipoRecursoPorDepartamento = "FiscalizacionPorTipoRecursoPorDepartamento";
        public const string GraficaConsolidadaFiscalizacionHidrocarburosPorActividad = "FiscalizacionHidrocarburosPorActividad";
        public const string GraficaConsolidadaFiscalizacionMineralesPorActividad = "FiscalizacionMineralesPorActividad";
        public const string GraficaConsolidadaFiscalizacionPorHidrocarburo = "FiscalizacionPorHidrocarburo";
        public const string GraficaConsolidadaFiscalizacionPorMineral = "FiscalizacionPorMIieral";


        #endregion


        public const string URLServicioCamposMinasFiscalizacion = "/api/Fiscalizacion/GetCampoOMinasPorNombre/";

        public const string CodigoTipoRecursoHidrocarburo = "H";
        public const string CodigoTipoRecursoMineral = "M";

        public const string NombreFiltroFiscalizacion_EtapaCampoProyecto = "etapaCampo";
        public const string NombreFiltroFiscalizacion_EstadoJuridicoCampoProyecto = "estadoJuridicoCampo";


        public const string EstadoProyEjecucion = "2";


    }
}
