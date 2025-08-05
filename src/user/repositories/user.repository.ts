import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UserModel } from "../models/user.model";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor (
    @InjectModel(User.name) 
    private userModel: Model<UserDocument>
  ) {}
  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await this.userModel.findOne({ email: email }).exec()
    return user ? this.convertToModel(user) : null;
  }
  
  async create(user: UserModel): Promise<UserModel | null> {
    const new_user = new this.userModel({
      email: user.email,
      password: user.password,
    });
    await new_user.save();
    return new_user ? this.convertToModel(new_user) : null;
  }

  private convertToModel(userDocument: UserDocument): UserModel {
    return new UserModel({
      id: userDocument._id.toString(),
      email: userDocument.email,
      password: userDocument.password,
      createdAt: userDocument.createdAt
    })
  }
}