CREATE TABLE [consulta].[SearchResultParam] (
    [Id]        INT           IDENTITY (1, 1) NOT NULL,
    [hierarchy] VARCHAR (100) NOT NULL,
    [type]      VARCHAR (50)  NOT NULL,
    [url]       VARCHAR (250) NOT NULL,
    [param]     VARCHAR (250) NULL,
    CONSTRAINT [PK__SearchRe__3214EC07F35F9920] PRIMARY KEY CLUSTERED ([Id] ASC)
);

