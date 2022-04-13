
create view [dbo].[vTmpDesembolsosProductosCovid19v2] as (
select
a.sector,
a.gerencia as distribucionGerencia,
a.sucursal as distribucionSucursal,
2020 AS Anio,
12 AS IdPrograma,
CASE
	when a.sector = 'COMERCIO' THEN 1093
	when a.sector = 'SERVICIO' THEN 1094
	when a.sector = 'PRODUCCIÓN' THEN 1095
	when a.sector = 'CONSUMO' THEN 1096
END as CodigoIndicador,
'Crédito Agrícola de Habilitación' fuente,
'Propio presupuesto pero en el marco del Covid 19' as fondoTipo,

	--cah273
	a.viejo as cantPrestamosOld,
	a.nuevo as cantPrestamosNew,
	a.importe as cantGuaranies

from
[dbo].[tmp_cahCreditosOtorgadosPresupuestoPropioInstitucional] a

union


select
b.sector,
b.gerencia as distribucionGerencia,
b.sucursal as distribucionSucursal,
2020 AS Anio,
12 AS IdPrograma,
CASE
	when b.sector = 'COMERCIO' THEN 1093
	when b.sector = 'SERVICIO' THEN 1094
	when b.sector = 'PRODUCCIÓN' THEN 1095
	when b.sector = 'CONSUMO' THEN 1096
END as CodigoIndicador,
'Crédito Agrícola de Habilitación' fuente,
'Fondos de emergencia' as fondoTipo,

	--cahf63
	b.entregado as cantPrestamosNew,
	0 as cantPrestamosOld,
	b.importe as cantGuaranies
from
[dbo].[tmp_CreditosOtorgadosFondoCovidPrograma21deCreditoAgricolaDeHabilitacion] b
)

