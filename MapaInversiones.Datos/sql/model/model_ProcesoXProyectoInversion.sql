TRUNCATE TABLE MapaInversionesCali.consulta.ProcesoXProyectoInversion;

INSERT INTO MapaInversionesCali.consulta.ProcesoXProyectoInversion
select distinct
    a.bpin
    ,a.NombreProyecto
    ,b.IdProyecto
    ,a.codigoproceso
    ,c.MontoEstimado
    ,c.Url
from MapaInversionesCali.consulta.ContratoXProyectoInversion a
join MapaInversionesCali.dbo.Proyecto b on b.CodigoBPIN = a.bpin
join MapaInversionesCali.dbo.Procesos c on c.CodigoProceso = a.codigoproceso