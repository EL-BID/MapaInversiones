CREATE TABLE [dbo].[ImagenesXEnteTerritorial] (
    [IdImageXEnteTerritorial] INT           IDENTITY (1, 1) NOT NULL,
    [IdRegion]                VARCHAR (10)  NULL,
    [IdDepartamento]          VARCHAR (10)  NOT NULL,
    [IdMunicipio]             VARCHAR (10)  NOT NULL,
    [IdImage]                 AS            (concat([IdImageXEnteTerritorial],[IdRegion],[IdDepartamento],[IdMunicipio])),
    [UrlImagePequenia]        VARCHAR (MAX) NULL,
    [UrlImageMediana]         VARCHAR (MAX) NULL,
    [UrlImageGrande]          VARCHAR (MAX) NULL,
    [DescripcionImage]        VARCHAR (MAX) NULL,
    [ImageIndicador]          VARCHAR (10)  NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [Modificadopor]           VARCHAR (30)  NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    CONSTRAINT [PK_ImagenesXEnteTerritorial] PRIMARY KEY CLUSTERED ([IdImageXEnteTerritorial] ASC, [IdImage] ASC)
);

