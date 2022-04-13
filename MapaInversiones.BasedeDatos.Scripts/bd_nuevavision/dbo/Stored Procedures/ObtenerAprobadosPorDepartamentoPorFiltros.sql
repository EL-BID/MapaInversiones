-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Mayo 28 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerAprobadosPorDepartamentoPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdTipoRecurso AS INT,
@periodosList varchar(300)	
AS
BEGIN

			
	SET NOCOUNT ON

	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @periodosList	

	SELECT  
		1900 AS PeriodoAprobado
		, Ente.IdDepartamento AS IdDepartamento
		, Ente.NombreDepartamento AS NombreDepartamento
		, CONVERT(DECIMAL(18,0),SUM(efpInterno.ValorAprobado)) AS ValorAprobado
		, 0 AS CantidadProyectos	
		--, COUNT(DISTINCT(lstAprobados.IdProyecto)) AS CantidadProyectos		
	FROM					
		(
			select distinct proy.IdProyecto
				from VwProyectosAprobados(nolock) as proy
				,#Periodos PER
				where  Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto)					
		) AS lstAprobados				
		INNER JOIN EsquemaFinanciacionProyecto(nolock) efpInterno  ON efpInterno.IdProyecto = lstAprobados.IdProyecto 
		INNER JOIN dbo.Fuente(nolock) F ON (efpInterno.IdTipoRecurso = F.IdTipoRecurso AND efpInterno.IdTipoEntidad = F.IdTipoEntidad AND efpInterno.IdEntidad = F.IdEntidad AND F.EsFuenteRegalias = 1)		
		INNER JOIN dbo.EnteTerritorial(nolock) Ente ON (efpInterno.IdDepartamento = Ente.IdDepartamento and efpInterno.IdMunicipio = Ente.IdMunicipio )	
		WHERE CHARINDEX( CONVERT(varchar(4),DATEPART( year, efpInterno.FechaInicioVigencia )) + ',' , @periodosList + ',') > 0			
			AND (efpInterno.IdMunicipio = @IdMunicipio OR @IdMunicipio IS NULL)	
			AND (efpInterno.IdDepartamento = @IdDpto OR @IdDpto IS NULL)
			AND (efpInterno.IdDepartamento IN (SELECT DISTINCT IdDepartamento FROM EnteTerritorial (nolock) WHERE IdRegion = @IdRegion ) OR @IdRegion IS NULL)	
			AND efpInterno.IdDepartamento <> 0 --Otros fondos sin ente territorial
		GROUP BY 
		Ente.IdDepartamento 
		, Ente.NombreDepartamento

DROP TABLE #Periodos

END
