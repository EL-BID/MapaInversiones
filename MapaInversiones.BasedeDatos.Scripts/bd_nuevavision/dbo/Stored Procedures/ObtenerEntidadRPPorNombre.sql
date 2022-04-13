CREATE PROCEDURE [dbo].[ObtenerEntidadRPPorNombre]
@NOMBREENTIDAD VARCHAR(100)
AS
BEGIN
	SELECT distinct cpcp.UnidadCompra AS ENTIDAD
	FROM vwContratosPerfilContratistaInformacionContratacion w
					inner join vwContratosPerfilContratosProceso cpcp
					on w.IdProceso=cpcp.IdProceso and w.codigocontrato=cpcp.codigocontrato 
	WHERE CPCP.UnidadCompra LIKE '%' + @NOMBREENTIDAD + '%' AND COVID19 = 2
	ORDER BY 1
END

