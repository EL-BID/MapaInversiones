with cte_cuipo as  (
    select distinct BPIN, programa_presupuestal as  Programa from dbo.stg_cali_cuipo
),
cte_ejecucionsap as (
    select distinct trim(replace(replace(elemento_pep,'-',''),'/','')) as Elemento_PEP
        ,doc_compr as rpc
    from dbo.stg_cali_reporte_rpc
    where Elemento_PEP is not null
)
select distinct
    a.CodigoBPIN
    ,a.NombreProyecto
    ,d.Tipo_Documento
    ,d.Identificacion_del_Contratista
    ,d.nombre_o_razon_social_contratista
    ,d.Estado_Contrato
    ,isnull(d.Proceso_de_Compra,d.Id_Contrato) as Proceso_de_Compra
    ,d.ID_Contrato
    ,ISNULL(TRY_CAST(trim(replace(replace(replace(d.[Valor_del_Contrato],',',''),'$',''),'-','')) as numeric(18,2)),0) as ValorContrato
    ,d.URL_del_Proceso
    ,ISNULL(YEAR(TRY_CAST(d.Fecha_de_Inicio_del_Contrato as datetime2)),YEAR(getdate())) as AnioContrato
    ,substring(d.Objeto_del_Contrato,1,4000) as ObjetoDelContrato
INTO #ContratoXProyectoInversion
from MapaInversionesCali.dbo.Proyecto a
join cte_cuipo b on b.BPIN = a.CodigoBPIN
join cte_ejecucionsap c on c.Elemento_PEP = b.Programa
join dbo.stg_cali_contratos d on d.RPC = c.rpc;


DELETE a
from MapaInversionesCali.consulta.ContratoXProyectoInversion a
join #ContratoXProyectoInversion b on b.CodigoBPIN = a.bpin and b.id_contrato = a.referenciacontrato;

insert into MapaInversionesCali.consulta.ContratoXProyectoInversion
select * from #ContratoXProyectoInversion;

DROP TABLE #ContratoXProyectoInversion;