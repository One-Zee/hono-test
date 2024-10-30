import type { z } from 'zod'
import type { UserZodSchemaZod } from '../validations/user.schema'
import { model, Schema } from 'mongoose'

// For TypeScript type inference
export type UserZodType = z.infer<typeof UserZodSchemaZod>

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<UserZodType>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true })

// 3. Create a Model.
const UserModel = model<UserZodType>('User', UserSchema)

export default UserModel
