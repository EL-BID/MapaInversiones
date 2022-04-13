-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 09 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerPinesFiscalizacionPorBusquedaDeTextoV2]
@TextoBusqueda VARCHAR(200),
@AñoLiquidado INT
AS
BEGIN	


SET @TextoBusqueda = LTRIM(RTRIM(@TextoBusqueda))
SET @TextoBusqueda = '%' + @TextoBusqueda + '%'


		SELECT 
				CASE WHEN ente.NombreMunicipio LIKE @TextoBusqueda THEN ente.IdMunicipio
						ELSE ente.IdRegion
					END AS  IdRegion				
				, CASE WHEN ente.NombreMunicipio LIKE @TextoBusqueda THEN ente.IdMunicipio
						ELSE ente.IdDepartamento
					END AS  IdDepartamento			
				, ente.IdMunicipio
				, cab.Latitud  AS Latitud
                , cab.LONGITUD AS Longitud
				, CASE WHEN ente.NombreMunicipio LIKE @TextoBusqueda THEN ente.NombreMunicipio
						ELSE ente.NombreRegion
					END AS  NombreRegion			
				, CASE WHEN ente.NombreMunicipio LIKE @TextoBusqueda THEN ente.NombreMunicipio
						ELSE ente.NombreDepartamento
					END AS  NombreDepartamento			
				, ente.NombreMunicipio	 
				, ente.NombreRegion + ' ' +ente.NombreDepartamento + ' ' + ente.NombreMunicipio + ' ' AS TextoCompuesto					
				, SUM(TotalCamposMinas) AS TotalCamposMinas
				, SUM(TotalFiscalizaciones) AS TotalFiscalizaciones

FROM 
	(
		SELECT IdRegion, IdDepartamento, IdMunicipio, NombreMunicipio, NombreDepartamento, NombreRegion FROM EnteTerritorial WHERE Tipo = 'MUNICIPIO' AND  IdDepartamento <> '0' AND NombreDepartamento <> 'N/A'
	) ente
	LEFT JOIN 
	(
		SELECT ente.IdMunicipio, 
			COUNT(DISTINCT fisca.IdCampoOProyecto) AS TotalCamposMinas 
			FROM Fiscalizacion(nolock) fisca
			INNER JOIN RecursoNaturalFiscalizacion(nolock) recurso ON recurso.IdTipoRecursoNatural = fisca.IdTipoRecursoNatural AND recurso.IdRecursoNatural = fisca.IdRecursoNatural 
			INNER JOIN EnteTerritorial(nolock) ente ON ente.IdMunicipio = fisca.IdMunicipio
			INNER JOIN CampoOProyectoFiscalizacion(nolock) Campo ON Campo.IdCampoOProyecto = fisca.IdCampoOProyecto AND Campo.IdTipoCampoOProyecto = fisca.IdTipoCampoOProyecto
 		WHERE AñoLiquidado = @AñoLiquidado
				AND
				(ente.NombreRegion COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreDepartamento COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreMunicipio COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				OR recurso.NombreRecursoNatural COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				OR Campo.NombreCampoOProyecto COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				)			
		GROUP BY ente.IdMunicipio
	) CamposTotales ON CamposTotales.IdMunicipio = ente.IdMunicipio 
	INNER JOIN 
	(
		SELECT ente.IdMunicipio, 		
			COUNT(DISTINCT fisca.IdCampoOProyecto) AS TotalFiscalizaciones 
			FROM Fiscalizacion(nolock) fisca
			INNER JOIN RecursoNaturalFiscalizacion(nolock) recurso ON recurso.IdTipoRecursoNatural = fisca.IdTipoRecursoNatural AND recurso.IdRecursoNatural = fisca.IdRecursoNatural 
			INNER JOIN EnteTerritorial(nolock) ente ON ente.IdMunicipio = fisca.IdMunicipio
			INNER JOIN CampoOProyectoFiscalizacion(nolock) Campo ON Campo.IdCampoOProyecto = fisca.IdCampoOProyecto AND Campo.IdTipoCampoOProyecto = fisca.IdTipoCampoOProyecto
		WHERE AñoLiquidado = @AñoLiquidado 
			AND IdTipoActividad IS NOT NULL 
			AND
				(ente.NombreRegion COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreDepartamento COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreMunicipio COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				OR recurso.NombreRecursoNatural COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				OR Campo.NombreCampoOProyecto COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				)
		GROUP BY ente.IdMunicipio
	) CamposFiscalizados ON CamposFiscalizados.IdMunicipio = CamposTotales.IdMunicipio
	LEFT JOIN CabeceraMunicipio (nolock) cab ON ente.IdMunicipio = cab.CodigoDane	
	GROUP BY 
				ente.IdRegion,	
				ente.IdDepartamento,	
				ente.IdMunicipio
				, cab.Latitud 
                , cab.LONGITUD
				, ente.NombreRegion,
				ente.NombreDepartamento,
			    ente.NombreMunicipio

END


