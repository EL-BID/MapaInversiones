
/*
 Procedimiento almacenado que me valida que se cargan las imagenes de un 
 proyecto.
*/
CREATE procedure [dbo].[spt_ProjectProfileContractUnitTestCargarDatosGetListImagesbyId]
(
  @IdProyecto int
)
AS
 SELECT Foto.IdProyecto,Foto.IdProyecto,Foto.RutaFotoGrande,Foto.RutaFotoMediano,Foto.RutaFotoPequeno
 FROM Proyecto INNER JOIN
	HistoriaEstado ON Proyecto.IdProyecto = HistoriaEstado.IdProyecto 
	INNER JOIN
	Estado ON HistoriaEstado.IdEstado = Estado.IdEstado 
	INNER JOIN
	Sector ON Proyecto.IdSector = Sector.IdSector 
	INNER JOIN
	ProyectoXEntidadTerritorial ON Proyecto.IdProyecto = ProyectoXEntidadTerritorial.IdProyecto 
	INNER JOIN
	EnteTerritorial ON ProyectoXEntidadTerritorial.IdDepartamento = EnteTerritorial.IdDepartamento 
	AND 
	ProyectoXEntidadTerritorial.IdMunicipio = EnteTerritorial.IdMunicipio
	INNER JOIN 
    Foto  ON Proyecto.IdProyecto=Foto.IdProyecto
	WHERE Proyecto.IdProyecto=@IdProyecto
 --exec spt_ProjectProfileContractUnitTestCargarDatosGetListImagesbyId 1







