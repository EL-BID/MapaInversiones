CREATE TABLE [stp].[Indicadores_Excel_v3] (
    [idIndicador]        BIGINT        NOT NULL,
    [indicador]          VARCHAR (255) NULL,
    [Unidad/Escala]      VARCHAR (255) NULL,
    [añoBaseIndicador]   FLOAT (53)    NOT NULL,
    [valorBaseIndicador] FLOAT (53)    NOT NULL,
    [añoAvance]          FLOAT (53)    NOT NULL,
    [valorAvance]        FLOAT (53)    NOT NULL,
    [Meta 2030]          FLOAT (53)    NOT NULL
);

