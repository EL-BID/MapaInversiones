
/****** Script for SelectTopNRows command from SSMS  ******/
CREATE view [dbo].[VwDatosAbiertosProgramasSubsidios_Pytyvo]
as
SELECT c.codigoNivel,
	  c.CodigoEntidad
	  ,c.NombreEntidad
	  ,c.CodigoClasePograma
	  ,c.CodigoPrograma
	  ,c.NombrePrograma
	  ,c.NombreActividad
	  ,[IdSubsidio] as tipoSubsidioPrograma
	  ,'SUBSIDIO PARA BONOS ALIMENTICIOS A FAMILIAS (Pytyvo)' as  TipoSubsidio
	  ,[CaracteristicaSubsidio]
	  ,d.[IdDepartamento] 
	  ,d.NombreDepartamento
      ,d.[IdMunicipio]
	  ,d.NombreMunicipio
      ,[CEDULA] as NumeroDocumento
      ,[NOMBRE Y APELLIDO] as NombreBeneficiario
	  ,[Valor]
      ,[cantidad]  
	  ,'2020-05-10' as FechaCargueArchivo
	  ,'Ministerio de Hacienda - Subsidios' as  FuenteDatos
    --select COUNT(*) --908.365
  FROM [PISGR_PY_COVID19].[dbo].[Subsidios_Pytyvo] as a 
  left join (select b.codigoNivel,b.codigoEntidad,b.CodigoClasePograma,b.codigoprograma,b.NombreEntidad,b.NombrePrograma,b.NombreActividad
  , cONCAT(b.codigoNivel,codigoEntidad,CodigoClasePograma,codigoprograma) as idprograma
   from EstructuraEntidades as b
   where NombreActividad='SUBSIDIO PARA BONOS ALIMENTICIOS A FAMILIAS'
   group by b.codigoNivel,codigoEntidad,b.CodigoClasePograma,b.codigoprograma,b.NombreEntidad,b.NombrePrograma,b.NombreActividad
   ,cONCAT(b.codigoNivel,codigoEntidad,CodigoClasePograma,codigoprograma)) as c
  on a.IdPrograma= c.idprograma
  left join [PISGR_PY_COVID19].[dbo].[EnteTerritorial] as d
  on a.idmunicipio=d.idmunicipio
  and a.[IdDepartamento]=d.[IdDepartamento]
