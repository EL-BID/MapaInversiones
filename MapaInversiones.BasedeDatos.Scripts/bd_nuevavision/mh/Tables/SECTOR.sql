CREATE TABLE [mh].[SECTOR] (
    [idSector]      INT           IDENTITY (1, 1) NOT NULL,
    [numSector]     INT           NULL,
    [nombre]        VARCHAR (100) NULL,
    [clasificacion] VARCHAR (100) NULL,
    CONSTRAINT [PK_SECTOR] PRIMARY KEY CLUSTERED ([idSector] ASC)
);

