-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[TOJSONPROYECTO] 
	-- Add the parameters for the stored procedure here
--	@SQLStatement AS varchar(max),
	@JsonOutput AS varchar(max) OUTPUT

	--Select distinct NombreDepartamento as Departamento from [dbo].[EnteTerritorial] for XML RAW
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	

Declare @XML   xml = (Select distinct NombreProyecto as Proyecto from [dbo].[VwProyectosAprobadosInv] for XML RAW)
Declare @JSON  varchar(max) = ''

;with cteEAV as (
      Select RowNr     = Row_Number() over (Order By (Select NULL))
            ,Entity    = xRow.value('@*[1]','varchar(100)')
            ,Attribute = xAtt.value('local-name(.)','varchar(100)')
            ,Value     = xAtt.value('.','varchar(max)') 
       From  @XML.nodes('/row') As A(xRow)
       Cross Apply A.xRow.nodes('./@*') As B(xAtt) )
     ,cteBld as (
      Select *
            ,NewRow = IIF(Lag(Entity,1)  over (Partition By Entity Order By (Select NULL))=Entity,'',',{')
            ,EndRow = IIF(Lead(Entity,1) over (Partition By Entity Order By (Select NULL))=Entity,',','***REMOVED***')
            ,JSON   = Concat('"',Attribute,'":','"',Value,'"')
       From  cteEAV )
Select @JSON = @JSON+NewRow+JSON+EndRow
 From  cteBld 

Select @JsonOutput='['+Stuff(@JSON,1,1,'')+']';

Select @JsonOutput
return 

END
