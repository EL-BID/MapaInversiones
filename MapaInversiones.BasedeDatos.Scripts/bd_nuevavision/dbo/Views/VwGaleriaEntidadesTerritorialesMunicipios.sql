




CREATE VIEW [dbo].[VwGaleriaEntidadesTerritorialesMunicipios]
AS

select
	case when isnull(IET.[IdImageXEnteTerritorial],IET2.[IdImageXEnteTerritorial]) is not null then
	isnull(IET.[IdImageXEnteTerritorial],IET2.[IdImageXEnteTerritorial])
	  else (select top 1 [IdImageXEnteTerritorial] from ImagenesXEnteTerritorial where IdDepartamento=ET.[IdDepartamento] and len(IdMunicipio)=5)
	  end [IdImageXEnteTerritorial]
      ,ET.[IdRegion]
      ,ET.[IdDepartamento]
	  ,ET.NombreDepartamento
      ,ET.[IdMunicipio]
	  ,ET.NombreMunicipio
	  ,case when isnull(IET.[IdImage],IET2.[IdImage]) is not null then
	  isnull(IET.[IdImage],IET2.[IdImage])
	  else (select top 1 IdImage from ImagenesXEnteTerritorial where IdDepartamento=ET.[IdDepartamento] and len(IdMunicipio)=5)
	  end [IdImage]
      ,case when isnull(IET.[UrlImagePequenia],IET2.[UrlImagePequenia]) is not null then
	  isnull(IET.[UrlImagePequenia],IET2.[UrlImagePequenia])
	  else (select top 1 [UrlImagePequenia] from ImagenesXEnteTerritorial where IdDepartamento=ET.[IdDepartamento] and len(IdMunicipio)=5)
	  end [UrlImagePequenia]
      ,case when isnull(IET.[UrlImageMediana],IET2.[UrlImageMediana]) is not null then
	  isnull(IET.[UrlImageMediana],IET2.[UrlImageMediana])
	  	  else (select top 1 [UrlImageMediana] from ImagenesXEnteTerritorial where IdDepartamento=ET.[IdDepartamento] and len(IdMunicipio)=5)
	  end [UrlImageMediana]
      ,case when isnull(IET.[UrlImageGrande],IET2.[UrlImageGrande]) is not null then
	  isnull(IET.[UrlImageGrande],IET2.[UrlImageGrande])
	  	  else (select top 1 [UrlImageGrande] from ImagenesXEnteTerritorial where IdDepartamento=ET.[IdDepartamento] and len(IdMunicipio)=5)
	  end [UrlImageGrande]
      ,case when isnull(IET.[DescripcionImage],IET2.[DescripcionImage]) is not null then
	  isnull(IET.[DescripcionImage],IET2.[DescripcionImage])
	  	  else (select top 1 [DescripcionImage] from ImagenesXEnteTerritorial where IdDepartamento=ET.[IdDepartamento] and len(IdMunicipio)=5)
	  end [DescripcionImage]
from [dbo].[EnteTerritorial] ET 
left join [dbo].[ImagenesXEnteTerritorial] IET
on IET.IdMunicipio = ET.IdMunicipio and ET.Tipo='MUNICIPIO'
left join [dbo].[ImagenesXEnteTerritorial] IET2
on IET2.IdDepartamento = ET.IdDepartamento and ET.Tipo='DEPARTAMENTO' and IET2.IdMunicipio=ET.IdMunicipio 


--SELECT
--ImgT.[IdImage], 
-- ImgT.[IdImageXEnteTerritorial],
-- Deptos.IdDepartamento,
--    Deptos.[IdMunicipio],
--Deptos.NombreDepartamento,
--Deptos.NombreMunicipio
--      ,ImgT.[IdRegion]
--      ,ImgT.[UrlImagePequenia]
--      ,ImgT.[UrlImageMediana]
--      ,ImgT.[UrlImageGrande]
--      ,ImgT.[DescripcionImage]
--       FROM [dbo].[ImagenesXEnteTerritorial] ImgT
--	   RIGHT outer join (SELECT distinct
--      [IdDepartamento]
    
--      ,[NombreDepartamento], IdMunicipio,NombreMunicipio
      
--  FROM [PISGR_PY].[dbo].[EnteTerritorial])Deptos
--  on Deptos.IdDepartamento=ImgT.[IdDepartamento] and Deptos.IdMunicipio=ImgT.IdMunicipio 
--  RIGHT outer JOIN (Select min(IdImage) as IdImage,ImgT.IdMunicipio from [dbo].[ImagenesXEnteTerritorial] ImgT group by ImgT.IdMunicipio)MaxImage
--  ON ImgT.IdMunicipio=MaxImage.IdMunicipio and ImgT.IdImage=MaxImage.IdImage and  Deptos.IdMunicipio=MaxImage.IdMunicipio  
--	  where [ImageIndicador] is null and LEN(Deptos.IdMunicipio)<5 

--	  union all

--	  SELECT 
--	  isnull(ImgT.[IdImage],ImageDepto.[IdImage]) as [IdImage],
--	   isnull(ImgT.[IdImageXEnteTerritorial],ImageDepto.[IdImageXEnteTerritorial]) as  [IdImageXEnteTerritorial],
--	  Deptos.IdDepartamento,
--    Deptos.[IdMunicipio],
--	Deptos.NombreDepartamento,
--Deptos.NombreMunicipio
--      ,isnull(ImgT.[IdRegion],ImageDepto.[IdRegion]) as [IdRegion]
--	  ,isnull(ImgT.[UrlImagePequenia],ImageDepto.[UrlImagePequenia]) as [UrlImagePequenia]
--      ,isnull(ImgT.[UrlImageMediana],ImageDepto.[UrlImageMediana]) as [UrlImageMediana]
--     ,isnull(ImgT.[UrlImageGrande],ImageDepto.[UrlImageGrande]) as [UrlImageGrande]
--   ,isnull(ImgT.[DescripcionImage],ImageDepto.[DescripcionImage]) as [DescripcionImage]
--      FROM [dbo].[ImagenesXEnteTerritorial] ImgT
--	   RIGHT outer join (SELECT distinct
--      [IdDepartamento]
    
--      ,[NombreDepartamento], IdMunicipio,NombreMunicipio
      
--  FROM [PISGR_PY].[dbo].[EnteTerritorial])Deptos
--  on Deptos.IdDepartamento=ImgT.[IdDepartamento] and Deptos.IdMunicipio=ImgT.IdMunicipio
--  inner join (SELECT VwImageDepto.[IdDepartamento]
--      ,VwImageDepto.[NombreDepartamento]
--      ,VwImageDepto.[IdImageXEnteTerritorial]
--      ,VwImageDepto.[IdRegion]
--      ,VwImageDepto.[IdImage]
--      ,VwImageDepto.[UrlImagePequenia]
--      ,VwImageDepto.[UrlImageMediana]
--      ,VwImageDepto.[UrlImageGrande]
--      ,VwImageDepto.[DescripcionImage]
--  FROM [dbo].[VwGaleriaEntidadesTerritorialesDepartamentos] VwImageDepto)ImageDepto
--  on  ImageDepto.[IdDepartamento]=Deptos.IdDepartamento
--  where ImgT.[IdDepartamento] is null and LEN(Deptos.IdMunicipio)<5 and LEN(Deptos.IdMunicipio)>3






