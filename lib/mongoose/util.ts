import { Types } from 'mongoose';

export function checkObject_Id(id: string): boolean {
    return Types.ObjectId.isValid(id);
}