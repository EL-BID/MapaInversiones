CREATE TABLE [dbo].[Rol] (
    [IdRol]                   INT          NOT NULL,
    [NombreRol]               VARCHAR (50) NOT NULL,
    [FechaUltimaModificacion] DATETIME     NOT NULL,
    [ConsecutivoCarga]        INT          NOT NULL,
    [ModificadoPor]           VARCHAR (30) NOT NULL,
    CONSTRAINT [PK_Rol] PRIMARY KEY CLUSTERED ([IdRol] ASC) WITH (FILLFACTOR = 80)
);

