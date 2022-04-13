/****** Script for SelectTopNRows command from SSMS  ******/
create view [dbo].[vwContratosDocumentosRelacionados]
as 
SELECT [Codigo_BPIN]
      ,[Id_Contrato]
      ,[Fecha_Publicacon]
      ,[Documento]
      ,[Titulo]
      ,[url_Documento]
  FROM [PISGR_PY_COVID19].[dbo].[Documentos_X_Contrato]
