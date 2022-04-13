CREATE TABLE [dbo].[Proyecto] (
    [IdProyecto]                      INT             NOT NULL,
    [CodigoBPIN]                      VARCHAR (MAX)   NOT NULL,
    [NombreProyecto]                  VARCHAR (MAX)   NOT NULL,
    [FechaInicioProyecto]             DATETIME        NOT NULL,
    [FechaFinProyecto]                DATETIME        NOT NULL,
    [VlrTotalProyectoFuenteRegalias]  DECIMAL (18, 2) NOT NULL,
    [VlrTotalProyectoTodasLasFuentes] DECIMAL (18, 2) NOT NULL,
    [ObjetivoGeneral]                 VARCHAR (MAX)   NOT NULL,
    [IdSector]                        INT             NOT NULL,
    [TipoDeProyecto]                  VARCHAR (MAX)   NOT NULL,
    [NumeroBeneficiarios]             BIGINT          NOT NULL,
    [IdOCAD]                          INT             NOT NULL,
    [NombreOCAD]                      VARCHAR (MAX)   NOT NULL,
    [FechaUltimaModificacion]         DATETIME        NOT NULL,
    [ConsecutivoCarga]                INT             NOT NULL,
    [Modificadopor]                   VARCHAR (30)    NOT NULL,
    [PorcentajeAvanceFisico]          DECIMAL (10, 2) NOT NULL,
    [PorcentajeAvanceFinanciero]      DECIMAL (10, 2) NULL,
    CONSTRAINT [Pk_Proyectos_IdProyecto] PRIMARY KEY CLUSTERED ([IdProyecto] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON),
    CONSTRAINT [Fk_ProyectoXSector] FOREIGN KEY ([IdSector]) REFERENCES [dbo].[Sector] ([IdSector]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_19_71671303__K1]
    ON [dbo].[Proyecto]([IdProyecto] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_19_71671303__K1_K12_2_3_4_5_6]
    ON [dbo].[Proyecto]([IdProyecto] ASC, [IdOCAD] ASC)
    INCLUDE([CodigoBPIN], [NombreProyecto], [FechaInicioProyecto], [FechaFinProyecto], [VlrTotalProyectoFuenteRegalias]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_12_1221579390__K15_3_9987]
    ON [dbo].[Proyecto]([ConsecutivoCarga] ASC)
    INCLUDE([NombreProyecto]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_12_1221579390__K1_4_4364]
    ON [dbo].[Proyecto]([IdProyecto] ASC)
    INCLUDE([FechaInicioProyecto]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_7_1591676718__K1_K9]
    ON [dbo].[Proyecto]([IdProyecto] ASC, [IdSector] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_5_1221579390__K1_2]
    ON [dbo].[Proyecto]([IdProyecto] ASC)
    INCLUDE([CodigoBPIN]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_5_1221579390__K9_K1_K6_K7_2_3]
    ON [dbo].[Proyecto]([IdSector] ASC, [IdProyecto] ASC, [VlrTotalProyectoFuenteRegalias] ASC, [VlrTotalProyectoTodasLasFuentes] ASC)
    INCLUDE([CodigoBPIN], [NombreProyecto]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_6_1221579390__K1_3_4_5_6_7]
    ON [dbo].[Proyecto]([IdProyecto] ASC)
    INCLUDE([NombreProyecto], [FechaInicioProyecto], [FechaFinProyecto], [VlrTotalProyectoFuenteRegalias], [VlrTotalProyectoTodasLasFuentes]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Proyecto_7_1221579390__K1_K9_2_3_6_13]
    ON [dbo].[Proyecto]([IdProyecto] ASC, [IdSector] ASC)
    INCLUDE([CodigoBPIN], [NombreProyecto], [VlrTotalProyectoFuenteRegalias], [NombreOCAD]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE STATISTICS [_dta_stat_1221579390_6_7_1]
    ON [dbo].[Proyecto]([VlrTotalProyectoFuenteRegalias], [VlrTotalProyectoTodasLasFuentes], [IdProyecto]);

