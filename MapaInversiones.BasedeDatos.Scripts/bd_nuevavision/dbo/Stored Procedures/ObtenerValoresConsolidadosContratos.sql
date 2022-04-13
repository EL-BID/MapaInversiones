CREATE PROCEDURE [dbo].[ObtenerValoresConsolidadosContratos] 
AS
BEGIN
	SET NOCOUNT ON;

	SELECT 
		count(id_programa) as CantidadProgramas, 
		sum(valorContrato) as ValorContrato, 
		isnull(sum(valorfactura),0) as ValorEjecutado,
		0 as CantidadBeneficiario --este dato no esta temporal
	FROM
	VWCONTRATOSPERFILCONTRATISTAINFORMACIONCONTRATACION V
	LEFT JOIN (
				SELECT IDCONTRACTO, ISNULL(SUM(VALOR_FACTURA),0) VALORFACTURA 
				FROM [DBO].[VWCONTRATOSFACTURADOS]
				GROUP BY IDCONTRACTO
				) V1 ON V.CODIGOCONTRATO = V1.IDCONTRACTO
	WHERE COVID19 = 1 AND ID_PROGRAMA <> 9999 

END
