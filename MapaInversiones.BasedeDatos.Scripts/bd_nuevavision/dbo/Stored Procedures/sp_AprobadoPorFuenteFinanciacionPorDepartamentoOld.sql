
CREATE PROCEDURE [dbo].[sp_AprobadoPorFuenteFinanciacionPorDepartamentoOld]
	@Periodos varchar(MAX),
	@IdDepartamento varchar(10)
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
					from Proyecto(nolock) as proy join ProyectoXEntidadTerritorial as px on proy.IdProyecto = px.IdProyecto
					join EnteTerritorial(nolock) ente  on px.IdDepartamento = ente.IdDepartamento and px.IdMunicipio = ente.IdMunicipio
					join HistoriaEstado(nolock) he on he.IdProyecto = proy.IdProyecto
					join Estado(nolock) e on e.IdEstado = he.IdEstado					
					,#Periodos PER
					where  (e.NombreEstado like ('%APROBADO%') OR e.NombreEstado like ('%EJECUCI%') OR e.NombreEstado like ('%EJECUTADO%'))						
						--AND (ente.IdDepartamento = @IdDepartamento OR @IdDepartamento = '' OR @IdDepartamento IS NULL )										
						AND PER.Periodo BETWEEN DATEPART(year,proy.FechaInicioProyecto) AND DATEPART(year,proy.FechaFinProyecto)
					AND ActualSiNo = 1
				) AS lstAprobados ON efpInterno.IdProyecto = lstAprobados.IdProyecto
		INNER JOIN dbo.Fuente F ON (efpInterno.IdTipoRecurso = F.IdTipoRecurso AND efpInterno.IdTipoEntidad = F.IdTipoEntidad AND efpInterno.IdEntidad = F.IdEntidad AND F.EsFuenteRegalias = 1)
		,#Periodos PER
	WHERE CHARINDEX( CONVERT(varchar(4),DATEPART( year, efpInterno.FechaInicioVigencia )) + ',' , @Periodos + ',') > 0	
		--AND (efpInterno.IdDepartamento = @IdDepartamento OR @IdDepartamento IS NULL)
		AND efpInterno.IdMunicipio IN( SELECT TOP 1 EnteTerritorial.IdMunicipio FROM EnteTerritorial(nolock) WHERE EnteTerritorial.IdDepartamento = @IdDepartamento AND EnteTerritorial.Tipo = 'DEPARTAMENTO')			
	GROUP BY PER.Periodo,F.IdTipoRecurso, F.NombreTipoRecurso

	DROP TABLE #Periodos

END



