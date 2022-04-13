











CREATE VIEW [dbo].[VwGaleriaEntidadesTerritorialesDepartamentos]
AS

SELECT 
 [IdImageXEnteTerritorial],
Deptos.IdDepartamento,
  --  Deptos.[IdMunicipio],
Deptos.NombreDepartamento,
--Deptos.NombreMunicipio
      [IdRegion]
      ,[IdImage]
      ,[UrlImagePequenia]
      ,[UrlImageMediana]
      ,[UrlImageGrande]
      ,[DescripcionImage]
       FROM [dbo].[ImagenesXEnteTerritorial] ImgT
	   RIGHT outer join (SELECT distinct
      [IdDepartamento]
    
      ,[NombreDepartamento]
      
  FROM [dbo].[EnteTerritorial])Deptos
  on Deptos.IdDepartamento=ImgT.[IdDepartamento]
	  where [ImageIndicador]=1


