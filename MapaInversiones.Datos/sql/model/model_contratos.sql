INSERT INTO MapaInversionesCali.[dbo].[Contratos]
            ([codigoproceso]					-- OK
            ,[DescripcionProceso]			-- NO DISPONIBLE
            ,[codigocontrato]				-- OK
            ,[DescripcionContrato]			-- OK
            ,[MonedaContrato]				-- OK (VALOR FIJO)
            ,[MonedaProceso]					-- OK (VALOR FIJO)
            ,[valorcontratado]				-- OK
            ,[RPE]							-- OK
            ,[razonsocial]					-- OK
            ,[tipodocumento]					-- OK
            ,[numerodocumento]				-- OK
            ,[esmipyme]						-- NO DISPONIBLE
            ,[genero]						-- NO DISPONIBLE
            ,[EstadoContrato]				-- NO DISPONIBLE
            ,[fechaInicioContrato]			-- OK
            ,[fechaFinContrato]				-- OK
            ,[Fecha_inicio_ejecucion_contrato]	-- NO DISPONIBLE
            ,[Fecha_fin_ejecucion_contrato]		-- NO DISPONIBLE
            ,[Certificate_code]					-- NO DISPONIBLE
            ,[UnidadCompra]					-- OK
            ,[CodigoSNIP]					-- NO DISPONIBLE
            ,[FCH_INICIO_PUBLICACION]		-- NO DISPONIBLE
            ,[FCH_INICIO_RECEP_OFERTAS]		-- NO DISPONIBLE
            ,[FCH_ESTIMADA_ADJUDICACION]		-- NO DISPONIBLE
            ,[MontoEstimado]					-- OK
            ,[EstadoProceso]					-- NO DISPONIBLE
            ,[URL]							-- NO DISPONIBLE
            ,[CodigoUnidadCompra]			-- NO DISPONIBLE
            ,[FechaUltimaModificacion]		-- OK
            ,[ocid]							-- OK
            ,[id_release]					-- OK
            ,[EsCovid])						-- OK (VALOR FIJO)
select distinct
    isnull([Proceso_de_Compra],id_contrato)							--[codigoproceso]
    ,NULL										--[DescripcionProceso]
    ,[ID_Contrato]								--[codigocontrato]
    ,substring([Objeto_del_Contrato],1,500)						--[DescripcionContrato]
    ,'COP'										--[MonedaContrato]
    ,'COP'										--[MonedaProceso]
    ,ISNULL(TRY_CAST(trim(replace(replace(replace([Valor_del_Contrato],',',''),'$',''),'-','')) as numeric(18,2)),0)  --[valorcontratado]
    ,[Identificacion_del_Contratista]			--[RPE]
    ,dbo.fn_NormalizarCadena(nombre_o_razon_social_contratista)		--[razonsocial]
    ,[Tipo_Documento]							--[tipodocumento]
    ,[Identificacion_del_Contratista]			--[numerodocumento]
    ,NULL										--[esmipyme]
    ,NULL										--[genero]
    ,a.Estado_Contrato							--[EstadoContrato]
    ,try_cast(fecha_de_firma_de_contrato as date)			--[fechaInicioContrato]
    ,try_cast([Fecha_de_Fin_del_Contrato] as date)				--[fechaFinContrato]
    ,try_cast([Fecha_de_Inicio_del_Contrato] as date)			--[Fecha_inicio_ejecucion_contrato]
    ,try_cast([Fecha_de_Fin_del_Contrato] as date)				--[Fecha_fin_ejecucion_contrato]
    ,NULL										--[Certificate_code]
    ,dbo.fn_NormalizarCadena(nombre_del_organismo)						--[UnidadCompra]
    ,NULL										--[CodigoSNIP]
    ,NULL										--[FCH_INICIO_PUBLICACION]
    ,NULL										--[FCH_INICIO_RECEP_OFERTAS]
    ,NULL										--[FCH_ESTIMADA_ADJUDICACION]
    ,ISNULL(TRY_CAST(trim(replace(replace(replace([Valor_del_proceso],',',''),'$',''),'-','')) as numeric(18,2)),0)	--[MontoEstimado]
    ,'No Definido'								--[EstadoProceso]
    ,a.URL_del_Proceso										--[URL]
    ,'No Definido'								--[CodigoUnidadCompra]
    ,getdate()									--[FechaUltimaModificacion]
    ,isnull([Proceso_de_Compra],id_contrato)						--[ocid]
    ,isnull([Proceso_de_Compra],id_contrato)						--[id_release]					
    ,0											--[EsCovid]
    from dbo.stg_cali_contratos a
    where not exists (select 1 from MapaInversionesCali.dbo.Contratos b
                    where b.codigocontrato = a.ID_Contrato);


update a
    set a.EstadoProceso = p.EstadoProceso
        ,a.URL = b.URL_del_Proceso
        ,a.DescripcionProceso = p.Descripcion
        ,a.MontoEstimado = p.MontoEstimado
from MapaInversionesCali.dbo.Contratos a
join MapaInversionesCali.dbo.Procesos p on p.CodigoProceso = a.codigoproceso
join [dbo].stg_cali_contratos b on b.ID_Contrato = a.codigocontrato;


-- Actualizar contratos con monto estimado del proceso = 0
-- Solo aquellos con monto estimado = 0
update a
    set a.MontoEstimado = b.MontoEstimado
from MapaInversionesCali.dbo.Contratos a
join MapaInversionesCali.dbo.Procesos b on b.CodigoProceso = a.codigoproceso
where a.MontoEstimado = 0;