CREATE TABLE [wcm].[UserIndex] (
    [Id]                 INT            IDENTITY (1, 1) NOT NULL,
    [DocumentId]         INT            NULL,
    [NormalizedUserName] NVARCHAR (255) NULL,
    [NormalizedEmail]    NVARCHAR (255) NULL,
    [IsEnabled]          BIT            DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserIndex] FOREIGN KEY ([DocumentId]) REFERENCES [wcm].[Document] ([Id])
);

