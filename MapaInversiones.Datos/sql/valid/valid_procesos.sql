update [dbo].stg_cali_procesos set nombre_del_organismo = dbo.fn_NormalizarCadena(nombre_del_organismo)

update [dbo].stg_cali_procesos set fecha_de_ultima_publicacion = NULL where fecha_de_ultima_publicacion IN ('Sin información','Creado');

update [dbo].stg_cali_procesos set valor_del_proceso = 0 where valor_del_proceso IN ('Creado','$0');

TRUNCATE TABLE dbo.ValidosProcesos;

INSERT INTO dbo.ValidosProcesos (
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
select distinct
        'No Definido'					--[CodigoUnidadCompra]
        ,dbo.fn_NormalizarCadena(a.nombre_del_organismo)			--[UnidadCompra]
        ,a.[Proceso_de_Compra]			--[CodigoProceso]
        ,NULL							--[CodigoModalidad]
        ,a.modalidad_de_contratacion	--[Modalidad]
        ,NULL							--[TipoExcepcion]
        ,substring(a.descripcion_del_procedimiento,1,250)							--[Caratula]
        ,substring(a.descripcion_del_procedimiento,1,500)							--[Descripcion]
        ,a.Estado_del_Procedimiento		--[EstadoProceso]
        ,a.Fase							--[FaseProceso]
        ,'COP'							--[Moneda]
        ,ISNULL(TRY_CAST(trim(replace(replace(replace(a.[Valor_del_proceso],',',''),'$',''),'-','')) as numeric(18,2)),0)  --[MontoEstimado]
        ,isnull(convert(date,a.fecha_de_ultima_publicacion,101),fir.FechaPreviaFirmaContrato) 	--[FechaPublicacion]
        ,NULL							--[FechaEnmienda]
        ,NULL							--[FechaFinRecepcionOfertas]
        ,NULL							--[FechaAperturaOfertas]
        ,NULL							--[FechaEstimadaAdjudicacion]
        ,NULL							--[FechaSuscripcion]
        ,NULL							--[DirigidoMipymes]
        ,NULL							--[DirigidoMipymesMujeres]
        ,NULL							--[ProcesoLotificado]
        ,NULL							--[AdquisicionPlaneada]
        ,NULL							--[ObjetoProceso]
        ,NULL							--[SubobjetoProceso]
        ,getdate()						--[FechaUltimaModificacion]
        ,a.url							--[Url]
        ,0								--[Origen]	
        ,NULL							--[MotivoCancelacion]
        from [dbo].stg_cali_procesos a
        left join dbo.VwProcesosConFechaPreviaFirmaContrato fir on fir.proceso_de_compra = a.proceso_de_compra
        where not exists (select 1 from MapaInversionesCali.dbo.Procesos b
                                        where b.CodigoProceso = a.proceso_de_compra)
and a.proceso_de_compra is not null;