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
    }
    insertar(_pelicula){
        this.raiz = this.insertarrecursivo(_pelicula,this.raiz)
    }
    insertarrecursivo(pelicula,nodo){
        if(nodo == null){
            return new NodoAVL(pelicula)
        }else{
            if(pelicula.id < nodo.pelicula.id){
                nodo.izquierda = this.insertarrecursivo(pelicula, nodo.izquierda)
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda) == -2){
                    if(pelicula.id< nodo.izquierda.pelicula.id){
                        nodo = this.rotacionizquierda(nodo)
                    }else{
                        nodo = this.rotaciondobleizquierda(nodo)
                    }
                }
            }else if(pelicula.id > nodo.pelicula.id){
                nodo.derecha = this.insertarrecursivo(pelicula, nodo.derecha)
                if(this.altura(nodo.derecha)-this.altura(nodo.izquierda)==2){
                    if(pelicula.id > nodo.derecha.pelicula.id){
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
            this.codigodot+= "\nnodo" + nodo.pelicula.id + "[shape=circle,style=\"filled\",fillcolor=\"#0CA1EB\",fontcolor=\"white\" label=\"Pelicula:" + nodo.pelicula.nombre + "\\nID:" + nodo.pelicula.id+ "\"];"
            if(nodo.izquierda != null){
                this.codigodot += "\nnodo" + nodo.pelicula.id + " -> nodo" + nodo.izquierda.pelicula.id + "[headport=n];"
            }
            if(nodo.derecha != null){
                this.codigodot += "\nnodo" + nodo.pelicula.id + " -> nodo" + nodo.derecha.pelicula.id + "[headport=n];"
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
}

class Pelicula{
    constructor(_id,_nombre,_descripcion,_puntuacion,_precio){
        this.id = _id
        this.nombre = _nombre
        this.descripcion = _descripcion
        this.puntuacion = _puntuacion
        this.precio = _precio
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