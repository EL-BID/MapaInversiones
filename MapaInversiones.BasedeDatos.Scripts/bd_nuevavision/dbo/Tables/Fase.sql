CREATE TABLE [dbo].[Fase] (
    [IdFase]                  INT          NOT NULL,
    [NombreFase]              VARCHAR (30) NOT NULL,
    [FechaUltimaModificacion] DATETIME     NOT NULL,
    [ConsecutivoCarga]        INT          NOT NULL,
    [ModificadoPor]           VARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Fase] PRIMARY KEY CLUSTERED ([IdFase] ASC) WITH (FILLFACTOR = 80)
);

