CREATE TABLE [dbo].[Foto] (
    [IdFoto]                  INT             IDENTITY (1, 1) NOT NULL,
    [IdProyecto]              INT             NOT NULL,
    [RutaFotoGrande]          NVARCHAR (4000) NULL,
    [RutaFotoMediano]         NVARCHAR (4000) NULL,
    [RutaFotoPequeno]         NVARCHAR (4000) NULL,
    [Descripcion]             NVARCHAR (4000) NULL,
    [FechaUltimaModificacion] DATETIME        NOT NULL,
    [ConsecutivoCarga]        INT             NOT NULL,
    [Modificadopor]           VARCHAR (30)    NOT NULL,
    [Fecha]                   DATETIME        NOT NULL,
    [Aprobadopor]             VARCHAR (300)   NULL,
    [Aprobado]                BIT             DEFAULT ((0)) NOT NULL,
    [Eliminado]               BIT             DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_Foto_IDFoto] PRIMARY KEY CLUSTERED ([IdFoto] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_FotoXProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);

