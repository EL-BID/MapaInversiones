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
    ***REMOVED***

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

                                      ***REMOVED***).OrderBy(p => p.fechaCreacion).ToList();

                objReturn = infoProyecto;

            return objReturn;
    ***REMOVED***

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

                            ***REMOVED***).OrderBy(p => p.fechaCreacion).ToList();

            objReturn = infoProyecto;

            return objReturn;
    ***REMOVED***


        public itemUsuarios ValidaLogin(string correo, string clave, string validarol)
        {

            itemUsuarios lstUsuarios = new itemUsuarios();

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
                                   ***REMOVED***).FirstOrDefault();
                    lstUsuarios = infoUsuario;
            ***REMOVED***
                else {
                    var infoUsuario = (from query in _connection.Usuarios
                                       where query.Email == correo
                                       && query.HashClave == clave
                                       && query.Estado == "ACTIVO"
                                       select new itemUsuarios {
                                           IdUsuario = query.IdUsuario,
                                           Estado = query.Estado,
                                           Nombre = query.Nombre
                                   ***REMOVED***).FirstOrDefault();
                    lstUsuarios = infoUsuario;
            ***REMOVED***
           
            return lstUsuarios;
    ***REMOVED***

        public  itemUsuarios validaCreado(string correo, string clave)
        {

            itemUsuarios lstUsuarios = new itemUsuarios();

                var infoUsuario = (from query in _connection.Usuarios
                                   where query.Email == correo
                                   && query.HashClave == clave
                                   && query.Estado == "CREADO"
                                   select new itemUsuarios {
                                       IdUsuario = query.IdUsuario,
                                       Estado = query.Estado,
                                       Nombre = query.Nombre
                               ***REMOVED***).FirstOrDefault();
                lstUsuarios = infoUsuario;

           
            return lstUsuarios;
    ***REMOVED***


        public List<RolParticipa> ObtenerRolesProyAsync()
        {
            List<RolParticipa> objReturn = new List<RolParticipa>();
 
                objReturn = (from roles in _connection.RolUsuarios
                                   orderby roles.NombreRol
                                   select new RolParticipa {
                                       id = roles.IdRolUsuario,
                                       name = roles.NombreRol
                               ***REMOVED***).ToList();


           

            return objReturn;
    ***REMOVED***

        public List<RolParticipa> ObtenerRolesProy()
        {
            List<RolParticipa> objReturn = new List<RolParticipa>();

                objReturn = (from roles in _connection.RolUsuarios
                             orderby roles.NombreRol
                             select new RolParticipa {
                                 id = roles.IdRolUsuario,
                                 name = roles.NombreRol
                         ***REMOVED***).ToList();
           
            return objReturn;
    ***REMOVED***

        public List<GenerosParticipacion> ObtenerGenerosProyAsync()
        {
            List<GenerosParticipacion> objReturn = new List<GenerosParticipacion>();

                objReturn = (from generos in _connection.GeneroUsuarios
                                   orderby generos.NombreGenero
                                   select new GenerosParticipacion {
                                       id = generos.IdGeneroUsuario,
                                       name = generos.NombreGenero
                               ***REMOVED***).ToList();


           

            return objReturn;
    ***REMOVED***

        public List<GenerosParticipacion> ObtenerGenerosProy()
        {
            List<GenerosParticipacion> objReturn = new List<GenerosParticipacion>();

                objReturn = (from generos in _connection.GeneroUsuarios
                             orderby generos.NombreGenero
                             select new GenerosParticipacion {
                                 id = generos.IdGeneroUsuario,
                                 name = generos.NombreGenero
                         ***REMOVED***).ToList();
            
            return objReturn;
    ***REMOVED***

        public List<MediosParticipacion> ObtenerMotivosProyAsync()
        {
            List<MediosParticipacion> objReturn = new List<MediosParticipacion>();
 
                objReturn = (from medios in _connection.MedioMapaIUsuarios
                                   orderby medios.IdMedioMapaIUsuario
                                   select new MediosParticipacion {
                                       id = medios.IdMedioMapaIUsuario,
                                       name = medios.NombreMedio
                               ***REMOVED***).ToList();
            

            return objReturn;
    ***REMOVED***

        public List<MediosParticipacion> ObtenerMotivosProy()
        {
            List<MediosParticipacion> objReturn = new List<MediosParticipacion>();

                objReturn = (from medios in _connection.MedioMapaIUsuarios
                             orderby medios.IdMedioMapaIUsuario
                             select new MediosParticipacion {
                                 id = medios.IdMedioMapaIUsuario,
                                 name = medios.NombreMedio
                         ***REMOVED***).ToList();
           
            return objReturn;
    ***REMOVED***

        public List<TiposComentario> ObtenerTipoComentarioAsync(int Asociacion)
        {
            List<TiposComentario> objReturn = new List<TiposComentario>();

                objReturn =  (from TipoComentario in _connection.TipoComentarios
                                   where TipoComentario.Estado == true
                                   && TipoComentario.IdAsociacion == Asociacion
                                    orderby TipoComentario.Id
                                   select new TiposComentario {
                                       idTC = TipoComentario.Id,
                                       nameTC = TipoComentario.TipoComentarioColumn
                               ***REMOVED***).ToList();
            
            return objReturn;
    ***REMOVED***

        public List<TiposComentario> ObtenerTipoComentario()
        {
            List<TiposComentario> objReturn = new List<TiposComentario>();

                objReturn = (from TipoComentario in _connection.TipoComentarios
                             orderby TipoComentario.Id
                             select new TiposComentario {
                                 idTC = TipoComentario.Id,
                                 nameTC = TipoComentario.TipoComentarioColumn
                         ***REMOVED***).ToList();
            return objReturn;
    ***REMOVED***
        public string GuardarComentario(int idUsuario, int? idProyecto, int idAsociacion, int idTipoComentario, string comentarioOriginal, bool? anonimo, int IdEstado, int? ComentarioRelacionado, string id_departamento, string id_municipio, string CodigoContrato, int? TipoSubsidio)
        {
            int idProy = Convert.ToInt32(idProyecto);
            string outTxt = "";
            try {

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
                ***REMOVED***);

                if (idRegNew > 0 ) {
                    outTxt = "0<||>";
            ***REMOVED***

        ***REMOVED***
            catch (Exception exe) {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1) {
                    outTxt = "-1<||>" + "Ya se registró el comentario";
            ***REMOVED***

        ***REMOVED***
            return outTxt;
    ***REMOVED***


        public itemUsuarios ValidaSessionUsu(int id_usuario, string validarol)
        {

            itemUsuarios lstUsuarios = new itemUsuarios();

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
                                   ***REMOVED***).FirstOrDefault();
                    lstUsuarios = infoUsuario;
            ***REMOVED***
                else {
                    var infoUsuario = (from query in _connection.Usuarios
                                       where query.IdUsuario == id_usuario
                                       && query.Estado == "ACTIVO"
                                       select new itemUsuarios {
                                           IdUsuario = query.IdUsuario,
                                           Estado = query.Estado,
                                           Nombre = query.Nombre,
                                           email = query.Email
                                   ***REMOVED***).FirstOrDefault();
                    lstUsuarios = infoUsuario;
            ***REMOVED***
            
            return lstUsuarios;
    ***REMOVED***


        public String ObtenerCorreosAprobadores()
        {
            List<itemUsuarios> lstUsuarios = new List<itemUsuarios>();

                var infoUsuario = (from usuario in _connection.Usuarios
                                   join UsuarioXEntidad in _connection.UsuarioPermisoes
                                   on usuario.IdUsuario equals UsuarioXEntidad.IdUsuario
                                   where usuario.Estado == "ACTIVO"
                                    && UsuarioXEntidad.IdTipoPermiso == 3
                                   select new itemUsuarios {
                                       IdUsuario = usuario.IdUsuario,
                                       email = usuario.Email
                               ***REMOVED***).ToList();
                lstUsuarios = infoUsuario;
           
            String destinatarios = "";
            foreach (itemUsuarios item in lstUsuarios) {
                destinatarios += item.email + ";";
        ***REMOVED***

            return destinatarios;

    ***REMOVED***


        public itemEstadisticas ObtenerEstadisticasProyAsync(int Id)
        {
            itemEstadisticas objReturn = new itemEstadisticas();

                var infoProyecto =  (from aprobadosInv in _connection.VwProyectosAprobadosInvs
                                          where aprobadosInv.IdProyecto == Id
                                          select new itemEstadisticas {
                                              cantComentarios = aprobadosInv.Comentarios,
                                              cantFotos = aprobadosInv.NumeroImagenes,
                                              cantMegusta = aprobadosInv.MeGusta
                                      ***REMOVED***).FirstOrDefault();

                objReturn = infoProyecto;

            

            return objReturn;
    ***REMOVED***


        public string RegistroNuevoUsuario(string nombre, string correo, string hash_clave, Nullable<int> edad, Nullable<int> genero, Nullable<int> rol, Nullable<int> medio)
        {

           
            string outTxt = "";
            try {

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
                ***REMOVED***);

                
                if (id > 0) {
                    outTxt = "0<||>" + id.ToString();
            ***REMOVED***

        ***REMOVED***
            catch (Exception exe) {
                if (exe.Message.IndexOf("UNIQUE KEY") > -1)
                {
                    outTxt = "-1<||>" + "Ya existe una cuenta asociada al correo electrónico digitado";
            ***REMOVED***
                else {
                    outTxt = "-1<||>" + exe.Message;
            ***REMOVED***

        ***REMOVED***
            return outTxt;
    ***REMOVED***


        public string updCodigoVerifica(int id_usuario, string hash_codigo)
        {
            string outTxt = "";
            int cantReg = 0;
            try {

                cantReg = _connection
                    .GetTable<Usuario>()
                    .Where(t => t.IdUsuario == id_usuario)
                    .Update(t => new Usuario {
                        CodVerifica = hash_codigo,
                ***REMOVED***);
                
                if (cantReg > 0) {
                    outTxt = "0<||>";
            ***REMOVED***
                else {
                    outTxt = "-1<||>" + "No se actualizaron registros";
            ***REMOVED***
        ***REMOVED***
            catch (Exception exe) {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
        ***REMOVED***
            return outTxt;
    ***REMOVED***

        public string GuardaMeGusta(int idUsuario, int? idFoto, int? idFotoUsuario, bool megusta1, bool noMegusta, int idProyecto)
        {
            
            string outTxt = "";
            try {

                int idRegNew = _connection.GetTable<MeGusta>()
                    .InsertWithInt32Identity(() => new MeGusta {
                        IdUsuario = idUsuario,
                        IdFoto = idFoto,
                        IdFotoUsuario = idFotoUsuario,
                        MeGustaColumn = megusta1,
                        NoMeGusta = noMegusta,
                        IdProyecto = idProyecto,
                        Fecha = DateTime.Now,
                ***REMOVED***);
                
                if (idRegNew > 0) {
                    outTxt = "0<||>";
            ***REMOVED***

        ***REMOVED***
            catch (Exception exe) {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1) {
                    outTxt = "-1<||>" + "Ya se registró la opinión para esta foto o proyecto";
            ***REMOVED***

        ***REMOVED***
            return outTxt;
    ***REMOVED***


        public itemUsuarios validaEmail(string correo)
        {
            itemUsuarios lstUsuarios = new itemUsuarios();

                var infoUsuario = (from query in _connection.Usuarios
                                   where query.Email == correo
                                   && query.Estado == "ACTIVO"
                                   select new itemUsuarios {
                                       IdUsuario = query.IdUsuario,
                                       cod_verifica = query.CodVerifica
                               ***REMOVED***).FirstOrDefault();
                lstUsuarios = infoUsuario;
           

            return lstUsuarios;

    ***REMOVED***


        public string updClaveUsuario(int id_usuario, string hash_clave_new)
        {
            string outTxt = "";
            int cantReg = 0;
            try {


                    Usuario actualUsuario = (from c in _connection.Usuarios
                                             where c.IdUsuario == id_usuario
                                             select c
                                               ).FirstOrDefault();
                    if (actualUsuario.HashClave.Equals(hash_clave_new)) {
                        outTxt = "-1<||>" + "La nueva clave debe ser diferente a la actual";
                ***REMOVED***
                    else {
                        cantReg = _connection
                           .GetTable<Usuario>()
                           .Where(t => t.IdUsuario == id_usuario)
                           .Update(t => new Usuario {
                               HashClave = hash_clave_new,
                       ***REMOVED***);

                        if (cantReg > 0) {
                            outTxt = "0<||>";
                    ***REMOVED***
                ***REMOVED***

              

        ***REMOVED***
            catch (Exception exe) {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
        ***REMOVED***

            return outTxt;
    ***REMOVED***


        public string RegistrarNuevaFotoUsuario(string descripcion, string nombreArchivo, string idDepartamento, string idMunicipio, int proyectoId, int idUsuario)
        {
            string outTxt = "";
            try {


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
                ***REMOVED***);
          
            if (idRegNew > 0) {
                    outTxt = "0<||>";
            ***REMOVED***

        ***REMOVED***
            catch (Exception exe) {
                if (exe.InnerException.InnerException.Message.IndexOf("UNIQUE KEY") > -1) {
                    outTxt = "-1<||>" + "Ya existe una foto con ese nombre en la base de datos";
            ***REMOVED***
                else outTxt = exe.InnerException.InnerException.Message;
        ***REMOVED***
            return outTxt;

    ***REMOVED***



        public itemUsuarios validaUsuarioByHash(string hash_verifica)
        {
            itemUsuarios lstUsuarios = new itemUsuarios();

                var infoUsuario = (from query in _connection.Usuarios
                                   where query.CodVerifica == hash_verifica
                                   select new itemUsuarios {
                                       IdUsuario = query.IdUsuario,
                                       email = query.Email,
                                       Nombre = query.Nombre
                               ***REMOVED***).FirstOrDefault();
                lstUsuarios = infoUsuario;
           
            return lstUsuarios;
    ***REMOVED***


        public string updEstadoUsuario(int id_usuario, string estado)
        {
            string outTxt = "";
            int cantReg = 0;
            try {
    
                cantReg = _connection
                           .GetTable<Usuario>()
                           .Where(t => t.IdUsuario == id_usuario)
                           .Update(t => new Usuario {
                               Estado = estado,
                       ***REMOVED***);

                if (cantReg > 0) {
                    outTxt = "0<||>";
            ***REMOVED***
        ***REMOVED***
            catch (Exception exe) {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
        ***REMOVED***
            return outTxt;
    ***REMOVED***


        public List<filtrosParticipacion> ObtenerEstadosComentarioAsync()
        {
            List<filtrosParticipacion> objReturn = new List<filtrosParticipacion>();
   
                objReturn = (from TipoComentario in _connection.EstadoComentarios
                                   orderby TipoComentario.Id
                                   select new filtrosParticipacion {
                                       id = TipoComentario.Id,
                                       name = TipoComentario.EstadoComentarioColumn
                               ***REMOVED***).ToList();
            
            return objReturn;
    ***REMOVED***


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
                    ***REMOVED***).OrderBy(p => p.Tipologia).ToList();

            objReturn.itemcomentario = listInfo;

            return objReturn;
    ***REMOVED***


        public int ObtenerComentariosAproCant()
        {
            var total_pendientes = 0;
            int? total_registros = 0;
            List<itemcomentario> info = new List<itemcomentario>();
            List<itemcomentario> info_2 = new List<itemcomentario>();


                info = (from Comentario in _connection.ObtenerComentariosPorEstados(1, 1, 0, 1, 999, ref total_registros)
                        select new itemcomentario {
                            IdComentario = Comentario.IdComentario,

                    ***REMOVED***).ToList();

                total_pendientes += total_registros.Value;

    
            return total_pendientes;
    ***REMOVED***


        public ModelDataParticipacion ObtenerComentariosAproAsync(int page, int estado)
        {
            ModelDataParticipacion objReturn = new ModelDataParticipacion();
            var comentarios = new List<object>();

            List<itemcomentario> listInfo = new List<itemcomentario>();
            int total_reg = 0;

            int reg_per_page = 10;

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

                        ***REMOVED***).OrderBy(p => p.fechaCreacion).ToList();

                total_reg = (int)total_registros.Value;
           
            objReturn.totalNumber = total_reg;
            objReturn.totalPages = (objReturn.totalNumber > reg_per_page) ? ((objReturn.totalNumber - (objReturn.totalNumber % reg_per_page)) / reg_per_page) : 1;
            if ((objReturn.totalNumber >= reg_per_page) && ((objReturn.totalNumber % reg_per_page) > 0)) {
                objReturn.totalPages++;
        ***REMOVED***

            objReturn.itemcomentario = listInfo;
            return objReturn;
    ***REMOVED***

        public List<filtrosParticipacion> ObtenerAsociacionComentarioAsync()
        {
            List<filtrosParticipacion> objReturn = new List<filtrosParticipacion>();
            
                var queryInfo =  (from info in _connection.Asociacioncomentarios
                                       select new filtrosParticipacion
                                       {
                                           name = info.TipoAsociacion,
                                           id = info.IdAsociacion
                                   ***REMOVED***).OrderBy(p => p.id).ToList();

                objReturn = queryInfo;

            return objReturn;
    ***REMOVED***

        public List<filtrosParticipacion> ObtenerAsociacionComentario()
        {
            List<filtrosParticipacion> objReturn = new List<filtrosParticipacion>();
               var queryInfo = (from info in _connection.Asociacioncomentarios
                                 select new filtrosParticipacion
                                 {
                                     name = info.TipoAsociacion,
                                     id = info.IdAsociacion
                             ***REMOVED***).OrderBy(p => p.id).ToList();

                objReturn = queryInfo;

            return objReturn;
    ***REMOVED***


        public string deleteTipologiaComent(int id_comentario)
        {
            string outTxt = "";
            int cantReg = 0;
            try
            {
                cantReg = _connection.GetTable<TipologiasComentario>()
               .Where(dl => dl.IdComentario == id_comentario).Delete();
                outTxt = "0<||>";
        ***REMOVED***
            catch (Exception exe)
            {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
        ***REMOVED***
            return outTxt;
    ***REMOVED***


        public string insertarTipologiaComent(int id_comentario, string str_tipologias)
        {
            string outTxt = "";
            try
            {
                string[] separador = new string[] { "," ***REMOVED***;
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
               ***REMOVED***);
            ***REMOVED***
                if (idRegNew > 0)
                {
                    outTxt = "0<||>";
            ***REMOVED***
        ***REMOVED***
            catch (Exception exe)
            {
                outTxt = "-1<||>" + exe.InnerException.Message.ToString();
        ***REMOVED***
            return outTxt;
    ***REMOVED***
***REMOVED***
***REMOVED***
