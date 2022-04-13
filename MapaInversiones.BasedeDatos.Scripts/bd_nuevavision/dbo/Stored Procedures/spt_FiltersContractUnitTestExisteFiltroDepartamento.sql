
CREATE procedure [dbo].[spt_FiltersContractUnitTestExisteFiltroDepartamento]
as
select [IdDepartamento],[NombreDepartamento]
from [dbo].[EnteTerritorial]
where [Tipo]='DEPARTAMENTO'








