using PlataformaTransparencia.Modelos;
using PlataformaTransparencia.Modelos.Emprestitos;
using PlataformaTransparencia.Negocios.Emprestitos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Negocios.Interfaces
{
  public interface IEmprestitosBLL
  {

    public ModelEmprestitoData GetEmprestitoData();
    public List<itemProyecto> GetProyectosPerCredito(string CodEntidad);
    EntidadFinanciadora Fill(int id);
  }
}
