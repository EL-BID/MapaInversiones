CREATE TABLE [dbo].[PuntajeEvaluacionProyectos] (
    [IdProyecto]              INT             NOT NULL,
    [CodigoBPIN]              NVARCHAR (50)   NULL,
    [Puntaje]                 NUMERIC (18, 2) NULL,
    [FechaPuntaje]            DATETIME        NULL,
    [FechaUltimaModificacion] DATETIME        NULL,
    [ConsecutivoCarga]        INT             NULL,
    CONSTRAINT [PK_VistaPuntajeEvaluacionProyectos_1] PRIMARY KEY CLUSTERED ([IdProyecto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_PuntajeEvaluacionProyectos_Proyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto])
);

