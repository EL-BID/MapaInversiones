CREATE TABLE [dbo].[tmp_cahCreditosOtorgadosPresupuestoPropioInstitucional] (
    [gerencia]        NVARCHAR (50) NOT NULL,
    [sucursal]        NVARCHAR (50) NOT NULL,
    [sector]          NVARCHAR (50) NOT NULL,
    [nuevo]           TINYINT       NULL,
    [viejo]           TINYINT       NULL,
    [importe]         INT           NULL,
    [fuente]          NVARCHAR (50) NULL,
    [fondoTipo]       NVARCHAR (50) NULL,
    [codigoIndicador] INT           NULL
);

