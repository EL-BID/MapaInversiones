
-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Mayo 30 de 2013>
-- Description:	<Procedimiento para Obtener el listado de pushpin de recursos junto a sus detalles de fuente>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerPushPinPorTipoRecursoPorFiltros]
@NombreRecurso AS VARCHAR(300),
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdTipoRecurso AS INT,
@periodosList varchar(300),
@CuadradoVisualIntersectar AS geography
AS
BEGIN

	
	SET NOCOUNT ON;

	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @periodosList	

DECLARE @NombreTipoRecurso AS VARCHAR(500)
	SET @NombreTipoRecurso = 'Todas las fuentes'

	SELECT TOP 1 @NombreTipoRecurso = NombreTipoRecurso FROM Fuente WHERE IdTipoRecurso = @IdTipoRecurso

	SELECT TOP 250 
	*
	FROM
	(
	
	SELECT 
			  CASE cab.MUNICIPIO
				 WHEN 'N/A' THEN Region.IdDepartamento        
				 ELSE Region.IdMunicipio
			  END AS IdMunicipio
			  , Latitud
			  , LONGITUD			 
			  , CASE cab.MUNICIPIO
				 WHEN 'N/A' THEN 'departamento'        
				 ELSE 'municipio'
			  END AS TipoEntidad
			  , @NombreTipoRecurso AS NombreTipoRecurso
			  , CONVERT(decimal(18,0),SUM(ISNULL(ppto.ValorMonto,0))) AS ValorPresupuestado
			  , CONVERT(decimal(18,0),SUM(ISNULL(EsquemaAprobados.ValorAprobado,0))) AS ValorAprobado	 
			
			FROM
			(
				SELECT ente.IdDepartamento, ente.IdMunicipio, fuente.IdTipoRecurso, SUM(ISNULL(ppto.ValorMonto,0)) AS ValorMonto
					FROM 
					(
						SElECT IdDepartamento, IdMunicipio FROM EnteTerritorial(nolock) WHERE IdMunicipio <> 0 AND TIPO<>'region'
					) AS ente 
					CROSS JOIN 
					(
						SELECT DISTINCT idtiporecurso from Fuente(nolock) where EsFuenteRegalias = 1
					) as fuente
					LEFT JOIN presupuesto(nolock) ppto ON ppto.IdMunicipio = ente.IdMunicipio AND ppto.IdTipoRecurso = fuente.IdTipoRecurso
					WHERE (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
						AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
						AND (fuente.IdTipoRecurso = @IdTipoRecurso OR @IdTipoRecurso = 0 OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = -1)
						AND (CHARINDEX( CONVERT(varchar(4),DATEPART( year, ppto.InicioVigencia )) + ',' , @periodosList + ',') > 0
								OR CHARINDEX( CONVERT(varchar(4),DATEPART( year, ppto.FinVigencia )) + ',' , @periodosList + ',') > 0
								OR ppto.InicioVigencia IS NULL
							)
					GROUP BY ente.IdDepartamento, ente.IdMunicipio, fuente.IdTipoRecurso
			) AS ppto
			LEFT JOIN dbo.EnteTerritorial(nolock) Region ON (ppto.IdDepartamento = Region.IdDepartamento  AND ppto.IdMunicipio = Region.IdMunicipio) 
			LEFT JOIN CabeceraMunicipio (nolock) cab ON ppto.IdMunicipio = cab.CodigoDane
			
			LEFT JOIN
				(
					SELECT  ente.IdDepartamento, ente.IdMunicipio, efpInterno.IdTipoRecurso, SUM(efpInterno.ValorAprobado) AS ValorAprobado		
							FROM					
								(
									select distinct proy.IdProyecto
										from VwProyectosAprobados(nolock) as proy
										,#Periodos PER
										where  Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto)							
								) AS lstAprobados				
								INNER JOIN EsquemaFinanciacionProyecto(nolock) efpInterno  ON efpInterno.IdProyecto = lstAprobados.IdProyecto 
								--INNER JOIN dbo.Fuente(nolock) F ON (efpInterno.IdTipoRecurso = F.IdTipoRecurso AND efpInterno.IdTipoEntidad = F.IdTipoEntidad AND efpInterno.IdEntidad = F.IdEntidad AND F.EsFuenteRegalias = 1)		
								INNER JOIN dbo.EnteTerritorial(nolock) Ente ON (efpInterno.IdDepartamento = Ente.IdDepartamento and efpInterno.IdMunicipio = Ente.IdMunicipio )	
								WHERE CHARINDEX( CONVERT(varchar(4),DATEPART( year, efpInterno.FechaInicioVigencia )) + ',' , @periodosList + ',') > 0			
									AND (efpInterno.IdTipoRecurso = @IdTipoRecurso OR @IdTipoRecurso = 0 OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = -1)
									AND (efpInterno.IdMunicipio = @IdMunicipio OR @IdMunicipio IS NULL)	
									AND (efpInterno.IdDepartamento = @IdDpto OR @IdDpto IS NULL)
									AND (efpInterno.IdDepartamento IN (SELECT DISTINCT IdDepartamento FROM EnteTerritorial (nolock) WHERE IdRegion = @IdRegion ) OR @IdRegion IS NULL)	
									AND efpInterno.IdDepartamento <> 0 --Otros fondos sin ente territorial
								GROUP BY 
								ente.IdDepartamento, ente.IdMunicipio, efpInterno.IdTipoRecurso
				) AS EsquemaAprobados
					ON (ppto.IdTipoRecurso = EsquemaAprobados.IdTipoRecurso AND ppto.IdMunicipio = EsquemaAprobados.IdMunicipio )	
			 		
			WHERE (Region.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
			AND (ppto.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (ppto.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			AND (ppto.IdTipoRecurso = @IdTipoRecurso OR @IdTipoRecurso = 0 OR @IdTipoRecurso = -1 OR @IdTipoRecurso IS NULL)	
			GROUP BY 
				  CASE cab.MUNICIPIO
					 WHEN 'N/A' THEN Region.IdDepartamento        
					 ELSE Region.IdMunicipio
				  END
				  , Latitud
				  , LONGITUD
				  , CASE cab.MUNICIPIO
						 WHEN 'N/A' THEN 'departamento'        
						 ELSE 'municipio'
					END

		 )
         AS QxTotal
		 WHERE QxTotal.ValorPresupuestado <> 0 OR QxTotal.ValorAprobado <> 0	 
		 ORDER BY ValorAprobado 

		DROP TABLE #Periodos

END





