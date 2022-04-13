CREATE TABLE [dbo].[Produccion] (
    [IdProduccion]             INT             IDENTITY (1, 1) NOT NULL,
    [IdPeriodicidad]           NVARCHAR (5)    NOT NULL,
    [PeriodoLiquidado]         INT             NOT NULL,
    [IdRecursoNatural]         VARCHAR (10)    NOT NULL,
    [IdTipoRecursoNatural]     VARCHAR (1)     NOT NULL,
    [IdUnidadMedida]           NVARCHAR (20)   NOT NULL,
    [Produccion]               DECIMAL (18, 2) NOT NULL,
    [IdDepartamento]           VARCHAR (10)    NOT NULL,
    [IdMunicipio]              VARCHAR (10)    NOT NULL,
    [IdCampoOProyecto]         NVARCHAR (50)   NOT NULL,
    [FechaInicioPeriodo]       SMALLDATETIME   NOT NULL,
    [FechaFinPeriodo]          SMALLDATETIME   NOT NULL,
    [IdLiquidacionNegocio]     NVARCHAR (8)    NULL,
    [AñoLiquidado]             INT             NOT NULL,
    [IdTipoCampoOProyecto]     NVARCHAR (50)   NOT NULL,
    [IdTipoDeFinanciacion]     INT             NOT NULL,
    [FechaUltimaModificacion]  DATETIME        NOT NULL,
    [ConsecutivoCarga]         INT             NOT NULL,
    [IdTipoDeContraprestacion] INT             NOT NULL,
    CONSTRAINT [PK_Produccion] PRIMARY KEY CLUSTERED ([IdProduccion] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_Produccion_CampoOProyecto] FOREIGN KEY ([IdCampoOProyecto], [IdTipoCampoOProyecto]) REFERENCES [dbo].[CampoOProyecto] ([IdCampoOProyecto], [IdTipoCampoOProyecto]),
    CONSTRAINT [FK_Produccion_EnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]),
    CONSTRAINT [FK_Produccion_Periodicidad] FOREIGN KEY ([IdPeriodicidad]) REFERENCES [dbo].[Periodicidad] ([IdPeriodicidad]),
    CONSTRAINT [FK_Produccion_RecursoNatural] FOREIGN KEY ([IdRecursoNatural], [IdTipoRecursoNatural]) REFERENCES [dbo].[RecursoNatural] ([IdRecursoNatural], [IdTipoRecursoNatural]),
    CONSTRAINT [FK_Produccion_TipoDeFinanciacion] FOREIGN KEY ([IdTipoDeFinanciacion]) REFERENCES [dbo].[TipoDeFinanciacion] ([IdTipoFinanciacion]),
    CONSTRAINT [FK_Produccion_UnidadMedida] FOREIGN KEY ([IdUnidadMedida]) REFERENCES [dbo].[UnidadMedida] ([IdUnidadMedida])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_7_457768688__K10_K8_K9]
    ON [dbo].[Produccion]([IdCampoOProyecto] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_7_457768688__K3_K14_K9_K10_K15_K4_7]
    ON [dbo].[Produccion]([PeriodoLiquidado] ASC, [AñoLiquidado] ASC, [IdMunicipio] ASC, [IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [IdRecursoNatural] ASC)
    INCLUDE([Produccion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_7_457768688__K4_K5_K6_K9_7]
    ON [dbo].[Produccion]([IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC, [IdUnidadMedida] ASC, [IdMunicipio] ASC)
    INCLUDE([Produccion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_7_457768688__K6_K4_K5_7]
    ON [dbo].[Produccion]([IdUnidadMedida] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC)
    INCLUDE([Produccion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_7_457768688__K6_K9_K4_K5_7]
    ON [dbo].[Produccion]([IdUnidadMedida] ASC, [IdMunicipio] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC)
    INCLUDE([Produccion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_7_457768688__K14_K10_K4_K5_K6_K9_7_4801]
    ON [dbo].[Produccion]([AñoLiquidado] ASC, [IdCampoOProyecto] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC, [IdUnidadMedida] ASC, [IdMunicipio] ASC)
    INCLUDE([Produccion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_7_457768688__K6_K4_K5_K9_7_14_5201]
    ON [dbo].[Produccion]([IdUnidadMedida] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC, [IdMunicipio] ASC)
    INCLUDE([Produccion], [AñoLiquidado]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_6_1070626857__K14_K9_K10_K15_K4_K3_K19_K5_K6_7]
    ON [dbo].[Produccion]([AñoLiquidado] ASC, [IdMunicipio] ASC, [IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [IdRecursoNatural] ASC, [PeriodoLiquidado] ASC, [IdTipoDeContraprestacion] ASC, [IdTipoRecursoNatural] ASC, [IdUnidadMedida] ASC)
    INCLUDE([Produccion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Produccion_6_1070626857__K9_K14_K10_K6_K4_K5_7]
    ON [dbo].[Produccion]([IdMunicipio] ASC, [AñoLiquidado] ASC, [IdCampoOProyecto] ASC, [IdUnidadMedida] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC)
    INCLUDE([Produccion]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_1070626857_1_19_5_6]
    ON [dbo].[Produccion]([IdProduccion], [IdTipoDeContraprestacion], [IdTipoRecursoNatural], [IdUnidadMedida]);


GO
CREATE STATISTICS [_dta_stat_1070626857_10_15_4_3_19_9_5_6]
    ON [dbo].[Produccion]([IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [PeriodoLiquidado], [IdTipoDeContraprestacion], [IdMunicipio], [IdTipoRecursoNatural], [IdUnidadMedida]);


GO
CREATE STATISTICS [_dta_stat_1070626857_10_9_4_5]
    ON [dbo].[Produccion]([IdCampoOProyecto], [IdMunicipio], [IdRecursoNatural], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_1070626857_10_9_6_4_5]
    ON [dbo].[Produccion]([IdCampoOProyecto], [IdMunicipio], [IdUnidadMedida], [IdRecursoNatural], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_1070626857_14_10_15]
    ON [dbo].[Produccion]([AñoLiquidado], [IdCampoOProyecto], [IdTipoCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_1070626857_14_10_6]
    ON [dbo].[Produccion]([AñoLiquidado], [IdCampoOProyecto], [IdUnidadMedida]);


GO
CREATE STATISTICS [_dta_stat_1070626857_14_10_9]
    ON [dbo].[Produccion]([AñoLiquidado], [IdCampoOProyecto], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_1070626857_14_6_10_15_4_3_19_9]
    ON [dbo].[Produccion]([AñoLiquidado], [IdUnidadMedida], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [PeriodoLiquidado], [IdTipoDeContraprestacion], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_1070626857_3_9_10_15_4_1_14_19_5_6]
    ON [dbo].[Produccion]([PeriodoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [IdProduccion], [AñoLiquidado], [IdTipoDeContraprestacion], [IdTipoRecursoNatural], [IdUnidadMedida]);


GO
CREATE STATISTICS [_dta_stat_1070626857_3_9_10_15_4_1_19_5_6]
    ON [dbo].[Produccion]([PeriodoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [IdProduccion], [IdTipoDeContraprestacion], [IdTipoRecursoNatural], [IdUnidadMedida]);


GO
CREATE STATISTICS [_dta_stat_1070626857_4_10_14_15_3_19_9_5_6]
    ON [dbo].[Produccion]([IdRecursoNatural], [IdCampoOProyecto], [AñoLiquidado], [IdTipoCampoOProyecto], [PeriodoLiquidado], [IdTipoDeContraprestacion], [IdMunicipio], [IdTipoRecursoNatural], [IdUnidadMedida]);


GO
CREATE STATISTICS [_dta_stat_1070626857_4_10_14_3]
    ON [dbo].[Produccion]([IdRecursoNatural], [IdCampoOProyecto], [AñoLiquidado], [PeriodoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_1070626857_4_10_5]
    ON [dbo].[Produccion]([IdRecursoNatural], [IdCampoOProyecto], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_1070626857_4_14_3_9]
    ON [dbo].[Produccion]([IdRecursoNatural], [AñoLiquidado], [PeriodoLiquidado], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_1070626857_4_5_14_10_9]
    ON [dbo].[Produccion]([IdRecursoNatural], [IdTipoRecursoNatural], [AñoLiquidado], [IdCampoOProyecto], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_1070626857_5_14_10_15_4_3_19]
    ON [dbo].[Produccion]([IdTipoRecursoNatural], [AñoLiquidado], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [PeriodoLiquidado], [IdTipoDeContraprestacion]);


GO
CREATE STATISTICS [_dta_stat_1070626857_5_3_14_9_10_15_4_1]
    ON [dbo].[Produccion]([IdTipoRecursoNatural], [PeriodoLiquidado], [AñoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [IdProduccion]);


GO
CREATE STATISTICS [_dta_stat_1070626857_6_14]
    ON [dbo].[Produccion]([IdUnidadMedida], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_1070626857_6_3_14_9_10_15_4_1_19]
    ON [dbo].[Produccion]([IdUnidadMedida], [PeriodoLiquidado], [AñoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [IdProduccion], [IdTipoDeContraprestacion]);


GO
CREATE STATISTICS [_dta_stat_1070626857_9_10_4]
    ON [dbo].[Produccion]([IdMunicipio], [IdCampoOProyecto], [IdRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_1070626857_9_4]
    ON [dbo].[Produccion]([IdMunicipio], [IdRecursoNatural]);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Titulo Minero o Pozo Petrolifero', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Produccion', @level2type = N'COLUMN', @level2name = N'IdTipoCampoOProyecto';

