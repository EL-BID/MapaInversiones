-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 08 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[SPOINT_ObtenerProyectosPorFiltros]
@CodigosProyectosI AS VARCHAR(MAX),
@filtroNombre AS VARCHAR(MAX),
@BPINE AS VARCHAR(50),
@EntidadTerritorial AS VARCHAR(10)

AS
BEGIN	

	DECLARE @query VARCHAR(MAX)
	IF(@CodigosProyectosI IS NULL)
		SET @CodigosProyectosI = ''
	IF(@filtroNombre IS NULL)
		SET @filtroNombre = ''
	IF(@BPINE IS NULL)
		SET @BPINE = ''
	SET @CodigosProyectosI = ',' + @CodigosProyectosI

	IF(@EntidadTerritorial <> '')
		BEGIN
			SET @filtroNombre = N'WHERE NombreMunicipio COLLATE Latin1_General_CI_AI  LIKE ''%' + @EntidadTerritorial + '%'''
							+ ' OR NombreDepartamento COLLATE Latin1_General_CI_AI  LIKE ''%' + @EntidadTerritorial + '%'''
							+ ' OR NombreRegion COLLATE Latin1_General_CI_AI  LIKE ''%' + @EntidadTerritorial + '%'''
		END						

																																																																				SET @query = N'
		DECLARE @CodigosProyectos VARCHAR(MAX)
		DECLARE @BPIN VARCHAR(50)
		SET @CodigosProyectos = ''' + @CodigosProyectosI + ''''
		+'
		SET @BPIN = ''' + @BPINE + ''''
		+
		'
		SELECT DISTINCT
			lstDetalle.IdProyecto
			, lstDetalle.CodigoBPIN 
			, lstDetalle.NombreProyecto
			, stuff((SELECT distinct '''+',' +''' + cast(NombreMunicipio as varchar(200))
				FROM 
				(
					SELECT DISTINCT proy.IdProyecto				
						, ente.NombreMunicipio				
					FROM Proyecto(nolock) proy
					INNER JOIN ProyectoXEntidadTerritorial(nolock) pxe ON proy.IdProyecto = pxe.IdProyecto
					INNER JOIN EnteTerritorial(nolock) ente ON pxe.IdMunicipio = ente.IdMunicipio
					WHERE (CHARINDEX( '','' + CONVERT(VARCHAR(30), proy.IdProyecto ) , @CodigosProyectos ) > 0 OR @CodigosProyectos IS NULL OR @CodigosProyectos = '''')
						AND (proy.CodigoBPIN = @BPIN  OR @BPIN = '''')
				) AS t2          
				   where t2.IdProyecto = lstDetalle.IdProyecto
				   FOR XML PATH('''')),1,1,'''') AS NombreMunicipio
			, stuff((SELECT distinct '''+',' +''' + cast(NombreDepartamento as varchar(200))
				FROM 
				(
					SELECT DISTINCT proy.IdProyecto				
						, ente.NombreDepartamento				
					FROM Proyecto(nolock) proy
					INNER JOIN ProyectoXEntidadTerritorial(nolock) pxe ON proy.IdProyecto = pxe.IdProyecto
					INNER JOIN EnteTerritorial(nolock) ente ON pxe.IdMunicipio = ente.IdMunicipio
					WHERE (CHARINDEX( '','' + CONVERT(VARCHAR(30), proy.IdProyecto ) , @CodigosProyectos ) > 0 OR @CodigosProyectos IS NULL OR @CodigosProyectos = '''')
						AND (proy.CodigoBPIN = @BPIN  OR @BPIN = '''')
				) AS t2          
				   where t2.IdProyecto = lstDetalle.IdProyecto
				   FOR XML PATH('''')),1,1,'''') AS NombreDepartamento
			, stuff((SELECT distinct '''+',' +''' + cast(NombreRegion as varchar(200))
				FROM 
				(
					SELECT DISTINCT proy.IdProyecto				
						, ente.NombreRegion				
					FROM Proyecto(nolock) proy
					INNER JOIN ProyectoXEntidadTerritorial(nolock) pxe ON proy.IdProyecto = pxe.IdProyecto
					INNER JOIN EnteTerritorial(nolock) ente ON pxe.IdMunicipio = ente.IdMunicipio
					WHERE (CHARINDEX( '','' + CONVERT(VARCHAR(30), proy.IdProyecto ) , @CodigosProyectos ) > 0 OR @CodigosProyectos IS NULL OR @CodigosProyectos = '''')
						AND (proy.CodigoBPIN = @BPIN  OR @BPIN = '''')
				) AS t2          
				   where t2.IdProyecto = lstDetalle.IdProyecto
				   FOR XML PATH('''')),1,1,'''') AS NombreRegion
	
		FROM 
		(
			SELECT proy.IdProyecto
				, proy.CodigoBPIN 
				, proy.NombreProyecto
				, pxe.IdMunicipio	
				, ente.NombreMunicipio	
				, ente.NombreDepartamento	
				, ente.NombreRegion				
			FROM Proyecto proy
			INNER JOIN ProyectoXEntidadTerritorial pxe ON proy.IdProyecto = pxe.IdProyecto
			INNER JOIN EnteTerritorial(nolock) ente ON pxe.IdMunicipio = ente.IdMunicipio			
			WHERE (CHARINDEX( '','' + CONVERT(VARCHAR(30), proy.IdProyecto ) , @CodigosProyectos ) > 0 OR @CodigosProyectos IS NULL OR @CodigosProyectos = '''')
				AND (proy.CodigoBPIN = @BPIN  OR @BPIN = '''')
		) AS lstDetalle
			'

	SET @query = @query + @filtroNombre + ' GROUP BY lstDetalle.IdProyecto
			, lstDetalle.CodigoBPIN 
			, lstDetalle.NombreProyecto ORDER BY NombreProyecto'
	PRINT @query 
	EXECUTE (@query)
	
    
	
END



