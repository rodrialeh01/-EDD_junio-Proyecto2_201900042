//--------------------------------------------HASH 256-----------------------------------------

var Sha256 = {};  // Sha256 namespace

/**
 * Generates SHA-256 hash of string
 *
 * @param {String} msg                String to be hashed
 * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
 * @returns {String}                  Hash of msg as hex character string
 */
Sha256.hash = function(msg, utf8encode) {
    utf8encode =  (typeof utf8encode == 'undefined') ? true : utf8encode;
    
    // convert string to UTF-8, as SHA only deals with byte-streams
    if (utf8encode) msg = Utf8.encode(msg);
    
    // constants [§4.2.2]
    var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
             0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
             0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
             0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
             0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
             0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
             0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
             0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    // initial hash value [§5.3.1]
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    // PREPROCESSING 
 
    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16);   // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
                      (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14])
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;


    // HASH COMPUTATION [§6.1.2]

    var W = new Array(64); var a, b, c, d, e, f, g, h;
    for (var i=0; i<N; i++) {

        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<64; t++) W[t] = (Sha256.sigma1(W[t-2]) + W[t-7] + Sha256.sigma0(W[t-15]) + W[t-16]) & 0xffffffff;

        // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
        a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

        // 3 - main loop (note 'addition modulo 2^32')
        for (var t=0; t<64; t++) {
            var T1 = h + Sha256.Sigma1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
            var T2 = Sha256.Sigma0(a) + Sha256.Maj(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) & 0xffffffff;
        }
         // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H[0] = (H[0]+a) & 0xffffffff;
        H[1] = (H[1]+b) & 0xffffffff; 
        H[2] = (H[2]+c) & 0xffffffff; 
        H[3] = (H[3]+d) & 0xffffffff; 
        H[4] = (H[4]+e) & 0xffffffff;
        H[5] = (H[5]+f) & 0xffffffff;
        H[6] = (H[6]+g) & 0xffffffff; 
        H[7] = (H[7]+h) & 0xffffffff; 
    }

    return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) + 
           Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
}

Sha256.ROTR = function(n, x) { return (x >>> n) | (x << (32-n)); }
Sha256.Sigma0 = function(x) { return Sha256.ROTR(2,  x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); }
Sha256.Sigma1 = function(x) { return Sha256.ROTR(6,  x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); }
Sha256.sigma0 = function(x) { return Sha256.ROTR(7,  x) ^ Sha256.ROTR(18, x) ^ (x>>>3);  }
Sha256.sigma1 = function(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x>>>10); }
Sha256.Ch = function(x, y, z)  { return (x & y) ^ (~x & z); }
Sha256.Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }

//
// hexadecimal representation of a number 
//   (note toString(16) is implementation-dependant, and  
//   in IE returns signed numbers when used on full words)
//
Sha256.toHexStr = function(n) {
  var s="", v;
  for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
  return s;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2010                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
} 

//---------------------------------------------LOGICA DE LAS ESTRUCTURAS DE DATOS---------------------------------------
class NodoAVL{
    constructor(_pelicula){
        this.pelicula = _pelicula
        this.izquierda = null
        this.derecha = null
        this.altura = 0
    }
}

