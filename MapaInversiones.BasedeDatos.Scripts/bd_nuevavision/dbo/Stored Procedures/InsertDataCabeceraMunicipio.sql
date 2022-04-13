
-- =============================================
-- Author:		David Olaciregui
-- Create date: 05-03-2017
-- Description:	Cargar cabecera municipal
-- =============================================
CREATE PROCEDURE [dbo].[InsertDataCabeceraMunicipio] 
@NombreDepartamento nvarchar(4000)
,@NombreMunicipio nvarchar(4000)
,@Latitud decimal(18,10)
,@Longitud decimal(18,10)
,@CodigoDane varchar(10)
,@PuntoUbicacion geography
AS
BEGIN
	SET NOCOUNT ON;

INSERT INTO [dbo].[CabeceraMunicipio]
           ([DEPARTAMENTO]
           ,[MUNICIPIO]
           ,[Latitud]
           ,[LONGITUD]
           ,[CodigoDane]
           ,[PuntoUbicacion])
     VALUES
           (UPPER(@NombreDepartamento)
			,UPPER(@NombreMunicipio)
			,@Latitud
			,@Longitud
			,@CodigoDane
			,@PuntoUbicacion)

END

