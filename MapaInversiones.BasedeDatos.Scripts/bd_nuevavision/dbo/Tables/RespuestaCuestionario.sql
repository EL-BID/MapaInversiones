CREATE TABLE [dbo].[RespuestaCuestionario] (
    [IdRespuesta]         INT            IDENTITY (1, 1) NOT NULL,
    [IdUsuario]           INT            NOT NULL,
    [Idpregunta]          INT            NOT NULL,
    [IdOpcionRespuesta]   INT            NULL,
    [Fecha]               DATETIME       NULL,
    [IdProyecto]          INT            NOT NULL,
    [IdDepartamento]      VARCHAR (10)   NOT NULL,
    [IdMunicipio]         VARCHAR (10)   NOT NULL,
    [ComentarioRespuesta] VARCHAR (4000) NULL,
    CONSTRAINT [PK_RespuestaCuestionario] PRIMARY KEY CLUSTERED ([IdRespuesta] ASC),
    CONSTRAINT [Fk_RespuestaCuestionarioXEnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_RespuestaCuestionarioxOpcionRespuesta] FOREIGN KEY ([IdOpcionRespuesta]) REFERENCES [dbo].[OpcionRespuestas] ([IdOpcionRespuestas]),
    CONSTRAINT [Fk_RespuestaCuestionarioxPreguntaCuestionario] FOREIGN KEY ([Idpregunta]) REFERENCES [dbo].[PreguntaCuestionario] ([IdPregunta]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_RespuestaCuestionarioXProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]),
    CONSTRAINT [Fk_RespuestaCuestionarioXUsuario] FOREIGN KEY ([IdUsuario]) REFERENCES [dbo].[Usuario] ([IdUsuario]) ON DELETE CASCADE ON UPDATE CASCADE
);

