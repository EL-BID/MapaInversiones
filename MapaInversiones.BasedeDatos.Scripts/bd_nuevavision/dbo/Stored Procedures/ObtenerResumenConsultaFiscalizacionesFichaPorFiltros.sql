-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 08 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerResumenConsultaFiscalizacionesFichaPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdRecurso AS VARCHAR(10),
@AñoLiquidado INT,
@IdTipoFiscalizacion AS INT,
@TextoBusqueda AS NVARCHAR(500),
@IdTipoRecurso AS VARCHAR(10),
@IdEtapaCampoMina AS INT

AS
BEGIN	

SET @TextoBusqueda = LTRIM(RTRIM(@TextoBusqueda))
SET @TextoBusqueda = @TextoBusqueda + '%'


DECLARE @TotalCamposMinas AS INT
DECLARE @TotalFiscalizaciones AS INT

SELECT @TotalCamposMinas = COUNT(DISTINCT Fiscalizacion.IdCampoOProyecto) 
			FROM Fiscalizacion(nolock) 
			LEFT JOIN CampoOProyectoFiscalizacion (nolock) campo ON campo.IdCampoOProyecto = Fiscalizacion.IdCampoOProyecto AND campo.IdTipoCampoOProyecto = Fiscalizacion.IdTipoCampoOProyecto
			LEFT JOIN EtapaCampoOProyecto(nolock) Etapa ON Etapa.IdCampoOProyecto = Fiscalizacion.IdCampoOProyecto AND Etapa.IdTipoCampoOProyecto = Fiscalizacion.IdTipoCampoOProyecto			
		WHERE AñoLiquidado = @AñoLiquidado
			AND (IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')			
			AND (campo.NombreCampoOProyecto COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda OR @TextoBusqueda IS NULL OR @TextoBusqueda = '')
			AND (Etapa.IdEtapaCampoOProyecto = @IdEtapaCampoMina OR @IdEtapaCampoMina = '' OR @IdEtapaCampoMina IS NULL )
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1' )
			AND (Fiscalizacion.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (Fiscalizacion.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			AND ((Fiscalizacion.IdDepartamento IN (SELECT IdDepartamento FROM EnteTerritorial WHERE IdRegion = @IdRegion)) OR @IdRegion = '' OR @IdRegion IS NULL)	

SELECT @TotalFiscalizaciones = COUNT(DISTINCT Fiscalizacion.IdCampoOProyecto)  
			FROM Fiscalizacion(nolock) 
			LEFT JOIN CampoOProyectoFiscalizacion (nolock) campo ON campo.IdCampoOProyecto = Fiscalizacion.IdCampoOProyecto AND campo.IdTipoCampoOProyecto = Fiscalizacion.IdTipoCampoOProyecto
			LEFT JOIN EtapaCampoOProyecto(nolock) Etapa ON Etapa.IdCampoOProyecto = Fiscalizacion.IdCampoOProyecto AND Etapa.IdTipoCampoOProyecto = Fiscalizacion.IdTipoCampoOProyecto 			
		WHERE AñoLiquidado = @AñoLiquidado 
			AND IdTipoActividad IS NOT NULL 
			AND (IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')
			AND (campo.NombreCampoOProyecto COLLATE Latin1_General_CI_AI LIKE @TextoBusqueda OR @TextoBusqueda IS NULL OR @TextoBusqueda = '')
			AND (Etapa.IdEtapaCampoOProyecto = @IdEtapaCampoMina OR @IdEtapaCampoMina = '' OR @IdEtapaCampoMina IS NULL )
			AND ( IdTipoRecursoNatural = @IdTipoRecurso OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = '-1'  )
			AND (Fiscalizacion.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (Fiscalizacion.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			AND ((Fiscalizacion.IdDepartamento IN (SELECT IdDepartamento FROM EnteTerritorial WHERE IdRegion = @IdRegion)) OR @IdRegion = '' OR @IdRegion IS NULL)	

SELECT 	@TotalCamposMinas AS TotalCamposMinas, 	@TotalFiscalizaciones AS TotalFiscalizaciones
	
END


