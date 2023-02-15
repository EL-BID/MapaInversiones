using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using LinqToDB;

namespace PlataformaTransparencia.Negocios.Comunes
{
    public class Admin
    {
        private readonly TransparenciaDB _connection;
        public Admin(TransparenciaDB connection)
        {
            _connection = connection;
        }
        public string ActualizaFoto(int idFotoUsuario, string Aprobadopor, bool Aprobado, bool Eliminado, string textoJustifica)
        {
            int idRegNew = 0;
            string outTxt = "";
            try
            {
                idRegNew = _connection
                .GetTable<FotoUsuario>()
                .Where(t => t.IdFotoUsuario == idFotoUsuario)
                .Update(t => new FotoUsuario
                {
                    Aprobadopor = Aprobadopor,
                    Aprobado = Aprobado,
                    Eliminado = Eliminado,
                    JustificacionParaNoPublicar = textoJustifica
                });
                if (idRegNew > 0)
                {
                    outTxt = "0<||>";
                }

            }
            catch (Exception exe)
            {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1)
                {
                    outTxt = "-1<||>" + "Ya se registró la opinión para esta foto";
                }

            }
            return outTxt;
        }
        public string ActualizaComent(int IdComentario, int IdEstado, string textoJustifica)
        {
            int idRegNew = 0;
            string outTxt = "";
            try
            {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {

                //pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
                //pisgrEntities.Configuration.LazyLoadingEnabled = false;
                idRegNew = _connection
                .GetTable<Comentarios>()
                .Where(t => t.IdComentario == IdComentario)
                .Update(t => new Comentarios
                {
                    IdEstado = IdEstado,
                    fechaPublicacion = DateTime.Now,
                    JustificacionParaNoPublicar = textoJustifica,
                });

                //}
                if (idRegNew > 0)
                {
                    outTxt = "0<||>";
                }

            }
            catch (Exception exe)
            {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1)
                {
                    outTxt = "-1<||>" + "Ya se genero comentario";
                }

            }
            return outTxt;
        }



        public string ActualizaTipoComent(int IdComentario, int IdTipoComentario)
        {
            int idRegNew = 0;
            string outTxt = "";
            try
            {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {

                //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
                //    pisgrEntities.Configuration.LazyLoadingEnabled = false;

                idRegNew = _connection
                .GetTable<Comentarios>()
                .Where(t => t.IdComentario == IdComentario)
                .Update(t => new Comentarios
                {
                    IdTipoComentario = IdTipoComentario,
                });
                //}
                if (idRegNew > 0)
                {
                    outTxt = "0<||>";
                }

            }
            catch (Exception exe)
            {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1)
                {
                    outTxt = "-1<||>" + "Update error";
                }

            }
            return outTxt;
        }
    }
}
