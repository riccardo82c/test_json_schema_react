import { Outlet } from "react-router"

export default function Concert() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
          </ul>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
