'use server'

import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

import { UserInformation } from '@/payload-types'
import { failure, success, Result } from '@/lib/result'
import { UserInformationsNotFoundError } from '@/core/user/errors'
import { unstable_cache } from 'next/cache'
import { TIME } from '@/lib/time'


type UserInformationSelect = {
  [K in keyof UserInformation]?: true
};



const getCachedAllUserInformations = (userId: string) =>
  unstable_cache(async () => {
    const payload = await getPayload({ config })

    const userInformations = await payload.find({
      collection: 'user-informations',
      where: { userId: { equals: userId } },
    })

    const NO_INFORMATIONS_FOUND = userInformations.docs.length === 0
    if (NO_INFORMATIONS_FOUND) {
      return failure(
        new UserInformationsNotFoundError(`User informations for ID: ${userId} cannot be found.`),
      )
    }

    return success(userInformations.docs[0])
  },
  [`user-informations-${userId}`],
  { revalidate: TIME.ONE_DAY}
)

export const getAllUserInformations = async (
  userId: string,
): Promise<Result<UserInformation, UserInformationsNotFoundError>> => {
  return await getCachedAllUserInformations(userId)()
}


const getCachedLimitedUserInformations = (
  userId: string,
  select: UserInformationSelect,
) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config });

      const userInformations = await payload.find({
        collection: 'user-informations',
        where: { userId: { equals: userId } },
        select: select,
      });

      const NO_INFORMATIONS_FOUND = userInformations.docs.length === 0;
      if (NO_INFORMATIONS_FOUND) {
        return failure(
          new UserInformationsNotFoundError(
            `User informations for ID: ${userId} cannot be found.`
          )
        );
      }

      return success(userInformations.docs[0] as Partial<UserInformation>);
    },
    [`user-informations-${userId}-${JSON.stringify(select)}`],
    { revalidate: TIME.ONE_DAY }
  );

  
export const getLimitedUserInformations = async (
  userId: string,
  select: UserInformationSelect,
): Promise<Result<Partial<UserInformation>, UserInformationsNotFoundError>> => {
  return await getCachedLimitedUserInformations(userId, select)();
};