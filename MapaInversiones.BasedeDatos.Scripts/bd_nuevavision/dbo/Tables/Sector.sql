CREATE TABLE [dbo].[Sector] (
    [IdSector]                INT           NOT NULL,
    [NombreSector]            VARCHAR (200) NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [Modificadopor]           VARCHAR (30)  NOT NULL,
    CONSTRAINT [Pk_Sector_IdSector] PRIMARY KEY CLUSTERED ([IdSector] ASC) WITH (FILLFACTOR = 80)
);

