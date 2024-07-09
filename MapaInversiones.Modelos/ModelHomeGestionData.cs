using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos
{
  public class ModelHomeGestionData : RespuestaContratoBase
  {
     public ModelContratistaData resumenDatosContratos { get; set; }
     public List<InfoRecursosEmergenciaPerObjeto> InfoRecursosContratos { get; set; }
     public List<InfoRecursosEmergenciaPerObjeto> InfoRecursosProcesos { get; set; }
     public int TipoEmergencia { get; set; }
  }
}
