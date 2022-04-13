-- =============================================
-- Author:		Ricardo Guerrero
-- Create date: 25/08/2015
-- Description:	Obtiene los proyectos por periodos y por OCADs
-- exec GetProjectsByPeriodAndOcad '2012-07-01 00:00:01', '2012-12-31 00:00:00', 0
-- =============================================
CREATE PROCEDURE [dbo].[GetProjectsByPeriodAndOcad]
	-- Add the parameters for the stored procedure here
	@fechaInicial AS datetime,
	@fechaFinal AS datetime,
	@OcadId AS int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	CREATE TABLE #ProyectosAprobadosSemestre (
		[BPIN] [varchar](500),
		[Sector] [varchar](500),
		[ValorTotal] [decimal](18, 2),
		[ValorSGR] [decimal](18, 2),
		[PorcentajeRecursosSGR] [int],
		[OtrasFuentes] [varchar](500),
		[TiempoEjecucion] [varchar](500),
		[Ejecutor] [varchar](500),
		[InterventorSupervisor] [varchar](500),
		[Puntaje] [varchar](500),
		[Estado] [varchar](500),
		[FechaAprobacion] datetime,
		[IdProyecto] [int],
		[NombreProyecto] [varchar](max),
		[IdOcad] [int],
		[NombreOcad] [varchar](500),
		[RowNum] [int]
	)

    INSERT INTO #ProyectosAprobadosSemestre
	SELECT Proyecto.CodigoBPIN AS [BPIN]
		, Sector.NombreSector AS [Sector]
		, Proyecto.VlrTotalProyectoTodasLasFuentes AS [ValorTotal]
		, Proyecto.VlrTotalProyectoFuenteRegalias AS [ValorSGR]
		, (Proyecto.VlrTotalProyectoFuenteRegalias / Proyecto.VlrTotalProyectoTodasLasFuentes) * 100 as [PorcentajeRecursosSGR] 
		, 	'' as [OtrasFuentes]
		, '' as [TiempoEjecucion]
		, '' as [Ejecutor]
		, '' as [InterventorSupervisor] 
		, '' as [Puntaje]
		, Estado.NombreEstado as [Estado]
		, DatosAdicionalesAprobacion.FechaAprobacionInicial as [FechaAprobacion]
		,Proyecto.IdProyecto, Proyecto.NombreProyecto
		,DatosAdicionalesAprobacion.IdOcadAprueba as [IdOcad], DatosAdicionalesAprobacion.NombreOcadAprueba as [NombreOcad]
		,ROW_NUMBER() OVER(ORDER BY Proyecto.IdProyecto DESC) as [RowNum]
	FROM Proyecto 
	INNER JOIN HistoriaEstado ON Proyecto.IdProyecto = HistoriaEstado.IdProyecto AND ActualSiNo = 1 
	INNER JOIN Estado ON HistoriaEstado.IdEstado = Estado.IdEstado 
	INNER JOIN Sector ON Sector.IdSector = Proyecto.IdSector 
	INNER JOIN DatosAdicionalesAprobacion ON Proyecto.IdProyecto=DatosAdicionalesAprobacion.IdProyecto 
	WHERE DatosAdicionalesAprobacion.FechaAprobacionInicial BETWEEN @fechaInicial AND @fechaFinal
	ORDER BY Proyecto.IdProyecto desc

	DECLARE @MaxRownum INT
	SET @MaxRownum = (SELECT MAX(RowNum) FROM #ProyectosAprobadosSemestre)

	DECLARE @Iter INT
	SET @Iter = (SELECT MIN(RowNum) FROM #ProyectosAprobadosSemestre)
	
	DECLARE @MaxParameters INT
	DECLARE @IterParams INT

	DECLARE @IDProyecto INT
	DECLARE @tmpAct varchar(max)
	DECLARE @tmpIntSup varchar(max)
	CREATE TABLE #ActorTemp ([NombreActor] varchar(max))
	CREATE TABLE #InterventorSupervisorTemp ([NombreActor] varchar(max))

	WHILE @Iter <= @MaxRownum
	BEGIN
		
		SELECT @IDProyecto=IdProyecto 
		FROM #ProyectosAprobadosSemestre 
		WHERE RowNum = @Iter

		/**************************************************
			Obtener actores del proyecto
		***************************************************/
		SET @tmpAct = ''
		INSERT INTO #ActorTemp
		SELECT DISTINCT([NombreActor]) as [NombreActor]
		FROM [Actor]
		WHERE IdActor in (SELECT [IDActor]
		FROM [ActorXProyecto]
		WHERE IDProyecto=@IDProyecto and IDRol = 1 )
		SELECT @tmpAct = @tmpAct + [NombreActor] + ', ' FROM #ActorTemp
		TRUNCATE TABLE #ActorTemp

		/**************************************************
			Obtener interventores/supervisores del proyecto
		***************************************************/
		SET @tmpIntSup = ''
		INSERT INTO #InterventorSupervisorTemp
		SELECT DISTINCT([NombreActor]) as [NombreActor]
		FROM [Actor]
		WHERE IdActor in (SELECT [IDActor]
		FROM [ActorXProyecto]
		WHERE IDProyecto=@IDProyecto and IDRol in (3,4))
		SELECT @tmpIntSup = @tmpIntSup + [NombreActor] + ', ' FROM #InterventorSupervisorTemp
		TRUNCATE TABLE #InterventorSupervisorTemp

		UPDATE #ProyectosAprobadosSemestre
		SET  [Ejecutor]=SUBSTRING(@tmpAct, 0, LEN(@tmpAct)), [InterventorSupervisor] = SUBSTRING(@tmpIntSup, 0, LEN(@tmpIntSup))
		WHERE RowNum = @Iter

		SET @Iter = @Iter + 1
	END

	DECLARE @sqlCommand varchar(max)
	SET @sqlCommand = 'SELECT [BPIN],[Sector],[ValorTotal],[ValorSGR],[PorcentajeRecursosSGR]
	,[OtrasFuentes],[TiempoEjecucion],[Ejecutor],[InterventorSupervisor],[Puntaje],[Estado]
	,[FechaAprobacion],[IdProyecto], [NombreProyecto],[IdOcad],[NombreOcad]
	, (SELECT count(*) FROM #ProyectosAprobadosSemestre) as TotalRows, 0 as IdRendicion FROM #ProyectosAprobadosSemestre '
	IF(@OcadId>0)
	BEGIN
		SET @sqlCommand = @sqlCommand + 'WHERE [IdOcad]=' + Cast(@OcadId as varchar) + ' '
	END
	SET @sqlCommand = @sqlCommand + 'ORDER BY [IdProyecto] DESC'
	EXEC (@sqlCommand)

	DROP TABLE #ProyectosAprobadosSemestre 
	DROP TABLE #ActorTemp
	DROP TABLE #InterventorSupervisorTemp
END
