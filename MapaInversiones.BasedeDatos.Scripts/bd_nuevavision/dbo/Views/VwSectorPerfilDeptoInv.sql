













create VIEW [dbo].[VwSectorPerfilDeptoInv]
AS
						
Select distinct
ProyectosDistintos.IdSector,
ProyectosDistintos.NombreSector,
ProyectosDistintos.IdDepartamento,
ET.NombreDepartamento,

dense_rank() over (partition by  ProyectosDistintos.IdEstado,Est.NombreEstado,ProyectosDistintos.IdSector,
ProyectosDistintos.NombreSector,ProyectosDistintos.IdDepartamento order by  ProyectosDistintos.IdProyecto) 
+ dense_rank() over (partition by  ProyectosDistintos.IdEstado,Est.NombreEstado,ProyectosDistintos.IdSector,
ProyectosDistintos.NombreSector,ProyectosDistintos.IdDepartamento order by ProyectosDistintos.IdProyecto desc) 
- 1 as NumeroProyectosSect,
ProyectosDistintos.IdEstado,
Est.NombreEstado,
dense_rank() over (partition by  ProyectosDistintos.IdEstado,Est.NombreEstado,ProyectosDistintos.IdDepartamento order by  ProyectosDistintos.IdProyecto) 
+ dense_rank() over (partition by  ProyectosDistintos.IdEstado,Est.NombreEstado,ProyectosDistintos.IdDepartamento order by ProyectosDistintos.IdProyecto desc) 
- 1 as NumeroProyectosxEstado
 from (
SELECT distinct proyEntidad.IdDepartamento,he.IdEstado,proy1.IdSector,
sec.NombreSector,proy1.IdProyecto,proy1.VlrTotalProyectoTodasLasFuentes as Total
  FROM [dbo].[ProyectoXEntidadTerritorial] proyEntidad 
  INNER JOIN
dbo.proyecto AS proy1
ON proyEntidad.IdProyecto = proy1.IdProyecto
INNER JOIN
dbo.HistoriaEstado AS he WITH (nolock) 
ON he.IdProyecto = proy1.IdProyecto
INNER JOIN
dbo.sector AS sec WITH (nolock) 
ON sec.IdSector = proy1.IdSector)ProyectosDistintos
inner join dbo.Estado Est
on Est.IdEstado=ProyectosDistintos.IdEstado
inner join dbo.EnteTerritorial ET on ET.IdDepartamento=ProyectosDistintos.IdDepartamento










