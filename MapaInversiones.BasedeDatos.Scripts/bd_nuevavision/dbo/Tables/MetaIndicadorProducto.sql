CREATE TABLE [dbo].[MetaIndicadorProducto] (
    [idMetaIndicadorProducto] INT           IDENTITY (1, 1) NOT NULL,
    [ValorMeta]               FLOAT (53)    NOT NULL,
    [FechaInicioMeta]         DATETIME      NOT NULL,
    [FechaFinMeta]            DATETIME      NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [Modificadopor]           VARCHAR (30)  NOT NULL,
    [idProducto]              INT           NOT NULL,
    [NombreIndicador]         VARCHAR (200) NOT NULL,
    [IdIndicador]             INT           NOT NULL,
    CONSTRAINT [PK_MetaIndicadorProducto] PRIMARY KEY CLUSTERED ([idMetaIndicadorProducto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_MetaIndicadorProducto_Producto] FOREIGN KEY ([idProducto]) REFERENCES [dbo].[Producto] ([IdProducto]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_MetaIndicadorProducto_19_523148909__K8_K10_K3_K4_K2_K9]
    ON [dbo].[MetaIndicadorProducto]([idProducto] ASC, [IdIndicador] ASC, [FechaInicioMeta] ASC, [FechaFinMeta] ASC, [ValorMeta] ASC, [NombreIndicador] ASC) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_523148909_8_1]
    ON [dbo].[MetaIndicadorProducto]([idProducto], [idMetaIndicadorProducto]);


GO
CREATE STATISTICS [_dta_stat_523148909_2_9]
    ON [dbo].[MetaIndicadorProducto]([ValorMeta], [NombreIndicador]);

