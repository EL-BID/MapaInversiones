CREATE TABLE [dbo].[Estado] (
    [IdEstado]                INT          NOT NULL,
    [NombreEstado]            VARCHAR (30) NOT NULL,
    [FechaUltimaModificacion] DATETIME     NOT NULL,
    [ConsecutivoCarga]        INT          NOT NULL,
    [Modificadopor]           VARCHAR (30) NOT NULL,
    CONSTRAINT [Pk_Estado_IdEstado] PRIMARY KEY CLUSTERED ([IdEstado] ASC) WITH (FILLFACTOR = 80)
);

