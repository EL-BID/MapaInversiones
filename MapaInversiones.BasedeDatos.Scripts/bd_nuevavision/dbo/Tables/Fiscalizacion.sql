CREATE TABLE [dbo].[Fiscalizacion] (
    [Id]                       INT            IDENTITY (1, 1) NOT NULL,
    [IdCampoOProyecto]         NVARCHAR (50)  CONSTRAINT [DF_Fiscalizacion_IdCampoOProyecto] DEFAULT (N'IdCampoOProyecto +') NOT NULL,
    [IdTipoCampoOProyecto]     NVARCHAR (50)  NOT NULL,
    [IdPeriodicidad]           NVARCHAR (5)   NOT NULL,
    [AñoLiquidado]             INT            NOT NULL,
    [PeriodoLiquidado]         INT            NOT NULL,
    [IdTipoRecursoNatural]     VARCHAR (1)    NOT NULL,
    [FechaInicioPeriodo]       SMALLDATETIME  NOT NULL,
    [FechaFinPeriodo]          SMALLDATETIME  NOT NULL,
    [IdRecursoNatural]         VARCHAR (10)   NOT NULL,
    [IdDepartamento]           VARCHAR (10)   NOT NULL,
    [IdMunicipio]              VARCHAR (10)   NOT NULL,
    [IdFiscalizacionNegocio]   NVARCHAR (50)  CONSTRAINT [DF_Fiscalizacion_IdFiscalizacionNegocio] DEFAULT (N'IdFiscalizacionNegocio') NULL,
    [IdTipoActividad]          NVARCHAR (50)  NULL,
    [FechaActividad]           DATETIME       NULL,
    [Observaciones]            VARCHAR (1500) NULL,
    [FechaUltimaModificacion]  DATETIME       NOT NULL,
    [ConsecutivoCarga]         INT            NOT NULL,
    [IdFiscalizacionSurrogada] NVARCHAR (MAX) NULL,
    [IdEtapa]                  INT            NULL,
    CONSTRAINT [PK_Fiscalizacion] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_Fiscalizacion_CampoOProyectoFiscalizacion] FOREIGN KEY ([IdCampoOProyecto], [IdTipoCampoOProyecto]) REFERENCES [dbo].[CampoOProyectoFiscalizacion] ([IdCampoOProyecto], [IdTipoCampoOProyecto]),
    CONSTRAINT [FK_Fiscalizacion_EnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]),
    CONSTRAINT [FK_Fiscalizacion_Periodicidad] FOREIGN KEY ([IdPeriodicidad]) REFERENCES [dbo].[Periodicidad] ([IdPeriodicidad]),
    CONSTRAINT [FK_Fiscalizacion_RecursoNaturalFiscalizacion] FOREIGN KEY ([IdRecursoNatural], [IdTipoRecursoNatural]) REFERENCES [dbo].[RecursoNaturalFiscalizacion] ([IdRecursoNatural], [IdTipoRecursoNatural]),
    CONSTRAINT [FK_Fiscalizacion_TipoActividadFiscalizacion] FOREIGN KEY ([IdTipoActividad]) REFERENCES [dbo].[TipoActividadFiscalizacion] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_391672443__K12_K10_K7_K5_19]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC, [AñoLiquidado] ASC)
    INCLUDE([IdFiscalizacionSurrogada]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_391672443__K3_K2_K14_K10_K12_K15_5_16_19]
    ON [dbo].[Fiscalizacion]([IdTipoCampoOProyecto] ASC, [IdCampoOProyecto] ASC, [IdTipoActividad] ASC, [IdRecursoNatural] ASC, [IdMunicipio] ASC, [FechaActividad] ASC)
    INCLUDE([AñoLiquidado], [Observaciones], [IdFiscalizacionSurrogada]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_391672443__K12_K10_K14_K2_K7_K5_19]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdRecursoNatural] ASC, [IdTipoActividad] ASC, [IdCampoOProyecto] ASC, [IdTipoRecursoNatural] ASC, [AñoLiquidado] ASC)
    INCLUDE([IdFiscalizacionSurrogada]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_2043154324__K3_K2_K14_K7_K10_K12_K15_5_16_19]
    ON [dbo].[Fiscalizacion]([IdTipoCampoOProyecto] ASC, [IdCampoOProyecto] ASC, [IdTipoActividad] ASC, [IdTipoRecursoNatural] ASC, [IdRecursoNatural] ASC, [IdMunicipio] ASC, [FechaActividad] ASC)
    INCLUDE([AñoLiquidado], [Observaciones], [IdFiscalizacionSurrogada]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_2043154324__K12_K14_K5_K10_K2_19]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdTipoActividad] ASC, [AñoLiquidado] ASC, [IdRecursoNatural] ASC, [IdCampoOProyecto] ASC)
    INCLUDE([IdFiscalizacionSurrogada]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_2043154324__K12_K11_K14_K5_K10_K2_19]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdDepartamento] ASC, [IdTipoActividad] ASC, [AñoLiquidado] ASC, [IdRecursoNatural] ASC, [IdCampoOProyecto] ASC)
    INCLUDE([IdFiscalizacionSurrogada]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_2043154324__K12_K14_K5_19]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdTipoActividad] ASC, [AñoLiquidado] ASC)
    INCLUDE([IdFiscalizacionSurrogada]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_2043154324__K7_K1_K3_K2]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural] ASC, [Id] ASC, [IdTipoCampoOProyecto] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_2043154324__K12_K11_K10_K7_4149]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdDepartamento] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_6_2043154324__K12_K10_K7_K5]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdRecursoNatural] ASC, [IdTipoRecursoNatural] ASC, [AñoLiquidado] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [NonClusteredIndex-20140221-135741]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K11_K2_K5_K7]
    ON [dbo].[Fiscalizacion]([IdDepartamento] ASC, [IdCampoOProyecto] ASC, [AñoLiquidado] ASC, [IdTipoRecursoNatural] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K11_K3_K2_K7_K5_14]
    ON [dbo].[Fiscalizacion]([IdDepartamento] ASC, [IdTipoCampoOProyecto] ASC, [IdCampoOProyecto] ASC, [IdTipoRecursoNatural] ASC, [AñoLiquidado] ASC)
    INCLUDE([IdTipoActividad]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K12_K11_K7_K2_K10]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdDepartamento] ASC, [IdTipoRecursoNatural] ASC, [IdCampoOProyecto] ASC, [IdRecursoNatural] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K12_K2_K5_K7]
    ON [dbo].[Fiscalizacion]([IdMunicipio] ASC, [IdCampoOProyecto] ASC, [AñoLiquidado] ASC, [IdTipoRecursoNatural] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K5_K12_K2_K3_K7_K10]
    ON [dbo].[Fiscalizacion]([AñoLiquidado] ASC, [IdMunicipio] ASC, [IdCampoOProyecto] ASC, [IdTipoCampoOProyecto] ASC, [IdTipoRecursoNatural] ASC, [IdRecursoNatural] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K5_K14_K7_K2]
    ON [dbo].[Fiscalizacion]([AñoLiquidado] ASC, [IdTipoActividad] ASC, [IdTipoRecursoNatural] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K5_K7_K11]
    ON [dbo].[Fiscalizacion]([AñoLiquidado] ASC, [IdTipoRecursoNatural] ASC, [IdDepartamento] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K5_K7_K11_K2]
    ON [dbo].[Fiscalizacion]([AñoLiquidado] ASC, [IdTipoRecursoNatural] ASC, [IdDepartamento] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K5_K7_K12_K2]
    ON [dbo].[Fiscalizacion]([AñoLiquidado] ASC, [IdTipoRecursoNatural] ASC, [IdMunicipio] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K7_K5_K14_K1_K2]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural] ASC, [AñoLiquidado] ASC, [IdTipoActividad] ASC, [Id] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K7_K5_K2]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural] ASC, [AñoLiquidado] ASC, [IdCampoOProyecto] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fiscalizacion_5_2043154324__K7_K5_K2_1_3_11_12_14]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural] ASC, [AñoLiquidado] ASC, [IdCampoOProyecto] ASC)
    INCLUDE([Id], [IdTipoCampoOProyecto], [IdDepartamento], [IdMunicipio], [IdTipoActividad]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_391672443_10_14_12_3]
    ON [dbo].[Fiscalizacion]([IdRecursoNatural], [IdTipoActividad], [IdMunicipio], [IdTipoCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_391672443_10_7_12_5]
    ON [dbo].[Fiscalizacion]([IdRecursoNatural], [IdTipoRecursoNatural], [IdMunicipio], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_391672443_14_10_3]
    ON [dbo].[Fiscalizacion]([IdTipoActividad], [IdRecursoNatural], [IdTipoCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_391672443_14_12_3_2_10_15]
    ON [dbo].[Fiscalizacion]([IdTipoActividad], [IdMunicipio], [IdTipoCampoOProyecto], [IdCampoOProyecto], [IdRecursoNatural], [FechaActividad]);


GO
CREATE STATISTICS [_dta_stat_391672443_10_7_12_2]
    ON [dbo].[Fiscalizacion]([IdRecursoNatural], [IdTipoRecursoNatural], [IdMunicipio], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_391672443_14_10_7_12]
    ON [dbo].[Fiscalizacion]([IdTipoActividad], [IdRecursoNatural], [IdTipoRecursoNatural], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_391672443_2_10_14_7]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdRecursoNatural], [IdTipoActividad], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_391672443_2_10_7]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdRecursoNatural], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_391672443_5_10_14_2]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdRecursoNatural], [IdTipoActividad], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_2043154324_15_7_14]
    ON [dbo].[Fiscalizacion]([FechaActividad], [IdTipoRecursoNatural], [IdTipoActividad]);


