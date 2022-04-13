CREATE TABLE [consulta].[Objetivos_PND_STP] (
    [codPlan]                        INT            NOT NULL,
    [nombrePlan]                     VARCHAR (7)    NOT NULL,
    [codEjeEstrategico]              INT            NULL,
    [nombreEjeEstrategico]           VARCHAR (256)  NOT NULL,
    [descripcionEjeEstrategico]      VARCHAR (1000) NULL,
    [codObjetivoEstrategico]         INT            NULL,
    [nombreObjetivoEstrategico]      VARCHAR (256)  NOT NULL,
    [descripcionObjetivoEstrategico] VARCHAR (1000) NULL,
    [codObjetivoEspecifico]          INT            NULL,
    [nombreObjetivoEspecifico]       VARCHAR (256)  NOT NULL
);

