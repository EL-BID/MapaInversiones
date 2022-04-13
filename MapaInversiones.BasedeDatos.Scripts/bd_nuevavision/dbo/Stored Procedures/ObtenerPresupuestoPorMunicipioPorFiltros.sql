-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Mayo 28 de 2013>
-- Description:	<Procedimiento para Obtener el presupuesto Por Municipio Por Filtros]>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerPresupuestoPorMunicipioPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdTipoRecurso AS INT,
@periodosList varchar(300)	
AS
BEGIN


	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT  DATEPART( year, ppto.InicioVigencia ) AS PeriodoPresupuestado	
	, Municipio.IdMunicipio
	, Municipio.NombreMunicipio
    , SUM( CONVERT(decimal(30,0), ppto.ValorMonto) ) AS ValorPresupuesto
 FROM EnteTerritorial (nolock) Municipio 
	LEFT JOIN Presupuesto(NOLOCK) ppto ON ppto.IdMunicipio = Municipio.IdMunicipio 
 WHERE  (IdTipoDeFinanciacion = 1 OR IdTipoDeFinanciacion IS NULL) --Origen Regalias
   AND (Municipio.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
   AND (ppto.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
   AND (ppto.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
   --AND (ppto.IdTipoRecurso = @IdTipoRecurso OR @IdTipoRecurso = 0 OR @IdTipoRecurso IS NULL OR @IdTipoRecurso = -1)//Usado por Infobox geografia y no filtran por tiporecurso
   AND (CHARINDEX( CONVERT(varchar(4),DATEPART( year, ppto.InicioVigencia )) + ',' , @periodosList + ',') > 0
		OR 
		CHARINDEX( CONVERT(varchar(4),DATEPART( year, ppto.FinVigencia )) + ',' , @periodosList + ',') > 0
		)
   AND Municipio.IdMunicipio <> 0
   AND Tipo = 'MUNICIPIO'
	
	GROUP BY  DATEPART( year, ppto.InicioVigencia ) 	
	, Municipio.IdMunicipio
	, Municipio.NombreMunicipio
	
	--SELECT CAST((2012) AS INT) AS PeriodoPresupuestado	
	--, CAST('01' AS VARCHAR(10)) AS IdMunicipio
	--, CAST('Test' AS VARCHAR(200)) AS NombreMunicipio
 --   , CONVERT(decimal(30,2),100 ) AS ValorPresupuesto

END



