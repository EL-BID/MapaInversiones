













CREATE VIEW [dbo].[VwGaleriaProgramas]
AS

SELECt distinct
      cast([CodigoPrograma] as int) IdPrograma
      ,[NombrePrograma] as Programa
	  ,cast([CodigoPrograma] as int) [IdImage]
	  ,'/GaleriaProgrma/ProgramaDefault_SM.JPG' as [UrlImagePequenia]
	  ,'/GaleriaProgrma/ProgramaDefault_MD.JPG' as [UrlImageMediana]
       ,'/GaleriaProgrma/ProgramaDefault_XL.JPG' as [UrlImageGrande]
      ,'Imagen Programa' AS [DescripcionImage]
  FROM [dbo].[Programa]



