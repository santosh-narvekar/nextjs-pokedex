import useSWR from "swr";
import * as PokemonApi from '@/network/pokemon-api'
import { AxiosError } from "axios";

export default function usePokemon(name:string) {
  // SWR
  const { data  , isLoading, mutate } = useSWR(name,async()=>{
    // TRY-CATCH-BLOCK
    try{
      return await PokemonApi.getPokemon(name);
    }catch(error){
      // request succeedeed with no data
      if(error instanceof AxiosError && error.response?.status === 404) {
        return null
      }else{
        throw error;
      }
    }
  });



  return {
    pokemon:data,
    pokemonLoading:isLoading,
    mutatePokemon:mutate
  }
}