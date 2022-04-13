










CREATE VIEW [dbo].[VwSectorProyectosInv]
AS
SELECT  distinct
px.IdDepartamento,
px.IdMunicipio,
proy.IdSector,
sec.NombreSector,
count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado,proy.IdSector,
sec.NombreSector,px.IdDepartamento,
px.IdMunicipio) NumeroProyectosSect,

--count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado,proy.IdSector)*100.00/count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado) PorcentajeProyectosSector,
he.IdEstado,
Est.NombreEstado,
count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado,px.IdDepartamento,
px.IdMunicipio) NumeroProyectosxEstado
--count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado)*100.00/(Select count(proy.IdProyecto) FROM dbo.Proyecto proy) PorcentajeProyectosEstado

FROM dbo.Proyecto AS proy WITH (nolock) 
INNER JOIN
dbo.HistoriaEstado AS he WITH (nolock) 
ON he.IdProyecto = proy.IdProyecto
inner join dbo.Estado Est
on Est.IdEstado=he.IdEstado
INNER JOIN
dbo.sector AS sec WITH (nolock) 
ON sec.IdSector = proy.IdSector
INNER JOIN
dbo.ProyectoXEntidadTerritorial AS px 
ON proy.IdProyecto = px.IdProyecto
--order by IdEstado
						










