









CREATE VIEW [dbo].[VwInformacionGeneralPerfilLocalizacionDepto]
AS
SELECT  
px.IdDepartamento,
avg(proy.VlrTotalProyectoTodasLasFuentes) as ValorPromedioProyecto
,count(distinct proy.IdProyecto) AS NumeroProyectos
,AVG(DuracionProyecto) as DuracionPromedioProyectos
--sum(AVG(proy.VlrTotalProyectoTodasLasFuentes)) over (PARTITION BY px.IdDepartamento,px.IdMunicipio), --/sum(count(proy.IdProyecto))  over (PARTITION BY px.IdDepartamento,px.IdMunicipio) as CostoPromedioProyecto,
--sum(AVG(DuracionProyecto))  over (PARTITION BY px.IdDepartamento,px.IdMunicipio) as Duracion,--)/count(proy.IdProyecto) over (PARTITION BY px.IdDepartamento,px.IdMunicipio)
--sum(count(proy.IdProyecto)) over (PARTITION BY px.IdDepartamento,px.IdMunicipio) as NumeroProyectos

 --  FROM dbo.Proyecto AS proy WITH (nolock) 
FROM dbo.Proyecto AS proy WITH (nolock) 
INNER JOIN
(Select distinct proy.IdProyecto,[dbo].[duration] (proy.FechaInicioProyecto,proy.FechaFinProyecto) as DuracionProyecto 
FROM dbo.Proyecto AS proy)ProyectoDuracion
on ProyectoDuracion.IdProyecto=proy.IdProyecto
INNER JOIN
dbo.ProyectoXEntidadTerritorial AS px 
ON proy.IdProyecto = px.IdProyecto
inner join dbo.EnteTerritorial E
ON E.IdDepartamento=PX.IdDepartamento AND E.IdMunicipio=PX.IdMunicipio
WHERE E.Tipo!='DEPARTAMENTO'
group by px.IdDepartamento--,px.IdMunicipio
--order by px.IdDepartamento 		
--Select * from 
--dbo.EnteTerritorial



