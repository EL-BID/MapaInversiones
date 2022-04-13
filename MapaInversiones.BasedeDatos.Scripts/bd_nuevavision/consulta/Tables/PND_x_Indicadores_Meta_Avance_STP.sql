CREATE TABLE [consulta].[PND_x_Indicadores_Meta_Avance_STP] (
    [idEje]                     INT            NOT NULL,
    [codEje]                    INT            NULL,
    [nombreEje]                 VARCHAR (255)  NULL,
    [idObjetivoEstrategico]     INT            NOT NULL,
    [codObjetivoEstrategico]    INT            NULL,
    [nombreObjetivoEstrategico] VARCHAR (255)  NULL,
    [idObjetivoEspecifico]      INT            NOT NULL,
    [codObjetivoEspecifico]     INT            NULL,
    [nombreObjetivoEspecifico]  VARCHAR (255)  NULL,
    [idIndicador]               INT            NOT NULL,
    [codIndicador]              INT            NULL,
    [nombre]                    VARCHAR (255)  NULL,
    [metodoDeCalculo]           VARCHAR (255)  NULL,
    [meta]                      NVARCHAR (MAX) NULL,
    [vencimientoMeta]           NVARCHAR (MAX) NULL,
    [avance]                    NVARCHAR (MAX) NULL,
    [vencimientoAvance]         NVARCHAR (MAX) NULL
);

