import * as t from 'io-ts'

export type User = {
  email: string
  token: string
  username: string
  bio: string | null
  image: string | null
}

export const UserJson: t.Type<User> = t.type({
  email: t.string,
  token: t.string,
  username: t.string,
  bio: t.union([t.string, t.null]),
  image: t.union([t.string, t.null]),
})

export type UserResponse = {
  user: User
}

export const UserResponseJson: t.Type<UserResponse> = t.type({
  user: UserJson,
})

export type LoginRequest = {
  user: {
    email: string
    password: string
  }
}

export type RegisterRequest = {
  user: {
    username: string
    email: string
    password: string
  }
}

export type UpdateUserRequest = {
  user: {
    email?: string
    username?: string
    bio?: string
    image?: string
    password?: string
  }
}
