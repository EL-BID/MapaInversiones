CREATE TABLE [dbo].[Identifiers] (
    [dimension] NVARCHAR (255) NOT NULL,
    [nextval]   NUMERIC (20)   NULL,
    PRIMARY KEY CLUSTERED ([dimension] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_Dimension]
    ON [dbo].[Identifiers]([dimension] ASC);

