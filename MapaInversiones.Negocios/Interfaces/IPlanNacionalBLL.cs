using System;
using System.Collections.Generic;
using System.Text;
using PlataformaTransparencia.Modelos.Plan;

namespace PlataformaTransparencia.Negocios.Interfaces
{
  public interface IPlanNacionalBLL
  {
    List<ObjetivosGeneralPorEjeEstrategico> ObtenerObjetivosPorEjeEstrategico(int idEjeEstrategico);
    List<InfoEntidad> ObtenerEntidadesPlanNacionalNoAlcaldias();
  }
}
