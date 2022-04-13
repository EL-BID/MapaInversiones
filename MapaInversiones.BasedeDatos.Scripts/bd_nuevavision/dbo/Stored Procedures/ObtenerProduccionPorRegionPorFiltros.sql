-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 02 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerProduccionPorRegionPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdRecurso AS VARCHAR(10),
@IdCampoOMina AS NVARCHAR(50),
@periodosList varchar(300),
@CuadradoVisualIntersectar geography
AS
BEGIN		

	select  Interna.IdEntidad AS IdEntidad,
Interna.NombreEntidad AS NombreEntidad,
'/Produccion/FichaProduccion?periodosProduccion='+ @periodosList + '&region=' + Interna.IdEntidad AS Url,
 Interna.NombreRecurso AS NombreRecurso
,Cantidad AS Cantidad
, UnidadDeMedida AS UnidadDeMedida

FROM
(
SELECT ente.IdRegion AS IdEntidad,
		ente.NombreRegion AS NombreEntidad
--ente.IdMunicipio AS idMunDpto
, UPPER(recurso.NombreRecursoNatural) AS NombreRecurso,
CONVERT(DECIMAL(18,0), SUM(ISNULL(prod.Produccion,0))) AS Cantidad,
unidad.NombreUnidadMedida AS UnidadDeMedida
FROM EnteTerritorial(nolock) ente 
LEFT JOIN Produccion(nolock) prod ON prod.IdMunicipio = ente.IdMunicipio
LEFT JOIN RecursoNatural(nolock) recurso ON prod.IdRecursoNatural = recurso.IdRecursoNatural AND prod.IdTipoRecursoNatural = recurso.IdTipoRecursoNatural
LEFT JOIN UnidadMedida(nolock) unidad ON prod.IdUnidadMedida = unidad.IdUnidadMedida
--LEFT JOIN CabeceraMunicipio (nolock) cab ON prod.IdMunicipio = cab.CodigoDane
	WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			--AND (prod.IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')
			AND (prod.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina = '' OR @IdCampoOMina IS NULL OR prod.IdCampoOProyecto IS NULL )
			AND ( CHARINDEX( CONVERT(varchar(4), prod.AñoLiquidado) + ',' , @periodosList + ',') > 0 OR prod.AñoLiquidado IS NULL )
			--AND (@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL OR PuntoUbicacion IS NULL) 	
			AND  ente.IdDepartamento <> '0'	
			AND ente.NombreDepartamento <> 'N/A'	
			--AND prod.IdTipoDeContraprestacion = 1 --Regalias		
			
GROUP BY 
		ente.IdRegion ,
		ente.NombreRegion ,
		ente.IdRegion ,
		recurso.NombreRecursoNatural ,
		unidad.NombreUnidadMedida 
) AS Interna
LEFT JOIN CabeceraMunicipio (nolock) cab ON cab.DEPARTAMENTO= Interna.NombreEntidad
WHERE 
--cab.MUNICIPIO = 'N/A' --CabDptos
--AND 
(@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL OR PuntoUbicacion IS NULL)
ORDER BY NombreEntidad 

	--SELECT CAST((2012) AS INT) AS PeriodoPresupuestado	
	--, CAST('01' AS VARCHAR(10)) AS IdRegion
	--, CAST('Test' AS VARCHAR(200)) AS NombreRegion
 --   , CONVERT(decimal(30,2),100 ) AS ValorPresupuesto


END



