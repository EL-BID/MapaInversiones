CREATE TABLE [dbo].[DonacionProveedor] (
    [id]                INT           IDENTITY (1, 1) NOT NULL,
    [Proveedor]         VARCHAR (500) NOT NULL,
    [FechaModificacion] DATETIME      NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

