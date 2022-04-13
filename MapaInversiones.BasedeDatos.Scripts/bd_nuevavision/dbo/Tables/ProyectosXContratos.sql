CREATE TABLE [dbo].[ProyectosXContratos] (
    [IdProyecto]              INT            NOT NULL,
    [CodigoSNIP]              NVARCHAR (200) NULL,
    [CodigoProceso]           NVARCHAR (255) NULL,
    [CodigoContrato]          NVARCHAR (255) NULL,
    [Estado]                  VARCHAR (30)   NULL,
    [FechaUltimaModificacion] DATETIME       DEFAULT (getdate()) NOT NULL
);

