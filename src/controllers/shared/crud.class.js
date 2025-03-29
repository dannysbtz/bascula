 class GenericModel {
    constructor(model,dtoClass) {
      this.model = model;
      this.dtoClass = dtoClass;
    }
    index(){
      return "Ok";
  }
    async getAll(req) {
      try {
        const result = await this.model.find().sort({ nombre: 1 }).lean()
        return { status: 200, data: result };

      } catch (error) {
        return { status: 500, error: 'Error interno del servidor' };
      }
    }
   
    getById(id,req) {
      if(!req.session){
        return { status: 401, error: 'Session invalida' }
      }
      return this.model.findByPk(id);
    }
    
   async create(data,req) {
    try {
      const dto = new this.dtoClass(data);
      const valid = await dto.createValid()

      if (valid) {
        return { status: 400, error: valid};
      }

        const result = await this.model.create(dto);
        return { status: 200, data: result };
      } catch (error) {
        console.error('Error al crear:', error);
        return { status: 500, error: 'Error interno del servidor' };
      }
    }
   
    async update(req) {
      try {
        const dto = new this.dtoClass(req.body);
        const valid = await dto.createValid()

        if(valid){
          return { status: 400, error: valid};
        }
        const result = await this.model.findByIdAndUpdate(req.params.id, dto, {new: true});
         return { status: 200, data: result };
      } catch (error) {
        return { status: 500, error: 'Error interno del servidor' };
      }
    }
   
    async delete(id,req) {
      try{
        await this.model.findByIdAndDelete({ _id: id });
        return { status: 200, data: 'OK' };
      } catch (error) {
        return { status: 500, error: 'Error interno del servidor' };
      }
    }
   }
   
   module.exports = GenericModel;