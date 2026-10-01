--Procesos y Contratos
update MapaInversionesCali.dbo.fuentedelosrecursos
set FechaActualizacionFuente = (select top 1  dateadd(MONTH,1,convert(datetime,concat(Periodo,'01')))-1 from dbo.stg_cali_cuipo)
    ,FechaCorteFuente = (select top 1  dateadd(MONTH,1,convert(datetime,concat(Periodo,'01')))-1 from dbo.stg_cali_cuipo)
where idfuente = 2