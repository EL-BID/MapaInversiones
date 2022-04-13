/****** Script for SelectTopNRows command from SSMS  ******/
CREATE VIEW [dbo].[vwContratosAdendas]
as 
SELECT [codigo_BPIN]
      ,[Id_Contrato]
      ,[Fecha_Adenda]
      ,[Descripcion]
      ,[Id_Adenda]
      ,[Valor_Adenda]
      ,[Moneda_Adenda]
  FROM [PISGR_PY_COVID19].[dbo].[Adendas_X_Contrato]
