using System;
using System.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;

namespace PlataformaTransparencia.Utilitarios
{
    public static class ShortCacheHelper
    {
        private static IMemoryCache _cache;

        public static void Init(IMemoryCache memoryCache)
        {
            _cache = memoryCache;
        }
        /// <summary>
        /// Insert value into the cache using
        /// appropriate name/value pairs
        /// </summary>
        /// <typeparam name="T">Type of cached item</typeparam>
        /// <param name="o">Item to be cached</param>
        /// <param name="key">Name of item</param>
        [ExcludeFromCodeCoverage]
        public static void Add<T>(T o, string key)
        {
            Add(o, key, DuracionCache.Corto);
        }

        [ExcludeFromCodeCoverage]
        public static void Add<T>(T o, string key, DuracionCache duracion)
        {
            int duracionMinutos = (int)duracion;

            if (_cache == null) {
                return;
            }

            switch (duracion) {
                case DuracionCache.Medio: {
                        duracionMinutos = 30;
                        break;
                    }
                case DuracionCache.Largo: {
                        duracionMinutos = 60;
                        break;
                    }
                default: {
                        duracionMinutos = 15;
                        break;
                    }
            }
            _cache.Set(key,
                       o,
                       new TimeSpan(0, 0, duracionMinutos, 0, 5));

            if (duracionMinutos > 0)
                System.Diagnostics.Debug.WriteLine(string.Format("Ingresado {0} al cache {1}.", key, duracion.ToString()));
        }

        /// <summary>
        /// Check for item in cache
        /// </summary>
        /// <param name="key">Name of cached item</param>
        /// <returns></returns>
        [ExcludeFromCodeCoverage]
        internal static bool Exists(string key)
        {
            return _cache == null ? false : _cache.Get(key) != null;
        }

        /// <summary>
        /// Retrieve cached item
        /// </summary>
        /// <typeparam name="T">Type of cached item</typeparam>
        /// <param name="key">Name of cached item</param>
        /// <param name="value">Cached value. Default(T) if
        /// item doesn't exist.</param>
        /// <returns>Cached item as type</returns>
        [ExcludeFromCodeCoverage]
        public static bool Get<T>(string key, out T value)
        {
            try {
                if (!Exists(key)) {
                    value = default(T);
                    return false;
                }
                if (_cache != null) {
                    value = (T)_cache.Get(key);
                    if (key != "dicTitulos") {
                        System.Diagnostics.Debug.WriteLine(string.Format("Leido {0} del cache.", key));
                    }
                }
                else {
                    value = value = default(T);
                }
            }
            catch {
                value = default(T);
                return false;
            }

            return true;
        }

    }

    public enum DuracionCache
    {
        Corto = 10,
        Medio = 60,
        Largo = 60 * 3
    }



}
