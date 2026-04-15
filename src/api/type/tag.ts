import * as t from 'io-ts'

export type TagsResponse = {
  tags: string[]
}

export const TagsResponseJson: t.Type<TagsResponse> = t.type({
  tags: t.array(t.string),
})
