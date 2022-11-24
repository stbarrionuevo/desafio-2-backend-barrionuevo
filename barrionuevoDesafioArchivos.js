// >> Consigna: Implementar programa que contenga una clase llamada Contenedor que reciba el nombre del archivo con el que va a trabajar e implemente los siguientes métodos:

// save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
// getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
// getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
// deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
// deleteAll(): void - Elimina todos los objetos presentes en el archivo.

// >> Aspectos a incluir en el entregable: 
// El método save incorporará al producto un id numérico, que deberá ser siempre uno más que el id del último objeto agregado (o id 1 si es el primer objeto que se agrega) y no puede estar repetido.
// Tomar en consideración el contenido previo del archivo, en caso de utilizar uno existente.
// Implementar el manejo de archivos con el módulo fs de node.js, utilizando promesas con async/await y manejo de errores.
// Probar el módulo creando un contenedor de products, que se guarde en el archivo: “products.txt”
// Incluir un llamado de prueba a cada método, y mostrando por pantalla según corresponda para verificar el correcto funcionamiento del módulo construído. 
// El formato de cada producto será : {
//     title: (nombre del producto),
//     price: (precio),
//     thumbnail: (url de la foto del producto)
// }

const fs = require ('fs')

class Container {

  constructor( file ) {
      this.file = file
  }

  async getAll() {
    try{
      const objects = await fs.promises.readFile( this.file, 'utf-8')
      return JSON.parse(objects)

    } catch(err) {
        console.error({err})
    }
  }
 
  async saveFile ( file, objects ) {
    try {
      await fs.promises.writeFile(
        file, JSON.stringify( objects, null, 2 )
        )
    } catch(err) {
        console.error({err})
    }
  }

  async save( object ) {
    const objects = await this.getAll()
    try{
        let newId
        objects.length === 0 
          ? newId = 1
          : newId = objects[ objects.length - 1 ].id + 1
        
        const objectNew = { id: newId, ...object }       
        objects.push(objectNew)        
        await this.saveFile(this.file, objects)
        return `The new ID is: ${newId}`

    } catch(err) {
        console.error({err})
    }
  }


  async getById( id ) {
    const objects = await this.getAll()
    try {
      const object = objects.find( ele => ele.id === id)
      return object 
      ? object 
      : null

    } catch(err) {
        console.error({err})
    }
  }


  async deleteById( id ) {
    let objects = await this.getAll()
    
    try {
      objects = objects.filter( ele => ele.id != id )
      await this.saveFile( this.file, objects)
    
    } catch(err) {
      console.error({err})
    }
  }


  async deleteAll() {
    await this.saveFile(this.file, [])
  }

}



const products = new Container('products.txt')

const startMethods = async() => {
  try {
    
    
    let arr = await products.getAll()
    console.log(arr)


    await products.save(
      { "title": "random-product",
        "price": Math.trunc(Math.random()*5000 + 1000),
        "thumbnail": "www.random-url.com"
      }
    )
    arr = await products.getAll()
    console.log(arr)


    
    let idResp = await products.getById(1)
    console.log(idResp)
    idResp = await products.getById(2)
    console.log(idResp)

    
    
    await products.deleteById(2)
    arr = await products.getAll()
    console.log(arr)


    
    
    await products.deleteAll()
    arr = await products.getAll()
    console.log(arr)


  } catch(err) {
    console.error(err)
  }
}




startMethods()
