CREATE TABLE [dbo].[Distribucion] (
    [IdTipoRecurso]           INT             NOT NULL,
    [IdTipoEntidad]           INT             NOT NULL,
    [IdEntidad]               VARCHAR (30)    NOT NULL,
    [Monto]                   DECIMAL (18, 2) NOT NULL,
    [FechaInicioDistribucion] SMALLDATETIME   NOT NULL,
    [FechaFinDistribucion]    SMALLDATETIME   NOT NULL,
    [MesDistribucion]         INT             NOT NULL,
    [AñoDistribucion]         INT             NOT NULL,
    [IdDepartamento]          VARCHAR (10)    NULL,
    [IdMunicipio]             VARCHAR (10)    NULL,
    [IdTipoDeFinanciacion]    INT             NOT NULL,
    [FechaUltimaModificacion] DATETIME        NOT NULL,
    [ConsecutivoCarga]        INT             NOT NULL,
    CONSTRAINT [PK_Distribucion] PRIMARY KEY CLUSTERED ([IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC, [MesDistribucion] ASC, [AñoDistribucion] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_Disribucion_EnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]),
    CONSTRAINT [FK_Disribucion_Fuente] FOREIGN KEY ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad]) REFERENCES [dbo].[Fuente] ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad]),
    CONSTRAINT [FK_Distribucion_TipoDeFinanciacion] FOREIGN KEY ([IdTipoDeFinanciacion]) REFERENCES [dbo].[TipoDeFinanciacion] ([IdTipoFinanciacion])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Distribucion_5_66099276__K9_K10_K1_K2_K3_K11_4_5]
    ON [dbo].[Distribucion]([IdDepartamento] ASC, [IdMunicipio] ASC, [IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC, [IdTipoDeFinanciacion] ASC)
    INCLUDE([Monto], [FechaInicioDistribucion]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_66099276_11_9]
    ON [dbo].[Distribucion]([IdTipoDeFinanciacion], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_66099276_10_11_9_1_2_3]
    ON [dbo].[Distribucion]([IdMunicipio], [IdTipoDeFinanciacion], [IdDepartamento], [IdTipoRecurso], [IdTipoEntidad], [IdEntidad]);

