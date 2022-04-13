CREATE TABLE [wcm].[OpenIdAuthorizationIndex] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]      INT            NULL,
    [AuthorizationId] NVARCHAR (48)  NULL,
    [ApplicationId]   NVARCHAR (48)  NULL,
    [Status]          NVARCHAR (255) NULL,
    [Subject]         NVARCHAR (255) NULL,
    [Type]            NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_OpenIdAuthorizationIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

