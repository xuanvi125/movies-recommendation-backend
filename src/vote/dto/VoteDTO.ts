import { IsInt, IsNotEmpty, Max, Min, MinLength } from 'class-validator';

export class VoteDTO {
  @IsNotEmpty({ message: 'Movie ID is required' })
  @MinLength(1, { message: 'Movie ID must be at least 1 character long' })
  movieId: string;

  @IsNotEmpty({ message: 'Vote is required' })
  @IsInt({ message: 'Vote must be an integer' })
  @Min(1, { message: 'Vote must be at least 1' })
  @Max(10, { message: 'Vote must be at most 10' })
  vote: number;
}