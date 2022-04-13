CREATE TABLE [dbo].[Fuente] (
    [IdTipoRecurso]           INT           NOT NULL,
    [IdTipoEntidad]           INT           NOT NULL,
    [IdEntidad]               VARCHAR (30)  NOT NULL,
    [NombreTipoRecurso]       VARCHAR (200) NOT NULL,
    [NombreTipoEntidad]       VARCHAR (200) NOT NULL,
    [NombreEntidad]           VARCHAR (200) NOT NULL,
    [EsFuenteRegalias]        BIT           NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [Modificadopor]           VARCHAR (30)  NOT NULL,
    [IdDepartamento]          VARCHAR (10)  NULL,
    [IdMunicipio]             VARCHAR (10)  NULL,
    CONSTRAINT [PK_Fuente] PRIMARY KEY CLUSTERED ([IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_Fuente_EnteTerritorialMunicipio] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fuente_5_885578193__K7_1_2_3_4]
    ON [dbo].[Fuente]([EsFuenteRegalias] ASC)
    INCLUDE([IdTipoRecurso], [IdTipoEntidad], [IdEntidad], [NombreTipoRecurso]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fuente_5_885578193__K11_K12_K1_K2_K3_4]
    ON [dbo].[Fuente]([IdDepartamento] ASC, [IdMunicipio] ASC, [IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC)
    INCLUDE([NombreTipoRecurso]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fuente_5_885578193__K1_K2_K3_K11_K12_4_5]
    ON [dbo].[Fuente]([IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC)
    INCLUDE([NombreTipoRecurso], [NombreTipoEntidad]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fuente_5_885578193__K11_K12_K1_K2_K3_4_5_6]
    ON [dbo].[Fuente]([IdDepartamento] ASC, [IdMunicipio] ASC, [IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC)
    INCLUDE([NombreTipoRecurso], [NombreTipoEntidad], [NombreEntidad]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Fuente_5_885578193__K1_K2_K3_K4_K5_K6]
    ON [dbo].[Fuente]([IdTipoRecurso] ASC, [IdTipoEntidad] ASC, [IdEntidad] ASC, [NombreTipoRecurso] ASC, [NombreTipoEntidad] ASC, [NombreEntidad] ASC) WITH (FILLFACTOR = 80);


GO
CREATE STATISTICS [_dta_stat_885578193_7_1_2_3]
    ON [dbo].[Fuente]([EsFuenteRegalias], [IdTipoRecurso], [IdTipoEntidad], [IdEntidad]);


GO
CREATE STATISTICS [_dta_stat_885578193_3_1_4_5]
    ON [dbo].[Fuente]([IdEntidad], [IdTipoRecurso], [NombreTipoRecurso], [NombreTipoEntidad]);


GO
CREATE STATISTICS [_dta_stat_885578193_4_1_2_3]
    ON [dbo].[Fuente]([NombreTipoRecurso], [IdTipoRecurso], [IdTipoEntidad], [IdEntidad]);


GO
CREATE STATISTICS [_dta_stat_885578193_6_1_2_3_4]
    ON [dbo].[Fuente]([NombreEntidad], [IdTipoRecurso], [IdTipoEntidad], [IdEntidad], [NombreTipoRecurso]);


GO
CREATE STATISTICS [_dta_stat_885578193_1_4_5_6_3]
    ON [dbo].[Fuente]([IdTipoRecurso], [NombreTipoRecurso], [NombreTipoEntidad], [NombreEntidad], [IdEntidad]);


GO
CREATE STATISTICS [_dta_stat_885578193_1_4_5_6_2]
    ON [dbo].[Fuente]([IdTipoRecurso], [NombreTipoRecurso], [NombreTipoEntidad], [NombreEntidad], [IdTipoEntidad]);


GO
CREATE STATISTICS [_dta_stat_885578193_5_1_2_3_4_6]
    ON [dbo].[Fuente]([NombreTipoEntidad], [IdTipoRecurso], [IdTipoEntidad], [IdEntidad], [NombreTipoRecurso], [NombreEntidad]);

