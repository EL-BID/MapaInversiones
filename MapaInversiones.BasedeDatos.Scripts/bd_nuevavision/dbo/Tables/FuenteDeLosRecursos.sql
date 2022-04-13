CREATE TABLE [dbo].[FuenteDeLosRecursos] (
    [IdFuente]                 INT            NOT NULL,
    [NombreFuente]             NVARCHAR (150) NULL,
    [Descripcion]              NVARCHAR (500) NOT NULL,
    [FechaActualizacionFuente] DATETIME       NOT NULL,
    CONSTRAINT [PK_FuenteDeLosRecursos] PRIMARY KEY CLUSTERED ([IdFuente] ASC) WITH (FILLFACTOR = 80)
);

