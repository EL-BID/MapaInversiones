-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene el monto aprobado por periodo de tiempo para la region seleccionada 
-- =============================================
CREATE PROCEDURE [dbo].[sp_AprobadoPorFuenteFinanciacionPorRegion] 
	@Periodos varchar(MAX),
	@IdRegion varchar(10)
AS
BEGIN
	SET NOCOUNT ON;

	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos	

	SELECT  	
		PER.Periodo AS Periodo,
		F.IdTipoRecurso, 
		F.NombreTipoRecurso, 
		CONVERT(DECIMAL(18,0),SUM(efpInterno.ValorAprobado)) AS ValorMonto
	FROM
		EsquemaFinanciacionProyecto(nolock) efpInterno 
		INNER JOIN				
			(select distinct proy.IdProyecto
				from VwProyectosAprobados(nolock) as proy
				,#Periodos PER
				where  Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto)	
				) AS lstAprobados ON efpInterno.IdProyecto = lstAprobados.IdProyecto
		INNER JOIN dbo.Fuente F ON (efpInterno.IdTipoRecurso = F.IdTipoRecurso AND efpInterno.IdTipoEntidad = F.IdTipoEntidad AND efpInterno.IdEntidad = F.IdEntidad AND F.EsFuenteRegalias = 1)
		,#Periodos PER
	WHERE CHARINDEX( CONVERT(varchar(4),DATEPART( year, efpInterno.FechaInicioVigencia )) + ',' , @Periodos + ',') > 0			
		AND (efpInterno.IdDepartamento IN (SELECT DISTINCT IdDepartamento FROM EnteTerritorial (nolock) WHERE IdRegion = @IdRegion ) OR @IdRegion IS NULL)		
	GROUP BY PER.Periodo,F.IdTipoRecurso, F.NombreTipoRecurso

	DROP TABLE #Periodos
END



