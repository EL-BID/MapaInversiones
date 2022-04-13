CREATE TABLE [dbo].[CabeceraMunicipio] (
    [DEPARTAMENTO]   NVARCHAR (4000)   NULL,
    [MUNICIPIO]      NVARCHAR (4000)   NOT NULL,
    [Latitud]        DECIMAL (18, 10)  NOT NULL,
    [LONGITUD]       DECIMAL (18, 10)  NOT NULL,
    [CodigoDane]     VARCHAR (10)      NOT NULL,
    [PuntoUbicacion] [sys].[geography] NULL,
    CONSTRAINT [PK_CabeceraMunicipio_1] PRIMARY KEY CLUSTERED ([CodigoDane] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_CabeceraMunicipio_EnteTerritorial] FOREIGN KEY ([CodigoDane]) REFERENCES [dbo].[EnteTerritorial] ([IdMunicipio])
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CabeceraMunicipio_7_1853249657__K5]
    ON [dbo].[CabeceraMunicipio]([CodigoDane] ASC) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CabeceraMunicipio_7_1853249657__K5_3_4]
    ON [dbo].[CabeceraMunicipio]([CodigoDane] ASC)
    INCLUDE([Latitud], [LONGITUD]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CabeceraMunicipio_7_1853249657__K5_6_5492]
    ON [dbo].[CabeceraMunicipio]([CodigoDane] ASC)
    INCLUDE([PuntoUbicacion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CabeceraMunicipio_7_1853249657__K5_K3_K4_6_3982]
    ON [dbo].[CabeceraMunicipio]([CodigoDane] ASC, [Latitud] ASC, [LONGITUD] ASC)
    INCLUDE([PuntoUbicacion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_CabeceraMunicipio_5_677577452__K5_3_4_6]
    ON [dbo].[CabeceraMunicipio]([CodigoDane] ASC)
    INCLUDE([Latitud], [LONGITUD], [PuntoUbicacion]) WITH (FILLFACTOR = 80);


GO
CREATE SPATIAL INDEX [SpatialIndex-20141124-203801]
    ON [dbo].[CabeceraMunicipio] ([PuntoUbicacion])
    WITH  (
            CELLS_PER_OBJECT = 16,
            FILLFACTOR = 80
          );


GO
CREATE STATISTICS [_dta_stat_1853249657_3_4]
    ON [dbo].[CabeceraMunicipio]([Latitud], [LONGITUD]);


GO
CREATE STATISTICS [_dta_stat_677577452_4_5]
    ON [dbo].[CabeceraMunicipio]([LONGITUD], [CodigoDane]);

