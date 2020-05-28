import { UserDto as IUserDto} from '../../../shared/UserDto';
import { User } from './../app/models/User';

export interface UserDto extends IUserDto {}

export namespace UserDto {
    export const unmarshal =  (dto: IUserDto): User => new User(dto._id, dto.name, dto.pictureUrl);
}

