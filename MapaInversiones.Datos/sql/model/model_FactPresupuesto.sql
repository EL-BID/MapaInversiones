delete from a
from MapaInversionesCali.consulta.FactPresupuesto a
join MapaInversionesCali.consulta.CatalogoTiempo b on b.periodo = a.IdPeriodo
and b.año = (select distinct substring(Periodo,1,4) from dbo.stg_cali_cuipo);

INSERT INTO MapaInversionesCali.consulta.FactPresupuesto
select 
    concat(b.Periodo,'01')
    ,b.Id
    ,sum(ISNULL(TRY_CONVERT(float,a.ppto_inicial),0))
    ,sum(ISNULL(TRY_CONVERT(float,a.ppto_modificado),0))
    ,sum(ISNULL(TRY_CONVERT(float,a.ppto_modificado),0))
    ,sum(ISNULL(TRY_CONVERT(float,a.ejecucion),0))
    ,sum(ISNULL(TRY_CONVERT(float,a.total_acumul_obligac),0))
from dbo.stg_cali_cuipo a
join MapaInversionesCali.consulta.CatalogoLineaPresupuestal b on (b.CodigoNegocio = CONCAT(a.centro_gestor,a.fondo,area_funcional, a.programa_presupuestal,a.Pospre)
                                            and b.Periodo = substring(a.Periodo,1,4))
WHERE 1=1
and a.vigencia not like 'Reserva%'
group by b.Id,concat(b.Periodo,'01');