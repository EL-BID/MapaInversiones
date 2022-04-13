-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetPeriodosTable] 
	@periodosList varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	CREATE  TABLE #Periodos (
		Periodo INT
	);
	
	DECLARE @year varchar(10), @Pos int

	SET @periodosList = LTRIM(RTRIM(@periodosList))+ ','
	SET @Pos = CHARINDEX(',', @periodosList, 1)

	IF REPLACE(@periodosList, ',', '') <> ''
	BEGIN
		WHILE @Pos > 0
		BEGIN
			SET @year = LTRIM(RTRIM(LEFT(@periodosList, @Pos - 1)))
			IF @year <> ''
			BEGIN
				INSERT INTO #Periodos (periodo) VALUES (CAST(@year AS int)) --Use Appropriate conversion
			END
			SET @periodosList = RIGHT(@periodosList, LEN(@periodosList) - @Pos)
			SET @Pos = CHARINDEX(',', @periodosList, 1)
		END
	END
	
	SELECT * FROM #Periodos
END



