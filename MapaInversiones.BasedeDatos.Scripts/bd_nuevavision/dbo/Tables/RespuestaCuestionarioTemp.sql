CREATE TABLE [dbo].[RespuestaCuestionarioTemp] (
    [IdRespuesta]         INT            NOT NULL,
    [IdUsuario]           INT            NOT NULL,
    [Idpregunta]          INT            NOT NULL,
    [IdOpcionRespuesta]   INT            NULL,
    [Fecha]               DATETIME       NULL,
    [IdProyecto]          INT            NOT NULL,
    [IdDepartamento]      VARCHAR (10)   NOT NULL,
    [IdMunicipio]         VARCHAR (10)   NOT NULL,
    [ComentarioRespuesta] VARCHAR (4000) NULL,
    CONSTRAINT [PK_RespuestaCuestionarioTemp] PRIMARY KEY CLUSTERED ([IdRespuesta] ASC)
);

