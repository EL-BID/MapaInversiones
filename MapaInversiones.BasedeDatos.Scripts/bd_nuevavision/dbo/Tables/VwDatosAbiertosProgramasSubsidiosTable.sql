CREATE TABLE [dbo].[VwDatosAbiertosProgramasSubsidiosTable] (
    [Nivel]                   INT            NOT NULL,
    [CodigoEntidad]           INT            NULL,
    [Entidad]                 VARCHAR (60)   NULL,
    [ClasePrograma]           INT            NOT NULL,
    [CodigoPrograma]          INT            NOT NULL,
    [NombrePrograma]          VARCHAR (60)   NOT NULL,
    [CodigoProyectoActividad] INT            NOT NULL,
    [NombreActividadProyecto] VARCHAR (250)  NULL,
    [TipoSubsidioPrograma]    INT            NULL,
    [NumeroDocumento]         NVARCHAR (50)  NULL,
    [NombreBeneficiario]      NVARCHAR (255) NULL,
    [IdDepartamento]          VARCHAR (8000) NULL,
    [NombreDepartamento]      VARCHAR (8000) NULL,
    [IdMunicipio]             VARCHAR (8000) NULL,
    [NombreMunicipio]         VARCHAR (8000) NULL,
    [CaracteristicaSubsidio]  NVARCHAR (255) NOT NULL,
    [TipoSubsidio]            VARCHAR (55)   NOT NULL,
    [ValorSubsidio]           INT            NULL,
    [CantidadSubsidio]        INT            NULL,
    [FechaCargueArchivo]      DATETIME       NULL,
    [FuenteDatos]             VARCHAR (45)   NOT NULL
);

