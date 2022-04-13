CREATE TABLE [dbo].[DonacionRecepcion] (
    [IdProveedor]       INT           NULL,
    [NumeroRegistros]   INT           NULL,
    [CodigoMedicamento] INT           NULL,
    [Llamado]           VARCHAR (50)  NULL,
    [NumeroLote]        VARCHAR (50)  NULL,
    [PrecioUnitario]    INT           NULL,
    [Producto]          VARCHAR (500) NULL,
    [Sucursal]          VARCHAR (500) NULL,
    [CantidadActual]    INT           NULL,
    [CantidadRecibida]  INT           NULL,
    [FechaMovimiento]   VARCHAR (50)  NULL,
    [MontoRecepcion]    INT           NULL,
    [Vencimiento]       VARCHAR (50)  NULL,
    [FechaModificacion] DATETIME      NULL
);

