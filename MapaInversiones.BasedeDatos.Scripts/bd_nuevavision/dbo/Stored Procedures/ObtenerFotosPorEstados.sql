

-- =============================================
-- Author:		<BID>
-- Create date: <22/09/2019>
-- Description:	<OBTINE LAS FOTOS USUARIO>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerFotosPorEstados]
	-- Add the parameters for the stored procedure here

@IDESTADO INT,
@NUMEROPAGINA INT,
@REGPORPAGINA INT,

@TOTALREGISTROS INT OUTPUT

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	
	SET NOCOUNT ON;
	-- estado pendiente.
	IF ( @IDESTADO=1)
	BEGIN
		-- Contador.
		SELECT  @TOTALREGISTROS = COUNT(IdFotoUsuario)
		FROM FotoUsuario
		JOIN Proyecto 
		ON  FotoUsuario.IdProyecto = Proyecto.IdProyecto
		JOIN Usuario 
		ON FotoUsuario.IdUsuario = Usuario.IdUsuario
		LEFT JOIN EnteTerritorial 
		ON FotoUsuario.IdDepartamento = EnteTerritorial.IdDepartamento AND FotoUsuario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE (FotoUsuario.Aprobado = 0 AND FotoUsuario.Eliminado = 0)

		-- Procedimiento
			SELECT *
			FROM (SELECT ROW_NUMBER() OVER (ORDER BY Fecha) NUMBER,*
			from 
				(
				SELECT FotoUsuario.Descripcion,
				FotoUsuario.RutaFotoGrande,
				FotoUsuario.RutaFotoPequeno,
				FotoUsuario.IdFotoUsuario,
				FotoUsuario.Fecha,
				FotoUsuario.IdDepartamento,
				FotoUsuario.IdMunicipio,
				proyecto.IdProyecto,
				proyecto.NombreProyecto,
				Usuario.IdUsuario,
				Usuario.Nombre,
				EnteTerritorial.NombreMunicipio,
				EnteTerritorial.NombreDepartamento
		FROM FotoUsuario
		JOIN Proyecto 
		ON  FotoUsuario.IdProyecto = Proyecto.IdProyecto
		JOIN Usuario
		ON FotoUsuario.IdUsuario = Usuario.IdUsuario
		LEFT JOIN EnteTerritorial 
		ON FotoUsuario.IdDepartamento = EnteTerritorial.IdDepartamento AND FotoUsuario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE (FotoUsuario.Aprobado = 0 AND FotoUsuario.Eliminado = 0)
			) TBL)TBL
		WHERE NUMBER BETWEEN ((@NUMEROPAGINA - 1) * @REGPORPAGINA + 1) AND (@NUMEROPAGINA * @REGPORPAGINA)
	END
	-- estado APROBADA.
	IF ( @IDESTADO=2)
	BEGIN
		-- Contador.
		SELECT  @TOTALREGISTROS = COUNT(IdFotoUsuario)
		FROM FotoUsuario
		JOIN Proyecto 
		ON  FotoUsuario.IdProyecto = Proyecto.IdProyecto
		JOIN Usuario 
		ON FotoUsuario.IdUsuario = Usuario.IdUsuario
		LEFT JOIN EnteTerritorial 
		ON FotoUsuario.IdDepartamento = EnteTerritorial.IdDepartamento AND FotoUsuario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE (FotoUsuario.Aprobado = 1 AND FotoUsuario.Eliminado = 0)

		-- Procedimiento
			SELECT *
			FROM (SELECT ROW_NUMBER() OVER (ORDER BY Fecha) NUMBER,*
			from 
				(
				SELECT FotoUsuario.Descripcion,
				FotoUsuario.RutaFotoGrande,
				FotoUsuario.RutaFotoPequeno,
				FotoUsuario.IdFotoUsuario,
				FotoUsuario.Fecha,
				FotoUsuario.IdDepartamento,
				FotoUsuario.IdMunicipio,
				proyecto.IdProyecto,
				proyecto.NombreProyecto,
				Usuario.IdUsuario,
				Usuario.Nombre,
				EnteTerritorial.NombreMunicipio,
				EnteTerritorial.NombreDepartamento
		FROM FotoUsuario
		JOIN Proyecto 
		ON  FotoUsuario.IdProyecto = Proyecto.IdProyecto
		JOIN Usuario
		ON FotoUsuario.IdUsuario = Usuario.IdUsuario
		LEFT JOIN EnteTerritorial 
		ON FotoUsuario.IdDepartamento = EnteTerritorial.IdDepartamento AND FotoUsuario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE (FotoUsuario.Aprobado = 1 AND FotoUsuario.Eliminado = 0)
			) TBL)TBL
		WHERE NUMBER BETWEEN ((@NUMEROPAGINA - 1) * @REGPORPAGINA + 1) AND (@NUMEROPAGINA * @REGPORPAGINA)
	END
	-- estado ELIMINADA.
	IF ( @IDESTADO=3)
	BEGIN
		-- Contador.
		SELECT  @TOTALREGISTROS = COUNT(IdFotoUsuario)
		FROM FotoUsuario
		JOIN Proyecto 
		ON  FotoUsuario.IdProyecto = Proyecto.IdProyecto
		JOIN Usuario 
		ON FotoUsuario.IdUsuario = Usuario.IdUsuario
		LEFT JOIN EnteTerritorial 
		ON FotoUsuario.IdDepartamento = EnteTerritorial.IdDepartamento AND FotoUsuario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE (FotoUsuario.Aprobado = 0 AND FotoUsuario.Eliminado = 1)

		-- Procedimiento
			SELECT *
			FROM (SELECT ROW_NUMBER() OVER (ORDER BY Fecha) NUMBER,*
			from 
				(
				SELECT FotoUsuario.Descripcion,
				FotoUsuario.RutaFotoGrande,
				FotoUsuario.RutaFotoPequeno,
				FotoUsuario.IdFotoUsuario,
				FotoUsuario.Fecha,
				FotoUsuario.IdDepartamento,
				FotoUsuario.IdMunicipio,
				proyecto.IdProyecto,
				proyecto.NombreProyecto,
				Usuario.IdUsuario,
				Usuario.Nombre,
				EnteTerritorial.NombreMunicipio,
				EnteTerritorial.NombreDepartamento
		FROM FotoUsuario
		JOIN Proyecto 
		ON  FotoUsuario.IdProyecto = Proyecto.IdProyecto
		JOIN Usuario
		ON FotoUsuario.IdUsuario = Usuario.IdUsuario
		LEFT JOIN EnteTerritorial 
		ON FotoUsuario.IdDepartamento = EnteTerritorial.IdDepartamento AND FotoUsuario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE (FotoUsuario.Aprobado = 0 AND FotoUsuario.Eliminado = 1)
			) TBL)TBL
		WHERE NUMBER BETWEEN ((@NUMEROPAGINA - 1) * @REGPORPAGINA + 1) AND (@NUMEROPAGINA * @REGPORPAGINA)
	END
END
