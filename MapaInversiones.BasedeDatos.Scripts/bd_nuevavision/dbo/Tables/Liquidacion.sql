CREATE TABLE [dbo].[Liquidacion] (
    [IdLiquidación]           INT             IDENTITY (1, 1) NOT NULL,
    [IdCampoOProyecto]        NVARCHAR (50)   NOT NULL,
    [ValorLiquidado]          DECIMAL (20, 8) NOT NULL,
    [IdDepartamento]          VARCHAR (10)    NULL,
    [IdMunicipio]             VARCHAR (10)    NULL,
    [IdPeriocidad]            NVARCHAR (5)    NOT NULL,
    [IdLiquidacionNegocio]    NVARCHAR (8)    NULL,
    [IdRecursoNatural]        VARCHAR (10)    NOT NULL,
    [IdTipoRecursoNatural]    VARCHAR (1)     NOT NULL,
    [PeriodoLiquidado]        INT             NOT NULL,
    [FechaInicioPeriodo]      SMALLDATETIME   NOT NULL,
    [FechaFinPeriodo]         SMALLDATETIME   NOT NULL,
    [IdTipoContraprestacion]  NVARCHAR (50)   NOT NULL,
    [TRM]                     DECIMAL (18, 2) NULL,
    [AñoLiquidado]            INT             NOT NULL,
    [IdTipoDeFinanciacion]    INT             NOT NULL,
    [FechaUltimaModificacion] DATETIME        NOT NULL,
    [ConsecutivoCarga]        INT             NOT NULL,
    [IdTipoCampoOProyecto]    NVARCHAR (50)   NOT NULL,
    CONSTRAINT [PK_LiquidacionProduccionANH] PRIMARY KEY CLUSTERED ([IdLiquidación] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_Liquidacion_CampoOProyecto] FOREIGN KEY ([IdCampoOProyecto], [IdTipoCampoOProyecto]) REFERENCES [dbo].[CampoOProyecto] ([IdCampoOProyecto], [IdTipoCampoOProyecto]),
    CONSTRAINT [FK_Liquidacion_Periodicidad] FOREIGN KEY ([IdPeriocidad]) REFERENCES [dbo].[Periodicidad] ([IdPeriodicidad]),
    CONSTRAINT [FK_Liquidacion_RecursoNatural1] FOREIGN KEY ([IdRecursoNatural], [IdTipoRecursoNatural]) REFERENCES [dbo].[RecursoNatural] ([IdRecursoNatural], [IdTipoRecursoNatural]),
    CONSTRAINT [FK_Liquidacion_TipoContraprestacion] FOREIGN KEY ([IdTipoContraprestacion]) REFERENCES [dbo].[TipoContraprestacion] ([IdTipoContraprestacion]),
    CONSTRAINT [FK_Liquidacion_TipoDeFinanciacion] FOREIGN KEY ([IdTipoDeFinanciacion]) REFERENCES [dbo].[TipoDeFinanciacion] ([IdTipoFinanciacion]),
    CONSTRAINT [FK_LiquidacionProduccionANH_EnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Liquidacion_7_665769429__K10_K15_K5_K2_K19_K8_3]
    ON [dbo].[Liquidacion]([PeriodoLiquidado] ASC, [AñoLiquidado] ASC, [IdMunicipio] ASC, [IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [IdRecursoNatural] ASC)
    INCLUDE([ValorLiquidado]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Liquidacion_7_665769429__K5_K4_3]
    ON [dbo].[Liquidacion]([IdMunicipio] ASC, [IdDepartamento] ASC)
    INCLUDE([ValorLiquidado]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Liquidacion_7_665769429__K8_K9_3]
    ON [dbo].[Liquidacion]([IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC)
    INCLUDE([ValorLiquidado]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Liquidacion_7_665769429__K15_K5_K1_K8_K2_K19_K10_3]
    ON [dbo].[Liquidacion]([AñoLiquidado] ASC, [IdMunicipio] ASC, [IdLiquidación] ASC, [IdRecursoNatural] ASC, [IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [PeriodoLiquidado] ASC)
    INCLUDE([ValorLiquidado]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Liquidacion_7_665769429__K4_K5_K15_3_6497]
    ON [dbo].[Liquidacion]([IdDepartamento] ASC, [IdMunicipio] ASC, [AñoLiquidado] ASC)
    INCLUDE([ValorLiquidado]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Liquidacion_6_130099504__K4_K5_K15_K13_3]
    ON [dbo].[Liquidacion]([IdDepartamento] ASC, [IdMunicipio] ASC, [AñoLiquidado] ASC, [IdTipoContraprestacion] ASC)
    INCLUDE([ValorLiquidado]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_665769429_15_5_2_19_8_10]
    ON [dbo].[Liquidacion]([AñoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [PeriodoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_130099504_1_10_5_2_19_8_13]
    ON [dbo].[Liquidacion]([IdLiquidación], [PeriodoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [IdTipoContraprestacion]);


GO
CREATE STATISTICS [_dta_stat_130099504_1_10_5_2_19_8_15_13]
    ON [dbo].[Liquidacion]([IdLiquidación], [PeriodoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [AñoLiquidado], [IdTipoContraprestacion]);


GO
CREATE STATISTICS [_dta_stat_130099504_1_13]
    ON [dbo].[Liquidacion]([IdLiquidación], [IdTipoContraprestacion]);


GO
CREATE STATISTICS [_dta_stat_130099504_15_1_10_5_2_19]
    ON [dbo].[Liquidacion]([AñoLiquidado], [IdLiquidación], [PeriodoLiquidado], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_130099504_15_13_4_5]
    ON [dbo].[Liquidacion]([AñoLiquidado], [IdTipoContraprestacion], [IdDepartamento], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_130099504_5_2_19_8_10_13_15]
    ON [dbo].[Liquidacion]([IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdRecursoNatural], [PeriodoLiquidado], [IdTipoContraprestacion], [AñoLiquidado]);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Titulo Minero o Pozo Petrolifero', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Liquidacion', @level2type = N'COLUMN', @level2name = N'IdTipoCampoOProyecto';

