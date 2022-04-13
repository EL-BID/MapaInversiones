CREATE PROCEDURE [dbo].[BusquedaGeneralCovid] 
as begin

--select distinct Categoria, Id, Nombre from BusquedaCovid
--order by 1,3
Create table #tmp_busqueda
(
IdBusqueda int identity(1,1),
Categoria varchar(20),
Id varchar(20),
Nombre varchar(1000) 
)

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from BusquedaCovid where Categoria='DEPARTAMENTO' 
order by Nombre;

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from BusquedaCovid where Categoria='PROGRAMA' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from BusquedaCovid where Categoria='SUBSIDIO' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;
 

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from BusquedaCovid where Categoria='PROYECTO' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;

Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from BusquedaCovid where Categoria='CONTRATISTA' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;
 
Insert into #tmp_busqueda
select distinct Categoria, Id, Nombre from BusquedaCovid where Categoria='CONTRATO' --and Nombre !='NACIONALES, DISTRITO NACIONAL'
order by Nombre;
 
select * from #tmp_busqueda order by IdBusqueda; 

drop table #tmp_busqueda
END
