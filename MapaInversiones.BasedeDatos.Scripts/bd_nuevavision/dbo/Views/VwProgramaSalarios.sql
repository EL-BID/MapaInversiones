



--/****** Object:  View [dbo].[VwProgramaSalarios]    Script Date: 6/24/2020 7:42:03 PM ******/
--SET ANSI_NULLS ON
--GO

--SET QUOTED_IDENTIFIER ON
--GO

CREATE view [dbo].[VwProgramaSalarios]
as

SELECT ISNULL(ROW_NUMBER() OVER(
       ORDER BY FechaPresupuesto),0) AS Idregistro,  
	   b.NombreEntidad,b.NombreActividad
	   , ISNULL(cast(a.FechaPresupuesto as  datetime),GETDATE()) as FechaPresupuesto,sum(a.Ejecutado)/1000000 as ValorSalario, 
	   cast(a.CodigoNivel as varchar(10)) + '-'  + cast(a.CodigoEntidad as varchar(10)) as IdEntidad
from [dbo].[ProgramaSalarios] as a
inner join
( select CodigoNivel,CodigoEntidad,claseprograma,CodigoPrograma,CodigoActividad,CodigoObjetoGasto
	,CodigoFuenteFinanciamiento,CodigoOrganismoFinanciador,CodigoClasePograma
	,case when NombreEntidad='UNIVERSIDAD NACIONAL DE ASUNCIÓN' then 'UNIVERSIDAD NACIONAL DE ASUNCIÓN – HOSPITAL DEL CLÍNICAS' else NombreEntidad end as NombreEntidad,NombreActividad
	from [PISGR_PY_COVID19].[dbo].[EstructuraEntidades]  as z
	group by CodigoNivel,CodigoEntidad,claseprograma,CodigoPrograma,CodigoActividad,CodigoObjetoGasto
	,CodigoFuenteFinanciamiento,CodigoOrganismoFinanciador,CodigoClasePograma
	,NombreEntidad,NombreActividad
)
as b
on a.CodigoNivel=b.CodigoNivel
and a.CodigoEntidad=b.CodigoEntidad
and a.claseprograma=b.CodigoClasePograma
and a.CodigoPrograma=b.CodigoPrograma
and a.codigoProyectoActividad=b.CodigoActividad
and a.objetodegasto=b.CodigoObjetoGasto
and a.fuente=b.CodigoFuenteFinanciamiento
and a.organismoFinanciador=b.CodigoOrganismoFinanciador
where NombreEntidad not in ('MINISTERIO DE HACIENDA',
							'MINISTERIO DE JUSTICIA', 'MINISTERIO DE OBRAS PÚBLICAS Y COMUNICACIONES')
group by b.NombreEntidad,b.NombreActividad,a.FechaPresupuesto, a.CodigoNivel,a.CodigoEntidad
having SUM(a.Ejecutado)>0


