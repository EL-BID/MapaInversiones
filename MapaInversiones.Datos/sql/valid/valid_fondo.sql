TRUNCATE TABLE [dbo].[ValidosFondo];

INSERT INTO [dbo].[ValidosFondo]
            ([CodigoFondo]
            ,[Fondo]
            ,[ClasificacionFondo]
            ,[UsuarioCargue]
            ,[FechaModificacion])
    select distinct
            a.[Fondo]
            ,a.nombre_de_fondo
            ,a.clasificacion_del_fondo
            ,'etlCali'
            ,getdate()
        from dbo.stg_cali_cuipo a