// import { Type } from 'class-transformer';
// import {
//   IsArray,
//   IsNotEmpty,
//   IsOptional,
//   ValidateNested,
// } from 'class-validator';
// import { CreateTextContentDto } from 'src/modules/text-content/dto/create-text-content.dto';
// import { SecondCreateTranslationDto } from 'src/modules/translation/dto/create-translation.dto';

// export class TaxDto {
//   @ValidateNested({ each: true })
//   @Type(() => SecondCreateTranslationDto)
//   @IsOptional()
//   @IsArray()
//   readonly translation: SecondCreateTranslationDto[];
// }
