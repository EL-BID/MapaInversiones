
CREATE VIEW [dbo].[VwSubsidiosxLocalizacion]
as
SELECT [IdSubsidio]
      ,[IdDepartamento]
      ,Replace([NombreDepartamento],'PROYECTOS NACIONALES','subsidios sin localización') AS [NombreDepartamento]
      ,[IdMunicipio]
      ,[NombreMunicipio]
      ,[CaracteristicaSubsidio]
      ,[ClaseSubsidio]
      ,[ValorSubsidio]
      ,[CantidadSubsidio]
      ,[GeoJson]
  FROM [dbo].[VwSubsidiosxLocalizacionTable]
  
  
