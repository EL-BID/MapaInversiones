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
            ***REMOVED***

                EventLog.WriteEntry(
                    "MapaInversiones",
                    string.Format("- Mensaje: {0***REMOVED*** \n - Fuente: {1***REMOVED*** \n - Metodo: {2***REMOVED*** \n - Detalle: {3***REMOVED*** - StackTrace: {4***REMOVED***", ex.Message, ex.Source, ex.TargetSite, ex.InnerException, ex.StackTrace));

        ***REMOVED***
            catch (Exception innerEx)
            {
#if DEBUG
                throw new Exception(string.Format("No fue posible almacenar información del error en el repositorio. Por favor valide el repositorio. Detalle: {0***REMOVED***.", innerEx.Message));
#else
 throw new Exception("No fue posible almacenar información del error en el repositorio. Por favor valide el repositorio.");
#endif

        ***REMOVED***

    ***REMOVED***
***REMOVED***
***REMOVED***