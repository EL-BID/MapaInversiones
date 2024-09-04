using System.Collections.Generic;

namespace PlataformaTransparencia.Modelos.OrganismoFinanciador
{
    public class ModelDataOrganismoFinanciador : RespuestaContratoBase
    {
        public List<int> Anios { get; set; } = new();
    }
}
