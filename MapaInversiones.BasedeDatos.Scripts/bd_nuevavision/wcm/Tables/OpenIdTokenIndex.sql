CREATE TABLE [wcm].[OpenIdTokenIndex] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]      INT            NULL,
    [TokenId]         NVARCHAR (48)  NULL,
    [ApplicationId]   NVARCHAR (48)  NULL,
    [AuthorizationId] NVARCHAR (48)  NULL,
    [ExpirationDate]  DATETIME       NULL,
    [ReferenceId]     NVARCHAR (255) NULL,
    [Status]          NVARCHAR (255) NULL,
    [Subject]         NVARCHAR (255) NULL,
    [Type]            NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_OpenIdTokenIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

