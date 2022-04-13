CREATE TABLE [dbo].[Georreferenciacion] (
    [IdGeorreferencia]        INT               IDENTITY (1, 1) NOT NULL,
    [NombreReferencia]        VARCHAR (50)      NOT NULL,
    [GeoPuntoUbicacion]       [sys].[geography] NOT NULL,
    [FechaUltimaModificacion] DATETIME          NOT NULL,
    [ConsecutivoCarga]        INT               NOT NULL,
    [Modificadopor]           VARCHAR (30)      NOT NULL,
    [idProyecto]              INT               NOT NULL,
    CONSTRAINT [Pk_Georreferenciacion_IdGeorreferencia] PRIMARY KEY CLUSTERED ([IdGeorreferencia] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_GeorreferenciacionXProyecto] FOREIGN KEY ([idProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Georreferenciacion_7_1803153469__K2_K1_K7_3]
    ON [dbo].[Georreferenciacion]([NombreReferencia] ASC, [IdGeorreferencia] ASC, [idProyecto] ASC)
    INCLUDE([GeoPuntoUbicacion]) WITH (FILLFACTOR = 80);


GO
CREATE NONCLUSTERED INDEX [_dta_index_Georreferenciacion_7_1803153469__K7_K1_K2_3]
    ON [dbo].[Georreferenciacion]([idProyecto] ASC, [IdGeorreferencia] ASC, [NombreReferencia] ASC)
    INCLUDE([GeoPuntoUbicacion]) WITH (FILLFACTOR = 80);


GO
CREATE SPATIAL INDEX [SpatialIndex-20130425-132057]
    ON [dbo].[Georreferenciacion] ([GeoPuntoUbicacion])
    WITH  (
            CELLS_PER_OBJECT = 16,
            FILLFACTOR = 80
          );


GO
CREATE STATISTICS [_dta_stat_1803153469_2_7]
    ON [dbo].[Georreferenciacion]([NombreReferencia], [idProyecto]);

