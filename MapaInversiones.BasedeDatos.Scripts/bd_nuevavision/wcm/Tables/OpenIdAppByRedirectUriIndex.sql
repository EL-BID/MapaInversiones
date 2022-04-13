CREATE TABLE [wcm].[OpenIdAppByRedirectUriIndex] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [RedirectUri] NVARCHAR (255) NULL,
    [Count]       INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

