import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import userValidationSchema from './user.validation';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const zodValidateData = userValidationSchema.parse(data);
    const result = await UserServices.createUserInDB(zodValidateData);
    const { password, orders, _id, isDeleted, __v, ...rest } =
      result.toObject();

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: rest,
    });
  } catch (error: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // for catch unique property related error
      next(
        new Error(
          `${Object.getOwnPropertyNames(error.keyPattern)[0]} must be unique`,
        ),
      );
    } else if (error.name === 'ZodError') {
      res.json({
        success: false,
        message: error.issues[0].message,
        error: {
          code: 500,
          description: error.name,
          errorField: error.issues[0].path[0],
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'There was an error',
        error: {
          code: 500,
          description: error.name,
        },
      });
    }
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getUsersFromDB();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    });
  } catch (error: any) {
    res.json({
      success: false,
      message: error.message || 'There was an error',
      error: {
        code: 500,
        description: error.name,
      },
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserServices.getSingleUserFromDB(userId);
    if (result) {
      const { password, orders, _id, isDeleted, __v, ...rest } =
        result.toObject();
      res.status(200).json({
        success: true,
        message: 'User fetched successfully!',
        data: rest,
      });
    }
  } catch (error: any) {
    if (error.stringValue == '"NaN"') {
      res.json({
        success: false,
        message: 'User Id must be number',
        error: {
          code: 500,
          description: error.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: error.stringValue,
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }
  }
};

const updateSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserServices.updateSingleUserFromDB(userId, req.body);
    if (result) {
      const { password, orders, _id, isDeleted, __v, ...rest } =
        result.toObject();
      res.status(200).json({
        success: true,
        message: 'User updated successfully!',
        data: rest,
      });
    }
  } catch (error: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // for catch unique property related error
      res.json({
        success: false,
        message: `Given ${
          Object.getOwnPropertyNames(error.keyPattern)[0]
        } already exists, give unique.`,
        error: {
          code: 500,
          description: error.name,
        },
      });
    } else if (error.stringValue == '"NaN"') {
      res.json({
        success: false,
        message: 'User Id must be number',
        error: {
          code: 500,
          description: error.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }
  }
};

const deleteSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserServices.deleteSingleUserFromDB(userId);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: result,
    });
  } catch (error: any) {
    if (error.stringValue == '"NaN"') {
      res.json({
        success: false,
        message: 'User Id must be number',
        error: {
          code: 500,
          description: error.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }
  }
};

const orderAdd = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserServices.orderAddIntoDB(userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  } catch (error: any) {
    if (error.stringValue == '"NaN"') {
      res.json({
        success: false,
        message: 'User Id must be number',
        error: {
          code: 500,
          description: error.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }
  }
};

const getAllOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserServices.getSingleUserFromDB(userId);

    if (result) {
      const { orders, ...rest } = result.toObject();
      res.status(200).json({
        success: true,
        message: 'Order fetched successfully!',
        data: { orders: orders },
      });
    }
  } catch (error: any) {
    if (error.stringValue == '"NaN"') {
      res.json({
        success: false,
        message: 'User Id must be number',
        error: {
          code: 500,
          description: error.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }
  }
};

const totalOrderPrice = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserServices.getSingleUserFromDB(userId);

    if (result) {
      // Calculate total price
      const totalPrice = result?.orders?.reduce((sum, order) => {
        return sum + Number(order.price) * Number(order.quantity);
      }, 0);

      res.status(200).json({
        success: true,
        message: 'Order fetched successfully!',
        data: { totalPrice: totalPrice },
      });
    }
  } catch (error: any) {
    if (error.stringValue == '"NaN"') {
      res.json({
        success: false,
        message: 'User Id must be number',
        error: {
          code: 500,
          description: error.name,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      });
    }
  }
};

export const UserController = {
  createUser,
  getUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  orderAdd,
  getAllOrder,
  totalOrderPrice,
};
