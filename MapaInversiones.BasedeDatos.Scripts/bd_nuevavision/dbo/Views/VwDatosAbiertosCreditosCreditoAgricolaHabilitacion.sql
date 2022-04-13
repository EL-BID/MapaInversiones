


create view [dbo].[VwDatosAbiertosCreditosCreditoAgricolaHabilitacion]
as
(

select 

--vista [PISGR_PY_COVID19].[dbo].[VwProyeccionProgramasRecursosLeyEmergencia]
b.Nivel,
b.CodigoEntidad,
b.Entidad,
b.ClasePrograma,
b.CodigoPrograma,
b.NombrePrograma,
b.CodigoProyecto,
b.NombreActividadProyecto,


--propios
a.FondoTipo as TipoFondo, --revisar si esta columna esta bien asi.
a.DistribucionGerencia,
a.DistribucionCodigoDelDepartamento,
a.DistribucionDepartamento,
a.DistribucionSucursal,
a.Sector,
a.Importe as ValorSubsidio,
a.Nuevo as CantidadSubsidio,
FechaCargue as FechaCargueArchivo,
'Dirección de Presupuesto - Ministerio de Hacienda - Programas Sustantivos Asociadas COVID19' as FuenteDatos

from 
[dbo].TmpCahCreditosOtorgadosPresupuestoPropioInstitucional a 
	left join 
	[PISGR_PY_COVID19].[dbo].[VwProyeccionProgramasRecursosLeyEmergencia] b
	on 
		a.codigoprogramaNegocio = b.codigoprogramaNegocio and
		a.CodigoProyecto = b.CodigoProyecto

)
union all
(



select top 10 

--vista [PISGR_PY_COVID19].[dbo].[VwProyeccionProgramasRecursosLeyEmergencia]
b.Nivel,
b.CodigoEntidad,
b.Entidad,
b.ClasePrograma,
b.CodigoPrograma,
b.NombrePrograma,
b.CodigoProyecto,
b.NombreActividadProyecto,

--propios
a.FondoTipo as TipoFondo, --revisar si esta columna esta bien asi.
a.DistribucionGerencia,
a.DistribucionCodigoDelDepartamento,
a.DistribucionDepartamento,
a.DistribucionSucursal,
a.Sector,
a.Importe as ValorSubsidio,
a.Entregado as CantidadSubsidio,
convert(varchar, FechaCargue, 21) as FechaCargueArchivo,
'Dirección de Presupuesto - Ministerio de Hacienda - Programas Sustantivos Asociadas COVID19' as FuenteDatos

from 
[dbo].TmpCreditosOtorgadosFondoCovidPrograma21DeCreditoAgricolaDeHabilitacion a 
	left join 
	[PISGR_PY_COVID19].[dbo].[VwProyeccionProgramasRecursosLeyEmergencia] b
	on 
		a.codigoprogramaNegocio = b.codigoprogramaNegocio and
		a.CodigoProyecto = b.CodigoProyecto




)
