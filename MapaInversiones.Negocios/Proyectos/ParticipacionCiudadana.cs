using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PlataformaTransparencia.Infrastructura.DataModels;
using PlataformaTransparencia.Modelos;
using LinqToDB;

namespace PlataformaTransparencia.Negocios.Project
{
    public class ParticipacionCiudadana
    {
        private readonly TransparenciaDB _connection;

        public ParticipacionCiudadana(TransparenciaDB connection)
        {
            _connection = connection;
        }

        public List<itemcomentario> ObtenerComentariosProyAsync(int Id)
        {
            List<itemcomentario> objReturn = new List<itemcomentario>();
            var comentarios = new List<object>();

                var infoProyecto = (from Comentario in _connection.Comentarios
                                          join usuarios in _connection.Usuarios
                                          on Comentario.IdUsuario equals usuarios.IdUsuario
                                          where Comentario.IdProyecto == Id
                                          && (Comentario.IdEstado == 3 || Comentario.IdEstado == 5 || Comentario.IdEstado == 6)
                                          orderby Comentario.ComentarioRelacionado ascending
                                          select new itemcomentario {
                                              IdUsuario = usuarios.IdUsuario,
                                              nom_usuario = usuarios.Nombre,
                                              fechaCreacion = (DateTime)Comentario.FechaCreacion,
                                              ComentarioOriginal = Comentario.ComentarioOriginal,
                                              ComentarioModerado = Comentario.ComentarioModerado,
                                              IdTipoRespuesta = Comentario.IdTipoRespuesta,
                                              ComentarioRelacionado = Comentario.ComentarioRelacionado,
                                              IdComentario = Comentario.IdComentario,
                                              Anonimo = Comentario.Anonimo

                                          }).OrderBy(p => p.fechaCreacion).ToList();

                objReturn = infoProyecto;

            return objReturn;
        }

        public List<itemcomentario> ObtenerComentariosContAsync(string Id)
        {
            List<itemcomentario> objReturn = new List<itemcomentario>();
            var comentarios = new List<object>();

            var infoProyecto = (from Comentario in _connection.Comentarios
                                join usuarios in _connection.Usuarios
                                on Comentario.IdUsuario equals usuarios.IdUsuario
                                where Comentario.Codigocontrato == Id
                                && (Comentario.IdEstado == 3 || Comentario.IdEstado == 5 || Comentario.IdEstado == 6)
                                orderby Comentario.ComentarioRelacionado ascending
                                select new itemcomentario
                                {
                                    IdUsuario = usuarios.IdUsuario,
                                    nom_usuario = usuarios.Nombre,
                                    fechaCreacion = (DateTime)Comentario.FechaCreacion,
                                    ComentarioOriginal = Comentario.ComentarioOriginal,
                                    ComentarioModerado = Comentario.ComentarioModerado,
                                    IdTipoRespuesta = Comentario.IdTipoRespuesta,
                                    ComentarioRelacionado = Comentario.ComentarioRelacionado,
                                    IdComentario = Comentario.IdComentario,
                                    Anonimo = Comentario.Anonimo

                                }).OrderBy(p => p.fechaCreacion).ToList();

            objReturn = infoProyecto;

            return objReturn;
        }


        public itemUsuarios ValidaLogin(string correo, string clave, string validarol)
        {

            itemUsuarios lstUsuarios = new itemUsuarios();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                if (validarol == "S") {
                    var infoUsuario = (from query in _connection.Usuarios
                                       join entidad in _connection.UsuarioPermisoes
                                       on query.IdUsuario equals entidad.IdUsuario
                                       where query.Email == correo
                                       && query.HashClave == clave
                                       && query.Estado == "ACTIVO"
                                       && entidad.IdTipoPermiso == 3
                                       select new itemUsuarios {
                                           IdUsuario = query.IdUsuario,
                                           Estado = query.Estado,
                                           Nombre = query.Nombre
                                       }).FirstOrDefault();
                    lstUsuarios = infoUsuario;
                }
                else {
                    var infoUsuario = (from query in _connection.Usuarios
                                       where query.Email == correo
                                       && query.HashClave == clave
                                       && query.Estado == "ACTIVO"
                                       select new itemUsuarios {
                                           IdUsuario = query.IdUsuario,
                                           Estado = query.Estado,
                                           Nombre = query.Nombre
                                       }).FirstOrDefault();
                    lstUsuarios = infoUsuario;
                }
            //}
            return lstUsuarios;
        }

