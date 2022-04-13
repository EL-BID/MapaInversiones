CREATE TABLE [consulta].[Presupuesto_x_Sector_STP] (
    [sector]           VARCHAR (100)   NULL,
    [codEntidad]       INT             NULL,
    [nombreEntidad]    VARCHAR (255)   NULL,
    [codPrograma]      INT             NULL,
    [nombrePrograma]   VARCHAR (255)   NULL,
    [año]              INT             NULL,
    [valorPlanificado] NUMERIC (38, 2) NULL,
    [valorEjecutado]   NUMERIC (38, 2) NULL
);

