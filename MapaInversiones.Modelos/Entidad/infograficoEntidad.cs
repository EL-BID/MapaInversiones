using System;
using System.Collections.Generic;
using System.Text;

namespace PlataformaTransparencia.Modelos.Entidad
{
    public class infograficoEntidad
    {
        public infograficoPrograma programa { get; set; }
        
        public List<infograficoGrupoGasto> infoGasto { get; set; }

        public infograficoEntidad() {

            programa = new infograficoPrograma();
            infoGasto = new List<infograficoGrupoGasto>();
        }

    }
}
