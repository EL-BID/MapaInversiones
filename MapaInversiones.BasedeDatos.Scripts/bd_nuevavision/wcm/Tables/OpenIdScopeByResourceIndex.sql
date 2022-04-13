CREATE TABLE [wcm].[OpenIdScopeByResourceIndex] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [Resource] NVARCHAR (255) NULL,
    [Count]    INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

