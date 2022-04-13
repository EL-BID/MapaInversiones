CREATE TABLE [stp].[Vinculacion_IndicadoresPND_x_Entidades_STP] (
    [codEjeEstrategico]              INT            NULL,
    [nombreEjeEstrategico]           VARCHAR (255)  NULL,
    [descripcionEjeEstrategico]      VARCHAR (1000) NULL,
    [codObjetivoEstrategico]         INT            NULL,
    [nombreObjetivoEstrategico]      VARCHAR (255)  NULL,
    [descripcionObjetivoEstrategico] VARCHAR (1000) NULL,
    [codObjetivoEspecifico]          INT            NULL,
    [nombreObjetivoEspecifico]       VARCHAR (255)  NULL,
    [idIndicador]                    BIGINT         NOT NULL,
    [indicador]                      VARCHAR (255)  NULL,
    [Unidad/Escala]                  VARCHAR (255)  NULL,
    [añoBaseIndicador]               FLOAT (53)     NULL,
    [valorInidicador]                FLOAT (53)     NULL,
    [Meta 2023]                      FLOAT (53)     NULL,
    [Meta 2030]                      FLOAT (53)     NULL,
    [avance]                         FLOAT (53)     NULL,
    [codNivelEntidad]                VARCHAR (255)  NULL,
    [nombreEntidad]                  VARCHAR (255)  NULL,
    [fuente]                         VARCHAR (255)  NULL
);

