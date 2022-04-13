CREATE TABLE [dbo].[Actor] (
    [IdActor]                 VARCHAR (100) NOT NULL,
    [NombreActor]             VARCHAR (200) NOT NULL,
    [IDRol]                   INT           NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [ModificadoPor]           VARCHAR (30)  NOT NULL,
    CONSTRAINT [PK_Actor] PRIMARY KEY CLUSTERED ([IdActor] ASC, [IDRol] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_ActorXRol] FOREIGN KEY ([IDRol]) REFERENCES [dbo].[Rol] ([IdRol]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Actor_7_699149536__K3_K1_2]
    ON [dbo].[Actor]([IDRol] ASC, [IdActor] ASC)
    INCLUDE([NombreActor]) WITH (FILLFACTOR = 80);

