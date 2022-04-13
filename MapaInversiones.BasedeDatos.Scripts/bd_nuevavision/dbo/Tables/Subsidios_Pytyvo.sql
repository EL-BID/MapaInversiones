CREATE TABLE [dbo].[Subsidios_Pytyvo] (
    [CEDULA]                 FLOAT (53)     NULL,
    [NOMBRE Y APELLIDO]      NVARCHAR (255) NULL,
    [IdDepartamento]         VARCHAR (10)   NOT NULL,
    [IdMunicipio]            VARCHAR (10)   NOT NULL,
    [Valor]                  BIGINT         NULL,
    [cantidad]               BIGINT         NULL,
    [IdSubsidio]             VARCHAR (6)    NOT NULL,
    [IdPrograma]             VARCHAR (5)    NOT NULL,
    [IdTipoSubsidio]         INT            NOT NULL,
    [CaracteristicaSubsidio] VARCHAR (23)   NOT NULL
);

