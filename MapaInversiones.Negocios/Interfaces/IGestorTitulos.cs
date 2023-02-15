using System.Collections.Generic;

namespace PlataformaTransparencia.Negocios.Interfaces
{
    public interface IGestorTitulos
    {
        Dictionary<string, string> Diccionario { get; set; }

        string BuscarTituloPorLlave(string llave);
    }
}