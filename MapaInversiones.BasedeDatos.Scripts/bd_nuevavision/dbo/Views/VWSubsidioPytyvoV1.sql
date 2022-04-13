
CREATE VIEW [dbo].[VWSubsidioPytyvoV1]
as
select ISNULL(ROW_NUMBER() OVER(ORDER BY [Departamento] ASC),0) AS ID, [Departamento],sum(Pago1) as Pago1, sum (Pago2) as Pago2
from (
SELECT  [Departamento]
      
      ,case when [subsidioTipo]='Pago1' then sum(cast(nroSubsidios as decimal(10,2))) else 0 end as Pago1
      ,case when [subsidioTipo]='Pago2' then  sum(cast(nroSubsidios as decimal(10,2))) else 0 end as Pago2
  FROM  [dbo].[SubsidioPytyvoV1]
  group by [Departamento],[subsidioTipo]) as a
  group by [Departamento]
