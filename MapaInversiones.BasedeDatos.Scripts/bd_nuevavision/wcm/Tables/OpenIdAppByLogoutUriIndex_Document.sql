CREATE TABLE [wcm].[OpenIdAppByLogoutUriIndex_Document] (
    [OpenIdAppByLogoutUriIndexId] INT NOT NULL,
    [DocumentId]                  INT NOT NULL,
    CONSTRAINT [FK_OpenIdAppByLogoutUriIndex_Document_DocumentId] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id]),
    CONSTRAINT [FK_OpenIdAppByLogoutUriIndex_Document_Id] FOREIGN KEY ([OpenIdAppByLogoutUriIndexId]) REFERENCES [wcm].[OpenIdAppByLogoutUriIndex] ([Id])
);

