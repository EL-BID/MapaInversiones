
create VIEW [dbo].[VwDatosAbiertosSalarios]
as
SELECT 
	Idregistro
	,NombreEntidad
	,NombreActividad
	,FechaPresupuesto
	,ValorSalario
	   ,(select fechaActualizacionFuente from FuenteDeLosRecursos where IdFuente=4)   as FechaCargueArchivo
	  ,'Ministerio de Hacienda' as  FuenteDatos
FROM 
[dbo].[VwProgramaSalarios] GC

