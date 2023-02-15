
namespace PlataformaTransparencia.Modelos.Comunes 
{
    public class ModeloRespuestaUbicacionGeografica : RespuestaContratoBase
    {
        public decimal latitud { get; set; }
        public decimal longitud { get; set; }
        public string nombreEntidad { get; set; }
    }
}
