import { Decode, Decoder } from 'tea-cup-fp'

export type Author = {
  username: string
  bio: string
  image: string
  following: boolean
}

export const authorDecoder: Decoder<Author> = Decode.map4(
  (username: string, bio: string, image: string, following: boolean) => ({
    username,
    bio,
    image,
    following,
  }),
  Decode.field('username', Decode.str),
  Decode.field('bio', Decode.str),
  Decode.field('image', Decode.str),
  Decode.field('following', Decode.bool),
)
