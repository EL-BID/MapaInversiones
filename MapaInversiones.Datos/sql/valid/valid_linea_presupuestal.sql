TRUNCATE TABLE [dbo].[ValidosLineaPresupuestal]

INSERT INTO [dbo].[ValidosLineaPresupuestal]
            ([CodigoNegocio]
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
select distinct
    CONCAT(a.centro_gestor,a.fondo,area_funcional, a.programa_presupuestal,a.Pospre)
    ,CONCAT(a.centro_gestor,a.fondo,area_funcional, a.programa_presupuestal,a.Pospre)
    ,a.Origen
    ,substring(a.Periodo,1,4)
    ,a.Reto
    ,a.nombre_reto
    ,a.centro_gestor
    ,a.programa
    ,a.nombre_programa
    ,a.producto_cuipo
    ,b.Producto
    ,convert(float,a.BPIN)
    ,a.nombre_proyecto
    ,a.Programa
    ,a.nombre_actividad
    ,a.nombre_actividad
    ,-1
    ,-1
    ,-1
    ,'No Definido'
    ,a.proposito
    ,a.nombre_proposito
    ,a.SECTOR
    ,-1
    ,'No Definido'
    ,a.Fondo
    ,-1
    ,'No Definido'
    ,-1
    ,'No Definido'
    ,-1
    ,'No Definido'
    ,-1
    ,'No Definido'
    ,fondo.IdFondo
    ,AreaFuncional.IdAreaFuncional
from dbo.stg_cali_cuipo a
LEFT JOIN (select distinct codigo_del_producto, Producto from [dbo].[stg_cali_catalogo_productos]) b on b.codigo_del_producto = a.producto_cuipo
LEFT JOIN MapaInversionesCali.consulta.CatalogoFondo fondo on (fondo.codigofondo = a.fondo)
LEFT JOIN MapaInversionesCali.consulta.CatalogoAreaFuncional AreaFuncional on (AreaFuncional.CodigoAreaFuncional = a.area_funcional)
where a.SECTOR != 0;