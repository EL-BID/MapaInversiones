






























CREATE VIEW [dbo].[VwReporteComentariosParticipacion]
AS
SELECT DISTINCT proy.IdProyecto,
proy.CodigoBPIN as CodigoProyecto,
proy.NombreProyecto, 
proy.IdSector,
sec.NombreSector,
ISNULL(EntidadEjecutora.[IdEntidad],0) as IdEntidadEjecutora,
ISNULL(EntidadEjecutora.[NombreEntidad],'SIN INFORMACION') as EntidadEjecutora,
AreaInfluencia.IdDepartamento,
AreaInfluencia.NombreDepartamento,
AreaInfluencia.IdMunicipio,
AreaInfluencia.NombreMunicipio,
RespuestaComentario.Idpregunta,
Pregunta.TextoPregunta,
RespuestaComentario.IdOpcionRespuesta,
OpcionRespuesta.EtiquetaOpcion,
RespuestaComentario.Fecha,

RespuestaComentario.ComentarioRespuesta


FROM            dbo.Proyecto AS proy WITH (nolock) 
inner join [dbo].[RespuestaCuestionario] RespuestaComentario
on RespuestaComentario.IdProyecto=proy.IdProyecto
inner join [dbo].[PreguntaCuestionario] Pregunta
on Pregunta.IdPregunta=RespuestaComentario.Idpregunta
inner join [dbo].[OpcionRespuestas] OpcionRespuesta
on OpcionRespuesta.IdOpcionRespuestas=RespuestaComentario.IdOpcionRespuesta
and OpcionRespuesta.IdPregunta=Pregunta.IdPregunta
inner join [dbo].[EnteTerritorial] AreaInfluencia
on AreaInfluencia.IdDepartamento=RespuestaComentario.IdDepartamento
and AreaInfluencia.IdMunicipio=RespuestaComentario.IdMunicipio
                       --  dbo.ProyectoXEntidadTerritorial AS px ON proy.IdProyecto = px.IdProyecto 
					--   INNER JOIN
                     	 LEFT join (SELECT  [IDProyecto] AS[IdProyecto] ,AP.IDActor AS [IdEntidad]
      
	  ,[NombreActor] AS NombreEntidad
    
  FROM [dbo].[ActorXProyecto] AP inner join [Actor] A
  ON A.IdActor=AP.IDActor AND AP.IDRol=A.IDRol
  WHERE A.IDRol=1)EntidadEjecutora on EntidadEjecutora.IdProyecto=proy.IdProyecto
				--		inner join  [dbo].[Tiempo]
						
		
				  
				   		 inner join   dbo.sector AS sec WITH (nolock) 
					ON sec.IdSector = proy.IdSector
					
Where ComentarioRespuesta is not null and 
 len(ComentarioRespuesta)>0
--and LEN(proy.NombreProyecto) >=50































