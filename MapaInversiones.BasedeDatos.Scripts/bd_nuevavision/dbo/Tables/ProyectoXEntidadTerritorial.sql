CREATE TABLE [dbo].[ProyectoXEntidadTerritorial] (
    [IdProyecto]              INT          NOT NULL,
    [IdDepartamento]          VARCHAR (10) NOT NULL,
    [IdMunicipio]             VARCHAR (10) NOT NULL,
    [FechaUltimaModificacion] DATETIME     NOT NULL,
    [ConsecutivoCarga]        INT          NOT NULL,
    [Modificadopor]           VARCHAR (30) NOT NULL,
    CONSTRAINT [Pk_ProyectoXEntidadTerritorial_IdProy_IdEntTerr] PRIMARY KEY CLUSTERED ([IdProyecto] ASC, [IdDepartamento] ASC, [IdMunicipio] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON),
    CONSTRAINT [Fk_ProyectoXEnteTerritoria] FOREIGN KEY ([IdProyecto]) REFERENCES [dbo].[Proyecto] ([IdProyecto]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [Fk_ProyectoXEnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio]) ON DELETE CASCADE ON UPDATE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [_dta_index_ProyectoXEntidadTerritorial_19_203147769__K1_K3]
    ON [dbo].[ProyectoXEntidadTerritorial]([IdProyecto] ASC, [IdDepartamento] ASC) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE NONCLUSTERED INDEX [IdDepartamento_IdMunicipio_IncludeIdProyecto]
    ON [dbo].[ProyectoXEntidadTerritorial]([IdDepartamento] ASC, [IdMunicipio] ASC)
    INCLUDE([IdProyecto]) WITH (FILLFACTOR = 80, STATISTICS_NORECOMPUTE = ON);


GO
CREATE STATISTICS [_dta_stat_203147769_4_1]
    ON [dbo].[ProyectoXEntidadTerritorial]([IdMunicipio], [IdProyecto]);

