CREATE TABLE [dbo].[SeguimientoMetaIndicadorProducto] (
    [idSeguimientoMetaIndicadorProducto] INT          IDENTITY (1, 1) NOT NULL,
    [ValorReportado]                     FLOAT (53)   NOT NULL,
    [FechaInicioReporte]                 DATETIME     NOT NULL,
    [FechaFinReporte]                    DATETIME     NOT NULL,
    [FechaUltimaModificacion]            DATETIME     NOT NULL,
    [ConsecutivoCarga]                   INT          NOT NULL,
    [ModificadoPor]                      VARCHAR (50) NOT NULL,
    [IdProducto]                         INT          NOT NULL,
    [IdIndicador]                        INT          NOT NULL,
    CONSTRAINT [PK_SeguimientoMetaIndicadorProducto] PRIMARY KEY CLUSTERED ([idSeguimientoMetaIndicadorProducto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_SeguimientoMetaIndicadorProducto_Producto] FOREIGN KEY ([IdProducto]) REFERENCES [dbo].[Producto] ([IdProducto]) ON DELETE CASCADE ON UPDATE CASCADE
);

