import { comparePassword, hashPassword } from "../helper/authHelper.js"
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import JWT from "jsonwebtoken";
export const registerController=async(req,res) => {
    try{
        const {name,email,password,phone,address,answer}=req.body
        if(!name){
            return res.send({
                message:"Name is Required"
            })
        }
        if(!email){
            return res.send({
                message:"Email is Required"
            })
        }
        if(!password){
            return res.send({
                message:"password is Required"
            })

        }
        if(!phone){
            return res.send({
                message:"Phone is Required"
            })
        }
        if(!address){
            return res.send({
                message:"Phone is Required"
            })
        }
        if(!answer){
            return res.send({
                message:"Answer is Required"
            })
        }
        
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:"Already Registered Please login"
            })
        }
        const hashedPassword=await hashPassword(password)
        const user=await new userModel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
            answer
        }).save()

         res.status(201).send({
            success:true,
            "message":"User Registered Sucuessfully",
            user
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Errro in Registeration",
          error,
        });
    }
}


export const loginController=async (req,res) => {
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invlalid email or password"
            })
        }

        const user=await userModel.findOne({
            email
        })
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registered"
            })

            
        }

        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }

        const token=await JWT.sign({
            _id:user._id
        },process.env.JWT_SECRET)

        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              role: user.role,
            },
            token,
          });




    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error in login",
          error,
        });
      

    }
}


export const testController =async(req,res) => {
    try{

         res.send({

            "message":"Protected Route"
        })

    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Errro in test",
          error,
        });
    }
}

export const forgotPasswordController= async (req,res) => {
    try{
    const {email,answer,newPassword}=req.body
    if(!email){
        return res.send({
            message:"Email is Required"
        })
    }
    if(!answer){
        return res.send({
            message:"answer is Required"
        })
    }
    if(!newPassword){
        return res.send({
            message:"password is required"
        })
    }

    const user=await userModel.findOne({email,answer})
    if(!user){
        res.status(404).send({
            success:false,
            message:"wrong email or answer"
        })

    }
    const hashed=await hashPassword(newPassword)
    await userModel.updateOne({email},{password:hashed})
    res.status(200).send({
        success:true,
        message:"updated successfully"
    })
    
}catch(err){
    console.log(err);
        res.status(500).send({
          success: false,
          message: "Errro in changing password",
          err,
        });

}
}

export const updateProfileController=async(req,res) => {
    try{
        const {name,email,password,address,phone}=req.body
        const user=await userModel.findById(req.user._id);

        if (password && password.length < 2) {
            return res.json({ error: "Passsword is required and more than 2 character long" });
          }
        const hashedPassword=password ? await hashPassword(password) : undefined

        const updatedUser=await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
          },{new:true})

          res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
          });

    }catch(error){

    }
}

export const getOrdersController=async(req,res) => {

    try{
        const orders=await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders);

    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error WHile Geting Orders",
          error,
        });

    }
}

export const getAllOrdersController=async(req,res) => {
    try {
        const orders = await orderModel
          .find({})
          .populate("products", "-photo")
          .populate("buyer", "name")
          .sort({createdAt:-1})
        res.json(orders);
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error WHile Geting Orders",
          error,
        });
      }
}

export const orderStatusController=async(req,res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
        );
        res.json(orders);
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error While Updateing Order",
          error,
        });
      }
    
}
