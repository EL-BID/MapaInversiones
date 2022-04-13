













create VIEW [dbo].[VwSectorPerfilProyectosInv]
AS
SELECT  distinct
proy.IdSector,
sec.NombreSector,
count(proy.IdProyecto)  over (PARTITION BY proy.IdSector,
sec.NombreSector
) NumeroProyectosSect,

--count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado,proy.IdSector)*100.00/count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado) PorcentajeProyectosSector,
he.IdEstado,
Est.NombreEstado,
count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado,proy.IdSector,sec.NombreSector) NumeroProyectosxEstado
--count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado)*100.00/(Select count(proy.IdProyecto) FROM dbo.Proyecto proy) PorcentajeProyectosEstado

FROM [VwProyectosAprobadosInv] AS proy WITH (nolock) 
INNER JOIN
dbo.HistoriaEstado AS he WITH (nolock) 
ON he.IdProyecto = proy.IdProyecto
inner join dbo.Estado Est
on Est.IdEstado=he.IdEstado
INNER JOIN
dbo.sector AS sec WITH (nolock) 
ON sec.IdSector = proy.IdSector

--order by IdEstado
						











