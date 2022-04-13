CREATE TABLE [stpPsgr].[ASIGNACION_AVANCE_FINANCIERO] (
    [idAsignacionFinanciera] INT             IDENTITY (1, 1) NOT NULL,
    [idFuenteFinanciamiento] INT             NULL,
    [idActividadObra]        INT             NULL,
    [idRegion]               INT             NULL,
    [idDepartamento]         INT             NULL,
    [idDistrito]             INT             NULL,
    [idObjetoGasto]          INT             NULL,
    [año]                    INT             NULL,
    [mes]                    INT             NULL,
    [valorPlanificado]       NUMERIC (15, 2) NULL,
    [valorEjecutado]         NUMERIC (15, 2) NULL,
    [version]                INT             NULL,
    [fechaCreacion]          DATETIME        NULL,
    [fechaActualizacion]     DATETIME        NULL,
    [usuarioResponasble]     VARCHAR (255)   NULL,
    CONSTRAINT [PK_ASIGNACION_AVANCE_FINANCIER] PRIMARY KEY CLUSTERED ([idAsignacionFinanciera] ASC),
    CONSTRAINT [FK_ASIGNACI_FK_ACTIVI_ACTIVIDA] FOREIGN KEY ([idActividadObra]) REFERENCES [stpPsgr].[ACTIVIDAD_OBRA] ([idActividadObra]),
    CONSTRAINT [FK_ASIGNACI_FK_FUENTE_FUENTE_F] FOREIGN KEY ([idFuenteFinanciamiento]) REFERENCES [stpPsgr].[FUENTE_FINANCIAMIENTO] ([idFuenteFinanciamiento]),
    CONSTRAINT [FK_ASIGNACI_FK_LOCALI_LOCALIZA] FOREIGN KEY ([idRegion], [idDepartamento], [idDistrito]) REFERENCES [stpPsgr].[LOCALIZACION] ([idRegion], [idDepartamento], [idDistrito]),
    CONSTRAINT [FK_OBJT_GASTO_ASIGNACION_FINAN] FOREIGN KEY ([idObjetoGasto]) REFERENCES [stpPsgr].[OBJETO_GASTO] ([idObjetoGasto])
);

