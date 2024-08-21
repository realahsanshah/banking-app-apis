import { ApiProperty } from '@nestjs/swagger';

export class responseData<T> {
  @ApiProperty()
  success: boolean = true;
  @ApiProperty()
  message: string | string[] = '';
  @ApiProperty()
  exception: any = '';
  @ApiProperty()
  data: T = null;
  constructor(data) {
    this.data = data;
  }
}
