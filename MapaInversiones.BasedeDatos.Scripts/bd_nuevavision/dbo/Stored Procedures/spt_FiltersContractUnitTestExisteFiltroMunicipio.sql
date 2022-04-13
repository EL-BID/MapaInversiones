
CREATE procedure [dbo].[spt_FiltersContractUnitTestExisteFiltroMunicipio]
as
select [IdMunicipio],[NombreMunicipio]
from [dbo].[EnteTerritorial]
where [Tipo]='MUNICIPIO'








