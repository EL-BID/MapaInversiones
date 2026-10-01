MERGE INTO MapaInversionesCali.consulta.CatalogoFondo AS target
USING (
    SELECT CodigoFondo
            ,Fondo
            ,ClasificacionFondo
            ,[UsuarioCargue]
            ,[FechaModificacion]
        FROM [dbo].[ValidosFondo]
    ) AS source
ON target.CodigoFondo = source.CodigoFondo

WHEN MATCHED THEN
    UPDATE SET 
        target.Fondo = source.Fondo,
        target.ClasificacionFondo = source.ClasificacionFondo,
        target.UsuarioCargue = source.UsuarioCargue,
        target.FechaModificacion = source.FechaModificacion

WHEN NOT MATCHED THEN
    INSERT (CodigoFondo, Fondo, ClasificacionFondo, UsuarioCargue, FechaModificacion)
    VALUES (source.CodigoFondo, source.Fondo, source.ClasificacionFondo, source.UsuarioCargue, source.FechaModificacion);