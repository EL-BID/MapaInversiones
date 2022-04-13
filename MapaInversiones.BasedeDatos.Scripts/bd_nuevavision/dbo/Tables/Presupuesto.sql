CREATE TABLE [dbo].[Presupuesto] (
    [IdTipoRecurso]           INT             NOT NULL,
    [IdTipoEntidad]           INT             NOT NULL,
    [IdEntidad]               VARCHAR (30)    NOT NULL,
    [IdDepartamento]          VARCHAR (10)    NOT NULL,
    [IdMunicipio]             VARCHAR (10)    NOT NULL,
    [InicioVigencia]          SMALLDATETIME   NOT NULL,
    [FinVigencia]             SMALLDATETIME   NOT NULL,
    [NombreEntidad]           VARCHAR (150)   NULL,
    [ValorMonto]              DECIMAL (30, 8) NOT NULL,
    [IdTipoDeFinanciacion]    INT             NOT NULL,
    [FechaUltimaModificacion] DATETIME        NOT NULL,
    [ConsecutivoCarga]        INT             NOT NULL,
    CONSTRAINT [PK_Presupuesto] PRIMARY KEY CLUSTERED ([IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC, [InicioVigencia] ASC, [FinVigencia] ASC) WITH (FILLFACTOR = 80)
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Presupuesto_7_809769942__K10_K5_K4_6_9]
    ON [dbo].[Presupuesto]([IdTipoDeFinanciacion] ASC, [IdMunicipio] ASC, [IdDepartamento] ASC)
    INCLUDE([InicioVigencia], [ValorMonto]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Presupuesto_7_809769942__K4_K10_6_9]
    ON [dbo].[Presupuesto]([IdDepartamento] ASC, [IdTipoDeFinanciacion] ASC)
    INCLUDE([InicioVigencia], [ValorMonto]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Presupuesto_7_809769942__K5_K10_6_9]
    ON [dbo].[Presupuesto]([IdMunicipio] ASC, [IdTipoDeFinanciacion] ASC)
    INCLUDE([InicioVigencia], [ValorMonto]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Presupuesto_7_809769942__K5_K4_K10_6_7_9_9987]
    ON [dbo].[Presupuesto]([IdMunicipio] ASC, [IdDepartamento] ASC, [IdTipoDeFinanciacion] ASC)
    INCLUDE([InicioVigencia], [FinVigencia], [ValorMonto]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Presupuesto_7_809769942__K6]
    ON [dbo].[Presupuesto]([InicioVigencia] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Presupuesto_5_194099732__K10_K4_K5_K1_K2_K3_6_8_9]
    ON [dbo].[Presupuesto]([IdTipoDeFinanciacion] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC, [IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC)
    INCLUDE([InicioVigencia], [NombreEntidad], [ValorMonto]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Presupuesto_5_194099732__K1_K2_K3_K4_K5_9]
    ON [dbo].[Presupuesto]([IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC)
    INCLUDE([ValorMonto]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_809769942_10_5]
    ON [dbo].[Presupuesto]([IdTipoDeFinanciacion], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_809769942_5_4_10]
    ON [dbo].[Presupuesto]([IdMunicipio], [IdDepartamento], [IdTipoDeFinanciacion]);


GO
CREATE STATISTICS [_dta_stat_194099732_5_1_2]
    ON [dbo].[Presupuesto]([IdMunicipio], [IdTipoRecurso], [IdTipoEntidad]);


GO
CREATE STATISTICS [_dta_stat_194099732_5_4_1_2]
    ON [dbo].[Presupuesto]([IdMunicipio], [IdDepartamento], [IdTipoRecurso], [IdTipoEntidad]);

