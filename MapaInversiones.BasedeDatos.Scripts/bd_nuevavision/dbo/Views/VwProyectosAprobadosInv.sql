





CREATE VIEW [dbo].[VwProyectosAprobadosInv]
AS
SELECT DISTINCT proy.IdProyecto,
proy.FechaInicioProyecto, 
TiempoInicio.MesNombreCorto as MesInicioProyecto,
TiempoInicio.Anio as AnioInicioProyecto,
proy.FechaFinProyecto,
TiempoFin.MesNombreCorto as MesFinProyecto,
TiempoFin.Anio as AnioFinProyecto,
proy.NombreProyecto, 
proy.VlrTotalProyectoFuenteRegalias, 
proy.VlrTotalProyectoTodasLasFuentes, 
proy.IdSector,
sec.NombreSector,
ISNULL((Select top 1 FO.RutaFotoPequeno  from  dbo.Foto as Fo where  proy.IdProyecto=Fo.IdProyecto),'/FotoGaleria/11/11_1_SM.jpg') as URLImagen,
isnull(FotosConteo.ConteoFoto,0) as NumeroImagenes,
--proy.PorcentajeAvanceFisico as PorcentajeEjecutado,
proy.PorcentajeAvanceFinanciero as AvanceFinanciero,
proy.PorcentajeAvanceFisico as AvanceFisico,
isnull(EntidadEjecutora.[IdEntidad],12001) as IdEntidadEjecutora,
isnull(EntidadEjecutora.[NombreEntidad],'PRESIDENCIA DE LA REPÚBLICA') as EntidadEjecutora,
[dbo].[duration] (proy.FechaInicioProyecto,proy.FechaFinProyecto) as DuracionProyecto,
ISNULL(ProyectoMegusta.MeGusta,0) as MeGusta,
isnull(ProyectoComentarios.Comentario,0) as Comentarios,
(CASE WHEN proy.NombreOCAD='NA' THEN 'NACIONAL' 
WHEN proy.NombreOCAD='DE' THEN 'DEPARTAMENTAL'
WHEN proy.NombreOCAD='MU' THEN 'MUNICIPAL'
 ELSE 'NACIONAL' END) AS TipoProyecto,
isnull( IdPrograma,0) AS IdPrograma,
isnull([NombrePrograma],'SIN PROGRAMA') as Programa,
case when IdPrograma is null then 0
else 1 end as COVID19,
proy.[CodigoBPIN] as CodigoSNIP
FROM  dbo.Proyecto AS proy 					 
                     left join [VwEntidadEjecutora] EntidadEjecutora 
					 on EntidadEjecutora.IdProyecto=proy.IdProyecto
						    --  dbo.ProyectoXEntidadTerritorial AS px ON proy.IdProyecto = px.IdProyecto 
					   INNER JOIN
                         dbo.HistoriaEstado AS he ON he.IdProyecto = proy.IdProyecto
						 inner join dbo.Tiempo TiempoInicio
						on TiempoInicio.Fecha=proy.FechaInicioProyecto
						 inner join dbo.Tiempo TiempoFin
						on TiempoFin.Fecha=proy.FechaFinProyecto

						left join dbo.Foto as Fo on proy.IdProyecto=Fo.IdProyecto
						left join (SELECT count(distinct IdMeGusta) as MeGusta
								  ,[IdProyecto]
							  FROM [dbo].[MeGusta]
							  where [MeGusta]=1
							   group by  [IdProyecto])ProyectoMegusta
							   on ProyectoMegusta.IdProyecto=proy.IdProyecto
						left join (  SELECT count(distinct [IdRespuesta]) as Comentario
					  ,[IdProyecto]
				  FROM [dbo].[RespuestaCuestionario]

				   group by  [IdProyecto] )ProyectoComentarios
		
				   on ProyectoComentarios.IdProyecto=proy.IdProyecto
				   left join (   Select IdProyecto,sum(ConteoFoto) as ConteoFoto from(
						   Select IdProyecto,count(distinct IdFoto) as ConteoFoto from  dbo.Foto where Aprobado=1 and Eliminado=0
						  -- and IdProyecto=159
						   group by IdProyecto
						   union all
						   Select IdProyecto,count(distinct IdFotoUsuario)  as ConteoFoto from  dbo.FotoUsuario where Aprobado=1 and Eliminado=0
						--	  and IdProyecto=159
						  group by IdProyecto)Fotos
						group by IdProyecto)FotosConteo
						on FotosConteo.IdProyecto=proy.IdProyecto
				   		 inner join   dbo.sector AS sec  
					ON sec.IdSector = proy.IdSector
					left join(Select IdProyecto as NONACIONAL from 
					dbo.ProyectoXEntidadTerritorial)px 
					ON proy.IdProyecto = px.NONACIONAL
					left join (SELECT 
      [IdPrograma] as Id
	  ,cast(concat([Nivel],[CodigoEntidad],[ClasePrograma],[CodigoPrograma]) as int) as IdPrograma,
	  [NombrePrograma]
       ,[CodigoBPIN]
  FROM [dbo].[Indicadores] I
  inner join .[dbo].[Programa] P
  ON I.IdPrograma=P.Id)Programa
  on Programa.[CodigoBPIN]=proy.[CodigoBPIN]
WHERE        (he.ActualSiNo = 1) AND (he.IdEstado = 1 or he.IdEstado=2 or he.IdEstado=3 OR he.IdEstado=4 )
--and LEN(proy.NombreProyecto) >=50





















