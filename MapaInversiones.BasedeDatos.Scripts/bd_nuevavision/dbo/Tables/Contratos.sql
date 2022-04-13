CREATE TABLE [dbo].[Contratos] (
    [CodigoContrato]           VARCHAR (30)  NOT NULL,
    [awardID]                  VARCHAR (59)  NULL,
    [EstadoContrato]           VARCHAR (250) NULL,
    [TipoContrato]             VARCHAR (250) NULL,
    [DocumentoNombre]          VARCHAR (250) NULL,
    [ValorContrato]            BIGINT        NULL,
    [MonedaContrato]           VARCHAR (5)   NULL,
    [FechaFirmaContrato]       DATETIME2 (7) NULL,
    [DuracionContrato]         INT           NULL,
    [codigo_BPIN]              VARCHAR (50)  NULL,
    [FechaUltimaActualizacion] DATETIME      NOT NULL,
    [RegistroActivo]           BIT           NOT NULL,
    PRIMARY KEY CLUSTERED ([CodigoContrato] ASC)
);

