import type { Option } from 'fp-ts/lib/Option'

import type { User } from '@/common/api/type'

export type Shared = {
  user: Option<User>
  token: Option<string>
}
