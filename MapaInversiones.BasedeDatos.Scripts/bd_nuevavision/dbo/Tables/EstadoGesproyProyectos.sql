CREATE TABLE [dbo].[EstadoGesproyProyectos] (
    [BPIN]                    VARCHAR (500) NOT NULL,
    [ID_ESTADO]               INT           NOT NULL,
    [NOMBRE_ESTADO]           VARCHAR (500) NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [IdProyecto]              INT           NOT NULL,
    CONSTRAINT [PK_EstadoGesproyProyectos_1] PRIMARY KEY CLUSTERED ([IdProyecto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_EstadoGesproyProyectos_Proyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto])
);

