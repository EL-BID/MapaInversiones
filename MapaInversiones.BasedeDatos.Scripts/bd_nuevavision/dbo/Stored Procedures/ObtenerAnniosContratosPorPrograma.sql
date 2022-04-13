-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerAnniosContratosPorPrograma] 
@IDPROGRAMA int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT DISTINCT YEAR(FechaPublicacion) AS ANIOINICIOCONTRATO 
	FROM vwContratosPerfilContratistaInformacionContratacion c
	WHERE ID_PROGRAMA = @IDPROGRAMA AND Id_Programa <> 9999 AND COVID19=1 
		ORDER BY 1
END

