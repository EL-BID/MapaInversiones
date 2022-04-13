
create view [dbo].[vTmpDesembolsosProductosCovid19v1] as (
select
a.gerencia,
a.sucursal,
a.sector,
	--cah273
	a.nuevo as desembolso_CAH_273_cantnuevo,
	a.viejo as desembolso_CAH_273_cantviejo,
	a.importe as desembolso_CAH_273_importe,

	--cahf63
	b.entregado as desembolso_CAH_F63_cantentregado,
	b.importe as desembolso_CAH_F63_importe

from
[dbo].[tmp_cahCreditosOtorgadosPresupuestoPropioInstitucional] a
join
[dbo].[tmp_CreditosOtorgadosFondoCovidPrograma21deCreditoAgricolaDeHabilitacion] b

on
a.gerencia = b.gerencia and
a.sucursal = b.sucursal and
a.sector   = b.sector
)
