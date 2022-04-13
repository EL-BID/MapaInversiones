CREATE TABLE [dbo].[MeGusta] (
    [IdMeGusta]      INT      IDENTITY (1, 1) NOT NULL,
    [IdMegustaUnico] AS       (concat([IdUsuario],[IdFoto],[IdFotoUsuario],[MeGusta],[NoMeGusta])),
    [IdUsuario]      INT      NOT NULL,
    [IdFoto]         INT      NULL,
    [IdFotoUsuario]  INT      NULL,
    [MeGusta]        BIT      NOT NULL,
    [NoMeGusta]      BIT      NOT NULL,
    [IdProyecto]     INT      NOT NULL,
    [Fecha]          DATETIME NULL,
    CONSTRAINT [PK_MeGusta] PRIMARY KEY CLUSTERED ([IdMeGusta] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [Fk_MeGustaXProyecto] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_MeGustaXUsuario] FOREIGN KEY ([IdUsuario]) REFERENCES [dbo].[Usuario] ([IdUsuario]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [UniqueMegusta] UNIQUE NONCLUSTERED ([IdMegustaUnico] ASC)
);