        public  itemUsuarios validaCreado(string correo, string clave)
        {

            itemUsuarios lstUsuarios = new itemUsuarios();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;

                var infoUsuario = (from query in _connection.Usuarios
                                   where query.Email == correo
                                   && query.HashClave == clave
                                   && query.Estado == "CREADO"
                                   select new itemUsuarios {
                                       IdUsuario = query.IdUsuario,
                                       Estado = query.Estado,
                                       Nombre = query.Nombre
                                   }).FirstOrDefault();
                lstUsuarios = infoUsuario;

            //}
            return lstUsuarios;
        }


        public List<RolParticipa> ObtenerRolesProyAsync()
        {
            List<RolParticipa> objReturn = new List<RolParticipa>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {

            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from roles in _connection.RolUsuarios
                                   orderby roles.NombreRol
                                   select new RolParticipa {
                                       id = roles.IdRolUsuario,
                                       name = roles.NombreRol
                                   }).ToList();


            //}

            return objReturn;
        }

        public List<RolParticipa> ObtenerRolesProy()
        {
            List<RolParticipa> objReturn = new List<RolParticipa>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {

            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from roles in _connection.RolUsuarios
                             orderby roles.NombreRol
                             select new RolParticipa {
                                 id = roles.IdRolUsuario,
                                 name = roles.NombreRol
                             }).ToList();
            //}
            return objReturn;
        }

        public List<GenerosParticipacion> ObtenerGenerosProyAsync()
        {
            List<GenerosParticipacion> objReturn = new List<GenerosParticipacion>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {

            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from generos in _connection.GeneroUsuarios
                                   orderby generos.NombreGenero
                                   select new GenerosParticipacion {
                                       id = generos.IdGeneroUsuario,
                                       name = generos.NombreGenero
                                   }).ToList();


            //}

            return objReturn;
        }

        public List<GenerosParticipacion> ObtenerGenerosProy()
        {
            List<GenerosParticipacion> objReturn = new List<GenerosParticipacion>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from generos in _connection.GeneroUsuarios
                             orderby generos.NombreGenero
                             select new GenerosParticipacion {
                                 id = generos.IdGeneroUsuario,
                                 name = generos.NombreGenero
                             }).ToList();
            //}
            return objReturn;
        }

        public List<MediosParticipacion> ObtenerMotivosProyAsync()
        {
            List<MediosParticipacion> objReturn = new List<MediosParticipacion>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {

            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from medios in _connection.MedioMapaIUsuarios
                                   orderby medios.IdMedioMapaIUsuario
                                   select new MediosParticipacion {
                                       id = medios.IdMedioMapaIUsuario,
                                       name = medios.NombreMedio
                                   }).ToList();
            //}

            return objReturn;
        }

