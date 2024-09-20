import { useRouter } from 'next/router'
import * as PokemonApi from '@/network/pokemon-api'
import Head from 'next/head';
import Link from 'next/link';
import { Button, Form, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import usePokemon from '@/hooks/usePokemon';
import { FormEvent } from 'react';

function PokemonDetailsPage() {
  const router = useRouter();
  const pokemonName = router.query.pokemon?.toString() || "";

  // SWR NEW CHANGE FOR VERSION 5

  //const { data : pokemon , isLoading:pokemonLoading } = useSWR(pokemonName,PokemonApi.getPokemon);

  const {pokemon,pokemonLoading,mutatePokemon} = usePokemon(pokemonName)

  // faking data mutation and updating it in local cache
  async function handleSubmit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nickname = formData.get(`nickname`)?.toString().trim();

    if(!pokemon || !nickname ) return;

    const update = await PokemonApi.setNickName(pokemon,nickname);
    mutatePokemon(update,{revalidate:false});
  }

  return (
    <>
      <Head>
         {pokemon && <title>{`${pokemon.name} - NextJs PokeDex`}</title>}  
      </Head> 

      <div className='d-flex flex-column align-items-center'> 
        <p>
          <Link href={"/"} className='link-light'>
            Pokedex
          </Link>
        </p>
        {pokemonLoading && <Spinner animation='grow'/>}
        
        {pokemon === null && <p>Pokemon not found</p>}

        {pokemon && 
          <>
            <h1 className='text-center text-capitalize'>{pokemon.name}</h1>
            <Image
                src={pokemon.sprites.other['official-artwork'].front_default}
                alt={"Pokemon:" + pokemon.name}
                width={400}
                height={400}
            />
            <div className='g-inline-block mt-2'>
              <div><strong>Types:</strong> {pokemon.types.map(type=>(
                type.type.name
              )).join(', ')}</div>
              <div><strong>Height</strong> {pokemon.height * 10} cm</div>
              <div><strong>Weight</strong> {pokemon.weight / 10} kg</div>

            </div>

            <Form onSubmit={handleSubmit} className='mt-4'>
              <Form.Group controlId='pokemon-nickname-input' className='mb-3'>
                <Form.Label>Give this Pokemon a nickname</Form.Label>
                <Form.Control name='nickname' placeholder='E.g Ferdinand'/>
              </Form.Group>
              <Button type='submit'>
                Set NickName For Some Time
              </Button>
            </Form>
          </>
        }
      </div>
    </>
  )
}

export default PokemonDetailsPage
