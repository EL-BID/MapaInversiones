CREATE TABLE [stp].[Indicadores_Excel_v2] (
    [id]               BIGINT        NOT NULL,
    [indicador]        VARCHAR (255) NULL,
    [Unidad/Escala]    VARCHAR (255) NULL,
    [añoBaseIndicador] FLOAT (53)    NOT NULL,
    [valorInidicador]  FLOAT (53)    NOT NULL,
    [Meta 2023]        FLOAT (53)    NOT NULL,
    [Meta 2030]        FLOAT (53)    NOT NULL,
    [avance]           FLOAT (53)    NOT NULL
);

