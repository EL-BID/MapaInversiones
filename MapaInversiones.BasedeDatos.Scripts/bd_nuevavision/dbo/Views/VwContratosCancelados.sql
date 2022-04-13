
CREATE   view [dbo].[VwContratosCancelados]
AS
SELECT substring([AwardId],1,(charindex('-',AwardId,1)-1))  IdProceso
      ,[Estado]
      ,[Valor]
      ,[MonedaValor]
      ,[Proveedor]
      ,[CodigoProveedor]
      ,[FechaModificacion]
      ,[esCovid]
	  ,'https://www.contrataciones.gov.py/licitaciones/adjudicacion/contrato/'+[AwardId]+'.html' urlContrato
  FROM [PISGR_PY_COVID19].[dbo].[ContratistaContratoCancelados]
