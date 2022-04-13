
CREATE procedure [dbo].[spt_FiltersContractUnitTestExisteFiltroRegion]
as
select [IdRegion],[NombreRegion]
from [dbo].[EnteTerritorial]
where [Tipo]='REGION'








