CREATE VIEW [dbo].[VwComentariosProyectos] AS
SELECT DISTINCT 
	r.[IdProyecto]
	,pry.NombreProyecto
	,R.[Idpregunta]
	,P.TextoPregunta
	,R.[IdOpcionRespuesta]
	,O.EtiquetaOpcion							 
FROM [dbo].[RespuestaCuestionario] R
inner join [dbo].[OpcionRespuestas] O
ON O.IdOpcionRespuestas=R.IdOpcionRespuesta AND O.IdPregunta=R.Idpregunta
inner join [dbo].[PreguntaCuestionario] P
ON P.IdPregunta=R.Idpregunta
inner join [dbo].[Proyecto] Pry
ON Pry.IdProyecto=R.IdProyecto
