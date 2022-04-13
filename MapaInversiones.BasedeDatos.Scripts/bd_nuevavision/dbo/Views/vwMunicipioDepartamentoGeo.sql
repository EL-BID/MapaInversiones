
create view [dbo].[vwMunicipioDepartamentoGeo] as

SELECT

-- municipio
	 m.[IdMunicipio]
	,m.[NombreMunicipio]
	,m.[GeoPoligonoEntidadTerritorial]
	--necesitas pasar de geography a geometry, que sean validas, y obtener el pointonsurface para extraer el Ylat y Xlong.
	, GEOMETRY::STGeomFromText(m.[GeoPoligonoEntidadTerritorial].STAsText(),4326).MakeValid().STPointOnSurface().STY geomlat
	, GEOMETRY::STGeomFromText(m.[GeoPoligonoEntidadTerritorial].STAsText(),4326).MakeValid().STPointOnSurface().STX geomlong
	,m.[CodigoDANE]
	--bbox
	,m.[TopLeft]
	,m.[BottomRight]
	,m.[Tipo]
	,m.[Version]
	,m.[Geojson]
	,m.[IdDepartamento]
	,m.[FechaUltimaModificacion]
--departamento
	,d.[NombreDepartamento]
	,
	case
	
	
	
when d.[NombreDepartamento] = 'CAAZAPA' then 'Departamento de CAAZAPÁ'
when d.[NombreDepartamento] = 'ASUNCION' then 'DISTRITO CAPITAL'
when d.[NombreDepartamento] = 'CONCEPCION' then 'Departamento de CONCEPCIÓN'
when d.[NombreDepartamento] = 'SAN PEDRO' then 'Departamento de SAN PEDRO'
when d.[NombreDepartamento] = 'CANINDEYU' then 'Departamento de CANINDEYÚ'
when d.[NombreDepartamento] = 'GUAIRA' then 'Departamento de GUAIRÁ'
when d.[NombreDepartamento] = 'CAAGUAZU' then 'Departamento de CAAGUAZÚ'
when d.[NombreDepartamento] = 'CAAZAPA' then 'Departamento de CAAZAPÁ'
when d.[NombreDepartamento] = 'ITAPUA' then 'Departamento de ITAPÚA'
when d.[NombreDepartamento] = 'PARAGUARI' then 'Departamento de PARAGUARÍ'
when d.[NombreDepartamento] = 'ALTO PARANA' then 'Departamento de ALTO PARANÁ'
when d.[NombreDepartamento] = 'ÑEEMBUCU' then 'Departamento de ÑEEMBUCÚ'
when d.[NombreDepartamento] = 'AMAMBAY' then 'AMAMBAY'
when d.[NombreDepartamento] = 'BOQUERON' then 'Departamento de BOQUERÓN'


	else d.[NombreDepartamento]
	end
	+', Paraguay' deptopais
  FROM 
  --select * into Municipio from [PISGR_DWH_PY].[dbo].[Municipio]
  Municipio  m
  JOIN
  --select * into Departamento from [PISGR_DWH_PY].[dbo].Departamento
  Departamento d on m.IdDepartamento = d.IdDepartamento
  --que tenga geometrias
  where m.[GeoPoligonoEntidadTerritorial] is not null

