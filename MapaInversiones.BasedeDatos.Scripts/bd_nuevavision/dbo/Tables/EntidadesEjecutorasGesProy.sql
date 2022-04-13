CREATE TABLE [dbo].[EntidadesEjecutorasGesProy] (
    [NIT]                     VARCHAR (11)  NOT NULL,
    [DigitoVerificacion]      VARCHAR (1)   NOT NULL,
    [NombreEntidad]           VARCHAR (500) NOT NULL,
    [TipoEntidad]             VARCHAR (500) NOT NULL,
    [CodigoEntidad]           DECIMAL (18)  NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    CONSTRAINT [PK_EntidadesEjecutoras] PRIMARY KEY CLUSTERED ([NIT] ASC, [DigitoVerificacion] ASC) WITH (FILLFACTOR = 80)
);

