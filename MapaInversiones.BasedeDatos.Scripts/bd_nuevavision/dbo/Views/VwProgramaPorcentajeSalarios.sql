


CREATE   view [dbo].[VwProgramaPorcentajeSalarios]
as
select ISNULL(ROW_NUMBER() OVER(
       ORDER BY a.id),0) AS Idregistro
		,isnull(ValorSalarios,0) as ValorSalarios
		,isnull((ValorPresupuestaria +ValorSalarios),0) as ValorPresupuestaria
		,iif((ValorPresupuestaria +ValorSalarios)=0,0,(ValorSalarios/(ValorPresupuestaria +ValorSalarios)) )*100 as porcentaje
from 
	(select 1 as id , sum (avanceprogramaxObjeto) as ValorPresupuestaria from
	  [VwProyeccionProgramasRecursosLeyEmergencia]
		where CodigoObjeto >199 or CodigoObjeto between 1 and 99
		and entidad not in   ('MINISTERIO DE HACIENDA',
							'MINISTERIO DE JUSTICIA','MINISTERIO DE OBRAS PÚBLICAS Y COMUNICACIONES')
		) as A
inner join 
	(SELECT 1 as id, sum([Ejecutado])  ValorSalarios  
	FROM [PISGR_PY_COVID19].[dbo].[ProgramaSalarios]
	where CodigoEntidad not in (6,9,13)
	) as B
on A.id=B.id