class ArbolAVL{
    constructor(){
        this.raiz = null
        this.codigodot = ""
        this.mostrar = ""
        this.guardar = "["
    }
    insertar(_pelicula){
        this.raiz = this.insertarrecursivo(_pelicula,this.raiz)
    }
    insertarrecursivo(pelicula,nodo){
        if(nodo == null){
            return new NodoAVL(pelicula)
        }else{
            if(pelicula.id_pelicula < nodo.pelicula.id_pelicula){
                nodo.izquierda = this.insertarrecursivo(pelicula, nodo.izquierda)
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda) == -2){
                    if(pelicula.id_pelicula< nodo.izquierda.pelicula.id_pelicula){
                        nodo = this.rotacionizquierda(nodo)
                    }else{
                        nodo = this.rotaciondobleizquierda(nodo)
                    }
                }
            }else if(pelicula.id_pelicula > nodo.pelicula.id_pelicula){
                nodo.derecha = this.insertarrecursivo(pelicula, nodo.derecha)
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda)==2){
                    if(pelicula.id_pelicula > nodo.derecha.pelicula.id_pelicula){
                        nodo = this.rotacionderecha(nodo)
                    }else{
                        nodo = this.rotaciondoblederecha(nodo)
                    }
                }
            }else{
            }
        }
        nodo.altura = this.maximo(this.altura(nodo.izquierda),this.altura(nodo.derecha))+1
        return nodo
    }
    altura(nodo){
        if(nodo == null){
            return -1
        }else{
            return nodo.altura
        }
    }
    maximo(valor1,valor2){
        if(valor1 > valor2){
            return valor1
        }else{
            return valor2
        }
    }

    rotacionizquierda(nodo){
        let aux = nodo.izquierda
        nodo.izquierda = aux.derecha
        aux.derecha = nodo
        nodo.altura = this.maximo(this.altura(nodo.derecha),this.altura(nodo.izquierda))+1
        aux.altura = this.maximo(this.altura(nodo.izquierda),nodo.altura)+1
        return aux
    }

    rotacionderecha(nodo){
        let aux = nodo.derecha
        nodo.derecha = aux.izquierda
        aux.izquierda = nodo
        nodo.altura = this.maximo(this.altura(nodo.derecha), this.altura(nodo.izquierda))+1
        aux.altura = this.maximo(this.altura(nodo.derecha), nodo.altura)+1
        return aux
    }

    rotaciondoblederecha(nodo){
        nodo.derecha = this.rotacionizquierda(nodo.derecha)
        return this.rotacionderecha(nodo)
    }

    rotaciondobleizquierda(nodo){
        nodo.izquierda = this.rotacionderecha(nodo.izquierda)
        return this.rotacionizquierda(nodo)
    }
    preordenG(){
        this.pre_ordenG(this.raiz)
    }
    pre_ordenG(nodo){
        if(nodo != null){
            this.codigodot+= "\nnodo" + nodo.pelicula.id_pelicula + "[shape=circle,style=\"filled\",fillcolor=\"#0CA1EB\",fontcolor=\"white\" label=\"Pelicula:" + nodo.pelicula.nombre_pelicula + "\\nID:" + nodo.pelicula.id_pelicula+ "\"];"
            if(nodo.izquierda != null){
                this.codigodot += "\nnodo" + nodo.pelicula.id_pelicula + " -> nodo" + nodo.izquierda.pelicula.id_pelicula + "[headport=n];"
            }
            if(nodo.derecha != null){
                this.codigodot += "\nnodo" + nodo.pelicula.id_pelicula + " -> nodo" + nodo.derecha.pelicula.id_pelicula + "[headport=n];"
            }
            this.pre_ordenG(nodo.izquierda)
            this.pre_ordenG(nodo.derecha)
        }
    }
    graficar(){
        this.codigodot = "digraph G{\nsplines=false;"
        this.preordenG()
        this.codigodot+="\n}"
        console.log(this.codigodot)
        localStorage.setItem("dotpeliculas", this.codigodot)
    }
    inordenA(){
        this.in_ordenA(this.raiz)
    }
    in_ordenA(nodo){
        if(nodo != null){
            this.in_ordenA(nodo.izquierda)
            this.mostrar += `<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 profile_details margin_bottom_30">
            <div class="contact_blog">
               <div class="contact_inner">
                  <div class="left">
                     <h2>${nodo.pelicula.nombre_pelicula}</h2>
                     <p><strong>ID: </strong>${nodo.pelicula.id_pelicula}</p>
                     <br>
                     <p><strong>Descripción: </strong>${nodo.pelicula.descripcion}</p>
                     <h3><strong>Precio: </strong>Q${nodo.pelicula.precio_Q}.00</h3>
                  </div>
                  <div class="right">
                     <div class="profile_contacts">
                        <img class="img-responsive" src="images/layout_img/msg2.png" alt="#" />
                     </div>
                  </div>
                  <div class="bottom_list">
                     <div class="right_button">
                        <button type="button" class="btn btn-success btn-xs" value=${nodo.pelicula.id_pelicula} onclick="rentar(this)"><i class="fa fa-shopping-cart"></i> Alquilar Pelicula</button>
                        <button type="button" class="btn btn-primary btn-xs" value=${nodo.pelicula.id_pelicula} onclick="verPelicula(this)">
                        <i class="fa fa-play"> </i> Mas Información</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>`
            this.in_ordenA(nodo.derecha)
        }
    }
    inordenD(){
        this.in_ordenD(this.raiz)
    }
    in_ordenD(nodo){
        if(nodo != null){
            this.in_ordenD(nodo.derecha)
            this.mostrar += `<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 profile_details margin_bottom_30">
            <div class="contact_blog">
               <div class="contact_inner">
                  <div class="left">
                     <h2>${nodo.pelicula.nombre_pelicula}</h2>
                     <p><strong>ID: </strong>${nodo.pelicula.id_pelicula}</p>
                     <br>
                     <p><strong>Descripción: </strong>${nodo.pelicula.descripcion}</p>
                     <h3><strong>Precio: </strong>Q${nodo.pelicula.precio_Q}.00</h3>
                  </div>
                  <div class="right">
                     <div class="profile_contacts">
                        <img class="img-responsive" src="images/layout_img/msg2.png" alt="#" />
                     </div>
                  </div>
                  <div class="bottom_list">
                     <div class="right_button">
                        <button type="button" class="btn btn-success btn-xs" value=${nodo.pelicula.id_pelicula} onclick="rentar(this)"><i class="fa fa-shopping-cart"></i> Alquilar Pelicula</button>
                        <button type="button" class="btn btn-primary btn-xs" value=${nodo.pelicula.id_pelicula} onclick="verPelicula(this)">
                        <i class="fa fa-play"> </i> Mas Información</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>`
            this.in_ordenD(nodo.izquierda)
        }
    }
    inorden(){
        this.in_orden(this.raiz)
    }
    in_orden(nodo){
        if(nodo != null){
            this.in_orden(nodo.izquierda)
            console.log(nodo.pelicula)
            this.in_orden(nodo.derecha)
        }
    }
    postorden(){
        this.post_orden(this.raiz)
    }
    post_orden(nodo){
        if(nodo != null){
            this.post_orden(nodo.izquierda)
            this.post_orden(nodo.derecha)
            console.log(nodo.pelicula)
        }
    }
    buscar(nodo,_id){
        if(nodo == null){
            return null
        }else{
            if(nodo.pelicula.id_pelicula == _id){
                return nodo.pelicula
            }else if(_id < nodo.pelicula.id_pelicula){
                return this.buscar(nodo.izquierda,_id)
            }else if(_id > nodo.pelicula.id_pelicula){
                return this.buscar(nodo.derecha,_id)
            }
        }
    }
    preordenGuardar(){
        this.pre_ordenGuardar(this.raiz)
    }
    pre_ordenGuardar(nodo){
        if(nodo != null){
            this.guardar+=JSON.stringify(nodo.pelicula) + ","
            console.log(this.guardar)
            this.pre_ordenGuardar(nodo.izquierda)
            this.pre_ordenGuardar(nodo.derecha)
        }
    }
}

