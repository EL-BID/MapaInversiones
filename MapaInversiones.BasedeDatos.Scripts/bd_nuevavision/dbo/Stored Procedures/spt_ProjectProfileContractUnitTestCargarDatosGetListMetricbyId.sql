
CREATE procedure [dbo].[spt_ProjectProfileContractUnitTestCargarDatosGetListMetricbyId]
(
    @IdProyecto int
)
as 


select pr.IdProducto as idProducto, pr.NombreProducto,year(m.FechaInicioMeta) as año,sum(m.ValorMeta) as valor_meta, sum(s.ValorReportado) as valor_reportado, cast(100.0*sum(s.ValorReportado)/sum(m.ValorMeta) as numeric(5,2)) as porcentaje
from Proyecto p
join ObjetivoEspecifico o
on p.IdProyecto = o.IdProyecto
join Producto pr 
on o.IdObjetivoEspecifico = pr.IdObjetivoEspecifico
join MetaIndicadorProducto m  on pr.IdProducto = m.idProducto
left join SeguimientoMetaIndicadorProducto s on  s.IdProducto = pr.IdProducto
where p.IdProyecto = @IdProyecto
group by pr.IdProducto, pr.NombreProducto, year(m.FechaInicioMeta)







