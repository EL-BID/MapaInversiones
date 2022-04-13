





CREATE       view [stp].[Vw_DatosAbiertos_VinculacionPND_Presupuesto_x_Entidad]
as
select	ISNULL(q.codEjeEstrategico, 0) as codEjeEstrategico
		,q.nombreEjeEstrategico
		,q.codObjetivoEstrategico
		,q.nombreObjetivoEstrategico
		,q.codObjetivoEspecifico
		,q.nombreObjetivoEspecifico
		,ISNULL(q.codODS, 0) as codODS
		--,CAST(ISNULL(ods.nombre, 'sin ODS') as varchar(255)) as nombreODS
		--,CAST(ISNULL(ods.descripcion, 'sin ODS') as varchar(255)) as descripcionODS
		,ISNULL(q.nombreODS, 'sin ODS') as nombreODS
		,ISNULL(q.descripcionODS, 'sin ODS') as descripcionODS
		,q.codNivelEntidad
		,ISNULL(q.entidad, '-') as entidad
		,ISNULL(q.siglaEntidad, '-') as siglaEntidad
		,ISNULL(q.IdNegocioProyecto, '-') as IdNegocioProyecto
		,ISNULL(q.nombreProyecto, '-') as nombreProyecto
		,ISNULL(q.aportePresupuestalAlObjetivo, 0) as aportePresupuestalAlObjetivo
		,q.AnioPresupuesto
		,q.version
from	consulta.VinculacionPND_Presupuesto_x_Entidad_STP as q
		--left join stp.ODS as ods
		--	on ods.codODS = q.codODS
order by	q.codEjeEstrategico
			,q.codObjetivoEstrategico
			,q.codObjetivoEspecifico offset 0 rows
