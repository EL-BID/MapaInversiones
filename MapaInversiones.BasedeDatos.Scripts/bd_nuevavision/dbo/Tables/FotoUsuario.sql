CREATE TABLE [dbo].[FotoUsuario] (
    [IdFotoUsuario]               INT             IDENTITY (1, 1) NOT NULL,
    [IdProyecto]                  INT             NOT NULL,
    [IdUsuario]                   INT             NOT NULL,
    [RutaFotoGrande]              NVARCHAR (4000) NULL,
    [RutaFotoMediano]             NVARCHAR (4000) NULL,
    [RutaFotoPequeno]             NVARCHAR (4000) NULL,
    [Descripcion]                 NVARCHAR (4000) NULL,
    [IdDepartamento]              VARCHAR (10)    NOT NULL,
    [IdMunicipio]                 VARCHAR (10)    NOT NULL,
    [Fecha]                       DATETIME        NOT NULL,
    [Aprobadopor]                 VARCHAR (300)   NULL,
    [Modificadopor]               VARCHAR (30)    NULL,
    [Aprobado]                    BIT             NOT NULL,
    [Eliminado]                   BIT             NOT NULL,
    [JustificacionParaNoPublicar] VARCHAR (MAX)   NULL,
    CONSTRAINT [PK_FotoUsuario_IDFotoUsuario] PRIMARY KEY CLUSTERED ([IdFotoUsuario] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [Fk_FotoUsuarioProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_FotoUsuarioXEnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_FotoUsuarioXUsuario] FOREIGN KEY ([IdUsuario]) REFERENCES [dbo].[Usuario] ([IdUsuario]) ON DELETE CASCADE ON UPDATE CASCADE
);

