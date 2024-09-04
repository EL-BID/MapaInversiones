using System;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;

namespace PlataformaTransparencia.Negocios.BLL.Comunes
{
    public class LogHelper
    {
        [ExcludeFromCodeCoverage]
        static internal void GenerateLog(Exception ex)
        {
            try
            {
                if (!EventLog.SourceExists("MapaInversiones"))
                {
                    EventLog.CreateEventSource("MapaInversiones", "LogMapaInversiones");
                }

                EventLog.WriteEntry(
                    "MapaInversiones",
                    string.Format("- Mensaje: {0} \n - Fuente: {1} \n - Metodo: {2} \n - Detalle: {3} - StackTrace: {4}", ex.Message, ex.Source, ex.TargetSite, ex.InnerException, ex.StackTrace));

            }
            catch (Exception innerEx)
            {
#if DEBUG
                throw new Exception(string.Format("No fue posible almacenar información del error en el repositorio. Por favor valide el repositorio. Detalle: {0}.", innerEx.Message));
#else
 throw new Exception("No fue posible almacenar información del error en el repositorio. Por favor valide el repositorio.");
#endif

            }

        }
    }
}