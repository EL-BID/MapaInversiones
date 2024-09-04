using PlataformaTransparencia.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Negocios.Comunes
{
    public interface IDatosAbiertosBLL
    {
        public List<infoFuentesRecursos> ObtenerFuentesDatosAbiertos();
    }
}
