MERGE INTO MapaInversionesCali.consulta.CatalogoAreaFuncional AS target
USING (
    SELECT [CodigoAreaFuncional]
            ,[AreaFuncional]
            ,[CodigoPrograma]
            ,[Programa]
            ,[CodigoReto]
            ,[Reto]
            ,[CodigoProposito]
            ,[Proposito]
            ,[UsuarioCargue]
            ,[FechaModificacion]
        FROM [dbo].[ValidosAreaFuncional]
    ) AS source
ON target.CodigoAreaFuncional = source.CodigoAreaFuncional

WHEN MATCHED THEN
    UPDATE SET 
        target.AreaFuncional = source.AreaFuncional,
        target.CodigoPrograma = source.CodigoPrograma,
        target.Programa = source.Programa,
        target.CodigoReto = source.CodigoReto,
        target.Reto = source.Reto,
        target.CodigoProposito = source.CodigoProposito,
        target.Proposito = source.Proposito,
        target.UsuarioCargue = source.UsuarioCargue,
        target.FechaModificacion = source.FechaModificacion

WHEN NOT MATCHED THEN
    INSERT (CodigoAreaFuncional, AreaFuncional, CodigoPrograma, Programa
            , CodigoReto, Reto, CodigoProposito, Proposito, UsuarioCargue, FechaModificacion)
    VALUES (source.CodigoAreaFuncional, source.AreaFuncional, source.CodigoPrograma, source.Programa
            , source.CodigoReto, source.Reto, source.CodigoProposito, source.Proposito, source.UsuarioCargue, source.FechaModificacion );