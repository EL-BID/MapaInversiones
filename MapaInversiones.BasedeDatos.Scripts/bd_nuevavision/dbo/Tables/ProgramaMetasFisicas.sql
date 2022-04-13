CREATE TABLE [dbo].[ProgramaMetasFisicas] (
    [IdPrograma]          INT             NOT NULL,
    [CodigoProyecto]      INT             NOT NULL,
    [CodigoProducto]      INT             NOT NULL,
    [FechaMeta]           DATETIME        NOT NULL,
    [Objetivo]            VARCHAR (2000)  NULL,
    [ResultadoIntermedio] VARCHAR (1000)  NULL,
    [ResultadoInmediato]  VARCHAR (2000)  NULL,
    [NombreProyecto]      VARCHAR (250)   NULL,
    [NombreProducto]      VARCHAR (100)   NULL,
    [Unidad]              VARCHAR (60)    NULL,
    [MetaTotal]           NUMERIC (17, 2) NULL,
    [Meta]                NUMERIC (17, 2) NULL,
    [Avance]              NUMERIC (17, 2) NULL,
    [FechaModificacion]   DATETIME        NOT NULL,
    CONSTRAINT [PK_ProgramaMetasFisicas] PRIMARY KEY CLUSTERED ([IdPrograma] ASC, [CodigoProyecto] ASC, [CodigoProducto] ASC, [FechaMeta] ASC),
    CONSTRAINT [FK_ProgramaMetasFisicas_Programa] FOREIGN KEY ([IdPrograma]) REFERENCES [dbo].[Programa] ([Id])
);

