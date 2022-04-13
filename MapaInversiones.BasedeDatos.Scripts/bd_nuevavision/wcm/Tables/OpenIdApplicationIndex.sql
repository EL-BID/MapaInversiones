CREATE TABLE [wcm].[OpenIdApplicationIndex] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]    INT            NULL,
    [ApplicationId] NVARCHAR (48)  NULL,
    [ClientId]      NVARCHAR (255) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_OpenIdApplicationIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id]),
    UNIQUE NONCLUSTERED ([ClientId] ASC)
);

