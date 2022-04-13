CREATE TABLE [wcm].[UserByClaimIndex] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId] INT            NULL,
    [ClaimType]  NVARCHAR (255) NULL,
    [ClaimValue] NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserByClaimIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

