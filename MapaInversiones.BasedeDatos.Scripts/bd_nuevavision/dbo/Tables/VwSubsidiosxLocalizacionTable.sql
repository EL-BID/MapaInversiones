CREATE TABLE [dbo].[VwSubsidiosxLocalizacionTable] (
    [IdSubsidio]             VARCHAR (8000) NOT NULL,
    [IdDepartamento]         VARCHAR (8000) NULL,
    [NombreDepartamento]     VARCHAR (8000) NULL,
    [IdMunicipio]            VARCHAR (8000) NULL,
    [NombreMunicipio]        VARCHAR (8000) NULL,
    [CaracteristicaSubsidio] NVARCHAR (255) NOT NULL,
    [ClaseSubsidio]          VARCHAR (55)   NOT NULL,
    [ValorSubsidio]          MONEY          NULL,
    [CantidadSubsidio]       INT            NULL,
    [GeoJson]                VARCHAR (MAX)  NOT NULL
);

