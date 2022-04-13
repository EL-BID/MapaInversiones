
-- =============================================
-- Author:		<BID>
-- Create date: <23/09/2019>
-- Description:	<OBTINE LAS TIPOLOGIAS POR COMENTARIO>
-- =============================================
create PROCEDURE [dbo].[ObtenerTipologiasPorComentario]
	-- Add the parameters for the stored procedure here

@IDCOMENTARIO INT


AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- con respuestas
	
		
		-- Insert statements for procedure here
			SELECT Tipologias.IdTipologia,
			Tipologias.Tipologia,
			CASE WHEN (TipologiasComentario.IdTipologiaComenario IS NOT NULL) THEN 1 ELSE 0 END AS Relacion
			FROM Tipologias
			LEFT JOIN TipologiasComentario
				ON TipologiasComentario.IdTipologia = Tipologias.IdTipologia
						AND TipologiasComentario.IdComentario = @IDCOMENTARIO 


END
