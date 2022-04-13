CREATE TABLE [dbo].[ActorXProyecto] (
    [IDActor]                 VARCHAR (100) NOT NULL,
    [IDProyecto]              INT           NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [ModificadoPor]           VARCHAR (30)  NOT NULL,
    [IDRol]                   INT           NOT NULL,
    CONSTRAINT [PK_ActorXProyecto_1] PRIMARY KEY CLUSTERED ([IDActor] ASC, [IDProyecto] ASC, [IDRol] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_ActorXProyecto_Actor] FOREIGN KEY ([IDActor], [IDRol]) REFERENCES [dbo].[Actor] ([IdActor], [IDRol]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_ActorXProyecto_Proyecto] FOREIGN KEY ([IDProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [IX_ActorXProyecto]
    ON [dbo].[ActorXProyecto]([IDActor] ASC, [IDRol] ASC, [IDProyecto] ASC) WITH (FILLFACTOR = 80);

