



CREATE   view [stp].[Vw_PND2030_STP]
as
select	distinct est.*
		,estructura.idNivel
		,prod.nivel as codNivel
		,estructura.nombreNivel
		,estructura.idEntidad
		,prod.entidad as codEntidad
		,estructura.nombreEntidad
		,estructura.idTipoPrograma
		,prod.tipo_presupuesto as codTipoPrograma
		,estructura.nombreTipo as nombreTipoPrograma
		,estructura.idPrograma
		,prod.programa as codPrograma
		,estructura.nombrePrograma
		,estructura.idSubPrograma
		,prod.subprograma as codSubPrograma
		,estructura.nombreSubPrograma
		,estructura.idProyecto
		,prod.proyecto as codProyecto
		,estructura.nombreProyecto
		,estructura.idProducto
		,prod.producto as codProducto
		,estructura.nombreProducto
from	[stp].[Vw_EstrategiasPND2030_STP] AS est
		INNER JOIN [stp].[Vw_resultadoInmediatoXobjetivoPND2030_STP] AS obj 
			ON est.idObjetivo = obj.id
		INNER JOIN [stp].[Vw_productoXresultadoInmediato_STP] AS prod 
			ON prod.id = obj.objetivo_id
		INNER JOIN [stpPsgr].Vw_EstructuraPresupuestaria_STP as estructura	-- quitar este join para data más fiel
			ON estructura.codNivel = prod.nivel
			and estructura.codEntidad = prod.entidad
			and estructura.codTipo = prod.tipo_presupuesto
			and estructura.codPrograma = prod.programa
			and estructura.codSubPrograma = prod.subprograma
			and estructura.codProyecto = prod.proyecto
