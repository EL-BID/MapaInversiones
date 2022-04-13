
CREATE   VIEW [dbo].[VwDonacionesEntidadesBeneficiariasListado]
as

SELECT distinct
ROW_NUMBER() OVER(ORDER BY  T.EntidadBeneficiaria  ASC) AS  IdBeneficiario
,EntidadBeneficiaria
FROM (Select distinct DonDis.Sucursal as EntidadBeneficiaria
from [dbo].[DonacionDistribucion] DonDis)T


