
-- =============================================
-- Author:		Ricardo Guerrero
-- Create date: 25/08/2015
-- Description:	Retorna los proyectos aprobados por codigo y nombre del proyecto
-- exec GetApprovedProjectByCodeAndName '2014865690002', 'mejoramiento'
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerProyectosAprobadosPorBpinNombreV2]
	@Bpin AS varchar(max),
	@projectName AS varchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	
    
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
		[Puntaje] numeric(18,2),
		[Estado] [varchar](500),
		[EstadoGesproyProyectos] [varchar](500),
		[FechaAprobacion] datetime,
		[IdProyecto] [int],
		[NombreProyecto] [varchar](max),
		[IdOcad] [int],
		[NombreOcad] [varchar](500),
		[RowNum] [int]
	)

	INSERT INTO #ProyectosAprobados
	SELECT TOP 10 ProyectoAprobado.CodigoBPIN as BPIN
	, Sector.NombreSector as Sector
	, ProyectoAprobado.VlrTotalProyectoTodasLasFuentes as ValorTotal
	, ProyectoAprobado.VlrTotalProyectoFuenteRegalias as ValorSGR
	, ProyectoAprobado.VlrTotalProyectoFuenteRegalias / ProyectoAprobado.VlrTotalProyectoTodasLasFuentes as PorcentajeRecursosSGR 
	, '' as OtrasFuentes
	, '' as TiempoEjecucion
	, '' as Ejecutor
	, '' as InterventorSupervisor 
	, ISNULL(PuntajeEvaluacionProyectos.Puntaje, 0) AS Puntaje
	, Estado.NombreEstado as Estado
	, CAST(ISNULL(EstadoGesproyProyectos.NOMBRE_ESTADO,'INDEFINIDO') AS varchar(500)) AS EstadoGesproyProyectos	
	, ISNULL(ProyectoAprobado.FechaAprobacionInicial, '01-01-01') as FechaAprobacion
	,ProyectoAprobado.IdProyecto, ProyectoAprobado.NombreProyecto
	, ProyectoAprobado.IdOcadAprueba as IdOcad
	, ProyectoAprobado.NombreOcadAprueba as NombreOcad
	, 0 as [RowNum]
	FROM 
	(
		SELECT TOP 10 Proyecto.IdProyecto, Proyecto.CodigoBPIN, VlrTotalProyectoTodasLasFuentes, VlrTotalProyectoFuenteRegalias, NombreProyecto, IdSector 
		,DatosAdicionalesAprobacion.FechaAprobacionInicial, DatosAdicionalesAprobacion.IdOcadAprueba, DatosAdicionalesAprobacion.NombreOcadAprueba 
		FROM Proyecto(nolock) 
		INNER JOIN DatosAdicionalesAprobacion ON Proyecto.IdProyecto=DatosAdicionalesAprobacion.IdProyecto 
			WHERE Proyecto.CodigoBPIN = @Bpin OR (Proyecto.NombreProyecto like '%' + @projectName + '%' AND @projectName IS NOT NULL AND @projectName <> '')
	) AS ProyectoAprobado	
	INNER JOIN HistoriaEstado ON ProyectoAprobado.IdProyecto = HistoriaEstado.IdProyecto AND ActualSiNo = 1 
	INNER JOIN Estado ON HistoriaEstado.IdEstado = Estado.IdEstado 
	INNER JOIN Sector ON Sector.IdSector = ProyectoAprobado.IdSector
	LEFT JOIN PuntajeEvaluacionProyectos ON PuntajeEvaluacionProyectos.IdProyecto = ProyectoAprobado.IdProyecto
	LEFT JOIN EstadoGesproyProyectos ON EstadoGesproyProyectos.IdProyecto = ProyectoAprobado.IdProyecto
	WHERE ProyectoAprobado.CodigoBPIN = @Bpin OR (ProyectoAprobado.NombreProyecto like '%' + @projectName + '%' AND @projectName IS NOT NULL AND @projectName <> '')
	ORDER BY ProyectoAprobado.IdProyecto desc

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
		, EstadoGesproyProyectos
		, 0 as TotalRows
		, 0 as IdRendicion 
	FROM #ProyectosAprobados 

	DROP TABLE #ProyectosAprobados 
	DROP TABLE #ActorTemp
	DROP TABLE #InterventorSupervisorTemp

	--SELECT TOP 5 [CodigoBPIN] AS [BPIN]
	--, '--' AS [Sector]
	--,[VlrTotalProyectoTodasLasFuentes] AS [ValorTotal]
	--,[VlrTotalProyectoTodasLasFuentes] AS [ValorSGR]
	--,CAST(160 AS INT) AS [PorcentajeRecursosSGR]
	--,'' AS [OtrasFuentes]
	--, '2' as [TiempoEjecucion]
	--, 'ejexx' as [Ejecutor]
	--, 'interyy' as [InterventorSupervisor] 
	--, 'estado2222' AS Estado
	--, CAST(19 as numeric(18,2)) AS Puntaje
	--, 'estadoges11' AS EstadoGesproyProyectos
	--,FechaUltimaModificacion AS [FechaAprobacion]
	--,[IdProyecto]
	--,[NombreProyecto]
	--,[IdOcad]
	--,[NombreOcad]
	--FROM Proyecto


END
