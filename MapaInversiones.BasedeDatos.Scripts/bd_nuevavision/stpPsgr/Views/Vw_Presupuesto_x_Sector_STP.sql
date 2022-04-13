





CREATE     view [stpPsgr].[Vw_Presupuesto_x_Sector_STP]
as
select	SUBSTRING(sectores.sectores, PATINDEX('%- %', sectores.sectores) + 2, 100) as sector
		,entidades.codigoEstructura as codEntidad
		,entidades.nombre as nombreEntidad
		,programas.codigoEstructura as codPrograma
		,programas.nombre as nombrePrograma
		,AF.año
		,sum(AF.valorPlanificado) as valorPlanificado
		,sum(AF.valorEjecutado) as valorEjecutado
from	[stpPsgr].ESTRUCTURA_PRESUPUESTARIA as niveles
		inner join [stpPsgr].ESTRUCTURA_PRESUPUESTARIA as entidades 
			on niveles.idEstructuraPresupuestaria = entidades.idPadre
			and niveles.alturaNivel = 1
			and entidades.alturaNivel = 2
		inner join [stpPsgr].SectoresXEstructuraPresupuestaria as sectores
			on sectores.idEstructuraPresupuestaria = entidades.idEstructuraPresupuestaria
		inner join [stpPsgr].ESTRUCTURA_PRESUPUESTARIA as programas 
			on entidades.idEstructuraPresupuestaria = programas.idPadre
			and programas.alturaNivel = 4
		inner join [stpPsgr].ESTRUCTURA_PRESUPUESTARIA as tipos 
			on tipos.idEstructuraPresupuestaria = programas.tipoPresupuesto
			and tipos.alturaNivel = 3
		inner join [stpPsgr].ESTRUCTURA_PRESUPUESTARIA as subProgramas 
			on programas.idEstructuraPresupuestaria = subProgramas.idPadre
			and subProgramas.alturaNivel = 5
		inner join [stpPsgr].PROYECTO_ACTIVIDAD as proyectos 
			on subProgramas.idEstructuraPresupuestaria = proyectos.idEntidadPresupuestaria
		inner join [stpPsgr].ACTIVIDAD_OBRA as productos 
			on proyectos.idProyectoActividad = productos.idProyectoActividad
		inner join [stpPsgr].ASIGNACION_AVANCE_FINANCIERO as AF
			on AF.idActividadObra = productos.idActividadObra
group by	sectores.sectores
			,entidades.codigoEstructura
			,entidades.nombre
			,programas.codigoEstructura
			,programas.nombre
			,AF.año
