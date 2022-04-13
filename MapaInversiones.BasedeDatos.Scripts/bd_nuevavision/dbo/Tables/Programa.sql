CREATE TABLE [dbo].[Programa] (
    [Id]                      INT           IDENTITY (1, 1) NOT NULL,
    [Nivel]                   INT           NOT NULL,
    [CodigoEntidad]           INT           NOT NULL,
    [ClasePrograma]           INT           NOT NULL,
    [CodigoPrograma]          INT           NOT NULL,
    [NombrePrograma]          VARCHAR (60)  NOT NULL,
    [CodigoSubPrograma]       INT           NOT NULL,
    [CodigoProyecto]          INT           NOT NULL,
    [EsProgramaCovid]         INT           NOT NULL,
    [NombreActividadProyecto] VARCHAR (250) NULL,
    [codigoprogramaNegocio]   AS            (CONVERT([int],concat([Nivel],[CodigoEntidad],[ClasePrograma],[CodigoPrograma]))),
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

