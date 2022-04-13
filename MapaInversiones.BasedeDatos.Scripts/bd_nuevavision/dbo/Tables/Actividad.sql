CREATE TABLE [dbo].[Actividad] (
    [IdActividad]             INT           NOT NULL,
    [IdProducto]              INT           NOT NULL,
    [DescripcionActividad]    VARCHAR (MAX) NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [Modificadopor]           VARCHAR (30)  NOT NULL,
    [CodigoActividad]         VARCHAR (10)  NULL,
    CONSTRAINT [Pk_Actividad_IdActividad] PRIMARY KEY CLUSTERED ([IdActividad] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [Fk_ActividadXProducto] FOREIGN KEY ([IdProducto]) REFERENCES [dbo].[Producto] ([IdProducto]) ON DELETE CASCADE ON UPDATE CASCADE
);

