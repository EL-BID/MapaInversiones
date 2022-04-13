
create   view [dbo].[VwContratosPerfilContratosCancelados]
as
SELECT [Estado]
      ,sum([Valor]) as valor
      ,count(*) as NroContratos
        FROM [dbo].[ContratistaContratoCancelados]
		group by Estado
