




CREATE       view [stp].[Vw_DatosAbiertos_VinculacionPND_Indicadores]
as
select	q.codEjeEstrategico
		,q.nombreEjeEstrategico
		,q.codObjetivoEstrategico
		,q.nombreObjetivoEstrategico
		,q.codObjetivoEspecifico
		,q.nombreObjetivoEspecifico
		,q.indicador
		,q.[Unidad/Escala]
		,ISNULL(q.añoBaseIndicador, 0) as añoBaseIndicador
		,ISNULL(q.[Meta 2023], 0) as [Meta 2023]
		,ISNULL(q.[Meta 2030], 0) as [Meta 2030]
		,ISNULL(q.avance, 0) as avance
		,ISNULL(q.codNivelEntidad, '') as codNivelEntidad
		,q.nombreEntidad
		,ISNULL(null, '') as entidadReporta
		,ISNULL(q.fuente, '') as fuente
from	consulta.Vinculacion_IndicadoresPND_x_Entidades_STP as q
