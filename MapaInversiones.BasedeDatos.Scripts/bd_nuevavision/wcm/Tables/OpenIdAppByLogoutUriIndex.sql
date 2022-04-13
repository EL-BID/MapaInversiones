CREATE TABLE [wcm].[OpenIdAppByLogoutUriIndex] (
    [Id]                INT            IDENTITY (1, 1) NOT NULL,
    [LogoutRedirectUri] NVARCHAR (255) NULL,
    [Count]             INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

