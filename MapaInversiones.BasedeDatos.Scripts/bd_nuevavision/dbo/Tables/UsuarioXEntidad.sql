CREATE TABLE [dbo].[UsuarioXEntidad] (
    [Id]             INT          IDENTITY (1, 1) NOT NULL,
    [IdUsuario]      INT          NOT NULL,
    [IdDepartamento] VARCHAR (10) NOT NULL,
    [IdMunicipio]    VARCHAR (10) NOT NULL,
    [IdTipoPermiso]  INT          NOT NULL,
    CONSTRAINT [PK_UsuarioXEntidad] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [Fk_UsuarioXEntidadXEnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_UsuarioXEntidadxTipoPermiso] FOREIGN KEY ([IdTipoPermiso]) REFERENCES [dbo].[TipoPermiso] ([IdTipoPermiso]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_UsuarioXEntidadxUsuario] FOREIGN KEY ([IdUsuario]) REFERENCES [dbo].[Usuario] ([IdUsuario]) ON DELETE CASCADE ON UPDATE CASCADE
);

