import { IsInt, IsNotEmpty } from 'class-validator';
import { IsInEnum } from 'src/common/validators/is-in-enum.validator';
import { Actions } from '../constants/actions';

export class CreatePermissionDto {
  @IsNotEmpty()
  name: string;

  @IsInEnum(Actions)
  action: Actions;

  @IsInt()
  resourceId: number;
}
