CREATE TABLE [dbo].[Giro] (
    [IdGiro]                  INT             IDENTITY (1, 1) NOT NULL,
    [IdTipoRecurso]           INT             NOT NULL,
    [IdTipoEntidad]           INT             NOT NULL,
    [IdEntidad]               VARCHAR (30)    NOT NULL,
    [VigenciaInicio]          DATETIME        NOT NULL,
    [VigenciaFin]             DATETIME        NOT NULL,
    [Monto]                   DECIMAL (30, 8) NOT NULL,
    [CodigoBPIN]              VARCHAR (200)   NULL,
    [FechaDeGiro]             SMALLDATETIME   NOT NULL,
    [AñoFiscal]               INT             NOT NULL,
    [NITEjecutor]             NVARCHAR (11)   NULL,
    [NombreEjecutor]          VARCHAR (500)   NULL,
    [IdDepartamento]          VARCHAR (10)    NULL,
    [IdMunicipio]             VARCHAR (10)    NULL,
    [IdTipoDeFinanciacion]    INT             NOT NULL,
    [FechaUltimaModificacion] DATETIME        NOT NULL,
    [ConsecutivoCarga]        INT             NOT NULL,
    CONSTRAINT [PK_Giro] PRIMARY KEY CLUSTERED ([IdGiro] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_Giro_EnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]),
    CONSTRAINT [FK_Giro_Fuente] FOREIGN KEY ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad]) REFERENCES [dbo].[Fuente] ([IdTipoRecurso], [IdTipoEntidad], [IdEntidad])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Giro_5_98099390__K2_K3_K4_K13_K14_K15_5_7_9_11_12]
    ON [dbo].[Giro]([IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC, [IdTipoDeFinanciacion] ASC)
    INCLUDE([VigenciaInicio], [Monto], [FechaDeGiro], [NITEjecutor], [NombreEjecutor]) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_98099390_13_14_2_3]
    ON [dbo].[Giro]([IdDepartamento], [IdMunicipio], [IdTipoRecurso], [IdTipoEntidad]);


GO
CREATE STATISTICS [_dta_stat_98099390_15_2_3_4_13_14]
    ON [dbo].[Giro]([IdTipoDeFinanciacion], [IdTipoRecurso], [IdTipoEntidad], [IdEntidad], [IdDepartamento], [IdMunicipio]);