class Pelicula{
    constructor(_id,_nombre,_descripcion,_puntuacion,_precio){
        this.id_pelicula = _id
        this.nombre_pelicula = _nombre
        this.descripcion = _descripcion
        this.puntuacion_star = _puntuacion
        this.precio_Q = _precio
    }
}

function CargaPeliculas(){
    let input_archivo = document.getElementById("file1");
    let archivo = input_archivo.files[0];
    if (!archivo) {
    return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        let texto = event.target.result;
        let jtexto = JSON.parse(texto)
        for(let i = 0; i<jtexto.length; i++){
            let id = jtexto[i].id_pelicula;
            let nombre = jtexto[i].nombre_pelicula;
            let descripcion = jtexto[i].descripcion;
            let puntuacion = jtexto[i].puntuacion_star;
            let precio = jtexto[i].precio_Q;
            let nuevo = new Pelicula(id,nombre,descripcion,puntuacion,precio)
            console.log(nuevo)
        }
        localStorage.setItem("peliculas",texto)
    });
    reader.readAsText(archivo, "UTF-8");
    alert("Se cargaron las películas exitosamente")
}

class NodoCliente{
    constructor(_cliente){
        this.cliente = _cliente
        this.siguiente = null
    }
}

class ListaSimple{
    constructor(){
        this.primero = null
    }
    insertar(_cliente){
        if(this.primero ==null){
            this.primero = new NodoCliente(_cliente)
        }else{
            let temporal = this.primero
            while(temporal != null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            temporal.siguiente = new NodoCliente(_cliente)
        }
    }
    validarcliente(username,password){
        let temporal = this.primero
        while(temporal!= null){
            if(temporal.cliente.username == username){
                if(temporal.cliente.contrasenia == password){
                    return true
                }
            }
            temporal = temporal.siguiente
        }
        return false
    }
    retornaruserlogin(username,password){
        let temporal = this.primero
        while(temporal!= null){
            if(temporal.cliente.username == username){
                if(temporal.cliente.contrasenia == password){
                    return temporal.cliente
                }
            }
            temporal = temporal.siguiente
        }
        return null
    }
    retornaruser(_username){
        let temporal = this.primero
        while(temporal != null){
            if(temporal.cliente.username == _username){
                return temporal.cliente
            }
            temporal = temporal.siguiente
        }
        return null
    }
    graficar(){
        if(this.primero != null){
            let temporal = this.primero
            let codigodot = "digraph G {\nnode [shape=box];\nlabel=\"Lista de Clientes\"\nfontsize=28;\nrankdir= \"LR\";\n"
            let numnodo = 0
            let nodos = ""
            let conexiones = ""
            while(temporal!= null){
                nodos+= "Nodo" + numnodo + "[label=\"Nombre: " + temporal.cliente.nombre + "\\nUsername: "+temporal.cliente.username+"\\nDPI: "+temporal.cliente.dpi+"\" group="+numnodo+"];\n"
                if(temporal.siguiente != null){
                    let aux = numnodo+1
                    conexiones+= "Nodo" + numnodo + "->Nodo" + aux + ";\n"
                }   
                temporal = temporal.siguiente
                numnodo++
            }
            codigodot+= nodos + conexiones + "}"
            localStorage.setItem("clientesdot", codigodot)
            console.log(codigodot)
        }
    }
}

class Cliente{
    constructor(_dpi,_nombre,_username,_correo,_contrasenia,_telefono){
        this.dpi = _dpi
        this.nombre = _nombre
        this.username = _username
        this.correo = _correo
        this.contrasenia = _contrasenia
        this.telefono = _telefono
    }
}

function CargaClientes(){
    let input_archivo = document.getElementById("file2");
    let archivo = input_archivo.files[0];
    if (!archivo) {
    return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        let texto = event.target.result;
        let jtexto = JSON.parse(texto)
        let listac = new ListaSimple()
        for(let i = 0; i<jtexto.length; i++){
            let dpi = jtexto[i].dpi;
            let nombre = jtexto[i].nombre_completo;
            let username = jtexto[i].nombre_usuario;
            let correo = jtexto[i].correo;
            let contrasenia = jtexto[i].contrasenia;
            let telefono = jtexto[i].telefono;
            let nuevo = new Cliente(dpi,nombre,username,correo,contrasenia,telefono)
            console.log(nuevo)
            listac.insertar(nuevo)
        }
        let list = "["
        let temporal = listac.primero
        while(temporal != null){
            if(temporal.siguiente == null){
                list += JSON.stringify(temporal.cliente) + "]"
                break
            }
            list += JSON.stringify(temporal.cliente) + ","
            temporal = temporal.siguiente
        }
        console.log(list)
        localStorage.setItem("clientes", list)
    });
    reader.readAsText(archivo, "UTF-8");
    alert("Se cargaron los clientes exitosamente")
}

