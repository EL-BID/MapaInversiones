-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 08 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerProduccionPorBusquedaDeTexto]
@TextoBusqueda VARCHAR(200),
@periodosList varchar(300)
AS
BEGIN	


SET @TextoBusqueda = LTRIM(RTRIM(@TextoBusqueda))
SET @TextoBusqueda = '%' + @TextoBusqueda + '%'
SET @periodosList = @periodosList + ','	

			SELECT 
				ente.IdRegion
				, ente.IdDepartamento 
				, ente.IdMunicipio
				, ente.NombreRegion
				, ente.NombreDepartamento
				, ente.NombreMunicipio	 
				, ente.NombreRegion + ' ' +ente.NombreDepartamento + ' ' + ente.NombreMunicipio + ' ' + recurso.NombreRecursoNatural AS TextoCompuesto	
				,  UPPER(recurso.NombreRecursoNatural) AS NombreRecurso
				, SUM(ISNULL(prod.Produccion,0)) AS Cantidad
				, unidad.NombreUnidadMedida AS UnidadDeMedida
			FROM Produccion(nolock) prod
				LEFT JOIN EnteTerritorial(nolock) ente ON prod.IdMunicipio = ente.IdMunicipio
				LEFT JOIN RecursoNatural(nolock) recurso ON prod.IdRecursoNatural = recurso.IdRecursoNatural AND prod.IdTipoRecursoNatural = recurso.IdTipoRecursoNatural
				LEFT JOIN UnidadMedida(nolock) unidad ON prod.IdUnidadMedida = unidad.IdUnidadMedida
			WHERE ente.NombreRegion COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreDepartamento COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda 
				OR ente.NombreMunicipio COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				OR recurso.NombreRecursoNatural COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda
				AND CHARINDEX( CONVERT(varchar(4), prod.AñoLiquidado) + ',' , @periodosList) > 0
				--AND prod.IdTipoDeContraprestacion = 1 --Regalias
			GROUP BY 
				ente.IdRegion,	
				ente.IdDepartamento,	
				ente.IdMunicipio ,	
				ente.NombreRegion,
				ente.NombreDepartamento,
				ente.NombreMunicipio ,	
				recurso.NombreRecursoNatural ,
				unidad.NombreUnidadMedida 
	

END



