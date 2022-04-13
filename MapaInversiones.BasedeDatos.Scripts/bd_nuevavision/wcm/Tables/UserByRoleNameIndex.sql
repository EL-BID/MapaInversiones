CREATE TABLE [wcm].[UserByRoleNameIndex] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [RoleName] NVARCHAR (255) NULL,
    [Count]    INT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

