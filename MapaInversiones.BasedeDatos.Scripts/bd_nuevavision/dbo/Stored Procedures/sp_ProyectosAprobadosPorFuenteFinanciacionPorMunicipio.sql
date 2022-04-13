-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 22 de Julio de 2013
-- Description:	Procedimiento almacenado que obtiene los proyectos aprobados por fuente para un mucicipio.
-- =============================================
CREATE PROCEDURE [dbo].[sp_ProyectosAprobadosPorFuenteFinanciacionPorMunicipio]
	@Periodos varchar(MAX),
	@IdMunicipio varchar(10),
	@IdTipoRecurso int = NULL
AS
BEGIN
	SET NOCOUNT ON
  	--Proyectos aprobados financiados por un tipo de recurso y cuya fuente de financiación es departamental en el año dado
    SELECT DISTINCT CONVERT(INT, @Periodos) AS Periodo
	, P.IdProyecto
	, P.NombreProyecto Proyecto
	, '--' AS NombreRegion
	, '--' AS NombreDepartamento
	, '--' AS NombreMunicipio	
	, E.NombreEstado Estado,
	SUM(CONVERT(DECIMAL(18,0),EFP.ValorAprobado)) Valor,
	ISNULL(Ejecutor.NombreActor, '--') AS Ejecutor 
	FROM VwProyectosAprobados (nolock) as P 	
	INNER JOIN dbo.EsquemaFinanciacionProyecto EFP ON EFP.IdProyecto = P.IdProyecto
	INNER JOIN dbo.Fuente F ON (F.IdTipoRecurso = EFP.IdTipoRecurso AND F.IdTipoEntidad = EFP.IdTipoEntidad AND F.IdEntidad = EFP.IdEntidad)
	INNER JOIN dbo.HistoriaEstado HE ON P.IdProyecto = HE.IdProyecto AND HE.ActualSiNo = 1 
	INNER JOIN dbo.Estado E ON E.IdEstado = HE.IdEstado	
	LEFT JOIN ActorXProyecto axp ON axp.IDProyecto = p.IdProyecto AND axp.IDRol = 1 --Ejecutor
	LEFT JOIN Actor Ejecutor ON Ejecutor.IdActor = axp.IDActor ANd Ejecutor.IDRol = axp.IDRol
	WHERE HE.ActualSiNo = 1 	
	AND EFP.IdMunicipio = @IdMunicipio			
	AND F.IdTipoRecurso = @IdTipoRecurso
	AND EFP.FechaInicioVigencia = DATEFROMPARTS(CONVERT(INT, @Periodos),1,1)
	
	GROUP BY P.IdProyecto, 
	P.NombreProyecto, 	
	E.NombreEstado 
	, Ejecutor.NombreActor
END


