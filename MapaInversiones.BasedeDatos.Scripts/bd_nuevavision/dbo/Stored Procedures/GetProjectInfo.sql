-- =============================================
-- Author:		Ricardo Guerrero
-- Create date: 26/08/2015
-- Description:	Retorna la informacion de un proyecto en particular
-- exec GetProjectInfo 113311
-- =============================================
CREATE PROCEDURE [dbo].[GetProjectInfo]
	@projectID AS int
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

	DECLARE @tmpAct varchar(max)
	DECLARE @tmpIntSup varchar(max)
	CREATE TABLE #ActorTemp ([NombreActor] varchar(max))
	CREATE TABLE #InterventorSupervisorTemp ([NombreActor] varchar(max))
	/**************************************************
		Obtener actores del proyecto
	***************************************************/
	SET @tmpAct = ''
	INSERT INTO #ActorTemp
	SELECT DISTINCT([NombreActor]) as [NombreActor]
	FROM [Actor]
	WHERE IdActor in (SELECT [IDActor]
	FROM [ActorXProyecto]
	WHERE IDProyecto=@projectID and IDRol = 1 )
	SELECT @tmpAct = @tmpAct + [NombreActor] + ', ' FROM #ActorTemp
	DROP TABLE #ActorTemp

	/**************************************************
		Obtener interventores/supervisores del proyecto
	***************************************************/
	SET @tmpIntSup = ''
	INSERT INTO #InterventorSupervisorTemp
	SELECT DISTINCT([NombreActor]) as [NombreActor]
	FROM [Actor]
	WHERE IdActor in (SELECT [IDActor]
	FROM [ActorXProyecto]
	WHERE IDProyecto=@projectID and IDRol in (3,4))
	SELECT @tmpIntSup = @tmpIntSup + [NombreActor] + ', ' FROM #InterventorSupervisorTemp
	DROP TABLE #InterventorSupervisorTemp

	INSERT INTO #ProyectosAprobados
	SELECT TOP 1 Proyecto.CodigoBPIN as BPIN
	, Sector.NombreSector as Sector
	, Proyecto.VlrTotalProyectoTodasLasFuentes as ValorTotal
	, Proyecto.VlrTotalProyectoFuenteRegalias as ValorSGR
	, Proyecto.VlrTotalProyectoFuenteRegalias / Proyecto.VlrTotalProyectoTodasLasFuentes as PorcentajeRecursosSGR 
	, '' as OtrasFuentes
	, '' as TiempoEjecucion
	, SUBSTRING(@tmpAct, 0, LEN(@tmpAct)) as Ejecutor
	, SUBSTRING(@tmpIntSup, 0, LEN(@tmpIntSup)) as InterventorSupervisor 
	, '' as Puntaje
	, Estado.NombreEstado as Estado
	, DatosAdicionalesAprobacion.FechaAprobacionInicial as FechaAprobacion
	,Proyecto.IdProyecto, Proyecto.NombreProyecto
	, DatosAdicionalesAprobacion.IdOcadAprueba as IdOcad
	, DatosAdicionalesAprobacion.NombreOcadAprueba as NombreOcad
	,0 as [RowNum]
	FROM Proyecto 
	INNER JOIN HistoriaEstado ON Proyecto.IdProyecto = HistoriaEstado.IdProyecto AND ActualSiNo = 1 
	INNER JOIN Estado ON HistoriaEstado.IdEstado = Estado.IdEstado 
	INNER JOIN Sector ON Sector.IdSector = Proyecto.IdSector 
	INNER JOIN DatosAdicionalesAprobacion ON Proyecto.IdProyecto=DatosAdicionalesAprobacion.IdProyecto 
	WHERE DatosAdicionalesAprobacion.FechaAprobacionInicial is null AND Proyecto.IdProyecto=@projectID
	ORDER BY DatosAdicionalesAprobacion.IdDatoAdicional DESC
	
	SELECT *, 0 as TotalRows, 0 as IdRendicion FROM #ProyectosAprobados
	DROP TABLE #ProyectosAprobados 

END