class NodoABB{
    constructor(_actor){
        this.actor = _actor
        this.izquierda = null
        this.derecha = null
    }
}

class ArbolABB{
    constructor(){
        this.raiz =  null
        this.codigodot = ""
        this.mostrar = ""
    }
    insertar(_actor){
        this.raiz = this.Agregar(_actor,this.raiz)
    }
    Agregar(_actor,nodo){
        if(nodo == null){
            return new NodoABB(_actor)
        }else{
            if(_actor.dni < nodo.actor.dni){
                nodo.izquierda = this.Agregar(_actor, nodo.izquierda)
            }else if(_actor.dni > nodo.actor.dni){
                nodo.derecha = this.Agregar(_actor, nodo.derecha)
            }else{
            }
        }
        return nodo
    }
    preordenG(){
        this.pre_ordenG(this.raiz)
    }
    pre_ordenG(nodo){
        if(nodo != null){
            this.codigodot+= "\nnodo" + nodo.actor.dni + "[shape=circle,style=\"filled\",fillcolor=\"#0CA1EB\",fontcolor=\"white\" label=\"Nombre:" + nodo.actor.nombre + "\\nDNI:" + nodo.actor.dni+ "\"];"
            if(nodo.izquierda != null){
                this.codigodot += "\nnodo" + nodo.actor.dni + " -> nodo" + nodo.izquierda.actor.dni + "[headport=n];"
            }
            if(nodo.derecha != null){
                this.codigodot += "\nnodo" + nodo.actor.dni + " -> nodo" + nodo.derecha.actor.dni + "[headport=n];"
            }
            this.pre_ordenG(nodo.izquierda)
            this.pre_ordenG(nodo.derecha)
        }
    }
    graficar(){
        this.codigodot = "digraph G{\nsplines=false;"
        this.preordenG()
        this.codigodot+="\n}"
        console.log(this.codigodot)
        localStorage.setItem("dotactores", this.codigodot)
    }
    inorden(){
        this.in_orden(this.raiz)
    }
    in_orden(nodo){
        if(nodo!= null){
            this.in_orden(nodo.izquierda)
            console.log(nodo.actor.dni)
            this.mostrar+=`
        <li>
            <span>
            <span class="name_user">${nodo.actor.nombre}</span>
            <span class="msg_user"><strong>Correo:</strong> ${nodo.actor.correo}</span><br><br>
            <span class="msg_user"><strong><strong>Descripción: </strong></strong>${nodo.actor.descripcion}</span>
            <span class="time_ago">DNI: ${nodo.actor.dni}</span>
            </span>
        </li>`
            this.in_orden(nodo.derecha)
        }
    }
    postorden(){
        this.post_orden(this.raiz)
    }
    post_orden(nodo){
        if(nodo!= null){
            this.post_orden(nodo.izquierda)
            this.post_orden(nodo.derecha)
            console.log(nodo.actor.dni)
            this.mostrar+=`
        <li>
            <span>
            <span class="name_user">${nodo.actor.nombre}</span>
            <span class="msg_user"><strong>Correo:</strong> ${nodo.actor.correo}</span><br><br>
            <span class="msg_user"><strong><strong>Descripción: </strong></strong>${nodo.actor.descripcion}</span>
            <span class="time_ago">DNI: ${nodo.actor.dni}</span>
            </span>
        </li>`
        }
    }
    preorden(){
        this.pre_orden(this.raiz)
    }
    pre_orden(nodo){
        if(nodo!= null){
            console.log(nodo.actor.dni)
            this.mostrar+=`
        <li>
            <span>
            <span class="name_user">${nodo.actor.nombre}</span>
            <span class="msg_user"><strong>Correo:</strong> ${nodo.actor.correo}</span><br><br>
            <span class="msg_user"><strong><strong>Descripción: </strong></strong>${nodo.actor.descripcion}</span>
            <span class="time_ago">DNI: ${nodo.actor.dni}</span>
            </span>
        </li>`
            this.pre_orden(nodo.izquierda)
            this.pre_orden(nodo.derecha)
        }
    }
}

