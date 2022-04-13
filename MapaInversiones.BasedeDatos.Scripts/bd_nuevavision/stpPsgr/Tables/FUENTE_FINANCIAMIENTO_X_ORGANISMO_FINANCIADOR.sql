CREATE TABLE [stpPsgr].[FUENTE_FINANCIAMIENTO_X_ORGANISMO_FINANCIADOR] (
    [idFuenteFinanciamiento] INT NULL,
    [idOrganismoFinanciador] INT NULL,
    CONSTRAINT [FK_FUENTE_X_ORGANISMO] FOREIGN KEY ([idFuenteFinanciamiento]) REFERENCES [stpPsgr].[FUENTE_FINANCIAMIENTO] ([idFuenteFinanciamiento]),
    CONSTRAINT [FK_ORGANISMO_X_FUENTE] FOREIGN KEY ([idOrganismoFinanciador]) REFERENCES [stpPsgr].[ORGANISMO_FINANCIADOR] ([idOrganismoFinanciador])
);

