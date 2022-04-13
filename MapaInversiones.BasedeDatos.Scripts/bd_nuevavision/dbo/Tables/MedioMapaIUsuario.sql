CREATE TABLE [dbo].[MedioMapaIUsuario] (
    [IdMedioMapaIUsuario] INT           IDENTITY (1, 1) NOT NULL,
    [NombreMedio]         VARCHAR (100) NOT NULL,
    [FechaCreacion]       DATETIME      NULL,
    CONSTRAINT [PK_MedioMapaIUsuario] PRIMARY KEY CLUSTERED ([IdMedioMapaIUsuario] ASC) WITH (FILLFACTOR = 80)
);

