MERGE INTO MapaInversionesCali.consulta.CatalogoEntidades AS target
USING (
    SELECT [CodigoInstitucion]
            ,[Institucion]
            ,[CodigoCapitulo]
            ,[Capitulo]
            ,[CodigoSubCapitulo]
            ,[SubCapitulo]
            ,[UsuarioCargue]
            ,[FechaModificacion]
        FROM [dbo].[ValidosEntidades]
    ) AS source
ON target.CodigoInstitucion = source.CodigoInstitucion

WHEN MATCHED THEN
    UPDATE SET 
        target.Institucion = source.Institucion,
        target.CodigoCapitulo = source.CodigoCapitulo,
        target.Capitulo = source.Capitulo,
        target.CodigoSubCapitulo = source.CodigoSubCapitulo,
        target.SubCapitulo = source.SubCapitulo,
        target.UsuarioCargue = source.UsuarioCargue,
        target.FechaModificacion = source.FechaModificacion

WHEN NOT MATCHED THEN
    INSERT (CodigoInstitucion, Institucion, CodigoCapitulo, Capitulo, 
            CodigoSubCapitulo, SubCapitulo, UsuarioCargue, FechaModificacion)
    VALUES (source.CodigoInstitucion, source.Institucion, source.CodigoCapitulo, source.Capitulo, 
            source.CodigoSubCapitulo, source.SubCapitulo, source.UsuarioCargue, source.FechaModificacion);