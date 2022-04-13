CREATE TABLE [dbo].[ContratosEjecucionFinanciera] (
    [CodigoContrato]            VARCHAR (30)  NOT NULL,
    [TipoPrograma]              INT           NOT NULL,
    [ObjetoGasto]               INT           NOT NULL,
    [SubPrograma]               INT           NOT NULL,
    [FuenteFinanciamiento]      INT           NOT NULL,
    [CodigoEntidad]             INT           NOT NULL,
    [CodigoPrograma]            INT           NOT NULL,
    [CodigoProyecto]            INT           NOT NULL,
    [CodigoDepartamento]        VARCHAR (10)  NOT NULL,
    [CodigoNivel]               INT           NULL,
    [AnioContrato]              INT           NOT NULL,
    [CodigoFinanciador]         INT           NOT NULL,
    [IdProceso]                 VARCHAR (150) NULL,
    [FechaFinalizacionContrato] DATETIME2 (7) NULL,
    [FechaInicioContrato]       DATETIME2 (7) NULL,
    [MontoAUtilizar]            BIGINT        NULL,
    [CodigoFinanciero]          VARCHAR (30)  NOT NULL,
    [FechaModificacion]         DATETIME      NULL,
    [RegistroActivo]            BIT           NULL,
    CONSTRAINT [PK_ContratosEjecucionFinanciera] PRIMARY KEY CLUSTERED ([CodigoContrato] ASC, [CodigoPrograma] ASC, [SubPrograma] ASC, [CodigoProyecto] ASC, [ObjetoGasto] ASC, [CodigoFinanciador] ASC, [FuenteFinanciamiento] ASC, [CodigoEntidad] ASC, [CodigoDepartamento] ASC, [AnioContrato] ASC, [CodigoFinanciero] ASC, [TipoPrograma] ASC)
);

