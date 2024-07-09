using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlataformaTransparencia.Modelos.Contratos
{
    public class Contratista
    {
        public string nombre { get; set; ***REMOVED***
        public string ruc { get; set; ***REMOVED***
        public string tipodocumento { get; set; ***REMOVED***
        public Nullable<decimal> ValorTotalContratos { get; set; ***REMOVED***
        public Nullable<int> NumContratos { get; set; ***REMOVED***
        public Nullable<int> NumProcesos { get; set; ***REMOVED***
        public string EsCovid { get; set; ***REMOVED***
        [Column(), NotNull] public string OrigenInformacion { get; set; ***REMOVED*** // varchar(9)
***REMOVED***
***REMOVED***
