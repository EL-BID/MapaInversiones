
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerNombresGeografiasBeneficiadasProyecto]
	@IdProyecto INT
AS
BEGIN	


SELECT 
	CASE WHEN Ente.Tipo <> 'DEPARTAMENTO' THEN Ente.NombreMunicipio + ' (' + Ente.NombreDepartamento + ')'
			ELSE  Ente.NombreMunicipio
		END AS  NombreEntidad,
		Ente.IdDepartamento,
		Ente.IdMunicipio,
		Ente.Tipo
		
	 FROM ProyectoXEntidadTerritorial PxE (nolock)
INNER JOIN EnteTerritorial(nolock) Ente ON Ente.IdMunicipio = PxE.IdMunicipio AND Ente.IdDepartamento = PxE.IdDepartamento
	WHERE IdProyecto = @IdProyecto

--SELECT '' AS NombreActor


END

