
MERGE MapainversionesCali.dbo.Procesos AS Target
USING (
    SELECT 
        CodigoUnidadCompra,
        UnidadCompra,
        CodigoProceso,
        CodigoModalidad,
        Modalidad,
        TipoExcepcion,
        Caratula,
        Descripcion,
        EstadoProceso,
        FaseProceso,
        Moneda,
        MontoEstimado,
        FechaPublicacion,
        FechaEnmienda,
        FechaFinRecepcionOfertas,
        FechaAperturaOfertas,
        FechaEstimadaAdjudicacion,
        FechaSuscripcion,
        DirigidoMipymes,
        DirigidoMipymesMujeres,
        ProcesoLotificado,
        AdquisicionPlaneada,
        ObjetoProceso,
        SubobjetoProceso,
        FechaUltimaModificacion,
        Url,
        Origen,
        MotivoCancelacion
    FROM dbo.ValidosProcesos
) AS Source
ON Target.CodigoProceso = Source.CodigoProceso

-- Cuando existe en ambos, actualizamos
WHEN MATCHED THEN
    UPDATE SET 
        Target.CodigoUnidadCompra       = Source.CodigoUnidadCompra,
        Target.UnidadCompra             = Source.UnidadCompra,
        Target.CodigoModalidad          = Source.CodigoModalidad,
        Target.Modalidad                = Source.Modalidad,
        Target.TipoExcepcion            = Source.TipoExcepcion,
        Target.Caratula                 = Source.Caratula,
        Target.Descripcion              = Source.Descripcion,
        Target.EstadoProceso            = Source.EstadoProceso,
        Target.FaseProceso              = Source.FaseProceso,
        Target.Moneda                   = Source.Moneda,
        Target.MontoEstimado            = Source.MontoEstimado,
        Target.FechaPublicacion         = Source.FechaPublicacion,
        Target.FechaEnmienda            = Source.FechaEnmienda,
        Target.FechaFinRecepcionOfertas = Source.FechaFinRecepcionOfertas,
        Target.FechaAperturaOfertas     = Source.FechaAperturaOfertas,
        Target.FechaEstimadaAdjudicacion= Source.FechaEstimadaAdjudicacion,
        Target.FechaSuscripcion         = Source.FechaSuscripcion,
        Target.DirigidoMipymes          = Source.DirigidoMipymes,
        Target.DirigidoMipymesMujeres   = Source.DirigidoMipymesMujeres,
        Target.ProcesoLotificado        = Source.ProcesoLotificado,
        Target.AdquisicionPlaneada      = Source.AdquisicionPlaneada,
        Target.ObjetoProceso            = Source.ObjetoProceso,
        Target.SubobjetoProceso         = Source.SubobjetoProceso,
        Target.FechaUltimaModificacion  = Source.FechaUltimaModificacion,
        Target.Url                      = Source.Url,
        Target.Origen                   = Source.Origen,
        Target.MotivoCancelacion        = Source.MotivoCancelacion

-- Cuando existe solo en Source, insertamos
WHEN NOT MATCHED BY TARGET THEN
    INSERT (
        CodigoUnidadCompra,
        UnidadCompra,
        CodigoProceso,
        CodigoModalidad,
        Modalidad,
        TipoExcepcion,
        Caratula,
        Descripcion,
        EstadoProceso,
        FaseProceso,
        Moneda,
        MontoEstimado,
        FechaPublicacion,
        FechaEnmienda,
        FechaFinRecepcionOfertas,
        FechaAperturaOfertas,
        FechaEstimadaAdjudicacion,
        FechaSuscripcion,
        DirigidoMipymes,
        DirigidoMipymesMujeres,
        ProcesoLotificado,
        AdquisicionPlaneada,
        ObjetoProceso,
        SubobjetoProceso,
        FechaUltimaModificacion,
        Url,
        Origen,
        MotivoCancelacion
    )
    VALUES (
        Source.CodigoUnidadCompra,
        Source.UnidadCompra,
        Source.CodigoProceso,
        Source.CodigoModalidad,
        Source.Modalidad,
        Source.TipoExcepcion,
        Source.Caratula,
        Source.Descripcion,
        Source.EstadoProceso,
        Source.FaseProceso,
        Source.Moneda,
        Source.MontoEstimado,
        Source.FechaPublicacion,
        Source.FechaEnmienda,
        Source.FechaFinRecepcionOfertas,
        Source.FechaAperturaOfertas,
        Source.FechaEstimadaAdjudicacion,
        Source.FechaSuscripcion,
        Source.DirigidoMipymes,
        Source.DirigidoMipymesMujeres,
        Source.ProcesoLotificado,
        Source.AdquisicionPlaneada,
        Source.ObjetoProceso,
        Source.SubobjetoProceso,
        Source.FechaUltimaModificacion,
        Source.Url,
        Source.Origen,
        Source.MotivoCancelacion
    );


    -- Inserta Procesos Adicionales (Son procesos disponibles en la hoja de contratos que no están en la hoja de procesos)
    -- Ordenes de Compra de Tienda Virtual
    -- Procesos Tradicionales
    INSERT INTO MapaInversionesCali.dbo.[Procesos]
        select * from dbo.VwProcesosAdicionalesDesdeContratos;

    -- Ver alguna fuente alternativa para complementar datos de los procesos
    update a
        set a.Caratula = substring(b.Nombre_del_Procedimiento,1,250)
            ,a.Descripcion = substring(b.Descripción_del_Procedimiento,1,500)
            ,a.CodigoUnidadCompra = b.Codigo_Entidad
    from MapaInversionesCali.dbo.Procesos a
    join [dbo].[ProcesosSECOP_II_Total] b on b.ID_del_Portafolio = a.CodigoProceso;


    -- Actualiza con datos del conjunto de datos procesado
    update a
        set a.FechaPublicacion = convert(date,b.fecha_de_ultima_publicacion,101)
            ,a.MontoEstimado = convert(float,b.[Valor_del_proceso])
            ,a.EstadoProceso = b.estado_del_procedimiento
            ,a.Url = b.url
    from MapaInversionesCali.dbo.Procesos a
    join dbo.stg_cali_procesos b on b.proceso_de_compra = a.codigoproceso
    where b.fecha_de_ultima_publicacion is not null
    and (convert(date,b.fecha_de_ultima_publicacion,101) != convert(date,a.fechapublicacion)
        or convert(float,b.[Valor_del_proceso]) != convert(float,a.MontoEstimado)
        or b.estado_del_procedimiento != a.EstadoProceso
        or b.url != a.Url)

    update a
        set a.UnidadCompra = dbo.fn_NormalizarCadena(a.UnidadCompra)
    from MapaInversionesCali.dbo.Procesos a;
    
    with cte_unidad as (
    select CodigoUnidadCompra, UnidadCompra from MapaInversionesCali.dbo.Procesos a
    where a.CodigoUnidadCompra != 'No Definido'
    group by CodigoUnidadCompra, UnidadCompra
    )
    update a
        set a.CodigoUnidadCompra = b.CodigoUnidadCompra
    from MapaInversionesCali.dbo.Procesos a
    join cte_unidad b on b.UnidadCompra = a.UnidadCompra
    where a.CodigoUnidadCompra = 'No Definido';