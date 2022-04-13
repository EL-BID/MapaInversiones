
--/****** Object:  View [minhac].[Vw_Presupuesto_x_Sector_MinHacienda]    Script Date: 7/14/2021 1:04:01 PM ******/
--SET ANSI_NULLS ON
--GO

--SET QUOTED_IDENTIFIER ON
--GO

--select * 
--from minhac.Programa

CREATE   VIEW [minhac].[Vw_Presupuesto_x_Sector_MinHacienda]
as
SELECT 
cast(rp.CodigoNivel as varchar(3))+'-'+
cast(rp.CodigoEntidad as varchar(3))+'-'+
cast(rp.CodigoTipo as varchar(3))+'-'+
cast(rp.CodigoPrograma as varchar(3))+'-'+
cast(rp.CodigoSubPrograma as varchar(3))+'-'+
cast(rp.CodigoProyecto as varchar(3)) as IdNegocioProyecto
,cast(rp.CodigoNivel as varchar(3))+'-'+
cast(rp.CodigoEntidad as varchar(3))+'-'+
cast(rp.CodigoTipo as varchar(3))+'-'+
cast(rp.CodigoPrograma as varchar(3))+'-'+
cast(rp.CodigoSubPrograma as varchar(3))+'-'+
cast(rp.CodigoProyecto as varchar(3)) +'-'+
cast(rp.CodigoFuente as varchar(3))+'-'+
cast(rp.CodigoObjetivo as varchar(3)) as IdNegocioRubroObjetivo
,a.ANIOPRESUP  as AnioPresupuesto
,a.NOMBRE as Nivel
,b.NOMBRE as NombreEntidad
,c.sectores
,c.Clasificacion
,e.NOMBRE as NombrePrograma
,f.NOMBRE as NombreSubPrograma
,pa.NOMBRE as NombreProyectoActividad
,vp.CodigoVersion
,vp.NOMBRE as NombreVersion
,rp.CodigoFuente
,rp.CodigoObjetivo
,rp.CONTRNAC
,rp.DESEMBOLSO
,rp.PROGRAMADO
FROM minhac.NivelEntidad as a
INNER JOIN minhac.Entidades as b
on a.CODIGO=b.CodigoNivel
and a.ANIOPRESUP=b.ANIOPRESUP
inner join minhac.SectoresXEstructuraPresupuestaria as c
on a.CODIGO =c.NiveldeEntidad
and b.CodigoEntidad=c.CodigoEntidad
inner join minhac.Programa as e
on a.ANIOPRESUP=e.ANIOPRESUP
and a.CODIGO=e.CodigoNivel
and b.CodigoEntidad=e.CodigoEntidad
inner join minhac.TipoPrograma as d
on a.ANIOPRESUP=d.ANIOPRESUP
and e.CodigoTipo=d.CodigoTipo
inner join minhac.SubPrograma as f
on a.ANIOPRESUP=f.ANIOPRESUP
and a.CODIGO=f.CodigoNivel
and b.CodigoEntidad=f.CodigoEntidad
and d.CodigoTipo=f.CodigoTipo
and e.CodigoPrograma=f.CodigoPrograma
inner join minhac.ProyectoActividad as pa
on a.ANIOPRESUP=pa.ANIOPRESUP
and a.CODIGO=pa.CodigoNivel
and b.CodigoEntidad=pa.CodigoEntidad
and d.CodigoTipo=pa.CodigoTipo
and e.CodigoPrograma=pa.CodigoPrograma
inner join minhac.RubroPresupuesto as rp
on a.ANIOPRESUP=rp.ANIOPRESUP
and a.CODIGO=rp.CodigoNivel
and b.CodigoEntidad=rp.CodigoEntidad
and d.CodigoTipo=rp.CodigoTipo
and e.CodigoPrograma=rp.CodigoPrograma
and pa.CodigoProyecto=rp.CodigoProyecto
inner join minhac.VersionPresupuestal as vp
on a.ANIOPRESUP=vp.ANIOPRESUP
and rp.CodigoVersion=vp.CodigoVersion
