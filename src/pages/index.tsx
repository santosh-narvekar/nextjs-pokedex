import PokemonEntry from "@/components/PokemonEntry";
import { useRouter } from "next/router";
import useSWR from "swr";
import * as PokemonApi from '@/network/pokemon-api'
import { Button, Col, Row, Spinner } from "react-bootstrap";

export default function Home() {
  
  const router = useRouter();
  const page = parseInt(router.query.page?.toString() || '1');

  const {data,isLoading} = useSWR(['getPokemonPage',page],() => PokemonApi.getPokemonPage(page))


  if(isLoading) return <Spinner animation="border" className="d-block m-auto" />

  return (
     
      <div className={``} >
        <h1 className="text-center mb-4">Gotta cache &apos;em all</h1>
        
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {
            data?.results.map(pokemon=>(
              <Col key={pokemon.name}>
                <PokemonEntry name={pokemon.name} />
              </Col>
            ))
          }
        </Row>

        <div className="d-flex justify-content-center gap-2 mt-4">
          {
            data?.previous && <Button onClick={() => router.push({
              query: { ...router.query, page:page - 1}
            })}>Previous Page</Button>
          }

          {
            data?.next && <Button onClick={() => router.push({
              query: { ...router.query, page:page + 1}
            })}>Next Page</Button>
          }
          
        </div>


      </div>



  );
}
