
CREATE procedure [dbo].[spt_ProjectProfileContractUnitTestCargarDatosGetOtherProjectsbyId]
(
    @IdProyecto int
)
as 
DECLARE @IdOcad int
SET @IdOcad = (select IdOCAD FROM Proyecto WHERE IdProyecto = @IdProyecto)

SELECT TOP 4 * FROM Proyecto p
	JOIN HistoriaEstado h on p.IdProyecto = h.IdProyecto
	JOIN Estado e on h.IdEstado = e.IdEstado
WHERE p.IdProyecto <> @IdProyecto AND p.IdOCAD = @IdOcad AND h.ActualSiNo = 1



