INSERT INTO MapaInversionesCali.[dbo].[Contratistas]
            ([ocid]
            ,[id_release]
            ,[I]
            ,[FechaFirmaContrato]
            ,[MetodoContratacion]
            ,[DetalleMetodoContratacion]
            ,[CategoriaContratacion]
            ,[FechaInicioProceso]
            ,[FechaFinProceso]
            ,[NombreContratista]
            ,[IdContratista]
            ,[TipoIdContratista]
            ,[DireccionContratista]
            ,[CiudadContatista]
            ,[ProvinciaContratista]
            ,[RolContratista]
            ,[FechaUltimaModificacion])
select distinct
    [Proceso_de_Compra]							--[ocid]
    ,[Proceso_de_Compra]						--[id_release]
    ,[ID_Contrato]								--[I]
    ,TRY_CONVERT(DATE, [Fecha_de_Firma_de_Contrato])				--[FechaFirmaContrato]
    ,a.modalidad_de_contratacion				--[MetodoContratacion]
    ,substring(a.justificacion_modalidad_de_contratacion,1,70)	--[DetalleMetodoContratacion]
    ,NULL										--[CategoriaContratacion]
    ,NULL										--[FechaInicioProceso]
    ,NULL										--[FechaFinProceso]
    ,substring(dbo.fn_NormalizarCadena(nombre_o_razon_social_contratista),1,150)		--[NombreContratista]
    ,[Identificacion_del_Contratista]			--[IdContratista]
    ,[Tipo_Documento]							--[TipoIdContratista]
    ,NULL										--[DireccionContratista]
    ,NULL										--[CiudadContatista]
    ,NULL										--[ProvinciaContratista]
    ,NULL										--[RolContratista]
    ,getdate()									--[FechaUltimaModificacion]
    from dbo.stg_cali_contratos a
    where 1=1
    and a.Proceso_de_Compra is not null
    and a.Proceso_de_Compra != 'N/A'
    and not exists (select 1 from MapaInversionesCali.dbo.Contratistas b
                    where b.ocid = a.Proceso_de_Compra
                    and b.I = a.ID_Contrato);

    
    update a
    set a.IdContratista = b.identificador_proveedor_secop
    from MapaInversionesCali.[dbo].[Contratistas] a
    join stg_cali_contratos b on b.id_contrato = a.I
    where a.IdContratista = '0' or a.IdContratista = 'No Definido'
