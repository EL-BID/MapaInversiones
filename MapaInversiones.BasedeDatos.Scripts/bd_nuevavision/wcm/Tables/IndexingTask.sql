CREATE TABLE [wcm].[IndexingTask] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [ContentItemId] NVARCHAR (26) NULL,
    [CreatedUtc]    DATETIME      NOT NULL,
    [Type]          INT           NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