GO
CREATE STATISTICS [_dta_stat_2043154324_10_7_14_15]
    ON [dbo].[Fiscalizacion]([IdRecursoNatural], [IdTipoRecursoNatural], [IdTipoActividad], [FechaActividad]);


GO
CREATE STATISTICS [_dta_stat_2043154324_14_7_10_3_2]
    ON [dbo].[Fiscalizacion]([IdTipoActividad], [IdTipoRecursoNatural], [IdRecursoNatural], [IdTipoCampoOProyecto], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_2043154324_12_14_7_10_3_2_15]
    ON [dbo].[Fiscalizacion]([IdMunicipio], [IdTipoActividad], [IdTipoRecursoNatural], [IdRecursoNatural], [IdTipoCampoOProyecto], [IdCampoOProyecto], [FechaActividad]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_12]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_12_10]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdMunicipio], [IdRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_10_12_2_5_14]
    ON [dbo].[Fiscalizacion]([IdRecursoNatural], [IdMunicipio], [IdCampoOProyecto], [AñoLiquidado], [IdTipoActividad]);


GO
CREATE STATISTICS [_dta_stat_2043154324_12_11_10]
    ON [dbo].[Fiscalizacion]([IdMunicipio], [IdDepartamento], [IdRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_10_2_5]
    ON [dbo].[Fiscalizacion]([IdRecursoNatural], [IdCampoOProyecto], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_12_11_10]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdMunicipio], [IdDepartamento], [IdRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_12_11_10_2_14]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdMunicipio], [IdDepartamento], [IdRecursoNatural], [IdCampoOProyecto], [IdTipoActividad]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_14]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdTipoActividad]);


