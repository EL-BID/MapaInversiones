MERGE INTO MapaInversionesCali.consulta.CatalogoLineaPresupuestal AS target
USING (
    SELECT [CodigoNegocio]
            ,[CodigoNegocioTransaccional]
            ,[Origen]
            ,[Periodo]
            ,[CodigoSeccion]
            ,[Seccion]
            ,[CodigoInstitucion]
            ,[CodigoPrograma]
            ,[Programa]
            ,[CodigoProducto]
            ,[Producto]
            ,[CodigoProyecto]
            ,[Proyecto]
            ,[CodigoActividadObra]
            ,[NombreActividadObra]
            ,[DescripcionActividadObra]
            ,[CodigoOrganismoFinanciador]
            ,[CodigoFuenteFinanciamiento]
            ,[CodigoFuenteEspecifica]
            ,[FuenteEspecifica]
            ,[CodigoFinalidad]
            ,[Finalidad]
            ,[IdSector]
            ,[CodigoSubFuncion]
            ,[SubFuncion]
            ,[CodigoAuxiliar]
            ,[CodigoEconTipo]
            ,[EconTipo]
            ,[CodigoEconTitulo]
            ,[EconTitulo]
            ,[CodigoEconSubTitulo]
            ,[EconSubTitulo]
            ,[CodigoEconGrupo]
            ,[EconGrupo]
            ,[IdFondo]
            ,[IdAreaFuncional]
        FROM [dbo].[ValidosLineaPresupuestal]
    ) AS source
ON target.[CodigoNegocio] = source.[CodigoNegocio] and target.[Periodo] = source.[Periodo]

WHEN MATCHED THEN
    UPDATE SET 
        target.[CodigoNegocioTransaccional] = source.[CodigoNegocioTransaccional],		
        target.[Origen] = source.[Origen],
        target.[CodigoSeccion] = source.[CodigoSeccion],
        target.[Seccion] = source.[Seccion],
        target.[CodigoInstitucion] = source.[CodigoInstitucion],
        target.[CodigoPrograma] = source.[CodigoPrograma],
        target.[Programa] = source.[Programa],
        target.[CodigoProducto] = source.[CodigoProducto],
        target.[Producto] = source.[Producto],
        target.[CodigoProyecto] = source.[CodigoProyecto],
        target.[Proyecto] = source.[Proyecto],
        target.[CodigoActividadObra] = source.[CodigoActividadObra],
        target.[NombreActividadObra] = source.[NombreActividadObra],
        target.[DescripcionActividadObra] = source.[DescripcionActividadObra],
        target.[CodigoOrganismoFinanciador] = source.[CodigoOrganismoFinanciador],
        target.[CodigoFuenteFinanciamiento] = source.[CodigoFuenteFinanciamiento],
        target.[CodigoFuenteEspecifica] = source.[CodigoFuenteEspecifica],
        target.[FuenteEspecifica] = source.[FuenteEspecifica],
        target.[CodigoFinalidad] = source.[CodigoFinalidad],
        target.[Finalidad] = source.[Finalidad],
        target.[IdSector] = source.[IdSector],
        target.[CodigoSubFuncion] = source.[CodigoSubFuncion],
        target.[SubFuncion] = source.[SubFuncion],
        target.[CodigoAuxiliar] = source.[CodigoAuxiliar],
        target.[CodigoEconTipo] = source.[CodigoEconTipo],
        target.[EconTipo] = source.[EconTipo],
        target.[CodigoEconTitulo] = source.[CodigoEconTitulo],
        target.[EconTitulo] = source.[EconTitulo],
        target.[CodigoEconSubTitulo] = source.[CodigoEconSubTitulo],
        target.[EconSubTitulo] = source.[EconSubTitulo],
        target.[CodigoEconGrupo] = source.[CodigoEconGrupo],
        target.[EconGrupo] = source.[EconGrupo],
        target.[IdFondo] = source.[IdFondo],
        target.[IdAreaFuncional] = source.[IdAreaFuncional]

WHEN NOT MATCHED THEN
    INSERT ([CodigoNegocio]
            ,[CodigoNegocioTransaccional]
            ,[Origen]
            ,[Periodo]
            ,[CodigoSeccion]
            ,[Seccion]
            ,[CodigoInstitucion]
            ,[CodigoPrograma]
            ,[Programa]
            ,[CodigoProducto]
            ,[Producto]
            ,[CodigoProyecto]
            ,[Proyecto]
            ,[CodigoActividadObra]
            ,[NombreActividadObra]
            ,[DescripcionActividadObra]
            ,[CodigoOrganismoFinanciador]
            ,[CodigoFuenteFinanciamiento]
            ,[CodigoFuenteEspecifica]
            ,[FuenteEspecifica]
            ,[CodigoFinalidad]
            ,[Finalidad]
            ,[IdSector]
            ,[CodigoSubFuncion]
            ,[SubFuncion]
            ,[CodigoAuxiliar]
            ,[CodigoEconTipo]
            ,[EconTipo]
            ,[CodigoEconTitulo]
            ,[EconTitulo]
            ,[CodigoEconSubTitulo]
            ,[EconSubTitulo]
            ,[CodigoEconGrupo]
            ,[EconGrupo]
            ,[IdFondo]
            ,[IdAreaFuncional])
    VALUES (source.[CodigoNegocio]
            ,source.[CodigoNegocioTransaccional]
            ,source.[Origen]
            ,source.[Periodo]
            ,source.[CodigoSeccion]
            ,source.[Seccion]
            ,source.[CodigoInstitucion]
            ,source.[CodigoPrograma]
            ,source.[Programa]
            ,source.[CodigoProducto]
            ,source.[Producto]
            ,source.[CodigoProyecto]
            ,source.[Proyecto]
            ,source.[CodigoActividadObra]
            ,source.[NombreActividadObra]
            ,source.[DescripcionActividadObra]
            ,source.[CodigoOrganismoFinanciador]
            ,source.[CodigoFuenteFinanciamiento]
            ,source.[CodigoFuenteEspecifica]
            ,source.[FuenteEspecifica]
            ,source.[CodigoFinalidad]
            ,source.[Finalidad]
            ,source.[IdSector]
            ,source.[CodigoSubFuncion]
            ,source.[SubFuncion]
            ,source.[CodigoAuxiliar]
            ,source.[CodigoEconTipo]
            ,source.[EconTipo]
            ,source.[CodigoEconTitulo]
            ,source.[EconTitulo]
            ,source.[CodigoEconSubTitulo]
            ,source.[EconSubTitulo]
            ,source.[CodigoEconGrupo]
            ,source.[EconGrupo]
            ,source.[IdFondo]
            ,source.[IdAreaFuncional]);