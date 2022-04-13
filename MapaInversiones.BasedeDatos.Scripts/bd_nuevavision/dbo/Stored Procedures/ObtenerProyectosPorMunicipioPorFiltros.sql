-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 02 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerProyectosPorMunicipioPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdSector AS INT,
@IdOrgFinanciador AS INT,
@NombreProyecto AS VARCHAR(1000),
@periodosList varchar(300),
@IdEstado  AS INT,
@CuadradoVisualIntersectar geography
AS
BEGIN
SET NOCOUNT ON;

CREATE  TABLE #Periodos (
            Periodo INT
      );    
INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @periodosList

IF @IdEstado = 0 --Sin Filtro Estado de proyecto
	BEGIN
			SELECT 
			IdMunicipio AS IdEntidad
			, COUNT(distinct proy.IdProyecto) AS CantidadProyectos
			, SUM(proy.VlrTotalProyectoFuenteRegalias) AS VlrRegalias
			, CONVERT(decimal(30,2),0 ) AS VlrTotal --Optimizacion ya que actualmente no se usa
			--, SUM(proy.VlrTotalProyectoTodasLasFuentes) AS VlrTotal
			FROM 
			(	  
				SELECT DISTINCT IdMunicipio
								, Proy.IdProyecto
								, proy.VlrTotalProyectoFuenteRegalias
								--, proy.VlrTotalProyectoTodasLasFuentes
				  FROM VwProyectosAprobados(nolock) as proy
					  INNER JOIN ProyectoXEntidadTerritorial pxe ON pxe.IdProyecto = proy.IdProyecto
					  LEFT JOIN ProyectoOrganismoFinanciador pof ON pxe.IdProyecto = pof.IdProyecto
					 ,#Periodos PER
				  WHERE Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto) 
					  AND IdDepartamento != '0'
					  AND (IdDepartamento IN (SELECT IdDepartamento FROM EnteTerritorial WHERE  IdRegion = @IdRegion) OR @IdRegion =  '' OR @IdRegion IS NULL )
					  AND (IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
					  AND (IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
					  AND (IdSector = @IdSector OR @IdSector = ''  OR @IdSector IS NULL OR @IdSector = 0)
					  AND (IdOrganismoFinanciador = @IdOrgFinanciador OR @IdOrgFinanciador = ''  OR @IdOrgFinanciador IS NULL OR @IdOrgFinanciador = 0)		
					  AND (proy.NombreProyecto COLLATE Latin1_General_CI_AI LIKE @NombreProyecto OR @NombreProyecto = ''  OR @NombreProyecto IS NULL)	
				  GROUP BY IdMunicipio
								, Proy.IdProyecto
								, proy.VlrTotalProyectoFuenteRegalias
								--, proy.VlrTotalProyectoTodasLasFuentes
			)AS proy
			GROUP BY
				proy.IdMunicipio

	END
ELSE
	BEGIN
		SELECT 
			IdMunicipio AS IdEntidad
			, COUNT(distinct proy.IdProyecto) AS CantidadProyectos
			, SUM(proy.VlrTotalProyectoFuenteRegalias) AS VlrRegalias
			, CONVERT(decimal(30,2),0 ) AS VlrTotal --Optimizacion ya que actualmente no se usa
			--, SUM(proy.VlrTotalProyectoTodasLasFuentes) AS VlrTotal
			FROM 
			(	  
				SELECT DISTINCT IdMunicipio
								, Proy.IdProyecto
								, proy.VlrTotalProyectoFuenteRegalias
								--, proy.VlrTotalProyectoTodasLasFuentes
			
				FROM    dbo.Proyecto AS proy WITH (nolock) 
						INNER JOIN dbo.ProyectoXEntidadTerritorial AS px ON proy.IdProyecto = px.IdProyecto
					    LEFT JOIN ProyectoOrganismoFinanciador pof ON px.IdProyecto = pof.IdProyecto
						INNER JOIN dbo.HistoriaEstado AS he WITH (nolock) ON he.IdProyecto = proy.IdProyecto 
						,#Periodos PER					
				WHERE   (he.IdEstado = @IdEstado AND (he.ActualSiNo = 1))
					AND Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto) 
					AND (IdDepartamento IN (SELECT IdDepartamento FROM EnteTerritorial WHERE  IdRegion = @IdRegion) OR @IdRegion =  '' OR @IdRegion IS NULL )
					AND (IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
					AND (IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
					AND (IdSector = @IdSector OR @IdSector = ''  OR @IdSector IS NULL OR @IdSector = 0)
					AND (IdOrganismoFinanciador = @IdOrgFinanciador OR @IdOrgFinanciador = ''  OR @IdOrgFinanciador IS NULL OR @IdOrgFinanciador = 0)		
					AND (proy.NombreProyecto COLLATE Latin1_General_CI_AI LIKE @NombreProyecto OR @NombreProyecto = ''  OR @NombreProyecto IS NULL)	
				GROUP BY IdMunicipio
								, Proy.IdProyecto
								, proy.VlrTotalProyectoFuenteRegalias
								--, proy.VlrTotalProyectoTodasLasFuentes
			) AS Proy
			GROUP BY
				proy.IdMunicipio
	END
									
DROP TABLE #Periodos

--SELECT 	
--	CAST('01' AS VARCHAR(10)) AS IdEntidad
--, CAST((2012) AS INT) AS CantidadProyectos	
--, CONVERT(decimal(30,2),100 ) AS VlrRegalias
--, CONVERT(decimal(30,2),100 ) AS VlrTotal


END



 
