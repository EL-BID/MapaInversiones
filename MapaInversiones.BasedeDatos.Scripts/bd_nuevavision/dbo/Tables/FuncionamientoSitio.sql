CREATE TABLE [dbo].[FuncionamientoSitio] (
    [IDFuncionamientoSitio] INT           IDENTITY (1, 1) NOT NULL,
    [Imagen]                VARCHAR (MAX) NOT NULL,
    [Titulo]                VARCHAR (MAX) NOT NULL,
    [Descripcion]           VARCHAR (MAX) NOT NULL,
    [Seccion]               VARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_FuncionamientoSitio] PRIMARY KEY CLUSTERED ([IDFuncionamientoSitio] ASC) WITH (FILLFACTOR = 80)
);

