using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Negocios.Interfaces;
using PlataformaTransparencia.Utilitarios;
using System.Collections.Generic;
using System.Linq;

namespace PlataformaTransparencia.Negocios.Comunes
{
    public class GestorTitulos : IGestorTitulos
    {
        private readonly TransparenciaDB _connection;
        public GestorTitulos(TransparenciaDB connection)
        {
            _connection = connection;
        }

        private Dictionary<string, string> diccionario = new Dictionary<string, string>();
        public Dictionary<string, string> Diccionario {
            get {
                string key = "dicTitulos";
                if (!ShortCacheHelper.Get(key, out diccionario)) {
                    diccionario = _connection.ParametrizacionTitulos.OrderBy(p => p.Llave).ToDictionary(mc => mc.Llave.ToUpper(), mc => mc.Texto);
                    ShortCacheHelper.Add(diccionario, key, DuracionCache.Largo);
                }

                return diccionario;
            }
            set { diccionario = value; }
        }

        /// <summary>
        /// Busca una llave en la base de datos y obtiene el valor del título correspondiente por medio de una función que obtiene todos los títulos.
        /// </summary>
        /// <param name="llave">Llave a buscar en la base de datos</param>
        /// <returns> El título correspondiente a la llave</returns>
        public string BuscarTituloPorLlave(string llave)
        {
            llave = llave.ToUpper();
            string valor = string.Empty;
            Diccionario.TryGetValue(llave, out valor);
            if (string.IsNullOrEmpty(valor))
                valor = string.Format("--[{0}]", llave);
            return valor;
        }
    }
}