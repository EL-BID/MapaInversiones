CREATE PROCEDURE [dbo].[ObtenerValoresIndicadoresContratosPorPrograma] 
@IDPROGRAMA int	
AS
BEGIN

	SET NOCOUNT ON;

	select 
		DenominadorIndicador as ValorIndicador, 
		SUM(avanceindicador) as AvanceIndicador,
		(SUM(avanceindicador)*100)/isnull(DenominadorIndicador,0) as ProcentajeAvance 
	from [dbo].[VwProgramaIndicadoresCovid]
	where Tipo2Indicador = 'ECONOMIA'
	and CodigoPrograma = @IDPROGRAMA
	group by DenominadorIndicador

END
