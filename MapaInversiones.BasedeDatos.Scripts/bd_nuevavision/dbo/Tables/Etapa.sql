CREATE TABLE [dbo].[Etapa] (
    [IdEtapa]                 INT          NOT NULL,
    [NombreEtapa]             VARCHAR (30) NOT NULL,
    [FechaUltimaModificacion] DATETIME     NOT NULL,
    [ConsecutivoCarga]        INT          NOT NULL,
    [ModificadoPor]           VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Etapa] PRIMARY KEY CLUSTERED ([IdEtapa] ASC) WITH (FILLFACTOR = 80)
);

