import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document{
    email: string;
    password: string;
    comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true //sin espacios
    },
    password: {
        type: String,
        required: true
    }
});

// cifrado
// cunado decimos pre esta funcion se va a ejecutar antes en la peticion
userSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10); //cuantas veces va a encriptar
    const hash = await bcrypt.hash(user.password, salt); //contraseña cifrada
    user.password = hash;
    next();//el next continua con el codigo es como el return 
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

export default model<IUser>('User', userSchema);