        public List<MediosParticipacion> ObtenerMotivosProy()
        {
            List<MediosParticipacion> objReturn = new List<MediosParticipacion>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from medios in _connection.MedioMapaIUsuarios
                             orderby medios.IdMedioMapaIUsuario
                             select new MediosParticipacion {
                                 id = medios.IdMedioMapaIUsuario,
                                 name = medios.NombreMedio
                             }).ToList();
            //}
            return objReturn;
        }

        public List<TiposComentario> ObtenerTipoComentarioAsync(int Asociacion)
        {
            List<TiposComentario> objReturn = new List<TiposComentario>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {

            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn =  (from TipoComentario in _connection.TipoComentarios
                                   where TipoComentario.Estado == true
                                   && TipoComentario.IdAsociacion == Asociacion
                                    orderby TipoComentario.Id
                                   select new TiposComentario {
                                       idTC = TipoComentario.Id,
                                       nameTC = TipoComentario.TipoComentarioColumn
                                   }).ToList();
            //}
            return objReturn;
        }

        public List<TiposComentario> ObtenerTipoComentario()
        {
            List<TiposComentario> objReturn = new List<TiposComentario>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from TipoComentario in _connection.TipoComentarios
                             orderby TipoComentario.Id
                             select new TiposComentario {
                                 idTC = TipoComentario.Id,
                                 nameTC = TipoComentario.TipoComentarioColumn
                             }).ToList();
            //}
            return objReturn;
        }
        public string GuardarComentario(int idUsuario, int? idProyecto, int idAsociacion, int idTipoComentario, string comentarioOriginal, bool? anonimo, int IdEstado, int? ComentarioRelacionado, string id_departamento, string id_municipio, string CodigoContrato, int? TipoSubsidio)
        {
            int idProy = Convert.ToInt32(idProyecto);
            string outTxt = "";
            try {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {

                //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
                //    pisgrEntities.Configuration.LazyLoadingEnabled = false;

                int idRegNew = _connection.GetTable<Comentario>()
                    .InsertWithInt32Identity(() => new Comentario {

                        IdUsuario = idUsuario,
                        IdProyecto = idProy,
                        Codigocontrato = CodigoContrato,
                        IdDepartamento = id_departamento,
                        IdMunicipio = id_municipio,
                        FechaCreacion = DateTime.Now,
                        IdTipoComentario = idTipoComentario,
                        IdAsociacion = idAsociacion,
                        ComentarioOriginal = comentarioOriginal,
                        Anonimo = anonimo,
                        IdEstado = IdEstado,
                        IdTipoRespuesta = 1,
                        ComentarioRelacionado = ComentarioRelacionado,
                    });

                if (idRegNew > 0 ) {
                    outTxt = "0<||>";
                }

            }
            catch (Exception exe) {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1) {
                    outTxt = "-1<||>" + "Ya se registró el comentario";
                }

            }
            return outTxt;
        }


        public itemUsuarios ValidaSessionUsu(int id_usuario, string validarol)
        {

            itemUsuarios lstUsuarios = new itemUsuarios();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                if (validarol == "S") {
                    var infoUsuario = (from query in _connection.Usuarios
                                       join entidad in _connection.UsuarioPermisoes
                                       on query.IdUsuario equals entidad.IdUsuario
                                       where query.IdUsuario == id_usuario
                                       && query.Estado == "ACTIVO"
                                       && entidad.IdTipoPermiso == 3
                                       select new itemUsuarios {
                                           IdUsuario = query.IdUsuario,
                                           Estado = query.Estado,
                                           Nombre = query.Nombre,
                                           email = query.Email
                                       }).FirstOrDefault();
                    lstUsuarios = infoUsuario;
                }
                else {
                    var infoUsuario = (from query in _connection.Usuarios
                                       where query.IdUsuario == id_usuario
                                       && query.Estado == "ACTIVO"
                                       select new itemUsuarios {
                                           IdUsuario = query.IdUsuario,
                                           Estado = query.Estado,
                                           Nombre = query.Nombre,
                                           email = query.Email
                                       }).FirstOrDefault();
                    lstUsuarios = infoUsuario;
                }
            //}
            return lstUsuarios;
        }


        public String ObtenerCorreosAprobadores()
        {
            List<itemUsuarios> lstUsuarios = new List<itemUsuarios>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {

            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                var infoUsuario = (from usuario in _connection.Usuarios
                                   join UsuarioXEntidad in _connection.UsuarioPermisoes
                                   on usuario.IdUsuario equals UsuarioXEntidad.IdUsuario
                                   where usuario.Estado == "ACTIVO"
                                    && UsuarioXEntidad.IdTipoPermiso == 3
                                   select new itemUsuarios {
                                       IdUsuario = usuario.IdUsuario,
                                       email = usuario.Email
                                   }).ToList();
                lstUsuarios = infoUsuario;
            //}
            String destinatarios = "";
            foreach (itemUsuarios item in lstUsuarios) {
                destinatarios += item.email + ";";
            }

            return destinatarios;

        }


        public itemEstadisticas ObtenerEstadisticasProyAsync(int Id)
        {
            itemEstadisticas objReturn = new itemEstadisticas();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                var infoProyecto =  (from aprobadosInv in _connection.VwProyectosAprobadosInvs
                                          where aprobadosInv.IdProyecto == Id
                                          select new itemEstadisticas {
                                              cantComentarios = aprobadosInv.Comentarios,
                                              cantFotos = aprobadosInv.NumeroImagenes,
                                              cantMegusta = aprobadosInv.MeGusta
                                          }).FirstOrDefault();

                objReturn = infoProyecto;

            //}

            return objReturn;
        }


        public string RegistroNuevoUsuario(string nombre, string correo, string hash_clave, Nullable<int> edad, Nullable<int> genero, Nullable<int> rol, Nullable<int> medio)
        {

           
            string outTxt = "";
            try {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {

                //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
                //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                int id = _connection.GetTable<Usuario>()
                    .InsertWithInt32Identity(() => new Usuario {
                        Nombre = nombre,
                        Email = correo,
                        Estado = "CREADO",
                        HashClave = hash_clave,
                        FechaCreacion = DateTime.Now,
                        Edad = edad,
                        IdGeneroUsuario = genero,
                        IdRolUsuario = rol,
                        IdMedioMapaIUsuario = medio,
                    });

                //}
                if (id > 0) {
                    outTxt = "0<||>" + id.ToString();
                }

            }
            catch (Exception exe) {
                if (exe.Message.IndexOf("UNIQUE KEY") > -1)
                {
                    outTxt = "-1<||>" + "Ya existe una cuenta asociada al correo electrónico digitado";
                }
                else {
                    outTxt = "-1<||>" + exe.Message;
                }

            }
            return outTxt;
        }


        public string updCodigoVerifica(int id_usuario, string hash_codigo)
        {
            string outTxt = "";
            int cantReg = 0;
            try {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {

                cantReg = _connection
                    .GetTable<Usuario>()
                    .Where(t => t.IdUsuario == id_usuario)
                    .Update(t => new Usuario {
                        CodVerifica = hash_codigo,
                    });
                //}
                if (cantReg > 0) {
                    outTxt = "0<||>";
                }
                else {
                    outTxt = "-1<||>" + "No se actualizaron registros";
                }
            }
            catch (Exception exe) {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
            }
            return outTxt;
        }

        public string GuardaMeGusta(int idUsuario, int? idFoto, int? idFotoUsuario, bool megusta1, bool noMegusta, int idProyecto)
        {
            
            string outTxt = "";
            try {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {
                //pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
                //pisgrEntities.Configuration.LazyLoadingEnabled = false;
                int idRegNew = _connection.GetTable<MeGusta>()
                    .InsertWithInt32Identity(() => new MeGusta {
                        IdUsuario = idUsuario,
                        IdFoto = idFoto,
                        IdFotoUsuario = idFotoUsuario,
                        MeGustaColumn = megusta1,
                        NoMeGusta = noMegusta,
                        IdProyecto = idProyecto,
                        Fecha = DateTime.Now,
                    });
                //}
                if (idRegNew > 0) {
                    outTxt = "0<||>";
                }

            }
            catch (Exception exe) {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1) {
                    outTxt = "-1<||>" + "Ya se registró la opinión para esta foto o proyecto";
                }

            }
            return outTxt;
        }


        public itemUsuarios validaEmail(string correo)
        {
            itemUsuarios lstUsuarios = new itemUsuarios();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {

            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                var infoUsuario = (from query in _connection.Usuarios
                                   where query.Email == correo
                                   && query.Estado == "ACTIVO"
                                   select new itemUsuarios {
                                       IdUsuario = query.IdUsuario,
                                       cod_verifica = query.CodVerifica
                                   }).FirstOrDefault();
                lstUsuarios = infoUsuario;
            //}

            return lstUsuarios;

        }


        public string updClaveUsuario(int id_usuario, string hash_clave_new)
        {
            string outTxt = "";
            int cantReg = 0;
            try {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {

                    Usuario actualUsuario = (from c in _connection.Usuarios
                                             where c.IdUsuario == id_usuario
                                             select c
                                               ).FirstOrDefault();
                    if (actualUsuario.HashClave.Equals(hash_clave_new)) {
                        outTxt = "-1<||>" + "La nueva clave debe ser diferente a la actual";
                    }
                    else {
                        cantReg = _connection
                           .GetTable<Usuario>()
                           .Where(t => t.IdUsuario == id_usuario)
                           .Update(t => new Usuario {
                               HashClave = hash_clave_new,
                           });

                        if (cantReg > 0) {
                            outTxt = "0<||>";
                        }
                    }

                //}

            }
            catch (Exception exe) {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
            }

            return outTxt;
        }


        public string RegistrarNuevaFotoUsuario(string descripcion, string nombreArchivo, string idDepartamento, string idMunicipio, int proyectoId, int idUsuario)
        {
            string outTxt = "";
            try {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {
                //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
                //pisgrEntities.Configuration.LazyLoadingEnabled = false;

                int idRegNew = _connection.GetTable<FotoUsuario>()
                    .InsertWithInt32Identity(() => new FotoUsuario {
                            Aprobado = false,
                            Aprobadopor = string.Empty,
                            Eliminado = false,
                            Descripcion = descripcion,
                            Fecha = DateTime.Now,
                            RutaFotoGrande = nombreArchivo,
                            RutaFotoMediano = nombreArchivo,
                            RutaFotoPequeno = nombreArchivo,
                            IdDepartamento = idDepartamento,
                            IdMunicipio = idMunicipio,
                            IdProyecto = proyectoId,
                            IdUsuario = idUsuario,
                    });
            //}
            if (idRegNew > 0) {
                    outTxt = "0<||>";
                }

            }
            catch (Exception exe) {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1) {
                    outTxt = "-1<||>" + "Ya existe una foto con ese nombre en la base de datos";
                }
                else outTxt = exe.InnerException.InnerException.Message;
            }
            return outTxt;

        }



        public itemUsuarios validaUsuarioByHash(string hash_verifica)
        {
            itemUsuarios lstUsuarios = new itemUsuarios();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                var infoUsuario = (from query in _connection.Usuarios
                                   where query.CodVerifica == hash_verifica
 //AND                                  && query.Estado == "CREADO"
                                   select new itemUsuarios {
                                       IdUsuario = query.IdUsuario,
                                       email = query.Email,
                                       Nombre = query.Nombre
                                   }).FirstOrDefault();
                lstUsuarios = infoUsuario;
            //}
            return lstUsuarios;
        }


        public string updEstadoUsuario(int id_usuario, string estado)
        {
            string outTxt = "";
            int cantReg = 0;
            try {
                //using (PISGREntities pisgrEntities = new PISGREntities()) {
                cantReg = _connection
                           .GetTable<Usuario>()
                           .Where(t => t.IdUsuario == id_usuario)
                           .Update(t => new Usuario {
                               Estado = estado,
                           });
                //}
                if (cantReg > 0) {
                    outTxt = "0<||>";
                }
            }
            catch (Exception exe) {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
            }
            return outTxt;
        }


        public List<filtrosParticipacion> ObtenerEstadosComentarioAsync()
        {
            List<filtrosParticipacion> objReturn = new List<filtrosParticipacion>();
            //using (PISGREntities pisgrEntities = new PISGREntities()) {
            //    pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
            //    pisgrEntities.Configuration.LazyLoadingEnabled = false;
                objReturn = (from TipoComentario in _connection.EstadoComentarios
                                   orderby TipoComentario.Id
                                   select new filtrosParticipacion {
                                       id = TipoComentario.Id,
                                       name = TipoComentario.EstadoComentarioColumn
                                   }).ToList();
            //}
            return objReturn;
        }


        public ModelDataParticipacion ObtenerTipologiasComentariosAsync(int idcomentario)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            var comentarios = new List<object>();

            List<itemcomentario> listInfo = new List<itemcomentario>();

            listInfo = (from x in _connection.ObtenerTipologiasPorComentario(idcomentario)
                        select new itemcomentario
                        {
                            IdTipologia = x.IdTipologia,
                            Tipologia = x.Tipologia,
                            Relacion = x.Relacion
                        }).OrderBy(p => p.Tipologia).ToList();

            objReturn.itemcomentario = listInfo;

            return objReturn;
        }


        public int ObtenerComentariosAproCant()
        {
            var total_pendientes = 0;
            int? total_registros = 0;
            List<itemcomentario> info = new List<itemcomentario>();
            List<itemcomentario> info_2 = new List<itemcomentario>();

            //using (PISGREntities pisgrEntities = new PISGREntities()) {
                //ObjectParameter total_registros = new ObjectParameter("TOTALREGISTROS", typeof(Int32));
                //pisgrEntities.Configuration.AutoDetectChangesEnabled = false;
                //pisgrEntities.Configuration.LazyLoadingEnabled = false;
                info = (from Comentario in _connection.ObtenerComentariosPorEstados(1, 1, 0, 1, 999, ref total_registros)
                        select new itemcomentario {
                            IdComentario = Comentario.IdComentario,

                        }).ToList();

                total_pendientes += total_registros.Value;

            //}
            return total_pendientes;
        }


        public ModelDataParticipacion ObtenerComentariosAproAsync(int page, int estado)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            var comentarios = new List<object>();

            List<itemcomentario> listInfo = new List<itemcomentario>();
            int total_reg = 0;
  //AND          //int reg_per_page = CommonLabel.MaximumResultPerFicha;
            int reg_per_page = 10;
            //using (PISGREntities entities = new PISGREntities()) {
            //    entities.Configuration.AutoDetectChangesEnabled = false;
            //    entities.Configuration.LazyLoadingEnabled = false;
            //    entities.Configuration.ValidateOnSaveEnabled = false;
            //ObjectParameter total_registros = new ObjectParameter("TOTALREGISTROS", typeof(Int32));
            int? total_registros = 0;

            listInfo = (from x in _connection.ObtenerComentariosPorEstados(estado,1,0, page, reg_per_page, ref total_registros)
                            select new itemcomentario {
                                IdUsuario = x.IdUsuario,
                                nom_usuario = x.Nombre,
                                fechaCreacion = (DateTime)x.fechaCreacion,
                                ComentarioOriginal = x.ComentarioOriginal,
                                ComentarioModerado = x.ComentarioModerado,
                                IdTipoRespuesta = x.IdTipoRespuesta,
                                ComentarioRelacionado = x.ComentarioRelacionado,
                                IdEstado = x.IdEstado,
                                IdComentario = x.IdComentario,
                                NombreEstado = x.EstadoComentario,
                                IdProyecto = x.IdProyecto,
                                NombreProyecto = x.NombreProyecto,
                                Anonimo = x.Anonimo,
                                id_departamento = x.IdDepartamento,
                                id_municipio = x.IdMunicipio,
                                IdTipoComentario = x.IdTipoComentario,
                                NombreTipoComentario = x.TipoComentario,
                                CodEnteTerritorialBeneficiario = x.CodEnteTerritorialBeneficiario,
                                nom_municipio = x.NombreMunicipio,
                                nom_departamento = x.NombreDepartamento

                            }).OrderBy(p => p.fechaCreacion).ToList();

                total_reg = (int)total_registros.Value;
            //}
            objReturn.totalNumber = total_reg;
            objReturn.totalPages = (objReturn.totalNumber > reg_per_page) ? ((objReturn.totalNumber - (objReturn.totalNumber % reg_per_page)) / reg_per_page) : 1;
            if ((objReturn.totalNumber >= reg_per_page) && ((objReturn.totalNumber % reg_per_page) > 0)) {
                objReturn.totalPages++;
            }

            objReturn.itemcomentario = listInfo;
            return objReturn;
        }

        public List<filtrosParticipacion> ObtenerAsociacionComentarioAsync()
        {
            List<filtrosParticipacion> objReturn = new List<filtrosParticipacion>();
            
                var queryInfo =  (from info in _connection.Asociacioncomentarios
                                       select new filtrosParticipacion
                                       {
                                           name = info.TipoAsociacion,
                                           id = info.IdAsociacion
                                       }).OrderBy(p => p.id).ToList();

                objReturn = queryInfo;

            return objReturn;
        }

        public List<filtrosParticipacion> ObtenerAsociacionComentario()
        {
            List<filtrosParticipacion> objReturn = new List<filtrosParticipacion>();
               var queryInfo = (from info in _connection.Asociacioncomentarios
                                 select new filtrosParticipacion
                                 {
                                     name = info.TipoAsociacion,
                                     id = info.IdAsociacion
                                 }).OrderBy(p => p.id).ToList();

                objReturn = queryInfo;

            return objReturn;
        }


        public string deleteTipologiaComent(int id_comentario)
        {
            string outTxt = "";
            int cantReg = 0;
            try
            {
                cantReg = _connection.GetTable<TipologiasComentario>()
               .Where(dl => dl.IdComentario == id_comentario).Delete();
                outTxt = "0<||>";
            }
            catch (Exception exe)
            {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
            }
            return outTxt;
        }


        public string insertarTipologiaComent(int id_comentario, string str_tipologias)
        {
            string outTxt = "";
            try
            {
                string[] separador = new string[] { "," };
                var vec_info = str_tipologias.Split(separador, StringSplitOptions.None);
                int idRegNew = 0;
                IList<TipologiasComentario> listado_aux = new List<TipologiasComentario>();

                foreach (string cad_tipologia in vec_info)
                {
                    idRegNew = _connection.GetTable<TipologiasComentario>()
                   .Insert(() => new TipologiasComentario
                   {
                       IdComentario = id_comentario,
                       IdTipologia = Int32.Parse(cad_tipologia)
                   });
                }
                if (idRegNew > 0)
                {
                    outTxt = "0<||>";
                }
            }
            catch (Exception exe)
            {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
            }
            return outTxt;
        }
    }
}
