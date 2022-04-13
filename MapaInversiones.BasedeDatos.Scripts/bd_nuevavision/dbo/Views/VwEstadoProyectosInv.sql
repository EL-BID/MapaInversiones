











CREATE VIEW [dbo].[VwEstadoProyectosInv]
AS
SELECT  distinct
px.IdDepartamento,
px.IdMunicipio,
he.IdEstado,
Est.NombreEstado,
count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado,px.IdDepartamento,
px.IdMunicipio) NumeroProyectos,
sum(proy.VlrTotalProyectoTodasLasFuentes) over (PARTITION BY he.IdEstado,
Est.NombreEstado,px.IdDepartamento,
px.IdMunicipio) ValorProyectos
--count(proy.IdProyecto)  over (PARTITION BY he.IdEstado,Est.NombreEstado)*100.00/(Select count(proy.IdProyecto) FROM dbo.Proyecto proy) PorcentajeProyectos
FROM dbo.Proyecto AS proy WITH (nolock) 
INNER JOIN
dbo.HistoriaEstado AS he WITH (nolock) 
ON he.IdProyecto = proy.IdProyecto
inner join dbo.Estado Est
on Est.IdEstado=he.IdEstado
INNER JOIN
dbo.ProyectoXEntidadTerritorial AS px 
ON proy.IdProyecto = px.IdProyecto

						











