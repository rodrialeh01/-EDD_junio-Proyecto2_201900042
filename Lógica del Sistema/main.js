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
        localStorage.setItem("peliculas",jtexto)
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
            this.primero = _cliente
        }else{
            let temporal = this.primero
            while(temporal != null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            temporal.siguiente = _cliente
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
        for(let i = 0; i<jtexto.length; i++){
            let dpi = jtexto[i].dpi;
            let nombre = jtexto[i].nombre_completo;
            let username = jtexto[i].nombre_usuario;
            let correo = jtexto[i].correo;
            let contrasenia = jtexto[i].contrasenia;
            let telefono = jtexto[i].telefono;
            let nuevo = new Cliente(dpi,nombre,username,correo,contrasenia,telefono)
            console.log(nuevo)
        }
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
    }
    insertar(_actor){
        this.raiz = this.Agregar(_actor,this.raiz)
    }
    Agregar(_actor,nodo){
        if(nodo == null){
            return new NodoABB(_actor)
        }else{
            if(_actor.dni < nodo.autor.dni){
                nodo.izquierda = this.Agregar(_actor, nodo.izquierda)
            }else if(_actor.dni > nodo.actor.dni){
                nodo.derecha = this.Agregar(_actor, nodo.derecha)
            }else{
            }
        }
        return nodo
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
            console.log(nuevo)
        }
    });
    reader.readAsText(archivo, "UTF-8");
    alert("Se cargaron los actores exitosamente")
}

class NodoHash{
    constructor(_id,_categorias){
        this.id = _id
        this.categorias = _categorias
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
    });
    reader.readAsText(archivo, "UTF-8");
    alert("Se cargaron las categorias exitosamente")
}