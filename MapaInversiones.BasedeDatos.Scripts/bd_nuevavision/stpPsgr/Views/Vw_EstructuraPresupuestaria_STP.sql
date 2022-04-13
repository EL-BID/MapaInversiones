







CREATE     view [stpPsgr].[Vw_EstructuraPresupuestaria_STP]
as
---- estructura presupuestaria en tabla recursiva + proyecto + producto(actividad)
select	niveles.idEstructuraPresupuestaria as idNivel
		,niveles.codigoEstructura as codNivel
		,niveles.nombre as nombreNivel
		,entidades.idEstructuraPresupuestaria as idEntidad
		,entidades.codigoEstructura as codEntidad
		,entidades.nombre as nombreEntidad
		,tipos.idEstructuraPresupuestaria as idTipoPrograma
		,tipos.codigoEstructura as codTipo
		,tipos.nombre as nombreTipo
		,programas.idEstructuraPresupuestaria as idPrograma
		,programas.codigoEstructura as codPrograma
		,programas.nombre as nombrePrograma
		,subProgramas.idEstructuraPresupuestaria as idSubPrograma
		,subProgramas.codigoEstructura as codSubPrograma
		,subProgramas.nombre as nombreSubPrograma
		,proyectos.idProyectoActividad as idProyecto
		,proyectos.codProyecto as codProyecto
		,proyectos.nombre as nombreProyecto
		,productos.idActividadObra as idProducto
		,productos.codActividad as codProducto
		,productos.nombre as nombreProducto
from	[NuevaVisionPY].[stpPsgr].ESTRUCTURA_PRESUPUESTARIA as niveles
		inner join [NuevaVisionPY].[stpPsgr].ESTRUCTURA_PRESUPUESTARIA as entidades 
			on niveles.idEstructuraPresupuestaria = entidades.idPadre
			and niveles.alturaNivel = 1
			and entidades.alturaNivel = 2
		inner join [NuevaVisionPY].[stpPsgr].ESTRUCTURA_PRESUPUESTARIA as programas 
			on entidades.idEstructuraPresupuestaria = programas.idPadre
			and programas.alturaNivel = 4
		inner join [NuevaVisionPY].[stpPsgr].ESTRUCTURA_PRESUPUESTARIA as tipos 
			on tipos.idEstructuraPresupuestaria = programas.tipoPresupuesto
			and tipos.alturaNivel = 3
		inner join [NuevaVisionPY].[stpPsgr].ESTRUCTURA_PRESUPUESTARIA as subProgramas 
			on programas.idEstructuraPresupuestaria = subProgramas.idPadre
			and subProgramas.alturaNivel = 5
		inner join [NuevaVisionPY].[stpPsgr].PROYECTO_ACTIVIDAD as proyectos 
			on subProgramas.idEstructuraPresupuestaria = proyectos.idEntidadPresupuestaria
		inner join [NuevaVisionPY].[stpPsgr].ACTIVIDAD_OBRA as productos 
			on proyectos.idProyectoActividad = productos.idProyectoActividad
