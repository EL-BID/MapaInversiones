CREATE TABLE [dbo].[RendimientosFinancieros] (
    [IdDepartamento]          VARCHAR (10) NOT NULL,
    [IdMunicipio]             VARCHAR (10) NOT NULL,
    [AñoVigencia]             INT          NOT NULL,
    [MesInicioVigencia]       INT          NOT NULL,
    [MesFinVigencia]          INT          NOT NULL,
    [Valor]                   FLOAT (53)   NOT NULL,
    [FechaUltimaModificacion] DATETIME     NOT NULL,
    [ConsecutivoCarga]        INT          NOT NULL,
    CONSTRAINT [PK_RendimientosFinancieros] PRIMARY KEY CLUSTERED ([IdDepartamento] ASC, [IdMunicipio] ASC, [AñoVigencia] ASC, [MesInicioVigencia] ASC, [MesFinVigencia] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [FK_RendimientosFinancieros_EnteTerritorial] FOREIGN KEY ([IdDepartamento], [IdMunicipio]) REFERENCES [dbo].[EnteTerritorial] ([IdDepartamento], [IdMunicipio])
);

