CREATE TABLE [wcm].[OpenIdScopeIndex] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId] INT            NULL,
    [Name]       NVARCHAR (255) NULL,
    [ScopeId]    NVARCHAR (48)  NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_OpenIdScopeIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id]),
    UNIQUE NONCLUSTERED ([Name] ASC)
);

