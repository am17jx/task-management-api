const AppError=require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");





exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(204).json({
        status: 'success',
        data: null
      });
    });
  

    exports.updateOne = Model =>
        catchAsync(async(req,res,next)=>{
            const doc = await Model.findByIdAndUpdate(req.params.id,req.body,{
                new: true,
                runValidators: true 
            })

        
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
    });

    exports.createOne = Model =>
        catchAsync(async (req, res, next) => {
          const doc = await Model.create(req.body);
      
          res.status(201).json({
            status: 'success',
            data: {
              data: doc
            }
          });
        }); 
        
        exports.getOne = (Model, popOptions) =>
          catchAsync(async (req, res, next) => {
            let query = Model.findById(req.params.id); // <-- السطر الأهم
            if (popOptions) query = query.populate(popOptions);
            const doc = await query;
        
            if (!doc) {
              return next(new AppError('No document found with that ID', 404));
            }
        
            res.status(200).json({
              status: 'success',
              data: {
                data: doc
              }
            });
          });

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
      let filter = {};
      if (req.filter) filter = req.filter; // تعديل هنا
  
      const doc = await Model.find(filter);
  
      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc
        }
      });
    });