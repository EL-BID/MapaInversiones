CREATE TABLE [dbo].[Usuario] (
    [IdUsuario]           INT           IDENTITY (1, 1) NOT NULL,
    [Nombre]              VARCHAR (400) NOT NULL,
    [email]               VARCHAR (200) NOT NULL,
    [hash_clave]          VARCHAR (200) NOT NULL,
    [FacebookID]          VARCHAR (200) NULL,
    [Estado]              VARCHAR (50)  NULL,
    [FCambioPwd]          DATETIME      NULL,
    [cod_verifica]        VARCHAR (64)  NULL,
    [FechaCreacion]       DATETIME      NULL,
    [Edad]                INT           NULL,
    [IdRolUsuario]        INT           NULL,
    [IdGeneroUsuario]     INT           NULL,
    [IdMedioMapaIUsuario] INT           NULL,
    CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED ([IdUsuario] ASC),
    CONSTRAINT [Fk_UsuarioXGeneroUsuario] FOREIGN KEY ([IdGeneroUsuario]) REFERENCES [dbo].[GeneroUsuario] ([IdGeneroUsuario]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_UsuarioXMedioMapaIUsuario] FOREIGN KEY ([IdMedioMapaIUsuario]) REFERENCES [dbo].[MedioMapaIUsuario] ([IdMedioMapaIUsuario]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_UsuarioXRolUsuario] FOREIGN KEY ([IdRolUsuario]) REFERENCES [dbo].[RolUsuario] ([IdRolUsuario]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [AK_email] UNIQUE NONCLUSTERED ([email] ASC)
);

