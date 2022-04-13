CREATE TABLE [consulta].[CatalogoEntidades] (
    [codNivelEntidad]         VARCHAR (47)   NULL,
    [nombreEntidad]           VARCHAR (255)  NULL,
    [siglaEntidad]            VARCHAR (255)  NULL,
    [URL]                     VARCHAR (60)   NULL,
    [mision]                  VARCHAR (1000) NULL,
    [vision]                  VARCHAR (1000) NULL,
    [nombreNivel]             VARCHAR (255)  NULL,
    [numSector]               INT            NULL,
    [nombreSector]            VARCHAR (100)  NULL,
    [clasificacionSector]     VARCHAR (100)  NULL,
    [FechaUltimaModificacion] DATETIME       NULL,
    [ModificadoPor]           VARCHAR (50)   NULL
);

