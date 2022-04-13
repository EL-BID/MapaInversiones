
CREATE PROCEDURE [dbo].[BusquedaGeneral] 
as begin

--CREATE TABLE #TmpBuscador(
--	[Categoria] [varchar](20) NOT NULL,
--	[Id] [varchar](20) NOT NULL,
--	[Nombre] [varchar](5000) NOT NULL
--)

--Truncate table #TmpBuscador

--INSERT INTO  #TmpBuscador
--Select distinct 'PROYECTO' as Categoria,convert(varchar(20),PAI.IdProyecto) as Id,NombreProyecto+'|'+REPLACE(REPLACE(EntidadEjecutora, CHAR(13), ''), CHAR(10), '')+'|'+CodigoUnico as Nombre
--from [dbo].[VwProyectosAprobadosInv] PAI 
--order by Nombre

--INSERT INTO  #TmpBuscador
--Select distinct 'MUNICIPIO' as Categoria, convert(varchar(20),IdMunicipio) as Id,NombreMunicipio as Nombre from [dbo].[EnteTerritorial]  
--WHERE NombreMunicipio NOT LIKE '%PROYECTO DEPARTAMENTAL' AND  NombreMunicipio NOT LIKE 'N/A' AND NombreMunicipio!='NACIONALES'
--order by Nombre

--INSERT INTO  #TmpBuscador
--Select distinct 'DEPARTAMENTO' as Categoria,CAST(IdDepartamento AS VARCHAR(20))  as Id,NombreDepartamento as Nombre from [dbo].[EnteTerritorial] 
--WHERE NombreDepartamento NOT LIKE 'N/A' AND NombreDepartamento!='PROYECTOS NACIONALES'
--order by Nombre

--INSERT INTO  #TmpBuscador
--Select distinct 'SECTOR' as Categoria, CONVERT(varchar(20),[IdSector]) as Id,[NombreSector] as Nombre from [dbo].[Sector] 
--order by Nombre

--select distinct Categoria, Id, Nombre from #TmpBuscador

--drop table #TmpBuscador

--select distinct Categoria, Id, Nombre from Busqueda
--order by 1,3

Create table #tmp_busqueda
(
IdBusqueda int identity(1,1),
Categoria varchar(20),
Id varchar(20),
Nombre varchar(1000) 
)

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from Busqueda where Categoria='DEPARTAMENTO' 
order by Nombre;
--order by 1,3
Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from Busqueda where Categoria='MUNICIPIO' 
order by Nombre; 

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from Busqueda where Categoria='SECTOR' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from Busqueda where Categoria='PROYECTO' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from Busqueda where Categoria='CONTRATISTA' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;
 
Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from Busqueda where Categoria='CONTRATO' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;
 
select * from #tmp_busqueda order by IdBusqueda; 

drop table #tmp_busqueda

END




