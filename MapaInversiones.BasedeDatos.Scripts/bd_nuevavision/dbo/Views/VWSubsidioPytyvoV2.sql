

CREATE VIEW [dbo].[VWSubsidioPytyvoV2]
as
select ISNULL(ROW_NUMBER() OVER(ORDER BY [Departamento] ASC),0) AS ID, [Departamento]
,sum(PrimerPago) as Pago1
, sum (SegundoPago) as Pago2
, sum (TercerPago) as Pago3
from (
SELECT  case when b.[NombreDepartamento]='PROYECTOS NACIONALES' 
		then 'NO REPORTADO' ELSE b.[NombreDepartamento] END as [Departamento]     
      ,(PrimerPago*500000.00)PrimerPago
      ,(SegundoPago*500000.00)SegundoPago
	  ,(TercerPago*500000.00)TercerPago
  from [PISGR_PY_COVID19].[dbo].[SubsidioPytyvoV2] as a
  inner join  [PISGR_PY_COVID19].dbo.[EnteTerritorial] as b
on  a.IdMunicipio=b.IdMunicipio
  
  
  ) as a
  group by [Departamento]
