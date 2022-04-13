-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[TOJSON] 
	-- Add the parameters for the stored procedure here
--	@SQLStatement AS varchar(max),
	@JsonOutput AS varchar(max) OUTPUT

	--Select distinct NombreDepartamento as Departamento from [dbo].[EnteTerritorial] for XML RAW
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;



Declare @XML   xml = (SELECT *, ROW_NUMBER() OVER(ORDER BY Categoria,ID ASC) AS RowNo FROM [PISGR_PY].[dbo].[Busqueda] for XML RAW)
Declare @JSON  varchar(max) = ''
 ;with cteEAV as (       
	Select RowNr     = Row_Number() over (Order By (Select NULL))
			  ,RowN=  xRow.value('@RowNo','varchar(100)')
	        ,Entity    = xRow.value('@*[1]','varchar(100)')
            ,Attribute = xAtt.value('local-name(.)','varchar(100)')
            ,Value     = xAtt.value('.','varchar(max)') 
			
		--	,rowSeparetor=Row_Number() over ()
	    From  @XML.nodes('/row') As A(xRow)
       Cross Apply A.xRow.nodes('./@*') As B(xAtt) )
     ,cteBld as (
      Select *
	  
            ,NewRow = IIF(Lag(Entity,1)  over (Partition By RowN Order By (Select NULL))=Entity,'',',{')
            ,EndRow = (CASE WHEN Attribute='Nombre' THEN IIF(Lead(Entity,1) over (Partition By RowN Order By (Select NULL))=Entity,'','***REMOVED***') 
			ELSE IIF(Lead(Entity,1) over (Partition By RowN Order By (Select NULL))=Entity,',','***REMOVED***')
			 END)
		 -- , cteEAV.Entity
		     ,JSON=(CASE WHEN Attribute='RowNo' THEN ''
			 ELSE Concat('"',Attribute,'":','"',Value,'"')
			 END)
       From  cteEAV  )
Select @JSON = @JSON+NewRow+JSON+EndRow
 From  cteBld 
-- Select '['+Stuff(@JSON,1,1,'')+']';
Select @JsonOutput='['+Stuff(@JSON,1,1,'')+']';

Select @JsonOutput
return 

END
