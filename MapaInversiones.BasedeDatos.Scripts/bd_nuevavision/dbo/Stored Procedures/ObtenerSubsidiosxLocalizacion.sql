
CREATE PROCEDURE [dbo].[ObtenerSubsidiosxLocalizacion]
as
BEGIN
	--SELECT  S.[IdSubsidio]
	--,S.[IdDepartamento]
	--,S.[NombreDepartamento]
	--,S.[IdMunicipio]
	--,S.[NombreMunicipio]
	--,S.[CaracteristicaSubsidio]
	--,S.[ClaseSubsidio]
	--,S.[ValorSubsidio]
	--,S.[CantidadSubsidio]
	--,S.[GeoJson]
	--,A.Geojson AS GeojsonDepto
	--,C.Latitud
	--,C.LONGITUD
	--,C.PuntoUbicacion
	--FROM [PISGR_PY_COVID19].[dbo].[VwSubsidiosxLocalizacion] S
	--left JOIN [dbo].[CabeceraMunicipio] C ON S.IdMunicipio = C.CodigoDane
	--INNER JOIN (SELECT [GeoJson],IdDepartamento FROM ENTETERRITORIAL WHERE  Tipo='DEPARTAMENTO' ) A
	--ON A.IdDepartamento = S.IdDepartamento
	--where C.Latitud is not null and C.LONGITUD is not null

	SELECT  S.[IdSubsidio]
	,S.[IdDepartamento]
	,S.[NombreDepartamento]
	,'' AS IdMunicipio
	,'' AS NombreMunicipio
	,'' AS CaracteristicaSubsidio
	,'' AS ClaseSubsidio
	,SUM(S.[ValorSubsidio]) as ValorSubsidio
	,SUM(S.[CantidadSubsidio]) as CantidadSubsidio
	,'' AS GeoJson
	,'' AS GeojsonDepto
	,A.Latitud
	,A.LONGITUD
	,'' PuntoUbicacion
	FROM [PISGR_PY_COVID19].[dbo].[VwSubsidiosxLocalizacion] S
	INNER JOIN 
	(
		SELECT DEPARTAMENTO, LATITUD , LONGITUD
		FROM [CABECERAMUNICIPIO] L
		WHERE CODIGODANE = (SELECT TOP 1 LG.CODIGODANE FROM [CABECERAMUNICIPIO] LG
		WHERE LG.DEPARTAMENTO = L.DEPARTAMENTO ORDER BY LG.CODIGODANE DESC)
	) A ON A.DEPARTAMENTO = S.[NombreDepartamento]
	GROUP BY S.[IdSubsidio]
	,S.[IdDepartamento]
	,S.[NombreDepartamento]
	,A.Latitud
	,A.LONGITUD

END

