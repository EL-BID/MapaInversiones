CREATE TABLE [dbo].[OpcionRespuestas] (
    [IdOpcionRespuestas] INT           IDENTITY (1, 1) NOT NULL,
    [IdPregunta]         INT           NOT NULL,
    [EtiquetaOpcion]     VARCHAR (200) NULL,
    [EstadoRespuesta]    INT           NULL,
    [Orden]              INT           NULL,
    [FechaInicio]        DATETIME      NULL,
    [FechaFin]           DATETIME      NULL,
    CONSTRAINT [PK_opcionRespuestas] PRIMARY KEY CLUSTERED ([IdOpcionRespuestas] ASC),
    CONSTRAINT [Fk_OpcionRespuestasxPreguntaCuestionario] FOREIGN KEY ([IdPregunta]) REFERENCES [dbo].[PreguntaCuestionario] ([IdPregunta]) ON DELETE CASCADE ON UPDATE CASCADE
);

