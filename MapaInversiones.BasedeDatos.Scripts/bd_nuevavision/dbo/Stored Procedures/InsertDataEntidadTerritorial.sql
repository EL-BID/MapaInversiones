
-- =============================================
-- Author:		David Olaciregui
-- Create date: 05-03-2017
-- Description:	Cargar entidad territorial
-- =============================================
CREATE PROCEDURE [dbo].[InsertDataEntidadTerritorial] 
@IdRegion varchar(10)
,@IdDepartamento varchar(10)
,@IdMunicipio varchar(10)
,@NombreRegion varchar(50)
,@NombreDepartamento varchar(50)
,@NombreMunicipio varchar(50)
,@GeoPoligonoEntidadTerritorial geography
,@CodigoDANE varchar(15)
,@ConsecutivoCarga int
,@TopLef geography
,@BottomRight geography
,@Tipo varchar(50)
,@Version int
,@Centroide geography
,@Geojson varchar(max)
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO [dbo].[EnteTerritorial]
           ([IdRegion]
           ,[IdDepartamento]
           ,[IdMunicipio]
           ,[NombreRegion]
           ,[NombreDepartamento]
           ,[NombreMunicipio]
           ,[GeoPoligonoEntidadTerritorial]
           ,[CodigoDANE]
           ,[FechaUltimaModificacion]
           ,[Modificadopor]
           ,[ConsecutivoCarga]
           ,[TopLeft]
           ,[BottomRight]
           ,[Tipo]
           ,[Version]
           ,[Centroide]
           ,[Geojson])
     VALUES
           (@IdRegion 
			,@IdDepartamento 
			,@IdMunicipio
			,UPPER(@NombreRegion)
			,UPPER(@NombreDepartamento)
			,UPPER(@NombreMunicipio)
			,@GeoPoligonoEntidadTerritorial
			,@CodigoDANE
			,GETDATE()
			,'DbAdmin'
			,1
			,@TopLef
			,@BottomRight
			,@Tipo
			,@Version
			,@Centroide
			,@Geojson)

END

