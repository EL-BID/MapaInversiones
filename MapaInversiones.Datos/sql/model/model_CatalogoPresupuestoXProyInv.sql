delete a
from MapaInversionesCali.[consulta].[CatalogoPresupuestoXProyInv] a
join MapaInversionesCali.[consulta].CatalogoLineaPresupuestal b on b.id = a.idCatalogoLineaPresupuestal
where b.periodo = (select distinct substring(periodo,1,4) from dbo.stg_cali_cuipo);

insert into MapaInversionesCali.[consulta].[CatalogoPresupuestoXProyInv]
select distinct
    b.id
    ,a.bpin
    ,c.idproyecto
from dbo.stg_cali_cuipo a
join MapaInversionesCali.[consulta].[CatalogoLineaPresupuestal] b on b.[CodigoNegocio] = CONCAT(a.centro_gestor,a.fondo,area_funcional, a.programa_presupuestal,a.Pospre)
                                                and b.Periodo = substring(a.periodo,1,4)
left join MapaInversionesCali.dbo.proyecto c on c.CodigoBPIN = a.[BPIN];