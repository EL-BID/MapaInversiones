-- =============================================
-- Author:		Ricardo Guerrero
-- Create date: 25/08/2015
-- Description:	Retorna los proyectos aprobados por codigo y nombre del proyecto
-- exec GetApprovedProjectByCodeAndName '2014865690002', 'mejoramiento'
-- =============================================
CREATE PROCEDURE [dbo].[GetApprovedProjectByCodeAndName]
	@Bpin AS varchar(max),
	@projectName AS varchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	CREATE TABLE #ProyectosAprobados (
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

	INSERT INTO #ProyectosAprobados
	SELECT TOP 10 Proyecto.CodigoBPIN as BPIN
	, Sector.NombreSector as Sector
	, Proyecto.VlrTotalProyectoTodasLasFuentes as ValorTotal
	, Proyecto.VlrTotalProyectoFuenteRegalias as ValorSGR
	, Proyecto.VlrTotalProyectoFuenteRegalias / Proyecto.VlrTotalProyectoTodasLasFuentes as PorcentajeRecursosSGR 
	, '' as OtrasFuentes
	, '' as TiempoEjecucion
	, '' as Ejecutor
	, '' as InterventorSupervisor 
	, '' as Puntaje
	, Estado.NombreEstado as Estado
	, DatosAdicionalesAprobacion.FechaAprobacionInicial as FechaAprobacion
	,Proyecto.IdProyecto, Proyecto.NombreProyecto
	, DatosAdicionalesAprobacion.IdOcadAprueba as IdOcad
	, DatosAdicionalesAprobacion.NombreOcadAprueba as NombreOcad
	,ROW_NUMBER() OVER(ORDER BY Proyecto.IdProyecto DESC) as [RowNum]
	FROM Proyecto 
	INNER JOIN HistoriaEstado ON Proyecto.IdProyecto = HistoriaEstado.IdProyecto AND ActualSiNo = 1 
	INNER JOIN Estado ON HistoriaEstado.IdEstado = Estado.IdEstado 
	INNER JOIN Sector ON Sector.IdSector = Proyecto.IdSector 
	INNER JOIN DatosAdicionalesAprobacion ON Proyecto.IdProyecto=DatosAdicionalesAprobacion.IdProyecto 
	WHERE DatosAdicionalesAprobacion.FechaAprobacionInicial is null 
	AND Proyecto.CodigoBPIN = @Bpin OR (Proyecto.NombreProyecto like '%' + @projectName + '%' AND @projectName IS NOT NULL AND @projectName <> '')
	ORDER BY Proyecto.IdProyecto desc

	DECLARE @MaxRownum INT
	SET @MaxRownum = (SELECT MAX(RowNum) FROM #ProyectosAprobados)

	DECLARE @Iter INT
	SET @Iter = (SELECT MIN(RowNum) FROM #ProyectosAprobados)
	
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
		FROM #ProyectosAprobados 
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

		UPDATE #ProyectosAprobados
		SET  [Ejecutor]=SUBSTRING(@tmpAct, 0, LEN(@tmpAct)), [InterventorSupervisor] = SUBSTRING(@tmpIntSup, 0, LEN(@tmpIntSup))
		WHERE RowNum = @Iter

		SET @Iter = @Iter + 1
	END

	SELECT distinct([BPIN])
		,[Sector]
		,[ValorTotal]
		,[ValorSGR]
		,[PorcentajeRecursosSGR]
		,[OtrasFuentes]
		,[TiempoEjecucion]
		,[Ejecutor]
		,[InterventorSupervisor]
		,[Puntaje]
		,[Estado]
		,[FechaAprobacion]
		,[IdProyecto]
		,[NombreProyecto]
		,[IdOcad]
		,[NombreOcad]
		, 0 as TotalRows
		, 0 as IdRendicion 
	FROM #ProyectosAprobados 

	DROP TABLE #ProyectosAprobados 
	DROP TABLE #ActorTemp
	DROP TABLE #InterventorSupervisorTemp

END
