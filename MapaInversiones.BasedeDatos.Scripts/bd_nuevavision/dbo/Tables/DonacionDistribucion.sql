CREATE TABLE [dbo].[DonacionDistribucion] (
    [IdProveedor]        INT            NULL,
    [NumeroRegistros]    INT            NULL,
    [CodigoAdjudicacion] INT            NULL,
    [CodigoLaboratorio]  INT            NULL,
    [CodigoMedicamento]  INT            NULL,
    [FechaHora]          NVARCHAR (50)  NULL,
    [FechaVencimiento]   NVARCHAR (50)  NULL,
    [FuenteDestino]      NVARCHAR (50)  NULL,
    [Llamado]            NVARCHAR (50)  NULL,
    [Monto]              INT            NULL,
    [NumeroLote]         NVARCHAR (50)  NULL,
    [PrecioUnitario]     INT            NULL,
    [Producto]           NVARCHAR (500) NULL,
    [Sucursal]           NVARCHAR (500) NULL,
    [fechaModificacion]  DATETIME       NULL,
    [Cantidad]           INT            NULL
);

