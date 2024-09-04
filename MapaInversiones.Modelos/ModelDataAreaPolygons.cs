using System.Data.Entity.Spatial;

namespace PlataformaTransparencia.Modelos
{
    /// <summary>
    /// Resultado de los servicios para los po
    /// </summary>
    public class ModelDataAreaPolygons: RespuestaContratoBase
    {

        /// <summary>
        /// La fecha POSIX de última actualización
        /// POSIX: Es la fecha en formato Unix.
        /// </summary>
        public int lastUpdated { get; set; }
        /// <summary>
        /// Se define el tipo de los poligonos a retornar, region,departamento,municipio.
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// Se define el poligono del tipo.
        /// </summary>
        public DbGeography Polygon { get; set; }
    }
}