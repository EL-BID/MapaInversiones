-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Junio 21 de 2013>
-- Description:	<Procedimiento para Obtener el listado de pushpin de recursos por nombre>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerPushPinPorTipoRecursoPorNombre]
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

	SET @NombreRecurso = LTRIM(RTRIM(@NombreRecurso))
	SET @NombreRecurso = '%' + @NombreRecurso + '%'
		

	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @periodosList	

	SELECT top 1500
		TextoBusqueda	
		,CASE cab.MUNICIPIO
					 WHEN 'N/A' THEN SUBSTRING(IdMunicipio,1,2)       
					 ELSE IdMunicipio
				  END AS IdMunicipio
		 , Latitud
		 , LONGITUD			 
		 , CASE cab.MUNICIPIO
					 WHEN 'N/A' THEN 'departamento'        
					 ELSE 'municipio'
		 END AS TipoEntidad
		 , NombreTipoRecurso
		 , ValorPresupuestado
		 , ValorAprobado
	FROM
	(
			SELECT 
				CASE WHEN EsquemaPptal.TextoBusqueda IS NULL THEN EsquemaAprobados.TextoBusqueda 
					ELSE EsquemaPptal.TextoBusqueda 
				END AS TextoBusqueda
				, CASE WHEN EsquemaPptal.IdMunicipio IS NULL THEN EsquemaAprobados.IdMunicipio 
					ELSE EsquemaPptal.IdMunicipio 
				END AS IdMunicipio
				, CASE WHEN EsquemaPptal.NombreTipoRecurso IS NULL THEN EsquemaAprobados.NombreTipoRecurso 
					ELSE EsquemaPptal.NombreTipoRecurso 
				END AS NombreTipoRecurso
				, CONVERT(decimal(18,0),(ISNULL(ValorPresupuestado,0))) AS ValorPresupuestado
				, CONVERT(decimal(18,0),(ISNULL(ValorAprobado,0))) AS ValorAprobado
				FROM
						(
							SELECT pptoInner.IdMunicipio								
								, fteInner.NombreTipoRecurso
								, NombreTipoRecurso + ' ' + NombreTipoEntidad + ' ' + fteInner.NombreEntidad AS TextoBusqueda
								, CONVERT(decimal(18,0),SUM(ISNULL(ValorMonto,0))) AS ValorPresupuestado
							FROM Presupuesto pptoInner
							INNER JOIN fuente fteInner ON fteInner.IdTipoRecurso = pptoInner.IdTipoRecurso AND fteInner.IdTipoEntidad = pptoInner.IdTipoEntidad AND fteInner.IdEntidad = pptoInner.IdEntidad AND fteInner.EsFuenteRegalias = 1
							WHERE ( fteInner.NombreTipoRecurso COLLATE Latin1_General_CI_AI LIKE @NombreRecurso 
																			OR NombreTipoEntidad  COLLATE Latin1_General_CI_AI LIKE @NombreRecurso 
																			OR fteInner.NombreEntidad COLLATE Latin1_General_CI_AI LIKE @NombreRecurso
							  )
							 AND (fteInner.IdTipoRecurso = @IdTipoRecurso OR @IdTipoRecurso = 0 OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = -1)
							 AND (pptoInner.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
							 AND (pptoInner.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
							 AND (CHARINDEX( CONVERT(varchar(4),DATEPART( year, pptoInner.InicioVigencia )) + ',' , @periodosList + ',') > 0
														OR CHARINDEX( CONVERT(varchar(4),DATEPART( year, pptoInner.FinVigencia )) + ',' , @periodosList + ',') > 0								
													)
								GROUP BY pptoInner.IdMunicipio, 
								fteInner.IdTipoRecurso, 
								fteInner.NombreTipoRecurso, 
								fteInner.IdTipoEntidad, 
								fteInner.NombreTipoEntidad, 
								fteInner.IdEntidad
								,fteInner.NombreEntidad
						) AS EsquemaPptal

			FULL OUTER JOIN 
						(
							SELECT efpInterno.IdMunicipio								
								, F.NombreTipoRecurso
								, NombreTipoRecurso + ' ' + NombreTipoEntidad + ' ' + F.NombreEntidad AS TextoBusqueda
								, CONVERT(decimal(18,0),SUM(ISNULL(efpInterno.ValorAprobado,0))) AS ValorAprobado
							FROM		(
											select distinct proy.IdProyecto
												from VwProyectosAprobados(nolock) as proy
												,#Periodos PER
												where  Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto)							
										) AS lstAprobados				
										INNER JOIN EsquemaFinanciacionProyecto(nolock) efpInterno  ON efpInterno.IdProyecto = lstAprobados.IdProyecto 
										INNER JOIN dbo.Fuente(nolock) F ON (efpInterno.IdTipoRecurso = F.IdTipoRecurso AND efpInterno.IdTipoEntidad = F.IdTipoEntidad AND efpInterno.IdEntidad = F.IdEntidad AND F.EsFuenteRegalias = 1)		
										WHERE  ( F.NombreTipoRecurso COLLATE Latin1_General_CI_AI LIKE @NombreRecurso 
															OR NombreTipoEntidad  COLLATE Latin1_General_CI_AI LIKE @NombreRecurso 
															OR F.NombreEntidad COLLATE Latin1_General_CI_AI LIKE @NombreRecurso
												) 
										AND CHARINDEX( CONVERT(varchar(4),DATEPART( year, efpInterno.FechaInicioVigencia )) + ',' , @periodosList + ',') > 0			
											AND (efpInterno.IdTipoRecurso = @IdTipoRecurso OR @IdTipoRecurso = 0 OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = -1)
											AND (efpInterno.IdMunicipio = @IdMunicipio OR @IdMunicipio IS NULL)	
											AND (efpInterno.IdDepartamento = @IdDpto OR @IdDpto IS NULL)
											AND (efpInterno.IdDepartamento IN (SELECT DISTINCT IdDepartamento FROM EnteTerritorial (nolock) WHERE IdRegion = @IdRegion ) OR @IdRegion IS NULL)	
											AND efpInterno.IdDepartamento <> 0 --Otros fondos sin ente territorial
										GROUP BY efpInterno.IdMunicipio 
											, F.IdTipoRecurso
											, F.NombreTipoRecurso
											, F.IdTipoEntidad
											, F.NombreTipoEntidad
											, F.IdEntidad
											, F.NombreEntidad
					) AS EsquemaAprobados 
					ON (
						EsquemaAprobados.TextoBusqueda = EsquemaPptal.TextoBusqueda			
						AND EsquemaAprobados.IdMunicipio = EsquemaPptal.IdMunicipio
					)
				) AS QxCruzada
				INNER JOIN CabeceraMunicipio (nolock) cab ON QxCruzada.IdMunicipio = cab.CodigoDane
				WHERE ValorPresupuestado <> 0 OR ValorAprobado <> 0	

	DROP TABLE #Periodos




END




