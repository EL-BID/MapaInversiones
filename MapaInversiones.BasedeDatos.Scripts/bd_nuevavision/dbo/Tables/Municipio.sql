CREATE TABLE [dbo].[Municipio] (
    [IdMunicipio]                   VARCHAR (20)      NOT NULL,
    [NombreMunicipio]               VARCHAR (100)     NOT NULL,
    [GeoPoligonoEntidadTerritorial] [sys].[geography] NULL,
    [CodigoDANE]                    VARCHAR (50)      NULL,
    [TopLeft]                       [sys].[geography] NULL,
    [BottomRight]                   [sys].[geography] NULL,
    [Tipo]                          VARCHAR (50)      NULL,
    [Version]                       INT               NULL,
    [Centroide]                     [sys].[geography] NULL,
    [Geojson]                       VARCHAR (MAX)     NULL,
    [IdDepartamento]                VARCHAR (20)      NULL,
    [FechaUltimaModificacion]       DATETIME          NOT NULL,
    [ModificadoPor]                 VARCHAR (50)      NOT NULL,
    [ConsecutivoCarga]              INT               NOT NULL
);

