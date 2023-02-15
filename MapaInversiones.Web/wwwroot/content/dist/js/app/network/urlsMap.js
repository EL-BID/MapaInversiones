/*global define*/
define({
	//-----------------------
	// PROJECTS
	//-----------------------
	// FILTERS ALL
	// filtersProjects: '/api/filtros',

	root: window.location.protocol+'//'+window.location.host,

	filtersProjects: '/api/FiltrosTotales/GetFiltros',
	// POLYGONS
	departments: '/api/poligonos/departamento/',
	regions: '/api/poligonos/region/',
	municipalities: '/api/poligonos/municipio/',
	// SEARCH PROYECTS
	searchProjects: '/api/serviciosproyectos/busqueda',
	searchProjectsList: '/api/serviciosproyectos/listado',
	// CONSOLIDATED
	consolidated: '/api/datosconsolidados/',
    //PARTICIPACION
	searchComments: '/api/Participacion/comentarios',


	//-----------------------
	// RESOURCES
	//-----------------------
	// INFOGRAPHS AKA INFOBOXES
	infoboxesResources: '/api/Recursos/GetInfograficosRecursos',
	// SEARCH RESOURCES
	searchResources: '/api/Recursos/GetPushPinsRecursos',
	consolidatedResources: '/api/Recursos/GetDataGraficasConsolidados',
	//searchResourcesList: '/api/Recursos/GetListaRecursos',
	// resourcesList: '/api/Recursos/GetListaRecursos',
	getBudget: '/api/Recursos/GetInformacionPresupuesto',
	getDistribution: '/api/Recursos/GetInformacionDistribucion',
	getOutlay: '/api/Recursos/GetInformacionGiros',
	getAprovedProyects: '/api/Proyectos/GetOtrosProyectosAprobados',
	getExecuted: '/api/Recursos/GetInformacionValorEjecutadoProyectos',
	getValueAproved: '/api/Recursos/GetInformacionValorAprobadoProyectos',
	getPerformance: '/api/Recursos/GetInformacionRendimientosDirectas',
	getRegalias: '/api/Recursos/GetInformacionLiquidacion',

	//-----------------------
	// PRODUCTION
	//-----------------------
	infoboxesProduction: '/api/produccion/GetInfograficosProduccion',
	getFieldOrMine: '/api/produccion/GetCampoOMinasPorGeografia',
	searchProduction: '/api/produccion/GetPushPinsProduccion',
	consolidatedProduction: '/api/produccion/GetDataGraficasConsolidados',

	getProductionInfo: '/api/produccion/GetInformacionProduccion',
	getFieldInfo: '/api/produccion/GetProduccionCampoOMina',

	//-----------------------
	// FISCALIZACION
	//-----------------------
	//infoboxesFiscalizacion: '/api/fiscalizacion/GetInfograficosFiscalizacion',
	infoboxesFiscalizacion: '/api/fiscalizacion/GetInfoboxes/',
	//searchFiscalizacion: '/api/fiscalizacion/busqueda',
	searchFiscalizacion: '/api/Fiscalizacion/GetPushPins/',
	actividadesFiscalizacion: '/api/Fiscalizacion/GetActividadesFiscalizacion/',
	consolidatedFiscalizacion: '/api/fiscalizacion/GetDataGraficasFiscalizacion',

	//-----------------------
	// CONTACT
	//-----------------------
	contact: '/api/Mail/setMail',
	// Format
	// /api/Correo/EnviarCorreo/?to=v-carlommicrosoft.com&subject=Busqueda&body=Realiz%C3%A9
	sendByEmail: '/api/Correo/EnviarCorreo',

	//-----------------------
	// TEXTS
	//-----------------------
	texts: '/api/Textos/GetTextoParametrico',

    //------------------------
    //CONTRATOS
    //--------------------------
	getContratosPerAnyo: '/api/serviciosContratistas/GetDataGraficaContratosByAnyo',
	getValorContratosPerAnyo: '/api/serviciosContratistas/GetDataGraficaValorContratosByAnyo',
	getContratosPerTipo: '/api/serviciosContratistas/GetDataGraficaContratosPerTipo',
	getValorAnnioContratos: '/api/serviciosContratistas/GetAnniosContratosByRUC',
	getContratosContratista: '/api/serviciosContratistas/GetInformacionContratosPorFiltros',
	getAnnioContratosProyecto: '/api/serviciosContratistas/GetAnniosContratosByProyecto'
})
