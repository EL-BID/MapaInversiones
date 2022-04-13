CREATE TABLE [wcm].[Document] (
    [Id]      INT            NOT NULL,
    [Type]    NVARCHAR (255) NOT NULL,
    [Content] NVARCHAR (MAX) NULL,
    [Version] BIGINT         DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

