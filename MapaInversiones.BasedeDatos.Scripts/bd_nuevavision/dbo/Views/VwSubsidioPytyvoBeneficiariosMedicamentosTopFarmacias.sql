


CREATE VIEW [dbo].[VwSubsidioPytyvoBeneficiariosMedicamentosTopFarmacias]
AS
select ISNULL(ROW_NUMBER() OVER(ORDER BY total desc),0) AS ID
,Farmacia,total from(
SELECT   top(5) Farmacia, SUM([Monto de Compra]) AS total
FROM         dbo.SubsidioPytyvoBeneficiariosMedicamentos AS subsidioMed
GROUP BY Farmacia
ORDER BY total DESC) as k
