



CREATE VIEW [dbo].[VwProgramaIndicadoresCovid]
as
select cast(isnull(a.codigoprogramaNegocio,0) as int) as codigoprograma
,a.Nivel
,a.CodigoEntidad
,a.ClasePrograma
,a.CodigoSubPrograma
,a.CodigoProyecto
,a.EsProgramaCovid
,cast(a.CodigoPrograma as varchar(3))+'. '+a.NombrePrograma as NombrePrograma
,b.Anio
,b.CodigoIndicador
,b.NombreIndicador
,b.MetaIndicador
,b.AvanceIndicador
,b.DenominadorIndicador
,b.PorcentajeMeta
,b.PorcentajeAvance
,b.TipoIndicador
,b.TamanoIndicador
,b.Tipo2Indicador
,b.FecuenciaIndicador
from Programa as a
inner join Indicadores as b
on a.Id =b.IdPrograma
 where CodigoIndicador not in (1085,1086,1088,1091,1092)
