CREATE TABLE [dbo].[Departamento] (
    [IdDepartamento]          VARCHAR (20)  NOT NULL,
    [NombreDepartamento]      VARCHAR (100) NOT NULL,
    [FechaUltimaModificacion] DATETIME      NOT NULL,
    [ConsecutivoCarga]        INT           NOT NULL,
    [ModificadoPor]           VARCHAR (50)  NOT NULL
);

