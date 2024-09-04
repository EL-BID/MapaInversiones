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
                    strb1.Append(string.Format("{0}", item.ToString()));
                else
                    strb1.Append(string.Format(",{0}", item.ToString()));
            }
            return strb1.ToString();
        }

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
                }          
            }
            return mes;

        }

        public static string[] ObtenerMeses()
        {
            return RecursosUtilidadesNegocio.Meses.Split(',');
        }

        public static string ConcatenarPeriodos(List<int> periodos)
        {
            string respuesta = "";
            int largoArreglo = periodos.Count();
            for (int i = 0; i < largoArreglo; i++)
            {
                if (i == largoArreglo - 1)
                {
                    respuesta = respuesta + periodos[i];
                }
                else
                {
                    respuesta = respuesta + periodos[i] + ",";
                }
            }

            return respuesta;
        }

        public static string[]  RemoverPreposiciones(string[] texto)
        {
            string[] preposiciones = RecursosUtilidadesNegocio.Preposiciones.Split(',');
            IEnumerable<string> result = texto.Except(preposiciones);

            return result.ToArray();           

        }


    }
}
