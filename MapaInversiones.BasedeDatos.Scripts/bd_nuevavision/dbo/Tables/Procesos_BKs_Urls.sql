CREATE TABLE [dbo].[Procesos_BKs_Urls] (
    [IdProceso]                 VARCHAR (150) NOT NULL,
    [CodigoContrato]            VARCHAR (30)  NOT NULL,
    [ocid]                      VARCHAR (50)  NOT NULL,
    [uriProceso]                VARCHAR (324) NULL,
    [urlResumenAdjudicacion]    VARCHAR (250) NULL,
    [urlProveedoresAdjudicados] VARCHAR (250) NULL,
    [urlProveedoresOferentes]   VARCHAR (250) NULL,
    [urlDocumentosAdjudicacion] VARCHAR (250) NULL,
    [UrlpreciosReferencia]      VARCHAR (250) NULL,
    [UrlInvitados]              VARCHAR (250) NULL
);

