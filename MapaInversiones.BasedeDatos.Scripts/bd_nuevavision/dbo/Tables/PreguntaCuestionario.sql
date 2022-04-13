CREATE TABLE [dbo].[PreguntaCuestionario] (
    [IdPregunta]       INT           IDENTITY (1, 1) NOT NULL,
    [IdEstado]         INT           NOT NULL,
    [TextoPregunta]    VARCHAR (200) NOT NULL,
    [TextoExplicativo] VARCHAR (200) NOT NULL,
    [TextoRespuestas]  VARCHAR (200) NULL,
    [EstadoPregunta]   INT           NULL,
    [Orden]            INT           NULL,
    [FechaInicio]      DATETIME      NULL,
    [FechaFin]         DATETIME      NULL,
    CONSTRAINT [PK_preguntaCuestionario] PRIMARY KEY CLUSTERED ([IdPregunta] ASC),
    CONSTRAINT [Fk_PreguntaCuestionarioxEstadoHomologado] FOREIGN KEY ([IdEstado]) REFERENCES [dbo].[EstadoHomologado] ([IdEstado]) ON DELETE CASCADE ON UPDATE CASCADE
);

