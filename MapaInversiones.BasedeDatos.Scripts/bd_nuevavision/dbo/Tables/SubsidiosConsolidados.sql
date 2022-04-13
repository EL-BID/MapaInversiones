CREATE TABLE [dbo].[SubsidiosConsolidados] (
    [IdSubsidio]               VARCHAR (24)    NOT NULL,
    [IdPrograma]               INT             NULL,
    [IdTipoSubsidio]           INT             NOT NULL,
    [TipoSubsidio]             VARCHAR (100)   NULL,
    [TotalSubsidio]            DECIMAL (18, 2) NULL,
    [TotalBeneficiarios]       INT             NOT NULL,
    [TotalSubsidiosEntregados] INT             NOT NULL,
    [URLSubsidios]             VARCHAR (250)   NULL,
    [CodigoProyecto]           INT             NULL
);

