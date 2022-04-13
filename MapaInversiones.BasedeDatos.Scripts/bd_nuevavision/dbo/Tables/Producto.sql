CREATE TABLE [dbo].[Producto] (
    [IdProducto]              INT           NOT NULL,
    [NombreProducto]          VARCHAR (MAX) NOT NULL,
    [UnidadProducto]          VARCHAR (MAX) NOT NULL,
    [CantidadProducto]        DECIMAL (18)  NOT NULL,
    [IdObjetivoEspecifico]    INT           NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [Modificadopor]           VARCHAR (30)  NOT NULL,
    CONSTRAINT [Pk_Producto_IdProducto] PRIMARY KEY CLUSTERED ([IdProducto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_Producto_ObjetivoEspecifico] FOREIGN KEY ([IdObjetivoEspecifico]) REFERENCES [dbo].[ObjetivoEspecifico] ([IdObjetivoEspecifico]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Producto_7_190623722__K5]
    ON [dbo].[Producto]([IdObjetivoEspecifico] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Producto_7_190623722__K5_K1_2_3]
    ON [dbo].[Producto]([IdObjetivoEspecifico] ASC, [IdProducto] ASC)
    INCLUDE([NombreProducto], [UnidadProducto]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_190623722_5_1]
    ON [dbo].[Producto]([IdObjetivoEspecifico], [IdProducto]);

