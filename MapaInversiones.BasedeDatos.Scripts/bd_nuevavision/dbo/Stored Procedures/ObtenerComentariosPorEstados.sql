


CREATE PROCEDURE [dbo].[ObtenerComentariosPorEstados]
	-- Add the parameters for the stored procedure here

@IDESTADO INT,
@IDASOCIACION INT,
@TIPOCOMENTARIO INT,
@NUMEROPAGINA INT,
@REGPORPAGINA INT,

@TOTALREGISTROS INT OUTPUT

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	-- con respuestas
	
		SELECT  @TOTALREGISTROS = COUNT(IdComentario)
		FROM Comentario
		INNER JOIN Usuario
				ON Comentario.IdUsuario = Usuario.IdUsuario
			INNER JOIN EstadoComentario
				ON Comentario.IdEstado = EstadoComentario.Id
			INNER JOIN TipoComentario
				ON Comentario.IdTipoComentario = TipoComentario.Id
			LEFT JOIN Proyecto 
				ON Comentario.IdProyecto = proyecto.IdProyecto
			LEFT JOIN EnteTerritorial 
				ON Comentario.IdDepartamento = EnteTerritorial.IdDepartamento AND Comentario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE 
			(Comentario.IdEstado = @IDESTADO OR @IDESTADO=0)
			AND (Comentario.IdAsociacion = @IDASOCIACION OR @IDASOCIACION=0)
			AND (Comentario.IdTipoComentario = @TIPOCOMENTARIO OR @TIPOCOMENTARIO=0)
			AND comentario.ComentarioRelacionado is null

		

		SELECT *
			FROM (SELECT ROW_NUMBER() OVER (ORDER BY IdEstado, fechaCreacion ) NUMBER,*
			from 
				(
				SELECT Usuario.IdUsuario,
				Usuario.Nombre,
				RolUsuario.NombreRol,
				GeneroUsuario.NombreGenero,
				Usuario.email,
				Comentario.fechaCreacion,
				Comentario.ComentarioOriginal,
				Comentario.ComentarioModerado,
				Comentario.IdTipoRespuesta,
				Comentario.ComentarioRelacionado,
				Comentario.IdEstado,
				Comentario.IdComentario,
				EstadoComentario.EstadoComentario,
				Comentario.IdAsociacion,
				Comentario.IdPrograma,
				Programa.NombrePrograma,
				Comentario.CodigoContrato,
				Comentario.IdProyecto,
				proyecto.NombreProyecto,
				Comentario.Anonimo,
				Comentario.IdTipoComentario,
				TipoComentario.TipoComentario,
				Comentario.IdDepartamento,
				Comentario.IdMunicipio,
				Comentario.CodEnteTerritorialBeneficiario,
				EnteTerritorial.NombreMunicipio AS NombreMunicipio,
				EnteTerritorial.NombreDepartamento AS NombreDepartamento
		FROM Comentario 
			INNER JOIN Usuario
				ON Comentario.IdUsuario = Usuario.IdUsuario
			INNER JOIN RolUsuario
				ON Usuario.IdRolUsuario = RolUsuario.IdRolUsuario
			INNER JOIN GeneroUsuario
				ON Usuario.IdGeneroUsuario = GeneroUsuario.IdGeneroUsuario
			INNER JOIN EstadoComentario
				ON Comentario.IdEstado = EstadoComentario.Id
			INNER JOIN TipoComentario
				ON Comentario.IdTipoComentario = TipoComentario.Id
			LEFT JOIN Proyecto 
				ON Comentario.IdProyecto = proyecto.IdProyecto
			LEFT JOIN VwProgramaCifrasConsolidadasCovid programa
				ON Comentario.IdPrograma = Programa.CodigoPrograma
			LEFT JOIN EnteTerritorial 
				ON Comentario.IdDepartamento = EnteTerritorial.IdDepartamento AND Comentario.IdMunicipio = EnteTerritorial.IdMunicipio
		WHERE 
			(Comentario.IdEstado = @IDESTADO OR @IDESTADO=0)
			AND (Comentario.IdAsociacion = @IDASOCIACION OR @IDASOCIACION=0)
			AND (Comentario.IdTipoComentario = @TIPOCOMENTARIO OR @TIPOCOMENTARIO=0)
			AND comentario.ComentarioRelacionado is null
			) TBL)TBL
		WHERE NUMBER BETWEEN ((@NUMEROPAGINA - 1) * @REGPORPAGINA + 1) AND (@NUMEROPAGINA * @REGPORPAGINA)
		union
		SELECT  0 as NUMBER,
				Usuario.IdUsuario,
				Usuario.Nombre,
				RolUsuario.NombreRol,
				GeneroUsuario.NombreGenero,
				Usuario.email,
				Comentario.fechaCreacion,
				Comentario.ComentarioOriginal,
				Comentario.ComentarioModerado,
				Comentario.IdTipoRespuesta,
				Comentario.ComentarioRelacionado,
				Comentario.IdEstado,
				Comentario.IdComentario,
				EstadoComentario.EstadoComentario,
				Comentario.IdAsociacion,
				Comentario.IdPrograma,
				Programa.NombrePrograma,
				Comentario.CodigoContrato,
				Comentario.IdProyecto,
				proyecto.NombreProyecto,
				Comentario.Anonimo,
				Comentario.IdTipoComentario,
				TipoComentario.TipoComentario,
				Comentario.IdDepartamento,
				Comentario.IdMunicipio,
				Comentario.CodEnteTerritorialBeneficiario,
				EnteTerritorial.NombreMunicipio AS NombreMunicipio,
				EnteTerritorial.NombreDepartamento AS NombreDepartamento
		FROM Comentario 
			inner join (SELECT *
							FROM (SELECT ROW_NUMBER() OVER (ORDER BY IdEstado, fechaCreacion ) NUMBER,*
							from 
								(
								SELECT 
								Comentario.IdEstado,
								Comentario.fechaCreacion,
								Comentario.IdComentario								
								FROM Comentario 
								WHERE 
									(Comentario.IdEstado = @IDESTADO OR @IDESTADO=0)
									AND (Comentario.IdAsociacion = @IDASOCIACION OR @IDASOCIACION=0)
									AND (Comentario.IdTipoComentario = @TIPOCOMENTARIO OR @TIPOCOMENTARIO=0)
									AND comentario.ComentarioRelacionado is null
									) TBL)TBL
						WHERE NUMBER BETWEEN ((@NUMEROPAGINA - 1) * @REGPORPAGINA + 1) AND (@NUMEROPAGINA * @REGPORPAGINA)) as a
			on Comentario.ComentarioRelacionado = a.IdComentario 
			INNER JOIN Usuario
				ON Comentario.IdUsuario = Usuario.IdUsuario
			INNER JOIN RolUsuario
				ON Usuario.IdRolUsuario = RolUsuario.IdRolUsuario
			INNER JOIN GeneroUsuario
				ON Usuario.IdGeneroUsuario = GeneroUsuario.IdGeneroUsuario
			INNER JOIN EstadoComentario
				ON Comentario.IdEstado = EstadoComentario.Id
			INNER JOIN TipoComentario
				ON Comentario.IdTipoComentario = TipoComentario.Id
			LEFT JOIN Proyecto 
				ON Comentario.IdProyecto = proyecto.IdProyecto
			LEFT JOIN VwProgramaCifrasConsolidadasCovid programa
				ON Comentario.IdPrograma = Programa.CodigoPrograma
			LEFT JOIN EnteTerritorial 
				ON Comentario.IdDepartamento = EnteTerritorial.IdDepartamento AND Comentario.IdMunicipio = EnteTerritorial.IdMunicipio
END
