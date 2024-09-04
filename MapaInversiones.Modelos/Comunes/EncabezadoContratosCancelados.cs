using System;
using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class EncabezadoContratosCancelados
    {
        public string Estado { get; set; }
        public Nullable<long> valor { get; set; }
        public Nullable<int> NroContratos { get; set; }
    }
}