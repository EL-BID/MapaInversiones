CREATE TABLE [dbo].[Comentario] (
    [IdComentario]                   INT           IDENTITY (1, 1) NOT NULL,
    [IdAsociacion]                   INT           NULL,
    [IdTipoComentario]               INT           NOT NULL,
    [IdPrograma]                     INT           NULL,
    [IdProyecto]                     INT           NULL,
    [CodEnteTerritorialBeneficiario] INT           NULL,
    [IdDepartamento]                 VARCHAR (10)  NULL,
    [IdMunicipio]                    VARCHAR (10)  NULL,
    [IdUsuario]                      INT           NOT NULL,
    [fechaCreacion]                  DATETIME      NOT NULL,
    [IdEstado]                       INT           NOT NULL,
    [ComentarioOriginal]             VARCHAR (MAX) NULL,
    [ComentarioModerado]             VARCHAR (MAX) NULL,
    [fechaPublicacion]               DATETIME      NULL,
    [IdTipoRespuesta]                INT           NULL,
    [ComentarioRelacionado]          INT           NULL,
    [Anonimo]                        BIT           NULL,
    [JustificacionParaNoPublicar]    VARCHAR (MAX) NULL,
    [codigocontrato]                 VARCHAR (30)  NULL,
    CONSTRAINT [PK_Comentario] PRIMARY KEY CLUSTERED ([IdComentario] ASC),
    CONSTRAINT [FK_Comentario_TipoComentario] FOREIGN KEY ([IdTipoComentario]) REFERENCES [dbo].[TipoComentario] ([Id])
);

