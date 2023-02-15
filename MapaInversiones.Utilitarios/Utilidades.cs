using PlataformaTransparencia.Utilitarios;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;

namespace PlataformaTransparencia.Utilitarios
{
    [ExcludeFromCodeCoverage]
    public class Utilidades
    {      

        public static string ListaToCsv(List<int> list)
        {
            StringBuilder strb1 = new StringBuilder();

            foreach(int item in list)
            {
                if(item == list.First())
                    strb1.Append(string.Format("{0***REMOVED***", item.ToString()));
                else
                    strb1.Append(string.Format(",{0***REMOVED***", item.ToString()));
        ***REMOVED***
            return strb1.ToString();
    ***REMOVED***

        public static string ObtenerMes(int idMes)
        {
            string mes = string.Empty;
            string[] meses = RecursosUtilidadesNegocio.Meses.Split(',');
            
            for (int i = 0; i < meses.Length; i++)
            {
                if (i == idMes-1)
                {
                    mes = meses[i];
                    break;
            ***REMOVED***          
        ***REMOVED***
            return mes;

    ***REMOVED***

        public static string[] ObtenerMeses()
        {
            return RecursosUtilidadesNegocio.Meses.Split(',');
    ***REMOVED***

        public static string ConcatenarPeriodos(List<int> periodos)
        {
            string respuesta = "";
            int largoArreglo = periodos.Count();
            for (int i = 0; i < largoArreglo; i++)
            {
                if (i == largoArreglo - 1)
                {
                    respuesta = respuesta + periodos[i];
            ***REMOVED***
                else
                {
                    respuesta = respuesta + periodos[i] + ",";
            ***REMOVED***
        ***REMOVED***

            return respuesta;
    ***REMOVED***

        public static string[]  RemoverPreposiciones(string[] texto)
        {
            string[] preposiciones = RecursosUtilidadesNegocio.Preposiciones.Split(',');
            IEnumerable<string> result = texto.Except(preposiciones);

            return result.ToArray();           

    ***REMOVED***


***REMOVED***
***REMOVED***
