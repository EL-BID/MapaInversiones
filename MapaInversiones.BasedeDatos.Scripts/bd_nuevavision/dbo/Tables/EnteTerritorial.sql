CREATE TABLE [dbo].[EnteTerritorial] (
    [IdRegion]                      VARCHAR (10)      NULL,
    [IdDepartamento]                VARCHAR (10)      NOT NULL,
    [IdMunicipio]                   VARCHAR (10)      NOT NULL,
    [NombreRegion]                  VARCHAR (50)      NULL,
    [NombreDepartamento]            VARCHAR (50)      NOT NULL,
    [NombreMunicipio]               VARCHAR (50)      NOT NULL,
    [GeoPoligonoEntidadTerritorial] [sys].[geography] NULL,
    [CodigoDANE]                    VARCHAR (15)      NULL,
    [FechaUltimaModificacion]       DATETIME          NOT NULL,
    [Modificadopor]                 VARCHAR (30)      NOT NULL,
    [ConsecutivoCarga]              INT               NOT NULL,
    [TopLeft]                       [sys].[geography] NULL,
    [BottomRight]                   [sys].[geography] NULL,
    [Tipo]                          VARCHAR (50)      NULL,
    [Version]                       INT               NULL,
    [Centroide]                     [sys].[geography] NULL,
    [Geojson]                       VARCHAR (MAX)     NULL,
    CONSTRAINT [Pk_EnteTerritorial_IdDep_IdMuni] PRIMARY KEY CLUSTERED ([IdDepartamento] ASC, [IdMunicipio] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON)
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_19_971150505__K1]
    ON [dbo].[EnteTerritorial]([IdRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_19_971150505__K14_5]
    ON [dbo].[EnteTerritorial]([Tipo] ASC)
    INCLUDE([NombreDepartamento]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_25_971150505__K3_2_4_5_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC)
    INCLUDE([IdDepartamento], [NombreRegion], [NombreDepartamento], [NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_12_693577509__K11_17_9987]
    ON [dbo].[EnteTerritorial]([ConsecutivoCarga] ASC)
    INCLUDE([Geojson]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE UNIQUE NONCLUSTERED INDEX [Ux_IdMunicipio]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K14_K3_K2_K1]
    ON [dbo].[EnteTerritorial]([Tipo] ASC, [IdMunicipio] ASC, [IdDepartamento] ASC, [IdRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K3_1_2_4_5_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC)
    INCLUDE([IdRegion], [IdDepartamento], [NombreRegion], [NombreDepartamento], [NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K3_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC)
    INCLUDE([NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K3_K14_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [Tipo] ASC)
    INCLUDE([NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K3_K2_K5]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [IdDepartamento] ASC, [NombreDepartamento] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K1_K4_2_3]
    ON [dbo].[EnteTerritorial]([IdRegion] ASC, [NombreRegion] ASC)
    INCLUDE([IdDepartamento], [IdMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K14_K1_K3_1040]
    ON [dbo].[EnteTerritorial]([Tipo] ASC, [IdRegion] ASC, [IdMunicipio] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K2_K1_K3_6]
    ON [dbo].[EnteTerritorial]([IdDepartamento] ASC, [IdRegion] ASC, [IdMunicipio] ASC)
    INCLUDE([NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K2_K3_K5_4364]
    ON [dbo].[EnteTerritorial]([IdDepartamento] ASC, [IdMunicipio] ASC, [NombreDepartamento] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K3_K1_K8_K2_4_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [IdRegion] ASC, [CodigoDANE] ASC, [IdDepartamento] ASC)
    INCLUDE([NombreRegion], [NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K3_K2_4_5_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [IdDepartamento] ASC)
    INCLUDE([NombreRegion], [NombreDepartamento], [NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_971150505__K5_K2_K3_K1_6497]
    ON [dbo].[EnteTerritorial]([NombreDepartamento] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC, [IdRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_5_693577509__K4]
    ON [dbo].[EnteTerritorial]([NombreRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_5_693577509__K2_K3_4_5_6_8]
    ON [dbo].[EnteTerritorial]([IdDepartamento] ASC, [IdMunicipio] ASC)
    INCLUDE([NombreRegion], [NombreDepartamento], [NombreMunicipio], [CodigoDANE]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_5_693577509__K14_K3_K1_K2_K5_K4]
    ON [dbo].[EnteTerritorial]([Tipo] ASC, [IdMunicipio] ASC, [IdRegion] ASC, [IdDepartamento] ASC, [NombreDepartamento] ASC, [NombreRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_5_693577509__K3_K5_K2_K14_K1_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [NombreDepartamento] ASC, [IdDepartamento] ASC, [Tipo] ASC, [IdRegion] ASC)
    INCLUDE([NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_6_693577509__K1_K2_K3_K4_2533]
    ON [dbo].[EnteTerritorial]([IdRegion] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC, [NombreRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_6_693577509__K14_K1_K2_K3_K4_K5]
    ON [dbo].[EnteTerritorial]([Tipo] ASC, [IdRegion] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC, [NombreRegion] ASC, [NombreDepartamento] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_6_693577509__K2_K3_17]
    ON [dbo].[EnteTerritorial]([IdDepartamento] ASC, [IdMunicipio] ASC)
    INCLUDE([Geojson]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_6_693577509__K2_K3_K1_K14_K4_K5]
    ON [dbo].[EnteTerritorial]([IdDepartamento] ASC, [IdMunicipio] ASC, [IdRegion] ASC, [Tipo] ASC, [NombreRegion] ASC, [NombreDepartamento] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_6_693577509__K3_K1_K2_K4]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [IdRegion] ASC, [IdDepartamento] ASC, [NombreRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_6_693577509__K3_K2_K1]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [IdDepartamento] ASC, [IdRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_6_693577509__K3_K2_K1_K4_6497]
    ON [dbo].[EnteTerritorial]([IdMunicipio] ASC, [IdDepartamento] ASC, [IdRegion] ASC, [NombreRegion] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [_dta_index_EnteTerritorial_7_693577509__K2_K3_5_6]
    ON [dbo].[EnteTerritorial]([IdDepartamento] ASC, [IdMunicipio] ASC)
    INCLUDE([NombreDepartamento], [NombreMunicipio]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE SPATIAL INDEX [SpatialIndex-20141126-090019]
    ON [dbo].[EnteTerritorial] ([GeoPoligonoEntidadTerritorial])
    WITH  (
            CELLS_PER_OBJECT = 16,
            FILLFACTOR = 80,
            STATISTICS_NORECOMPUTE = ON
          );


GO
CREATE STATISTICS [_dta_stat_971150505_11_14]
    ON [dbo].[EnteTerritorial]([ConsecutivoCarga], [Tipo]);


GO
CREATE STATISTICS [_dta_stat_971150505_2_3_14]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [IdMunicipio], [Tipo]);


GO
CREATE STATISTICS [_dta_stat_971150505_3_14]
    ON [dbo].[EnteTerritorial]([IdMunicipio], [Tipo]);


GO
CREATE STATISTICS [_dta_stat_971150505_1_4]
    ON [dbo].[EnteTerritorial]([IdRegion], [NombreRegion]);


GO
CREATE STATISTICS [_dta_stat_971150505_1_4_14]
    ON [dbo].[EnteTerritorial]([IdRegion], [NombreRegion], [Tipo]);


GO
CREATE STATISTICS [_dta_stat_971150505_14_3_1]
    ON [dbo].[EnteTerritorial]([Tipo], [IdMunicipio], [IdRegion]);


GO
CREATE STATISTICS [_dta_stat_971150505_14_3_2_1_4]
    ON [dbo].[EnteTerritorial]([Tipo], [IdMunicipio], [IdDepartamento], [IdRegion], [NombreRegion]);


GO
CREATE STATISTICS [_dta_stat_971150505_2_14_5]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [Tipo], [NombreDepartamento]);


GO
CREATE STATISTICS [_dta_stat_971150505_2_5]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [NombreDepartamento]);


GO
CREATE STATISTICS [_dta_stat_971150505_3_1_4]
    ON [dbo].[EnteTerritorial]([IdMunicipio], [IdRegion], [NombreRegion]);


GO
CREATE STATISTICS [_dta_stat_693577509_4_2]
    ON [dbo].[EnteTerritorial]([NombreRegion], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_4_3]
    ON [dbo].[EnteTerritorial]([NombreRegion], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_8_6_4]
    ON [dbo].[EnteTerritorial]([CodigoDANE], [NombreMunicipio], [NombreRegion]);


GO
CREATE STATISTICS [_dta_stat_693577509_8_5_6]
    ON [dbo].[EnteTerritorial]([CodigoDANE], [NombreDepartamento], [NombreMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_5_4_8_6]
    ON [dbo].[EnteTerritorial]([NombreDepartamento], [NombreRegion], [CodigoDANE], [NombreMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_3_2_4_8]
    ON [dbo].[EnteTerritorial]([IdMunicipio], [IdDepartamento], [NombreRegion], [CodigoDANE]);


GO
CREATE STATISTICS [_dta_stat_693577509_2_3_4_8_6]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [IdMunicipio], [NombreRegion], [CodigoDANE], [NombreMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_2_3_5_4_8_6]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [IdMunicipio], [NombreDepartamento], [NombreRegion], [CodigoDANE], [NombreMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_1_2_3_14_5]
    ON [dbo].[EnteTerritorial]([IdRegion], [IdDepartamento], [IdMunicipio], [Tipo], [NombreDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_1_2_3_14_6]
    ON [dbo].[EnteTerritorial]([IdRegion], [IdDepartamento], [IdMunicipio], [Tipo], [NombreMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_11_3_1_2]
    ON [dbo].[EnteTerritorial]([ConsecutivoCarga], [IdMunicipio], [IdRegion], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_14_3_2_5]
    ON [dbo].[EnteTerritorial]([Tipo], [IdMunicipio], [IdDepartamento], [NombreDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_2_3_14_1_4_5]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [IdMunicipio], [Tipo], [IdRegion], [NombreRegion], [NombreDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_2_5_1]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [NombreDepartamento], [IdRegion]);


GO
CREATE STATISTICS [_dta_stat_693577509_2_5_1_14]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [NombreDepartamento], [IdRegion], [Tipo]);


GO
CREATE STATISTICS [_dta_stat_693577509_2_8_3]
    ON [dbo].[EnteTerritorial]([IdDepartamento], [CodigoDANE], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_3_4_5]
    ON [dbo].[EnteTerritorial]([IdMunicipio], [NombreRegion], [NombreDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_3_5_2_14_1_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio], [NombreDepartamento], [IdDepartamento], [Tipo], [IdRegion], [NombreMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_3_5_6]
    ON [dbo].[EnteTerritorial]([IdMunicipio], [NombreDepartamento], [NombreMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_4_1_2_5]
    ON [dbo].[EnteTerritorial]([NombreRegion], [IdRegion], [IdDepartamento], [NombreDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_5_3_1_14]
    ON [dbo].[EnteTerritorial]([NombreDepartamento], [IdMunicipio], [IdRegion], [Tipo]);


GO
CREATE STATISTICS [_dta_stat_693577509_5_3_14]
    ON [dbo].[EnteTerritorial]([NombreDepartamento], [IdMunicipio], [Tipo]);


GO
CREATE STATISTICS [_dta_stat_693577509_5_6_4_3]
    ON [dbo].[EnteTerritorial]([NombreDepartamento], [NombreMunicipio], [NombreRegion], [IdMunicipio]);


GO
CREATE STATISTICS [_dta_stat_693577509_6_3_4]
    ON [dbo].[EnteTerritorial]([NombreMunicipio], [IdMunicipio], [NombreRegion]);


GO
CREATE STATISTICS [_dta_stat_693577509_6_3_5_2]
    ON [dbo].[EnteTerritorial]([NombreMunicipio], [IdMunicipio], [NombreDepartamento], [IdDepartamento]);


GO
CREATE STATISTICS [_dta_stat_693577509_8_3_5_1_2]
    ON [dbo].[EnteTerritorial]([CodigoDANE], [IdMunicipio], [NombreDepartamento], [IdRegion], [IdDepartamento]);

