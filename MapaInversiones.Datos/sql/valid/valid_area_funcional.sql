TRUNCATE TABLE [dbo].ValidosAreaFuncional;

INSERT INTO [dbo].[ValidosAreaFuncional]
            ([CodigoAreaFuncional]
            ,[AreaFuncional]
            ,[CodigoPrograma]
            ,[Programa]
            ,[CodigoReto]
            ,[Reto]
            ,[CodigoProposito]
            ,[Proposito]
            ,[UsuarioCargue]
            ,[FechaModificacion])
    select distinct
        a.area_funcional
        ,a.nombre_area_funcional
        ,a.programa
        ,a.nombre_programa
        ,a.reto
        ,a.nombre_reto
        ,a.proposito
        ,a.nombre_proposito
        ,'etlCali'
        ,getdate()
    from dbo.stg_cali_cuipo a;