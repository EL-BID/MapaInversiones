CREATE TABLE [dbo].[EstadoHomologado] (
    [IdEstado]         INT          IDENTITY (1, 1) NOT NULL,
    [NombreEstado]     VARCHAR (30) NOT NULL,
    [IdEstadoProyecto] INT          NOT NULL,
    CONSTRAINT [Pk_EstadoHomologado_IdEstado] PRIMARY KEY CLUSTERED ([IdEstado] ASC) WITH (FILLFACTOR = 80)
);

