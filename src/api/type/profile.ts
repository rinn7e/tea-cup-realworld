import * as t from 'io-ts'

export type Profile = {
  username: string
  bio?: string | null
  image: string | null
  following: boolean
}

export const ProfileJson: t.Type<Profile> = t.intersection([
  t.type({
    username: t.string,
    image: t.union([t.string, t.null]),
    following: t.boolean,
  }),
  t.partial({
    bio: t.union([t.string, t.null]),
  }),
])

export type ProfileResponse = {
  profile: Profile
}

export const ProfileResponseJson: t.Type<ProfileResponse> = t.type({
  profile: ProfileJson,
})
