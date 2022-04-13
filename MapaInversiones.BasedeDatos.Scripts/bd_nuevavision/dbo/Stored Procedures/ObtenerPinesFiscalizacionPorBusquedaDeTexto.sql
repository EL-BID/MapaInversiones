-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 09 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerPinesFiscalizacionPorBusquedaDeTexto]
@TextoBusqueda VARCHAR(200),
@periodosList varchar(300)
AS
BEGIN	


SET @TextoBusqueda = LTRIM(RTRIM(@TextoBusqueda))
SET @TextoBusqueda = '%' + @TextoBusqueda + '%'
SET @periodosList = @periodosList + ','	

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
				, ente.NombreRegion + ' ' +ente.NombreDepartamento + ' ' + ente.NombreMunicipio + ' ' + recurso.NombreRecursoNatural AS TextoCompuesto	
				--, UPPER(recurso.NombreRecursoNatural) AS NombreRecurso
				,  '--' AS NombreRecurso
				, prod.AñoLiquidado AS AñoFiscalizacion 
				, COUNT(DISTINCT prod.IdFiscalizacionSurrogada) AS Fiscalizaciones
			FROM Fiscalizacion(nolock) prod
				INNER JOIN EnteTerritorial(nolock) ente ON prod.IdMunicipio = ente.IdMunicipio
				INNER JOIN RecursoNatural(nolock) recurso ON prod.IdRecursoNatural = recurso.IdRecursoNatural AND prod.IdTipoRecursoNatural = recurso.IdTipoRecursoNatural				
				INNER JOIN CabeceraMunicipio (nolock) cab ON prod.IdMunicipio = cab.CodigoDane
			WHERE ente.NombreRegion COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreDepartamento COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreMunicipio COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				OR recurso.NombreRecursoNatural COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				AND CHARINDEX( CONVERT(varchar(4), prod.AñoLiquidado) + ',' , @periodosList) > 0				
			GROUP BY 
				ente.IdRegion,	
				ente.IdDepartamento,	
				ente.IdMunicipio
				, cab.Latitud 
                , cab.LONGITUD
				, ente.NombreRegion,
				ente.NombreDepartamento,
				ente.NombreMunicipio
				, recurso.IdRecursoNatural
				, recurso.NombreRecursoNatural
				, AñoLiquidado

END


