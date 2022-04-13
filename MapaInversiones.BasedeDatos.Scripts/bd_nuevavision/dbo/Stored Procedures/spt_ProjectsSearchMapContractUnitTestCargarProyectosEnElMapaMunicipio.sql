
CREATE procedure [dbo].[spt_ProjectsSearchMapContractUnitTestCargarProyectosEnElMapaMunicipio]
(
	@departamentos VARCHAR(10)
)
as
select distinct proy.IdProyecto,proy.NombreProyecto,proy.FechaInicioProyecto,proy.VlrTotalProyectoFuenteRegalias,proy.VlrTotalProyectoTodasLasFuentes, e.NombreEstado
from Proyecto as proy 
join ProyectoXEntidadTerritorial as px
on proy.IdProyecto = px.IdProyecto
join EnteTerritorial ente 
on px.IdDepartamento = ente.IdDepartamento and px.IdMunicipio = ente.IdMunicipio
join HistoriaEstado he 
on he.IdProyecto = proy.IdProyecto
join Estado e
on e.IdEstado = he.IdEstado
-- Incluir el estado (si se desea)
where  (e.NombreEstado like ('%APROBADO%') OR e.NombreEstado like ('%EJECUCI%') OR e.NombreEstado like ('%EJECUTADO%'))
and(
 '2012-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2013-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2014-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2015-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
)
AND ente.IdMunicipio = @departamentos
--Incluir el nombre del municipio  (si se desea)
--AND ente.NombreMunicipio in (select * from @municipios)
--Incluir el sector  (si se desea)
--AND proy.IdSector in (select*from @sector)
AND ActualSiNo = 1;



