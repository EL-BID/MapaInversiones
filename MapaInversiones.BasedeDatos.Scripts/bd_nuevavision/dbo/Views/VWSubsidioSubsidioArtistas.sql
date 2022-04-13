create VIEW [dbo].[VWSubsidioSubsidioArtistas]
as
select ISNULL(ROW_NUMBER() OVER(ORDER BY [Departamento] ASC),0) AS ID, [Departamento],sum(Pago1) as Pago1, sum (Pago2) as Pago2
, sum (Pago3) as Pago3
from (

SELECT   [Departamento]
      
      ,case when [NumeroPago]=1 then sum(valor ) else 0 end as Pago1
      ,case when [NumeroPago]=2 then  sum(valor) else 0 end as Pago2
	  ,case when [NumeroPago]=3 then  sum(valor) else 0 end as Pago3
  FROM [dbo].[SubsidioArtistas]
   group by [Departamento],[NumeroPago]) as a

  group by [Departamento]
