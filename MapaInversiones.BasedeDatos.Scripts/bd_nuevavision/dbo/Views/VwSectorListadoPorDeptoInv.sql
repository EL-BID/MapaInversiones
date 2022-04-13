


create VIEW [dbo].[VwSectorListadoPorDeptoInv]
AS
SELECT distinct proyEntidad.IdDepartamento,he.IdEstado,proy1.IdSector,
sec.NombreSector,proy1.IdProyecto
  FROM [dbo].[ProyectoXEntidadTerritorial] proyEntidad 
  INNER JOIN
dbo.proyecto AS proy1
ON proyEntidad.IdProyecto = proy1.IdProyecto
INNER JOIN
dbo.HistoriaEstado AS he WITH (nolock) 
ON he.IdProyecto = proy1.IdProyecto
INNER JOIN
dbo.sector AS sec WITH (nolock) 
ON sec.IdSector = proy1.IdSector



