CREATE PROCEDURE [dbo].[ObtenerValoresIndicadoresContratos] 
AS
BEGIN

	SET NOCOUNT ON;

	select 
		DenominadorIndicador as ValorIndicador, 
		SUM(avanceindicador) as AvanceIndicador,
		(SUM(avanceindicador)*100)/isnull(DenominadorIndicador,0) as ProcentajeAvance 
	from [dbo].[VwProgramaIndicadoresCovid]
	where Tipo2Indicador = 'ECONOMIA'
	group by DenominadorIndicador

END