GO
CREATE STATISTICS [_dta_stat_2043154324_1_3]
    ON [dbo].[Fiscalizacion]([Id], [IdTipoCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_7]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_1_2_7]
    ON [dbo].[Fiscalizacion]([Id], [IdCampoOProyecto], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_3_2]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [IdTipoCampoOProyecto], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_2043154324_14_12_2]
    ON [dbo].[Fiscalizacion]([IdTipoActividad], [IdMunicipio], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_2043154324_3_2_1_7]
    ON [dbo].[Fiscalizacion]([IdTipoCampoOProyecto], [IdCampoOProyecto], [Id], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_10_7]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdRecursoNatural], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_10_14_2_7]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdRecursoNatural], [IdTipoActividad], [IdCampoOProyecto], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_1_11_5]
    ON [dbo].[Fiscalizacion]([Id], [IdDepartamento], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_1_14_7]
    ON [dbo].[Fiscalizacion]([Id], [IdTipoActividad], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_1_7_5]
    ON [dbo].[Fiscalizacion]([Id], [IdTipoRecursoNatural], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_10_12_2_3_5_7]
    ON [dbo].[Fiscalizacion]([IdRecursoNatural], [IdMunicipio], [IdCampoOProyecto], [IdTipoCampoOProyecto], [AñoLiquidado], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_11_1_2_5]
    ON [dbo].[Fiscalizacion]([IdDepartamento], [Id], [IdCampoOProyecto], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_11_5]
    ON [dbo].[Fiscalizacion]([IdDepartamento], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_11_7_10]
    ON [dbo].[Fiscalizacion]([IdDepartamento], [IdTipoRecursoNatural], [IdRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_12_11_1]
    ON [dbo].[Fiscalizacion]([IdMunicipio], [IdDepartamento], [Id]);


GO
CREATE STATISTICS [_dta_stat_2043154324_14_5_1_7_2]
    ON [dbo].[Fiscalizacion]([IdTipoActividad], [AñoLiquidado], [Id], [IdTipoRecursoNatural], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_2043154324_14_5_7]
    ON [dbo].[Fiscalizacion]([IdTipoActividad], [AñoLiquidado], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_15_7_10]
    ON [dbo].[Fiscalizacion]([FechaActividad], [IdTipoRecursoNatural], [IdRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_1_3_12_11]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [Id], [IdTipoCampoOProyecto], [IdMunicipio], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_3_12_11]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdTipoCampoOProyecto], [IdMunicipio], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_3_7_10_5]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdTipoCampoOProyecto], [IdTipoRecursoNatural], [IdRecursoNatural], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_7_10_5_12]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdTipoRecursoNatural], [IdRecursoNatural], [AñoLiquidado], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_7_11_3_5]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdTipoRecursoNatural], [IdDepartamento], [IdTipoCampoOProyecto], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_7_12_5]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdTipoRecursoNatural], [IdMunicipio], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_2_7_5]
    ON [dbo].[Fiscalizacion]([IdCampoOProyecto], [IdTipoRecursoNatural], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_3_2_11]
    ON [dbo].[Fiscalizacion]([IdTipoCampoOProyecto], [IdCampoOProyecto], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_1_2_7]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [Id], [IdCampoOProyecto], [IdTipoRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_2_1_3_12_11]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdCampoOProyecto], [Id], [IdTipoCampoOProyecto], [IdMunicipio], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_2043154324_5_2_7_12_11]
    ON [dbo].[Fiscalizacion]([AñoLiquidado], [IdCampoOProyecto], [IdTipoRecursoNatural], [IdMunicipio], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_1_12_11_2_3_5]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [Id], [IdMunicipio], [IdDepartamento], [IdCampoOProyecto], [IdTipoCampoOProyecto], [AñoLiquidado]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_1_2_14]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [Id], [IdCampoOProyecto], [IdTipoActividad]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_11]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_2_11_10]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [IdCampoOProyecto], [IdDepartamento], [IdRecursoNatural]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_2_3_12_11]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [IdCampoOProyecto], [IdTipoCampoOProyecto], [IdMunicipio], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_5_1_11_2]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [AñoLiquidado], [Id], [IdDepartamento], [IdCampoOProyecto]);


GO
CREATE STATISTICS [_dta_stat_2043154324_7_5_2_14]
    ON [dbo].[Fiscalizacion]([IdTipoRecursoNatural], [AñoLiquidado], [IdCampoOProyecto], [IdTipoActividad]);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Titulo Minero o Pozo Petrolifero', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'Fiscalizacion', @level2type = N'COLUMN', @level2name = N'IdTipoCampoOProyecto';

