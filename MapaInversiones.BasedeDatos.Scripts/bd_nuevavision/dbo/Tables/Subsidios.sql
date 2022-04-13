CREATE TABLE [dbo].[Subsidios] (
    [NumeroDocumento]        NVARCHAR (50)  NULL,
    [NombreBeneficiario]     NVARCHAR (255) NULL,
    [CodigoDepartamento]     NVARCHAR (10)  NULL,
    [NombreDepartamento]     NVARCHAR (255) NULL,
    [CodigoDistrito]         NVARCHAR (10)  NULL,
    [NombreDistrito]         NVARCHAR (255) NULL,
    [CaracteristicaSubsidio] NVARCHAR (255) NULL,
    [ValorSubsidio]          INT            NULL,
    [CantidadSubsidio]       INT            NULL,
    [IdPrograma]             INT            NULL,
    [IdNivel]                INT            NULL,
    [IdEntidad]              INT            NULL,
    [IdActividad]            INT            NULL,
    [FechaEntregaSubsidio]   DATETIME       NULL,
    [Beneficiario]           NVARCHAR (255) NULL,
    [TipoSubsidio]           NVARCHAR (255) NULL,
    [TipoKit]                NVARCHAR (255) NULL,
    [Observaciones]          NVARCHAR (255) NULL,
    [FechaModificacion]      DATETIME       NULL,
    [TipoSubsidioPrograma]   INT            NULL,
    [Claseprograma]          INT            NULL
);

