
 /*
  PROCEDIMIENTO ALMACENADO PARA VALIDAR EL ATRIBUTO ResourcesPerSector
  DEL CONTRATO DataConsolidated
*/
CREATE procedure [dbo].[spt_DataConsolidatedContractCargarDatosContratoResourcesPerSector]
 @Annio int
as
--Valor total fuentes regalías
declare @total_fuentes_regalias as numeric;
set @total_fuentes_regalias=(select sum(c.VlrTotalProyectoFuenteRegalias) as total_fuente_regalias from 
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



AND ActualSiNo = 1) as c);

--Recursos aprobados por sector
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
select sector.NombreSector, sum(c.VlrTotalProyectoFuenteRegalias) as dinero_aprobado, CAST(100.0*sum(c.VlrTotalProyectoFuenteRegalias)/@total_fuentes_regalias as numeric(5,2)) as porcentaje
 from c join Sector sector 
on c.IdSector = sector.IdSector
group by sector.NombreSector
having cast(100.0*sum(c.VlrTotalProyectoFuenteRegalias)/@total_fuentes_regalias as numeric(5,2)) >1;



