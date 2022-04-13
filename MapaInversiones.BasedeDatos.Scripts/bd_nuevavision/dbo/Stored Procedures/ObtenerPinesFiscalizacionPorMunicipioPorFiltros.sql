-- =============================================
-- Author:		<Carlos Mahecha>
-- Create date: <Julio 02 de 2013>
-- Description:	<Procedimiento para Obtener el listado de Tipos de Recurso>
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerPinesFiscalizacionPorMunicipioPorFiltros]
@IdRegion AS VARCHAR(10),
@IdDpto AS VARCHAR(10),
@IdMunicipio AS VARCHAR(10),
@IdRecurso AS VARCHAR(10),
@IdCampoOMina AS NVARCHAR(50),
@periodosList varchar(300),
@CuadradoVisualIntersectar geography,
@IdTipoFiscalizacion AS INT
AS
BEGIN	

DECLARE @NombreCampoMina AS VARCHAR(250)

IF @IdCampoOMina <> ''
	BEGIN
	SELECT @NombreCampoMina = NombreCampoOProyecto FROM  CampoOProyecto(nolock) WHERE IdCampoOProyecto = @IdCampoOMina
	END

select  ente.IdMunicipio AS IdEntidad,
CASE WHEN @IdCampoOMina <> '' THEN @NombreCampoMina + ' (' + ente.NombreMunicipio + ')'
	ELSE ente.NombreMunicipio
END AS  NombreEntidad,
cab.Latitud  AS Latitud,
cab.LONGITUD AS Longitud,
'/Fiscalizacion/FichaFiscalizacion/?periodosFiscalizacion='+ @periodosList + '&municipio=' + ente.IdMunicipio AS Url
	, prod.AñoLiquidado AS AñoFiscalizacion 
	, COUNT(DISTINCT prod.IdFiscalizacionSurrogada) AS Fiscalizaciones

FROM Fiscalizacion(nolock) prod
INNER JOIN EnteTerritorial(nolock) ente ON prod.IdMunicipio = ente.IdMunicipio
INNER JOIN RecursoNaturalFiscalizacion(nolock) recurso ON prod.IdRecursoNatural = recurso.IdRecursoNatural AND prod.IdTipoRecursoNatural = recurso.IdTipoRecursoNatural
INNER JOIN CabeceraMunicipio (nolock) cab ON prod.IdMunicipio = cab.CodigoDane
	WHERE (ente.IdRegion = @IdRegion OR @IdRegion =  '' OR @IdRegion IS NULL)
			AND (ente.IdDepartamento = @IdDpto OR @IdDpto = '' OR @IdDpto IS NULL )
			AND (ente.IdMunicipio = @IdMunicipio OR @IdMunicipio = ''  OR @IdMunicipio IS NULL)
			AND (prod.IdRecursoNatural = @IdRecurso OR @IdRecurso = '' OR @IdRecurso IS NULL OR @IdRecurso = '-1')
			AND (prod.IdCampoOProyecto = @IdCampoOMina OR @IdCampoOMina = '' OR @IdCampoOMina IS NULL )
			AND CHARINDEX( CONVERT(varchar(4), prod.AñoLiquidado) + ',' ,  @periodosList + ','	) > 0
			--AND (@CuadradoVisualIntersectar.STIntersects(PuntoUbicacion)=1 OR @CuadradoVisualIntersectar IS NULL)	
			AND ( (IdTipoActividad IS NULL AND @IdTipoFiscalizacion = 0) OR (IdTipoActividad IS NOT NULL AND @IdTipoFiscalizacion = 1) OR (@IdTipoFiscalizacion IS NULL)  OR (@IdTipoFiscalizacion = -1))
			--AND prod.IdTipoActividad IS NOT NULL
			--AND  ente.IdDepartamento <> '0'	
			--AND ente.NombreDepartamento <> 'N/A'		
			
GROUP BY 
ente.IdMunicipio ,
ente.NombreMunicipio ,
cab.Latitud ,
cab.LONGITUD
, AñoLiquidado



END