class Actor{
    constructor(_dni,_nombre,_correo,_descripcion){
        this.dni = _dni
        this.nombre = _nombre
        this.correo = _correo
        this.descripcion = _descripcion
    }
}

function CargaActores(){
    let arbol = new ArbolABB()
    let input_archivo = document.getElementById("file3");
    let archivo = input_archivo.files[0];
    if (!archivo) {
    return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        let texto = event.target.result;
        let jtexto = JSON.parse(texto)
        for(let i = 0; i<jtexto.length; i++){
            let dni = jtexto[i].dni;
            let nombre = jtexto[i].nombre_actor;
            let correo = jtexto[i].correo;
            let descripcion = jtexto[i].descripcion;
            let nuevo = new Actor(dni,nombre,correo,descripcion)
            arbol.insertar(nuevo)
        }
        localStorage.setItem("actores",texto)
    });
    reader.readAsText(archivo, "UTF-8");
    alert("Se cargaron los actores exitosamente")
}

class NodoIdHash{
    constructor(_id){
        this.id = _id
        this.categoria = null
        this.siguiente = null
        this.derecho = null
    }
}
class NodoCategoria{
    constructor(categoria){
        this.categoria = categoria
        this.derecho = null
    }
}

class TablaHash{
    constructor(){
        this.tamanio = 0
        this.cabeza = null
        this.llenos = 0
        this.mostrar = ""
        this.llenadoinicial()
    }
    llenadoinicial(){
        let contador = 0
        while(contador != 20){
            if(this.cabeza == null){
                this.cabeza = new NodoIdHash(contador)
                contador++
            }else{
                let temporal = this.cabeza
                while(temporal != null){
                    if(temporal.siguiente == null){
                        break
                    }
                    temporal = temporal.siguiente
                }
                temporal.siguiente = new NodoIdHash(contador)
                contador++
            }
            this.tamanio++
        }
    }
    insertar(categoria){
        let nuevo = new NodoCategoria(categoria)
        let posicion = categoria.id%this.tamanio
        let temporal = this.cabeza
        let maximo = this.tamanio*0.75
        console.log("LLENOS: " + this.llenos)
        console.log("CAPACIDAD MAX: " + maximo)
        if(this.llenos< maximo){
            while(temporal!= null){
                if(temporal.id == posicion){
                    if(temporal.categoria == null){
                        temporal.categoria = categoria
                        break
                    }else{
                        if(temporal.derecho == null){
                            temporal.derecho = nuevo
                        }else{
                            let tempo2 = temporal.derecho
                            while(tempo2 != null){
                                if(tempo2.categoria.id == nuevo.categoria.id){
                                    break
                                }
                                if(tempo2.derecho == null){
                                    break
                                }
                                tempo2 = tempo2.derecho
                            }
                            if(tempo2.categoria.id != nuevo.categoria.id){
                                tempo2.derecho = nuevo
                            }
                        }
                        break
                    }
                }
                temporal = temporal.siguiente
            }
            this.llenos++
        }else{
            this.rehashing()
            this.insertar(categoria)
        }
    }
    rehashing(){
        let contador = this.tamanio
        let tope = this.tamanio+5
        while(contador != tope){
            let temporal = this.cabeza
            while(temporal != null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            temporal.siguiente = new NodoIdHash(contador)
            contador++
        }
        this.tamanio += 5
    }
    graficar(){
        let codigodot = "digraph G {\nrankdir=LR;\n node [shape=record width = 2.2 fontsize=30];"
        codigodot+= "\nides[style=\"filled\"  fillcolor=\"#3397EB\" label = \""
        let nodos = ""
        let temporal = this.cabeza
        let conexiones = ""
        while(temporal!= null){
            if(temporal.siguiente != null){
                if(temporal.categoria == null){
                    codigodot+= "<id" + temporal.id +"> |"
                    temporal = temporal.siguiente
                }else{
                    codigodot+= "<id" + temporal.id +">" + temporal.categoria.id+ "\\n" + temporal.categoria.company + " |"
                    temporal = temporal.siguiente
                }
            }else{
                if(temporal.categoria == null){
                    codigodot+= "<id" + temporal.id +">"
                    temporal = temporal.siguiente
                }else{
                    codigodot+= "<id" + temporal.id +">" + temporal.categoria.id+ "\\n" + temporal.categoria.company
                    temporal = temporal.siguiente
                }
            }
        }
        codigodot+= "\" height=" + this.tamanio + "];\nnode [shape=box fontsize=30];\n"
        let c = 0
        while(c != this.tamanio){
            codigodot+= "n" + c + "[shape=plain style=filled fillcolor=transparent fontsize=30 label=\"" + c + "\"];\n"
            codigodot+= "n" + c + "->ides:id" + c + "[color=transparent];\n"
            c++
        }
        temporal = this.cabeza
        while(temporal != null){
            if(temporal.derecho != null){
                let tempo2 = temporal.derecho
                while(tempo2 != null){
                    nodos+= "i" + temporal.id + "_" + tempo2.categoria.id + "[style=\"filled\" fontcolor=\"white\"  fillcolor=\"#B373AB\" label=\"ID:" + tempo2.categoria.id +"\\nCompany:"+ tempo2.categoria.company+ "\"];\n"
                    tempo2 = tempo2.derecho
                }
            }
            temporal = temporal.siguiente
        }
        temporal = this.cabeza
        while(temporal != null){
            if(temporal.derecho!= null){
                let tempo2 = temporal.derecho
                conexiones+= "ides:id" + temporal.id + "->" +"i"+ temporal.id + "_" + tempo2.categoria.id + ";\n"
                while(tempo2 != null){
                    if(tempo2.derecho != null){
                        conexiones+="i" +temporal.id + "_" + tempo2.categoria.id + "->" +"i" +temporal.id + "_" + tempo2.derecho.categoria.id + ";\n"
                    }
                    tempo2 = tempo2.derecho
                }
                
            }
            temporal = temporal.siguiente
        }
        codigodot += nodos + conexiones + "\n}"
        console.log(codigodot)
        localStorage.setItem("dothash",codigodot)
    }
    mostrarhtml(){
        let temporal = this.cabeza
        while(temporal != null){
            if(temporal.categoria != null){
                this.mostrar+=`
                <div class="col-sm-6">
                    <div class="card text-center">
                    <div class="card-body">
                        <h1 class="card-title">Categoria ID ${temporal.categoria.id}</h1>
                        <h5 class="card-text">Company: ${temporal.categoria.company}</h5>
                    </div>
                    </div><br>
                </div>`
                if(temporal.derecho != null){
                    let tempo2 = temporal.derecho
                    while(tempo2!= null){
                        this.mostrar+=`
                <div class="col-sm-6">
                    <div class="card text-center">
                    <div class="card-body">
                        <h1 class="card-title">Categoria ID ${temporal.categoria.id}</h1>
                        <h5 class="card-text">Company: ${temporal.categoria.company}</h5>
                    </div>
                    </div>
                </div><br>`
                        tempo2 = tempo2.derecho
                    }
                }
            }
            temporal = temporal.siguiente
        }
    }
}

class Categoria{
    constructor(_id,_company){
        this.id = _id
        this.company = _company
    }
}

function CargaCategorias(){
    let input_archivo = document.getElementById("file4");
    let archivo = input_archivo.files[0];
    if (!archivo) {
    return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        let texto = event.target.result;
        let jtexto = JSON.parse(texto)
        for(let i = 0; i<jtexto.length; i++){
            let id = jtexto[i].id_categoria;
            let company = jtexto[i].company;
            let nuevo = new Categoria(id,company)
            console.log(nuevo)
        }
        localStorage.setItem("categorias",texto)
    });
    reader.readAsText(archivo, "UTF-8");
    alert("Se cargaron las categorias exitosamente")
}

