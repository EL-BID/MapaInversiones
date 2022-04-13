-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 20 de Mayo de 2013
-- Description:	Procedimiento almacenado que obtiene los proyectos aprobados por region, departamento o ciudad.
-- =============================================
CREATE PROCEDURE [dbo].[sp_ProyectosAprobadosPorMunicipio]
	@Periodos varchar(MAX),
	@IdMunicipio varchar(10)
AS
BEGIN
	SET NOCOUNT ON
	CREATE  TABLE #Periodos (
		Periodo INT
	);	
	INSERT INTO  #Periodos EXEC sp_GetPeriodosTable @Periodos
	-- Obtiene los proyectos aprobados por el departamento seleccionado

	 SELECT DISTINCT 2012 AS Periodo, --PER.Periodo Periodo, 
		P.IdProyecto,
		P.NombreProyecto Proyecto,
		ET.NombreRegion,ET.NombreDepartamento,
		ET.NombreMunicipio,
		E.NombreEstado Estado,
		CONVERT(DECIMAL(18,0),P.VlrTotalProyectoFuenteRegalias) Valor 
		, ISNULL(Ejecutor.NombreActor, '--') AS Ejecutor  
	FROM VwProyectosAprobados (nolock)  aprob 
		INNER JOIN Proyecto P ON P.IdProyecto = aprob.IdProyecto
		INNER JOIN dbo.ProyectoXEntidadTerritorial(nolock) PET ON PET.IdProyecto = P.IdProyecto
		INNER JOIN dbo.EnteTerritorial(nolock) ET ON (PET.IdDepartamento = ET.IdDepartamento and PET.IdMunicipio = ET.IdMunicipio )
		INNER JOIN dbo.HistoriaEstado(nolock) HE ON P.IdProyecto = HE.IdProyecto AND HE.ActualSiNo = 1
		INNER JOIN dbo.Estado(nolock) E ON E.IdEstado = HE.IdEstado
		LEFT JOIN ActorXProyecto axp ON axp.IDProyecto = P.IdProyecto AND axp.IDRol = 1 --Ejecutor
		LEFT JOIN Actor Ejecutor ON Ejecutor.IdActor = axp.IDActor ANd Ejecutor.IDRol = axp.IDRol,
		#Periodos PER
	WHERE HE.ActualSiNo = 1 AND
	PER.Periodo BETWEEN DATEPART(year,P.FechaInicioProyecto) AND DATEPART(year,P.FechaFinProyecto) 
	AND PET.IdMunicipio = @IdMunicipio

	DROP TABLE #Periodos

END


