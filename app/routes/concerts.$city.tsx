import { useParams } from "react-router"

export default function City() {

  const {city} = useParams()
  return (
    <div>
      <h1>{city}</h1>
    </div>
  )
}