class Comentario{
    constructor(_cliente, _pelicula, _comentario){
        this.id = 0
        this.cliente = _cliente
        this.pelicula = _pelicula
        this.comentario = _comentario
    }
}

class NodoComentario{
    constructor(_comentario){
        this.comentario = _comentario
        this.siguiente = null
    }
}

class ListaComentarios{
    constructor(){
        this.cabeza = null
        this.tamanio = 0
    }
    insertar(_comentario){
        let nuevo = new NodoComentario(_comentario)
        if(this.cabeza == null){
            nuevo.comentario.id = 0
            this.cabeza = nuevo
            this.tamanio++
        }else{
            let temporal = this.cabeza
            while(temporal!= null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            nuevo.comentario.id = temporal.comentario.id +1
            temporal.siguiente = nuevo
            this.tamanio++
        }
    }
    obtenercomentario(_id,_pelicula){
        let temporal = this.cabeza
        while(temporal != null){
            if(temporal.comentario.id == _id && temporal.comentario.pelicula == _pelicula){
                return temporal.comentario
            }
            temporal = temporal.siguiente
        }
        return null
    }
}

class NodoCadena{
    constructor(cadena){
        this.cadena = cadena
    }
}
class NodoMerkle{
    constructor(hash){
        this.hash = hash
        this.izquierda = null
        this.derecha = null
    }
}
var index = 0
var contg = 0
class ArbolMerkle{
    constructor(){
        this.tophash = null
        this.iniciales = new Lista()
        this.codigodot = ""
    }
    insertar(cadena){
        this.iniciales.append(new NodoCadena(cadena))
    }

