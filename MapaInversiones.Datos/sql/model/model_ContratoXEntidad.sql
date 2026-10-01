TRUNCATE TABLE MapaInversionesCali.consulta.ContratoXEntidad;

INSERT INTO MapaInversionesCali.consulta.ContratoXEntidad
select distinct
    b.CodigoInstitucion
    ,a.tipodocumento
    ,a.numerodocumento
    ,a.razonsocial
    ,isnull(a.EstadoContrato,'No Definido')
    ,a.codigocontrato
    ,a.valorcontratado
    ,p.Url
    ,isnull(YEAR(a.fechaInicioContrato),YEAR(getdate()))
    ,'No Definido'
from MapaInversionesCali.dbo.Contratos a
join PISGRSTG_Cali.dbo.EquivalenciaEntidades ee on ee.EntidadContratos = a.UnidadCompra
join MapaInversionesCali.consulta.CatalogoEntidades b on b.Institucion = ee.EntidadPpto
join MapaInversionesCali.dbo.Procesos p on p.CodigoProceso = a.codigoproceso
where EsCovid = 0;