import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController=async(req,res) => {

    try{
        const {name}=req.body
        if(!name){
            return res.status(401).send({ message: "Name is required" });
        }
        const existingCategory=await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: false,
                message: "Category Already Exisits",
              });
        }

        const category =await categoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: "new category created",
            category,
          });
      

    }catch(err){
        console.log(err);
    res.status(500).send({
      success: false,
      err,
      message: "Errro in Category",
    });

    }

}
export const updateCategoryController=async (req,res) => {
    try{
    const {name}=req.body
    const {id}=req.params

    const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    res.status(200).send({
        success: true,
        messsage: "Category Updated Successfully",
        category,
      });
    }catch(err){

        console.log(err);
        res.status(500).send({
          success: false,
          err,
          message: "Error while updating category",
        });
    }

}

export const categoryController=async(req,res) => {
    try{

        const category=await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "All Categories List",
            category,
          });
    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error while getting all categories",
        });

    }

}

export const singleCategoryController=async (req,res) => {
    try{
       let {slug}=req.params
       const category =await categoryModel.findOne({slug})
       res.status(200).send({
        success: true,
        message: "Get SIngle Category SUccessfully",
        category,
      });

    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error While getting Single Category",
        });

    }
}

export const deleteCategoryController = async (req, res) => {
    try {
      const { id } = req.params;
      await categoryModel.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Categry Deleted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "error while deleting category",
        error,
      });
    }
  };