CREATE TABLE [stpPsgr].[FUENTE_ORIGEN] (
    [idFuenteOrigen] INT           IDENTITY (1, 1) NOT NULL,
    [nombre]         VARCHAR (255) NULL,
    [descripcion]    VARCHAR (255) NULL,
    [año]            INT           NULL,
    CONSTRAINT [PK_FUENTE_ORIGEN] PRIMARY KEY CLUSTERED ([idFuenteOrigen] ASC)
);