    crearArbol(exp){
        this.tophash = new NodoMerkle(0)
        this.crear_arbol(this.tophash, exp)
    }

    crear_arbol(nodo, exp){
        if(exp > 0){
            nodo.izquierda = new NodoMerkle(0)
            nodo.derecha = new NodoMerkle(0)
            this.crear_arbol(nodo.izquierda, exp-1)
            this.crear_arbol(nodo.derecha, exp -1)
        }
    }
    generarhash(nodo, n){
        if(nodo != null){
            this.generarhash(nodo.izquierda, n)
            this.generarhash(nodo.derecha, n)

            if(nodo.izquierda == null && nodo.derecha == null){
                nodo.izquierda = this.iniciales.returndata(n-index--)
                nodo.hash = Sha256.hash(String(nodo.izquierda.cadena))
            }else{
                nodo.hash = Sha256.hash(String(nodo.izquierda.hash)+ String(nodo.derecha.hash))
            }
        }
    }

    preorden(){
        this.pre_orden(this.tophash)
    }
    pre_orden(nodo){
        if(nodo!= null){
            if(nodo instanceof NodoCadena){
                console.log("Cadena: "+nodo.cadena)
            }else{
                console.log("Hash: "+nodo.hash)
            }
            this.pre_orden(nodo.izquierda)
            this.pre_orden(nodo.derecha)
        }
    }
    auth(){
        let exp = 1
        while(Math.pow(2,exp) < this.iniciales.length()){
            exp++
        }
        if(this.iniciales.length()%2== 1){
            for(let i = this.iniciales.length(); i < Math.pow(2,exp); i++){
                this.iniciales.append(new NodoCadena(this.iniciales.returndata(this.iniciales.length()-1).cadena))
            }
        }else{
            for(let i = this.iniciales.length(); i < Math.pow(2,exp); i++){
                this.iniciales.append(new NodoCadena(this.iniciales.returndata(this.iniciales.length()-2).cadena))
            }
        }
        index = Math.pow(2,exp)
        this.crearArbol(exp)
        this.generarhash(this.tophash, Math.pow(2, exp))
        this.preorden()
    }
    preordenG(){
        this.pre_ordenG(this.tophash,1)
    }
    pre_ordenG(nodo, num){
        if(nodo != null){
            if(nodo.izquierda instanceof NodoCadena){
                this.codigodot+="\nnodo"+ num + "_" + nodo.hash + "[shape=box,style=\"filled\",fillcolor=\"#7918A4\",fontcolor=\"white\" label=\"Hash:" + nodo.hash + "\"];"
                this.codigodot+= "\nnodo" + num + "_" + "[shape=box,style=\"filled\",fillcolor=\"#7918A4\",fontcolor=\"white\" label=\"Cadena:" + nodo.izquierda.cadena + "\"];"
                this.codigodot += "\nnodo"+ num + "_" + nodo.hash + " -> nodo" + num + "_" + "[headport=n][dir=back];"
            }else{
                if(nodo.izquierda != null){
                    this.codigodot+= "\nnodo" + num + "_" + nodo.hash + "[shape=box,style=\"filled\",fillcolor=\"#7918A4\",fontcolor=\"white\" label=\"Hash:" + nodo.hash + "\"];"
                    this.codigodot += "\nnodo"+ num + "_" + nodo.hash + " -> nodo" +(2*num)+"_"+ nodo.izquierda.hash + "[headport=n][dir=back];"
                }
                if(nodo.derecha != null){
                    this.codigodot+= "\nnodo" + num + "_" + nodo.hash + "[shape=box,style=\"filled\",fillcolor=\"#7918A4\",fontcolor=\"white\" label=\"Hash:" + nodo.hash + "\"];"
                    this.codigodot += "\nnodo" + num + "_" + nodo.hash + " -> nodo" +((2*num)+1)+"_"+ nodo.derecha.hash + "[headport=n][dir=back];"
                }
            }
            let numi = 2*num
            let numd = (2*num)+1
            this.pre_ordenG(nodo.izquierda, numi)
            this.pre_ordenG(nodo.derecha, numd)
        }
    }
    graficar(){
        this.codigodot = "digraph G{\nsplines=false;"
        this.preordenG()
        this.codigodot+="\n}"
        console.log(this.codigodot)
    }
}
class NodoData{
    constructor(_data){
        this.id = 0
        this.data = _data
        this.siguiente = null
    }
}
class Lista{
    constructor(){
        this.primero = null
        this.tamanio = 0
    }
    append(_data){
        let nuevo = new NodoData(_data)
        if(this.primero == null){
            this.primero = nuevo
        }else{
            let temporal = this.primero
            while(temporal!= null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            nuevo.id = temporal.id +1
            temporal.siguiente = nuevo
        }
        this.tamanio++
    }
    returndata(_id){
        let temporal = this.primero
        while(temporal!= null){
            if(temporal.id == _id){
                return temporal.data
            }
            temporal = temporal.siguiente
        }
        return null
    }
    length(){
        return this.tamanio
    }
}

class Cadena_t{
    constructor(_cadena){
        this.cadena = _cadena
    }
}
class nodo_c{
    constructor(cadena){
        this.cadena = cadena
        this.siguiente = null
    }
}
class ListaCad{
    constructor(){
        this.primero = null
    }
    insertar(_cadena){
        let nuevo = new nodo_c(_cadena)
        if(this.primero == null){
            this.primero = nuevo
        }else{
            let temporal = this.primero
            while(temporal!= null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            temporal.siguiente = nuevo
        }
    }
}
class Bloque{
    constructor(_index,_timestap,_data,_nonce,_rootmerkle,_hash){
        this.index = _index
        this.timestap = _timestap
        this.data = _data
        this.nonce = _nonce
        this.previoushash = "00"
        this.rootmerkle = _rootmerkle
        this.hash = _hash
    }
}
class NodoBloque{
    constructor(_bloque){
        this.bloque = _bloque
        this.siguiente = null
    }
}

class Blockchain{
    constructor(){
        this.bloque_genesis = null
    }
    agregar(_bloque){
        let nuevo = new NodoBloque(_bloque)
        if(this.bloque_genesis== null){
            this.bloque_genesis= nuevo
            console.log("A")
        }else{
            console.log("B")
            let temporal = this.bloque_genesis
            while(temporal!= null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            console.log("nuevo")
            console.log(nuevo)
            nuevo.bloque.previoushash = temporal.bloque.hash
            temporal.siguiente = nuevo
        }
    }
    graficar(){
        let codigodot = `digraph List {
            rankdir=LR;
            node [shape = note, style=filled, fillcolor="#4C4A4A", penwidth=2.5, fontcolor=white];`
        let temporal = this.bloque_genesis
        console.log("temp")
        console.log(temporal)
        let contador = 0
        while(temporal != null){
            codigodot+= "\nnodo" + contador + "[label=\"Bloque " + contador + "\\n Hash: " + temporal.bloque.hash +"\\nNonce: " + temporal.bloque.nonce+ "\\n Previous Hash: " + temporal.bloque.previoushash + "\\n Root Merkle: " + temporal.bloque.rootmerkle + "\\n Transacciones: " + temporal.bloque.data + "\\nFecha: " + temporal.bloque.timestap + "\", fontsize=30];"
            temporal = temporal.siguiente
            console.log(temporal)
            contador++
        }
        contador = 0
        temporal = this.bloque_genesis
        while(temporal!= null){
            if(temporal.siguiente!= null){
                let aux = contador+1
                codigodot+= "\nnodo" + contador + " -> nodo" + aux
            }
            temporal = temporal.siguiente
            contador++
        }
        codigodot+="\n}"
        console.log(codigodot)
        localStorage.setItem("dot_blockchain",codigodot)
    }
}