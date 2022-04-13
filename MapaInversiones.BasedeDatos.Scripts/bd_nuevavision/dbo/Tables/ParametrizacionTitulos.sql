CREATE TABLE [dbo].[ParametrizacionTitulos] (
    [idParametrizacion] INT           IDENTITY (1, 1) NOT NULL,
    [Texto]             VARCHAR (MAX) NOT NULL,
    [Pagina]            VARCHAR (200) NOT NULL,
    [Seccion]           VARCHAR (200) NOT NULL,
    [Label]             VARCHAR (200) NOT NULL,
    [Llave]             VARCHAR (200) NOT NULL,
    CONSTRAINT [PK_ParametrizacionTitulos] PRIMARY KEY CLUSTERED ([idParametrizacion] ASC) WITH (FILLFACTOR = 80),
    CONSTRAINT [UC_Parametrizacion] UNIQUE NONCLUSTERED ([Llave] ASC) WITH (FILLFACTOR = 80)
);

