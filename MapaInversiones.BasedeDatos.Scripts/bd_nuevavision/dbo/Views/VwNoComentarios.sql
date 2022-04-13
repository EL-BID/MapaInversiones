CREATE VIEW [dbo].[VwNoComentarios] AS
SELECT 
	[Idpregunta]
	,TextoPregunta
	,SUM(ConteoComentarios) AS Comentarios 
FROM (
	SELECT DISTINCT 
		[IdProyecto]
		,R.[Idpregunta]
		,P.TextoPregunta
		,count(ComentarioRespuesta) AS ConteoComentarios
	FROM [dbo].[RespuestaCuestionario] R
	inner join [dbo].[OpcionRespuestas] O
	ON O.IdOpcionRespuestas=R.IdOpcionRespuesta AND O.IdPregunta=R.Idpregunta
	inner join [dbo].[PreguntaCuestionario] P
	ON P.IdPregunta=R.Idpregunta
	GROUP BY 
		 R.[Idpregunta]
		,R.[IdOpcionRespuesta]
		,[IdProyecto]
		,P.TextoPregunta
) A	
GROUP BY 
	[Idpregunta]
	,TextoPregunta
