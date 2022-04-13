-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 30 de Enero de 2014
-- Description:	Consulta los campos o minas por el nombre
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerListadoDeCamposOProyectosFiscalizacionPorFiltro]
	@NombreCampoOProyecto VARCHAR(250)
	, @IdTipoRecurso AS VARCHAR(5)
	AS
BEGIN

	SET NOCOUNT ON;

	DECLARE @idTipoCampoEquivalente AS VARCHAR(5)
	SET @idTipoCampoEquivalente = ''

	IF (@IdTipoRecurso = 'M')
		SET @idTipoCampoEquivalente = '1'--Mineria
	IF (@IdTipoRecurso = 'H')
		SET @idTipoCampoEquivalente = '2'--Hidro
	

	IF @NombreCampoOProyecto = '' 
		BEGIN
			SELECT TOP 200 C.IdCampoOProyecto, 
			C.NombreCampoOProyecto
			, CASE WHEN C.IdTipoCampoOProyecto = '1' THEN 'M'
				ELSE 'H'
			END AS  TipoRecurso	
			FROM CampoOProyectoFiscalizacion C
			WHERE (C.IdTipoCampoOProyecto = @idTipoCampoEquivalente OR @idTipoCampoEquivalente = '')
		END
	ELSE
		BEGIN   
			SELECT TOP 200 C.IdCampoOProyecto, 
			C.NombreCampoOProyecto
			, CASE WHEN C.IdTipoCampoOProyecto = '1' THEN 'M'
				ELSE 'H'
			END AS  TipoRecurso	
			FROM CampoOProyectoFiscalizacion C
			WHERE C.NombreCampoOProyecto LIKE '%'+@NombreCampoOProyecto+'%' 
			AND (C.IdTipoCampoOProyecto = @idTipoCampoEquivalente OR @idTipoCampoEquivalente = '')
		END
	
END


