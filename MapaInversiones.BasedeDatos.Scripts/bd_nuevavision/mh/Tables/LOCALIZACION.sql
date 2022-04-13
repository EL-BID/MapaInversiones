CREATE TABLE [mh].[LOCALIZACION] (
    [idRegion]                INT           NOT NULL,
    [idDepartamento]          INT           NOT NULL,
    [idDistrito]              INT           NOT NULL,
    [nombreRegion]            VARCHAR (60)  NULL,
    [nombreCortoRegion]       VARCHAR (60)  NULL,
    [nombreDepartamento]      VARCHAR (60)  NULL,
    [nombreCortoDepartamento] VARCHAR (60)  NULL,
    [nombreDistrito]          VARCHAR (60)  NULL,
    [nombreCortoDistrito]     VARCHAR (60)  NULL,
    [fechaCreacion]           DATETIME      NULL,
    [fechaModificacion]       DATETIME      NULL,
    [usuarioResponsable]      VARCHAR (255) NULL,
    CONSTRAINT [PK_LOCALIZACION] PRIMARY KEY CLUSTERED ([idRegion] ASC, [idDepartamento] ASC, [idDistrito] ASC)
);

