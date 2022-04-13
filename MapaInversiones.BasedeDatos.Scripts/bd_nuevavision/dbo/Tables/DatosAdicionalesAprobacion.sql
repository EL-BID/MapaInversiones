CREATE TABLE [dbo].[DatosAdicionalesAprobacion] (
    [IdDatoAdicional]         INT           IDENTITY (1, 1) NOT NULL,
    [CodigoBPIN]              VARCHAR (500) NOT NULL,
    [IdProyecto]              INT           NOT NULL,
    [IdOcad]                  INT           NOT NULL,
    [CodigoOcad]              VARCHAR (500) NOT NULL,
    [NombreOcad]              VARCHAR (500) NOT NULL,
    [NumeroAcuerdo]           VARCHAR (500) NULL,
    [FechaAprobacionInicial]  DATETIME      NULL,
    [FechaUltimaAprobacion]   DATETIME      NULL,
    [IdOcadAprueba]           INT           NULL,
    [CodigoOcadAprueba]       VARCHAR (500) NULL,
    [NombreOcadAprueba]       VARCHAR (500) NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    CONSTRAINT [PK_DatosAdicionalesAprobacion] PRIMARY KEY CLUSTERED ([IdDatoAdicional] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_DatosAdicionalesAprobacion_Proyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto])
);


GO
CREATE NONCLUSTERED INDEX [IX_IdProyecto]
    ON [dbo].[DatosAdicionalesAprobacion]([IdProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [IX_DatosAdicionalesAprobacion]
    ON [dbo].[DatosAdicionalesAprobacion]([IdOcadAprueba] ASC, [FechaUltimaAprobacion] ASC) WITH (FILLFACTOR = 80);

