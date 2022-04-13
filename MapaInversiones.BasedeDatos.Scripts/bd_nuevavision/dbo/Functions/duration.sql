

CREATE FUNCTION [dbo].[duration] (@start DATETIME,@end DATETIME)
RETURNS decimal
AS BEGIN
	--DECLARE @start DATETIME
	--DECLARE @end DATETIME
	DECLARE @duration INT
	DECLARE @durationFinal varchar(10)
	--SELECT @start = '2009-10-06', @end = '2011-07-15'
	SELECT @duration = DATEDIFF(mm, @start, @end)
	SELECT  @durationFinal =CONVERT(NVARCHAR, @duration / 12) + '.' + CONVERT(NVARCHAR, @duration % 12)


    RETURN @durationFinal
END 
