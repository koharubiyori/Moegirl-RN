import { useRoute } from '@react-navigation/native'

export interface AdditionalProperty<Params> {
  key: string
  name: string
  params: Params
}

export default function useMyRoute<Params extends object>() {
  return useRoute<AdditionalProperty<Params>>()
}