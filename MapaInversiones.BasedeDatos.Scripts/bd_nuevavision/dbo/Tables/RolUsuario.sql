CREATE TABLE [dbo].[RolUsuario] (
    [IdRolUsuario]  INT          IDENTITY (1, 1) NOT NULL,
    [NombreRol]     VARCHAR (50) NOT NULL,
    [FechaCreacion] DATETIME     NULL,
    CONSTRAINT [PK_RolUsuario] PRIMARY KEY CLUSTERED ([IdRolUsuario] ASC) WITH (FILLFACTOR = 80)
);

