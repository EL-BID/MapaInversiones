
/*
  PROCEDIMIENTO ALMACENADO PARA VALIDAR EL ATRIBUTO ProjectsPerSector
  DEL CONTRATO DataConsolidated
*/

CREATE PROCEDURE [dbo].[spt_DataConsolidatedContractCargarDatosContratoProjectsPerSector]
  @AnnioActual int
AS




--Valor total cuantos proyectos
declare @total_proyectos int

set @total_proyectos = (select count(c.IdProyecto) as total_proyectos from 
(
select distinct proy.*
from Proyecto as proy join ProyectoXEntidadTerritorial as px
on proy.IdProyecto = px.IdProyecto
join HistoriaEstado he 
on he.IdProyecto = proy.IdProyecto
join Estado e
on e.IdEstado = he.IdEstado
where  (e.NombreEstado like ('%APROBADO%') OR e.NombreEstado like ('%EJECUCI%') OR e.NombreEstado like ('%EJECUTADO%'))
and(
 '2012-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2013-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2014-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
)
and ActualSiNo = 1) as c);

--select @total_proyectos as total_proyectos;

--Obtener proyectos por sector
with c as 
(
select distinct proy.*
from Proyecto as proy join ProyectoXEntidadTerritorial as px
on proy.IdProyecto = px.IdProyecto
join EnteTerritorial ente 
on px.IdDepartamento = ente.IdDepartamento and px.IdMunicipio = ente.IdMunicipio
join HistoriaEstado he 
on he.IdProyecto = proy.IdProyecto
join Estado e
on e.IdEstado = he.IdEstado
where  (e.NombreEstado like ('%APROBADO%') OR e.NombreEstado like ('%EJECUCI%') OR e.NombreEstado like ('%EJECUTADO%'))
and(
 '2012-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2013-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
OR '2014-01-01 00:00:00.000'  BETWEEN FechaInicioProyecto AND FechaFinProyecto
)
AND ActualSiNo = 1)
select sector.NombreSector, count(c.IdProyecto) as numero_proyectos, CAST(100.0*count(c.IdProyecto)/@total_proyectos as numeric(5,2)) as porcentaje
 from c join Sector sector 
on c.IdSector = sector.IdSector
group by sector.NombreSector
having cast(100.0*count(c.IdProyecto)/@total_proyectos as numeric(5,2)) >1;



