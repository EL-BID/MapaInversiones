
CREATE VIEW [dbo].[VwDatosAbiertosProgramasSubsidios]
as

Select  
 Nivel
 ,CodigoEntidad
 ,Entidad
 ,ClasePrograma
 ,CodigoPrograma
 ,NombrePrograma
 ,CodigoProyectoActividad
 ,NombreActividadProyecto
 ,[TipoSubsidioPrograma]
 ,[NumeroDocumento]
 ,[NombreBeneficiario],
IdDepartamento, 
NombreDepartamento,
IdMunicipio, 
NombreMunicipio,
CaracteristicaSubsidio,
TipoSubsidio,
ValorSubsidio, 
CantidadSubsidio,
[FechaModificacion] as [FechaCargueArchivo],
'Secretaría de Emergencia Nacional - Subsidios' as [FuenteDatos]
from (
SELECT 
 [IdNivel] AS Nivel
     ,IdEntidad as CodigoEntidad
	 ,e.Entidad
 ,p.ClasePrograma
 ,p.CodigoPrograma
,p.NombrePrograma
 ,p.CodigoProyecto as CodigoProyectoActividad
 ,p.NombreActividadProyecto
 ,[TipoSubsidioPrograma]
,[NumeroDocumento]
      ,[NombreBeneficiario]
      ,[CodigoDepartamento] AS IdDepartamento
	  ,[NombreDepartamento]
	  ,[CodigoDistrito] AS Idmunicipio
	  ,[NombreDistrito] AS NombreMunicipio
	 ,[CaracteristicaSubsidio]
	   ,'SUBSIDIO PARA BONOS ALIMENTICIOS A FAMILIAS (Ñangareko)' as TipoSubsidio
	,[TipoKit],
     [ValorSubsidio]
      ,[CantidadSubsidio]
       ,[FechaModificacion]
  FROM [dbo].[Subsidios] s
     inner join (
  SELECT  DISTINCT [CodigoNivel]
      ,cast ([CodigoEntidad] as int) as CodigoEntidad,
      cast([NombreEntidad] as varchar(60)) as Entidad
     
  FROM [dbo].[EstructuraEntidades] E)E
  on E.CodigoEntidad=s.IdEntidad AND s.IdNivel=E.CodigoNivel
 inner join [dbo].[Programa] p
 on p.[codigoprogramaNegocio]= CONCAT(IdNivel,IdEntidad,S.Claseprograma,IdPrograma) and Replace(IdActividad,0,1)=p.CodigoProyecto
  --where CaracteristicaSubsidio like '%Transferencia%'
  )T
 

