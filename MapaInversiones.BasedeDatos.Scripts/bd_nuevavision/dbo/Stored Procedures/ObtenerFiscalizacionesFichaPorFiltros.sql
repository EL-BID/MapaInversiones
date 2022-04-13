-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 08 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerFiscalizacionesFichaPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdRecurso AS VARCHAR(10),
@periodosList varchar(300),
@IdTipoFiscalizacion AS INT,
@TextoBusqueda AS NVARCHAR(500),
@IdTipoRecurso AS VARCHAR(10),
@IdEtapaCampoMina AS INT

AS
BEGIN	

SET @TextoBusqueda = LTRIM(RTRIM(@TextoBusqueda))
SET @TextoBusqueda = @TextoBusqueda + '%'

SELECT DISTINCT
 SUBSTRING(campo.NombreCampoOProyecto,0, 36) AS NombreCampoMina
, actividad.IdFiscalizacionNegocio AS IdFiscalizacion
, actividad.FechaActividad AS FechaActividad
, CONVERT(varchar(40), recurso.NombreRecursoNatural) AS recurso
, Actividad.IdTipoRecursoNatural AS CodigoTipoRecurso
 --tipoActividad.Nombre AS Actividad
,CASE WHEN actividad.IdTipoRecursoNatural = 'H'
	THEN tipoActividad.Nombre 
	--THEN tipoActividad.Nombre + ' - ' + ISNULL(actividad.Observaciones, '')
	ELSE tipoActividad.Nombre
END AS  Actividad
,CASE WHEN actividad.IdTipoRecursoNatural = 'H'
	THEN CONVERT(varchar(40), actividad.Id) --ISNULL(actividad.Observaciones,(actividad.IdFiscalizacionSurrogada + '-' + CONVERT(varchar(40), recurso.NombreRecursoNatural))) 
	ELSE ''--ISNULL(actividad.Observaciones,(actividad.IdFiscalizacionSurrogada + '-' + CONVERT(varchar(40), recurso.NombreRecursoNatural))) 
END AS  Observacion
--, ISNULL(actividad.Observaciones,(actividad.IdFiscalizacionSurrogada + '-' + CONVERT(varchar(40), recurso.NombreRecursoNatural))) AS Observacion
FROM CampoOProyectoFiscalizacion (nolock) campo
LEFT JOIN Fiscalizacion(nolock) actividad ON campo.IdTipoCampoOProyecto = actividad.IdTipoCampoOProyecto AND campo.IdCampoOProyecto = actividad.IdCampoOProyecto
LEFT JOIN EnteTerritorial(nolock) ente ON actividad.IdMunicipio = ente.IdMunicipio 
LEFT JOIN TipoActividadFiscalizacion(nolock) tipoActividad ON tipoActividad.Id = actividad.IdTipoActividad
LEFT JOIN RecursoNaturalFiscalizacion(nolock) recurso ON recurso.IdTipoRecursoNatural = actividad.IdTipoRecursoNatural AND recurso.IdRecursoNatural = actividad.IdRecursoNatural
LEFT JOIN EtapaCampoOProyecto(nolock) Etapa ON Etapa.IdCampoOProyecto = actividad.IdCampoOProyecto AND Etapa.IdTipoCampoOProyecto = actividad.IdTipoCampoOProyecto
WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			AND (actividad.IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')			
			AND CHARINDEX( CONVERT(varchar(4), actividad.AñoLiquidado) + ',' , @periodosList + ','	) > 0			
			AND ( (IdTipoActividad IS NULL AND @IdTipoFiscalizacion = 0) OR (IdTipoActividad IS NOT NULL AND @IdTipoFiscalizacion = 1) OR (@IdTipoFiscalizacion IS NULL)  OR (@IdTipoFiscalizacion = -1))
			AND (campo.NombreCampoOProyecto COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda OR @TextoBusqueda IS NULL OR @TextoBusqueda = '')
			AND (actividad.IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso = '' OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1')	
			AND (Etapa.IdEtapaCampoOProyecto = @IdEtapaCampoMina OR @IdEtapaCampoMina = '' OR @IdEtapaCampoMina IS NULL OR @IdEtapaCampoMina = '-1' )
ORDER BY SUBSTRING(campo.NombreCampoOProyecto,0, 36) 
		, actividad.IdFiscalizacionNegocio
		, actividad.FechaActividad
		,CASE WHEN actividad.IdTipoRecursoNatural = 'H'
	THEN tipoActividad.Nombre 
	--THEN tipoActividad.Nombre + ' - ' + ISNULL(actividad.Observaciones, '')
	ELSE tipoActividad.Nombre
END
		,  CONVERT(varchar(40), recurso.NombreRecursoNatural) 

END


