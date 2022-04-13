CREATE TABLE [wcm].[OpenIdAppByRedirectUriIndex_Document] (
    [OpenIdAppByRedirectUriIndexId] INT NOT NULL,
    [DocumentId]                    INT NOT NULL,
    CONSTRAINT [FK_OpenIdAppByRedirectUriIndex_Document_DocumentId] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id]),
    CONSTRAINT [FK_OpenIdAppByRedirectUriIndex_Document_Id] FOREIGN KEY ([OpenIdAppByRedirectUriIndexId]) REFERENCES [wcm].[OpenIdAppByRedirectUriIndex] ([Id])
);

