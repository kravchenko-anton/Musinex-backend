import { ArrayMinSize, IsArray, IsNumber } from "class-validator";

export class CreateHistoryDto {
  @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
  @IsNumber()
  @ArrayMinSize(1)
  songsId: number[];
}
