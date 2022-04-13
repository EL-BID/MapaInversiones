
CREATE procedure [dbo].[spt_DataConsolidatedContractCargarDatosContratoResourcesPerDepartment]
( 
 @Annio int
)
as
--Total todas las regiones
declare @total_fuentes_departamentos as numeric;

set @total_fuentes_departamentos=(select sum(b.VlrTotalProyectoFuenteRegalias) as total_departamento
from (
select distinct ente.NombreDepartamento, c.IdProyecto, c.VlrTotalProyectoFuenteRegalias from
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
as c
join ProyectoXEntidadTerritorial px
on c.IdProyecto = px.IdProyecto
join EnteTerritorial ente 
on px.IdDepartamento = ente.IdDepartamento
and px.IdMunicipio = ente.IdMunicipio) as b);


--Recursos aprobados por region

select b.NombreDepartamento as nombre_departamento, sum(b.VlrTotalProyectoFuenteRegalias) as total_departamento,
 CAST(100.0*sum(b.VlrTotalProyectoFuenteRegalias)/@total_fuentes_departamentos as numeric(5,2)) as porcentaje 
from (
select c.IdProyecto, c.VlrTotalProyectoFuenteRegalias, ente.NombreDepartamento
from EnteTerritorial ente
left  join  ProyectoXEntidadTerritorial px
	on px.IdDepartamento = ente.IdDepartamento and px.IdMunicipio = ente.IdMunicipio
left join 
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
as c
on c.IdProyecto = px.IdProyecto
) as b
where b.NombreDepartamento <> 'N/A'
group by b.NombreDepartamento;



