TRUNCATE TABLE dbo.ValidosEntidades;

INSERT INTO [dbo].[ValidosEntidades]
            ([CodigoInstitucion]
            ,[Institucion]
            ,[CodigoCapitulo]
            ,[Capitulo]
            ,[CodigoSubCapitulo]
            ,[SubCapitulo]
            ,[UsuarioCargue]
            ,[FechaModificacion])
    select distinct
        a.centro_gestor
        ,nombre_centro_gestor
        ,-1
        ,'No Definido'
        ,-1
        ,'No Definido'
        ,'etlCali'
        ,getdate()
    from dbo.stg_cali_cuipo a