-- =============================================
-- Author:		Yully Arias Castillo - iT Synergy
-- Create date: 20 de Junio de 2013
-- Description:	Procedimiento almacenado que obtiene la latitud y longitud de un ente territorial.
-- =============================================
CREATE PROCEDURE [dbo].[sp_UbicacionGeograficaPorEnteTerritorial]
	@IdMunicipio varchar(10) = NULL,
	@IdDepartamento varchar(10) = NULL,
	@IdRegion varchar(10) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    
	SELECT TOP 1
	CASE 
		WHEN @IdMunicipio IS NOT  NULL THEN ET.NombreMunicipio 
		WHEN @IdDepartamento IS NOT NULL THEN ET.NombreDepartamento
		WHEN @IdRegion IS NOT NULL THEN  ET.NombreRegion
	END NombreEntidad,
	CM.Latitud Latitud, 
	CM.Longitud Longitud, 
	CM.PuntoUbicacion PuntoUbicacion 
	FROM dbo.EnteTerritorial ET
		INNER JOIN CabeceraMunicipio CM  ON (ET.IdMunicipio = CM.CodigoDane )
	WHERE (CM.CodigoDane = @IdMunicipio OR @IdMunicipio IS NULL)
    AND ((CM.CodigoDane IN (SELECT IdMunicipio FROM EnteTerritorial WHERE IdDepartamento = @IdDepartamento AND Tipo= 'DEPARTAMENTO')) OR @IdDepartamento IS NULL )
	AND ((CM.CodigoDane IN (SELECT IdMunicipio FROM EnteTerritorial WHERE IdRegion = @IdRegion AND Tipo= 'REGION')) OR @IdRegion IS NULL )

END



